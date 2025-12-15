import React, { useEffect, useRef } from 'react';
import { Navigation, MapPin } from 'lucide-react';
import { CONFIG } from '../config.js';

const MapComponent = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Google Maps URL for directions
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${CONFIG.mapCenter.lat},${CONFIG.mapCenter.lng}`;
  
  // Google Maps URL for viewing location
  const googleMapsViewUrl = `https://www.google.com/maps?q=${CONFIG.mapCenter.lat},${CONFIG.mapCenter.lng}`;

  useEffect(() => {
    // Load Leaflet CSS and JS (free, no API key needed)
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    if (!window.L && !document.querySelector('script[src*="leaflet"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = initMap;
      document.head.appendChild(script);
    } else if (window.L) {
      initMap();
    }

    function initMap() {
      if (!mapRef.current || mapInstanceRef.current) return;

      const L = window.L;
      if (!L) return;

      // Initialize map
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [CONFIG.mapCenter.lat, CONFIG.mapCenter.lng],
        16
      );

      // Add OpenStreetMap tiles (free, no API key)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);

      // Add custom marker
      const goldIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 40px;
            height: 40px;
            background: #D97706;
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });

      L.marker([CONFIG.mapCenter.lat, CONFIG.mapCenter.lng], { icon: goldIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`<strong>Goldhaus Langen</strong><br>${CONFIG.address}`);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

    return (
    <div className="mt-8 rounded-2xl overflow-hidden shadow-lg relative">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-[400px] bg-gray-200" />
      
      {/* Action Buttons Overlay */}
      <div className="absolute bottom-4 right-4 flex gap-3 z-[1000]">
        <a
          href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
          <Navigation className="w-4 h-4" />
          Route
          </a>
          <a 
          href={googleMapsViewUrl}
            target="_blank"
            rel="noopener noreferrer"
          className="flex items-center gap-2 bg-gray-600/80 hover:bg-gray-500/80 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            <MapPin className="w-4 h-4" />
          Karte
        </a>
      </div>
    </div>
  );
};

export default MapComponent;
