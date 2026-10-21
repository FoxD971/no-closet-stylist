import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { OutfitIdea } from '../types';
import { Sparkles } from 'lucide-react-native';

export function StylingAdviceSection({ onSelectProduct }: { onSelectProduct: (product: any) => void }) {
    const { currentStyling } = useAppStore();

    if (!currentStyling || !currentStyling.outfits || currentStyling.outfits.length === 0) {
        return null;
    }

    return (
        <View className="mt-4 mb-8">
            <View className="flex-row items-center gap-2 px-4 mb-3">
                <Sparkles size={20} color="#8B5CF6" fill="#8B5CF6" />
                <Text className="text-xl font-bold text-gray-900 dark:text-white">AI Stylist Suggestions</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}>
                {currentStyling.outfits.map((outfit) => (
                    <OutfitCard key={outfit.id} outfit={outfit} onSelectProduct={onSelectProduct} />
                ))}
            </ScrollView>
        </View>
    );
}

function OutfitCard({ outfit, onSelectProduct }: { outfit: OutfitIdea; onSelectProduct: (product: any) => void }) {
    return (
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 w-72 shadow-sm border border-gray-100 dark:border-gray-700">
            <View className="mb-3">
                <Text className="text-lg font-bold text-gray-900 dark:text-white" numberOfLines={1}>{outfit.title}</Text>
                <Text className="text-xs text-purple-600 font-medium uppercase">{outfit.style} • {outfit.occasion}</Text>
            </View>

            <Text className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-5" numberOfLines={2}>
                {outfit.description}
            </Text>

            <View className="gap-3">
                {outfit.items.map((item, idx) => (
                    <TouchableOpacity
                        key={idx}
                        className="flex-row gap-3 items-center bg-gray-50 dark:bg-gray-700/50 p-2 rounded-xl active:opacity-70"
                        onPress={() => item.matchedProducts && item.matchedProducts[0] && onSelectProduct(item.matchedProducts[0])}
                        disabled={!item.matchedProducts || !item.matchedProducts[0]}
                    >
                        {item.matchedProducts && item.matchedProducts[0] ? (
                            <Image
                                source={{ uri: item.matchedProducts[0].imageUrl }}
                                className="w-12 h-12 rounded-lg bg-gray-200"
                            />
                        ) : (
                            <View className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-600 items-center justify-center">
                                <Text className="text-xl">👕</Text>
                            </View>
                        )}

                        <View className="flex-1">
                            <Text className="text-sm font-semibold text-gray-900 dark:text-white" numberOfLines={1}>{item.category}</Text>
                            <Text className="text-xs text-gray-500 dark:text-gray-400" numberOfLines={1}>{item.description}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}
