# 🎮 Pemecah Bata - Game Breakout Sederhana

Game Breakout/Brick Breaker klasik yang dibuat dengan React Native dan Expo. Hancurkan semua bata dengan bola yang memantul!

![Game Screenshot](https://via.placeholder.com/400x800/1a1a2e/ffffff?text=Pemecah+Bata+Game)

## 📸 Screenshot Aplikasi

### Cara Menambahkan Screenshot ke Repository

Untuk menambahkan screenshot aplikasi ke README ini, ikuti langkah-langkah berikut:

1. **Ambil Screenshot**
   - Jalankan aplikasi di perangkat atau emulator
   - Ambil screenshot dari berbagai halaman aplikasi:
     - Halaman Game (saat bermain)
     - Halaman Leaderboard
     - Halaman Pengaturan
     - Halaman Info

2. **Simpan Screenshot ke Folder `assets/screenshots/`**
   ```bash
   # Buat folder screenshots jika belum ada
   mkdir -p assets/screenshots
   
   # Pindahkan screenshot ke folder tersebut
   # Contoh nama file:
   # - game-screen.png
   # - leaderboard-screen.png
   # - settings-screen.png
   # - info-screen.png
   ```

3. **Update README.md**
   Ganti placeholder screenshot di atas dengan screenshot Anda menggunakan format berikut:
   
   ```markdown
   ## 📸 Screenshot Aplikasi
   
   ### Halaman Game
   ![Game Screen](./assets/screenshots/game-screen.png)
   
   ### Halaman Leaderboard
   ![Leaderboard Screen](./assets/screenshots/leaderboard-screen.png)
   
   ### Halaman Pengaturan
   ![Settings Screen](./assets/screenshots/settings-screen.png)
   
   ### Halaman Info
   ![Info Screen](./assets/screenshots/info-screen.png)
   ```

4. **Commit dan Push ke GitHub**
   ```bash
   git add assets/screenshots/
   git add README.md
   git commit -m "docs: Tambahkan screenshot aplikasi"
   git push origin main
   ```

### Tips Screenshot yang Baik

- 📱 **Ukuran**: Gunakan resolusi tinggi (minimal 1080x1920 untuk mobile)
- 🎨 **Format**: Gunakan format PNG atau JPG dengan kualitas tinggi
- 📐 **Rasio**: Untuk mobile, gunakan rasio 9:16 (portrait)
- 🌟 **Konten**: Pastikan screenshot menampilkan fitur utama aplikasi dengan jelas
- 🎯 **Fokus**: Ambil screenshot saat aplikasi menampilkan konten yang menarik

### Contoh Struktur Folder Screenshots

```
assets/
├── screenshots/
│   ├── game-screen.png          # Screenshot halaman game
│   ├── leaderboard-screen.png   # Screenshot halaman leaderboard
│   ├── settings-screen.png      # Screenshot halaman pengaturan
│   ├── info-screen.png          # Screenshot halaman info
│   └── gameplay-demo.gif        # (Opsional) GIF animasi gameplay
```

### Menggunakan Screenshot di README

Setelah screenshot ditambahkan, Anda dapat menampilkannya di README dengan format:

```markdown
![Deskripsi Screenshot](./assets/screenshots/nama-file.png)
```

Atau untuk menampilkan beberapa screenshot dalam grid:

```markdown
<div align="center">
  <img src="./assets/screenshots/game-screen.png" width="200" />
  <img src="./assets/screenshots/leaderboard-screen.png" width="200" />
  <img src="./assets/screenshots/settings-screen.png" width="200" />
  <img src="./assets/screenshots/info-screen.png" width="200" />
</div>
```

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Screenshot Aplikasi](#-screenshot-aplikasi)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Persyaratan](#-persyaratan)
- [Instalasi](#-instalasi)
- [Cara Menjalankan](#-cara-menjalankan)
- [Cara Bermain](#-cara-bermain)
- [Struktur Proyek](#-struktur-proyek)
- [Fitur Game](#-fitur-game)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

## ✨ Fitur

- 🎯 **Gameplay Klasik**: Game Breakout yang menyenangkan dan adiktif
- 🎨 **Visual Menarik**: Desain modern dengan warna-warna cerah
- 📊 **Sistem Skor & Leaderboard**: Skor tersimpan dengan nama player dan riwayat permainan
- 🎮 **Level System**: Level meningkat otomatis dengan pola bata yang berbeda setiap level
- ⚙️ **Pengaturan Kesulitan**: Pilih tingkat kesulitan (Mudah, Sedang, Sulit) yang mempengaruhi kecepatan bola
- 👤 **Manajemen Player**: Buat dan ganti nama player dengan mudah
- 📱 **Responsif**: Dapat dimainkan di Android, iOS, dan Web
- 🎪 **Kontrol Mudah**: Geser jari untuk menggerakkan papan
- 🌈 **Bata Berwarna**: Setiap baris bata memiliki warna berbeda
- 💾 **Penyimpanan Lokal**: Data player dan skor tersimpan menggunakan AsyncStorage
- 📝 **Kode Terdokumentasi**: Semua kode memiliki komentar bahasa Indonesia yang informatif

## 🛠 Teknologi yang Digunakan

- **React Native**: Framework untuk membangun aplikasi mobile
- **Expo**: Platform untuk pengembangan React Native
- **TypeScript**: Bahasa pemrograman dengan type safety
- **Animated API**: Untuk animasi yang halus
- **React Hooks**: Untuk manajemen state
- **AsyncStorage**: Untuk penyimpanan data lokal (player, skor, pengaturan)
- **Expo Router**: Untuk navigasi berbasis file system
- **React Navigation**: Untuk navigasi tab dan stack
- **Expo Haptics**: Untuk feedback haptic di iOS

## 📦 Persyaratan

Sebelum memulai, pastikan Anda telah menginstall:

- **Node.js** (versi 16 atau lebih tinggi)
- **npm** atau **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **Expo Go** (untuk testing di mobile): Download dari [App Store](https://apps.apple.com/app/expo-go/id982107779) atau [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

## 🚀 Instalasi

1. **Clone repository ini**
   ```bash
   git clone https://github.com/edisuherlan/game-tetris-pemecah_bata-sederhana.git
   cd game-tetris-pemecah_bata-sederhana
   ```
   
   **Catatan**: Nama folder lokal mungkin berbeda (misalnya `game_sederhana`), sesuaikan dengan struktur proyek Anda.

2. **Install dependencies**
   ```bash
   npm install
   ```
   atau
   ```bash
   yarn install
   ```

## ▶️ Cara Menjalankan

### Development Mode

1. **Jalankan development server**
   ```bash
   npm start
   ```
   atau
   ```bash
   yarn start
   ```

2. **Pilih platform yang ingin digunakan:**
   - Tekan `a` untuk Android
   - Tekan `i` untuk iOS (hanya macOS)
   - Tekan `w` untuk Web
   - Scan QR code dengan Expo Go app di smartphone Anda

### Build untuk Production

#### Android
```bash
npm run android
```

#### iOS (hanya macOS)
```bash
npm run ios
```

#### Web
```bash
npm run web
```

## 🎮 Cara Bermain

1. **Mulai Game**: Ketuk layar untuk memulai permainan
2. **Gerakkan Papan**: Geser jari di layar untuk menggerakkan papan ke kiri atau kanan
3. **Hancurkan Bata**: Pantulkan bola ke bata untuk menghancurkannya
4. **Jangan Biarkan Bola Jatuh**: Jaga bola agar tetap memantul di layar
5. **Kumpulkan Skor**: Setiap bata yang hancur memberikan 10 poin
6. **Naik Level**: Hancurkan semua bata untuk naik ke level berikutnya

### Tips Bermain

- ⚡ **Gunakan Sudut**: Pantulkan bola dengan sudut yang berbeda untuk mencapai bata yang sulit dijangkau
- 🎯 **Aim dengan Tepat**: Posisi papan saat bola memantul menentukan arah bola
- 🏆 **Fokus pada Bata**: Prioritaskan menghancurkan semua bata daripada hanya menjaga bola tetap hidup
- 💪 **Latihan**: Semakin sering bermain, semakin baik kontrol Anda

## 📁 Struktur Proyek

```
game_sederhana/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # File utama game
│   │   ├── leaderboard.tsx    # Halaman leaderboard
│   │   ├── settings.tsx        # Halaman pengaturan game
│   │   ├── info.tsx            # Halaman info developer
│   │   └── _layout.tsx         # Layout tab navigation
│   ├── _layout.tsx             # Root layout aplikasi
│   └── modal.tsx                # Screen modal contoh
├── components/
│   ├── PlayerForm.tsx          # Form untuk input/ganti nama player
│   ├── themed-view.tsx         # View component dengan theme support
│   ├── themed-text.tsx         # Text component dengan theme support
│   ├── external-link.tsx       # Link component untuk browser in-app
│   ├── haptic-tab.tsx          # Tab button dengan haptic feedback
│   ├── hello-wave.tsx          # Komponen animasi wave
│   ├── parallax-scroll-view.tsx # ScrollView dengan efek parallax
│   └── ui/
│       └── icon-symbol.tsx     # Icon component dengan mapping SF Symbols
├── utils/
│   └── database.ts             # Fungsi database untuk AsyncStorage
├── hooks/                      # Custom hooks
├── assets/                     # Gambar dan resources
├── package.json               # Dependencies
├── tsconfig.json              # Konfigurasi TypeScript
└── README.md                  # Dokumentasi
```

## 🎯 Fitur Game

### Gameplay Mechanics

- **Fisika Bola**: Bola memantul dengan realistis dari dinding, papan, dan bata
- **Collision Detection**: Deteksi tabrakan yang akurat untuk semua elemen
- **Sudut Pantulan**: Sudut pantulan berdasarkan posisi tumbukan di papan
- **Kecepatan Dinamis**: Kecepatan bola tetap konsisten untuk gameplay yang adil

### Sistem Skor & Leaderboard

- **Skor**: +10 poin per bata yang hancur
- **Leaderboard**: Menampilkan semua player dengan skor tertinggi mereka
- **Riwayat Permainan**: Setiap sesi permainan tersimpan dengan timestamp
- **Manajemen Player**: Buat player baru atau ganti nama player yang sudah ada
- **Penyimpanan Persisten**: Data tersimpan menggunakan AsyncStorage dan tidak hilang saat aplikasi ditutup
- **Level**: Meningkat otomatis saat semua bata hancur dengan pola bata yang berbeda setiap level

### Visual Design

- **Bata Berwarna**: Setiap baris memiliki warna berbeda
  - Baris 1: Merah (#ff6b6b)
  - Baris 2: Cyan (#4ecdc4)
  - Baris 3: Biru (#45b7d1)
  - Baris 4: Kuning (#f9ca24)
  - Baris 5: Ungu (#6c5ce7)
- **Background Gelap**: Background hitam untuk kontras yang baik
- **Animasi Halus**: Menggunakan Animated API untuk transisi yang mulus

## 🎨 Konfigurasi Game

### Pengaturan Kesulitan

Anda dapat mengubah tingkat kesulitan di halaman **Pengaturan**:
- **Mudah**: Kecepatan bola 4 (cocok untuk pemula)
- **Sedang**: Kecepatan bola 6 (tingkat menengah)
- **Sulit**: Kecepatan bola 8 (tantangan untuk pemain berpengalaman)

Pengaturan tersimpan otomatis dan diterapkan saat kembali ke game.

### Konstanta Game

Anda dapat mengubah konstanta game di file `app/(tabs)/index.tsx`:

```typescript
const BALL_SIZE = 20;              // Ukuran bola
const PADDLE_WIDTH = 120;          // Lebar papan
const PADDLE_HEIGHT = 15;          // Tinggi papan
const BRICK_WIDTH = 70;            // Lebar bata
const BRICK_HEIGHT = 30;           // Tinggi bata
const BRICK_ROWS = 5;              // Jumlah baris bata
const BRICK_COLS = 5;              // Jumlah kolom bata
const DEFAULT_BALL_SPEED = 6;      // Kecepatan bola default
```

## 🐛 Troubleshooting

### Masalah Umum

1. **Game tidak bisa dimulai**
   - Pastikan semua dependencies terinstall: `npm install`
   - Restart development server: `npm start`

2. **Papan tidak bisa digerakkan**
   - Pastikan game sudah dimulai (tap layar untuk mulai)
   - Coba restart aplikasi

3. **Bola tidak memantul dengan benar**
   - Pastikan collision detection bekerja dengan baik
   - Periksa konstanta kecepatan bola

## 🤝 Kontribusi

Kontribusi sangat diterima! Jika Anda ingin berkontribusi:

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b fitur/AmazingFeature`)
3. Commit perubahan Anda (`git commit -m 'Menambahkan fitur AmazingFeature'`)
4. Push ke branch (`git push origin fitur/AmazingFeature`)
5. Buka Pull Request

### Ide Kontribusi

- 🎵 Menambahkan efek suara
- 🎨 Menambahkan lebih banyak variasi warna bata
- 💎 Menambahkan power-up (bola lebih besar, papan lebih lebar, dll)
- 🏆 Menambahkan leaderboard online
- 📱 Menambahkan mode multiplayer
- 🎯 Menambahkan mode tantangan khusus

## 📝 Changelog

### Version 2.0.0 (Current)
- ✅ **Leaderboard System**: Sistem leaderboard dengan penyimpanan data player
- ✅ **Pengaturan Kesulitan**: Pilih tingkat kesulitan (Mudah, Sedang, Sulit)
- ✅ **Manajemen Player**: Buat dan ganti nama player
- ✅ **Level System**: Pola bata berbeda setiap level dengan tingkat kesulitan meningkat
- ✅ **Halaman Info**: Halaman informasi developer
- ✅ **Penyimpanan Persisten**: Data tersimpan menggunakan AsyncStorage
- ✅ **Kode Terdokumentasi**: Semua kode memiliki komentar bahasa Indonesia yang informatif
- ✅ **Watermark Developer**: Watermark developer di setiap file kode
- ✅ **Collision Detection**: Deteksi tabrakan yang lebih akurat untuk paddle
- ✅ **UI Improvements**: Perbaikan UI dan UX dengan haptic feedback

### Version 1.0.0
- ✅ Gameplay dasar Breakout
- ✅ Sistem skor dan level
- ✅ Kontrol dengan geser jari
- ✅ Bata berwarna-warni
- ✅ UI dalam bahasa Indonesia

## 📄 Lisensi

Proyek ini menggunakan lisensi MIT. Lihat file `LICENSE` untuk detail lebih lanjut.

## 👤 Author

**Edi Suherlan**
- **Nama**: Edi Suherlan
- **GitHub**: [@edisuherlan](https://github.com/edisuherlan)
- **Email**: audhighasu@gmail.com
- **Website**: [audhighasu.com](https://audhighasu.com)
- **Repository**: [game-tetris-pemecah_bata-sederhana](https://github.com/edisuherlan/game-tetris-pemecah_bata-sederhana)

## 🙏 Acknowledgments

- Terinspirasi dari game Breakout klasik
- Dibuat dengan React Native dan Expo
- Menggunakan TypeScript untuk type safety

## 📞 Support

Jika Anda memiliki pertanyaan atau menemukan bug, silakan buka [issue](https://github.com/edisuherlan/game-tetris-pemecah_bata-sederhana/issues) di repository ini.

---

⭐ Jika Anda menyukai proyek ini, jangan lupa berikan star di GitHub!
