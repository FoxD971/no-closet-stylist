import { SavedItem, Product } from '../types';

export interface OutfitSuggestion {
    id: string;
    items: Product[];
    name: string;
    occasion: string;
}

/**
 * Simple rule-based outfit suggester.
 * In the future, this can be enhanced with AI/LLM logic.
 */
export async function suggestOutfitFromCloset(savedItems: SavedItem[]): Promise<OutfitSuggestion | null> {
    if (!savedItems || savedItems.length < 2) {
        return null; // Not enough items
    }

    const tops: Product[] = [];
    const bottoms: Product[] = [];
    const shoes: Product[] = [];
    const onePieces: Product[] = []; // Dresses, jumpsuits

    // 1. Categorize items
    savedItems.forEach(item => {
        const cat = item.product.category?.toLowerCase() || '';
        if (cat.includes('shirt') || cat.includes('top') || cat.includes('sweater') || cat.includes('blouse') || cat.includes('jacket')) {
            tops.push(item.product);
        } else if (cat.includes('pant') || cat.includes('jeans') || cat.includes('skirt') || cat.includes('short')) {
            bottoms.push(item.product);
        } else if (cat.includes('shoe') || cat.includes('boot') || cat.includes('sneaker')) {
            shoes.push(item.product);
        } else if (cat.includes('dress') || cat.includes('jumpsuit')) {
            onePieces.push(item.product);
        }
    });

    // 2. Generate Combination
    let outfitItems: Product[] = [];
    let outfitName = 'Casual Mix';

    // Strategy A: Dress/One-piece (easiest)
    if (onePieces.length > 0) {
        const main = getRandom(onePieces);
        outfitItems.push(main);
        if (shoes.length > 0) {
            outfitItems.push(getRandom(shoes));
        }
        outfitName = 'Effortless Chic';
    }
    // Strategy B: Top + Bottom
    else if (tops.length > 0 && bottoms.length > 0) {
        outfitItems.push(getRandom(tops));
        outfitItems.push(getRandom(bottoms));
        if (shoes.length > 0) {
            outfitItems.push(getRandom(shoes));
        }
        outfitName = 'Daily Graphic';
    }
    // Strategy C: Just random items if no structure found (fallback)
    else if (savedItems.length >= 2) {
        outfitItems = savedItems.slice(0, 3).map(i => i.product);
        outfitName = 'Closet Rotation';
    } else {
        return null;
    }

    return {
        id: `outfit_${Date.now()}`,
        items: outfitItems,
        name: outfitName,
        occasion: 'Casual'
    };
}

function getRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}
