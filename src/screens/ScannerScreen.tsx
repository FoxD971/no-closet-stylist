
import { View, Text, TouchableOpacity, StatusBar, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../store/useAppStore';
import { Scanner } from '../components/Scanner';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { scanImage } from '../services/productService';
import { compressImage } from '../utils/imageUtils';
import Animated, { FadeIn, FadeOut, SlideInUp } from 'react-native-reanimated';
import { Sparkles, ArrowRight, Shirt } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { suggestOutfitFromCloset, OutfitSuggestion } from '../services/outfitSuggester';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ScannerScreen = () => {
    const navigation = useNavigation();
    const {
        setCurrentProducts,
        setCurrentStyling,
        setScanStage,
        scanStage,
        setHasScannedOnce,
        setLastScannedImage,
        scanError,
        setScanError,
        loading,
        setLoading,
        savedItems
    } = useAppStore();

    const [todaysOutfit, setTodaysOutfit] = useState<OutfitSuggestion | null>(null);

    useEffect(() => {
        loadOutfitSuggestion();
    }, [savedItems]);

    const loadOutfitSuggestion = async () => {
        const suggestion = await suggestOutfitFromCloset(savedItems);
        setTodaysOutfit(suggestion);
    };

    const handleImageCapture = async (imageUri: string) => {
        try {
            setScanError(null);
            setLoading(true);
            setScanStage('compressing');
            setLastScannedImage(imageUri);
            setHasScannedOnce(true);

            console.log('📱🚀 [Scanner] handleImageCapture called with:', imageUri);

            // Stage 1: Compress
            const compressedBase64 = await compressImage(imageUri);

            // Stage 2: Scan
            setScanStage('searching');
            const response = await scanImage(compressedBase64);

            if (response.products && response.products.length > 0) {
                setCurrentProducts(response.products);

                if (response.styling) {
                    setCurrentStyling(response.styling);
                } else {
                    setCurrentStyling(null);
                }

                setScanStage('idle');
                navigation.navigate('Results' as never);
            } else {
                const errMsg = response.message || 'No matching products found. Try scanning a different item.';
                setScanError(errMsg);
                setScanStage('idle');
            }
        } catch (error: any) {
            console.error('🔴 [Scanner] Scan error:', error);
            const errorMsg = error.message || 'Failed to scan image. Please try again.';
            setScanError(errorMsg);
            setScanStage('idle');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-black">
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            {/* Main Scanner View */}
            <View className="flex-1 relative">
                <Scanner onImageCapture={handleImageCapture} />

                {/* Overlay Controls */}
                <SafeAreaView className="absolute top-0 left-0 right-0 p-6 pointer-events-box-none">
                    <View className="flex-row justify-between items-center">
                        <View>
                            <Text className="text-white font-serif font-bold text-2xl drop-shadow-md tracking-wider">TROVEFY</Text>
                            <Text className="text-white/80 text-xs tracking-[3px] uppercase mt-1">AI Fashion Scanner</Text>
                        </View>
                        {/* Profile/Menu button could go here */}
                    </View>
                </SafeAreaView>

                {/* Bottom Card - Outfit Suggestion */}
                {!loading && (
                    <Animated.View
                        entering={SlideInUp.delay(500).springify()}
                        className="absolute bottom-24 left-4 right-4"
                    >
                        {/* Today's Outfit Card */}
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => navigation.navigate('Closet' as never)}
                            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 overflow-hidden"
                            style={{ display: todaysOutfit ? 'flex' : 'none' }}
                        >
                            <View className="flex-row items-center justify-between mb-3">
                                <View className="flex-row items-center gap-2">
                                    <Sparkles size={16} color="#00D9FF" />
                                    <Text className="text-white font-semibold">Today's Outfit</Text>
                                </View>
                                <ArrowRight size={16} color="rgba(255,255,255,0.5)" />
                            </View>

                            <View className="flex-row gap-2">
                                {todaysOutfit?.items.slice(0, 4).map((item, index) => (
                                    <View key={item.id} className="w-12 h-16 bg-white/5 rounded-lg overflow-hidden border border-white/10">
                                        <Image
                                            source={{ uri: item.imageUrl }}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
                                    </View>
                                ))}
                                {todaysOutfit?.items && todaysOutfit.items.length < 2 && (
                                    <View className="flex-1 justify-center">
                                        <Text className="text-white/60 text-xs italic">
                                            Scan more items to get outfit ideas
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </View>

            {/* Error Overlay */}
            {scanError && (
                <Animated.View
                    entering={FadeIn.duration(300)}
                    exiting={FadeOut.duration(300)}
                    className="absolute inset-0 bg-black/80 items-center justify-center px-6 z-50"
                >
                    <View className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full items-center shadow-2xl">
                        <Text className="text-5xl mb-4">
                            {scanError.toLowerCase().includes('clothing') ? '🧣' : '🤔'}
                        </Text>
                        <Text className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
                            {scanError.toLowerCase().includes('clothing') ? 'Just Checking!' : 'Scan Issue'}
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-300 text-center leading-6 mb-6">
                            {scanError}
                        </Text>
                        <TouchableOpacity
                            onPress={() => setScanError(null)}
                            className="bg-black dark:bg-white px-8 py-3 rounded-full active:opacity-80"
                        >
                            <Text className="text-white dark:text-black font-bold text-base">
                                Got it, trying again
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}

            <LoadingOverlay stage={scanStage} visible={loading} />
        </View>
    );
};
