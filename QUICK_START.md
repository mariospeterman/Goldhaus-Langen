# 🚀 Quick Start Guide

Your Goldhaus Langen website is ready! Here's everything you need to know.

## ✅ Setup Complete

All components are integrated and the repository is clean:
- ✅ Environment variables configured
- ✅ EmailJS integration ready
- ✅ Google Maps integration ready
- ✅ GlassSurface & CircleText components available
- ✅ No linter errors
- ✅ Dev server running at http://localhost:3000

## 📝 Next Steps

### 1. Configure Your API Keys

Edit the `.env` file in the project root:

```bash
# Open and edit the file
nano .env
# or
code .env  # if using VS Code
```

Add your actual API keys:

```env
# Get from: https://console.cloud.google.com/
VITE_GOOGLE_MAPS_API_KEY=AIzaSyC_your_actual_key_here

# Get from: https://www.emailjs.com/
VITE_EMAILJS_SERVICE_ID=service_your_id
VITE_EMAILJS_TEMPLATE_ID=template_your_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### 2. Add Instagram Images

Replace the URLs in `public/insta.json` with actual image URLs:

```json
[
  "https://your-cdn.com/image1.jpg",
  "https://your-cdn.com/image2.jpg",
  "https://your-cdn.com/image3.jpg",
  "https://your-cdn.com/image4.jpg"
]
```

### 3. Add Background Image

Ensure `public/gold-bg.jpg` is a valid image file.

## 🎨 Using Custom Components

### GlassSurface

Already used in the header. You can also use it anywhere:

```jsx
import { GlassSurface } from './components/GlassSurface';

<GlassSurface className="p-6" opacity={0.15} blur={12}>
  Your content
</GlassSurface>
```

### CircleText

Animate text in a circle:

```jsx
import { CircleText } from './components/CircleText';

<CircleText 
  text="Goldhaus Langen · Gold · Schmuck" 
  radius={120}
  duration={15}
/>
```

See `COMPONENTS_USAGE.md` for full examples.

## 🚀 Running the Website

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📂 Project Structure

```
goldhaus-langen-site/
├── .env                    # Your API keys (not in git)
├── .env.example            # Template for API keys
├── src/
│   ├── components/         # Reusable components
│   │   ├── GlassSurface.jsx
│   │   ├── CircleText.jsx
│   │   └── README.md
│   ├── App.jsx             # Main app
│   └── main.jsx            # Entry point
├── public/
│   ├── gold-bg.jpg         # Hero background
│   └── insta.json          # Instagram images
└── docs/
    ├── SETUP_GUIDE.md      # Detailed setup
    ├── ENV_SETUP.md        # Environment variables
    └── COMPONENTS_USAGE.md # Component examples
```

## 🔑 What You Need

1. **Google Maps API Key** (Free tier available)
2. **EmailJS Account** (100 emails/month free)
3. **Instagram Image URLs** (or use CDN)
4. **Background Image** (gold-bg.jpg)

## 📚 Documentation

- `README.md` - Main documentation
- `SETUP_GUIDE.md` - Step-by-step setup for all services
- `ENV_SETUP.md` - Environment variables guide
- `COMPONENTS_USAGE.md` - How to use GlassSurface & CircleText
- `src/components/README.md` - Component API reference

## 🎨 Customization

### Change Colors

Edit `src/index.css` or use Tailwind classes in components.

### Add More Sections

Edit `src/App.jsx` and add new sections using the existing patterns.

### Change Fonts

Edit `src/index.css` or update Tailwind config in `tailwind.config.js`.

## ❗ Common Issues

### "API key not loaded"
- Make sure variables start with `VITE_`
- Restart the dev server after changing `.env`

### "Map not showing"
- Verify Google Maps API key is correct
- Check browser console for errors

### "Form not sending"
- Configure EmailJS credentials
- Check browser console for errors

## ✨ Features

- ✨ Glassmorphism effects
- 🗺️ Interactive Google Maps
- 📧 Contact form with EmailJS
- 📷 Instagram photo gallery
- 📱 Fully responsive
- 🎭 Smooth animations with Framer Motion
- 🎨 Modern UI with Tailwind CSS

## 🎉 You're All Set!

Visit http://localhost:3000 to see your website!

