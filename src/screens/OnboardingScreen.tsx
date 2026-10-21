import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../store/useAppStore';
import { Camera, Sparkles, Tag, ArrowRight, Check } from 'lucide-react-native';
import Animated, { FadeIn, FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
}

const slides: OnboardingSlide[] = [
    {
        id: '1',
        title: 'Scan Your Clothes',
        description: 'Instantly identify brands, materials, and styles with a single photo.',
        icon: Camera,
        color: '#00D9FF'
    },
    {
        id: '2',
        title: 'Real-Time Pricing',
        description: 'See what your items are worth and find similar products online.',
        icon: Tag,
        color: '#A855F7'
    },
    {
        id: '3',
        title: 'Style or Resell',
        description: 'Get outfit suggestions or list on eBay in seconds.',
        icon: Sparkles,
        color: '#EC4899'
    }
];

export const OnboardingScreen = () => {
    const { setOnboardingCompleted } = useAppStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true
            });
        } else {
            completeOnboarding();
        }
    };

    const completeOnboarding = () => {
        setOnboardingCompleted(true);
        // Navigation will automatically handle the switch due to conditional rendering in AppNavigator
        // But we can explicit navigation if needed, though state change usually triggers re-render of Navigator
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / width);
        if (index !== currentIndex) {
            setCurrentIndex(index);
        }
    };

    const renderItem = ({ item }: { item: OnboardingSlide }) => {
        const Icon = item.icon;
        return (
            <View style={{ width }} className="items-center justify-center px-8">
                <View className="items-center justify-center w-64 h-64 bg-gray-50 dark:bg-gray-900 rounded-full mb-12 shadow-sm relative overflow-hidden">
                    <View className="absolute inset-0 bg-white/50 blur-xl" />
                    <View className={`w-32 h-32 rounded-full items-center justify-center bg-${item.color === '#00D9FF' ? 'brand-500' : 'gray-900'}`} style={{ backgroundColor: item.color + '20' }}>
                        <Icon size={64} color={item.color} />
                    </View>
                </View>

                <Text className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
                    {item.title}
                </Text>

                <Text className="text-lg text-center text-gray-500 dark:text-gray-400 leading-relaxed">
                    {item.description}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                keyExtractor={(item) => item.id}
                className="flex-1"
            />

            <View className="px-8 pb-12">
                {/* Pagination Dots */}
                <View className="flex-row justify-center space-x-2 mb-8 gap-2">
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'w-8 bg-brand-500'
                                : 'w-2 bg-gray-200 dark:bg-gray-800'
                                }`}
                            style={{ backgroundColor: index === currentIndex ? '#00D9FF' : undefined }}
                        />
                    ))}
                </View>

                {/* Main Action Button */}
                <TouchableOpacity
                    onPress={handleNext}
                    activeOpacity={0.8}
                    className="w-full bg-black dark:bg-white py-4 rounded-2xl flex-row items-center justify-center shadow-lg"
                >
                    <Text className="text-white dark:text-black font-bold text-lg mr-2">
                        {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                    </Text>
                    {currentIndex === slides.length - 1 ? (
                        <Check size={20} color="black" className="text-white dark:text-black" />
                    ) : (
                        <ArrowRight size={20} color="white" />
                    )}
                </TouchableOpacity>

                {/* Skip Button */}
                {currentIndex < slides.length - 1 && (
                    <TouchableOpacity
                        onPress={completeOnboarding}
                        className="mt-4 items-center"
                    >
                        <Text className="text-gray-400 font-medium p-2">Skip</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};
