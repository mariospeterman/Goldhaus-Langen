import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TradingViewChart from './TradingViewChart.jsx';

const METALS = [
  {
    symbol: 'XAU',
    name: 'Gold',
    color: 'text-amber-400',
    tradingViewSymbol: 'FX_IDC:XAUEUR'
  },
  {
    symbol: 'XAG',
    name: 'Silber',
    color: 'text-gray-300',
    tradingViewSymbol: 'FX_IDC:XAGEUR'
  },
  {
    symbol: 'XPT',
    name: 'Platin',
    color: 'text-blue-300',
    tradingViewSymbol: 'FX_IDC:XPTEUR'
  }
];

const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2
};

const useAnimationLoop = (trackRef, targetVelocity, seqWidth) => {
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

      const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
      velocityRef.current += (targetVelocity - velocityRef.current) * easingFactor;

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
  }, [targetVelocity, seqWidth, trackRef]);
};

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

export const MetalPriceWidget = ({ onOpenChart }) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const seqRef = useRef(null);
  const [seqWidth, setSeqWidth] = useState(0);
  const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
  const speed = 80;
  const gap = 48;
  const itemHeight = 36;

  const targetVelocity = useMemo(() => {
    return Math.abs(speed);
  }, [speed]);

  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const sequenceWidth = seqRef.current?.getBoundingClientRect?.()?.width ?? 0;

    if (sequenceWidth > 0) {
      setSeqWidth(Math.ceil(sequenceWidth));
      const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
      setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
    }
  }, []);

  useResizeObserver(updateDimensions, [containerRef, seqRef], [METALS, gap, itemHeight]);

  useEffect(() => {
    if (METALS.length > 0) {
      setTimeout(updateDimensions, 100);
    }
  }, [updateDimensions]);

  useAnimationLoop(trackRef, targetVelocity, seqWidth);

  const renderMetalItem = useCallback(
    (metal, key) => {
      return (
        <li
          className="flex-none mr-[48px] flex items-center gap-3 text-[36px] leading-[1] whitespace-nowrap"
          key={key}
          role="listitem"
        >
          <div className="flex items-center gap-2.5 text-white">
            <span className={`font-semibold ${metal.color}`}>{metal.name}</span>
            <span className="text-white/60 text-sm">({metal.symbol})</span>
          </div>
        </li>
      );
    },
    []
  );

  const metalLists = useMemo(
    () =>
      Array.from({ length: copyCount }, (_, copyIndex) => (
        <ul
          className="flex items-center"
          key={`copy-${copyIndex}`}
          role="list"
          aria-hidden={copyIndex > 0}
          ref={copyIndex === 0 ? seqRef : undefined}
        >
          {METALS.map((metal, itemIndex) => renderMetalItem(metal, `${copyIndex}-${itemIndex}`))}
        </ul>
      )),
    [copyCount, renderMetalItem]
  );

  const handleOpenChart = (symbol, metalName) => {
    if (onOpenChart) {
      onOpenChart(symbol, metalName);
    }
  };

  return (
    <div className="relative">
      {/* Scrolling Metal Names Loop */}
      <div
        ref={containerRef}
        className="relative overflow-x-hidden"
        role="region"
        aria-label="Edelmetallpreise"
      >
        {/* Fade edges */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[clamp(24px,8%,120px)] bg-[linear-gradient(to_right,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0)_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-[clamp(24px,8%,120px)] bg-[linear-gradient(to_left,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0)_100%)]"
        />

        <div
          className="flex w-max will-change-transform select-none motion-reduce:transform-none"
          ref={trackRef}
        >
          {metalLists}
        </div>
      </div>

      {/* Live Price Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => handleOpenChart('XAU', 'Gold')}
          className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
        >
          Live Preise anzeigen
        </button>
      </div>
    </div>
  );
};

export default MetalPriceWidget;
