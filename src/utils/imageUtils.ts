import * as ImageManipulator from 'expo-image-manipulator';

/**
 * Compress image using Expo
 */
export async function compressImage(uri: string, maxWidth = 1024): Promise<string> {
    try {
        const result = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: maxWidth } }],
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );
        return `data:image/jpeg;base64,${result.base64}`;
    } catch (error) {
        console.error('Image compression error:', error);
        throw error;
    }
}
