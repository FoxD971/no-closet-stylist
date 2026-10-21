import { View, Text, Image, TouchableOpacity } from 'react-native';
import { DetectionResult } from '../types';
import { Edit2, Sparkles, ArrowLeft } from 'lucide-react-native';

interface ItemPreviewCardProps {
    imageUri: string;
    detection: DetectionResult | null;
    onRefine?: () => void;
    onRetake?: () => void;
}

export function ItemPreviewCard({ imageUri, detection, onRefine, onRetake }: ItemPreviewCardProps) {
    if (!imageUri) return null;

    const confidencePercent = detection ? Math.round(detection.confidence * 100) : 0;
    const category = detection?.category || 'Analyzing...';

    return (
        <View className="mx-4 mt-20 mb-6 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-white/20 dark:border-zinc-800 overflow-hidden">
            <View className="relative h-64 w-full bg-brand-50 dark:bg-zinc-800">
                <Image
                    source={{ uri: imageUri }}
                    className="w-full h-full"
                    resizeMode="contain"
                />

                {/* Confidence Badge */}
                <View className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1 rounded-full border border-gray-100 dark:border-zinc-700">
                    <View className="flex-row items-center gap-1">
                        <Sparkles size={12} color="#00D9FF" />
                        <Text className="text-xs font-bold text-gray-900 dark:text-white">
                            {confidencePercent}% Match
                        </Text>
                    </View>
                </View>

                {/* Edit Button */}
                <TouchableOpacity
                    onPress={onRetake}
                    className="absolute top-4 left-4 w-10 h-10 bg-white/50 backdrop-blur rounded-full items-center justify-center border border-white/20"
                >
                    <ArrowLeft size={20} color="#000" />
                </TouchableOpacity>
            </View>

            <View className="p-5">
                <View className="flex-row justify-between items-start mb-2">
                    <View>
                        <Text className="text-xs font-bold text-accent tracking-[2px] uppercase mb-1">
                            Identified Item
                        </Text>
                        <Text className="text-3xl font-serif text-gray-900 dark:text-white">
                            {category}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={onRefine}
                        className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-full"
                    >
                        <Edit2 size={18} color="#666" />
                    </TouchableOpacity>
                </View>

                <Text className="text-gray-400 dark:text-gray-500 text-sm leading-5">
                    We've analyzed the texture, pattern, and style of your item to find the best matches.
                </Text>
            </View>
        </View>
    );
}
