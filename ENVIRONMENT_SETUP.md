# 🔧 Environment Setup Guide

## 📸 Instagram RSS Feed Setup (Current Method)

Since you're using RSS feed instead of Instagram API, here's how to set it up:

### **Step 1: Get RSS Feed URL**

1. **RSS.app** (Recommended):
   - Go to https://rss.app/
   - Sign up for free account
   - Connect your Instagram account
   - Get the RSS feed URL

2. **Zapier**:
   - Create account at https://zapier.com/
   - Create new Zap: Instagram → RSS
   - Get the RSS feed URL

3. **IFTTT**:
   - Sign up at https://ifttt.com/
   - Create applet: Instagram → RSS
   - Get the RSS feed URL

### **Step 2: Add Environment Variable**

Create `.env.local` file in your project root:

```bash
# Instagram RSS Feed
VITE_INSTAGRAM_RSS_URL=https://rss.app/feeds/your-instagram-feed.xml

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY

# Contact Information
VITE_PHONE=+49 6103 2018488
VITE_EMAIL=info@goldhaus-langen.de
VITE_ADDRESS=Bahnstraße 73, 63225 Langen (Hessen)

# EmailJS Configuration (Optional)
VITE_EMAILJS_SERVICE_ID=YOUR_SERVICE_ID
VITE_EMAILJS_TEMPLATE_ID=YOUR_TEMPLATE_ID
VITE_EMAILJS_PUBLIC_KEY=YOUR_PUBLIC_KEY
```

### **Step 3: Test the Integration**

1. **Start the dev server**: `npm run dev`
2. **Check console**: Look for Instagram feed loading messages
3. **Verify images**: Instagram images should appear in the "Folgen Sie uns" section

## 🗺️ Google Maps Setup

### **Get API Key**:
1. Go to https://console.cloud.google.com/
2. Create new project or select existing
3. Enable "Maps JavaScript API"
4. Create credentials → API Key
5. Add to `.env.local` as `VITE_GOOGLE_MAPS_API_KEY`

## 📧 EmailJS Setup (Optional)

### **Configure EmailJS**:
1. Sign up at https://www.emailjs.com/
2. Create email service (Gmail, Outlook, etc.)
3. Create email template
4. Get Service ID, Template ID, and Public Key
5. Add to `.env.local`

## 🚀 Current Status

✅ **Fixed Issues**:
- SVG className error in MapComponent
- Google Maps multiple loading prevention
- CONFIG import error resolved
- Instagram RSS feed integration ready

✅ **Features Working**:
- Auto-refresh Instagram feed every 30 minutes
- Mobile carousel (4-second rotation)
- Desktop grid (3 images with hover effects)
- Fallback images if RSS fails
- Error handling with graceful degradation

## 🔍 Troubleshooting

### **Common Issues**:

1. **"Instagram feed failed"**:
   - Check RSS URL is correct
   - Verify Instagram account is public
   - Check network connectivity

2. **"Google Maps API Key nicht konfiguriert"**:
   - Add `VITE_GOOGLE_MAPS_API_KEY` to `.env.local`
   - Restart dev server

3. **"CORS error"**:
   - RSS feed uses CORS proxy automatically
   - Should work without additional setup

### **Debug Mode**:

Add this to see what's happening:
```javascript
console.log('Instagram RSS data:', instagramData);
console.log('Images state:', images);
```

## 📱 Features

- **Dynamic Updates**: New Instagram posts appear automatically
- **Responsive Design**: Different layouts for mobile/desktop
- **Hover Effects**: Image scaling and caption overlay
- **Error Recovery**: Falls back to gallery images
- **Performance**: Optimized loading and caching

---

**Need help?** Check the browser console for error messages and ensure your Instagram account is public and properly connected to the RSS service.
