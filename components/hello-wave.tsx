/*
 * ============================================
 * WATERMARK DEVELOPER
 * ============================================
 * Nama        : Dendi Pratama Riawan
 * GitHub      : github/DendiPratamaRiawan
 * ============================================
 */

// Import Animated dari react-native-reanimated untuk animasi performa tinggi
// Animated.Text adalah komponen Text yang mendukung animasi dengan performa optimal
import Animated from 'react-native-reanimated';

/**
 * Komponen HelloWave - Emoji wave dengan animasi rotasi
 * 
 * Komponen ini menampilkan emoji wave (👋) yang beranimasi dengan rotasi.
 * Animasi bekerja dengan cara:
 * 1. Emoji berputar 25 derajat pada 50% durasi animasi
 * 2. Animasi diulang 4 kali
 * 3. Setiap iterasi berlangsung selama 300ms
 * 4. Total durasi animasi: 4 x 300ms = 1200ms (1.2 detik)
 * 
 * Komponen ini biasanya digunakan untuk menyambut user atau memberikan
 * efek visual yang menarik di halaman welcome/about.
 * 
 * @returns JSX.Element - Komponen Animated.Text dengan emoji wave yang beranimasi
 * 
 * Contoh penggunaan:
 * ```tsx
 * <HelloWave />
 * ```
 */
export function HelloWave() {
  // ============================================
  // RENDER EMOJI DENGAN ANIMASI
  // ============================================
  /**
   * Render Animated.Text dengan emoji wave dan animasi rotasi
   * 
   * Style yang diterapkan:
   * - fontSize: Ukuran font untuk emoji
   * - lineHeight: Tinggi baris untuk spacing
   * - marginTop: Margin negatif untuk alignment yang lebih baik
   * - animationName: Keyframes untuk animasi rotasi
   * - animationIterationCount: Jumlah pengulangan animasi
   * - animationDuration: Durasi setiap iterasi animasi
   */
  return (
    /* Animated.Text untuk menampilkan emoji dengan animasi */
    <Animated.Text
      style={{
        // Ukuran font 28px (cukup besar untuk emoji)
        fontSize: 28,
        // Tinggi baris 32px untuk spacing yang nyaman
        lineHeight: 32,
        // Margin negatif untuk alignment yang lebih baik dengan teks di sekitarnya
        marginTop: -6,
        
        /**
         * Keyframes animasi untuk rotasi
         * animationName mendefinisikan keyframes animasi dengan property CSS
         * '50%' berarti pada 50% durasi animasi, transform rotate akan diterapkan
         * Emoji akan berputar 25 derajat ke kanan pada tengah animasi
         */
        animationName: {
          '50%': {
            // Rotasi 25 derajat ke kanan pada 50% durasi animasi
            transform: [{ rotate: '25deg' }],
          },
        },
        
        /**
         * Jumlah pengulangan animasi
         * Nilai 4 berarti animasi akan diulang 4 kali sebelum berhenti
         * Setelah 4 kali, emoji akan kembali ke posisi awal tanpa rotasi
         */
        animationIterationCount: 4,
        
        /**
         * Durasi setiap iterasi animasi
         * '300ms' berarti setiap putaran animasi berlangsung selama 300 milidetik
         * Dengan 4 iterasi, total durasi animasi adalah 4 x 300ms = 1200ms (1.2 detik)
         */
        animationDuration: '300ms',
      }}>
      {/* Emoji wave (👋) yang akan beranimasi dengan rotasi */}
      👋
    </Animated.Text>
  );
}
