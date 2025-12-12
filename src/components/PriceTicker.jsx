import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';
import { CONFIG } from '../config.js';

const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2
};

const toCssLength = value => (typeof value === 'number' ? `${value}px` : (value ?? undefined));

const cx = (...parts) => parts.filter(Boolean).join(' ');

const useResizeObserver = (callback, elements, dependencies) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener('resize', handleResize);
      callback();
      return () => window.removeEventListener('resize', handleResize);
    }

    const observers = elements.map(ref => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(callback);
      observer.observe(ref.current);
      return observer;
    });

    callback();

    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

const useAnimationLoop = (trackRef, targetVelocity, seqWidth, isHovered, pauseOnHover) => {
  const rafRef = useRef(null);
  const lastTimestampRef = useRef(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (seqWidth > 0) {
      offsetRef.current = ((offsetRef.current % seqWidth) + seqWidth) % seqWidth;
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    if (prefersReduced) {
      track.style.transform = 'translate3d(0, 0, 0)';
      return () => {
        lastTimestampRef.current = null;
      };
    }

    const animate = timestamp => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      const target = pauseOnHover && isHovered ? 0 : targetVelocity;

      const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * easingFactor;

      if (seqWidth > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
        nextOffset = ((nextOffset % seqWidth) + seqWidth) % seqWidth;
        offsetRef.current = nextOffset;

        const translateX = -offsetRef.current;
        track.style.transform = `translate3d(${translateX}px, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimestampRef.current = null;
    };
  }, [targetVelocity, seqWidth, isHovered, pauseOnHover, trackRef]);
};

// Format price with currency symbol
const formatPrice = (price, currency = 'EUR') => {
  if (!price || isNaN(price)) return '—';
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

// Format change percentage
const formatChange = (change) => {
  // Allow 0, but reject null, undefined, and NaN
  if (change === null || change === undefined || (typeof change !== 'number') || isNaN(change)) {
    return '—';
  }
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
};

const CACHE_KEY = 'goldapi.prices.cache';
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24h

export const PriceTicker = memo(
  ({
    speed = 80,
    direction = 'left',
    width = '100%',
    itemHeight = 36,
    gap = 48,
    pauseOnHover = false,
    fadeOut = true,
    fadeOutColor = 'rgba(0,0,0,0.95)',
    ariaLabel = 'Live Edelmetallpreise',
    className,
    style,
    onOpenChart
  }) => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const seqRef = useRef(null);

    const [seqWidth, setSeqWidth] = useState(0);
    const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
    const [isHovered, setIsHovered] = useState(false);
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const lastPricesRef = useRef(null); // Store only real API data

    const targetVelocity = useMemo(() => {
      const magnitude = Math.abs(speed);
      const directionMultiplier = direction === 'left' ? 1 : -1;
      const speedMultiplier = speed < 0 ? -1 : 1;
      return magnitude * directionMultiplier * speedMultiplier;
    }, [speed, direction]);

    // If no API key is configured, render nothing
    // Check for empty string, null, undefined, or whitespace-only
    const hasValidApiKey = CONFIG.goldApiKey && 
                           CONFIG.goldApiKey.trim().length > 0 && 
                           CONFIG.goldApiKey !== 'YOUR_GOLDAPI_KEY' &&
                           CONFIG.goldApiKey !== 'your_goldapi_key_here';
    
    if (!hasValidApiKey) {
      if (import.meta.env.DEV) {
        console.warn('PriceTicker: No valid GoldAPI key found. Set VITE_GOLDAPI_KEY in your environment variables.');
      }
      return null;
    }

    // Fetch prices from GoldAPI.io (browser)
    useEffect(() => {
      const fetchPrices = async () => {
        try {
          setLoading(true);
          setError(null);

          const goldApiKey = CONFIG.goldApiKey?.trim();

          if (!goldApiKey || goldApiKey.length === 0 || 
              goldApiKey === 'YOUR_GOLDAPI_KEY' || 
              goldApiKey === 'your_goldapi_key_here') {
            // If no API key configured, do not render anything
            if (import.meta.env.DEV) {
              console.warn('PriceTicker: No valid GoldAPI key found. Set VITE_GOLDAPI_KEY in your environment variables.');
            }
            setPrices([]);
            setLoading(false);
            return;
          }
          
          // Log API key status (first few chars only for security)
          if (import.meta.env.DEV) {
            console.log(`PriceTicker: Using GoldAPI key: ${goldApiKey.substring(0, 10)}...`);
          }

          const metals = [
            { symbol: 'XAU', name: 'Gold', color: 'text-amber-400' },
            { symbol: 'XAG', name: 'Silber', color: 'text-gray-300' },
            { symbol: 'XPT', name: 'Platin', color: 'text-blue-300' }
          ];

        // Try cache first (limit calls to once per 24h)
        // Store old cache for percentage calculation even if we use it
        let oldCachedData = null;
        try {
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed?.timestamp && Date.now() - parsed.timestamp < CACHE_MAX_AGE_MS && Array.isArray(parsed.data) && parsed.data.length) {
              // Cache is fresh - use it, but also store for potential percentage calculation
              lastPricesRef.current = parsed.data;
              setPrices(parsed.data);
              setLoading(false);
              return; // Use cached data, no API call needed
            } else if (parsed?.data && Array.isArray(parsed.data)) {
              // Cache is expired but exists - store it for percentage comparison with new prices
              oldCachedData = parsed.data;
            }
          }
        } catch (_) {
          // Ignore cache errors
        }

          // Fetch metals sequentially to respect 5 reqs/sec rate limit
          // Add 250ms delay between requests (4 reqs/sec max, well under limit)
          const REQUEST_DELAY_MS = 250;
          
          const fetchMetal = async ({ symbol, name, color }, retryCount = 0) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            const url = `https://www.goldapi.io/api/${symbol}/EUR`;

            try {
              const response = await fetch(url, {
                method: 'GET',
                headers: {
                  'x-access-token': goldApiKey,
                  'Content-Type': 'application/json'
                },
                signal: controller.signal
              });

              clearTimeout(timeoutId);

              if (!response.ok) {
                const errorText = await response.text();
                let errorData;
                try {
                  errorData = JSON.parse(errorText);
                } catch {
                  errorData = { error: errorText };
                }

                // Handle 429 (rate limit) with retry
                if (response.status === 429 && retryCount < 3) {
                  const retryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
                  console.warn(`Rate limited for ${symbol}, retrying in ${retryDelay}ms (attempt ${retryCount + 1}/3)`);
                  await new Promise(resolve => setTimeout(resolve, retryDelay));
                  return fetchMetal({ symbol, name, color }, retryCount + 1);
                }

                console.error(`GoldAPI error for ${symbol}:`, response.status, errorData);
                
                // If quota exceeded or forbidden, try to use cached data
                if (response.status === 403 || response.status === 429) {
                  // First try lastPricesRef (in-memory cache)
                  const lastPrice = lastPricesRef.current?.find(p => p.symbol === symbol);
                  if (lastPrice) {
                    console.warn(`Using in-memory cached price for ${symbol} due to API limit (${response.status})`);
                    return lastPrice;
                  }
                  
                  // Then try localStorage cache
                  try {
                    const cached = localStorage.getItem(CACHE_KEY);
                    if (cached) {
                      const parsed = JSON.parse(cached);
                      if (parsed?.data && Array.isArray(parsed.data)) {
                        const cachedPrice = parsed.data.find(p => p.symbol === symbol);
                        if (cachedPrice && cachedPrice.price > 0) {
                          console.warn(`Using localStorage cached price for ${symbol} due to API limit (${response.status})`);
                          return cachedPrice;
                        }
                      }
                    }
                  } catch (e) {
                    // Ignore cache read errors
                  }
                  
                  // If no cache available, return null (will be handled by caller)
                  console.error(`No cached data available for ${symbol} and API returned ${response.status}`);
                  return null;
                }
                throw new Error(`GoldAPI error ${response.status}`);
              }

              const data = await response.json();

              let currentPrice = data.price || (data.price_gram_24k ? data.price_gram_24k * 31.1035 : 0);
              if (!currentPrice || currentPrice === 0 || isNaN(currentPrice)) {
                throw new Error(`Invalid price for ${symbol}`);
              }

              // GoldAPI.io does NOT provide percentage change - we calculate it from cached 24h price
              // Only show percentage if we have real data (comparing with 24h old cached price)
              let changePercent = null;
              
              // Try to get change from API response first (in case they add it in future)
              if (data.change_percent !== null && data.change_percent !== undefined) {
                const parsed = Number(data.change_percent);
                if (!isNaN(parsed) && parsed !== 0) {
                  changePercent = parsed;
                }
              }
              
              // Calculate real 24h change by comparing with old cached price (from 24h ago)
              // This gives us REAL percentage data without additional API calls
              if (changePercent === null) {
                // Use the old cached data we stored earlier (from expired cache)
                // or try to get it from localStorage if not already stored
                let previousPriceData = oldCachedData;
                
                if (!previousPriceData) {
                  try {
                    const cached = localStorage.getItem(CACHE_KEY);
                    if (cached) {
                      const parsed = JSON.parse(cached);
                      // Only use cache if it's expired (24h+ old) for real comparison
                      const cacheAge = Date.now() - (parsed?.timestamp || 0);
                      const isOldCache = cacheAge >= CACHE_MAX_AGE_MS; // 24 hours or older
                      
                      if (parsed?.data && Array.isArray(parsed.data) && isOldCache) {
                        previousPriceData = parsed.data;
                      }
                    }
                  } catch (e) {
                    // Ignore cache read errors
                  }
                }
                
                if (previousPriceData && Array.isArray(previousPriceData)) {
                  const cachedPrice = previousPriceData.find(p => p.symbol === symbol);
                  
                  if (cachedPrice && cachedPrice.price > 0) {
                    // Calculate real 24h percentage change
                    const priceDiff = Math.abs(currentPrice - cachedPrice.price);
                    const minChange = cachedPrice.price * 0.0001; // 0.01% minimum change
                    
                    if (priceDiff > minChange) {
                      const calculated = ((currentPrice - cachedPrice.price) / cachedPrice.price) * 100;
                      if (!isNaN(calculated) && isFinite(calculated)) {
                        changePercent = calculated;
                        if (import.meta.env.DEV) {
                          console.log(`${symbol}: Real 24h change: ${cachedPrice.price.toFixed(2)} → ${currentPrice.toFixed(2)} = ${calculated.toFixed(2)}%`);
                        }
                      }
                    } else {
                      // Prices are essentially the same, show "—"
                      if (import.meta.env.DEV) {
                        console.log(`${symbol}: No significant 24h change (diff: ${priceDiff.toFixed(4)})`);
                      }
                    }
                  } else {
                    if (import.meta.env.DEV) {
                      console.log(`${symbol}: No cached price found for comparison`);
                    }
                  }
                } else {
                  // No old cache available - first load or cache was cleared
                  if (import.meta.env.DEV) {
                    console.log(`${symbol}: No previous price data available for 24h comparison`);
                  }
                }
              }
              
              // If change is exactly 0 or very close to 0, set to null to show "—"
              if (changePercent !== null && Math.abs(changePercent) < 0.01) {
                changePercent = null;
              }

              return {
                name,
                symbol,
                price: currentPrice,
                change: changePercent,
                unit: 'oz',
                color
              };
            } catch (err) {
              console.error(`Error fetching ${symbol}:`, err);
              const lastPrice = lastPricesRef.current?.find(p => p.symbol === symbol);
              return lastPrice || null;
            }
          };

          // Fetch metals sequentially with delays to respect rate limits
          const results = [];
          for (let i = 0; i < metals.length; i++) {
            const metal = metals[i];
            const result = await fetchMetal(metal);
            if (result) {
              results.push(result);
            }
            
            // Add delay between requests (except for the last one)
            if (i < metals.length - 1) {
              await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY_MS));
            }
          }
          const validPrices = results.filter(p => p && p.price > 0);

          if (validPrices.length === 0) {
            // Try to use cached data from localStorage as last resort
            try {
              const cached = localStorage.getItem(CACHE_KEY);
              if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed?.data && Array.isArray(parsed.data) && parsed.data.length > 0) {
                  const cachedPrices = parsed.data.filter(p => p && p.price > 0);
                  if (cachedPrices.length > 0) {
                    console.warn('Using cached prices from localStorage due to API errors');
                    lastPricesRef.current = cachedPrices;
                    setPrices(cachedPrices);
                    setLoading(false);
                    return;
                  }
                }
              }
            } catch (e) {
              // Ignore cache errors
            }
            
            throw new Error('Keine Preisdaten von GoldAPI verfügbar. Bitte überprüfen Sie den API-Schlüssel in den Vercel-Umgebungsvariablen.');
          }

          lastPricesRef.current = validPrices;
          setPrices(validPrices);

          // Cache the successful response
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: validPrices }));
          } catch (_) {
            // ignore caching failures
          }
        } catch (err) {
          console.error('Error fetching metal prices:', err);
          setError(err.message);
          
          // Fallback: Use last known REAL prices if available (from previous successful API calls)
          if (lastPricesRef.current && lastPricesRef.current.length > 0) {
            console.warn('Using last real cached prices due to API error');
            setPrices(lastPricesRef.current);
            setLoading(false);
            return;
          }

          // If no cached real prices exist, show error (no mock data)
          console.error('No real price data available');
          
          // Provide helpful error message based on the error
          let errorMessage = 'Preise konnten nicht geladen werden. Bitte versuchen Sie es später erneut.';
          if (err.message && err.message.includes('403')) {
            errorMessage = 'API-Schlüssel ungültig oder Kontingent erschöpft. Bitte überprüfen Sie VITE_GOLDAPI_KEY in Vercel.';
          } else if (err.message && err.message.includes('Kontingent')) {
            errorMessage = 'API-Kontingent erschöpft. Bitte versuchen Sie es später erneut oder überprüfen Sie Ihren API-Plan.';
          }
          
          setError(errorMessage);
          setPrices([]);
        } finally {
          setLoading(false);
        }
      };

      fetchPrices();
      
      // Update prices 1 time per day (every 24 hours) to stay within 100 calls/month
      // 3 metals × 1 refresh/day × ~30 days = ~90 calls/month
      const ONE_DAY = 24 * 60 * 60 * 1000;
      const interval = setInterval(fetchPrices, ONE_DAY);
      
      return () => clearInterval(interval);
    }, []);

    const updateDimensions = useCallback(() => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;
      const sequenceWidth = seqRef.current?.getBoundingClientRect?.()?.width ?? 0;

      if (sequenceWidth > 0) {
        setSeqWidth(Math.ceil(sequenceWidth));
        const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
      }
    }, []);

    useResizeObserver(updateDimensions, [containerRef, seqRef], [prices, gap, itemHeight]);

    useEffect(() => {
      if (prices.length > 0) {
        // Small delay to ensure DOM is ready
        setTimeout(updateDimensions, 100);
      }
    }, [prices, updateDimensions]);

    useAnimationLoop(trackRef, targetVelocity, seqWidth, isHovered, pauseOnHover);

    const cssVariables = useMemo(
      () => ({
        '--priceticker-gap': `${gap}px`,
        '--priceticker-itemHeight': `${itemHeight}px`,
        ...(fadeOutColor && { '--priceticker-fadeColor': fadeOutColor })
      }),
      [gap, itemHeight, fadeOutColor]
    );

    const rootClasses = useMemo(
      () =>
        cx(
          'relative overflow-x-hidden group',
          '[--priceticker-gap:48px]',
          '[--priceticker-itemHeight:36px]',
          '[--priceticker-fadeColorAuto:#ffffff]',
          'dark:[--priceticker-fadeColorAuto:#0b0b0b]',
          className
        ),
      [className]
    );

    const handleMouseEnter = useCallback(() => {
      if (pauseOnHover) setIsHovered(true);
    }, [pauseOnHover]);

    const handleMouseLeave = useCallback(() => {
      if (pauseOnHover) setIsHovered(false);
    }, [pauseOnHover]);

    const renderPriceItem = useCallback(
      (item, key) => {
        const isPositive = item.change >= 0;
        const changeColor = isPositive ? 'text-emerald-400' : 'text-red-400';

        return (
          <li
            className={cx(
              'flex-none mr-[var(--priceticker-gap)] flex items-center gap-3',
              'text-[length:var(--priceticker-itemHeight)] leading-[1]',
              'whitespace-nowrap'
            )}
            key={key}
            role="listitem"
          >
            <div className="flex items-center gap-2.5 text-white">
              <span className={cx('font-semibold', item.color)}>{item.name}</span>
              <span className="text-white/60 text-sm">({item.symbol})</span>
              
              {/* Daily Price Badge */}
              <span className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-white/70 whitespace-nowrap">
                Tagespreis
              </span>
              
              <span className="font-bold text-white">{formatPrice(item.price)}</span>
              <span className="text-white/40">/</span>
              <span className="text-white/60 text-sm">{item.unit}</span>
              
              {/* Percentage with proper formatting */}
              <span className={cx('text-sm font-medium', changeColor)}>
                {formatChange(item.change)}
              </span>
              
            </div>
          </li>
        );
      },
      []
    );

    const priceLists = useMemo(
      () =>
        Array.from({ length: copyCount }, (_, copyIndex) => (
          <ul
            className="flex items-center"
            key={`copy-${copyIndex}`}
            role="list"
            aria-hidden={copyIndex > 0}
            ref={copyIndex === 0 ? seqRef : undefined}
          >
            {prices.map((item, itemIndex) => renderPriceItem(item, `${copyIndex}-${itemIndex}`))}
          </ul>
        )),
      [copyCount, prices, renderPriceItem]
    );

    const containerStyle = useMemo(
      () => ({
        width: toCssLength(width) ?? '100%',
        ...cssVariables,
        ...style
      }),
      [width, cssVariables, style]
    );

    // Show loading state while fetching real data
    if (loading && prices.length === 0) {
      return (
        <div className={rootClasses} style={containerStyle}>
          <div className="flex items-center justify-center py-4 text-white/60">
            Lade Echtzeit-Preise...
          </div>
        </div>
      );
    }

    // Show error if no real data available (no mock data)
    if (prices.length === 0) {
      return (
        <div className={rootClasses} style={containerStyle}>
          <div className="flex items-center justify-center py-4 text-white/60">
            {error || 'Preise werden geladen...'}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        className={rootClasses}
        style={containerStyle}
        role="region"
        aria-label={ariaLabel}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {fadeOut && (
          <>
            <div
              aria-hidden
              className={cx(
                'pointer-events-none absolute inset-y-0 left-0 z-[1]',
                'w-[clamp(24px,8%,120px)]',
                'bg-[linear-gradient(to_right,var(--priceticker-fadeColor,var(--priceticker-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]'
              )}
            />
            <div
              aria-hidden
              className={cx(
                'pointer-events-none absolute inset-y-0 right-0 z-[1]',
                'w-[clamp(24px,8%,120px)]',
                'bg-[linear-gradient(to_left,var(--priceticker-fadeColor,var(--priceticker-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]'
              )}
            />
          </>
        )}

        <div
          className={cx('flex w-max will-change-transform select-none', 'motion-reduce:transform-none')}
          ref={trackRef}
        >
          {priceLists}
        </div>
        
        {/* Link to real-time market data - discrete button below price loop */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => {
              if (onOpenChart && prices.length > 0) {
                // Open chart for the first metal (Gold) by default, or allow selection
                const defaultMetal = prices[0];
                onOpenChart(defaultMetal.symbol, defaultMetal.name);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/60 hover:text-amber-400 text-xs transition-all cursor-pointer"
            title="Echtzeitpreise anzeigen"
            aria-label="Echtzeitpreise anzeigen"
          >
            <span className="text-sm">📈</span>
            <span>Live Preise</span>
          </button>
        </div>
      </div>
    );
  }
);

PriceTicker.displayName = 'PriceTicker';

export default PriceTicker;

