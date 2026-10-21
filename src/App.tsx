import { useEffect } from 'react';
import { Scanner } from './components/Scanner';
import { MyCloset } from './components/MyCloset';
import { StyleResultSheet } from './components/StyleResultSheet';
import { VirtualTryOn } from './components/VirtualTryOn';
import { ProductList } from './components/ProductList';
import { useAppStore } from './store/useAppStore';
import { compressImage } from './utils/imageUtils';
import { scanImage } from './services/productService';
import { getCurrentLocation } from './services/storeService';
import type { Product } from './types';

export default function App() {
  const {
    currentScreen,
    setCurrentScreen,
    selectedProduct,
    setSelectedProduct,
    currentProducts,
    setCurrentProducts,
    setUserLocation,
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
      console.log('📱 [CLIENT] Image captured, size:', imageData.length);

      // If we received a URI (file:// or http) convert to base64 first
      let payload = imageData;
      if (!imageData.startsWith('data:')) {
        try {
          console.log('🔄 [CLIENT] Compressing image...');
          payload = await compressImage(imageData);
          console.log('✅ [CLIENT] Compressed to', payload.length, 'bytes');
        } catch (err) {
          console.warn('Image compression failed, proceeding with original uri:', err);
          // proceed with original imageData; server will validate
        }
      }

      // Run unified scan endpoint (Vision + product search)
      setIsSearching(true);
      console.log('🚀 [CLIENT] Calling /api/scan...');
      const scanResp = await scanImage(payload);
      console.log('✅ [CLIENT] Got scan response:', {
        products: scanResp?.products?.length || 0,
        message: scanResp?.message,
        detections: scanResp?.detectedAttributes?.detections?.length || 0
      });

      setIsDetecting(false);

      if (scanResp?.message === 'No clear clothing detected' || !scanResp?.products || scanResp.products.length === 0) {
        console.warn('❌ [CLIENT] No products returned:', scanResp?.message || 'Empty array');
        if (scanResp?.message) {
          if (typeof window !== 'undefined') alert(scanResp.message);
        } else {
          if (typeof window !== 'undefined') alert('No matches found. Try another angle.');
        }
        setIsSearching(false);
        return;
      }

      const detection = scanResp.detectedAttributes?.detections?.[0];
      console.log('📊 [CLIENT] Setting', scanResp.products.length, 'products to store');
      setCurrentProducts(scanResp.products || []);

      // Save scan history with products found
      try {
        addScanHistory({
          id: `scan_${Date.now()}`,
          imageUrl: payload,
          detection,
          timestamp: new Date().toISOString(),
          productsFound: (scanResp.products || []).length
        });
      } catch (e) {
        // ignore
      }

      setIsSearching(false);
      console.log('🎯 [CLIENT] Navigating to results screen');
      setCurrentScreen('results');

    } catch (error: any) {
      console.error('❌ [CLIENT] Detection/Search error:', error);
      if (typeof window !== 'undefined') {
        alert(error.message || 'Failed to process image. Please try again.');
      }
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
              <span className="text-xs">Scanner</span>
            </button>
            <button
              onClick={() => currentProducts.length > 0 && setCurrentScreen('results')}
              disabled={currentProducts.length === 0}
              className={`flex flex-col items-center gap-1 transition-all ${currentScreen === 'results' ? 'text-emerald-600 scale-110' : 'text-slate-400'
                } ${currentProducts.length === 0 ? 'opacity-50' : ''}`}
            >
              <span className="text-xs">Results</span>
            </button>
            <button
              onClick={() => setCurrentScreen('closet')}
              className={`flex flex-col items-center gap-1 transition-all ${currentScreen === 'closet' ? 'text-emerald-600 scale-110' : 'text-slate-400'
                }`}
            >
              <span className="text-xs">My Closet</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}