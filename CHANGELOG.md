# Changelog

## [1.0.1] - 2025-10-28

### 🔧 Fixed
- **Google Maps Component**
  - Replaced `LoadScript` with `useLoadScript` hook to prevent duplicate script loading
  - Fixed `google.maps.Map is not a constructor` error
  - Switched from `AdvancedMarkerElement` to standard `Marker` for better compatibility
  - Added proper error boundaries and fallback UI
  - Eliminated "Element already defined" warnings

- **Instagram Gallery**
  - Fixed 403 Forbidden errors from Instagram CDN images
  - Implemented automatic detection and filtering of blocked CDN URLs
  - Enhanced fallback system with 6 local gallery images
  - Added `onError` handlers to images for automatic fallback
  - Improved RSS feed parsing with multiple extraction methods

### ⬆️ Updated
- `react` & `react-dom`: 18.2.0 → 18.3.1
- `framer-motion`: 10.16.4 → 11.11.17
- `lucide-react`: 0.344.0 → 0.460.0
- `@react-google-maps/api`: 2.19.3 → 2.20.3
- `@vitejs/plugin-react`: 4.2.1 → 4.3.4
- `vite`: 5.0.0 → 5.4.21
- `tailwindcss`: 3.4.0 → 3.4.18
- `autoprefixer`: 10.4.16 → 10.4.20
- `postcss`: 8.4.31 → 8.4.49

### ✨ Enhanced
- Added lazy loading to all images (`loading="lazy"`)
- Improved console logging (informative messages instead of errors)
- Better error handling throughout the application
- Optimized performance with React.useCallback
- Added comprehensive documentation

### 📝 Documentation
- Created `FIXES_APPLIED.md` with detailed fix documentation
- Created `ENV_EXAMPLE.md` with environment setup instructions
- Updated inline code comments for better maintainability

### 🧪 Tested
- ✅ Production build succeeds without errors
- ✅ Development server runs without critical errors
- ✅ All components render with proper fallbacks
- ✅ Image error handling working correctly
- ✅ Google Maps loads properly (with valid API key)
- ✅ Responsive design on mobile and desktop

### 🔒 Security
- Identified 2 moderate vulnerabilities (esbuild - dev only)
- Vulnerabilities only affect development server, not production
- Production builds are secure and safe to deploy

### 📦 Build Info
- Bundle size: ~448 KB JS (gzipped: ~129 KB)
- CSS size: ~22 KB (gzipped: ~5 KB)
- Build time: ~31 seconds
- Total modules: 1,962

---

## [1.0.0] - Initial Release
- Initial implementation of Goldhaus Langen website
- Hero section with image carousel
- Services section with 6 service cards
- Instagram gallery integration
- Contact form with EmailJS
- Google Maps integration
- Responsive design
- Cookie consent
- Legal pages (Impressum, Datenschutz, AGB)

