import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Image as ImageIcon, Focus, Zap, Grid3x3 } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';

interface ScannerProps {
  onImageCapture: (imageData: string) => void;
  isDetecting?: boolean;
}

export function Scanner({ onImageCapture, isDetecting = false }: ScannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleCapture = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        const image = await CapacitorCamera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Base64,
          source: CameraSource.Camera
        });

        if (image.base64String) {
          onImageCapture(`data:image/jpeg;base64,${image.base64String}`);
        }
      } catch (error) {
        console.error('Camera error:', error);
      }
    } else {
      // Web fallback (mock)
      setIsScanning(true);

      setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const gradient = ctx.createLinearGradient(0, 0, 0, 600);
          gradient.addColorStop(0, '#3b82f6');
          gradient.addColorStop(1, '#8b5cf6');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 400, 600);

          ctx.fillStyle = 'white';
          ctx.font = '24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Sample Hoodie', 200, 300);
        }

        const imageData = canvas.toDataURL('image/png');
        onImageCapture(imageData);
        setIsScanning(false);
      }, 2000);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageCapture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {/* Background Camera Feed */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1765009433753-c7462637d21f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBzdG9yZSUyMGludGVyaW9yfGVufDF8fHx8MTc2NTkzMDg3Nnww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Camera feed"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      </div>

      {/* Main UI Container */}
      <div className="relative z-10 h-full flex flex-col">

        {/* Top Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between px-6 py-5"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
            <span className="text-white drop-shadow-lg">Live</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Grid3x3 className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </button>
          </div>
        </motion.div>

        {/* Center Scanning Area */}
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full max-w-md"
          >
            {/* Main Scan Frame */}
            <div className="relative aspect-[3/4]">
              {/* Glass Border Frame */}
              <div className="absolute inset-0 rounded-3xl border-2 border-white/30 overflow-hidden">
                {/* Corner Markers */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-3 border-t-3 border-emerald-400 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-3 border-t-3 border-emerald-400 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-3 border-b-3 border-emerald-400 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-3 border-b-3 border-emerald-400 rounded-br-lg" />
              </div>

              {/* Scanning Line */}
              {isScanning && (
                <motion.div
                  className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-lg shadow-emerald-400/50"
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 2, ease: 'linear' }}
                />
              )}

              {/* Center Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                {!isScanning && !isDetecting ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-8 py-6"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                        <Focus className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-center">
                        <p className="text-white">Point at clothing</p>
                        <p className="text-white/60 text-sm mt-1">Tap to scan</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="backdrop-blur-xl bg-emerald-500/20 border border-emerald-400/30 rounded-2xl px-8 py-6"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        className="w-16 h-16 rounded-full border-4 border-emerald-400 border-t-transparent"
                      />
                      <p className="text-white">Analyzing</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Info Tags */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute left-0 top-1/4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-r-xl px-4 py-2"
              >
                <p className="text-white text-xs">AI Vision</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="absolute right-0 top-2/3 backdrop-blur-xl bg-white/10 border border-white/20 rounded-l-xl px-4 py-2"
              >
                <p className="text-white text-xs">Real-time</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="px-6 pb-10 pt-6"
        >
          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-6 mb-6">
            {/* Gallery */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <ImageIcon className="w-6 h-6 text-white" />
            </button>

            {/* Capture */}
            <button
              onClick={handleCapture}
              disabled={isScanning}
              className="relative w-20 h-20 disabled:opacity-50"
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-white/20"
                animate={isScanning ? {
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0, 0.2],
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: isScanning ? Infinity : 0,
                }}
              />
              <div className="absolute inset-1 rounded-full border-4 border-white/40 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                  <Camera className="w-7 h-7 text-white" />
                </div>
              </div>
            </button>

            {/* Spacer */}
            <div className="w-16 h-16" />
          </div>

          {/* Bottom Info */}
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-white/5 border border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-white/80 text-sm">Ready to scan</span>
            </div>
          </div>
        </motion.div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
