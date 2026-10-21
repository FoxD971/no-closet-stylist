/**
 * Product Enrichment Engine (Client-Side)
 * Adds intelligence to product results:
 * - Fuzzy deduplication for similar products
 * - Price intelligence ("Good Deal" tags)
 * - Size parsing from titles
 * - Style recommendations ("Complete the Look")
 */

import { compareTwoStrings } from 'string-similarity';

const SIMILARITY_THRESHOLD = 0.8; // 80% match required

export function fuzzyDeduplicateProducts(products: any[]): Map<string, any> {
    const deduped = new Map<string, any>();

    for (const product of products) {
        let foundMatch = false;

        // Check against existing products
        const entries = Array.from(deduped.entries());
        for (let i = 0; i < entries.length; i++) {
            const [key, existing] = entries[i];
            const similarity = compareTwoStrings(
                String(product.name || '').toLowerCase(),
                String(existing.name || '').toLowerCase()
            );

            // If similar AND same brand, merge into existing
            if (similarity > SIMILARITY_THRESHOLD &&
                product.brand?.toLowerCase() === existing.brand?.toLowerCase()) {

                console.log(`✨ [FUZZY] Matched "${product.name}" (${similarity.toFixed(2)}) → "${existing.name}"`);

                // Add offer to existing product group
                if (!existing.offers) existing.offers = [];
                existing.offers.push({
                    productId: product.id,
                    title: product.name,
                    brand: product.brand,
                    price: product.price,
                    currency: product.currency || 'USD',
                    retailer: product.retailer,
                    rating: product.rating,
                    url: product.url,
                    imageUrl: product.imageUrl,
                    discount: product.discount,
                    inStock: product.inStock
                });

                foundMatch = true;
                break;
            }
        }
        if (!foundMatch) {
            // New product group
            const key = `${product.brand || 'unknown'}__${product.name}`;
            deduped.set(key, {
                ...product,
                offers: [{
                    productId: product.id,
                    title: product.name,
                    brand: product.brand,
                    price: product.price,
                    currency: product.currency || 'USD',
                    retailer: product.retailer,
                    rating: product.rating,
                    url: product.url,
                    imageUrl: product.imageUrl,
                    discount: product.discount,
                    inStock: product.inStock
                }]
            });
        }
    }

    return deduped;
}

// ============================================
// 2. PRICE INTELLIGENCE
// ============================================

export function tagPricesAsDeals(products: any[]): void {
    for (const product of products) {
        if (!product.offers || product.offers.length === 0) continue;

        // Calculate average price across all offers
        const avgPrice = product.offers.reduce((sum: number, o: any) => sum + o.price, 0) /
            product.offers.length;

        // Tag each offer based on market average
        product.offers.forEach((offer: any) => {
            if (offer.price < avgPrice * 0.85) {
                offer.priceTag = 'Great Deal 🔥';  // 15% below average
            } else if (offer.price > avgPrice * 1.2) {
                offer.priceTag = 'High Price ⚠️';  // 20% above average
            } else {
                offer.priceTag = 'Good Price ✓';
            }
        });

        // Store market average on product
        product.marketAveragePrice = avgPrice;
        product.priceDeviationPercent = {
            cheapest: ((product.offers[0].price - avgPrice) / avgPrice) * 100,
            expensive: ((product.offers[product.offers.length - 1].price - avgPrice) / avgPrice) * 100
        };
    }
}

// ============================================
// 3. SIZE PARSING
// ============================================

const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const NUMERIC_SIZE_REGEX = /\b(US\s?)?(\d{1,2}(?:\.\d)?)\b/i;  // US 7, 8.5, etc
const LETTER_SIZE_REGEX = /\b(XS|S|M|L|XL|XXL|XXXL)\b/i;

export function extractSizeFromTitle(title: string): string | null {
    if (!title) return null;
    // Try letter sizes first (XS, S, M, L, XL)
    const letterMatch = title.match(LETTER_SIZE_REGEX);
    if (letterMatch) return letterMatch[0].toUpperCase();

    // Try numeric sizes (US 7, 8.5, etc)
    const numericMatch = title.match(NUMERIC_SIZE_REGEX);
    if (numericMatch) return `Size ${numericMatch[2]}`;

    return null;
}

export function parseProductSizes(products: any[]): void {
    for (const product of products) {
        if (!product.offers) continue;

        product.offers.forEach((offer: any) => {
            const detectedSize = extractSizeFromTitle(offer.title);
            if (detectedSize) {
                offer.detectedSize = detectedSize;
                // console.log(`👕 [SIZE] Detected "${offer.detectedSize}" in "${offer.title}"`);
            }
        });
    }
}

// ============================================
// 4. STYLE RECOMMENDATIONS ("Complete the Look")
// ============================================

const PAIRING_RULES: { [key: string]: string[] } = {
    'hoodie': ['jeans', 'joggers', 'track pants', 'sneakers'],
    'jacket': ['dress shirt', 'jeans', 'loafers', 'trousers'],
    'dress': ['heels', 'flats', 'blazer', 'cardigan'],
    'jeans': ['t-shirt', 'shirt', 'sweater', 'sneakers', 'boots'],
    'shorts': ['t-shirt', 'tank top', 'sandals', 'sneakers'],
    'shoes': ['jeans', 'shorts', 'dress', 'socks'],
    'shirt': ['jeans', 'pants', 'blazer', 'belt'],
    't-shirt': ['jeans', 'shorts', 'jacket', 'sneakers'],
    'sweater': ['jeans', 'chinos', 'boots'],
    'blazer': ['dress pants', 'jeans', 'loafers', 'tie']
};

export function generateStyleRecommendations(product: any, detectedLabels: any): any {
    const suggestions: any[] = [];

    // Find what category this product is
    const category = (product.category || '').toLowerCase();
    const name = (product.name || '').toLowerCase();

    // Find matching pairing rules
    for (const [garment, pairs] of Object.entries(PAIRING_RULES)) {
        if (category.includes(garment) || name.includes(garment)) {
            // This product matches a garment, suggest pairings
            suggestions.push({
                category: garment,
                suggestion: `Pair this ${garment} with:`,
                searchQueries: pairs.map(p => `${p} ${product.brand || 'casual'}`.trim())
            });
            break;
        }
    }

    return suggestions;
}

export default {
    fuzzyDeduplicateProducts,
    tagPricesAsDeals,
    extractSizeFromTitle,
    parseProductSizes,
    generateStyleRecommendations
};
