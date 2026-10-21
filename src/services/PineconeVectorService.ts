import axios from 'axios';
import { VectorSearchService, VectorSearchItem } from '../types/domain/search';

const PINECONE_URL = process.env.EXPO_PUBLIC_PINECONE_URL; // Your index endpoint
const PINECONE_KEY = process.env.EXPO_PUBLIC_PINECONE_API_KEY;

export const pineconeService: VectorSearchService = {
    async search(embedding: number[], limit = 20): Promise<VectorSearchItem[]> {
        if (!PINECONE_URL || !PINECONE_KEY) {
            console.warn('⚠️ [VECTOR] Pinecone configuration missing. Skipping vector search.');
            return [];
        }

        try {
            console.log('🔍 [VECTOR] Querying Pinecone index...');
            const response = await axios.post(
                `${PINECONE_URL}/query`,
                {
                    vector: embedding,
                    topK: limit,
                    includeMetadata: true
                },
                { headers: { 'Api-Key': PINECONE_KEY } }
            );

            const matches = response.data.matches || [];
            console.log(`   ✅ [VECTOR] Found ${matches.length} matches in vector DB`);

            return matches.map((match: any) => ({
                id: match.id,
                title: match.metadata.title || 'Unknown Product',
                brand: match.metadata.brand,
                price: match.metadata.price,
                currency: match.metadata.currency || 'USD',
                imageUrl: match.metadata.image_url,
                productUrl: match.metadata.product_url,
                source: 'vector_db',
                similarity: match.score,
                // Map generic metadata to required fields if available
                attributes: {
                    color: match.metadata.color || 'unknown',
                    gender: match.metadata.gender,
                    style: match.metadata.style,
                    material: match.metadata.material
                }
            }));
        } catch (error: any) {
            console.error("❌ [VECTOR] Vector search failed:", error.message);
            return []; // Return empty to allow fallback
        }
    }
};
