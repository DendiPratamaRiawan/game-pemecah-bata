/*
 * ============================================
 * WATERMARK DEVELOPER
 * ============================================
 * Nama        : Dendi Pratama Riawan
 * GitHub      : github/DendiPratamaRiawan
 * ============================================
 */

// Import Href dan Link dari expo-router untuk navigasi dan routing
// Href: Tipe untuk URL/href yang valid
// Link: Komponen untuk navigasi dan linking di expo-router
import { Href, Link } from 'expo-router';
// Import fungsi dan konstanta dari expo-web-browser untuk membuka browser in-app
// openBrowserAsync: Fungsi untuk membuka URL di browser in-app secara async
// WebBrowserPresentationStyle: Enum untuk style presentasi browser (AUTOMATIC, FULL_SCREEN, dll)
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
// Import ComponentProps dari React untuk mendapatkan tipe props dari komponen
import { type ComponentProps } from 'react';

// ============================================
// TIPE DATA PROPS
// ============================================
/**
 * Tipe data untuk props komponen ExternalLink
 * 
 * Tipe ini menggunakan Omit untuk menghapus property 'href' dari ComponentProps<typeof Link>
 * kemudian menambahkan kembali 'href' dengan tipe yang lebih spesifik (Href & string)
 * 
 * Ini memastikan:
 * - Semua props Link tersedia kecuali href yang akan di-override
 * - href harus berupa string yang valid (Href & string)
 * - href wajib ada (tidak opsional seperti di Link original)
 * 
 * Menggunakan intersection type (&) untuk menggabungkan Href dengan string
 */
type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

/**
 * Komponen ExternalLink - Link eksternal yang membuka URL di browser in-app
 * 
 * Komponen ini adalah wrapper untuk Link yang membuka URL eksternal dengan cara:
 * - Di web: Membuka di tab baru (target="_blank")
 * - Di mobile (iOS/Android): Membuka di browser in-app yang terintegrasi
 * 
 * Keuntungan menggunakan browser in-app:
 * - User tidak perlu keluar dari aplikasi
 * - Pengalaman yang lebih seamless
 * - Kontrol lebih baik atas presentasi browser
 * 
 * Cara kerja:
 * 1. Menerima href (URL) dan props lainnya dari Link
 * 2. Di web: Link akan bekerja normal dengan target="_blank"
 * 3. Di mobile: Prevent default behavior dan buka di browser in-app
 * 
 * @param href - URL yang akan dibuka (wajib, harus berupa string valid)
 * @param rest - Semua props Link lainnya yang akan diteruskan ke Link
 * 
 * @returns JSX.Element - Komponen Link dengan handler untuk membuka browser in-app
 * 
 * Contoh penggunaan:
 * ```tsx
 * <ExternalLink href="https://github.com/edisuherlan">
 *   Kunjungi GitHub
 * </ExternalLink>
 * ```
 */
export function ExternalLink({ href, ...rest }: Props) {
  // ============================================
  // RENDER LINK DENGAN HANDLER BROWSER IN-APP
  // ============================================
  /**
   * Render Link dengan handler untuk membuka browser in-app di mobile
   */
  return (
    {/* Komponen Link dari expo-router untuk navigasi */}
    <Link
      target="_blank"  {/* Target blank untuk membuka di tab baru (di web) */}
      {...rest}        {/* Spread semua props Link lainnya ke Link */}
      href={href}      {/* URL yang akan dibuka */}
      onPress={async (event) => {
        /**
         * Handler saat link ditekan
         * Handler ini akan membuka URL di browser in-app jika di mobile
         * Di web, Link akan bekerja normal dengan target="_blank"
         * 
         * Proses:
         * 1. Cek apakah platform bukan web
         * 2. Jika mobile, prevent default behavior (mencegah buka browser default)
         * 3. Buka URL di browser in-app dengan style automatic
         */
        
        // ============================================
        // CEK PLATFORM DAN BUKA BROWSER IN-APP
        // ============================================
        // Cek apakah aplikasi berjalan di platform selain web (iOS/Android)
        // Di web, Link akan bekerja normal dengan target="_blank" tanpa perlu handler khusus
        if (process.env.EXPO_OS !== 'web') {
          /**
           * Prevent default behavior dari Link
           * 
           * Di mobile, Link default akan mencoba membuka browser default sistem
           * Dengan preventDefault, kita mencegah behavior tersebut dan menggantinya
           * dengan browser in-app yang lebih terintegrasi dengan aplikasi
           */
          event.preventDefault();
          
          /**
           * Buka URL di browser in-app
           * 
           * openBrowserAsync membuka URL di browser in-app yang terintegrasi dengan aplikasi
           * Browser in-app memberikan pengalaman yang lebih seamless karena:
           * - User tidak perlu keluar dari aplikasi
           * - Browser muncul sebagai overlay/modal di atas aplikasi
           * - User bisa kembali ke aplikasi dengan mudah
           * 
           * WebBrowserPresentationStyle.AUTOMATIC:
           * - iOS: Menggunakan style yang sesuai dengan konteks (biasanya modal)
           * - Android: Menggunakan style yang sesuai dengan versi Android
           * - Memberikan pengalaman yang optimal di setiap platform
           */
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
        // Jika di web, tidak perlu melakukan apa-apa karena Link akan bekerja normal
        // dengan target="_blank" yang sudah di-set di atas
      }}
    />
  );
}
