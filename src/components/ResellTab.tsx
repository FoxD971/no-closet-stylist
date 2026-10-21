import { View, Text, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ResellListing } from '../types';
import { useState } from 'react';
import { ExternalLink, Copy, Check } from 'lucide-react-native';

interface ResellTabProps {
    listing: ResellListing;
    onUpdate?: (listing: ResellListing) => void;
    onContinueToEbay: () => void;
}

export function ResellTab({ listing, onUpdate, onContinueToEbay }: ResellTabProps) {
    const [title, setTitle] = useState(listing.title);
    const [description, setDescription] = useState(listing.description);
    const [price, setPrice] = useState(listing.suggestedPrices.median.toString());
    const [selectedCondition, setSelectedCondition] = useState(listing.condition || 'good');

    const conditions = ['new', 'like-new', 'good', 'fair'];

    return (
        <ScrollView className="flex-1 bg-white dark:bg-black p-4" showsVerticalScrollIndicator={false}>
            {/* Price Estimator */}
            <View className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl mb-6 border border-green-100 dark:border-green-800">
                <Text className="text-green-800 dark:text-green-300 font-bold text-sm mb-2 uppercase tracking-wider">Estimated Value</Text>
                <View className="flex-row items-end gap-2">
                    <Text className="text-3xl font-bold text-green-700 dark:text-green-400">
                        ${listing.suggestedPrices.low} - ${listing.suggestedPrices.high}
                    </Text>
                </View>
                <Text className="text-green-600 dark:text-green-500 text-xs mt-1">Based on similar sold items</Text>
            </View>

            {/* Listing Details */}
            <View className="gap-4 mb-8">
                <View>
                    <Text className="text-sm font-medium text-gray-500 mb-1">Title</Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-medium"
                    />
                </View>

                <View>
                    <Text className="text-sm font-medium text-gray-500 mb-1">Condition</Text>
                    <View className="flex-row gap-2 flex-wrap">
                        {conditions.map(c => (
                            <TouchableOpacity
                                key={c}
                                onPress={() => setSelectedCondition(c as any)}
                                className={`px-4 py-2 rounded-full border ${selectedCondition === c
                                        ? 'bg-black dark:bg-white border-black dark:border-white'
                                        : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                                    }`}
                            >
                                <Text className={`text-xs font-semibold capitalize ${selectedCondition === c
                                        ? 'text-white dark:text-black'
                                        : 'text-gray-700 dark:text-gray-300'
                                    }`}>
                                    {c.replace('-', ' ')}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View>
                    <Text className="text-sm font-medium text-gray-500 mb-1">Description</Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                        className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white h-32"
                    />
                </View>
            </View>

            {/* Actions */}
            <TouchableOpacity
                onPress={onContinueToEbay}
                className="w-full bg-[#E53238] py-4 rounded-xl flex-row items-center justify-center shadow-lg active:opacity-90 mb-4"
            >
                <Text className="text-white font-bold text-lg mr-2">List on eBay</Text>
                <ExternalLink size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
                className="w-full bg-gray-100 dark:bg-gray-800 py-4 rounded-xl flex-row items-center justify-center active:opacity-90 mb-12"
            >
                <Text className="text-gray-900 dark:text-white font-bold text-base mr-2">Export JSON</Text>
                <Copy size={18} color={useAppStore ? '#9CA3AF' : 'gray'} />
            </TouchableOpacity>
        </ScrollView>
    );
}

// Helper to keep TypeScript happy if useAppStore is not needed in JSX directly
const useAppStore = true; 
