# Environment Variables Setup

The website now uses environment variables for secure configuration.

## ✅ What's Been Done

1. Created `.env` file for your local configuration
2. Created `.env.example` file as a template
3. Updated `src/App.jsx` to read from environment variables
4. Fixed module type warning by adding `"type": "module"` to package.json

## 🔧 Configuration

### 1. Update Your .env File

Edit `.env` file in the project root and add your actual API keys:

```bash
# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### 2. Get Your API Keys

**Google Maps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable "Maps JavaScript API"
3. Create credentials (API Key)
4. Add the key to `.env` file

**EmailJS:**
1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create an email service
3. Create an email template
4. Get your credentials from the dashboard
5. Add them to `.env` file

### 3. Restart the Server

After updating `.env` file, restart the dev server:

```bash
npm run dev
```

## 📋 Available Environment Variables

All Vite environment variables must be prefixed with `VITE_`:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key | `AIzaSyC...` |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID | `service_abc123` |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID | `template_xyz789` |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key | `user_abc123xyz` |
| `VITE_PHONE` | Business phone | `+49 6103 2018488` |
| `VITE_EMAIL` | Business email | `info@goldhaus-langen.de` |
| `VITE_ADDRESS` | Business address | Full address string |
| `VITE_MAP_LAT` | Map latitude | `49.992756` |
| `VITE_MAP_LNG` | Map longitude | `8.665405` |
| `VITE_INSTAGRAM_ENDPOINT` | Instagram JSON path | `/insta.json` |

## 🔒 Security Notes

1. **Never commit `.env`** - It's already in `.gitignore`
2. **Commit `.env.example`** - Safe to share, contains no real keys
3. **Vite prefix required** - All vars must start with `VITE_`
4. **Client-side exposure** - These variables are embedded in the build, don't put server secrets here

## 🚀 For Different Environments

Create separate env files:

- `.env` - Local development
- `.env.production` - Production build
- `.env.staging` - Staging environment

Vite automatically loads the right one based on the mode.

## ✅ Testing

Check that variables are loaded:

```javascript
// In your browser console
console.log(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
```

Or in your code:

```jsx
{import.meta.env.VITE_EMAILJS_PUBLIC_KEY && <div>EmailJS configured</div>}
```

## 📝 .env File Template

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
# Then edit .env with your actual keys
```

