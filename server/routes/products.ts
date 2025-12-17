import express from 'express';
import axios from 'axios';
import { cache } from '../index.js';

const router = express.Router();

/**
 * POST /api/products/search
 * Search for products using Scrapeless Google Shopping API
 */
router.post('/search', async (req, res) => {
    try {
        const { query, category, color, brand, minPrice, maxPrice, page = 1 } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        // Build search query
        let searchQuery = query;
        if (color) searchQuery += ` ${color}`;
        if (brand) searchQuery += ` ${brand}`;
        if (category) searchQuery += ` ${category}`;

        // Check cache
        const cacheKey = `products_${searchQuery}_${page}_${minPrice}_${maxPrice}`;
        const cached = cache.get(cacheKey);
        if (cached) {
            return res.json(cached);
        }

        // Call Scrapeless Google Shopping API
        const scrapelessResponse = await axios.post(
            'https://api.scrapeless.com/api/v1/scraper/request',
            {
                actor: 'scraper.google',
                input: {
                    action: 'shopping',
                    query: searchQuery,
                    country: 'us',
                    language: 'en',
                    maxResults: 20,
                    ...(minPrice && { minPrice }),
                    ...(maxPrice && { maxPrice })
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.SCRAPELESS_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const shoppingResults = scrapelessResponse.data?.result?.shopping_results ||
            scrapelessResponse.data?.shopping_results ||
            [];

        // Transform to our Product format
        const products = shoppingResults.map((item: any, index: number) => ({
            id: item.product_id || item.id || `product_${Date.now()}_${index}`,
            name: item.title || item.name || 'Unknown Product',
            brand: extractBrand(item.title || item.name || ''),
            category: category || 'Clothing',
            price: parsePrice(item.price || item.extracted_price || '0'),
            originalPrice: item.original_price ? parsePrice(item.original_price) : undefined,
            currency: 'USD',
            imageUrl: item.thumbnail || item.image || item.imageUrl || '',
            retailer: {
                id: item.source || item.merchant || 'unknown',
                name: item.source || item.merchant || 'Unknown Retailer',
                website: item.link || item.url || ''
            },
            url: item.link || item.url || '',
            inStock: item.in_stock !== false,
            rating: item.rating || item.stars || undefined,
            reviewCount: item.reviews || item.review_count || undefined,
            description: item.snippet || item.description || undefined
        }));

        const result = {
            products,
            totalResults: products.length,
            page,
            hasMore: products.length === 20
        };

        // Cache the result
        cache.set(cacheKey, result);

        res.json(result);
    } catch (error: any) {
        console.error('Product search error:', error.response?.data || error.message);

        // Return empty results instead of error to keep app functional
        res.json({
            products: [],
            totalResults: 0,
            page: 1,
            hasMore: false,
            error: 'Search service temporarily unavailable'
        });
    }
});

/**
 * GET /api/products/:id
 * Get product details by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check cache
        const cacheKey = `product_${id}`;
        const cached = cache.get(cacheKey);
        if (cached) {
            return res.json(cached);
        }

        // In a real app, you'd fetch from a database or product API
        // For now, return cached data or error
        res.status(404).json({ error: 'Product not found' });
    } catch (error: any) {
        console.error('Product fetch error:', error.message);
        res.status(500).json({
            error: 'Failed to fetch product',
            message: error.message
        });
    }
});

/**
 * Parse price string to number
 */
function parsePrice(priceStr: string): number {
    if (typeof priceStr === 'number') return priceStr;
    const cleaned = String(priceStr).replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
}

/**
 * Extract brand name from product title
 */
function extractBrand(title: string): string {
    // Common brand patterns
    const brands = [
        'Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour',
        'Zara', 'H&M', 'Gap', 'Old Navy', 'Uniqlo',
        'Levi\'s', 'Wrangler', 'Lee', 'Calvin Klein',
        'Ralph Lauren', 'Tommy Hilfiger', 'Lacoste',
        'Vans', 'Converse', 'New Balance', 'Skechers'
    ];

    for (const brand of brands) {
        if (title.toLowerCase().includes(brand.toLowerCase())) {
            return brand;
        }
    }

    // Try to extract first word as brand
    const firstWord = title.split(' ')[0];
    return firstWord.length > 2 ? firstWord : 'Unknown';
}

export default router;
