import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, ScrollView, Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { X, Heart, Star } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import type { Product } from '../types';
import { useAppStore } from '../store/useAppStore';
import { theme } from '../theme';

interface VirtualTryOnProps {
    product: Product;
    onClose: () => void;
}

export function VirtualTryOn({ product, onClose }: VirtualTryOnProps) {
    const [isSaved, setIsSaved] = useState(false);
    const { isSaved: checkIsSaved, addSavedItem, removeSavedItem } = useAppStore();

    useEffect(() => {
        setIsSaved(checkIsSaved(product.id));
    }, [product.id]);

    const handleSaveToggle = () => {
        if (isSaved) {
            removeSavedItem(product.id);
            setIsSaved(false);
        } else {
            addSavedItem(product);
            setIsSaved(true);
        }
    };

    const handleVisitStore = async () => {
        console.log('🔗 [STORE] Opening browser for:', product.url);
        if (product.url) {
            try {
                // Use WebBrowser (In-App Browser) for better experience & reliability
                const result = await WebBrowser.openBrowserAsync(product.url, {
                    presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
                    controlsColor: theme.colors.primary,
                    toolbarColor: theme.colors.background,
                });
                console.log('✅ [STORE] Browser closed:', result);
            } catch (error) {
                console.error('❌ [STORE] Failed to open browser, trying fallback:', error);
                // Fallback to external browser
                Linking.openURL(product.url).catch(err =>
                    console.error('❌ [STORE] critical failure opening URL:', err)
                );
            }
        }
    };

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={16}
                color={i < Math.floor(rating) ? '#FFB800' : '#E0E0E0'}
                fill={i < Math.floor(rating) ? '#FFB800' : 'transparent'}
            />
        ));
    };

    return (
        <Modal animationType="slide" transparent={false} onRequestClose={onClose}>
            <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
                {/* Header with back and save buttons */}
                <View style={{
                    position: 'absolute',
                    top: 48,
                    left: 0,
                    right: 0,
                    zIndex: 20,
                    paddingHorizontal: theme.spacing.lg,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <TouchableOpacity
                        onPress={onClose}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: theme.colors.background,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <X size={20} color={theme.colors.text.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSaveToggle}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: theme.colors.background,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Heart
                            size={20}
                            color={isSaved ? '#EF4444' : theme.colors.text.primary}
                            fill={isSaved ? '#EF4444' : 'transparent'}
                        />
                    </TouchableOpacity>
                </View>

                {/* Scrollable Content */}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Large Product Image */}
                    <Animated.View
                        entering={FadeIn.duration(600)}
                        style={{
                            width: '100%',
                            height: 500,
                            backgroundColor: theme.colors.backgroundSecondary,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Image
                            source={{ uri: product.imageUrl }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="contain"
                        />
                    </Animated.View>

                    {/* Product Information */}
                    <View style={{ paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.lg, paddingBottom: 120 }}>
                        {/* Brand */}
                        <Text style={{
                            color: theme.colors.primary,
                            fontSize: 12,
                            fontWeight: '600',
                            letterSpacing: 1,
                            marginBottom: theme.spacing.sm,
                            textTransform: 'uppercase'
                        }}>
                            {product.brand || product.category}
                        </Text>

                        {/* Product Name */}
                        <Text style={{
                            color: theme.colors.text.primary,
                            fontSize: 24,
                            fontWeight: 'bold',
                            marginBottom: theme.spacing.md,
                            lineHeight: 32
                        }}>
                            {product.name}
                        </Text>

                        {/* Price */}
                        {product.price > 0 ? (
                            <Text style={{
                                color: theme.colors.text.primary,
                                fontSize: 28,
                                fontWeight: 'bold',
                                marginBottom: theme.spacing.sm
                            }}>
                                ${product.price.toFixed(2)}
                            </Text>
                        ) : (
                            <Text style={{
                                color: theme.colors.text.secondary,
                                fontSize: 16,
                                marginBottom: theme.spacing.sm
                            }}>
                                Price available on store
                            </Text>
                        )}

                        {/* Rating */}
                        {product.rating && (
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 8,
                                marginBottom: theme.spacing.lg
                            }}>
                                <View style={{ flexDirection: 'row', gap: 2 }}>
                                    {renderStars(product.rating)}
                                </View>
                                <Text style={{ color: theme.colors.text.secondary, fontSize: 14 }}>
                                    {product.rating.toFixed(1)} {product.reviewCount ? `(${product.reviewCount} Reviews)` : ''}
                                </Text>
                            </View>
                        )}

                        {/* About this item */}
                        <View style={{ marginTop: theme.spacing.lg }}>
                            <Text style={{
                                color: theme.colors.text.primary,
                                fontSize: 18,
                                fontWeight: '600',
                                marginBottom: theme.spacing.sm
                            }}>
                                About this item
                            </Text>
                            <Text style={{
                                color: theme.colors.text.secondary,
                                fontSize: 14,
                                lineHeight: 22
                            }}>
                                {product.category === 'Visual Match'
                                    ? 'This item was found through visual search. Tap "View on Store" below to see full details, size options, and additional product information.'
                                    : 'View product details on the retailer\'s website for sizing, materials, and more information.'}
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Fixed Bottom Button */}
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: theme.spacing.lg,
                    backgroundColor: theme.colors.background,
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.border
                }}>
                    <TouchableOpacity
                        onPress={handleVisitStore}
                        style={{
                            backgroundColor: 'transparent',
                            borderWidth: 2,
                            borderColor: theme.colors.primary,
                            paddingVertical: 16,
                            borderRadius: theme.radius.button,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        activeOpacity={0.8}
                    >
                        <Text style={{
                            color: theme.colors.primary,
                            fontSize: 16,
                            fontWeight: '600',
                            letterSpacing: 0.5
                        }}>
                            View on Store
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
