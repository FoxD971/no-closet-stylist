import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Sparkles, X, Plus } from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { formatPrice } from '../utils/formatting';
import { StylingAdviceSection } from './StylingAdviceSection';
import { EmptyState } from './EmptyState';

export function MyCloset() {
  const { savedItems, removeSavedItem } = useAppStore();

  const StatCard = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 items-center">
      <Text className="text-3xl mb-2">{icon}</Text>
      <Text className="text-2xl font-bold text-gray-900 dark:text-white">{value}</Text>
      <Text className="text-xs text-gray-600 dark:text-gray-400 uppercase mt-1">{label}</Text>
    </View>
  );

  const ClosetItem = ({ item }: { item: any }) => (
    <Animated.View
      entering={FadeInDown.duration(400)}
      className="w-[48%] mb-4 bg-white dark:bg-gray-900 rounded-2xl p-2 shadow-sm border border-gray-100 dark:border-gray-800"
    >
      <View className="aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3 relative">
        <Image
          source={{ uri: item.product.imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <TouchableOpacity
          onPress={() => removeSavedItem(item.product.id)}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 items-center justify-center shadow-sm"
        >
          <X size={14} color="#EF4444" />
        </TouchableOpacity>
      </View>
      <Text numberOfLines={1} className="font-semibold text-gray-900 dark:text-white text-sm px-1">
        {item.product.name}
      </Text>
      <Text className="text-brand-500 font-bold text-xs mt-1 px-1">
        {formatPrice(item.product.price, item.product.currency)}
      </Text>
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-800">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white">My Closet</Text>
          <Text className="text-gray-600 dark:text-gray-400 mt-1">
            {savedItems.length} {savedItems.length === 1 ? 'item' : 'items'} saved
          </Text>
        </View>

        {/* Empty State or Content */}
        {savedItems.length === 0 ? (
          <EmptyState
            icon="👗"
            title="Your closet is empty"
            message="Start scanning clothes to build your digital wardrobe and get personalized outfit recommendations!"
          />
        ) : (
          <ScrollView className="flex-1">
            {/* Stats Section */}
            <View className="flex-row px-6 py-6 gap-4">
              <StatCard icon="👕" label="Items" value={savedItems.length.toString()} />
              <StatCard icon="✨" label="Outfits" value="0" />
              <StatCard icon="🎯" label="Matches" value="0" />
            </View>

            {/* Styling Advice */}
            {savedItems.length > 0 && (
              <View className="mb-6">
                <StylingAdviceSection onSelectProduct={(product) => {
                  console.log('Selected outfit product:', product.name);
                }} />
              </View>
            )}

            {/* Closet Grid */}
            <View className="px-6">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                All Items
              </Text>
              <View className="flex-row flex-wrap justify-between">
                {savedItems.map((item, index) => (
                  <ClosetItem key={item.product.id || index} item={item} />
                ))}

                {/* Add Item Placeholder */}
                <TouchableOpacity className="w-[48%] mb-4 aspect-[4/5] bg-gray-50 dark:bg-gray-900/50 rounded-2xl items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <View className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 items-center justify-center shadow-sm mb-2">
                    <Plus size={24} color="#9CA3AF" />
                  </View>
                  <Text className="text-gray-400 font-medium text-xs">Add Item</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
