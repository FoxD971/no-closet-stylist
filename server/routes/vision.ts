import express from 'express';
import axios from 'axios';
import { cache } from '../index.js';

const router = express.Router();

/**
 * POST /api/vision/detect
 * Detects clothing items in an image using Google Cloud Vision API
 */
router.post('/detect', async (req, res) => {
    try {
        const { imageData } = req.body;

        if (!imageData) {
            return res.status(400).json({ error: 'Image data is required' });
        }

        // Check cache
        const cacheKey = `vision_${Buffer.from(imageData).toString('base64').slice(0, 50)}`;
        const cached = cache.get(cacheKey);
        if (cached) {
            return res.json(cached);
        }

        // Remove data URL prefix if present
        const base64Image = imageData.replace(/^data:image\/\w+;base64,/, '');

        // Call Google Cloud Vision API
        const visionResponse = await axios.post(
            `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_CLOUD_VISION_API_KEY}`,
            {
                requests: [
                    {
                        image: { content: base64Image },
                        features: [
                            { type: 'LABEL_DETECTION', maxResults: 10 },
                            { type: 'OBJECT_LOCALIZATION', maxResults: 5 },
                            { type: 'IMAGE_PROPERTIES' },
                            { type: 'WEB_DETECTION' }
                        ]
                    }
                ]
            }
        );

        const annotations = visionResponse.data.responses[0];

        // Process results
        const detections = processVisionResults(annotations);

        const result = {
            detections,
            success: true
        };

        // Cache the result
        cache.set(cacheKey, result);

        res.json(result);
    } catch (error: any) {
        console.error('Vision API error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to detect clothing',
            message: error.message,
            success: false
        });
    }
});

/**
 * Process Google Vision API results into our DetectionResult format
 */
function processVisionResults(annotations: any) {
    const labels = annotations.labelAnnotations || [];
    const objects = annotations.localizedObjectAnnotations || [];
    const colors = annotations.imagePropertiesAnnotation?.dominantColors?.colors || [];
    const webDetection = annotations.webDetection || {};

    // Clothing categories to look for
    const clothingCategories = [
        'clothing', 'shirt', 'pants', 'dress', 'shoe', 'shoes', 'sneakers',
        'jacket', 'coat', 'sweater', 'hoodie', 'jeans', 'skirt', 'shorts',
        'boots', 'sandals', 'hat', 'cap', 'bag', 'backpack', 'accessory'
    ];

    const detections = [];

    // Process detected objects
    for (const obj of objects) {
        const name = obj.name.toLowerCase();
        const isClothing = clothingCategories.some(cat => name.includes(cat));

        if (isClothing) {
            // Extract dominant colors
            const dominantColors = colors.slice(0, 3).map((c: any) => {
                const rgb = c.color;
                return rgbToColorName(rgb.red || 0, rgb.green || 0, rgb.blue || 0);
            });

            // Try to detect brand from web entities
            const brand = webDetection.webEntities?.find((e: any) =>
                e.description && e.score > 0.7
            )?.description;

            detections.push({
                category: categorizeItem(name),
                subcategory: name,
                attributes: {
                    colors: dominantColors,
                    brand: brand || undefined,
                    style: inferStyle(labels)
                },
                confidence: Math.round(obj.score * 100),
                boundingBox: {
                    x: obj.boundingPoly.normalizedVertices[0].x || 0,
                    y: obj.boundingPoly.normalizedVertices[0].y || 0,
                    width: (obj.boundingPoly.normalizedVertices[2].x || 1) - (obj.boundingPoly.normalizedVertices[0].x || 0),
                    height: (obj.boundingPoly.normalizedVertices[2].y || 1) - (obj.boundingPoly.normalizedVertices[0].y || 0)
                }
            });
        }
    }

    // If no objects detected, try to infer from labels
    if (detections.length === 0) {
        const clothingLabel = labels.find((l: any) =>
            clothingCategories.some(cat => l.description.toLowerCase().includes(cat))
        );

        if (clothingLabel) {
            const dominantColors = colors.slice(0, 3).map((c: any) => {
                const rgb = c.color;
                return rgbToColorName(rgb.red || 0, rgb.green || 0, rgb.blue || 0);
            });

            detections.push({
                category: categorizeItem(clothingLabel.description.toLowerCase()),
                subcategory: clothingLabel.description,
                attributes: {
                    colors: dominantColors,
                    style: inferStyle(labels)
                },
                confidence: Math.round(clothingLabel.score * 100)
            });
        }
    }

    return detections;
}

/**
 * Categorize detected item into main categories
 */
function categorizeItem(name: string): string {
    const categories: { [key: string]: string[] } = {
        'Top': ['shirt', 't-shirt', 'blouse', 'sweater', 'hoodie', 'jacket', 'coat', 'cardigan'],
        'Bottom': ['pants', 'jeans', 'shorts', 'skirt', 'trousers'],
        'Dress': ['dress', 'gown'],
        'Shoes': ['shoe', 'shoes', 'sneakers', 'boots', 'sandals', 'heels'],
        'Accessory': ['hat', 'cap', 'bag', 'backpack', 'belt', 'scarf', 'sunglasses']
    };

    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => name.includes(keyword))) {
            return category;
        }
    }

    return 'Clothing';
}

/**
 * Infer style from labels
 */
function inferStyle(labels: any[]): string | undefined {
    const styleKeywords = ['casual', 'formal', 'sporty', 'vintage', 'modern', 'elegant', 'streetwear'];

    for (const label of labels) {
        const desc = label.description.toLowerCase();
        const style = styleKeywords.find(s => desc.includes(s));
        if (style) return style;
    }

    return undefined;
}

/**
 * Convert RGB to approximate color name
 */
function rgbToColorName(r: number, g: number, b: number): string {
    const colors: { [key: string]: [number, number, number] } = {
        'black': [0, 0, 0],
        'white': [255, 255, 255],
        'red': [255, 0, 0],
        'blue': [0, 0, 255],
        'green': [0, 128, 0],
        'yellow': [255, 255, 0],
        'orange': [255, 165, 0],
        'purple': [128, 0, 128],
        'pink': [255, 192, 203],
        'brown': [165, 42, 42],
        'gray': [128, 128, 128],
        'navy': [0, 0, 128],
        'beige': [245, 245, 220]
    };

    let minDistance = Infinity;
    let closestColor = 'unknown';

    for (const [name, [cr, cg, cb]] of Object.entries(colors)) {
        const distance = Math.sqrt(
            Math.pow(r - cr, 2) + Math.pow(g - cg, 2) + Math.pow(b - cb, 2)
        );
        if (distance < minDistance) {
            minDistance = distance;
            closestColor = name;
        }
    }

    return closestColor;
}

export default router;
