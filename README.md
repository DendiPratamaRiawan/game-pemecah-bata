🧱 Pemecah Bata (Breakout Game)
Pemecah Bata adalah implementasi klasik dari game Breakout, dibangun menggunakan React Native dan kerangka kerja Expo. Game ini berfokus pada pengalaman bermain yang lancar di perangkat seluler, dilengkapi dengan fitur manajemen pemain lokal dan papan peringkat (Leaderboard).

✨ Fitur Utama
Aplikasi ini menyajikan pengalaman bermain Breakout yang sederhana namun lengkap, dengan penekanan pada fungsionalitas dan manajemen data pemain lokal.

🎮 Mekanisme Inti & Gameplay
Tingkat Kesulitan Variatif: Pemain dapat mengatur kecepatan bola awal (Mudah, Sedang, Sulit) untuk menyesuaikan tantangan.

Bata Multi-Hit: Menyertakan bata yang memerlukan dua kali pukulan untuk dihancurkan, menambah elemen strategi.

Power-Up Acak (Planned/Implemented): Mekanisme untuk mendapatkan Power-Up (seperti memperpanjang pemukul) saat menghancurkan bata.

🏆 Data Pemain & Progres
Penyimpanan Lokal (SQLite): Menggunakan database lokal (Expo SQLite) untuk menyimpan seluruh data pemain dan sesi permainan.

Papan Peringkat Global: Menampilkan daftar pemain berdasarkan Skor Tertinggi mereka.

Riwayat Permainan: Mencatat dan menampilkan 10 sesi permainan terakhir dari setiap pemain, lengkap dengan skor, level, dan waktu bermain.

⚙️ Pengalaman Pengguna (UX)
Manajemen Pemain: Memungkinkan pemain untuk membuat atau mengubah nama mereka melalui layar Leaderboard.

Tema Gelap (Dark Mode): Desain antarmuka yang nyaman di mata dengan skema warna yang konsisten (Dark Mode) di seluruh aplikasi.

🛠️ Instalasi dan Menjalankan Proyek
Untuk menjalankan proyek ini, Anda harus menginstal Node.js, npm/Yarn, dan Expo CLI di sistem Anda.

Prasyarat
Node.js (Versi terbaru direkomendasikan)

npm atau Yarn

Expo CLI (npm install -g expo-cli)

Langkah-langkah
Kloning Repositori:

Bash

git clone https://github.com/edisuherlan/pemecah-bata.git
cd pemecah-bata
Instal Dependensi:

Bash

npm install
# atau
yarn install
Jalankan Proyek Expo:

Bash

npx expo start
Akses Aplikasi:

Di Perangkat Seluler: Pindai kode QR yang muncul di terminal menggunakan aplikasi Expo Go.

Di Emulator/Simulator: Tekan a (Android) atau i (iOS) di terminal.

Catatan: Aplikasi ini menggunakan Expo FileSystem untuk database SQLite, pastikan lingkungan Expo Go Anda mendukung fitur ini.
