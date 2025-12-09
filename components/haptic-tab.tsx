/*
 * ============================================
 * WATERMARK DEVELOPER
 * ============================================
 * Nama        : Dendi Pratama Riawan
 * GitHub      : github/DendiPratamaRiawan
 * ============================================
 */

// Import BottomTabBarButtonProps dari @react-navigation/bottom-tabs
// Tipe ini mendefinisikan props yang diterima oleh button di tab bar
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
// Import PlatformPressable dari @react-navigation/elements
// PlatformPressable adalah komponen button yang dioptimasi untuk setiap platform
// (iOS menggunakan Pressable, Android/Web menggunakan TouchableOpacity)
import { PlatformPressable } from '@react-navigation/elements';
// Import semua fungsi dari expo-haptics untuk haptic feedback
// Haptics menyediakan API untuk memberikan feedback haptic (getar ringan) di perangkat
import * as Haptics from 'expo-haptics';

/**
 * Komponen HapticTab - Button tab dengan haptic feedback
 * 
 * Komponen ini adalah wrapper untuk button tab yang memberikan haptic feedback
 * saat user menekan tab. Haptic feedback memberikan sensasi getar ringan yang
 * meningkatkan UX dengan memberikan konfirmasi taktil saat interaksi.
 * 
 * Cara kerja:
 * 1. Menerima semua props dari BottomTabBarButtonProps
 * 2. Menggunakan PlatformPressable untuk button yang dioptimasi per platform
 * 3. Menambahkan handler onPressIn yang memberikan haptic feedback di iOS
 * 4. Memanggil onPressIn original dari props jika ada
 * 
 * Catatan:
 * - Haptic feedback hanya diaktifkan di iOS
 * - Menggunakan ImpactFeedbackStyle.Light untuk getar ringan yang tidak mengganggu
 * - Android biasanya sudah memiliki haptic feedback bawaan dari sistem
 * 
 * @param props - Props dari BottomTabBarButtonProps yang akan diteruskan ke PlatformPressable
 * @returns JSX.Element - Komponen PlatformPressable dengan haptic feedback
 * 
 * Contoh penggunaan:
 * Komponen ini digunakan di _layout.tsx sebagai tabBarButton:
 * ```tsx
 * <Tabs
 *   screenOptions={{
 *     tabBarButton: HapticTab,
 *   }}
 * />
 * ```
 */
export function HapticTab(props: BottomTabBarButtonProps) {
  // ============================================
  // RENDER BUTTON DENGAN HAPTIC FEEDBACK
  // ============================================
  /**
   * Render PlatformPressable dengan haptic feedback handler
   */
  return (
    /* PlatformPressable adalah komponen button yang dioptimasi untuk setiap platform */
    /* Spread semua props dari BottomTabBarButtonProps ke PlatformPressable */
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        /**
         * Handler saat button mulai ditekan (onPressIn)
         * Handler ini dipanggil saat user mulai menekan button, sebelum onPress
         * 
         * Proses:
         * 1. Cek apakah platform adalah iOS
         * 2. Jika iOS, berikan haptic feedback ringan
         * 3. Panggil onPressIn original dari props jika ada (optional chaining)
         */
        
        // ============================================
        // CEK PLATFORM DAN BERIKAN HAPTIC FEEDBACK
        // ============================================
        // Cek apakah aplikasi berjalan di iOS
        // Haptic feedback hanya diaktifkan di iOS karena:
        // - iOS memiliki API haptic yang lebih konsisten
        // - Android biasanya sudah memiliki haptic feedback bawaan dari sistem
        if (process.env.EXPO_OS === 'ios') {
          /**
           * Berikan haptic feedback ringan saat button ditekan
           * 
           * Haptics.impactAsync memberikan feedback haptic dengan style tertentu
           * ImpactFeedbackStyle.Light memberikan getar ringan yang tidak mengganggu
           * 
           * Style lainnya yang tersedia:
           * - Light: Getar ringan (paling halus)
           * - Medium: Getar sedang
           * - Heavy: Getar kuat (paling kuat)
           * 
           * Menggunakan async karena haptic feedback adalah operasi async
           */
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        
        // ============================================
        // PANGGIL HANDLER ORIGINAL DARI PROPS
        // ============================================
        // Panggil onPressIn original dari props jika ada
        // Menggunakan optional chaining (?.) untuk memastikan tidak error jika onPressIn tidak ada
        // ev adalah event object yang berisi informasi tentang press event
        props.onPressIn?.(ev);
      }}
    />
  );
}
