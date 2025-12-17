# 📱 App Store Deployment Guide

This guide explains how to build your app and submit it to the Apple App Store and Google Play Store.

## 🚀 Getting Started

Your app is now set up with **Capacitor**, which wraps your web code in a native container.

### Core Commands

```bash
# 1. Build your web app (Frontend)
npm run build

# 2. Sync changes to native projects (iOS/Android)
npx cap sync

# 3. Open native IDEs
npx cap open android   # Opens Android Studio
npx cap open ios       # Opens Xcode (Requires Mac)
```

---

## 🤖 Android Deployment (Google Play)

### Prerequisites
- **Android Studio** (Installed)
- **Google Play Developer Account** ($25 one-time fee)

### Steps to Build & Submit

1. **Open Android Project**
   ```bash
   npx cap open android
   ```

2. **Generate Signed Bundle (AAB)**
   - In Android Studio, go to **Build > Generate Signed Bundle / APK**
   - Select **Android App Bundle** (Recommended for Play Store)
   - Create a new Key Store (keep this safe! you need it for updates)
   - Select "Release" build variant
   - Click **Finish**

3. **Upload to Play Console**
   - Go to [Google Play Console](https://play.google.com/console)
   - Create a new app
   - Upload the `.aab` file you generated
   - Fill in store listing (screenshots, description, icons)
   - Submit for review!

---

## 🍎 iOS Deployment (App Store)

### Prerequisites
- **Mac Computer** (Required for Xcode)
- **Xcode** (Installed)
- **Apple Developer Account** ($99/year)

### Steps to Build & Submit

1. **Open iOS Project**
   ```bash
   npx cap open ios
   ```

2. **Configure Signing**
   - In Xcode, click only the project name (left sidebar)
   - Go to **Signing & Capabilities** tab
   - Select your Team (Apple ID)
   - Ensure "Automatically manage signing" is checked

3. **Archive & Upload**
   - Select "Any iOS Device (arm64)" as build target
   - Go to **Product > Archive**
   - Once finished, the Organizer window will open
   - Click **Distribute App**
   - Select **App Store Connect** -> **Upload**
   - Follow prompts to upload

4. **Submit via App Store Connect**
   - Go to [App Store Connect](https://appstoreconnect.apple.com)
   - Create new app
   - Select the build you just uploaded
   - Add screenshots and metadata
   - Submit for review!

---

## ☁️ Cloud Build Option (No Mac Needed)

If you don't have a Mac for iOS builds, use **Ionic Appflow**:

1. Create account on [ionic.io](https://ionic.io)
2. Connect your GitHub repository
3. Set up a "Package Build"
4. Select "iOS" target
5. Download the `.ipa` file
6. Use "Transporter" app (on any Mac you can borrow) or cloud upload tools to submit.

---

## 🎨 App Assets

Don't forget to generate your app icons and splash screens!

**Automatic Generation:**
You can use `capacitor-assets` to generate all icons automatically:
```bash
npx @capacitor/assets generate
```
(Requires `assets/icon.png` and `assets/splash.png` in your project root)
