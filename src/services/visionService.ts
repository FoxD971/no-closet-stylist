import axios from 'axios';
import type { VisionAPIResponse } from '../types';

const API_BASE = '/api';

/**
 * Detect clothing items in an image
 */
export async function detectClothing(imageData: string): Promise<VisionAPIResponse> {
    try {
        const response = await axios.post(`${API_BASE}/vision/detect`, {
            imageData
        });
        return response.data;
    } catch (error: any) {
        console.error('Vision detection error:', error);
        throw new Error(error.response?.data?.message || 'Failed to detect clothing');
    }
}

/**
 * Process image file to base64
 */
export function imageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Compress image before sending to API
 */
export async function compressImage(file: File, maxWidth = 1024): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.onerror = reject;
            img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
