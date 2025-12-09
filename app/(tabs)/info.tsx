/*
 * ============================================
 * WATERMARK DEVELOPER
 * ============================================
 * Nama        : Dendi Pratama Riawan
 * GitHub      : github/DendiPratamaRiawan
 * ============================================
 */
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  Dimensions,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// ============================================
// KONSTANTA WARNA (Dark Mode Schema)
// ============================================
const COLORS = {
  darkBackground: '#1A1A2E',
  cardBackground: '#2E3A59',
  primary: '#FFC72C', // Bright Gold (Untuk Aksen Penting/Judul)
  text: '#FFFFFF',
  secondaryText: '#A0A0B0',
  accent: '#4ECDC4', // Cyan (Untuk Ikon/Link)
  danger: '#E74C3C', // Merah (Jika diperlukan)
  sectionBackground: '#38425F', // Sedikit lebih terang untuk membedakan bagian fitur
};

// ============================================
// DATA FITUR KOMPLEKS
// ============================================
interface FeatureDetail {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
}

interface FeatureSection {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  details: FeatureDetail[];
}

const FEATURE_DATA: FeatureSection[] = [
  {
    title: "Mekanisme Inti & Gameplay",
    icon: "sports-tennis",
    color: COLORS.accent,
    details: [
      {
        icon: "flash-on",
        title: "Tingkat Kesulitan Variatif",
        description: "Pemain dapat memilih kecepatan bola awal (Mudah, Sedang, Sulit) melalui menu Pengaturan, memberikan pengalaman bermain yang dapat disesuaikan.",
      },
      {
        icon: "filter-vintage",
        title: "Bata Multi-Hit",
        description: "Beberapa bata dirancang lebih kuat (memerlukan dua kali pukulan untuk hancur), ditandai dengan perubahan warna, menambah elemen strategis.",
      },
      {
        icon: "bolt",
        title: "Power-Up Acak",
        description: "Dapatkan item Power-Up secara acak setelah menghancurkan bata, seperti memperpanjang pemukul atau meningkatkan kecepatan bola sementara.",
      },
    ],
  },
  {
    title: "Data Pemain & Progres",
    icon: "leaderboard",
    color: COLORS.primary,
    details: [
      {
        icon: "storage",
        title: "Database Lokal SQLite",
        description: "Data pemain, skor tertinggi, dan riwayat permainan disimpan secara lokal di perangkat menggunakan SQLite Expo.",
      },
      {
        icon: "trending-up",
        title: "Papan Peringkat (Leaderboard)",
        description: "Lihat 10 skor tertinggi dan statistik pemain, termasuk rata-rata skor dan level terbaik yang dicapai.",
      },
      {
        icon: "history",
        title: "Riwayat Permainan",
        description: "Setiap sesi permainan dicatat, memungkinkan pemain melihat 10 sesi terakhir mereka lengkap dengan skor dan level akhir.",
      },
    ],
  },
  {
    title: "Kustomisasi & Pengalaman Pengguna",
    icon: "settings-suggest",
    color: COLORS.accent,
    details: [
      {
        icon: "edit",
        title: "Ganti Nama Pemain",
        description: "Pemain dapat mengubah nama mereka kapan saja melalui menu Leaderboard untuk personalisasi.",
      },
      {
        icon: "dark-mode",
        title: "Dark Mode Konsisten",
        description: "Antarmuka aplikasi didesain dengan tema gelap (Dark Mode) yang nyaman di mata, diterapkan di semua layar navigasi.",
      },
    ],
  },
];


// ============================================
// KOMPONEN UNTUK TAMPILAN FITUR
// ============================================
const FeatureCard: React.FC<{ section: FeatureSection }> = ({ section }) => (
  <View style={styles.featureSectionCard}>
    <View style={styles.featureSectionHeader}>
      <MaterialIcons name={section.icon} size={28} color={section.color} />
      <Text style={[styles.sectionTitle, { color: section.color, marginBottom: 0, marginLeft: 10 }]}>
        {section.title}
      </Text>
    </View>
    
    <View style={styles.featureDetailContainer}>
      {section.details.map((detail, index) => (
        <View key={index} style={styles.detailItem}>
          <MaterialIcons name={detail.icon} size={20} color={section.color} style={{marginTop: 3}} />
          <View style={styles.detailTextContent}>
            <Text style={styles.detailTitle}>{detail.title}</Text>
            <Text style={styles.detailDescription}>{detail.description}</Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);


export default function InfoScreen() {
  const insets = useSafeAreaInsets();

  const handleEmailPress = () => {
    Linking.openURL('dendipratamar@gmail.com');
  };

  const handleGithubPress = () => {
    Linking.openURL('https://github.com/DendiPratamaRiawan');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Tentang Game</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        {/* SECTION 1: GAME INFO (Judul) */}
        <View style={styles.section}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="videogame-asset" size={width * 0.2} color={COLORS.accent} />
          </View>
          <Text style={styles.gameTitle}>Pemecah Bata</Text>
          <Text style={styles.gameSubtitle}>Game Breakout Sederhana dibangun dengan React Native & Expo</Text>
          <View style={styles.divider} />
        </View>
        
        {/* SECTION 2: FITUR GAME KOMPLEKS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Fitur Utama Aplikasi</Text>
          {FEATURE_DATA.map((section, index) => (
            <FeatureCard key={index} section={section} />
          ))}
        </View>

        {/* SECTION 3: DEVELOPER INFO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👨‍💻 Developer</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MaterialIcons name="person" size={24} color={COLORS.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nama</Text>
                <Text style={styles.infoValue}>Dendi Pratama Riawan</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="email" size={24} color={COLORS.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <TouchableOpacity onPress={handleEmailPress}>
                  <Text style={[styles.infoValue, styles.linkText]}>
                    Dendipratamar@gmail.com
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="code" size={24} color={COLORS.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>GitHub</Text>
                <TouchableOpacity onPress={handleGithubPress}>
                  <Text style={[styles.infoValue, styles.linkText]}>
                    https://github.com/DendiPratamaRiawan
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* FOOTER SECTION */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 D Develope</Text>
          <Text style={styles.footerText}>Dibuat dengan ❤️ menggunakan React Native & Expo</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBackground,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBackground,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  gameTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 5,
  },
  gameSubtitle: {
    fontSize: 14,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: {
    height: 2,
    backgroundColor: COLORS.cardBackground,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  // Style Baru untuk Fitur Kompleks
  featureSectionCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary, // Garis Aksen
  },
  featureSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureDetailContainer: {
    marginTop: 10,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  detailTextContent: {
    marginLeft: 15,
    flex: 1,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  detailDescription: {
    fontSize: 13,
    color: COLORS.secondaryText,
    lineHeight: 18,
  },
  // Style Developer (dipertahankan)
  infoCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  linkText: {
    color: COLORS.accent,
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
});