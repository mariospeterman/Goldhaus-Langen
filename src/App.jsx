// App.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Instagram, MessageCircle, Send, X } from 'lucide-react';

import CardNav from './components/CardNav.jsx';
import CircularText from './components/CircleText.jsx';
import ServiceCard from './components/ServiceCard.jsx';
import MapComponent from './components/MapComponent.jsx';
import GlassSurface from './components/GlassSurface.jsx';
import DomeGallery from './components/DomGallery.jsx';
import MetalPriceWidget from './components/MetalPriceWidget.jsx';
import TradingViewChart from './components/TradingViewChart.jsx';
import { CONFIG } from './config.js';

/**
 * Full, improved App.jsx
 *
 * Notes:
 * - Keeps your component structure but fixes header/hero stacking, responsiveness, and UX issues.
 * - Preserves most of your original markup and textual content.
 * - Header height is measured at runtime and used to set main padding to avoid layout jumps.
 */

/* ====== Configuration / static images ====== */
const HERO_IMAGES = [
  '/gallery/118378-1920w.webp',
  '/gallery/10823-1920w.webp',
  '/gallery/jewels-396441_1920-1920w.webp',
  '/gallery/pexels-enginakyurt-1458867-1920w.webp',
  '/gallery/pexels-frjuniorx-6795489-1920w.webp'
];

const HERO_VIDEOS = [
  '/video/4974440-uhd_4096_2160_25fps.mp4',
  '/video/1562544-sd_568_320_30fps.mp4'
];

const FALLBACK_GALLERY = HERO_IMAGES;

const SERVICES = [
    {
      title: 'Goldankauf',
      description: 'Verkaufen Sie Altgold, Zahngold oder Schmuck zu tagesaktuellen Höchstpreisen – transparent, fair und sofort in bar.',
      highlights: ['Direkte Bewertung vor Ort', 'Faire Tagespreise', 'Sofortige Barauszahlung'],
      image: '/gallery/pexels-zlataky-cz-61823415-8442322-1920w.webp',
      accent: '#C6A664' // warm gold – luxury, trust, prosperity
    },
    {
      title: 'Luxusuhren',
      description: 'Wir kaufen Luxusuhren wie Rolex, Omega oder Breitling zum marktgerechten Preis – diskret und professionell.',
      highlights: ['Echtheitszertifizierte Bewertung', 'Marktgerechte Konditionen', 'Diskrete Abwicklung'],
      image: '/gallery/pexels-frjuniorx-6795489-1920w.webp',
      accent: '#B8860B' // deep antique gold – premium & timeless
    },
    {
      title: 'Münzen & Sammlungen',
      description: 'Ob Münzen, Medaillen oder Briefmarken – wir schätzen den Sammlerwert mit numismatischer Expertise.',
      highlights: ['Fachkundige Bewertung', 'Sammlerwert erkennen', 'Schnelle Auszahlung'],
      image: '/gallery/10823-1920w.webp',
      accent: '#6C8EAD' // muted blue – trust, knowledge, professionalism
    },
    {
      title: 'Haushaltsauflösungen',
      description: 'Zuverlässige und faire Haushaltsauflösungen – wir sichern wertvolle Stücke und übernehmen den kompletten Service.',
      highlights: ['Komplettservice aus einer Hand', 'Faire Wertermittlung', 'Schnelle Umsetzung'],
      image: '/gallery/pexels-john-289283-2922718-1920w.webp',
      accent: '#5C8571' // soft jade green – calm, reliability, renewal
    },
    {
      title: 'XENOX Schmuck',
      description: 'Entdecken Sie exklusive XENOX Schmuckstücke – modernes Design trifft auf höchste Handwerkskunst.',
      highlights: ['Zeitlose Eleganz', 'Feinste Materialien', 'Exklusive Kollektionen'],
      image: '/gallery/123344-fdf836e7-1920w.webp',
      accent: '#B7A3D0' // soft lavender-gold blend – elegance, sophistication
    },
    {
      title: 'Kostenlose Bewertung',
      description: 'Lassen Sie Ihre Wertgegenstände kostenlos und unverbindlich schätzen – persönlich und transparent.',
      highlights: ['Unverbindlich & kostenlos', 'Individuelle Beratung', 'Sofortige Einschätzung'],
      image: '/gallery/118378-1920w.webp',
      accent: '#A67C00' // classic amber-gold – warmth, credibility
    }
];


export default function App() {

  /* ====== State ====== */
  const [images, setImages] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);
  // Set to true if you want the hero to play videos instead of images
  const [heroIsVideo] = useState(true);
  const [current, setCurrent] = useState(0);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('Rechtliches');
  const [modalReactContent, setModalReactContent] = useState(null);

  const xenoxImages = useMemo(() => {
    const source = images.length ? images : FALLBACK_GALLERY;
    const normalized = source
      .map((item, idx) => {
        if (typeof item === 'string') {
          return { src: item, alt: `XENOX Schmuck ${idx + 1}` };
        }
        if (item && typeof item === 'object') {
          return {
            src: item.url || item.src || '',
            alt: item.caption || item.alt || `XENOX Schmuck ${idx + 1}`
          };
        }
        return null;
      })
      .filter((img) => img && img.src);

    // Shuffle images for variety - fresh experience each new session
    // SessionStorage persists the shuffle during the same visit, resets on new session
    if (normalized.length <= 1) return normalized;
    
    const shuffleKey = 'xenox_gallery_order';
    let shuffled = normalized;
    
    try {
      const stored = sessionStorage.getItem(shuffleKey);
      if (stored) {
        try {
          const order = JSON.parse(stored);
          if (Array.isArray(order) && order.length === normalized.length) {
            // Reconstruct shuffled array from stored indices
            shuffled = order.map((idx) => normalized[idx]).filter(Boolean);
            if (shuffled.length !== normalized.length) {
              // If mismatch, create new shuffle
              shuffled = [...normalized];
              for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
              }
              const newOrder = shuffled.map((img) => normalized.findIndex((n) => n.src === img.src));
              sessionStorage.setItem(shuffleKey, JSON.stringify(newOrder));
            }
          } else {
            // Invalid stored data, create new shuffle
            shuffled = [...normalized];
            for (let i = shuffled.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            const newOrder = shuffled.map((img) => normalized.findIndex((n) => n.src === img.src));
            sessionStorage.setItem(shuffleKey, JSON.stringify(newOrder));
          }
        } catch (_) {
          // Parse error, create new shuffle
          shuffled = [...normalized];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          const newOrder = shuffled.map((img) => normalized.findIndex((n) => n.src === img.src));
          sessionStorage.setItem(shuffleKey, JSON.stringify(newOrder));
        }
      } else {
        // First visit - create new shuffle
        shuffled = [...normalized];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        const order = shuffled.map((img) => normalized.findIndex((n) => n.src === img.src));
        sessionStorage.setItem(shuffleKey, JSON.stringify(order));
      }
    } catch (_) {
      // sessionStorage unavailable - shuffle anyway without persistence
      shuffled = [...normalized];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
    }

    return shuffled;
  }, [images]);

  // Header measurement removed - hero goes to very top

  /* ==== Scroll to top when app mounts ==== */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* ==== Load insta.json (static) with fallback ==== */
  useEffect(() => {
    let cancelled = false;
    const loadInstagramData = async () => {
      try {
        const resp = await fetch(`/insta.json?cache=${Date.now()}`);
        if (!resp.ok) throw new Error('no insta.json');
        const data = await resp.json();
        if (!cancelled) setImages(Array.isArray(data) && data.length ? data : FALLBACK_GALLERY);
      } catch (err) {
        // fallback to static gallery images
        if (!cancelled) setImages(FALLBACK_GALLERY);
        // eslint-disable-next-line no-console
        console.warn('Could not load insta.json — using fallback images', err);
      }
    };
    loadInstagramData();
    return () => { cancelled = true; };
  }, []);

  /* ==== Hero background rotation ==== */
  // Currently set to IMAGES ONLY (heroIsVideo = false)
  // To switch to videos only, change heroIsVideo to true above
  useEffect(() => {
    if (heroIsVideo && HERO_VIDEOS.length) {
      // Video rotation: 8-10 seconds per video
      const duration = 8000 + Math.random() * 2000;
      const timeout = setTimeout(() => {
        setHeroIndex((prev) => (prev + 1) % HERO_VIDEOS.length || 0);
      }, duration);
      return () => clearTimeout(timeout);
    }

    // Image rotation: 5 seconds per image
    if (!HERO_IMAGES.length) return undefined;
    const timeout = setTimeout(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length || 0);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [heroIndex, heroIsVideo]);

  /* ==== Mobile instagram rotation ==== */
  useEffect(() => {
    if (!xenoxImages || xenoxImages.length <= 1) return;
    const id = setInterval(() => setCurrent((p) => (p + 1) % xenoxImages.length), 4000);
    return () => clearInterval(id);
  }, [xenoxImages]);

  useEffect(() => {
    setCurrent(0);
  }, [xenoxImages]);

  /* ==== Cookies persisted ==== */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('goldhaus.cookiesAccepted');
      setCookiesAccepted(saved === 'true');
    } catch (_) {
      setCookiesAccepted(false);
    }
  }, []);


  const acceptCookies = () => {
    try {
      localStorage.setItem('goldhaus.cookiesAccepted', 'true');
    } catch (_) { /* ignore */ }
    setCookiesAccepted(true);
  };

  /* ==== Trustpilot Widget Reinitialization ==== */
  useEffect(() => {
    // Reinitialize Trustpilot widgets after React renders
    const reinitializeTrustpilot = () => {
      if (window.Trustpilot) {
        // Method 1: Try loadFromElement if available
        if (window.Trustpilot.loadFromElement) {
          const widgets = document.querySelectorAll('.trustpilot-widget');
          widgets.forEach((widget) => {
            try {
              window.Trustpilot.loadFromElement(widget, true);
            } catch (err) {
              // Ignore errors
            }
          });
        }
        
        // Method 2: Try loadTrustBoxes if available
        if (window.Trustpilot.loadTrustBoxes) {
          try {
            window.Trustpilot.loadTrustBoxes();
          } catch (err) {
            // Ignore errors
          }
        }
      }
    };

    // Initial load after a delay to ensure DOM is ready
    const timer1 = setTimeout(reinitializeTrustpilot, 1000);
    const timer2 = setTimeout(reinitializeTrustpilot, 2500);

    // Also reinitialize when Trustpilot script loads
    if (window.Trustpilot) {
      reinitializeTrustpilot();
    } else {
      const checkTrustpilot = setInterval(() => {
        if (window.Trustpilot) {
          reinitializeTrustpilot();
          clearInterval(checkTrustpilot);
        }
      }, 200);

      // Cleanup after 15 seconds if Trustpilot doesn't load
      setTimeout(() => clearInterval(checkTrustpilot), 15000);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  /* ==== Modal escape key handler and focus management ==== */
  useEffect(() => {
    if (!modalContent) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setModalContent(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalContent]);

  /* ==== Modal loader for static pages (impressum/datenschutz/agb) ==== */
  const openModal = async (type, title = 'Rechtliches') => {
    try {
      const r = await fetch(`/${type}.html`);
      if (!r.ok) throw new Error('missing page');
      const html = await r.text();
      setModalTitle(title);
      setModalContent(html);
      // small delay to ensure layout, then focus (simple focus management)
      setTimeout(() => {
        const el = document.getElementById('modal-dialog');
        if (el) el.focus();
      }, 150);
    } catch (err) {
      // fallback message
      setModalTitle(title);
      setModalContent('<p class="text-red-600">Seite konnte nicht geladen werden.</p>');
      // eslint-disable-next-line no-console
      console.error('openModal error', err);
    }
  };

  const closeModal = () => {
    setModalContent(null);
    setModalReactContent(null);
  };

  /* ==== Form submit via Formspree ==== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    try {
      const formData = new FormData(e.target);
      const response = await fetch('https://formspree.io/f/xgvgrykv', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setFormStatus({ type: 'success', message: 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.' });
        e.target.reset();
      } else {
        const data = await response.json();
        if (data.errors) {
          setFormStatus({ type: 'error', message: data.errors.map(error => error.message).join(', ') });
        } else {
          setFormStatus({ type: 'error', message: 'Senden fehlgeschlagen. Bitte versuchen Sie es erneut oder kontaktieren Sie uns telefonisch.' });
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Form submission error', err);
      setFormStatus({ type: 'error', message: 'Senden fehlgeschlagen. Bitte versuchen Sie es erneut oder kontaktieren Sie uns telefonisch.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ==== Image onError fallback helper ==== */
  const handleImgError = (e, index = 0) => {
    try {
      if (!e?.target?.dataset?.fallback) {
        e.target.dataset.fallback = '1';
        e.target.src = FALLBACK_GALLERY[index % FALLBACK_GALLERY.length];
      }
    } catch (_) { /* ignore */ }
  };

  /* ===== Render ===== */
  return (
    <div className="font-serif text-gray-900 relative bg-black selection:bg-amber-200/40 min-h-screen">
      {/* ========== Header (sticky) ========== */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
        role="banner"
        aria-hidden="false"
      >
        <div className="w-full max-w-7xl px-4 pt-6 md:pt-8 pointer-events-auto">
          <CardNav />
        </div>
      </header>

      {/* Main content - no padding to allow hero at very top */}
      <main className="relative">
        {/* Floating Circular Badge (desktop) */}
        <div className="fixed bottom-8 right-8 z-40 hidden md:block">
        <CircularText
          text="GOLDHAUS • LANGEN • DEIN •"
          onHover="speedUp"
          spinDuration={35}
          className="w-[100px] h-[100px] drop-shadow-lg"
          />
      </div>

        {/* ========== Hero ========== */}
        <section
          id="hero"
          className="relative h-screen w-full overflow-hidden flex items-center justify-center"
          aria-label="Hero Bereich"
        >
          {/* Background images (absolute) */}
          <div className="absolute inset-0">
          <AnimatePresence mode="wait">
              {heroIsVideo && HERO_VIDEOS.length ? (
                <motion.video
                  key={`video-${heroIndex}`}
                  src={HERO_VIDEOS[heroIndex % HERO_VIDEOS.length]}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  aria-hidden="true"
                />
              ) : (
                <motion.img
                  key={`image-${heroIndex}`}
                  src={HERO_IMAGES[heroIndex % HERO_IMAGES.length]}
                  alt={`Schaufenster ${heroIndex + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  onError={(e) => handleImgError(e, heroIndex)}
                  loading="eager"
                  aria-hidden="true"
                />
              )}
          </AnimatePresence>

            {/* Slight dark gradient to ensure hero text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/65 to-transparent pointer-events-none" />
        </div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-5xl px-6 text-center">
          <motion.h1
              initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4"
          >
            Ihr Wert. <span className="text-amber-400">Unser Versprechen.</span>
          </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-lg md:text-2xl text-white mb-6"
            >
            Sofortige Auszahlung - fair, transparent & sicher.
          </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href={`tel:${CONFIG.phone}`}
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 px-6 py-3 rounded-full font-semibold shadow-lg transition"
                aria-label="Jetzt anrufen"
            >
              <Phone className="w-5 h-5" /> Jetzt bewerten lassen
            </a>

            <a
              href="#services"
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white/90 px-6 py-3 rounded-full font-semibold hover:bg-white/10 transition"
                aria-label="Zu unseren Leistungen"
            >
              Unsere Leistungen
            </a>
          </motion.div>
        </div>
      </section>

        {/* ========== Live Precious Metals Prices ========== */}
        <section className="py-16 px-6 bg-black">
          <div className="max-w-7xl mx-auto">
            <MetalPriceWidget
              onOpenChart={(symbol, metalName) => {
                setModalTitle(`${metalName} - Echtzeitpreise`);
                setModalReactContent(<TradingViewChart symbol={symbol} metalName={metalName} />);
              }}
            />
          </div>
        </section>

        {/* ========== About ========== */}
        <section id="about" className="py-20 text-center px-6 max-w-5xl mx-auto text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-amber-400">Warum Goldhaus Langen?</h2>
          <p className="text-xl mb-4">Schnell. Fair. Transparent.</p>
          <p className="text-lg text-white/85 leading-relaxed">
          Ob Gold, Silber oder Luxusuhren - bei uns erhalten Sie eine ehrliche Bewertung und sofortige Auszahlung.
          Wir stehen für Vertrauen, Erfahrung und persönliche Beratung in Langen.
        </p>
      </section>

        {/* ========== Social Proof ========== */}
        <section className="px-6 pb-20">
          <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-[1.05fr_1fr]">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-white backdrop-blur-xl relative overflow-hidden">
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-amber-500/20 blur-3xl" />
              
              {/* Trustpilot Branding and Rating Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                  <span className="text-white font-semibold text-lg">Trustpilot</span>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {/* Trustpilot-style square star blocks - 4 full + 1 partial (4.8/5) */}
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-5 h-5 bg-emerald-400 rounded-sm flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-white fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      </div>
                    ))}
                    {/* Partially filled last star (80% filled) */}
                    <div className="w-5 h-5 rounded-sm flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gray-300" />
                      <div className="absolute inset-0 bg-emerald-400" style={{ width: '80%' }} />
                      <svg className="w-3.5 h-3.5 text-white fill-current relative z-10" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Customer Testimonial */}
              <div className="mb-6">
                <p className="text-white text-xl font-bold leading-relaxed mb-4">
                  "Sehr freundlicher Service und faire Preise. Ich habe mich jederzeit gut beraten und sicher gefühlt."
                </p>
                <p className="text-white/80 text-sm">— Mario P.</p>
              </div>
              
              {/* Official Trustpilot Review Collector Widget */}
              <div className="trustpilot-widget mb-4" 
                data-locale="de-DE" 
                data-template-id="56278e9abfbbba0bdcd568bc" 
                data-businessunit-id="693b0b07f444175f889945a2" 
                data-style-height="52px" 
                data-style-width="100%" 
                data-token="006e372a-86f3-4157-ab04-dd52f8091d8b">
                <a href="https://de.trustpilot.com/review/goldhaus-langen.de" target="_blank" rel="noopener">Trustpilot</a>
              </div>
              
              {/* Trust Indicators - Small, below button */}
              <div className="flex items-center gap-4 text-xs text-white/70">
                
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-3xl p-8">
              <h3 className="text-gray-900 text-xl font-bold mb-4">Warum Kunden uns vertrauen</h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-amber-500 mt-1">•</span>
                  Transparente, tagesaktuelle Ankaufspreise mit Sofortauszahlung.
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-500 mt-1">•</span>
                  Professionelle Wertermittlung mit über 15 Jahren Erfahrung.
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-500 mt-1">•</span>
                  Diskrete Beratung in modernen, gesicherten Räumen im Herzen von Langen.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ========== Services ========== */}
      <section id="services" className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
            Ver/kaufen Sie mit Vertrauen.
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg max-w-2xl mx-auto">
            Unsere Experten bewerten Ihre Wertgegenstände diskret, fair und transparent – immer zum Tageshöchstpreis.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {SERVICES.map((service) => (
                <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

        {/* ========== Instagram / Gallery ========== */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-center text-amber-400">Unser Xenox Schmuck</h2>
          <p className="text-center text-gray-600 mb-12 text-lg max-w-2xl mx-auto">
            Entdecken Sie exklusive Produkte.
          </p>
          
          <div className="hidden md:block h-[620px]">
            <DomeGallery
              key={xenoxImages.map((img) => img.src).join('|')}
              images={xenoxImages}
              fit={0.8}
              minRadius={600}
              maxVerticalRotationDeg={0}
              segments={34}
              dragDampening={2}
              dragSensitivity={18}
              grayscale={false}
              overlayBlurColor="rgba(7,6,20,0.75)"
            />
          </div>
          
          <div className="md:hidden">
            <div className="relative aspect-square rounded-[30px] overflow-hidden shadow-2xl">
              {xenoxImages.map((img, i) => (
                <motion.img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: i === current ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

        {/* ========== Contact ========== */}
      <section id="contact" className="py-20 bg-gray-100 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <MapComponent />
          </div>

          {/* Contact Form */}
          <div className="p-8 bg-white rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold mb-2">Nachricht senden</h3>
            <p className="text-gray-600 mb-6">Wir antworten werktags innerhalb von 24 Stunden.</p>

              <form onSubmit={handleSubmit} action="https://formspree.io/f/xgvgrykv" method="POST" aria-describedby="form-status">
              {formStatus.message && (
                  <div id="form-status" className={`mb-4 p-3 rounded ${formStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {formStatus.message}
                </div>
              )}

                <label className="sr-only" htmlFor="name">Ihr Name</label>
                <input id="name" name="name" type="text" placeholder="Ihr Name" required className="w-full border-b mb-4 p-3 focus:border-amber-600 outline-none" />

                <label className="sr-only" htmlFor="email">Ihre E-Mail</label>
                <input id="email" name="email" type="email" placeholder="Ihre E-Mail" required className="w-full border-b mb-4 p-3 focus:border-amber-600 outline-none" />

                <label className="sr-only" htmlFor="message">Ihre Nachricht</label>
                <textarea id="message" name="message" rows="5" placeholder="Ihre Nachricht..." required className="w-full border-b mb-6 p-3 focus:border-amber-600 outline-none" />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-400 text-gray-900 py-3 rounded-full font-semibold hover:bg-amber-500 transition flex items-center justify-center gap-2"
                  aria-live="polite"
                >
                {isSubmitting ? 'Wird gesendet…' : 'Anfrage senden'}
                <Send className="w-5 h-5" />
                </button>
          </form>
          </div>
        </div>
      </section>

        {/* ========== Footer ========== */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-3">Goldhaus Langen</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Ihr vertrauensvoller Partner für faire Bewertungen und sofortige Auszahlung von Wertgegenständen in Langen.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Kontakt</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> 
                  <a href={`tel:${CONFIG.phone.replace(/\s/g, '')}`} className="hover:text-amber-400 transition">
                    {CONFIG.phone}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> 
                  <a href={`https://wa.me/${CONFIG.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition">
                    {CONFIG.whatsapp}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> 
                  <a href={`mailto:${CONFIG.email}`} className="hover:text-amber-400 transition">
                    {CONFIG.email}
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Rechtliches</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                  <li><button onClick={() => openModal('impressum', 'Impressum')} className="hover:text-amber-400 transition cursor-pointer">Impressum</button></li>
                  <li><button onClick={() => openModal('datenschutz', 'Datenschutz')} className="hover:text-amber-400 transition cursor-pointer">Datenschutz</button></li>
                  <li><button onClick={() => openModal('agb', 'AGB')} className="hover:text-amber-400 transition cursor-pointer">AGB</button></li>
              </ul>
            </div>
            
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} Goldhaus Langen GmbH. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>

        {/* ========== Cookie Notice (persisted) ========== */}
      {!cookiesAccepted && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 md:w-auto max-w-2xl z-40">
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={50}
              backgroundOpacity={0.1}
              saturation={1}
              brightness={50}
              opacity={0.93}
              blur={11}
              displace={0.5}
              distortionScale={-180}
              redOffset={0}
              greenOffset={10}
              blueOffset={20}
              className="p-4"
            >
              <div className="flex flex-col md:flex-row items-center gap-3 text-white">
                <p className="text-sm flex-1">
                  Wir verwenden Cookies, um Ihr Erlebnis zu verbessern.{' '}
                  <button onClick={() => openModal('datenschutz', 'Datenschutz')} className="underline hover:text-yellow-300 text-yellow-200">Mehr erfahren</button>.
                </p>
                <button
                  onClick={acceptCookies}
                  className="bg-amber-400 text-gray-900 px-4 py-2 rounded-full hover:bg-amber-500 transition-colors"
                >
                  Akzeptieren
                </button>
              </div>
            </GlassSurface>
        </div>
      )}

        {/* ========== Modal ========== */}
      <AnimatePresence>
        {(modalContent || modalReactContent) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeModal}
              aria-modal="true"
              role="dialog"
          >
            <motion.div
                id="modal-dialog"
                tabIndex={-1}
                initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold">{modalTitle}</h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                  aria-label="Schließen"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="overflow-y-auto p-6 max-h-[calc(90vh-80px)]">
                {modalReactContent ? (
                  modalReactContent
                ) : (
                  <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: modalContent }} />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>Ob Gold, Silber oder Luxusuhren
      </main>
    </div>
  );
}
