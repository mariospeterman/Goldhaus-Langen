import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { MapPin, Phone } from 'lucide-react';
import { CONFIG, GOOGLE_MAPS_LIBRARIES } from '../config.js';

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  clickableIcons: false
};

const MapComponent = () => {
  const [map, setMap] = useState(null);

  // Check if API key is valid and properly configured
  const hasValidApiKey = CONFIG.googleMapsApiKey && 
    CONFIG.googleMapsApiKey !== 'YOUR_GOOGLE_MAPS_API_KEY' &&
    CONFIG.googleMapsApiKey.length > 20;

  // Use the useLoadScript hook which prevents duplicate script loading
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: hasValidApiKey ? CONFIG.googleMapsApiKey : '',
    libraries: GOOGLE_MAPS_LIBRARIES,
    preventGoogleFontsLoading: true,
  });

  const onMapLoad = React.useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);

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
            href={`https://maps.google.com/?q=${encodeURIComponent(CONFIG.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            In Google Maps öffnen
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
            href={`https://maps.google.com/?q=${encodeURIComponent(CONFIG.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm"
          >
            <MapPin className="w-4 h-4" />
            In Google Maps öffnen
          </a>
        </div>
      </div>
    );
  }

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="mt-8 h-[400px] bg-gray-200 animate-pulse rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Karte wird geladen...</p>
        </div>
      </div>
    );
  }

  // Render the map
  return (
    <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={CONFIG.mapCenter}
        zoom={16}
        options={mapOptions}
        onLoad={onMapLoad}
        onUnmount={onUnmount}
      >
        {/* Use standard Marker instead of AdvancedMarker for better compatibility */}
        <Marker
          position={CONFIG.mapCenter}
          title="Goldhaus Langen"
          icon={{
            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
            fillColor: "#D97706",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: 1.5,
            anchor: new window.google.maps.Point(12, 22),
          }}
        />
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
