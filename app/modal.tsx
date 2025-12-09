/*
 * ============================================
 * WATERMARK DEVELOPER
 * ============================================
 * Nama        : Dendi Pratama Riawan
 * GitHub      : github/DendiPratamaRiawan
 * ============================================
 */

// Import Link dari expo-router untuk navigasi dan linking
// Link digunakan untuk navigasi ke screen lain atau menutup modal
import { Link } from 'expo-router';
// Import StyleSheet dari React Native untuk membuat style sheet
import { StyleSheet } from 'react-native';

// Import ThemedText untuk teks yang mendukung theme (light/dark mode)
import { ThemedText } from '@/components/themed-text';
// Import ThemedView untuk container yang mendukung theme (light/dark mode)
import { ThemedView } from '@/components/themed-view';

/**
 * Komponen ModalScreen - Screen modal sederhana
 * 
 * Komponen ini adalah contoh screen modal yang dapat dipanggil dari screen lain.
 * Modal muncul sebagai overlay di atas navigasi utama dengan animasi slide-up.
 * 
 * Fitur:
 * - Menampilkan judul modal
 * - Link untuk kembali ke home screen dan menutup modal
 * - Menggunakan ThemedView dan ThemedText untuk dukungan theme
 * 
 * Cara kerja modal:
 * - Modal dapat dibuka dari screen lain menggunakan router.push('/modal')
 * - Modal dapat ditutup dengan menekan link (dismissTo) atau swipe down (iOS)
 * - Modal akan muncul di atas semua screen dengan animasi
 * 
 * @returns JSX.Element - Komponen modal dengan judul dan link kembali
 */
export default function ModalScreen() {
  // ============================================
  // RENDER MODAL SCREEN
  // ============================================
  /**
   * Render modal screen dengan judul dan link kembali ke home
   * 
   * Struktur:
   * - ThemedView: Container utama yang mendukung theme
   * - ThemedText (title): Judul modal dengan style besar dan bold
   * - Link: Link untuk kembali ke home dan menutup modal
   *   - href="/": Navigasi ke root screen (home/tabs)
   *   - dismissTo: Menutup modal sebelum navigasi
   * - ThemedText (link): Teks link dengan style khusus
   */
  return (
    /* ThemedView sebagai container utama yang mendukung theme */
    <ThemedView style={styles.container}>
      {/* Judul modal menggunakan ThemedText dengan tipe "title" */}
      {/* Tipe "title" memberikan style besar dan bold untuk judul */}
      <ThemedText type="title">This is a modal</ThemedText>
      
      {/* Link untuk kembali ke home screen dan menutup modal */}
      {/* 
        Props Link:
        - href="/": Navigasi ke root screen (home/tabs)
        - dismissTo: Menutup modal sebelum navigasi (jika ada modal stack)
        - style: Style tambahan untuk link
      */}
      <Link href="/" dismissTo style={styles.link}>
        {/* Teks link menggunakan ThemedText dengan tipe "link" */}
        {/* Tipe "link" memberikan style khusus untuk link (warna biru, underline) */}
        <ThemedText type="link">Go to home screen</ThemedText>
      </Link>
    </ThemedView>
  );
}

/**
 * StyleSheet untuk semua komponen UI dalam modal screen
 * Menggunakan StyleSheet.create untuk optimasi performa React Native
 */
const styles = StyleSheet.create({
  /**
   * Style untuk container utama modal
   * Container ini membungkus semua konten modal dan menengahkannya
   */
  container: {
    flex: 1,                      // Mengisi seluruh ruang yang tersedia
    alignItems: 'center',         // Tengahkan konten secara horizontal
    justifyContent: 'center',     // Tengahkan konten secara vertikal
    padding: 20,                  // Padding 20px di semua sisi untuk spacing
  },
  
  /**
   * Style untuk link kembali ke home
   * Link ini memberikan spacing yang nyaman dari judul
   */
  link: {
    marginTop: 15,               // Jarak atas 15px dari judul
    paddingVertical: 15,          // Padding vertikal 15px untuk area tekan yang lebih besar
  },
});
