import { View } from 'react-native';
import { MyCloset } from '../components/MyCloset';

export const ClosetScreen = () => {
    return (
        <View className="flex-1 bg-gray-50 dark:bg-black">
            <MyCloset />
        </View>
    );
};
