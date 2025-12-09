/*
 * ============================================
 * WATERMARK DEVELOPER
 * ============================================
 * Nama        : Dendi Pratama Riawan
 * GitHub      : github/DendiPratamaRiawan
 * ============================================
 */

// Import type dari React untuk props dan children
// PropsWithChildren: Utility type untuk komponen yang menerima children
// ReactElement: Tipe untuk elemen React (JSX element)
import type { PropsWithChildren, ReactElement } from 'react';
// Import StyleSheet dari React Native untuk membuat style sheet
import { StyleSheet } from 'react-native';
// Import Animated dan hooks dari react-native-reanimated untuk animasi
// Animated: Komponen dan API untuk animasi performa tinggi
// interpolate: Fungsi untuk interpolasi nilai (mengubah nilai dari range ke range lain)
// useAnimatedRef: Hook untuk mendapatkan ref yang bisa digunakan dengan animated values
// useAnimatedStyle: Hook untuk membuat style yang reactive terhadap animated values
// useScrollOffset: Hook untuk mendapatkan offset scroll dari ScrollView
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

// Import ThemedView untuk container konten yang mendukung theme
import { ThemedView } from '@/components/themed-view';
// Import hook untuk mendeteksi tema sistem (light/dark mode)
import { useColorScheme } from '@/hooks/use-color-scheme';
// Import hook untuk mendapatkan warna berdasarkan tema
import { useThemeColor } from '@/hooks/use-theme-color';

// ============================================
// KONSTANTA
// ============================================
/**
 * Konstanta untuk tinggi header dalam piksel
 * Header dengan tinggi ini akan menampilkan gambar header dan memberikan
 * ruang untuk efek parallax saat scroll
 */
const HEADER_HEIGHT = 250;

// ============================================
// TIPE DATA PROPS
// ============================================
/**
 * Tipe data untuk props komponen ParallaxScrollView
 * 
 * PropsWithChildren memastikan komponen dapat menerima children (konten di dalamnya)
 */
type Props = PropsWithChildren<{
  /**
   * Elemen React untuk gambar header
   * Elemen ini akan ditampilkan di header dan akan mengalami efek parallax saat scroll
   * Biasanya berupa Image atau komponen visual lainnya
   */
  headerImage: ReactElement;
  
  /**
   * Warna background header untuk light dan dark mode
   * Object dengan property 'dark' dan 'light' yang berisi warna hex string
   * Warna akan dipilih berdasarkan tema sistem saat ini
   */
  headerBackgroundColor: { dark: string; light: string };
}>;

/**
 * Komponen ParallaxScrollView - ScrollView dengan efek parallax pada header
 * 
 * Komponen ini membuat efek parallax yang menarik pada header saat user melakukan scroll.
 * Efek parallax bekerja dengan cara:
 * 1. Header bergerak lebih lambat dari konten saat scroll ke bawah
 * 2. Header juga bisa zoom in/out saat scroll (scale effect)
 * 3. Menciptakan efek kedalaman 3D yang modern
 * 
 * Cara kerja:
 * - Menggunakan react-native-reanimated untuk animasi performa tinggi
 * - Menggunakan useScrollOffset untuk mendeteksi posisi scroll
 * - Menggunakan interpolate untuk menghitung transform berdasarkan scroll offset
 * - Header akan bergerak dengan kecepatan berbeda dari konten
 * 
 * @param children - Konten yang akan ditampilkan di bawah header (bisa berupa JSX apapun)
 * @param headerImage - Elemen React untuk gambar/visual header
 * @param headerBackgroundColor - Warna background header untuk light dan dark mode
 * 
 * @returns JSX.Element - Komponen Animated.ScrollView dengan efek parallax pada header
 * 
 * Contoh penggunaan:
 * ```tsx
 * <ParallaxScrollView
 *   headerImage={<Image source={require('./header.jpg')} />}
 *   headerBackgroundColor={{ light: '#fff', dark: '#1a1a2e' }}
 * >
 *   <Text>Konten di sini</Text>
 * </ParallaxScrollView>
 * ```
 */
export default function ParallaxScrollView({
  children,              // Konten yang akan ditampilkan di bawah header
  headerImage,          // Elemen React untuk gambar header
  headerBackgroundColor, // Warna background header untuk light/dark mode
}: Props) {
  // ============================================
  // HOOKS UNTUK TEMA DAN WARNA
  // ============================================
  /**
   * Mendapatkan warna background dari theme
   * Menggunakan warna default dari theme karena tidak ada custom color yang diberikan
   * Warna ini akan digunakan untuk background ScrollView
   */
  const backgroundColor = useThemeColor({}, 'background');
  
  /**
   * Mendapatkan tema sistem saat ini (light/dark)
   * Menggunakan nullish coalescing operator (??) untuk fallback ke 'light' jika null
   * Tema ini digunakan untuk memilih warna background header yang sesuai
   */
  const colorScheme = useColorScheme() ?? 'light';
  
  // ============================================
  // HOOKS UNTUK ANIMASI DAN SCROLL
  // ============================================
  /**
   * Ref untuk Animated.ScrollView
   * Ref ini digunakan untuk menghubungkan ScrollView dengan useScrollOffset
   * useAnimatedRef memberikan ref yang kompatibel dengan react-native-reanimated
   */
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  
  /**
   * Mendapatkan offset scroll dari ScrollView
   * scrollOffset adalah shared value yang akan berubah setiap kali user scroll
   * Nilai ini digunakan untuk menghitung transform header (parallax effect)
   */
  const scrollOffset = useScrollOffset(scrollRef);
  
  // ============================================
  // ANIMATED STYLE UNTUK EFEK PARALLAX
  // ============================================
  /**
   * Animated style untuk header yang akan menghasilkan efek parallax
   * 
   * useAnimatedStyle membuat style yang reactive terhadap animated values
   * Style ini akan di-update setiap kali scrollOffset berubah
   * 
   * Transform yang diterapkan:
   * 1. translateY: Menggerakkan header secara vertikal
   *    - Saat scroll ke atas (negative offset): header bergerak ke atas lebih lambat
   *    - Saat scroll ke bawah (positive offset): header bergerak ke bawah lebih lambat
   *    - Ini menciptakan efek parallax (header bergerak lebih lambat dari konten)
   * 
   * 2. scale: Mengubah ukuran header (zoom effect)
   *    - Saat scroll ke atas: header zoom in (scale 2x)
   *    - Saat scroll normal: header normal size (scale 1x)
   *    - Saat scroll ke bawah: header tetap normal size (scale 1x)
   * 
   * Interpolate mengubah nilai scrollOffset dari range input ke range output:
   * - Input range: [-HEADER_HEIGHT, 0, HEADER_HEIGHT]
   *   (scroll ke atas, posisi awal, scroll ke bawah)
   * - Output range untuk translateY: [-HEADER_HEIGHT/2, 0, HEADER_HEIGHT*0.75]
   *   (header bergerak lebih lambat dari scroll offset)
   * - Output range untuk scale: [2, 1, 1]
   *   (zoom in saat scroll ke atas, normal saat scroll ke bawah)
   */
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          // Transform translateY untuk efek parallax vertikal
          translateY: interpolate(
            scrollOffset.value,                    // Nilai scroll offset saat ini
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],   // Input range: scroll ke atas, awal, scroll ke bawah
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75] // Output range: gerakan lebih lambat dari scroll
          ),
        },
        {
          // Transform scale untuk efek zoom
          scale: interpolate(
            scrollOffset.value,                    // Nilai scroll offset saat ini
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],   // Input range: scroll ke atas, awal, scroll ke bawah
            [2, 1, 1]                             // Output range: zoom in saat scroll ke atas, normal lainnya
          ),
        },
      ],
    };
  });

  // ============================================
  // RENDER UI
  // ============================================
  /**
   * Render utama komponen dengan ScrollView dan efek parallax
   * 
   * Struktur:
   * - Animated.ScrollView: Container utama yang bisa di-scroll
   *   Props: ref (untuk tracking scroll), style (background color), scrollEventThrottle (16ms untuk 60fps)
   * - Animated.View (header): Header dengan efek parallax
   *   Style: styles.header, backgroundColor berdasarkan tema, headerAnimatedStyle untuk parallax
   * - ThemedView (content): Konten yang di-scroll normal
   */
  return (
    /* Animated.ScrollView untuk konten yang bisa di-scroll */
    /* Menggunakan Animated.ScrollView dari react-native-reanimated untuk animasi performa tinggi */
    <Animated.ScrollView
      ref={scrollRef}
      style={{ backgroundColor, flex: 1 }}
      scrollEventThrottle={16}>
      
      {/* ============================================
          HEADER DENGAN EFEK PARALLAX
          ============================================ */}
      {/* 
        Animated.View untuk header yang akan mengalami efek parallax
        Menggunakan Animated.View agar bisa menerapkan animated style
        
        Style array berisi:
        - styles.header: Style dasar header (tinggi, overflow)
        - backgroundColor: Background color berdasarkan tema
        - headerAnimatedStyle: Animated style untuk efek parallax (translateY, scale)
      */}
      <Animated.View
        style={[
          styles.header,
          { backgroundColor: headerBackgroundColor[colorScheme] },
          headerAnimatedStyle,
        ]}>
        {/* Render headerImage yang diberikan sebagai prop */}
        {/* Image ini akan bergerak dengan efek parallax saat scroll */}
        {headerImage}
      </Animated.View>
      
      {/* ============================================
          KONTEN SCROLLABLE
          ============================================ */}
      {/* 
        ThemedView untuk konten yang akan di-scroll
        Menggunakan ThemedView agar konten mendukung theme (light/dark mode)
      */}
      <ThemedView style={styles.content}>
        {/* Render children (konten yang diberikan sebagai prop) */}
        {/* Konten ini akan di-scroll normal, tidak mengalami efek parallax */}
        {children}
      </ThemedView>
    </Animated.ScrollView>
  );
}

/**
 * StyleSheet untuk semua komponen UI dalam ParallaxScrollView
 * Menggunakan StyleSheet.create untuk optimasi performa React Native
 */
const styles = StyleSheet.create({
  /**
   * Style untuk container (tidak digunakan saat ini, mungkin untuk future use)
   */
  container: {
    flex: 1,                      // Mengisi seluruh ruang yang tersedia
  },
  
  /**
   * Style untuk header dengan efek parallax
   * Header ini akan menampilkan headerImage dan mengalami transform saat scroll
   */
  header: {
    height: HEADER_HEIGHT,        // Tinggi header sesuai konstanta (250px)
    overflow: 'hidden',           // Hidden overflow untuk memastikan konten tidak keluar dari bounds
                                  // Penting untuk efek parallax agar tidak terlihat konten yang bergerak keluar
  },
  
  /**
   * Style untuk konten yang bisa di-scroll
   * Konten ini berada di bawah header dan akan di-scroll normal
   */
  content: {
    flex: 1,                      // Mengisi ruang yang tersedia
    padding: 32,                  // Padding 32px di semua sisi untuk spacing konten
    gap: 16,                      // Jarak antar child elements 16px (jika menggunakan flexbox)
    overflow: 'hidden',           // Hidden overflow untuk konsistensi
  },
});
