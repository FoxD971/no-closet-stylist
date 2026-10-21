import { View, Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import type { ScanStage } from '../store/useAppStore';

interface LoadingOverlayProps {
    stage: ScanStage;
    visible: boolean;
}

const stageMessages: Record<ScanStage, string> = {
    idle: '',
    compressing: 'Optimizing photo...',
    analyzing: 'Analyzing your item...',
    searching: 'Finding this item across top stores...',
    styling: 'Getting styling recommendations...'
};

export function LoadingOverlay({ stage, visible }: LoadingOverlayProps) {
    if (!visible || stage === 'idle') return null;

    return (
        <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            className="absolute inset-0 bg-black/60 items-center justify-center z-50"
        >
            <View className="bg-white dark:bg-gray-900 px-8 py-6 rounded-2xl mx-6 items-center">
                {/* Spinner */}
                <View className="w-12 h-12 border-4 border-gray-200 border-t-[#E8B86D] rounded-full animate-spin mb-4" />

                {/* Stage Message */}
                <Text className="text-gray-900 dark:text-white font-semibold text-lg text-center">
                    {stageMessages[stage]}
                </Text>

                {/* Hint */}
                {stage === 'searching' && (
                    <Text className="text-gray-500 text-sm text-center mt-2">
                        Looking for exact matches first, then similar styles
                    </Text>
                )}
            </View>
        </Animated.View>
    );
}
