// Configuration and environment variable management
const parseEnv = (key, fallback) => {
  const value = import.meta.env[key];
  // Trim whitespace and return fallback if empty
  if (value && typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }
  return value || fallback;
};

export const CONFIG = {
  phone: parseEnv('VITE_PHONE', '06103 7327237'),
  email: parseEnv('VITE_EMAIL', 'info@goldhaus-langen.de'),
  address: parseEnv('VITE_ADDRESS', 'Bahnstraße 14, 63225 Langen (Hessen)'),
  whatsapp: parseEnv('VITE_WHATSAPP', '+491785980980'),
  mapCenter: { lat: 49.989419, lng: 8.672798 }, // Bahnstraße 14, 63225 Langen (Hessen)
  instagramEndpoint: parseEnv('VITE_INSTAGRAM_ENDPOINT', '/insta.json')
};


