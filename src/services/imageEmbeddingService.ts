import { FashionEmbedding } from '../types/domain/search';

/**
 * Service to generate embeddings for images.
 * Currently uses a mock implementation returning 512-dimensional random vectors.
 */
export const ImageEmbeddingService = {
    /**
     * Generates a vector embedding for a given image.
     * @param imageUrl Base64 string or remote URL of the image
     */
    getEmbedding: async (imageUrl: string): Promise<FashionEmbedding> => {
        console.log('🧠 [EMBED] Generating embedding for image...');

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Generate random 512-dim vector (Simulating FashionCLIP)
        const vector = Array.from({ length: 512 }, () => Math.random() - 0.5);

        return {
            vector,
            model: 'fashion-clip-v1',
            timestamp: new Date().toISOString(),
        };
    }
};
