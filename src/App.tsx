import { useEffect } from 'react';
import { Scanner } from './components/Scanner';
import { MyCloset } from './components/MyCloset';
import { StyleResultSheet } from './components/StyleResultSheet';
import { VirtualTryOn } from './components/VirtualTryOn';
import { ProductList } from './components/ProductList';
import { Camera, Sparkles, ShoppingBag } from 'lucide-react';
import { useAppStore } from './store/useAppStore';
import { detectClothing } from './services/visionService';
import { searchProducts } from './services/productService';
import { getCurrentLocation } from './services/storeService';
import type { Product } from './types';

export default function App() {
  const {
    currentScreen,
    setCurrentScreen,
    selectedProduct,
    setSelectedProduct,
    setCurrentDetection,
    currentProducts,
    setCurrentProducts,
    setUserLocation,
    isDetecting,
    setIsDetecting,
    isSearching,
    setIsSearching,
    addScanHistory
  } = useAppStore();

  // Get user location on mount
  useEffect(() => {
    getCurrentLocation()
      .then(location => setUserLocation(location))
      .catch(err => console.error('Location error:', err));
  }, [setUserLocation]);

  const handleImageCapture = async (imageData: string) => {
    try {
      setIsDetecting(true);

      // Detect clothing in image
      const visionResult = await detectClothing(imageData);

      if (!visionResult.success || visionResult.detections.length === 0) {
        alert('No clothing detected. Please try another image.');
        setIsDetecting(false);
        return;
      }

      const detection = visionResult.detections[0];
      setCurrentDetection(detection);

      // Save to scan history
      addScanHistory({
        id: `scan_${Date.now()}`,
        imageUrl: imageData,
        detection,
        timestamp: new Date().toISOString(),
        productsFound: 0
      });

      setIsDetecting(false);
      setIsSearching(true);

      // Build search query from detection
      const searchQuery = [
        detection.attributes.colors?.[0],
        detection.subcategory || detection.category,
        detection.attributes.brand
      ].filter(Boolean).join(' ');

      // Search for products
      const productResults = await searchProducts(searchQuery, {
        categories: [detection.category]
      });

      setCurrentProducts(productResults.products);
      setIsSearching(false);
      setCurrentScreen('results');

    } catch (error: any) {
      console.error('Detection/Search error:', error);
      alert(error.message || 'Failed to process image. Please try again.');
      setIsDetecting(false);
      setIsSearching(false);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleTryOn = () => {
    if (selectedProduct) {
      setCurrentScreen('tryon');
    }
  };

  const handleClose = () => {
    setCurrentScreen('scanner');
    setSelectedProduct(null);
  };

  const handleBackToResults = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="h-screen w-full bg-white overflow-hidden relative">
      {/* Main Content */}
      {currentScreen === 'scanner' && (
        <Scanner
          onImageCapture={handleImageCapture}
          isDetecting={isDetecting}
        />
      )}

      {currentScreen === 'closet' && (
        <MyCloset />
      )}

      {currentScreen === 'results' && !selectedProduct && (
        <div className="h-full flex flex-col">
          {isSearching ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-600">Finding best matches...</p>
              </div>
            </div>
          ) : (
            <ProductList
              products={currentProducts}
              onProductClick={handleProductClick}
            />
          )}
        </div>
      )}

      {currentScreen === 'tryon' && selectedProduct && (
        <VirtualTryOn
          product={selectedProduct}
          onClose={handleClose}
        />
      )}

      {/* Product Detail Sheet Overlay */}
      {selectedProduct && currentScreen === 'results' && (
        <StyleResultSheet
          product={selectedProduct}
          onClose={handleBackToResults}
          onTryOn={handleTryOn}
        />
      )}

      {/* Bottom Navigation */}
      {(currentScreen === 'scanner' || currentScreen === 'closet' || currentScreen === 'results') && (
        <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 safe-bottom shadow-2xl z-30">
          <div className="flex justify-around items-center px-8 py-4">
            <button
              onClick={() => setCurrentScreen('scanner')}
              className={`flex flex-col items-center gap-1 transition-all ${currentScreen === 'scanner' ? 'text-emerald-600 scale-110' : 'text-slate-400'
                }`}
            >
              <Camera className="w-6 h-6" />
              <span className="text-xs">Scanner</span>
            </button>
            <button
              onClick={() => currentProducts.length > 0 && setCurrentScreen('results')}
              disabled={currentProducts.length === 0}
              className={`flex flex-col items-center gap-1 transition-all ${currentScreen === 'results' ? 'text-emerald-600 scale-110' : 'text-slate-400'
                } ${currentProducts.length === 0 ? 'opacity-50' : ''}`}
            >
              <ShoppingBag className="w-6 h-6" />
              <span className="text-xs">Results</span>
            </button>
            <button
              onClick={() => setCurrentScreen('closet')}
              className={`flex flex-col items-center gap-1 transition-all ${currentScreen === 'closet' ? 'text-emerald-600 scale-110' : 'text-slate-400'
                }`}
            >
              <Sparkles className="w-6 h-6" />
              <span className="text-xs">My Closet</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}