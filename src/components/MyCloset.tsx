import { motion } from 'framer-motion';
import { Heart, TrendingUp, Clock, Sparkles } from 'lucide-react';

interface ClosetItem {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  savedDate: string;
}

export function MyCloset() {
  // Mock closet items
  const closetItems: ClosetItem[] = [
    {
      id: '1',
      name: 'Oversized Cotton Hoodie',
      category: 'Hoodie',
      imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%2310b981" width="200" height="200"/%3E%3C/svg%3E',
      savedDate: '2 days ago',
    },
    {
      id: '2',
      name: 'Wide-Leg Cargo Pants',
      category: 'Pants',
      imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%2314b8a6" width="200" height="200"/%3E%3C/svg%3E',
      savedDate: '5 days ago',
    },
    {
      id: '3',
      name: 'High-Top Sneakers',
      category: 'Shoes',
      imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23fb923c" width="200" height="200"/%3E%3C/svg%3E',
      savedDate: '1 week ago',
    },
  ];

  const stats = [
    { label: 'Saved Items', value: '12', icon: Heart },
    { label: 'Style Score', value: '94', icon: TrendingUp },
    { label: 'Recent Scans', value: '8', icon: Clock },
  ];

  return (
    <div className="h-full w-full bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-50 overflow-y-auto pb-24">
      <div className="px-6 pt-12 pb-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">My Closet</h1>
          <p className="text-slate-600">Your saved styles and discoveries</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-md hover:shadow-lg transition-shadow"
            >
              <stat.icon className="w-5 h-5 text-emerald-500 mb-2" />
              <div className="text-slate-900 mb-1">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Closet Items */}
        <div>
          <h2 className="text-slate-900 mb-4">Saved Items</h2>
          <div className="space-y-4">
            {closetItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all"
              >
                <div className="flex gap-4 p-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-slate-900 mb-1">{item.name}</h3>
                    <p className="text-slate-500 text-sm mb-2">{item.category}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{item.savedDate}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="self-start p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Empty State Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-slate-500 text-sm">Scan more items to build your digital closet</p>
          <motion.div
            className="mt-4 inline-block"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
