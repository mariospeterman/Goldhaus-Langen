# 📸 Instagram Live Feed Setup Guide

## 🎯 **Quick Setup (Recommended)**

### **Option 1: Instagram Basic Display API (Free)**

1. **Go to Facebook Developers**: https://developers.facebook.com/
2. **Create App**: Choose "Consumer" or "Other" type
3. **Add Instagram Basic Display**: In your app dashboard
4. **Get Credentials**:
   - User ID: Found in Instagram Basic Display settings
   - Access Token: Generate long-lived token (60 days)

5. **Add to Environment Variables**:
```bash
# .env.local
VITE_INSTAGRAM_ACCESS_TOKEN=your_long_lived_access_token
VITE_INSTAGRAM_USER_ID=your_user_id
```

### **Option 2: EmbedSocial Widget (Easiest)**

1. **Sign up**: https://embedsocial.com/
2. **Connect Instagram**: Link your account
3. **Get Widget ID**: Copy the widget ID
4. **Add to Environment**:
```bash
# .env.local
VITE_EMBED_SOCIAL_WIDGET_ID=your_widget_id
```

### **Option 3: RSS Feed Method**

1. **Use RSS.app**: https://rss.app/
2. **Connect Instagram**: Enter your username
3. **Get RSS URL**: Copy the generated URL
4. **Add to Environment**:
```bash
# .env.local
VITE_INSTAGRAM_RSS_URL=your_rss_feed_url
```

## 🔧 **Implementation**

The code automatically handles:
- ✅ **Auto-refresh**: Every 30 minutes
- ✅ **Fallback images**: If Instagram fails
- ✅ **Error handling**: Graceful degradation
- ✅ **Mobile carousel**: 4-second rotation
- ✅ **Desktop grid**: 3 images with hover effects

## 🚀 **Features**

- **Dynamic Updates**: New posts appear automatically
- **Responsive Design**: Different layouts for mobile/desktop
- **Hover Effects**: Image scaling and caption overlay
- **Error Recovery**: Falls back to gallery images
- **Performance**: Optimized loading and caching

## 📱 **Mobile Experience**

- **Auto-carousel**: Images change every 4 seconds
- **Touch-friendly**: Smooth transitions
- **Optimized**: Single image view for better performance

## 🖥️ **Desktop Experience**

- **Grid layout**: 3 images side by side
- **Hover effects**: Scale and caption overlay
- **Interactive**: Click to view full posts

## ⚠️ **Important Notes**

1. **Instagram API Limits**: Basic Display API has rate limits
2. **Token Expiry**: Long-lived tokens expire in 60 days
3. **CORS Issues**: Direct API calls may fail in production
4. **Fallback**: Always have backup images ready

## 🔄 **Auto-Refresh Logic**

```javascript
// Refreshes every 30 minutes
const refreshInterval = setInterval(loadInstagramData, 30 * 60 * 1000);

// Mobile carousel rotates every 4 seconds
const carouselInterval = setInterval(() => {
  setCurrent((prev) => (prev + 1) % images.length);
}, 4000);
```

## 🎨 **Customization**

You can modify:
- **Refresh interval**: Change `30 * 60 * 1000` to your preference
- **Carousel speed**: Change `4000` to adjust rotation speed
- **Fallback images**: Update the array in `instagram.js`
- **Hover effects**: Modify CSS classes in the component

## 🛠️ **Troubleshooting**

### **Common Issues**:

1. **"Failed to load Instagram feed"**
   - Check your access token
   - Verify user ID is correct
   - Ensure Instagram account is public

2. **"CORS error"**
   - Use a CORS proxy for RSS feeds
   - Consider using EmbedSocial widget
   - Check if Instagram API is accessible

3. **"Images not loading"**
   - Verify image URLs are valid
   - Check network connectivity
   - Fallback images should load automatically

### **Debug Mode**:

Add this to see what's happening:
```javascript
console.log('Instagram data:', instagramData);
console.log('Images state:', images);
```

## 📊 **Performance Tips**

1. **Image Optimization**: Use WebP format
2. **Lazy Loading**: Images load as needed
3. **Caching**: Browser caches API responses
4. **Fallback**: Always have backup images

## 🔐 **Security Notes**

- **Never expose tokens**: Use environment variables
- **Rate limiting**: Respect Instagram's limits
- **HTTPS only**: Always use secure connections
- **Token rotation**: Refresh tokens regularly

## 📈 **Analytics**

Track Instagram engagement:
- **Click rates**: Monitor image interactions
- **Load times**: Optimize performance
- **Error rates**: Monitor API failures
- **User engagement**: Track hover/click events

---

**Need help?** Check the console for error messages and ensure your Instagram account is public and properly connected.
