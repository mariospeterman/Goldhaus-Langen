import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Mail, MessageCircle } from 'lucide-react';
import GlassSurface from './GlassSurface.jsx';
import logo from '/logo.png';
import { CONFIG } from '../config.js';

const CardNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { label: 'Über uns', href: '#about' },
    { label: 'Leistungen', href: '#services' },
    { label: 'Anfahrt', href: '#contact' }
  ];

  return (
    <>
      {/* Header */}
      <GlassSurface
        width="100%"
        height="auto"
        borderRadius={50}
        backgroundOpacity={0.1}
        saturation={1}
        brightness={55}
        opacity={0.9}
        blur={11}
        displace={0.5}
        distortionScale={-180}
        redOffset={0}
        greenOffset={10}
        blueOffset={20}
        className="mx-auto w-full max-w-6xl shadow-lg"
      >
        {/* Desktop layout */}
        <div className="relative hidden md:flex w-full items-center px-6 py-4">
          <nav className="flex items-center gap-6 text-white/90 pr-28" aria-label="Hauptnavigation">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-medium tracking-wide hover:text-amber-400 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href="#hero"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
          >
            <img src={logo} alt="Goldhaus Langen" className="h-12 w-auto" loading="lazy" />
          </a>

          <div className="ml-auto flex items-center gap-3 text-white">
            <a
              href={`tel:${CONFIG.phone}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 text-white hover:border-amber-400 hover:text-amber-400 transition"
              aria-label="Anrufen"
            >
              <Phone className="h-5 w-5" />
            </a>
            <a
              href={`mailto:${CONFIG.email}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 text-white hover:border-amber-400 hover:text-amber-400 transition"
              aria-label="E-Mail"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              href={`https://wa.me/${CONFIG.whatsapp.replace(/\D/g, '')}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 text-white hover:border-amber-400 hover:text-amber-400 transition"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Mobile header */}
        <div className="md:hidden relative flex w-full items-center px-4 py-3">
          <a
            href="#hero"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
          >
            <img src={logo} alt="Goldhaus Langen" className="h-10 w-auto" loading="lazy" />
          </a>
          <button
            onClick={toggleMenu}
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/50 text-white/90 hover:text-amber-400 hover:border-amber-400"
            aria-label="Menü öffnen"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </GlassSurface>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              ref={menuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between mb-8">
                  <img 
                    src={logo} 
                    alt="Goldhaus Langen Logo" 
                    className="h-8 w-auto"
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Menu Items */}
                <div className="space-y-4">
                  {menuItems.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                            onClick={() => setIsOpen(false)}
                      className="block py-3 px-4 text-lg font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                          >
                      {item.label}
                          </a>
                  ))}
                </div>

                {/* Mobile Contact Info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="space-y-4">
                    <a
                      href={`tel:${CONFIG.phone}`}
                      className="flex items-center gap-3 text-gray-700 hover:text-amber-500 transition"
                    >
                      <Phone className="w-5 h-5" />
                      <span>{CONFIG.phone}</span>
                    </a>
                    <a
                      href={`https://wa.me/${CONFIG.whatsapp.replace(/\D/g, '')}`}
                      className="flex items-center gap-3 text-gray-700 hover:text-green-500 transition"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>WhatsApp: {CONFIG.whatsapp}</span>
                    </a>
                    <a
                      href={`mailto:${CONFIG.email}`}
                      className="flex items-center gap-3 text-gray-700 hover:text-blue-500 transition"
                    >
                      <Mail className="w-5 h-5" />
                      <span>{CONFIG.email}</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CardNav;