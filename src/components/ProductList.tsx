import { View, ActivityIndicator, FlatList } from 'react-native';
import { Product } from '../types';
import { ItemCard } from './ItemCard';

interface ProductListProps {
    products: Product[];
    loading?: boolean;
    onProductClick: (product: Product) => void;
    onEndReached?: () => void;
}

export function ProductList({ products, loading, onProductClick, onEndReached }: ProductListProps) {
    if (loading && products.length === 0) {
        return (
            <View className="flex-1 items-center justify-center bg-brand-50 dark:bg-brand-900">
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-brand-50 dark:bg-brand-900">
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={{ padding: 8, paddingBottom: 100 }}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                renderItem={({ item }) => (
                    <ItemCard
                        product={item}
                        onPress={onProductClick}
                    />
                )}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    loading ? (
                        <View className="py-4">
                            <ActivityIndicator size="small" color="#999" />
                        </View>
                    ) : (
                        <View className="h-8" />
                    )
                }
            />
        </View>
    );
}
