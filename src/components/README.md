# Components Directory

This directory contains reusable UI components for the Goldhaus Langen website.

## Available Components

### GlassSurface

A beautiful glassmorphism component for creating frosted glass effects.

**Props:**
- `children` (ReactNode) - Content to display
- `className` (string) - Additional CSS classes
- `blur` (number) - Blur intensity (default: 8)
- `opacity` (number) - Background opacity 0-1 (default: 0.1)
- `hover` (boolean) - Enable hover effect (default: true)

**Usage:**
```jsx
import { GlassSurface } from './components/GlassSurface';

<GlassSurface className="p-6" opacity={0.15} blur={12}>
  <p>Your content here</p>
</GlassSurface>
```

**Variants:**

#### GlassCard
Pre-styled with padding:
```jsx
import { GlassCard } from './components/GlassSurface';

<GlassCard>
  Card content
</GlassCard>
```

#### GlassButton
Button with glass effect:
```jsx
import { GlassButton } from './components/GlassSurface';

<GlassButton onClick={handleClick}>
  Click me
</GlassButton>
```

---

### CircleText

Displays text in a circular path with animation options.

**Props:**
- `text` (string) - Text to display in circle
- `radius` (number) - Radius of the circle (default: 100)
- `duration` (number) - Animation duration in seconds (default: 20)
- `className` (string) - Additional CSS classes
- `size` (number) - Font size (default: 24)
- `reverse` (boolean) - Rotate in reverse (default: false)
- `color` (string) - Text color (default: 'currentColor')

**Usage:**
```jsx
import { CircleText } from './components/CircleText';

<CircleText 
  text="Goldhaus Langen · Gold · Schmuck · Werkstatt" 
  radius={120}
  duration={15}
/>
```

**Variants:**

#### CircleTextSpinner
Simplified animated circular text for better performance:
```jsx
import { CircleTextSpinner } from './components/CircleText';

<CircleTextSpinner 
  text="Goldhaus" 
  size="text-3xl"
/>
```

#### FloatingCircleText
Floating effect with circular text:
```jsx
import { FloatingCircleText } from './components/CircleText';

<FloatingCircleText text="Gold" radius={100}>
  <div className="w-20 h-20 bg-amber-500 rounded-full" />
</FloatingCircleText>
```

---

## Example: Using Both Together

```jsx
import { GlassCard } from './components/GlassSurface';
import { FloatingCircleText } from './components/CircleText';

<div className="relative">
  <GlassCard className="p-12 overflow-hidden">
    <FloatingCircleText text="Goldhaus Langen Premium" radius={150}>
      <div className="text-center">
        <h2 className="text-4xl font-bold">Welcome</h2>
        <p className="text-gray-600 mt-2">Luxury jewelry and gold</p>
      </div>
    </FloatingCircleText>
  </GlassCard>
</div>
```

---

## Styling Tips

1. **Glass Effect**: Adjust `opacity` and `blur` for different glass intensities
2. **Circle Text**: Use `duration` to control animation speed
3. **Reverse Direction**: Set `reverse={true}` for counter-clockwise rotation
4. **Hover Effects**: GlassSurface components have built-in hover effects

---

## Browser Support

- GlassSurface: Uses CSS `backdrop-filter` (Modern browsers)
- CircleText: Uses SVG textPath (All modern browsers)

