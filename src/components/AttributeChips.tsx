import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Palette, Scissors, Calendar, Layers } from 'lucide-react-native';
import { DetectionResult, AttributeChip } from '../types';

interface AttributeChipsProps {
    detection: DetectionResult | null;
    onAttributePress?: (attribute: AttributeChip) => void;
}

export function AttributeChips({ detection, onAttributePress }: AttributeChipsProps) {
    if (!detection || !detection.attributes) return null;

    const { attributes } = detection;
    const chips: AttributeChip[] = [];

    // Map detection attributes to Chip format
    if (attributes.colors && attributes.colors.length > 0) {
        chips.push({ type: 'color', label: attributes.colors[0], value: attributes.colors[0] });
    }
    if (attributes.pattern) {
        chips.push({ type: 'pattern', label: attributes.pattern, value: attributes.pattern });
    }
    if (attributes.material) {
        chips.push({ type: 'material', label: attributes.material, value: attributes.material });
    }
    if (attributes.style) {
        chips.push({ type: 'style', label: attributes.style, value: attributes.style });
    }
    if (attributes.brand) {
        // Brand is distinct, maybe don't treat as chip or use specific icon
        // chips.push({ type: 'style', label: attributes.brand, value: attributes.brand }); 
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'color': return <Palette size={14} color="#6B7280" />;
            case 'pattern': return <Layers size={14} color="#6B7280" />;
            case 'material': return <Layers size={14} color="#6B7280" />;
            case 'style': return <Scissors size={14} color="#6B7280" />;
            case 'occasion': return <Calendar size={14} color="#6B7280" />;
            default: return null;
        }
    };

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row px-4 mb-4"
        >
            {chips.map((chip, index) => (
                <TouchableOpacity
                    key={`${chip.label}-${index}`}
                    onPress={() => onAttributePress?.(chip)}
                    className="flex-row items-center bg-white dark:bg-zinc-800 px-4 py-2 rounded-full mr-2 border border-gray-200 dark:border-zinc-700 shadow-sm"
                >
                    {getIcon(chip.type)}
                    <View className="ml-2 flex-row">
                        <Text className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mr-1.5">
                            {chip.label}:
                        </Text>
                        <Text className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                            {chip.value}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}
