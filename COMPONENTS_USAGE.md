# ReactBits Components - Usage Guide

This document explains how to use the custom components inspired by ReactBits.dev for the Goldhaus Langen website.

## ✅ What's Been Done

1. **Removed** the `/reactbits` directory to keep the repo clean
2. **Created** reusable components in `src/components/`:
   - `GlassSurface.jsx` - Glassmorphism effects
   - `CircleText.jsx` - Circular text animations
3. **Updated** `App.jsx` to use the new GlassSurface component
4. **Added** comprehensive documentation

---

## 🎨 Component Examples

### 1. GlassSurface - Glassmorphism Header

Already implemented in your header! Here's how it's used:

```jsx
import { GlassSurface } from './components/GlassSurface';

<GlassSurface className="p-3" opacity={0.15} blur={12}>
  <header>
    {/* Your navigation content */}
  </header>
</GlassSurface>
```

**Key Props:**
- `opacity` - Control glass transparency (0-1)
- `blur` - Blur intensity in pixels
- `hover` - Enable/disable hover effects

---

### 2. CircleText - Animated Logo Text

Add this to your hero section or around elements:

```jsx
import { CircleText } from './components/CircleText';

// Simple rotating text
<CircleText 
  text="Goldhaus Langen · Gold · Schmuck · Werkstatt" 
  radius={120}
  duration={15}
  size={18}
/>
```

---

### 3. Advanced Usage - Combining Components

Here's a complete example for the hero section:

```jsx
import { GlassCard } from './components/GlassSurface';
import { FloatingCircleText } from './components/CircleText';

<section className="relative min-h-screen flex items-center justify-center">
  {/* Background with pattern */}
  <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-yellow-100" />
  
  {/* Glass card with circular text around it */}
  <FloatingCircleText 
    text="Goldhaus Langen · Premium Jewelry · Trusted Since 1985"
    radius={150}
    duration={20}
    className="z-10"
  >
    <GlassCard className="w-96 h-96 flex flex-col items-center justify-center">
      <div className="w-24 h-24 rounded-full bg-amber-500 flex items-center justify-center mb-4">
        <span className="text-white text-3xl font-bold">G</span>
      </div>
      <h1 className="text-4xl font-bold text-gray-900">Goldhaus Langen</h1>
      <p className="text-gray-600 mt-2">Premium Jewelry & Gold</p>
      <button className="mt-6 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
        Get Started
      </button>
    </GlassCard>
  </FloatingCircleText>
</section>
```

---

## 🎯 Where to Add Components

### Homepage Hero Section

Replace the current hero with enhanced glass effects:

```jsx
// In src/App.jsx, around line 72
<section className="h-screen flex flex-col justify-center items-center bg-[url('/gold-bg.jpg')] bg-cover bg-center text-center text-white px-6 relative overflow-hidden">
  
  {/* Add circular text behind the hero */}
  <CircleText 
    text="· GOLDAUF LANGEN · GOLD · SCHMUCK · WERKSTATT · EXCELLENCE ·"
    radius={200}
    duration={25}
    reverse={true}
    className="absolute opacity-20"
    color="rgba(255,255,255,0.3)"
  />
  
  {/* Your existing content */}
  <motion.h2>...</motion.h2>
  {/* ... */}
</section>
```

### Services Section

Enhance service cards with glass effects:

```jsx
import { GlassCard } from './components/GlassSurface';

<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <GlassCard className="text-center hover:scale-105 transition-transform">
    <div className="text-4xl mb-3">💰</div>
    <div className="text-xl font-semibold mb-2">Goldankauf</div>
    <div className="text-gray-600">Altgold, Zahngold & Schmuck</div>
  </GlassCard>
  {/* More cards... */}
</div>
```

### Floating Action Buttons

```jsx
import { GlassButton } from './components/GlassSurface';

<div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
  <GlassButton onClick={() => window.open(`https://wa.me/${CONFIG.phone.replace(/\D/g, '')}`)}>
    WhatsApp
  </GlassButton>
  <GlassButton onClick={() => window.open(`tel:${CONFIG.phone}`)}>
    Phone
  </GlassButton>
</div>
```

---

## 🎨 Customization Tips

### Adjust Glass Effect Intensity

```jsx
// More transparent
<GlassSurface opacity={0.05} blur={6}>

// More opaque
<GlassSurface opacity={0.25} blur={16}>
```

### Circle Text Styling

```jsx
// Fast rotation
<CircleText text="..." duration={10} />

// Slow rotation
<CircleText text="..." duration={30} />

// Larger text
<CircleText text="..." size={32} />

// Reverse direction
<CircleText text="..." reverse={true} />
```

---

## 🚀 Integration with Existing Components

You can combine these components with your existing Framer Motion animations:

```jsx
import { motion } from 'framer-motion';
import { GlassCard } from './components/GlassSurface';
import { CircleTextSpinner } from './components/CircleText';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <GlassCard>
    <CircleTextSpinner text="Gold" size="text-4xl" />
    <p>Your content</p>
  </GlassCard>
</motion.div>
```

---

## 📋 Component Props Reference

### GlassSurface Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | Content to display |
| className | string | '' | Additional CSS classes |
| blur | number | 8 | Blur intensity in pixels |
| opacity | number | 0.1 | Background opacity (0-1) |
| hover | boolean | true | Enable hover effect |

### CircleText Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| text | string | - | Text to display |
| radius | number | 100 | Circle radius |
| duration | number | 20 | Animation duration in seconds |
| size | number | 24 | Font size |
| reverse | boolean | false | Rotate in reverse |
| color | string | 'currentColor' | Text color |
| className | string | '' | Additional CSS classes |

---

## 🐛 Troubleshooting

### Glass effect not showing?
- Ensure your browser supports `backdrop-filter` (Chrome, Firefox, Safari modern versions)
- Check if Tailwind CSS is properly configured

### CircleText not animating?
- Check if browser supports SVG animations
- Verify the component is imported correctly

### Performance issues?
- Use `CircleTextSpinner` instead of `CircleText` for better performance
- Limit the number of animated components on screen

---

## 📚 Additional Resources

- Full component documentation: `src/components/README.md`
- ReactBits.dev inspiration: [reactbits.dev](https://reactbits.dev)
- Tailwind CSS docs: [tailwindcss.com](https://tailwindcss.com)

