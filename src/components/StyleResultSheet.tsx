import { motion } from 'framer-motion';
import { X, ExternalLink, Sparkles, ShoppingCart, TrendingDown, Star, CheckCircle } from 'lucide-react';
import type { Product } from '../types';
import { useAppStore } from '../store/useAppStore';

interface StyleResultSheetProps {
  product: Product;
  onClose: () => void;
  onTryOn: () => void;
}

export function StyleResultSheet({ product, onClose, onTryOn }: StyleResultSheetProps) {
  const retailerName = typeof product.retailer === 'string' ? product.retailer : product.retailer?.name || 'Store';
  const { currentProducts } = useAppStore();

  const cheapest = product.cheapestOffer;
  const bestRated = product.bestRatedOffer;
  const allOffers = product.offers || [];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 bg-gradient-to-b from-slate-50 to-white">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        <div className="px-6 pb-12 bg-white">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors z-10"
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>

          {/* Product Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 pr-12"
          >
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-1">
              {product.category || 'Matched Item'}
            </p>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h2>
            <p className="text-slate-600 text-sm">Found {currentProducts.length} similar matches</p>
          </motion.div>

          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="w-full h-80 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl mb-6 overflow-hidden shadow-lg"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Product';
              }}
            />
          </motion.div>

          {/* Price Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex items-end gap-3">
              <div className="text-4xl font-bold text-slate-900">
                ${product.price.toFixed(2)}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="pb-2">
                  <div className="text-lg line-through text-slate-400">
                    ${product.originalPrice.toFixed(2)}
                  </div>
                  <div className="text-sm font-bold text-red-600">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </div>
                </div>
              )}
            </div>
            <p className="text-slate-600 text-sm mt-2">via {retailerName}</p>
            {product.inStock && (
              <div className="flex items-center gap-2 mt-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">In Stock</span>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="grid grid-cols-2 gap-3 mb-8"
          >
            <motion.a
              href={product.url}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-slate-900 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors font-semibold"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Buy Now</span>
            </motion.a>
            <motion.button
              onClick={onTryOn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-shadow font-semibold"
            >
              <Sparkles className="w-4 h-4" />
              <span>Try On</span>
            </motion.button>
          </motion.div>

          {/* Best Deals */}
          {(cheapest || bestRated) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-3">Best Offers</h3>
              <div className="space-y-3">
                {cheapest && (
                  <motion.a
                    href={cheapest.url}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-2xl border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 flex items-center justify-between cursor-pointer hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-200 flex items-center justify-center">
                        <TrendingDown className="w-5 h-5 text-green-700" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Lowest Price</div>
                        <div className="text-xs text-slate-600">{typeof cheapest.retailer === 'string' ? cheapest.retailer : (cheapest.retailer as any)?.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">${cheapest.price.toFixed(2)}</div>
                      {cheapest.discount && <div className="text-xs text-green-600 font-semibold">{cheapest.discount}</div>}
                    </div>
                  </motion.a>
                )}

                {bestRated && bestRated.productId !== cheapest?.productId && (
                  <motion.a
                    href={bestRated.url}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 flex items-center justify-between cursor-pointer hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-200 flex items-center justify-center">
                        <Star className="w-5 h-5 text-amber-700" fill="currentColor" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Top Rated</div>
                        <div className="text-xs text-slate-600">{typeof bestRated.retailer === 'string' ? bestRated.retailer : (bestRated.retailer as any)?.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-amber-600">${bestRated.price.toFixed(2)}</div>
                      {bestRated.rating && <div className="text-xs font-bold text-amber-600">⭐ {bestRated.rating.toFixed(1)}</div>}
                    </div>
                  </motion.a>
                )}
              </div>
            </motion.div>
          )}

          {/* All Offers */}
          {allOffers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mb-6"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                All Offers ({allOffers.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {allOffers
                  .sort((a, b) => (a.price || 0) - (b.price || 0))
                  .map((offer, idx) => (
                    <motion.a
                      key={`offer_${idx}`}
                      href={offer.url}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex-shrink-0 text-2xl">🏪</div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-900 truncate">
                            {typeof offer.retailer === 'string' ? offer.retailer : (offer.retailer as any)?.name}
                          </div>
                          {offer.rating && <div className="text-xs text-amber-600">⭐ {offer.rating.toFixed(1)}</div>}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold text-slate-900">${offer.price.toFixed(2)}</div>
                        <ExternalLink className="w-3 h-3 text-slate-400 mt-1 inline-block" />
                      </div>
                    </motion.a>
                  ))}
              </div>
            </motion.div>
          )}

          {/* Additional Info */}
          {product.reviewCount && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 bg-slate-50 rounded-xl"
            >
              <p className="text-xs text-slate-600">
                <span className="font-bold text-slate-900">{product.reviewCount}</span> customer reviews
              </p>
              {product.rating && (
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  Average rating: <span className="text-amber-600">⭐ {product.rating.toFixed(1)}</span>
                </p>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
}
