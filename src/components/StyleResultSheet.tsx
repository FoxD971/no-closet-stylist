import { motion } from 'framer-motion';
import { X, ExternalLink, Sparkles, ShoppingCart } from 'lucide-react';
import type { Product } from '../types';

interface StyleResultSheetProps {
  product: Product;
  onClose: () => void;
  onTryOn: () => void;
}

export function StyleResultSheet({ product, onClose, onTryOn }: StyleResultSheetProps) {
  const retailer = product.retailer;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto shadow-2xl"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>

        <div className="px-6 pb-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <h2 className="text-slate-900 mb-1">{product.name}</h2>
            <p className="text-slate-600">{product.category}</p>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full h-64 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl mb-6 overflow-hidden shadow-lg"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Try On Button - Prominent */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={onTryOn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl mb-6 flex items-center justify-center gap-2 shadow-lg shadow-emerald-300/40 hover:shadow-emerald-400/50 transition-shadow"
          >
            <Sparkles className="w-5 h-5" />
            <span>Try On in AR</span>
          </motion.button>

          {/* Retailer Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <h3 className="text-slate-900 mb-3">Available At</h3>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between p-3 rounded-xl transition-all bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300"
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-900 font-medium">{retailer.name}</span>
                {product.inStock && (
                  <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                    In Stock
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-900 font-bold">${product.price}</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </div>
            </motion.div>
          </motion.div>



          {/* Buy Now Button */}
          <motion.a
            href={product.url}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Buy Now at {retailer.name} - ${product.price}</span>
          </motion.a>
        </div>
      </motion.div>
    </>
  );
}
