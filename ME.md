# 👕 Smart Fashion Scanner - Current State (ME)

## 🚀 Overview
This application has been fully migrated to **Expo SDK 54** for seamless development and testing via **Expo Go**. It is an AI-powered fashion scanning app that detects clothing items and matches them with real-world products.

## 🛠️ Current Tech Stack
- **Framework:** Expo 54 (SDK 54)
- **Core:** React Native 0.81.5 / React 19.1.0
- **Styling:** NativeWind v4 (Tailwind CSS for React Native)
- **Navigation:** React Navigation v7
- **State Management:** Zustand (with AsyncStorage persistence)
- **Animations:** React Native Reanimated 4.1.1
- **Icons:** Lucide React Native
- **Storage:** @react-native-async-storage/async-storage

## 📂 Project Structure (Current)
```
fashion-scanner/
├── 📱 App.js              - Expo Entry Point
├── 📱 src/
│   ├── NativeApp.tsx      - Main Application Root
│   ├── components/        - UI Components (NativeWind styled)
│   │   ├── Scanner.tsx    - Expo Camera integration
│   │   ├── ProductList.tsx
│   │   ├── ProductCard.tsx
│   │   ├── MyCloset.tsx
│   │   └── VirtualTryOn.tsx
│   ├── store/
│   │   └── useAppStore.ts - Zustand + AsyncStorage logic
│   ├── services/
│   │   ├── visionService.ts - Clothing detection API
│   │   └── productService.ts - Product search API
│   └── types/             - Shared TypeScript definitions
├── ⚙️ app.json            - Expo Configuration (Permissions, Plugins)
├── ⚙️ package.json        - Current aligned dependencies
└── 🎨 tailwind.config.js  - NativeWind/Tailwind Configuration
```

## 🔄 Recent Compatibility Fixes (for Expo Go)
1. **Removed Capacitor:** All web-specific native wrappers (Capacitor) were removed in favor of pure Expo modules.
2. **Fixed Storage:** Replaced browser `localStorage` with `AsyncStorage` to prevent runtime crashes on mobile.
3. **Version Alignment:** Forced versions to match Expo Go's pre-built modules:
   - React Native: `0.81.5`
   - Reanimated: `~4.1.1`
   - React: `19.1.0`
4. **Resolved Worklets Conflict:** Removed direct `react-native-worklets` dependency as it conflicted with Reanimated's internal versioning.
5. **Permissions:** Configured `app.json` with necessary `NSCameraUsageDescription` and `NSLocationWhenInUseUsageDescription` for iOS/Android.

## 🏃 How to Run
1. Ensure dependencies are installed: `npm install`
2. Start the Expo server: `npx expo start --clear`
3. Scan the QR code with your **Expo Go** app (Android) or Camera app (iOS).

## 💡 Important Notes
- **API Base URL:** Currently defaults to `http://localhost:3000/api`. Update `EXPO_PUBLIC_API_URL` in your environment variables for production or remote testing.
- **Hydration:** The store now hydrates asynchronously from `AsyncStorage` on app launch.
