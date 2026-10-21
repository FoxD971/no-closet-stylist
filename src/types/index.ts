// ============================================
// DETECTION & PRODUCT TYPES
// ============================================

export * from './professional-detection';

export interface DetectionResult {
    category: string;
    subcategory?: string;
    attributes: {
        colors: string[];
        pattern?: string;
        material?: string;
        brand?: string;
        style?: string;
    };
    confidence: number;
    boundingBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}

export interface OutfitItem {
    id: string;
    category: string; // e.g., "Shoes", "Pants"
    description: string; // e.g., "White leather sneakers"
    searchQuery: string; // Query to find this item
    matchedProducts?: Product[]; // Real products found for this item
}

export interface OutfitIdea {
    id: string;
    title: string; // e.g., "Casual Weekend"
    description: string;
    style: string; // e.g., "Streetwear"
    occasion: string; // e.g., "Brunch"
    items: OutfitItem[];
}

export interface StylingAdvice {
    outfits: OutfitIdea[];
    colorPalette: string[]; // Coordinated colors
    tips: string[];
}

export interface Offer {
    productId: string;
    title: string;
    brand?: string;
    price: number;
    currency: string;
    retailer: Retailer;
    rating?: number;
    url: string;
    imageUrl: string;
    discount?: string;
    inStock?: boolean;
    // ✨ NEW: Price intelligence
    priceTag?: 'Great Deal 🔥' | 'Good Price ✓' | 'High Price ⚠️';
    // ✨ NEW: Size & stock parsing
    detectedSize?: string;
    // ✨ NEW: Styling recommendations
    pairedWith?: Product[];
}

export interface Product {
    id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    originalPrice?: number;
    currency: string;
    imageUrl: string;
    retailer: Retailer;
    url: string;
    inStock: boolean;
    storeAvailability?: StoreAvailability[];
    rating?: number;
    reviewCount?: number;
    description?: string;
    badge?: 'Best match' | 'Similar style' | 'Budget option';
    offers?: Offer[];
    cheapestOffer?: Offer;
    bestRatedOffer?: Offer;
    // ✨ NEW: Style recommendations
    completeTheLook?: {
        category: string;
        suggestion: string;
        searchQuery: string;
        products?: Product[];
    }[];
    // ✨ NEW: Market price analysis
    marketAveragePrice?: number;
    priceDeviationPercent?: number;

    // Ranking Metadata
    matchScore?: number;
    matchReasons?: string[];
    isBestMatch?: boolean;
    isTooDifferent?: boolean;
}

export interface Retailer {
    id: string;
    name: string;
    logo?: string;
    url: string;
}

export interface EnhancedGarmentAnalysis {
    primaryColor: string;
    secondaryColors?: string[];
    garmentType: string;
    category?: string;
    pattern: string;
    material?: string;
    fit?: string;
    brand: string | null;
    quality: string;
    style: string;
    features?: string[];
    confidence?: number;
    description: string;
}

// ============================================
// STORE & LOCATION TYPES
// ============================================

export interface Store {
    id: string;
    name: string;
    retailer: string;
    address: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    phone?: string;
    hours?: string;
    rating?: number;
    // ✨ NEW: Client-side distance calculation
    distance?: number;
    distanceUnit?: 'mi' | 'km';
    inStock?: boolean;
}

export interface StoreAvailability {
    storeId: string;
    store?: Store;
    inStock: boolean;
    distance: number;
    distanceUnit: 'mi' | 'km';
    lastUpdated?: string;
}

export interface UserLocation {
    lat: number;
    lng: number;
    city?: string;
    state?: string;
    country?: string;
}

// ============================================
// FILTER & SORT TYPES
// ============================================

export interface FilterOptions {
    priceRange?: {
        min: number;
        max: number;
    };
    minPrice?: number;
    maxPrice?: number;
    maxDistance?: number;
    retailers?: string[];
    brands?: string[];
    categories?: string[];
    inStockOnly?: boolean;
    storePickupOnly?: boolean;
    sortBy?: SortOption;
}

export type SortOption =
    | 'price-asc'
    | 'price-desc'
    | 'distance'
    | 'rating'
    | 'relevance';

// ============================================
// API RESPONSE TYPES
// ============================================

export interface VisionAPIResponse {
    detections: DetectionResult[];
    query?: string;
    styling?: StylingAdvice; // ✨ NEW: AI Styling Advice
    success: boolean;
    error?: string;
}

export interface ProductSearchResponse {
    products: Product[];
    totalResults: number;
    page: number;
    hasMore: boolean;
}

export interface StoreSearchResponse {
    stores: Store[];
    totalResults: number;
}

// ============================================
// APP STATE TYPES
// ============================================

export interface ScanHistory {
    id: string;
    imageUrl: string;
    detection: DetectionResult;
    timestamp: string;
    productsFound: number;
}

export interface SavedItem {
    id: string;
    product: Product;
    savedAt: string;
    notes?: string;
}

export type ScanStage = 'idle' | 'analyzing' | 'searching' | 'complete';

export interface ScanSuggestion {
    icon: string;
    message: string;
    action?: 'retry' | 'adjust' | 'search';
}

export type Screen = 'scanner' | 'closet' | 'results' | 'tryon';

// Legacy type for backward compatibility
export interface ProductMatch extends Product { }

// ============================================
// ✨ NEW: FEATURES & EXTERNAL API TYPES
// ============================================

// Onboarding
export interface OnboardingState {
    completed: boolean;
    currentStep: number;
}

// eBay Resell
export interface ResellListing {
    title: string;
    description: string;
    category: string;
    ebayCategoryId?: string;
    suggestedPrices: {
        low: number;
        median: number;
        high: number;
    };
    images: string[];
    detectedSize?: string;
    condition?: 'new' | 'like-new' | 'good' | 'fair';
}

// Attribute Chips
export interface AttributeChip {
    type: 'color' | 'style' | 'occasion' | 'material' | 'pattern';
    label: string;
    value: string;
    confidence?: number;
}

// Image Embedding (TODO: External API)
export interface ImageEmbedding {
    vector: number[];
    model: string;
    timestamp: string;
}

// Vector Search (TODO: External API)
export interface VectorSearchResult {
    productId: string;
    similarityScore: number;
    distance: number;
}
