/*
 * ============================================
 * WATERMARK DEVELOPER
 * ============================================
 * Nama        : Dendi Pratama Riawan
 * GitHub      : github/DendiPratamaRiawan
 * ============================================
 */

// Import View dan ViewProps dari React Native
// View: Komponen container/view dasar dari React Native
// ViewProps: Tipe untuk props yang diterima komponen View
import { View, type ViewProps } from 'react-native';

// Import hook useThemeColor untuk mendapatkan warna berdasarkan tema
// Hook ini akan mengembalikan warna yang sesuai dengan tema sistem saat ini
import { useThemeColor } from '@/hooks/use-theme-color';

// ============================================
// TIPE DATA PROPS
// ============================================
/**
 * Tipe data untuk props komponen ThemedView
 * 
 * Tipe ini menggabungkan ViewProps (semua props standar View) dengan props tambahan:
 * - lightColor: Warna background untuk light mode (opsional)
 * - darkColor: Warna background untuk dark mode (opsional)
 * 
 * Jika lightColor atau darkColor tidak diberikan, akan menggunakan warna default dari theme
 * 
 * Menggunakan intersection type (&) untuk menggabungkan ViewProps dengan props tambahan
 */
export type ThemedViewProps = ViewProps & {
  /**
   * Warna background untuk light mode
   * Opsional: Jika tidak diberikan, akan menggunakan warna default dari theme
   */
  lightColor?: string;
  
  /**
   * Warna background untuk dark mode
   * Opsional: Jika tidak diberikan, akan menggunakan warna default dari theme
   */
  darkColor?: string;
};

/**
 * Komponen ThemedView - View dengan dukungan theme otomatis
 * 
 * Komponen ini adalah wrapper untuk View yang secara otomatis menyesuaikan
 * warna background berdasarkan tema sistem (light/dark mode).
 * 
 * Cara kerja:
 * 1. Menggunakan hook useThemeColor untuk mendapatkan warna background yang sesuai tema
 * 2. Menggabungkan backgroundColor dengan style yang diberikan
 * 3. Meneruskan semua props lainnya ke View
 * 
 * Keuntungan menggunakan komponen ini:
 * - Tidak perlu manual check tema sistem
 * - Konsisten dengan tema aplikasi
 * - Mudah digunakan dengan hanya menentukan lightColor dan darkColor
 * 
 * @param style - Style tambahan yang akan digabungkan dengan backgroundColor (opsional)
 * @param lightColor - Warna background untuk light mode (opsional)
 * @param darkColor - Warna background untuk dark mode (opsional)
 * @param otherProps - Semua props View lainnya yang akan diteruskan ke View
 * 
 * @returns JSX.Element - Komponen View dengan backgroundColor yang sesuai tema
 * 
 * Contoh penggunaan:
 * ```tsx
 * <ThemedView 
 *   lightColor="#ffffff" 
 *   darkColor="#1a1a2e"
 *   style={{ padding: 20 }}
 * >
 *   <Text>Konten</Text>
 * </ThemedView>
 * ```
 */
export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  // ============================================
  // MENDAPATKAN WARNA BACKGROUND BERDASARKAN TEMA
  // ============================================
  /**
   * Menggunakan hook useThemeColor untuk mendapatkan warna background yang sesuai tema
   * 
   * useThemeColor akan:
   * 1. Mendeteksi tema sistem saat ini (light/dark)
   * 2. Mengembalikan lightColor jika tema light dan lightColor diberikan
   * 3. Mengembalikan darkColor jika tema dark dan darkColor diberikan
   * 4. Mengembalikan warna default dari theme jika lightColor/darkColor tidak diberikan
   * 
   * Parameter kedua 'background' adalah key untuk warna default dari theme
   * Jika lightColor/darkColor tidak diberikan, akan menggunakan theme.background
   */
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  // ============================================
  // RENDER VIEW DENGAN BACKGROUND COLOR YANG SESUAI TEMA
  // ============================================
  /**
   * Render View dengan:
   * - backgroundColor yang sudah disesuaikan dengan tema
   * - style yang diberikan sebagai prop (jika ada)
   * - Semua props View lainnya yang diteruskan melalui otherProps
   * 
   * Menggunakan array style untuk menggabungkan backgroundColor dengan style prop
   * Array style akan digabungkan dari kiri ke kanan (yang kanan akan override yang kiri)
   */
  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
