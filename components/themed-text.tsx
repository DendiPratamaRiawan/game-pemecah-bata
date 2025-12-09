/*
 * ============================================
 * WATERMARK DEVELOPER
 * ============================================
 * Nama        : Dendi Pratama Riawan
 * GitHub      : github/DendiPratamaRiawan
 * ============================================
 */

// Import StyleSheet, Text, dan TextProps dari React Native
// StyleSheet: Untuk membuat style sheet yang dioptimasi
// Text: Komponen teks dasar dari React Native
// TextProps: Tipe untuk props yang diterima komponen Text
import { StyleSheet, Text, type TextProps } from 'react-native';

// Import hook useThemeColor untuk mendapatkan warna berdasarkan tema
// Hook ini akan mengembalikan warna yang sesuai dengan tema sistem saat ini
import { useThemeColor } from '@/hooks/use-theme-color';

// ============================================
// TIPE DATA PROPS
// ============================================
/**
 * Tipe data untuk props komponen ThemedText
 * 
 * Tipe ini menggabungkan TextProps (semua props standar Text) dengan props tambahan:
 * - lightColor: Warna teks untuk light mode (opsional)
 * - darkColor: Warna teks untuk dark mode (opsional)
 * - type: Tipe teks yang menentukan style yang akan digunakan (opsional)
 * 
 * Jika lightColor atau darkColor tidak diberikan, akan menggunakan warna default dari theme
 * Jika type tidak diberikan, akan menggunakan 'default'
 * 
 * Menggunakan intersection type (&) untuk menggabungkan TextProps dengan props tambahan
 */
export type ThemedTextProps = TextProps & {
  /**
   * Warna teks untuk light mode
   * Opsional: Jika tidak diberikan, akan menggunakan warna default dari theme
   */
  lightColor?: string;
  
  /**
   * Warna teks untuk dark mode
   * Opsional: Jika tidak diberikan, akan menggunakan warna default dari theme
   */
  darkColor?: string;
  
  /**
   * Tipe teks yang menentukan style yang akan digunakan
   * Opsional: Default adalah 'default'
   * 
   * Pilihan tipe:
   * - 'default': Teks standar (fontSize 16, lineHeight 24)
   * - 'defaultSemiBold': Teks standar dengan font weight semi-bold (600)
   * - 'title': Teks judul besar (fontSize 32, bold)
   * - 'subtitle': Teks subjudul (fontSize 20, bold)
   * - 'link': Teks link dengan warna biru khusus
   */
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

/**
 * Komponen ThemedText - Text dengan dukungan theme otomatis dan berbagai tipe
 * 
 * Komponen ini adalah wrapper untuk Text yang secara otomatis menyesuaikan
 * warna teks berdasarkan tema sistem (light/dark mode) dan menyediakan
 * beberapa tipe teks yang sudah di-predefined untuk konsistensi UI.
 * 
 * Cara kerja:
 * 1. Menggunakan hook useThemeColor untuk mendapatkan warna teks yang sesuai tema
 * 2. Memilih style berdasarkan tipe yang diberikan
 * 3. Menggabungkan color, style tipe, dan style yang diberikan
 * 4. Meneruskan semua props lainnya ke Text
 * 
 * Keuntungan menggunakan komponen ini:
 * - Tidak perlu manual check tema sistem
 * - Konsisten dengan tema aplikasi
 * - Mudah digunakan dengan tipe yang sudah di-predefined
 * - Dapat menentukan warna custom untuk light/dark mode
 * 
 * @param style - Style tambahan yang akan digabungkan dengan style tipe (opsional)
 * @param lightColor - Warna teks untuk light mode (opsional)
 * @param darkColor - Warna teks untuk dark mode (opsional)
 * @param type - Tipe teks yang menentukan style (default: 'default')
 * @param rest - Semua props Text lainnya yang akan diteruskan ke Text
 * 
 * @returns JSX.Element - Komponen Text dengan warna dan style yang sesuai tema dan tipe
 * 
 * Contoh penggunaan:
 * ```tsx
 * <ThemedText type="title">Judul Halaman</ThemedText>
 * <ThemedText type="subtitle">Subjudul</ThemedText>
 * <ThemedText type="link">Klik di sini</ThemedText>
 * <ThemedText lightColor="#000" darkColor="#fff">Teks dengan warna custom</ThemedText>
 * ```
 */
export function ThemedText({
  style,           // Style tambahan dari props
  lightColor,       // Warna teks untuk light mode
  darkColor,        // Warna teks untuk dark mode
  type = 'default', // Tipe teks dengan default 'default'
  ...rest          // Semua props Text lainnya
}: ThemedTextProps) {
  // ============================================
  // MENDAPATKAN WARNA TEKS BERDASARKAN TEMA
  // ============================================
  /**
   * Menggunakan hook useThemeColor untuk mendapatkan warna teks yang sesuai tema
   * 
   * useThemeColor akan:
   * 1. Mendeteksi tema sistem saat ini (light/dark)
   * 2. Mengembalikan lightColor jika tema light dan lightColor diberikan
   * 3. Mengembalikan darkColor jika tema dark dan darkColor diberikan
   * 4. Mengembalikan warna default dari theme jika lightColor/darkColor tidak diberikan
   * 
   * Parameter kedua 'text' adalah key untuk warna default dari theme
   * Jika lightColor/darkColor tidak diberikan, akan menggunakan theme.text
   */
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  // ============================================
  // RENDER TEXT DENGAN WARNA DAN STYLE YANG SESUAI TEMA DAN TIPE
  // ============================================
  /**
   * Render Text dengan:
   * - color yang sudah disesuaikan dengan tema
   * - style berdasarkan tipe yang dipilih
   * - style tambahan yang diberikan sebagai prop (jika ada)
   * - Semua props Text lainnya yang diteruskan melalui rest
   * 
   * Array style akan digabungkan dari kiri ke kanan:
   * 1. { color } - Warna teks berdasarkan tema
   * 2. Style berdasarkan tipe (jika tipe dipilih)
   * 3. style prop - Style tambahan dari user (yang terakhir, jadi bisa override)
   */
  return (
    <Text
      style={[
        { color },                                    // Warna teks berdasarkan tema
        type === 'default' ? styles.default : undefined,              // Style untuk tipe default
        type === 'title' ? styles.title : undefined,                 // Style untuk tipe title
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined, // Style untuk tipe defaultSemiBold
        type === 'subtitle' ? styles.subtitle : undefined,            // Style untuk tipe subtitle
        type === 'link' ? styles.link : undefined,                    // Style untuk tipe link
        style,                                        // Style tambahan dari user (bisa override style sebelumnya)
      ]}
      {...rest}  // Semua props Text lainnya (onPress, numberOfLines, dll)
    />
  );
}

/**
 * StyleSheet untuk berbagai tipe teks
 * Menggunakan StyleSheet.create untuk optimasi performa React Native
 * 
 * Setiap style mendefinisikan tampilan visual untuk tipe teks tertentu:
 * - fontSize: Ukuran font dalam piksel
 * - lineHeight: Tinggi baris untuk spacing yang nyaman
 * - fontWeight: Ketebalan font (normal, bold, atau angka 100-900)
 * - color: Warna teks (hanya untuk tipe link, lainnya menggunakan color dari theme)
 */
const styles = StyleSheet.create({
  /**
   * Style untuk tipe default (teks standar)
   * Digunakan untuk teks body/paragraf biasa
   */
  default: {
    fontSize: 16,                 // Ukuran font 16px (ukuran standar untuk body text)
    lineHeight: 24,                // Tinggi baris 24px (1.5x fontSize untuk readability)
  },
  
  /**
   * Style untuk tipe defaultSemiBold (teks standar dengan font weight semi-bold)
   * Digunakan untuk teks yang perlu emphasis tapi tidak se-bold title
   */
  defaultSemiBold: {
    fontSize: 16,                 // Ukuran font sama dengan default (16px)
    lineHeight: 24,                // Tinggi baris sama dengan default (24px)
    fontWeight: '600',             // Font weight 600 (semi-bold, antara normal dan bold)
  },
  
  /**
   * Style untuk tipe title (judul besar)
   * Digunakan untuk judul utama halaman atau section
   */
  title: {
    fontSize: 32,                 // Ukuran font besar (32px) untuk emphasis
    fontWeight: 'bold',           // Font weight bold untuk emphasis maksimal
    lineHeight: 32,                // Tinggi baris sama dengan fontSize (1:1 ratio untuk title)
  },
  
  /**
   * Style untuk tipe subtitle (subjudul)
   * Digunakan untuk subjudul atau heading level 2
   */
  subtitle: {
    fontSize: 20,                 // Ukuran font sedang (20px) antara title dan default
    fontWeight: 'bold',           // Font weight bold untuk emphasis
    // lineHeight tidak ditentukan, akan menggunakan default dari React Native
  },
  
  /**
   * Style untuk tipe link (teks link)
   * Digunakan untuk teks yang bisa diklik atau link
   */
  link: {
    lineHeight: 30,               // Tinggi baris 30px untuk spacing yang nyaman
    fontSize: 16,                 // Ukuran font 16px (sama dengan default)
    color: '#0a7ea4',             // Warna biru khusus untuk link (tidak menggunakan theme color)
    // Catatan: Warna ini akan di-override oleh color dari useThemeColor jika tidak ada lightColor/darkColor
  },
});
