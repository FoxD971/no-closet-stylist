import { Product } from '../types';
import { ImageEmbeddingService } from './imageEmbeddingService';
import { VectorSearchService } from './vectorSearchService';

/**
 * Hybrid Search Orchestrator
 * Combines Vector Search (Inventory) with external results (Lens/Shopping)
 */
export async function enhanceWithVectorSearch(
    base64Image: string,
    visionData: any,
    externalProducts: Product[]
): Promise<Product[]> {
    // Feature Gate: Only run if vector search is explicitly enabled
    const VECTOR_SEARCH_ENABLED = process.env.EXPO_PUBLIC_VECTOR_SEARCH_ENABLED === 'true';

    if (!VECTOR_SEARCH_ENABLED) {
        console.log('⏭️  [HYBRID] Vector search disabled (no production API configured)');
        return externalProducts; // Return external results unchanged
    }

    console.log('🔄 [HYBRID] Enhancing results with vector search...');

    let vectorProducts: Product[] = [];

    try {
        // 1. Generate embedding
        const embedding = await ImageEmbeddingService.getEmbedding(base64Image);

        // 2. Build filters from vision metadata
        const filters = {
            category: visionData.category,
        };

        // 3. Search vector database
        const vectorMatches = await VectorSearchService.searchSimilar(embedding, filters);

        // 4. Map VectorProduct -> Product
        vectorProducts = vectorMatches.map(vp => ({
            id: vp.id,
            name: vp.name,
            brand: vp.brand,
            price: vp.price,
            currency: vp.currency,
            imageUrl: vp.imageUrl,
            category: vp.category,
            url: vp.imageUrl,
            description: `${vp.attributes.style || ''} ${vp.attributes.material || ''}`.trim(),
            retailer: { id: 'trovefy', name: 'Trovefy Curated', url: '' },
            inStock: true,
            matchScore: vp.similarityScore || 0.92,
            badge: (vp.similarityScore && vp.similarityScore > 0.93) ? 'Perfect Match' : 'Curated Match'
        }));

        console.log(`   ✅ [VECTOR] Found ${vectorProducts.length} curated matches`);
    } catch (error: any) {
        console.warn('⚠️ [VECTOR] Search failed:', error.message);
    }

    // 5. Merge: Vector (Primary) + External (Secondary)
    // Deduplicate by ID
    const vectorIds = new Set(vectorProducts.map(p => p.id));
    const uniqueExternal = externalProducts.filter(p => !vectorIds.has(p.id));

    const merged = [...vectorProducts, ...uniqueExternal];

    console.log(`   📊 [HYBRID] Total: ${merged.length} (${vectorProducts.length} curated + ${uniqueExternal.length} external)`);

    return merged;
}
