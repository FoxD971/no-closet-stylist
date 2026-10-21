import { View } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withTiming, useSharedValue, Easing } from 'react-native-reanimated';
import { useEffect } from 'react';

interface SkeletonLoaderProps {
    variant?: 'card' | 'list';
    count?: number;
}

export function SkeletonLoader({ variant = 'card', count = 6 }: SkeletonLoaderProps) {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    if (variant === 'card') {
        return (
            <View className="flex-row flex-wrap justify-between p-3">
                {Array.from({ length: count }).map((_, index) => (
                    <Animated.View
                        key={index}
                        style={animatedStyle}
                        className="w-[48%] mb-4 bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden"
                    >
                        <View className="aspect-[4/5] bg-gray-300 dark:bg-gray-700" />
                        <View className="p-3 gap-2">
                            <View className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                            <View className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                        </View>
                    </Animated.View>
                ))}
            </View>
        );
    }

    return (
        <View className="p-4 gap-4">
            {Array.from({ length: count }).map((_, index) => (
                <Animated.View
                    key={index}
                    style={animatedStyle}
                    className="flex-row bg-gray-200 dark:bg-gray-800 rounded-2xl p-3 gap-3"
                >
                    <View className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-xl" />
                    <View className="flex-1 gap-2 justify-center">
                        <View className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                        <View className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
                        <View className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                    </View>
                </Animated.View>
            ))}
        </View>
    );
}
