/*
 * ============================================
 * WATERMARK DEVELOPER
 * ============================================
 * Nama        : Dendi Pratama Riawan
 * GitHub      : github/DendiPratamaRiawan
 * ============================================
 */

// Import React dan hook useState untuk state management
import React, { useState } from 'react';
// Import komponen React Native untuk UI
import {
  Alert, // Untuk menampilkan alert dialog (popup pesan error)
  StyleSheet, // Untuk membuat style sheet
  Text, // Komponen untuk menampilkan teks
  TextInput, // Komponen input teks untuk memasukkan nama
  TouchableOpacity, // Komponen button yang bisa ditekan
  View, // Komponen container/view
} from 'react-native';

// ============================================
// INTERFACE/TIPE DATA PROPS
// ============================================
/**
 * Interface untuk props yang diterima komponen PlayerForm
 * Interface ini mendefinisikan semua props yang bisa diterima komponen ini
 */
interface PlayerFormProps {
  /**
   * Callback function yang dipanggil saat form di-submit dengan nama yang valid
   * Function ini akan menerima nama pemain sebagai parameter string
   * Function ini wajib ada karena digunakan untuk memproses nama yang dimasukkan
   */
  onSubmit: (name: string) => void;
  
  /**
   * Callback function yang dipanggil saat user membatalkan form
   * Function ini opsional (bisa tidak ada) karena tidak semua penggunaan form memerlukan tombol cancel
   * Jika tidak ada, tombol cancel tidak akan ditampilkan
   */
  onCancel?: () => void;
  
  /**
   * Nama awal untuk pre-fill form input
   * Digunakan ketika form digunakan untuk mengubah nama (bukan membuat baru)
   * Opsional karena form bisa digunakan untuk input nama baru yang belum ada
   * Default value: empty string ('')
   */
  initialName?: string;
}

/**
 * Komponen PlayerForm - Form untuk input atau mengubah nama pemain
 * 
 * Komponen ini adalah reusable component yang bisa digunakan di berbagai tempat:
 * - Untuk input nama pemain baru saat pertama kali bermain
 * - Untuk mengubah nama pemain yang sudah ada
 * 
 * Fitur:
 * - Validasi nama (tidak kosong, minimal 2 karakter, maksimal 20 karakter)
 * - Auto-focus pada input field untuk UX yang lebih baik
 * - Tombol cancel opsional (hanya muncul jika onCancel diberikan)
 * - Pre-fill nama jika initialName diberikan
 * 
 * @param onSubmit - Function callback yang dipanggil saat form di-submit dengan nama yang valid
 * @param onCancel - Function callback opsional yang dipanggil saat form dibatalkan
 * @param initialName - Nama awal opsional untuk pre-fill form (default: empty string)
 */
export default function PlayerForm({ onSubmit, onCancel, initialName = '' }: PlayerFormProps) {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  /**
   * State untuk menyimpan nama yang sedang diketik oleh user
   * State ini akan diupdate setiap kali user mengetik di TextInput
   * Menggunakan initialName sebagai nilai awal
   */
  const [name, setName] = useState(initialName);

  // ============================================
  // EVENT HANDLERS
  // ============================================
  /**
   * Handler untuk saat form di-submit (tombol submit ditekan atau Enter ditekan)
   * 
   * Fungsi ini melakukan validasi terhadap nama yang dimasukkan:
   * 1. Nama tidak boleh kosong (setelah di-trim)
   * 2. Nama minimal 2 karakter (untuk memastikan nama bermakna)
   * 3. Nama maksimal 20 karakter (untuk konsistensi database dan UI)
   * 
   * Jika semua validasi passed, memanggil callback onSubmit dengan nama yang sudah di-trim
   * Jika ada validasi yang gagal, menampilkan alert error dan tidak memanggil onSubmit
   */
  const handleSubmit = () => {
    // Trim whitespace di awal dan akhir nama
    // Ini menghilangkan spasi yang tidak perlu yang mungkin diketik user secara tidak sengaja
    const trimmedName = name.trim();
    
    // ============================================
    // VALIDASI 1: NAMA TIDAK BOLEH KOSONG
    // ============================================
    // Cek apakah nama kosong setelah di-trim
    // Jika kosong, tampilkan alert error dan hentikan proses
    if (!trimmedName) {
      Alert.alert('Error', 'Nama tidak boleh kosong!');
      return; // Hentikan eksekusi function, tidak lanjut ke validasi berikutnya
    }

    // ============================================
    // VALIDASI 2: NAMA MINIMAL 2 KARAKTER
    // ============================================
    // Cek apakah panjang nama minimal 2 karakter
    // Ini untuk memastikan nama bermakna dan tidak hanya 1 karakter
    if (trimmedName.length < 2) {
      Alert.alert('Error', 'Nama minimal 2 karakter!');
      return; // Hentikan eksekusi function
    }

    // ============================================
    // VALIDASI 3: NAMA MAKSIMAL 20 KARAKTER
    // ============================================
    // Cek apakah panjang nama tidak melebihi 20 karakter
    // Batas ini untuk konsistensi dengan database dan tampilan UI
    // maxLength di TextInput juga membatasi input, tapi ini double-check
    if (trimmedName.length > 20) {
      Alert.alert('Error', 'Nama maksimal 20 karakter!');
      return; // Hentikan eksekusi function
    }

    // ============================================
    // SEMUA VALIDASI PASSED - PANGGIL CALLBACK
    // ============================================
    // Jika semua validasi berhasil, panggil callback onSubmit dengan nama yang sudah di-trim
    // Callback ini akan diproses oleh parent component (misalnya untuk menyimpan ke database)
    onSubmit(trimmedName);
  };

  // ============================================
  // EFFECT UNTUK SYNC DENGAN INITIALNAME
  // ============================================
  /**
   * Effect yang dijalankan setiap kali initialName berubah
   * 
   * Effect ini memastikan state name selalu sinkron dengan initialName
   * Ini penting ketika form digunakan untuk mengubah nama:
   * - Jika initialName berubah dari parent component, state name juga akan terupdate
   * - Ini memungkinkan form untuk di-reset atau di-update dari luar
   * 
   * Dependencies: [initialName]
   * - Effect akan dijalankan setiap kali initialName berubah
   */
  React.useEffect(() => {
    // Update state name dengan initialName yang baru
    setName(initialName);
  }, [initialName]);

  // ============================================
  // RENDER UI
  // ============================================
  /**
   * Render utama komponen form
   * Menampilkan:
   * - Judul form (berbeda untuk input baru vs ganti nama)
   * - Input field untuk memasukkan nama
   * - Tombol submit (selalu ada)
   * - Tombol cancel (opsional, hanya muncul jika onCancel diberikan)
   */
  return (
    /* Container utama form dengan padding dan alignment center */
    <View style={styles.container}>
      {/* ============================================
          JUDUL FORM
          ============================================ */}
      {/* Judul form yang berubah berdasarkan apakah ini form baru atau form ganti nama */}
      {/* Jika initialName ada, berarti ini form untuk ganti nama */}
      {/* Jika initialName kosong, berarti ini form untuk input nama baru */}
      <Text style={styles.title}>
        {initialName ? 'Ganti Nama Pemain' : 'Masukkan Nama Pemain'}
      </Text>
      
      {/* ============================================
          INPUT FIELD UNTUK NAMA
          ============================================ */}
      {/* TextInput untuk memasukkan nama pemain */}
      {/* 
        Props TextInput:
        - style: Style untuk input field
        - placeholder: Teks placeholder yang muncul saat input kosong
        - placeholderTextColor: Warna placeholder (abu-abu terang)
        - value: Nilai input yang terikat dengan state name
        - onChangeText: Handler yang dipanggil setiap kali user mengetik
        - maxLength: Batas maksimal karakter yang bisa diketik (20 karakter)
        - autoFocus: Auto-focus pada input saat form muncul (UX lebih baik)
        - onSubmitEditing: Handler yang dipanggil saat user menekan Enter/Submit di keyboard
      */}
      <TextInput
        style={styles.input}
        placeholder="Nama Anda..."
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
        maxLength={20}
        autoFocus
        onSubmitEditing={handleSubmit}
      />
      
      {/* ============================================
          CONTAINER UNTUK TOMBOL
          ============================================ */}
      {/* Container untuk tombol-tombol form dengan layout horizontal */}
      <View style={styles.buttonContainer}>
        {/* ============================================
            TOMBOL CANCEL (OPSIONAL)
            ============================================ */}
        {/* Tombol cancel hanya ditampilkan jika onCancel diberikan */}
        {/* Ini menggunakan conditional rendering dengan && operator */}
        {onCancel && (
          /* Tombol untuk membatalkan form dan menutup form */
          /* 
            Props TouchableOpacity:
            - style: Gabungkan style button dan cancelButton untuk styling
            - onPress: Panggil callback onCancel saat tombol ditekan
          */
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={styles.buttonText}>Batal</Text>
          </TouchableOpacity>
        )}
        
        {/* ============================================
            TOMBOL SUBMIT
            ============================================ */}
        {/* Tombol submit yang selalu ada untuk mengirim form */}
        {/* 
          Props TouchableOpacity:
          - style: Gabungkan style button dan submitButton untuk styling
          - onPress: Panggil handler handleSubmit saat tombol ditekan
        */}
        <TouchableOpacity 
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
        >
          {/* Teks tombol submit */}
          {/* Teks bisa diubah sesuai kebutuhan, tapi default adalah "Mulai Bermain" */}
          <Text style={styles.buttonText}>Mulai Bermain</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/**
 * StyleSheet untuk semua komponen UI dalam form
 * Menggunakan StyleSheet.create untuk optimasi performa React Native
 * 
 * Setiap style mendefinisikan tampilan visual dari komponen:
 * - Warna, ukuran font, padding, margin, dll
 * - Border radius untuk sudut melengkung (modern UI)
 * - Flexbox untuk layout yang responsif
 */
const styles = StyleSheet.create({
  // ============================================
  // STYLE UNTUK CONTAINER UTAMA
  // ============================================
  /**
   * Style untuk container utama form
   * Container ini membungkus semua elemen form
   */
  container: {
    padding: 20,              // Padding 20px di semua sisi untuk spacing
    alignItems: 'center',      // Tengahkan semua child secara horizontal
  },
  
  // ============================================
  // STYLE UNTUK JUDUL FORM
  // ============================================
  /**
   * Style untuk judul form
   * Judul menampilkan "Masukkan Nama Pemain" atau "Ganti Nama Pemain"
   */
  title: {
    fontSize: 20,             // Ukuran font 20px (cukup besar untuk judul)
    fontWeight: 'bold',       // Teks tebal untuk emphasis
    color: '#333',            // Warna abu-abu gelap (hampir hitam)
    marginBottom: 20,         // Jarak bawah 20px untuk spacing dengan input
  },
  
  // ============================================
  // STYLE UNTUK INPUT FIELD
  // ============================================
  /**
   * Style untuk TextInput field
   * Input field untuk memasukkan nama pemain
   */
  input: {
    width: '100%',            // Lebar 100% dari parent (full width)
    height: 50,               // Tinggi 50px (cukup untuk input yang nyaman)
    borderWidth: 2,          // Ketebalan border 2px
    borderColor: '#4ecdc4',   // Warna border cyan/hijau muda (brand color)
    borderRadius: 10,         // Border radius 10px untuk sudut melengkung
    paddingHorizontal: 15,    // Padding horizontal 15px untuk spacing teks dari border
    fontSize: 16,             // Ukuran font 16px (ukuran standar untuk input)
    backgroundColor: '#fff',  // Background putih untuk kontras dengan border
    color: '#333',           // Warna teks abu-abu gelap
    marginBottom: 20,         // Jarak bawah 20px untuk spacing dengan tombol
  },
  
  // ============================================
  // STYLE UNTUK CONTAINER TOMBOL
  // ============================================
  /**
   * Style untuk container tombol
   * Container ini membungkus tombol-tombol form dengan layout horizontal
   */
  buttonContainer: {
    flexDirection: 'row',      // Layout horizontal (tombol sejajar)
    gap: 10,                  // Jarak antar tombol 10px (jika ada 2 tombol)
    width: '100%',            // Lebar 100% dari parent (full width)
  },
  
  // ============================================
  // STYLE DASAR UNTUK SEMUA TOMBOL
  // ============================================
  /**
   * Style dasar untuk semua tombol
   * Style ini digunakan oleh semua tombol (submit dan cancel)
   * Style khusus (warna) ditambahkan dengan menggabungkan style ini dengan style khusus
   */
  button: {
    flex: 1,                  // Flex 1 membuat tombol mengisi ruang yang tersedia secara merata
    height: 50,               // Tinggi 50px (sama dengan input untuk konsistensi)
    borderRadius: 10,         // Border radius 10px untuk sudut melengkung
    justifyContent: 'center',  // Tengahkan konten secara vertikal
    alignItems: 'center',      // Tengahkan konten secara horizontal
  },
  
  // ============================================
  // STYLE KHUSUS UNTUK TOMBOL SUBMIT
  // ============================================
  /**
   * Style khusus untuk tombol submit
   * Style ini digabungkan dengan style button untuk memberikan warna khusus
   */
  submitButton: {
    backgroundColor: '#4ecdc4', // Background warna cyan/hijau muda (brand color, sama dengan border input)
  },
  
  // ============================================
  // STYLE KHUSUS UNTUK TOMBOL CANCEL
  // ============================================
  /**
   * Style khusus untuk tombol cancel
   * Style ini digabungkan dengan style button untuk memberikan warna khusus
   */
  cancelButton: {
    backgroundColor: '#999',   // Background warna abu-abu (lebih subtle daripada submit button)
  },
  
  // ============================================
  // STYLE UNTUK TEKS TOMBOL
  // ============================================
  /**
   * Style untuk teks di dalam tombol
   * Style ini digunakan oleh semua tombol untuk konsistensi
   */
  buttonText: {
    color: '#fff',            // Warna teks putih (kontras dengan background berwarna)
    fontSize: 16,             // Ukuran font 16px (sama dengan input untuk konsistensi)
    fontWeight: 'bold',       // Teks tebal untuk emphasis dan readability
  },
});

