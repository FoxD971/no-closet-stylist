import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import type { ScanStage } from '../store/useAppStore';

interface ScanProgressProps {
    stage: ScanStage;
}

const stages: ScanStage[] = ['compressing', 'analyzing', 'searching'];

export function ScanProgress({ stage }: ScanProgressProps) {
    const currentIndex = stages.indexOf(stage);

    return (
        <Animated.View
            entering={FadeIn.duration(300)}
            className="flex-row items-center gap-2 px-6 py-3"
        >
            {stages.map((s, index) => {
                const isActive = index <= currentIndex;
                const isComplete = index < currentIndex;

                return (
                    <View key={s} className="flex-1 flex-row items-center">
                        {/* Step indicator */}
                        <View className="flex-1 h-1 rounded-full overflow-hidden bg-gray-200">
                            {isActive && (
                                <Animated.View
                                    entering={FadeIn.duration(200)}
                                    className={`h-full ${isComplete ? 'bg-[#E8B86D]' : 'bg-[#E8B86D]/50'}`}
                                    style={{ width: isComplete ? '100%' : '50%' }}
                                />
                            )}
                        </View>

                        {/* Connector (except last) */}
                        {index < stages.length - 1 && (
                            <View className="w-2 h-1 bg-gray-200" />
                        )}
                    </View>
                );
            })}
        </Animated.View>
    );
}
