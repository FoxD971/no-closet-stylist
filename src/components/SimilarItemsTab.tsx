import { View } from 'react-native';
import { ProductList } from './ProductList';
import { Product } from '../types';

interface SimilarItemsTabProps {
    products: Product[];
    onProductClick: (product: Product) => void;
}

export function SimilarItemsTab({ products, onProductClick }: SimilarItemsTabProps) {
    // In the future, re-ranking logic can happen here or be passed down
    return (
        <View className="flex-1 bg-white dark:bg-black">
            <ProductList products={products} onProductClick={onProductClick} loading={false} />
        </View>
    );
}
