import { useState } from 'react';
import { motion } from 'framer-motion';
import { Grid3x3, List, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { FilterPanel } from './FilterPanel';
import { useAppStore } from '@store/useAppStore';
import { filterProducts } from '@services/productService';
import type { Product } from '../types';

interface ProductListProps {
    products: Product[];
    onProductClick: (product: Product) => void;
}

export function ProductList({ products, onProductClick }: ProductListProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);
    const { filters } = useAppStore();

    // Apply filters
    const filteredProducts = filterProducts(products, filters);

    return (
        <div className="h-full flex flex-col bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-slate-900">
                        {filteredProducts.length} {filteredProducts.length === 1 ? 'Result' : 'Results'}
                    </h2>

                    <div className="flex items-center gap-2">
                        {/* View Toggle */}
                        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded transition-colors ${viewMode === 'grid'
                                    ? 'bg-white text-emerald-600 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                <Grid3x3 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded transition-colors ${viewMode === 'list'
                                    ? 'bg-white text-emerald-600 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Filter Button */}
                        <button
                            onClick={() => setShowFilters(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                            <span>Filters</span>
                        </button>
                    </div>
                </div>

                {/* Active Filters */}
                {(filters.retailers.length > 0 ||
                    filters.maxDistance ||
                    filters.priceRange.min > 0 ||
                    filters.priceRange.max < 1000) && (
                        <div className="flex flex-wrap gap-2">
                            {filters.retailers.map((retailer) => (
                                <span
                                    key={retailer}
                                    className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                                >
                                    {retailer}
                                </span>
                            ))}
                            {filters.maxDistance && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                    Within {filters.maxDistance} mi
                                </span>
                            )}
                            {(filters.priceRange.min > 0 || filters.priceRange.max < 1000) && (
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                    ${filters.priceRange.min} - ${filters.priceRange.max}
                                </span>
                            )}
                        </div>
                    )}
            </div>

            {/* Product Grid/List */}
            <div className="flex-1 overflow-y-auto p-6">
                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <SlidersHorizontal className="w-12 h-12 text-slate-400" />
                        </div>
                        <h3 className="text-slate-900 mb-2">No products found</h3>
                        <p className="text-slate-600 max-w-sm">
                            Try adjusting your filters or search criteria
                        </p>
                    </div>
                ) : (
                    <div
                        className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                                : 'flex flex-col gap-4'
                        }
                    >
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <ProductCard
                                    product={product}
                                    onClick={() => onProductClick(product)}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Filter Panel */}
            <FilterPanel isOpen={showFilters} onClose={() => setShowFilters(false)} />
        </div>
    );
}
