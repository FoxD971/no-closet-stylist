import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Product } from '../types';
import { Tag, Heart } from 'lucide-react-native';

interface ItemCardProps {
    product: Product;
    onPress: (product: Product) => void;
    onLike?: (product: Product) => void;
}

export function ItemCard({ product, onPress, onLike }: ItemCardProps) {
    const isSale = product.offers && product.offers.some(o => o.discount);

    return (
        <TouchableOpacity
            onPress={() => onPress(product)}
            className="flex-1 m-2 bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800"
            activeOpacity={0.9}
        >
            <View className="relative aspect-[3/4] w-full bg-gray-50 dark:bg-zinc-800">
                <Image
                    source={{ uri: product.imageUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                />

                {/* Match Score Badge (if present) */}
                {product.matchScore && product.matchScore > 0.8 && (
                    <View className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded-md">
                        <Text className="text-white text-[10px] font-bold uppercase tracking-widest">
                            Best Match
                        </Text>
                    </View>
                )}

                {/* Like Button */}
                <TouchableOpacity
                    onPress={() => onLike?.(product)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md items-center justify-center"
                >
                    <Heart size={16} color="white" />
                </TouchableOpacity>

                {/* Price Tag if sale */}
                {isSale && (
                    <View className="absolute bottom-2 left-2 bg-accent-red px-2 py-0.5 rounded-sm">
                        <Text className="text-white text-[10px] font-bold">SALE</Text>
                    </View>
                )}
            </View>

            <View className="p-3">
                <Text className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5" numberOfLines={1}>
                    {product.brand}
                </Text>
                <Text className="text-sm font-medium text-gray-900 dark:text-white mb-2 leading-tight" numberOfLines={2}>
                    {product.name}
                </Text>

                <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-bold text-gray-900 dark:text-white">
                        {product.currency === 'USD' ? '$' : product.currency}{product.price.toFixed(2)}
                    </Text>
                    {product.retailer && (
                        <Text className="text-[10px] text-gray-400 truncate max-w-[50%]">
                            {product.retailer.name}
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}
