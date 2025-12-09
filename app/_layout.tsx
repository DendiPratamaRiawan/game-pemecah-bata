/*
 * ============================================
 * WATERMARK DEVELOPER
 * ============================================
 * Nama        : Dendi Pratama Riawan
 * GitHub      : github/DendiPratamaRiawan
 * ============================================
 */

// Import tema dan ThemeProvider dari @react-navigation/native
// DarkTheme: Tema gelap untuk dark mode
// DefaultTheme: Tema terang untuk light mode
// ThemeProvider: Provider untuk menyediakan tema ke seluruh aplikasi
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// Import Stack dari expo-router untuk navigasi stack-based
// Stack adalah navigator yang menampilkan satu screen pada satu waktu dengan stack navigation
import { Stack } from 'expo-router';
// Import StatusBar untuk mengatur tampilan status bar di perangkat
import { StatusBar } from 'expo-status-bar';
// Import react-native-reanimated untuk mengaktifkan animasi performa tinggi
// Import ini diperlukan untuk menggunakan Animated API dari react-native-reanimated
import 'react-native-reanimated';

// Import hook untuk mendeteksi tema sistem (light/dark mode)
import { useColorScheme } from '@/hooks/use-color-scheme';

// ============================================
// KONFIGURASI NAVIGASI
// ============================================
/**
 * Konfigurasi navigasi untuk expo-router
 * 
 * unstable_settings digunakan untuk mengkonfigurasi behavior navigasi
 * anchor: '(tabs)' menentukan bahwa (tabs) adalah anchor point untuk navigasi
 * 
 * Catatan: "unstable" berarti API ini mungkin berubah di versi mendatang
 * Tapi ini adalah cara yang disarankan untuk mengkonfigurasi navigasi di expo-router
 */
export const unstable_settings = {
  anchor: '(tabs)',  // Anchor point untuk navigasi (folder tabs adalah root navigation)
};

/**
 * Komponen RootLayout - Root layout untuk seluruh aplikasi
 * 
 * Komponen ini adalah root layout yang membungkus seluruh aplikasi dan mengatur:
 * 1. Tema aplikasi berdasarkan sistem (light/dark mode)
 * 2. Struktur navigasi stack (tabs sebagai main, modal sebagai overlay)
 * 3. Status bar style yang menyesuaikan dengan tema
 * 
 * Struktur navigasi:
 * - (tabs): Navigasi utama dengan tab bar (Game, Settings, Leaderboard, Info)
 * - modal: Screen modal yang muncul sebagai overlay di atas tabs
 * 
 * Tema:
 * - Otomatis mengikuti tema sistem (light/dark mode)
 * - Menggunakan DarkTheme jika sistem dark mode aktif
 * - Menggunakan DefaultTheme jika sistem light mode aktif
 * 
 * @returns JSX.Element - Root layout dengan ThemeProvider, Stack navigator, dan StatusBar
 */
export default function RootLayout() {
  // ============================================
  // DETEKSI TEMA SISTEM
  // ============================================
  /**
   * Mendapatkan tema sistem saat ini (light/dark mode)
   * colorScheme akan berisi 'light', 'dark', atau null
   * Nilai ini digunakan untuk menentukan tema yang akan diterapkan ke seluruh aplikasi
   */
  const colorScheme = useColorScheme();

  // ============================================
  // RENDER ROOT LAYOUT
  // ============================================
  /**
   * Render root layout dengan ThemeProvider, Stack navigator, dan StatusBar
   * 
   * Struktur:
   * - ThemeProvider: Menyediakan tema ke seluruh aplikasi
   * - Stack: Navigator untuk struktur navigasi (tabs dan modal)
   * - StatusBar: Mengatur style status bar berdasarkan tema
   */
  return (
    /* ThemeProvider membungkus seluruh aplikasi untuk menyediakan tema */
    /* Tema dipilih berdasarkan colorScheme: DarkTheme jika dark, DefaultTheme jika light */
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Stack navigator untuk mengatur struktur navigasi aplikasi */}
      {/* Stack menampilkan satu screen pada satu waktu dengan stack navigation */}
      <Stack>
        {/* ============================================
            SCREEN: TABS (NAVIGASI UTAMA)
            ============================================ */}
        {/* Screen untuk navigasi tabs (folder (tabs)) */}
        {/* name="(tabs)" merujuk ke folder app/(tabs) yang berisi tab navigation */}
        {/* headerShown: false karena tab navigation sudah memiliki header sendiri */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* ============================================
            SCREEN: MODAL (OVERLAY)
            ============================================ */}
        {/* Screen untuk modal yang muncul sebagai overlay */}
        {/* name="modal" merujuk ke file app/modal.tsx */}
        {/* presentation: 'modal' membuat screen muncul sebagai modal overlay */}
        {/* title: 'Modal' adalah judul yang ditampilkan di header modal */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      
      {/* Status bar dengan style "auto" yang menyesuaikan dengan tema */}
      {/* Style "auto" berarti status bar akan menggunakan warna yang sesuai dengan tema */}
      {/* (putih untuk dark theme, hitam untuk light theme) */}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
