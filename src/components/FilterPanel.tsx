import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal, DollarSign, MapPin, Store, ChevronDown } from 'lucide-react';
import { useAppStore } from '@store/useAppStore';
import type { SortOption } from '../types';

interface FilterPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function FilterPanel({ isOpen, onClose }: FilterPanelProps) {
    const { filters, setFilters, resetFilters } = useAppStore();
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['price', 'sort']));

    const toggleSection = (section: string) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(section)) {
            newExpanded.delete(section);
        } else {
            newExpanded.add(section);
        }
        setExpandedSections(newExpanded);
    };

    const sortOptions: { value: SortOption; label: string }[] = [
        { value: 'relevance', label: 'Most Relevant' },
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
        { value: 'distance', label: 'Nearest Stores' },
        { value: 'rating', label: 'Highest Rated' }
    ];

    const retailers = ['Zara', 'H&M', 'Nike', 'Adidas', 'Gap', 'Target', 'Macy\'s'];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
                                <h2 className="text-slate-900">Filters & Sort</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Sort */}
                            <FilterSection
                                title="Sort By"
                                icon={SlidersHorizontal}
                                isExpanded={expandedSections.has('sort')}
                                onToggle={() => toggleSection('sort')}
                            >
                                <div className="space-y-2">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setFilters({ sortBy: option.value })}
                                            className={`w-full text-left px-4 py-3 rounded-xl transition-all ${filters.sortBy === option.value
                                                ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-700'
                                                : 'bg-slate-50 border-2 border-transparent text-slate-700 hover:bg-slate-100'
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </FilterSection>

                            {/* Price Range */}
                            <FilterSection
                                title="Price Range"
                                icon={DollarSign}
                                isExpanded={expandedSections.has('price')}
                                onToggle={() => toggleSection('price')}
                            >
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-sm text-slate-600 mb-1 block">Min</label>
                                            <input
                                                type="number"
                                                value={filters.priceRange.min}
                                                onChange={(e) => setFilters({
                                                    priceRange: { ...filters.priceRange, min: Number(e.target.value) }
                                                })}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                                                placeholder="$0"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-sm text-slate-600 mb-1 block">Max</label>
                                            <input
                                                type="number"
                                                value={filters.priceRange.max}
                                                onChange={(e) => setFilters({
                                                    priceRange: { ...filters.priceRange, max: Number(e.target.value) }
                                                })}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                                                placeholder="$1000"
                                            />
                                        </div>
                                    </div>

                                    {/* Quick price filters */}
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { label: 'Under $50', max: 50 },
                                            { label: '$50-$100', min: 50, max: 100 },
                                            { label: '$100-$200', min: 100, max: 200 },
                                            { label: '$200+', min: 200, max: 1000 }
                                        ].map((range) => (
                                            <button
                                                key={range.label}
                                                onClick={() => setFilters({
                                                    priceRange: { min: range.min || 0, max: range.max }
                                                })}
                                                className="px-3 py-1.5 text-sm rounded-full bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                                            >
                                                {range.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </FilterSection>

                            {/* Distance */}
                            <FilterSection
                                title="Distance"
                                icon={MapPin}
                                isExpanded={expandedSections.has('distance')}
                                onToggle={() => toggleSection('distance')}
                            >
                                <div className="space-y-3">
                                    <input
                                        type="range"
                                        min="1"
                                        max="50"
                                        value={filters.maxDistance || 50}
                                        onChange={(e) => setFilters({ maxDistance: Number(e.target.value) })}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-sm text-slate-600">
                                        <span>1 mi</span>
                                        <span className="font-medium text-emerald-600">
                                            {filters.maxDistance ? `${filters.maxDistance} mi` : 'Any distance'}
                                        </span>
                                        <span>50 mi</span>
                                    </div>
                                    <button
                                        onClick={() => setFilters({ maxDistance: undefined })}
                                        className="text-sm text-emerald-600 hover:underline"
                                    >
                                        Clear distance filter
                                    </button>
                                </div>
                            </FilterSection>

                            {/* Retailers */}
                            <FilterSection
                                title="Retailers"
                                icon={Store}
                                isExpanded={expandedSections.has('retailers')}
                                onToggle={() => toggleSection('retailers')}
                            >
                                <div className="space-y-2">
                                    {retailers.map((retailer) => (
                                        <label
                                            key={retailer}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={filters.retailers.includes(retailer)}
                                                onChange={(e) => {
                                                    const newRetailers = e.target.checked
                                                        ? [...filters.retailers, retailer]
                                                        : filters.retailers.filter(r => r !== retailer);
                                                    setFilters({ retailers: newRetailers });
                                                }}
                                                className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <span className="text-slate-700">{retailer}</span>
                                        </label>
                                    ))}
                                </div>
                            </FilterSection>

                            {/* Availability */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.inStockOnly}
                                        onChange={(e) => setFilters({ inStockOnly: e.target.checked })}
                                        className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="text-slate-700">In Stock Only</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.storePickupOnly}
                                        onChange={(e) => setFilters({ storePickupOnly: e.target.checked })}
                                        className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="text-slate-700">Store Pickup Available</span>
                                </label>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex gap-3">
                            <button
                                onClick={resetFilters}
                                className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg transition-shadow"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

interface FilterSectionProps {
    title: string;
    icon: React.ElementType;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

function FilterSection({ title, icon: Icon, isExpanded, onToggle, children }: FilterSectionProps) {
    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium text-slate-900">{title}</span>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''
                        }`}
                />
            </button>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 bg-white">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
