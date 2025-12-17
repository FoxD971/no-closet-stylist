import express from 'express';
import axios from 'axios';
import { cache } from '../index.js';

const router = express.Router();

/**
 * POST /api/stores/nearby
 * Find nearby stores for a retailer
 */
router.post('/nearby', async (req, res) => {
    try {
        const { lat, lng, retailer, radius = 10000 } = req.body; // radius in meters

        if (!lat || !lng) {
            return res.status(400).json({ error: 'Location coordinates are required' });
        }

        // Check cache
        const cacheKey = `stores_${lat}_${lng}_${retailer}_${radius}`;
        const cached = cache.get(cacheKey);
        if (cached) {
            return res.json(cached);
        }

        // Build search query
        let query = retailer || 'clothing store';

        // Call Google Places API
        const placesResponse = await axios.get(
            'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
            {
                params: {
                    location: `${lat},${lng}`,
                    radius,
                    keyword: query,
                    type: 'clothing_store',
                    key: process.env.GOOGLE_MAPS_API_KEY
                }
            }
        );

        const places = placesResponse.data.results || [];

        // Get detailed info for each place
        const storesPromises = places.slice(0, 10).map(async (place: any) => {
            try {
                const detailsResponse = await axios.get(
                    'https://maps.googleapis.com/maps/api/place/details/json',
                    {
                        params: {
                            place_id: place.place_id,
                            fields: 'name,formatted_address,geometry,formatted_phone_number,opening_hours,rating,website',
                            key: process.env.GOOGLE_MAPS_API_KEY
                        }
                    }
                );

                const details = detailsResponse.data.result;
                const distance = calculateDistance(
                    lat,
                    lng,
                    details.geometry.location.lat,
                    details.geometry.location.lng
                );

                // Parse address
                const addressParts = details.formatted_address.split(', ');
                const state = addressParts[addressParts.length - 2]?.split(' ')[0] || '';
                const zipCode = addressParts[addressParts.length - 2]?.split(' ')[1] || '';
                const city = addressParts[addressParts.length - 3] || '';

                return {
                    id: place.place_id,
                    name: details.name,
                    retailer: retailer || extractRetailerName(details.name),
                    address: details.formatted_address,
                    city,
                    state,
                    zipCode,
                    country: 'USA',
                    coordinates: {
                        lat: details.geometry.location.lat,
                        lng: details.geometry.location.lng
                    },
                    phone: details.formatted_phone_number,
                    hours: details.opening_hours?.weekday_text?.join(', '),
                    rating: details.rating,
                    distance,
                    distanceUnit: 'mi' as const
                };
            } catch (error) {
                console.error('Error fetching place details:', error);
                return null;
            }
        });

        const stores = (await Promise.all(storesPromises)).filter(Boolean);

        // Sort by distance
        stores.sort((a: any, b: any) => a.distance - b.distance);

        const result = {
            stores,
            totalResults: stores.length
        };

        // Cache the result
        cache.set(cacheKey, result);

        res.json(result);
    } catch (error: any) {
        console.error('Store search error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to search stores',
            message: error.message
        });
    }
});

/**
 * POST /api/stores/availability
 * Check product availability at stores (mock for now)
 */
router.post('/availability', async (req, res) => {
    try {
        const { productId, storeIds } = req.body;

        if (!productId || !storeIds || !Array.isArray(storeIds)) {
            return res.status(400).json({ error: 'Product ID and store IDs are required' });
        }

        // Mock availability data
        // In a real app, this would query retailer APIs or databases
        const availability = storeIds.map(storeId => ({
            storeId,
            inStock: Math.random() > 0.3, // 70% chance in stock
            quantity: Math.floor(Math.random() * 10),
            lastUpdated: new Date().toISOString()
        }));

        res.json({ availability });
    } catch (error: any) {
        console.error('Availability check error:', error.message);
        res.status(500).json({
            error: 'Failed to check availability',
            message: error.message
        });
    }
});

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 10) / 10; // Round to 1 decimal
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Extract retailer name from store name
 */
function extractRetailerName(storeName: string): string {
    const retailers = ['Zara', 'H&M', 'Gap', 'Nike', 'Adidas', 'Target', 'Walmart', 'Macy\'s'];

    for (const retailer of retailers) {
        if (storeName.toLowerCase().includes(retailer.toLowerCase())) {
            return retailer;
        }
    }

    return storeName.split(' ')[0];
}

export default router;
