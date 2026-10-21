import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
    DetectionResult,
    Product,
    FilterOptions,
    UserLocation,
    SavedItem,
    ScanHistory,
    Screen,
    StylingAdvice
} from '../types';

export type ScanStage = 'idle' | 'compressing' | 'analyzing' | 'searching' | 'styling';

interface AppState {
    // Current screen
    currentScreen: Screen;
    setCurrentScreen: (screen: Screen) => void;

    // Onboarding
    onboardingCompleted: boolean;
    setOnboardingCompleted: (completed: boolean) => void;

    // Scan flow tracking
    scanStage: ScanStage;
    setScanStage: (stage: ScanStage) => void;
    hasScannedOnce: boolean;
    setHasScannedOnce: (value: boolean) => void;
    lastScannedImage: string | null;
    setLastScannedImage: (image: string | null) => void;
    scanError: string | null;
    setScanError: (error: string | null) => void;

    // Detection & Products
    currentDetection: DetectionResult | null;
    setCurrentDetection: (detection: DetectionResult | null) => void;

    currentProducts: Product[];
    setCurrentProducts: (products: Product[]) => void;

    currentStyling: StylingAdvice | null;
    setCurrentStyling: (styling: StylingAdvice | null) => void;

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
    loading: boolean;
    setLoading: (loading: boolean) => void;

    isDetecting: boolean;
    setIsDetecting: (loading: boolean) => void;

    isSearching: boolean;
    setIsSearching: (loading: boolean) => void;

    // Hydration
    _hasHydrated: boolean;
    _setHasHydrated: (state: boolean) => void;
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
    currentScreen: 'scanner' as Screen,
    setCurrentScreen: (screen: Screen) => set({ currentScreen: screen }),

    // Onboarding
    onboardingCompleted: false,
    setOnboardingCompleted: (completed) => {
        set({ onboardingCompleted: completed });
        AsyncStorage.setItem('onboardingCompleted', JSON.stringify(completed));
    },

    // Scan flow tracking
    scanStage: 'idle' as ScanStage,
    setScanStage: (stage) => set({ scanStage: stage }),
    hasScannedOnce: false,
    setHasScannedOnce: (value) => set({ hasScannedOnce: value }),
    lastScannedImage: null,
    setLastScannedImage: (image) => set({ lastScannedImage: image }),
    scanError: null,
    setScanError: (error) => set({ scanError: error }),

    // Detection & Products
    currentDetection: null,
    setCurrentDetection: (detection) => set({ currentDetection: detection }),

    currentProducts: [],
    setCurrentProducts: (products) => set({ currentProducts: products }),

    currentStyling: null,
    setCurrentStyling: (styling) => set({ currentStyling: styling }),

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
    savedItems: [],
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
    scanHistory: [],
    addScanHistory: (scan) => {
        set((state) => {
            const newHistory = [scan, ...state.scanHistory].slice(0, 50); // Keep last 50
            saveScanHistory(newHistory);
            return { scanHistory: newHistory };
        });
    },

    // Loading states
    loading: false,
    setLoading: (loading) => set({ loading }),

    isDetecting: false,
    setIsDetecting: (loading) => set({ isDetecting: loading }),

    isSearching: false,
    setIsSearching: (loading) => set({ isSearching: loading }),

    // Hydration
    _hasHydrated: false,
    _setHasHydrated: (state) => set({ _hasHydrated: state })
}));

// AsyncStorage helpers
async function loadSavedItems(): Promise<SavedItem[]> {
    try {
        const saved = await AsyncStorage.getItem('savedItems');
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Failed to load saved items:', error);
        return [];
    }
}

async function saveSavedItems(items: SavedItem[]) {
    try {
        await AsyncStorage.setItem('savedItems', JSON.stringify(items));
    } catch (error) {
        console.error('Failed to save items:', error);
    }
}

async function loadScanHistory(): Promise<ScanHistory[]> {
    try {
        const history = await AsyncStorage.getItem('scanHistory');
        return history ? JSON.parse(history) : [];
    } catch (error) {
        console.error('Failed to load scan history:', error);
        return [];
    }
}

async function saveScanHistory(history: ScanHistory[]) {
    try {
        await AsyncStorage.setItem('scanHistory', JSON.stringify(history));
    } catch (error) {
        console.error('Failed to save history:', error);
    }
}

// Hydrate the store on app start
async function hydrateStore() {
    try {
        const [savedItems, scanHistory, onboardingStored] = await Promise.all([
            loadSavedItems(),
            loadScanHistory(),
            AsyncStorage.getItem('onboardingCompleted')
        ]);

        useAppStore.setState({
            savedItems,
            scanHistory,
            onboardingCompleted: onboardingStored ? JSON.parse(onboardingStored) : false,
            _hasHydrated: true
        });
    } catch (error) {
        console.error('Failed to hydrate store:', error);
        useAppStore.setState({ _hasHydrated: true });
    }
}

// Initialize store hydration
hydrateStore();
