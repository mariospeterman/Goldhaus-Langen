import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { CONFIG } from '../config.js';

const MapComponent = () => {
  // OpenStreetMap static image (completely free, no API key needed)
  const osmStaticImageUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${CONFIG.mapCenter.lat},${CONFIG.mapCenter.lng}&zoom=16&size=800x400&markers=${CONFIG.mapCenter.lat},${CONFIG.mapCenter.lng},red-pushpin`;
  
  // Google Maps URL for directions
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${CONFIG.mapCenter.lat},${CONFIG.mapCenter.lng}`;
  
  // Google Maps URL for viewing location
  const googleMapsViewUrl = `https://www.google.com/maps?q=${CONFIG.mapCenter.lat},${CONFIG.mapCenter.lng}`;

  return (
    <div className="mt-8 rounded-2xl overflow-hidden shadow-lg relative group">
      {/* Static Map Image */}
      <div className="relative w-full h-[400px] bg-gray-200 overflow-hidden">
        <img
          src={osmStaticImageUrl}
          alt={`Karte: ${CONFIG.address}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to a simple colored div if image fails
            e.target.style.display = 'none';
            e.target.parentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
          }}
        />
        
        {/* Overlay with marker info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
          <div className="w-full p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-amber-400" />
              <span className="font-semibold">{CONFIG.address}</span>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <a
                href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
                <Navigation className="w-4 h-4" />
                Route berechnen
          </a>
          <a 
                href={googleMapsViewUrl}
            target="_blank"
            rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors font-medium backdrop-blur-sm"
          >
            <MapPin className="w-4 h-4" />
                Auf Karte anzeigen
          </a>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
