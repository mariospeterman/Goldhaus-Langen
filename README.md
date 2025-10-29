# Goldhaus Langen Website

A modern, responsive website for Goldhaus Langen jewelry store built with React, Vite, Tailwind CSS, and Framer Motion.

## 🚀 Quick Start

### Running the Development Server

```bash
npm run dev
```

This will start the development server at `http://localhost:3000` and automatically open in your browser.

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing.

## 📋 Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

## 🛠️ Setup

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

## ⚙️ Configuration Required

### 1. EmailJS Setup (Contact Form)

The contact form uses EmailJS, a free alternative to Formspree (100 emails/month free).

**Steps:**
1. Go to [EmailJS](https://www.emailjs.com/) and create a free account
2. Add an Email Service (Gmail, Outlook, etc.)
3. Create an Email Template with these variables:
   - `{{user_name}}`
   - `{{user_email}}`
   - `{{message}}`
4. Get your credentials from EmailJS dashboard
5. Update `src/App.jsx` lines 27-29:
   ```javascript
   emailjsServiceId: 'your_service_id',
   emailjsTemplateId: 'your_template_id',
   emailjsPublicKey: 'your_public_key'
   ```

### 2. Google Maps Setup

**Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Maps JavaScript API"
4. Create credentials (API Key)
5. (Optional) Restrict the API key to your domain for security
6. Update `src/App.jsx` line 24:
   ```javascript
   googleMapsApiKey: 'your_google_maps_api_key'
   ```

### 3. Instagram Photos

The Instagram integration uses direct image URLs. Update `public/insta.json`:

**Option 1: Manual upload (current approach)**
```json
[
  "https://your-cdn.com/image1.jpg",
  "https://your-cdn.com/image2.jpg"
]
```

**Option 2: Instagram Basic Display API (requires backend)**
- Would need a serverless function (Netlify/Vercel) to handle tokens securely
- More complex but fetches live data from Instagram

**Option 3: Third-party widgets**
- [LightWidget](https://lightwidget.com/) - Free Instagram widgets
- [SnapWidget](https://snapwidget.com/) - Embed Instagram feeds
- Can embed directly as iframe in your component

### 4. Background Image

Ensure `public/gold-bg.jpg` exists and is a valid image file.

## 📁 Project Structure

```
goldhaus-langen-site/
├── public/
│   ├── gold-bg.jpg      # Hero background image
│   └── insta.json       # Instagram image URLs
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── GlassSurface.jsx  # Glassmorphism component
│   │   ├── CircleText.jsx    # Circular text component
│   │   └── README.md         # Components documentation
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## 🎨 Technologies

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **EmailJS** - Email service (contact form)
- **@react-google-maps/api** - Google Maps integration

## 🧩 Custom Components

- **GlassSurface** - Glassmorphism effects with blur and transparency
- **CircleText** - Animated circular text display
- See `src/components/README.md` for detailed usage

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔧 Alternative Form Solutions

If you prefer not to use EmailJS:

1. **Web3Forms** (Free, easy)
   - Sign up at [web3forms.com](https://web3forms.com)
   - No JavaScript required, simple HTML form

2. **Formspark** (Freemium)
   - 50 submissions/month free
   - Easy setup

3. **Netlify Forms** (If hosting on Netlify)
   - No backend required
   - Automatic spam protection

## 🗺️ Google Maps Alternatives

If Google Maps has quota issues:

1. **Leaflet + OpenStreetMap** (Free, no API key)
   ```bash
   npm install leaflet react-leaflet
   ```

2. **Mapbox** (Free tier available)
   ```bash
   npm install react-map-gl
   ```

