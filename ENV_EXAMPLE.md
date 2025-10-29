# Environment Variables Configuration

Copy the following into a `.env` file in the project root:

```env
# Goldhaus Langen - Environment Variables
# Copy this content to .env and fill in your actual values

# Google Maps Configuration
# Get your API key from: https://console.cloud.google.com/google/maps-apis
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY

# EmailJS Configuration
# Sign up at: https://www.emailjs.com/
VITE_EMAILJS_SERVICE_ID=YOUR_SERVICE_ID
VITE_EMAILJS_TEMPLATE_ID=YOUR_TEMPLATE_ID
VITE_EMAILJS_PUBLIC_KEY=YOUR_PUBLIC_KEY

# Instagram RSS Feed (Optional)
# Use services like RSS.app to create Instagram RSS feeds
# Format: https://rss.app/feeds/your-feed-id.xml
VITE_INSTAGRAM_RSS_URL=YOUR_RSS_FEED_URL

# Contact Information (Optional - defaults are in config.js)
VITE_PHONE=+49 6103 2018488
VITE_EMAIL=info@goldhaus-langen.de
VITE_ADDRESS=Bahnstraße 73, 63225 Langen (Hessen)
```

## Setup Instructions

1. Create a file named `.env` in the project root directory
2. Copy the content above into the `.env` file
3. Replace the placeholder values with your actual API keys and configuration

## Required Services

### Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Create a new project or select an existing one
3. Enable Maps JavaScript API
4. Create credentials (API key)
5. Restrict the API key to your domain for production

### EmailJS Setup
1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create an email service
3. Create an email template
4. Get your service ID, template ID, and public key

### Instagram RSS Feed (Optional)
1. Use [RSS.app](https://rss.app/) or similar service
2. Create an Instagram RSS feed
3. Copy the feed URL (should end with `.xml`)

## Testing Without API Keys

The application will work with fallback states:
- **Google Maps:** Shows a fallback UI with a link to Google Maps
- **EmailJS:** Contact form will show configuration needed
- **Instagram RSS:** Uses local gallery images from `/public/gallery/`

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- For production, use environment variables from your hosting provider

