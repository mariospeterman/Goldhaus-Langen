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
  mapboxToken: parseEnv('VITE_MAPBOX_TOKEN', 'YOUR_MAPBOX_TOKEN'),
  mapCenter: { lat: 49.992756, lng: 8.665405 }, // Will need to update coordinates for new address
  instagramEndpoint: parseEnv('VITE_INSTAGRAM_ENDPOINT', '/insta.json'),
  goldApiKey: parseEnv('VITE_GOLDAPI_KEY', '')
};

// Debug logging (only in development)
if (import.meta.env.DEV) {
  console.log('CONFIG loaded:', {
    goldApiKey: CONFIG.goldApiKey ? `${CONFIG.goldApiKey.substring(0, 10)}...` : 'NOT SET',
    hasGoldApiKey: !!CONFIG.goldApiKey
  });
}

