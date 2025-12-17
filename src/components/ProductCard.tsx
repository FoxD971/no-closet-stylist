import { motion } from 'framer-motion';
import { Heart, MapPin, ExternalLink, Star } from 'lucide-react';
import { useAppStore } from '@store/useAppStore';
import { formatPrice, calculateSavings } from '@utils/formatting';
import type { Product } from '../types';

interface ProductCardProps {
    product: Product;
    onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
    const { isSaved, addSavedItem, removeSavedItem } = useAppStore();
    const saved = isSaved(product.id);

    const handleSaveToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (saved) {
            removeSavedItem(product.id);
        } else {
            addSavedItem(product);
        }
    };

    const savings = product.originalPrice
        ? calculateSavings(product.originalPrice, product.price)
        : 0;

    const nearestStore = product.storeAvailability?.[0];

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all cursor-pointer"
        >
            {/* Image */}
            <div className="relative aspect-square bg-slate-100">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {savings > 0 && (
                        <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            {savings}% OFF
                        </div>
                    )}
                    {!product.inStock && (
                        <div className="bg-slate-900 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Out of Stock
                        </div>
                    )}
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSaveToggle}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
                >
                    <Heart
                        className={`w-5 h-5 transition-all ${saved ? 'fill-red-500 text-red-500' : 'text-slate-600'
                            }`}
                    />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Brand & Rating */}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-emerald-600 font-medium">{product.brand}</span>
                    {product.rating && (
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-slate-600">{product.rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>

                {/* Name */}
                <h3 className="text-slate-900 mb-2 line-clamp-2 min-h-[3rem]">
                    {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-slate-900 font-semibold">
                        {formatPrice(product.price, product.currency)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-slate-400 line-through">
                            {formatPrice(product.originalPrice, product.currency)}
                        </span>
                    )}
                </div>

                {/* Retailer */}
                <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-slate-600">{product.retailer.name}</span>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                </div>

                {/* Store Availability */}
                {nearestStore && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg">
                        <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-sm text-emerald-700">
                            {nearestStore.distance} {nearestStore.distanceUnit} away
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
