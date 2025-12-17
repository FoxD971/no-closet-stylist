import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ShoppingBag, Heart } from 'lucide-react';
import type { Product } from '../types';

interface VirtualTryOnProps {
  product: Product;
  onClose: () => void;
}

export function VirtualTryOn({ product, onClose }: VirtualTryOnProps) {
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('sage');
  const [isSaved, setIsSaved] = useState(false);

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = [
    { name: 'sage', value: '#10b981' },
    { name: 'teal', value: '#14b8a6' },
    { name: 'coral', value: '#fb923c' },
    { name: 'stone', value: '#a8a29e' },
  ];

  return (
    <div className="relative h-full w-full bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50">
      {/* Mock AR View */}
      <div className="absolute inset-0">
        {/* Simulated camera feed with overlay */}
        <div className="h-full w-full bg-gradient-to-b from-slate-50 to-slate-100 relative overflow-hidden">
          {/* Decorative background elements */}
          <motion.div
            className="absolute top-20 right-10 w-32 h-32 bg-emerald-200/15 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-32 left-10 w-40 h-40 bg-orange-200/15 rounded-full blur-2xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Body tracking indicators */}
          <motion.div
            className="absolute top-1/4 left-1/2 -translate-x-1/2"
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="w-48 h-64 border-2 border-emerald-400/50 rounded-full relative shadow-lg shadow-emerald-200/30">
              {/* AR tracking points */}
              {[
                { top: 4, left: '50%', translateX: true },
                { top: 12, left: 8 },
                { top: 12, right: 8 },
              ].map((pos, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-2 h-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-300/50 ${pos.translateX ? '-translate-x-1/2' : ''
                    }`}
                  style={{
                    top: `${pos.top * 4}px`,
                    left: pos.left ? (typeof pos.left === 'string' ? pos.left : `${pos.left * 4}px`) : undefined,
                    right: pos.right ? `${pos.right * 4}px` : undefined
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}

              {/* Simulated garment overlay */}
              <motion.div
                className="absolute inset-x-4 top-16 bottom-4 rounded-t-3xl shadow-xl"
                style={{
                  backgroundColor: colors.find(c => c.name === selectedColor)?.value
                }}
                animate={{
                  opacity: [0.65, 0.8, 0.65],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                <div className="text-center pt-8 text-white text-sm px-4">
                  {product.name}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* AR Status Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 bg-emerald-100/90 backdrop-blur-sm border border-emerald-300 px-4 py-2 rounded-full shadow-lg"
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 bg-emerald-500 rounded-full"
                animate={{
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              />
              <span className="text-emerald-800 text-sm">AR Active</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-center">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>

        <motion.button
          onClick={() => setIsSaved(!isSaved)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center hover:shadow-xl transition-all"
        >
          <Heart
            className={`w-5 h-5 transition-all ${isSaved ? 'fill-red-500 text-red-500' : 'text-slate-600'}`}
          />
        </motion.button>
      </div>

      {/* Bottom Controls */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-6 safe-bottom rounded-t-3xl shadow-2xl"
      >
        {/* Size Selection */}
        <div className="mb-4">
          <label className="text-slate-700 text-sm mb-2 block">Size</label>
          <div className="flex gap-2">
            {sizes.map((size) => (
              <motion.button
                key={size}
                onClick={() => setSelectedSize(size)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 py-2 rounded-xl transition-all shadow-sm ${selectedSize === size
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-300/40'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
              >
                {size}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="mb-6">
          <label className="text-slate-700 text-sm mb-2 block">Color</label>
          <div className="flex gap-3">
            {colors.map((color) => (
              <motion.button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-12 h-12 rounded-full border-2 transition-all shadow-md ${selectedColor === color.name
                    ? 'border-slate-700 scale-110 shadow-lg'
                    : 'border-slate-200'
                  }`}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-300/40"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Add to Cart</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
