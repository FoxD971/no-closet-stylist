import axios from 'axios';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import type { StoreSearchResponse, UserLocation } from '../types';

const API_BASE = '/api';

/**
 * Find nearby stores
 */
export async function findNearbyStores(
    location: UserLocation,
    retailer?: string,
    radiusMiles: number = 10
): Promise<StoreSearchResponse> {
    try {
        const radiusMeters = radiusMiles * 1609.34; // Convert miles to meters

        const response = await axios.post(`${API_BASE}/stores/nearby`, {
            lat: location.lat,
            lng: location.lng,
            retailer,
            radius: radiusMeters
        });

        return response.data;
    } catch (error: any) {
        console.error('Store search error:', error);
        throw new Error(error.response?.data?.message || 'Failed to find stores');
    }
}

/**
 * Check product availability at stores
 */
export async function checkAvailability(productId: string, storeIds: string[]) {
    try {
        const response = await axios.post(`${API_BASE}/stores/availability`, {
            productId,
            storeIds
        });
        return response.data;
    } catch (error: any) {
        console.error('Availability check error:', error);
        throw new Error(error.response?.data?.message || 'Failed to check availability');
    }
}

/**
 * Get user's current location
 */
export function getCurrentLocation(): Promise<UserLocation> {
    return new Promise(async (resolve, reject) => {
        // Native Platform
        if (Capacitor.isNativePlatform()) {
            try {
                const coordinates = await Geolocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 10000
                });
                resolve({
                    lat: coordinates.coords.latitude,
                    lng: coordinates.coords.longitude
                });
            } catch (error: any) {
                reject(new Error(`Location error: ${error.message}`));
            }
            return;
        }

        // Web Fallback
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (error) => {
                reject(new Error(`Location error: ${error.message}`));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    });
}

/**
 * Calculate distance between two points
 */
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    unit: 'mi' | 'km' = 'mi'
): number {
    const R = unit === 'mi' ? 3959 : 6371; // Earth's radius
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 10) / 10;
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 */
export function formatDistance(distance: number, unit: 'mi' | 'km' = 'mi'): string {
    if (distance < 0.1) {
        return unit === 'mi' ? '< 0.1 mi' : '< 0.1 km';
    }
    return `${distance.toFixed(1)} ${unit}`;
}
