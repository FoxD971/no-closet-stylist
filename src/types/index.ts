// ============================================
// DETECTION & PRODUCT TYPES
// ============================================

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
}

export interface Retailer {
    id: string;
    name: string;
    logo?: string;
    website: string;
}

// ============================================
// STORE & LOCATION TYPES
// ============================================

export interface Store {
    id: string;
    name: string;
    retailer: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    phone?: string;
    hours?: string;
    rating?: number;
}

export interface StoreAvailability {
    store: Store;
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
    priceRange: {
        min: number;
        max: number;
    };
    maxDistance?: number;
    retailers: string[];
    brands: string[];
    categories: string[];
    inStockOnly: boolean;
    storePickupOnly: boolean;
    sortBy: SortOption;
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

export type Screen = 'scanner' | 'closet' | 'results' | 'tryon';

// Legacy type for backward compatibility
export interface ProductMatch extends Product { }
