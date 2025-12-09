/*
 * ============================================
 * WATERMARK DEVELOPER
 * ============================================
 * Nama        : Dendi Pratama Riawan
 * GitHub      : github/DendiPratamaRiawan
 * ============================================
 */

// Import komponen Tabs dari expo-router untuk membuat tab navigation
import { Tabs } from 'expo-router';
// Import React untuk membuat komponen
import React from 'react';

// Import komponen HapticTab untuk memberikan feedback haptic saat tab ditekan
// Haptic feedback memberikan sensasi getar ringan untuk UX yang lebih baik
import { HapticTab } from '@/components/haptic-tab';
// Import komponen IconSymbol untuk menampilkan icon di tab bar
// IconSymbol adalah wrapper yang memetakan SF Symbols (iOS) ke MaterialIcons (Android/Web)
import { IconSymbol } from '@/components/ui/icon-symbol';
// Import Colors dari constants untuk mendapatkan warna tema aplikasi
// Colors berisi definisi warna untuk light dan dark mode
import { Colors } from '@/constants/theme';
// Import hook useColorScheme untuk mendeteksi tema sistem (light/dark mode)
// Hook ini mengembalikan 'light', 'dark', atau null
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Komponen TabLayout - Layout utama untuk tab navigation
 * 
 * Komponen ini mendefinisikan struktur navigasi tab di aplikasi.
 * Setiap tab memiliki:
 * - Nama file yang sesuai dengan route
 * - Title yang ditampilkan di tab bar
 * - Icon yang ditampilkan di tab bar
 * 
 * Tab navigation memungkinkan user untuk berpindah antar halaman dengan mudah
 * menggunakan tab bar di bagian bawah layar.
 * 
 * @returns JSX.Element - Komponen Tabs dengan konfigurasi semua tab screens
 */
export default function TabLayout() {
  // ============================================
  // DETEKSI TEMA SISTEM
  // ============================================
  /**
   * Mendapatkan tema sistem saat ini (light/dark mode)
   * colorScheme akan berisi 'light', 'dark', atau null
   * Jika null, akan menggunakan 'light' sebagai default
   */
  const colorScheme = useColorScheme();

  // ============================================
  // RENDER TAB NAVIGATION
  // ============================================
  return (
    /* Komponen Tabs dari expo-router untuk membuat tab navigation */
    <Tabs
      /* screenOptions: Konfigurasi global untuk semua tab screens */
      screenOptions={{
        /* tabBarActiveTintColor: Warna untuk tab yang sedang aktif */
        /* Menggunakan warna tint dari tema yang terdeteksi (light/dark) */
        /* Jika colorScheme null, menggunakan tema 'light' sebagai fallback */
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        
        /* headerShown: Menyembunyikan header di semua tab screens */
        /* Set ke false karena kita tidak ingin menampilkan header di setiap halaman */
        /* Setiap halaman akan mengatur header sendiri jika diperlukan */
        headerShown: false,
        
        /* tabBarButton: Komponen custom untuk tombol tab */
        /* Menggunakan HapticTab untuk memberikan feedback haptic saat tab ditekan */
        /* Ini memberikan sensasi getar ringan untuk UX yang lebih baik */
        tabBarButton: HapticTab,
      }}>
      
      {/* ============================================
          TAB 1: GAME (HALAMAN UTAMA)
          ============================================ */}
      {/* Tab untuk halaman utama game (file: index.tsx) */}
      {/* name: Nama file route (index.tsx) */}
      {/* title: Judul yang ditampilkan di tab bar */}
      {/* tabBarIcon: Icon yang ditampilkan di tab bar dengan ukuran 28px */}
      {/* Icon "gamecontroller.fill" menggambarkan game controller */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Game',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gamecontroller.fill" color={color} />,
        }}
      />
      
      {/* ============================================
          TAB 2: PENGATURAN (SETTINGS)
          ============================================ */}
      {/* Tab untuk halaman pengaturan game (file: settings.tsx) */}
      {/* name: Nama file route (settings.tsx) */}
      {/* title: Judul yang ditampilkan di tab bar (bahasa Indonesia) */}
      {/* tabBarIcon: Icon untuk pengaturan dengan ukuran 28px */}
      {/* Icon "slider.horizontal.3" menggambarkan pengaturan/slider */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Pengaturan',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="slider.horizontal.3" color={color} />,
        }}
      />
      
      {/* ============================================
          TAB 3: LEADERBOARD (PAPAN PERINGKAT)
          ============================================ */}
      {/* Tab untuk halaman leaderboard (file: leaderboard.tsx) */}
      {/* name: Nama file route (leaderboard.tsx) */}
      {/* title: Judul yang ditampilkan di tab bar */}
      {/* tabBarIcon: Icon untuk leaderboard dengan ukuran 28px */}
      {/* Icon "chart.bar.fill" menggambarkan grafik/statistik */}
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,
        }}
      />
      
      {/* ============================================
          TAB 4: INFO (INFORMASI DEVELOPER)
          ============================================ */}
      {/* Tab untuk halaman informasi developer (file: info.tsx) */}
      {/* name: Nama file route (info.tsx) */}
      {/* title: Judul yang ditampilkan di tab bar */}
      {/* tabBarIcon: Icon untuk informasi dengan ukuran 28px */}
      {/* Icon "info.circle.fill" menggambarkan informasi */}
      <Tabs.Screen
        name="info"
        options={{
          title: 'Info',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="info.circle.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
