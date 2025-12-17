# 🎯 Smart Fashion Scanner

An AI-powered fashion scanning app that detects clothing items, finds real products from multiple retailers, compares prices, and shows nearby store locations with comprehensive filtering options.

## ✨ Features

- **AI Clothing Detection** - Google Cloud Vision API identifies clothing items, colors, patterns, and brands
- **Real Product Search** - SerpAPI Google Shopping finds actual products across multiple retailers
- **Price Comparison** - Compare prices and find the best deals automatically
- **Store Locator** - Find nearby stores with Google Places API and distance calculation
- **Smart Filtering** - Filter by price, distance, retailer, brand, and availability
- **Advanced Sorting** - Sort by price, distance, rating, or relevance
- **Virtual Try-On** - AR-powered visualization with size and color selection
- **My Closet** - Save favorite items and track scan history

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Framer Motion (animations)
- Tailwind CSS (styling)
- Zustand (state management)
- React Query (data fetching)

**Backend:**
- Node.js + Express
- TypeScript
- Node-Cache (request caching)

**APIs:**
- Google Cloud Vision API (AI detection)
- SerpAPI Google Shopping (product search)
- Google Maps Platform (store locations)
- Supabase (database - optional)

## 📋 Prerequisites

1. **Node.js** 18+ and npm
2. **API Keys** (see setup below)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then fill in your API keys:

```env
# Frontend (Supabase - optional)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend (Required)
GOOGLE_CLOUD_VISION_API_KEY=your_google_vision_api_key
SERPAPI_KEY=your_serpapi_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Server
PORT=3001
NODE_ENV=development
```

### 3. Get API Keys

#### Google Cloud Vision API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Cloud Vision API"
4. Create credentials → API Key
5. Copy the API key

#### SerpAPI
1. Sign up at [SerpAPI](https://serpapi.com/)
2. Get your API key from dashboard
3. Free tier: 100 searches/month

#### Google Maps Platform
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable "Places API" and "Geocoding API"
3. Create credentials → API Key
4. Copy the API key

### 4. Run the App

**Development mode (runs both frontend and backend):**
```bash
npm run dev:full
```

**Or run separately:**

Frontend:
```bash
npm run dev
```

Backend:
```bash
npm run server
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📁 Project Structure

```
fashion-scanner/
├── src/
│   ├── components/          # React components
│   │   ├── Scanner.tsx      # Camera/upload interface
│   │   ├── ProductList.tsx  # Product grid with filters
│   │   ├── ProductCard.tsx  # Individual product display
│   │   ├── FilterPanel.tsx  # Advanced filtering UI
│   │   ├── MyCloset.tsx     # Saved items
│   │   └── ...
│   ├── services/            # API integrations
│   │   ├── visionService.ts # AI detection
│   │   ├── productService.ts# Product search
│   │   └── storeService.ts  # Store locator
│   ├── store/               # State management
│   │   └── useAppStore.ts   # Zustand store
│   ├── types/               # TypeScript definitions
│   ├── utils/               # Helper functions
│   └── App.tsx              # Main app component
├── server/                  # Backend API
│   ├── routes/
│   │   ├── vision.ts        # Vision API endpoint
│   │   ├── products.ts      # Product search endpoint
│   │   └── stores.ts        # Store locator endpoint
│   └── index.ts             # Express server
├── public/                  # Static assets
└── package.json
```

## 🎨 How It Works

### 1. Image Scanning
- User uploads or captures an image
- Image is compressed and sent to backend
- Google Vision API detects clothing items
- Extracts: category, colors, patterns, brands

### 2. Product Search
- Detection results build search query
- SerpAPI searches Google Shopping
- Results are parsed and formatted
- Products cached for performance

### 3. Store Locator
- User's location obtained via geolocation
- Google Places API finds nearby stores
- Distance calculated using Haversine formula
- Store details fetched (hours, phone, address)

### 4. Filtering & Sorting
- Client-side filtering for instant results
- Filter by: price, distance, retailer, brand
- Sort by: price, distance, rating, relevance
- Active filters displayed as chips

## 🔧 Configuration

### Cache Settings
The backend caches API responses for 1 hour by default. Adjust in `server/index.ts`:

```typescript
export const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour
```

### Search Results
Adjust number of products returned in `server/routes/products.ts`:

```typescript
num: 20, // Number of results per page
```

### Distance Units
Change between miles/kilometers in `src/services/storeService.ts`:

```typescript
calculateDistance(lat1, lon1, lat2, lon2, 'mi') // or 'km'
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Deploy Backend
- Deploy to Heroku, Railway, or any Node.js hosting
- Set environment variables
- Ensure PORT is set correctly

### Deploy Frontend
- Deploy to Vercel, Netlify, or Cloudflare Pages
- Set `VITE_` environment variables
- Update API proxy in `vite.config.ts` to point to production backend

## 📊 API Costs (Approximate)

- **Google Cloud Vision**: $1.50 per 1,000 images (first 1,000/month free)
- **SerpAPI**: Free tier 100 searches/month, then $50/month for 5,000
- **Google Maps**: $7 per 1,000 requests (first $200/month free credit)

## 🐛 Troubleshooting

### "No clothing detected"
- Ensure image is clear and well-lit
- Try images with single clothing items
- Check Google Vision API key is valid

### "Failed to search products"
- Verify SerpAPI key is correct
- Check you haven't exceeded free tier limits
- Ensure backend server is running

### "Location error"
- Allow location permissions in browser
- Check HTTPS (geolocation requires secure context)
- Fallback: manually set location in code

### CORS Errors
- Ensure backend is running on port 3001
- Check Vite proxy configuration
- Verify CORS is enabled in Express

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 🙏 Acknowledgments

- Google Cloud Vision for AI detection
- SerpAPI for product search
- Google Maps Platform for location services
- shadcn/ui for UI components
- Unsplash for placeholder images

---

**Built with ❤️ using enterprise-grade, production-ready technologies**
