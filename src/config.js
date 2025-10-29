// Configuration and environment variable management
const parseEnv = (key, fallback) => import.meta.env[key] || fallback;

export const CONFIG = {
  phone: parseEnv('VITE_PHONE', '+49 6103 2018488'),
  email: parseEnv('VITE_EMAIL', 'info@goldhaus-langen.de'),
  address: parseEnv('VITE_ADDRESS', 'Bahnstraße 73, 63225 Langen (Hessen)'),
  googleMapsApiKey: parseEnv('VITE_GOOGLE_MAPS_API_KEY', 'YOUR_GOOGLE_MAPS_API_KEY'),
  googleMapsMapId: parseEnv('VITE_GOOGLE_MAPS_MAP_ID', 'main-website-map'),
  mapCenter: { lat: 49.992756, lng: 8.665405 },
  emailjsServiceId: parseEnv('VITE_EMAILJS_SERVICE_ID', 'YOUR_SERVICE_ID'),
  emailjsTemplateId: parseEnv('VITE_EMAILJS_TEMPLATE_ID', 'YOUR_TEMPLATE_ID'),
  emailjsPublicKey: parseEnv('VITE_EMAILJS_PUBLIC_KEY', 'YOUR_PUBLIC_KEY'),
  instagramEndpoint: parseEnv('VITE_INSTAGRAM_ENDPOINT', '/insta.json')
};

// Static libraries array for Google Maps to prevent reload warnings
export const GOOGLE_MAPS_LIBRARIES = ['marker'];

