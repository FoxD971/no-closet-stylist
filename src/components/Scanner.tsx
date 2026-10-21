import { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useAppStore } from '../store/useAppStore';
import { Image as ImageIcon, SwitchCamera, Zap } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface ScannerProps {
  onImageCapture: (imageUri: string) => void;
}

const { width, height } = Dimensions.get('window');

export function Scanner({ onImageCapture }: ScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const { loading } = useAppStore();
  const [cameraReady, setCameraReady] = useState(false);
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [flashEnabled, setFlashEnabled] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900 p-6">
        <Text className="text-white text-center text-lg mb-4 font-medium">
          Camera access required
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-brand-500 px-6 py-3 rounded-xl shadow-lg shadow-brand-500/50"
        >
          <Text className="text-white font-bold tracking-wide">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current || !cameraReady) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        base64: false,
        skipProcessing: false,
      });

      if (photo?.uri) {
        onImageCapture(photo.uri);
      }
    } catch (error) {
      console.error('Camera capture error:', error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.9,
    });

    if (!result.canceled) {
      onImageCapture(result.assets[0].uri);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlashEnabled(current => !current);
  };

  return (
    <View style={StyleSheet.absoluteFill} className="bg-black">
      {/* Full Screen Camera */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        enableTorch={flashEnabled && facing === 'back'}
        onCameraReady={() => setCameraReady(true)}
      />

      {/* Header - Scan Look Title with Flash */}
      {cameraReady && !loading && (
        <View className="absolute top-16 left-0 right-0 z-10">
          <Animated.View
            entering={FadeIn.duration(800)}
            className="items-center"
          >
            <Text className="text-white text-3xl font-semibold tracking-wide">Scan Look</Text>
            <Text className="text-white/70 text-sm mt-1">Point at one item at a time for best matches</Text>
          </Animated.View>

          {/* Flash Toggle - Top Right */}
          {facing === 'back' && (
            <TouchableOpacity
              onPress={toggleFlash}
              className="absolute right-6 top-0 w-10 h-10 rounded-full items-center justify-center bg-black/30 border border-white/20"
            >
              <Zap size={20} color="white" fill={flashEnabled ? 'white' : 'transparent'} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Center Focus Frame & Overlay */}
      {cameraReady && (
        <View className="absolute inset-0 items-center justify-center pointer-events-none">
          <Animated.View entering={FadeIn.duration(800)} className="w-full h-full items-center justify-center">

            {/* Dark semi-transparent overlay everywhere EXCEPT the viewport */}
            {/* Note: React Native View doesn't support 'mask-image' easily without SVG or MaskedView. 
                 Simple workaround: 4 dark views around the center hole. */}

            {/* Top Dark Region */}
            <View className="absolute top-0 w-full bg-black/60 h-[25%]" />
            {/* Bottom Dark Region */}
            <View className="absolute bottom-0 w-full bg-black/60 h-[35%]" />
            {/* Left Dark Region */}
            <View className="absolute left-0 top-[25%] bottom-[35%] w-[10%] bg-black/60" />
            {/* Right Dark Region */}
            <View className="absolute right-0 top-[25%] bottom-[35%] w-[10%] bg-black/60" />

            {/* The Viewport (matches the hole logic above: 80% width, ~40% height) */}
            <View className="w-[80%] aspect-[3/4] rounded-3xl border border-white/30 relative">

              {/* Label ABOVE the frame */}
              <View className="absolute -top-12 w-full items-center">
                <Text className="text-white font-semibold text-lg drop-shadow-md">
                  Center item here
                </Text>
              </View>

              {/* Corner Accents (Thicker, brighter) */}
              <View className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-[#00D9FF] rounded-tl-xl" />
              <View className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-[#00D9FF] rounded-tr-xl" />
              <View className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-[#00D9FF] rounded-bl-xl" />
              <View className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-[#00D9FF] rounded-br-xl" />

              {/* Scan Line Animation (Optional Polish) */}
              {!loading && (
                <Animated.View
                  className="absolute w-full h-1 bg-[#00D9FF]/50 shadow-[0_0_15px_#00D9FF]"
                  style={{ top: '50%' }}
                />
              )}
            </View>

            {/* Hint BELOW the frame */}
            <View className="absolute bottom-[28%] w-full items-center px-8">
              <Text className="text-white/80 text-center text-sm">
                Make sure the item is well-lit and clearly visible
              </Text>
            </View>

          </Animated.View>
        </View>
      )}

      {/* Bottom Controls */}
      <Animated.View
        entering={FadeIn.duration(1000).delay(200)}
        className="absolute bottom-20 left-0 right-0 items-center pb-8 px-6"
      >
        <View className="flex-row items-center justify-between w-full max-w-sm">
          {/* Gallery Button */}
          <TouchableOpacity
            onPress={pickImage}
            disabled={loading || !cameraReady}
            className={`w-14 h-14 rounded-full items-center justify-center ${loading || !cameraReady ? 'bg-gray-700/50 opacity-50' : 'bg-white/20 border border-white/40 active:bg-white/30'
              }`}
          >
            <ImageIcon size={24} color="white" />
          </TouchableOpacity>

          {/* Capture Button */}
          <TouchableOpacity
            onPress={takePicture}
            disabled={loading || !cameraReady}
            className={`items-center justify-center ${loading || !cameraReady ? 'opacity-50' : ''}`}
            activeOpacity={0.7}
          >
            {/* Outer ring with gold accent */}
            <View className={`w-20 h-20 rounded-full items-center justify-center ${loading ? 'border-4 border-gray-600 bg-gray-600' : 'border-4 border-[#E8B86D] bg-white/10'
              }`}>
              {/* Inner circle */}
              <View className={`w-16 h-16 rounded-full ${loading ? 'bg-gray-700' : 'bg-white'}`} />
            </View>
          </TouchableOpacity>

          {/* Flip Camera Button */}
          <TouchableOpacity
            onPress={toggleCameraFacing}
            disabled={loading || !cameraReady}
            className={`w-14 h-14 rounded-full items-center justify-center ${loading || !cameraReady ? 'bg-gray-700/50 opacity-50' : 'bg-white/20 border border-white/40 active:bg-white/30'
              }`}
          >
            <SwitchCamera size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Loading Overlay */}
      {loading && (
        <Animated.View
          entering={FadeIn.duration(300)}
          className="absolute inset-0 bg-black/50 items-center justify-center z-50"
        >
          <View className="bg-white/10 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/20">
            <Text className="text-white font-semibold text-base">SCANNING...</Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
