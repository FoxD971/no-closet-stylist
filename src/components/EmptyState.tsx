import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface EmptyStateProps {
    icon?: string;
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({
    icon = '📦',
    title,
    message,
    actionLabel,
    onAction
}: EmptyStateProps) {
    return (
        <Animated.View
            entering={FadeInDown.duration(600)}
            className="flex-1 items-center justify-center px-8 py-12"
        >
            <View className="items-center gap-6 max-w-sm">
                {/* Icon with gradient background */}
                <LinearGradient
                    colors={['rgba(0, 217, 255, 0.1)', 'rgba(0, 184, 204, 0.1)']}
                    className="w-24 h-24 rounded-full items-center justify-center"
                >
                    <Text className="text-5xl">{icon}</Text>
                </LinearGradient>

                {/* Title */}
                <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                    {title}
                </Text>

                {/* Message */}
                <Text className="text-base text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                    {message}
                </Text>

                {/* Action Button */}
                {actionLabel && onAction && (
                    <TouchableOpacity
                        onPress={onAction}
                        activeOpacity={0.8}
                        className="mt-4"
                    >
                        <LinearGradient
                            colors={['#00D9FF', '#00B8CC']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="px-8 py-4 rounded-full shadow-lg"
                        >
                            <Text className="text-white font-bold text-base">
                                {actionLabel}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </View>
        </Animated.View>
    );
}
