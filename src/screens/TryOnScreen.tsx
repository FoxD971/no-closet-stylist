import { View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { VirtualTryOn } from '../components/VirtualTryOn';
import type { RootStackParamList } from '../navigation/types';

type TryOnScreenRouteProp = RouteProp<RootStackParamList, 'TryOn'>;

export const TryOnScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<TryOnScreenRouteProp>();
    const { product } = route.params;

    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <VirtualTryOn
                product={product}
                onClose={() => navigation.goBack()}
            />
        </View>
    );
};
