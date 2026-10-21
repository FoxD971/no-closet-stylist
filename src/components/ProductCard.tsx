import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Heart, Star } from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import type { Product } from '../types';

interface ProductCardProps {
    product: Product;
    onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
    const { isSaved, addSavedItem, removeSavedItem } = useAppStore();
    const saved = isSaved(product.id);

    const handleSaveToggle = () => {
        if (saved) {
            removeSavedItem(product.id);
        } else {
            addSavedItem(product);
        }
    };

    return (
        <Animated.View
            entering={FadeIn.duration(300)}
            className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg mb-4 w-[48%]"
        >
            <TouchableOpacity onPress={onClick} activeOpacity={0.9}>
                {/* Image Container */}
                <View className="relative h-56 bg-gray-200">
                    <Image
                        source={{ uri: product.imageUrl }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />

                    {/* Floating Badges */}
                    <View className="absolute top-3 left-3 flex-col gap-2">
                        {product.originalPrice && product.originalPrice > product.price && (
                            <View className="bg-mood-warning rounded-full px-2 py-1 shadow-sm">
                                <Text className="text-white text-[10px] font-bold">SALE</Text>
                            </View>
                        )}
                        {/* Mock Trending Badge for premium feel */}
                        <View className="bg-brand-500 rounded-full px-2 py-1 shadow-sm">
                            <Text className="text-white text-[10px] font-bold">TRENDING</Text>
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        onPress={(e) => {
                            e.stopPropagation();
                            handleSaveToggle();
                        }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 items-center justify-center shadow-sm"
                    >
                        <Heart
                            size={18}
                            color={saved ? '#FF6B6B' : '#4B5563'}
                            fill={saved ? '#FF6B6B' : 'transparent'}
                        />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View className="p-3">
                    {/* Brand */}
                    <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
                        {product.brand}
                    </Text>

                    {/* Name */}
                    <Text numberOfLines={1} className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                        {product.name}
                    </Text>

                    {/* Rating (Social Proof) */}
                    <View className="flex-row items-center mt-1">
                        <Star size={14} color="#FFB800" fill="#FFB800" />
                        <Text className="ml-1 text-xs text-gray-600 font-medium">
                            {product.rating ? product.rating.toFixed(1) : '4.8'} <Text className="text-gray-400">(1.2k)</Text>
                        </Text>
                    </View>

                    {/* Price */}
                    <View className="flex-row items-baseline mt-2 gap-2">
                        <Text className="text-xl font-bold text-gray-900 dark:text-white">
                            ${product.price}
                        </Text>
                        {product.originalPrice && (
                            <Text className="text-xs line-through text-gray-400">
                                ${product.originalPrice}
                            </Text>
                        )}
                    </View>

                    {/* Gradient Try-On Button */}
                    <TouchableOpacity
                        className="mt-3 rounded-xl overflow-hidden active:opacity-90"
                    >
                        <LinearGradient
                            colors={['#00D9FF', '#00B8CC']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="py-2.5 items-center"
                        >
                            <Text className="text-white font-bold text-sm tracking-wide">
                                Virtual Try-On
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

