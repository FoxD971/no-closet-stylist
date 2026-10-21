import { DetectionResult, Product, ResellListing } from '../types';
import { searchProducts } from './productService';

export const mockEbayService = {
    search: async (query: string) => {
        return [];
    }
};

export async function generateResellListing(
    detection: DetectionResult,
    scannedImage: string,
    similarProducts: Product[] // These are already passed in! Use them first.
): Promise<ResellListing> {
    const { category, attributes } = detection;

    // Auto-generate title
    const brand = attributes.brand || '';
    const color = attributes.colors?.[0] || '';
    const pattern = attributes.pattern || '';
    const style = attributes.style || '';

    // Construct a high-intent keyword string for title
    const titleParts = [brand, color, pattern, style, category].filter(p => p && p !== 'unknown' && p !== 'none');
    const title = titleParts.join(' ').trim();

    // FETCH REAL MARKET DATA IF NEEDED
    // If similarProducts (from Lens) are good, use them. 
    // If not, perform a targeted specific search to find "Sold" comparables (or at least current listings).

    let marketPrices: number[] = [];

    if (similarProducts.length > 0) {
        marketPrices = similarProducts.map(p => p.price).filter(p => p > 0);
    }

    if (marketPrices.length < 3) {
        // Fallback: Perform a specific text search to get more price data
        console.log('💰 [RESELL] Not enough price data. Searching for market comparables...');
        const searchRes = await searchProducts(`used ${title} for sale`);
        const extraPrices = searchRes.products.map(p => p.price).filter(p => p > 0);
        marketPrices = [...marketPrices, ...extraPrices];
    }

    // Sort prices
    marketPrices.sort((a, b) => a - b);

    // Calculate stats
    let low = 0, median = 0, high = 0;

    if (marketPrices.length > 0) {
        low = marketPrices[Math.floor(marketPrices.length * 0.1)] || marketPrices[0];
        median = marketPrices[Math.floor(marketPrices.length * 0.5)];
        high = marketPrices[Math.floor(marketPrices.length * 0.9)] || marketPrices[marketPrices.length - 1];
    } else {
        // Absolute fallback if literally zero products found on internet
        low = 10; median = 25; high = 50;
    }

    // Resale value is typically lower than retail. 
    // If we scraped "used" items, prices might be accurate. 
    // If we scraped new items (Google Shopping mostly new), we should discount.
    // Heuristic: assume 40-60% of new price for "Good" condition.
    // However, if we searched "used", we trust the data.
    // Let's assume the data is mixed and be conservative.

    return {
        title: title || 'Fashion Item',
        description: `Selling my ${title}. Great condition, barely worn.`,
        category,
        ebayCategoryId: '11450', // Default clothing category
        suggestedPrices: {
            low: Math.round(low),
            median: Math.round(median),
            high: Math.round(high)
        },
        images: [scannedImage],
        condition: 'good'
    };
}
