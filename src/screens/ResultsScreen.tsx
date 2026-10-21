import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../store/useAppStore';
import { ItemPreviewCard } from '../components/ItemPreviewCard';
import { AttributeChips } from '../components/AttributeChips';
import { SimilarItemsTab } from '../components/SimilarItemsTab';
import { ResellTab } from '../components/ResellTab';
import { TabView, TabBar } from 'react-native-tab-view';
import { useState, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ResellListing, Product } from '../types';

export const ResultsScreen = () => {
    const navigation = useNavigation();
    const layout = useWindowDimensions();
    const { currentProducts, setSelectedProduct, lastScannedImage, currentDetection } = useAppStore();

    // Tab State
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'similar', title: 'Similar Items' },
        { key: 'resell', title: 'Resell This' },
    ]);

    // Resell Listing State
    const initialListing = useMemo(() => {
        if (!currentDetection || !lastScannedImage) return null;

        // Inline mock generation logic if service not ready, 
        // but ideally we should import it. For now, inline simple logic to keep it working.
        return {
            title: `${currentDetection.attributes?.brand || 'Unknown'} ${currentDetection.category} ${currentDetection.attributes?.colors?.[0] || ''}`,
            description: `A beautiful ${currentDetection.attributes?.colors?.[0] || ''} ${currentDetection.category} in great condition.`,
            category: currentDetection.category,
            suggestedPrices: { low: 15, median: 25, high: 40 },
            images: [lastScannedImage],
            condition: 'good'
        } as ResellListing;

    }, [currentDetection, lastScannedImage]);

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        navigation.navigate('TryOn', { product });
    };

    const renderScene = ({ route }: any) => {
        switch (route.key) {
            case 'similar':
                return <SimilarItemsTab products={currentProducts} onProductClick={handleProductClick} />;
            case 'resell':
                return initialListing ? (
                    <ResellTab
                        listing={initialListing}
                        onContinueToEbay={() => alert('Opening eBay app...')}
                    />
                ) : (
                    <View className="flex-1 items-center justify-center">
                        <Text>Processing item details...</Text>
                    </View>
                );
            default:
                return null;
        }
    };

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'black' }}
            style={{ backgroundColor: 'white', shadowOpacity: 0, elevation: 0, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}
            activeColor="black"
            inactiveColor="#9CA3AF"
            labelStyle={{ fontWeight: '600', textTransform: 'none' }}
        />
    );

    if (!currentProducts || currentProducts.length === 0) {
        return (
            <View className="flex-1 items-center justify-center gap-4 px-6 bg-gray-50 dark:bg-black">
                <Text className="text-4xl">📸</Text>
                <Text className="text-xl font-bold text-gray-900 dark:text-white text-center">No Products Yet</Text>
                <Text className="text-gray-600 dark:text-gray-400 text-center">Scan an item from your closet to find matches</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Scanner' as never)}
                    className="mt-4 bg-[#00D9FF] px-8 py-3 rounded-xl"
                >
                    <Text className="text-white font-bold">Start Scanning</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Fix: Remove outer ScrollView to prevent "VirtualizedLists inside ScrollView" error
    // The TabView's scenes (ProductList) already contain FlatLists which manage scrolling.
    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
            <View className="flex-1">
                {/* Header Section (Static) */}
                <View className="px-6 pt-4 pb-2">
                    <ItemPreviewCard
                        imageUri={lastScannedImage || ''}
                        detection={currentDetection}
                        onRefine={() => console.log('Refine')}
                    />

                    <View className="mb-2">
                        <AttributeChips detection={currentDetection} />
                    </View>
                </View>

                {/* Tab View (Scrolls Internally) */}
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                    renderTabBar={renderTabBar}
                    style={{ flex: 1 }}
                />
            </View>
        </SafeAreaView>
    );
};
