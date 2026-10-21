import { VectorProduct, ProductFilters } from '../types/domain/search';
import { FashionEmbedding } from '../types/domain/search';

// MOCK INVENTORY
const MOCK_INVENTORY: VectorProduct[] = [
    {
        id: 'vec_001',
        name: 'Vintage Oversized Denim Jacket',
        brand: 'Levi\'s',
        category: 'Outerwear',
        price: 85,
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=800', // Denim Jacket
        attributes: { color: 'blue', style: 'vintage', material: 'denim', gender: 'unisex' }
    },
    {
        id: 'vec_002',
        name: 'Classic White Crewneck T-Shirt',
        brand: 'Uniqlo',
        category: 'Tops',
        price: 14.90,
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800', // White Tee
        attributes: { color: 'white', style: 'casual', material: 'cotton', gender: 'unisex' }
    },
    {
        id: 'vec_003',
        name: 'High-Waisted Wide Leg Trousers',
        brand: 'Zara',
        category: 'Bottoms',
        price: 49.90,
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800', // Beige Pants
        attributes: { color: 'beige', style: 'formal', material: 'polyester', gender: 'womens' }
    },
    {
        id: 'vec_004',
        name: 'Chunky Dad Sneakers',
        brand: 'New Balance',
        category: 'Shoes',
        price: 110,
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=800', // Sneakers
        attributes: { color: 'grey', style: 'streetwear', material: 'mesh', gender: 'unisex' }
    },
    {
        id: 'vec_005',
        name: 'Floral Summer Dress',
        brand: 'Reformation',
        category: 'Dresses',
        price: 248,
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800', // Dress
        attributes: { color: 'red', style: 'romantic', material: 'viscose', gender: 'womens' }
    }
];

export const VectorSearchService = {
    /**
     * Searches for similar items using vector similarity.
     * Currently simulates a search by returning relevant items from mock inventory.
     */
    searchSimilar: async (embedding: FashionEmbedding, filters?: ProductFilters): Promise<VectorProduct[]> => {
        console.log('🔍 [VECTOR] Searching vector index...', { filters });

        await new Promise(resolve => setTimeout(resolve, 600));

        // Mock Logic: Return everything that loosely matches the category filter if present,
        // otherwise return random items simulating "nearest neighbors".

        let results = [...MOCK_INVENTORY];

        // Simple Filter Simulation
        if (filters?.category) {
            const cat = filters.category.toLowerCase();
            // Fuzzy match category
            results = results.filter(p => p.category.toLowerCase().includes(cat) || cat.includes(p.category.toLowerCase()));

            // If filter is too strict and returns nothing in mock, fallback to all
            if (results.length === 0) results = [...MOCK_INVENTORY];
        }

        // Assign fake similarity scores
        results = results.map(item => ({
            ...item,
            similarityScore: 0.85 + (Math.random() * 0.14) // 0.85 - 0.99
        }));

        // Sort by score
        results.sort((a, b) => (b.similarityScore || 0) - (a.similarityScore || 0));

        console.log(`✅ [VECTOR] Found ${results.length} similar items via embedding.`);
        return results;
    }
};
