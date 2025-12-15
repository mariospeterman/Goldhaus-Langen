# Fixing GoldAPI 403 Error on Vercel

## Problem
The price ticker shows "Preise konnten nicht geladen werden" and returns 403 errors from GoldAPI.

## Solution

### 1. Set Environment Variable in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name:** `VITE_GOLDAPI_KEY`
   - **Value:** Your actual GoldAPI key (e.g., `goldapi-5z18ld4gkwkcydf4-io`)
   - **Environment:** Select all (Production, Preview, Development)
4. **Important:** After adding/updating the variable, you MUST redeploy:
   - Go to **Deployments** tab
   - Click the **⋯** menu on the latest deployment
   - Select **Redeploy**

### 2. Verify the API Key

- Make sure there are **no spaces** before or after the key
- The key should start with `goldapi-`
- Check your GoldAPI dashboard to ensure:
  - The key is active
  - You haven't exceeded your monthly quota (100 requests/month for free tier)
  - The key hasn't expired

### 3. Check the API Key Format

The key should look like: `goldapi-5z18ld4gkwkcydf4-io`

**Common mistakes:**
- ❌ Extra spaces: ` goldapi-5z18ld4gkwkcydf4-io `
- ❌ Wrong variable name: `GOLDAPI_KEY` (should be `VITE_GOLDAPI_KEY`)
- ❌ Missing `VITE_` prefix (required for Vite to expose the variable)

## What I Fixed

1. **Improved API Key Validation:**
   - Now trims whitespace automatically
   - Better checks for placeholder values
   - Added debug logging in development

2. **Better Error Handling:**
   - Improved 403 error handling with better cache fallback
   - More helpful error messages
   - Checks both in-memory and localStorage cache

3. **Fixed Percentage Display:**
   - Now properly handles `change_percent` from API
   - Shows "—" instead of "+0.00%" when change is 0
   - Better calculation from cached prices if API doesn't return change

4. **Enhanced Caching:**
   - Better fallback to cached data when API fails
   - Checks multiple cache sources (in-memory, localStorage)
   - More resilient to API errors

## Testing

After redeploying with the correct environment variable:

1. Open browser console (F12)
2. Look for: `PriceTicker: Using GoldAPI key: goldapi-5z...`
3. Check network tab for successful API calls (status 200)
4. Verify prices are displayed correctly

## If Still Not Working

1. **Check Vercel Build Logs:**
   - Go to your deployment
   - Check if `VITE_GOLDAPI_KEY` is being read correctly
   - Look for any build errors

2. **Verify API Key:**
   - Test the key directly: `curl -X GET 'https://www.goldapi.io/api/XAU/EUR' -H 'x-access-token: YOUR_KEY'`
   - Check your GoldAPI dashboard for quota/status

3. **Clear Browser Cache:**
   - The app uses localStorage caching
   - Clear site data if needed

4. **Check Rate Limits:**
   - Free tier: 100 requests/month
   - The app uses ~90 requests/month (3 metals × 1 call/day × 30 days)
   - If exceeded, wait for next month or upgrade plan


