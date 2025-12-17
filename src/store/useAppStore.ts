import { create } from 'zustand';
import type {
    DetectionResult,
    Product,
    FilterOptions,
    UserLocation,
    SavedItem,
    ScanHistory,
    Screen
} from '../types';

interface AppState {
    // Current screen
    currentScreen: Screen;
    setCurrentScreen: (screen: Screen) => void;

    // Detection & Products
    currentDetection: DetectionResult | null;
    setCurrentDetection: (detection: DetectionResult | null) => void;

    currentProducts: Product[];
    setCurrentProducts: (products: Product[]) => void;

    selectedProduct: Product | null;
    setSelectedProduct: (product: Product | null) => void;

    // Filters
    filters: FilterOptions;
    setFilters: (filters: Partial<FilterOptions>) => void;
    resetFilters: () => void;

    // Location
    userLocation: UserLocation | null;
    setUserLocation: (location: UserLocation | null) => void;

    // Saved items
    savedItems: SavedItem[];
    addSavedItem: (product: Product) => void;
    removeSavedItem: (id: string) => void;
    isSaved: (productId: string) => boolean;

    // Scan history
    scanHistory: ScanHistory[];
    addScanHistory: (scan: ScanHistory) => void;

    // Loading states
    isDetecting: boolean;
    setIsDetecting: (loading: boolean) => void;

    isSearching: boolean;
    setIsSearching: (loading: boolean) => void;
}

const defaultFilters: FilterOptions = {
    priceRange: { min: 0, max: 1000 },
    maxDistance: undefined,
    retailers: [],
    brands: [],
    categories: [],
    inStockOnly: false,
    storePickupOnly: false,
    sortBy: 'relevance'
};

export const useAppStore = create<AppState>((set, get) => ({
    // Screen
    currentScreen: 'scanner',
    setCurrentScreen: (screen) => set({ currentScreen: screen }),

    // Detection & Products
    currentDetection: null,
    setCurrentDetection: (detection) => set({ currentDetection: detection }),

    currentProducts: [],
    setCurrentProducts: (products) => set({ currentProducts: products }),

    selectedProduct: null,
    setSelectedProduct: (product) => set({ selectedProduct: product }),

    // Filters
    filters: defaultFilters,
    setFilters: (newFilters) =>
        set((state) => ({
            filters: { ...state.filters, ...newFilters }
        })),
    resetFilters: () => set({ filters: defaultFilters }),

    // Location
    userLocation: null,
    setUserLocation: (location) => set({ userLocation: location }),

    // Saved items
    savedItems: loadSavedItems(),
    addSavedItem: (product) => {
        const savedItem: SavedItem = {
            id: `saved_${Date.now()}`,
            product,
            savedAt: new Date().toISOString()
        };
        set((state) => {
            const newSavedItems = [...state.savedItems, savedItem];
            saveSavedItems(newSavedItems);
            return { savedItems: newSavedItems };
        });
    },
    removeSavedItem: (id) => {
        set((state) => {
            const newSavedItems = state.savedItems.filter((item) => item.product.id !== id);
            saveSavedItems(newSavedItems);
            return { savedItems: newSavedItems };
        });
    },
    isSaved: (productId) => {
        return get().savedItems.some((item) => item.product.id === productId);
    },

    // Scan history
    scanHistory: loadScanHistory(),
    addScanHistory: (scan) => {
        set((state) => {
            const newHistory = [scan, ...state.scanHistory].slice(0, 50); // Keep last 50
            saveScanHistory(newHistory);
            return { scanHistory: newHistory };
        });
    },

    // Loading states
    isDetecting: false,
    setIsDetecting: (loading) => set({ isDetecting: loading }),

    isSearching: false,
    setIsSearching: (loading) => set({ isSearching: loading })
}));

// LocalStorage helpers
function loadSavedItems(): SavedItem[] {
    try {
        const saved = localStorage.getItem('savedItems');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
}

function saveSavedItems(items: SavedItem[]) {
    try {
        localStorage.setItem('savedItems', JSON.stringify(items));
    } catch (error) {
        console.error('Failed to save items:', error);
    }
}

function loadScanHistory(): ScanHistory[] {
    try {
        const history = localStorage.getItem('scanHistory');
        return history ? JSON.parse(history) : [];
    } catch {
        return [];
    }
}

function saveScanHistory(history: ScanHistory[]) {
    try {
        localStorage.setItem('scanHistory', JSON.stringify(history));
    } catch (error) {
        console.error('Failed to save history:', error);
    }
}
