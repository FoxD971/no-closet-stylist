# 🚀 Setup Guide - Fashion Scanner

## Step-by-Step Setup Instructions

### 1. Install Dependencies

Open PowerShell in the project directory and run:

```powershell
npm install
```

This will install all required packages (~5 minutes).

### 2. Get Your API Keys

#### A. Google Cloud Vision API (Required)

1. Go to https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Click "Enable APIs and Services"
4. Search for "Cloud Vision API" and enable it
5. Go to "Credentials" → "Create Credentials" → "API Key"
6. Copy the API key

**Cost**: First 1,000 images/month FREE, then $1.50 per 1,000

#### B. SerpAPI (Required)

1. Go to https://serpapi.com/users/sign_up
2. Sign up for free account
3. Go to dashboard and copy your API key

**Cost**: 100 searches/month FREE, then $50/month for 5,000

#### C. Google Maps Platform (Required)

1. Go to https://console.cloud.google.com/
2. In the same project, enable these APIs:
   - Places API
   - Geocoding API
3. Use the same API key from step A (or create a new one)

**Cost**: $200 FREE credit/month (covers ~28,000 requests)

### 3. Configure Environment Variables

1. Copy the example file:
```powershell
Copy-Item .env.example .env
```

2. Open `.env` in a text editor and fill in your API keys:

```env
# Backend API Keys (REQUIRED)
GOOGLE_CLOUD_VISION_API_KEY=AIzaSy...your_key_here
SERPAPI_KEY=abc123...your_key_here
GOOGLE_MAPS_API_KEY=AIzaSy...your_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend (Optional - for Supabase)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### 4. Run the App

**Option A: Run Everything Together (Recommended)**
```powershell
npm run dev:full
```

This starts both frontend (port 3000) and backend (port 3001).

**Option B: Run Separately**

Terminal 1 - Frontend:
```powershell
npm run dev
```

Terminal 2 - Backend:
```powershell
npm run server
```

### 5. Open the App

Open your browser to: **http://localhost:3000**

## ✅ Verify Everything Works

### Test 1: Scanner
1. Click the camera icon
2. Upload a clothing image (or use the gallery button)
3. Wait for AI detection (~2-3 seconds)
4. You should see product results

### Test 2: Filters
1. After scanning, click "Filters" button
2. Adjust price range
3. Select retailers
4. Click "Apply Filters"
5. Results should update

### Test 3: Store Locator
1. Allow location permissions when prompted
2. Products with nearby stores will show distance
3. Click a product to see store details

## 🐛 Common Issues

### Issue: "Cannot find module 'react'"
**Solution**: Run `npm install` again

### Issue: "Failed to detect clothing"
**Solutions**:
- Check your Google Vision API key is correct
- Ensure you've enabled the Cloud Vision API in Google Cloud Console
- Try a different image (clear, single clothing item)

### Issue: "Failed to search products"
**Solutions**:
- Verify SerpAPI key is correct
- Check you haven't exceeded free tier (100/month)
- Wait a few seconds and try again

### Issue: "Location error"
**Solutions**:
- Click "Allow" when browser asks for location
- If using HTTP, switch to HTTPS or localhost
- Manually set location in `src/App.tsx` (line 30)

### Issue: Backend not connecting
**Solutions**:
- Ensure backend is running on port 3001
- Check no other app is using port 3001
- Verify `.env` file exists and has correct keys

## 📊 API Usage Limits

**Free Tier Limits:**
- Google Vision: 1,000 images/month
- SerpAPI: 100 searches/month
- Google Maps: $200 credit/month (~28,000 requests)

**Tip**: The app caches results for 1 hour to minimize API calls!

## 🎯 Next Steps

1. **Test with different images**: Try shirts, shoes, dresses, etc.
2. **Explore filters**: Test price ranges, distance filters, sorting
3. **Save items**: Click the heart icon to save to "My Closet"
4. **Try virtual try-on**: Click "Try On in AR" for any product

## 💡 Pro Tips

- **Better Detection**: Use clear, well-lit photos with single items
- **More Results**: The app searches Google Shopping, so results vary by query
- **Save API Calls**: Results are cached - refresh uses cache
- **Mobile Testing**: Works great on mobile browsers (use `npm run dev -- --host`)

## 🚀 Ready to Deploy?

See `README.md` for production deployment instructions!

---

**Need help?** Check the troubleshooting section in README.md
