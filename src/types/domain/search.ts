export interface ImageEmbeddingService {
    /**
     * Generates a vector embedding for the given image URL.
     * Uses FashionCLIP or equivalent fashion-tuned model.
     */
    getEmbedding(imageUrl: string): Promise<number[]>;
}

export interface VectorSearchItem {
    id: string;
    title: string;
    brand?: string;
    price?: number;
    currency?: string;
    imageUrl: string;
    productUrl: string;
    source: 'vector_db' | 'marketplace' | 'retailer';
    similarity: number; // 0 to 1
    // Additional metadata to match Product type if needed
    attributes?: {
        color: string;
        style?: string;
        material?: string;
        gender?: 'mens' | 'womens' | 'unisex';
    };
}

export interface VectorSearchService {
    /**
     * Searches the vector database for visually similar items.
     */
    search(embedding: number[], limit?: number): Promise<VectorSearchItem[]>;
}

// Deprecated or Legacy types (kept for compatibility if needed, but new engine uses above)
export interface FashionEmbedding {
    vector: number[];
    model: 'fashion-clip-v1' | 'clip-vit-b-32';
    timestamp: string;
}
