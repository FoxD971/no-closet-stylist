import axios from 'axios';
import type { ProductSearchResponse, FilterOptions } from '../types';

const API_BASE = '/api';

/**
 * Search for products based on detection results
 */
export async function searchProducts(
    query: string,
    options?: Partial<FilterOptions>
): Promise<ProductSearchResponse> {
    try {
        const response = await axios.post(`${API_BASE}/products/search`, {
            query,
            category: options?.categories?.[0],
            minPrice: options?.priceRange?.min,
            maxPrice: options?.priceRange?.max,
            page: 1
        });
        return response.data;
    } catch (error: any) {
        console.error('Product search error:', error);
        throw new Error(error.response?.data?.message || 'Failed to search products');
    }
}

/**
 * Get product by ID
 */
export async function getProduct(id: string) {
    try {
        const response = await axios.get(`${API_BASE}/products/${id}`);
        return response.data;
    } catch (error: any) {
        console.error('Product fetch error:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
}

/**
 * Filter and sort products client-side
 */
export function filterProducts(products: any[], filters: FilterOptions) {
    let filtered = [...products];

    // Price range filter
    if (filters.priceRange) {
        filtered = filtered.filter(
            p => p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
        );
    }

    // Retailer filter
    if (filters.retailers.length > 0) {
        filtered = filtered.filter(p =>
            filters.retailers.includes(p.retailer.name)
        );
    }

    // Brand filter
    if (filters.brands.length > 0) {
        filtered = filtered.filter(p =>
            filters.brands.includes(p.brand)
        );
    }

    // In stock filter
    if (filters.inStockOnly) {
        filtered = filtered.filter(p => p.inStock);
    }

    // Store pickup filter
    if (filters.storePickupOnly) {
        filtered = filtered.filter(p =>
            p.storeAvailability && p.storeAvailability.some((s: any) => s.inStock)
        );
    }

    // Distance filter
    if (filters.maxDistance) {
        filtered = filtered.filter(p => {
            if (!p.storeAvailability) return false;
            return p.storeAvailability.some((s: any) => s.distance <= filters.maxDistance!);
        });
    }

    // Sort
    switch (filters.sortBy) {
        case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'distance':
            filtered.sort((a, b) => {
                const aMin = Math.min(...(a.storeAvailability?.map((s: any) => s.distance) || [Infinity]));
                const bMin = Math.min(...(b.storeAvailability?.map((s: any) => s.distance) || [Infinity]));
                return aMin - bMin;
            });
            break;
        case 'rating':
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
    }

    return filtered;
}
