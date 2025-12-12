import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Phone } from 'lucide-react';
import { CONFIG } from '../config.js';

const MapComponent = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Check if API key is valid and properly configured
  const hasValidApiKey = CONFIG.mapboxToken && 
    CONFIG.mapboxToken !== 'YOUR_MAPBOX_TOKEN' &&
    CONFIG.mapboxToken.length > 20;

  useEffect(() => {
    if (!hasValidApiKey) return;

    // Wait for container to be ready
    const initializeMap = () => {
      if (!mapContainer.current || map.current) return;

      // Set Mapbox access token
      mapboxgl.accessToken = CONFIG.mapboxToken;

      // Initialize map
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11', // Valid style
          center: [CONFIG.mapCenter.lng, CONFIG.mapCenter.lat], // [lng, lat]
          zoom: 16,
          attributionControl: false
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add custom marker
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.width = '40px';
        el.style.height = '40px';
        el.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' fill='%23D97706' stroke='%23ffffff' stroke-width='2'/%3E%3C/svg%3E")`;
        el.style.backgroundSize = 'cover';
        el.style.backgroundRepeat = 'no-repeat';
        el.style.backgroundPosition = 'center';
        el.style.cursor = 'pointer';

        marker.current = new mapboxgl.Marker(el)
          .setLngLat([CONFIG.mapCenter.lng, CONFIG.mapCenter.lat])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML('<strong>Goldhaus Langen</strong><br>' + CONFIG.address))
          .addTo(map.current);

        // Handle map load event
        map.current.once('load', () => {
          setIsLoaded(true);
          setLoadError(null);
        });

        // Handle map errors
        map.current.on('error', (e) => {
          console.error('Mapbox error:', e);
          setLoadError(e);
          setIsLoaded(false);
        });

        // Fallback timeout: if map doesn't load within 15 seconds, check if it's actually loaded
        const loadTimeout = setTimeout(() => {
          if (map.current && map.current.loaded()) {
            setIsLoaded(true);
            setLoadError(null);
          } else {
            console.warn('Map load timeout - map may still be loading or there may be an issue');
          }
        }, 15000);

        // Cleanup timeout on successful load
        map.current.once('load', () => {
          clearTimeout(loadTimeout);
        });

      } catch (error) {
        console.error('Error initializing Mapbox:', error);
        setLoadError(error);
        setIsLoaded(false);
      }
    };

    // Try to initialize immediately if container is ready
    if (mapContainer.current) {
      initializeMap();
    } else {
      // If container not ready, wait a bit and try again
      const timer = setTimeout(() => {
        if (mapContainer.current && !map.current) {
          initializeMap();
        }
      }, 100);
      return () => clearTimeout(timer);
    }

    // Cleanup
    return () => {
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [hasValidApiKey]);

  // Show fallback if no valid API key
  if (!hasValidApiKey) {
    return (
      <div className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8 text-amber-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Besuchen Sie uns</h3>
        <p className="text-gray-600 mb-4">{CONFIG.address}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a 
            href={`https://www.openstreetmap.org/?mlat=${CONFIG.mapCenter.lat}&mlon=${CONFIG.mapCenter.lng}&zoom=16`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            Auf Karte anzeigen
          </a>
          <a 
            href={`tel:${CONFIG.phone}`}
            className="inline-flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Phone className="w-4 h-4" />
            Anrufen
          </a>
        </div>
      </div>
    );
  }

  // Show error state
  if (loadError) {
    return (
      <div className="mt-8 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500 p-8">
        <div className="text-center">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="mb-2">Karte konnte nicht geladen werden</p>
          <a 
            href={`https://www.openstreetmap.org/?mlat=${CONFIG.mapCenter.lat}&mlon=${CONFIG.mapCenter.lng}&zoom=16`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm"
          >
            <MapPin className="w-4 h-4" />
            Auf Karte anzeigen
          </a>
        </div>
      </div>
    );
  }

  // Render the map container (always render, show loading overlay if needed)
    return (
    <div className="mt-8 rounded-2xl overflow-hidden shadow-lg relative">
      <div ref={mapContainer} className="w-full h-[400px]" />
      {!isLoaded && !loadError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Karte wird geladen...</p>
        </div>
      </div>
      )}
    </div>
  );
};

export default MapComponent;
