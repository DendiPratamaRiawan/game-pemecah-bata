/*
 * ============================================
 * WATERMARK DEVELOPER
 * ============================================
 * Nama        : Dendi Pratama Riawan
 * GitHub      : github/DendiPratamaRiawan
 * ============================================
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const SETTINGS_KEY = '@pemecah_bata:settings';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface GameSettings {
  difficulty: DifficultyLevel;
  ballSpeed: number;
}

// ============================================
// KONSTANTA WARNA (Dark Mode Schema)
// ============================================
const COLORS = {
  darkBackground: '#1A1A2E',
  cardBackground: '#2E3A59',
  primary: '#FFC72C',
  text: '#FFFFFF',
  secondaryText: '#A0A0B0',
  accent: '#4ECDC4', 
  success: '#2ecc71',
};


const DIFFICULTY_CONFIGS: Record<DifficultyLevel, { label: string; speed: number; description: string }> = {
  easy: {
    label: 'Mudah',
    speed: 4,
    description: 'Bola bergerak lebih lambat, cocok untuk pemula',
  },
  medium: {
    label: 'Sedang',
    speed: 6,
    description: 'Kecepatan bola standar, cocok untuk pemain biasa',
  },
  hard: {
    label: 'Sulit',
    speed: 8,
    description: 'Bola bergerak cepat, cocok untuk pemain berpengalaman',
  },
};

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('medium');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settingsData = await AsyncStorage.getItem(SETTINGS_KEY);
      if (settingsData) {
        const settings: GameSettings = JSON.parse(settingsData);
        setSelectedDifficulty(settings.difficulty);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (difficulty: DifficultyLevel) => {
    try {
      const settings: GameSettings = {
        difficulty,
        ballSpeed: DIFFICULTY_CONFIGS[difficulty].speed,
      };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      setSelectedDifficulty(difficulty);
      console.log('Settings saved:', settings);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Gagal menyimpan pengaturan');
    }
  };

  const handleDifficultyChange = (difficulty: DifficultyLevel) => {
    saveSettings(difficulty);
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="light" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} /> 
          <Text style={[styles.loadingText, {color: COLORS.text}]}>Memuat pengaturan...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Pengaturan Game</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tingkat Kesulitan</Text>
          
          <Text style={styles.sectionDescription}>
            Pilih tingkat kesulitan yang sesuai dengan kemampuan Anda. 
            Tingkat kesulitan mempengaruhi **kecepatan awal bola** dalam permainan.
          </Text>

          {Object.entries(DIFFICULTY_CONFIGS).map(([key, config]) => {
            const difficulty = key as DifficultyLevel;
            const isSelected = selectedDifficulty === difficulty;

            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.difficultyCard,
                  isSelected && styles.difficultyCardSelected,
                ]}
                onPress={() => handleDifficultyChange(difficulty)}
              >
                <View style={styles.difficultyHeader}>
                  <View style={styles.difficultyInfo}>
                    <Text style={[
                      styles.difficultyLabel,
                      isSelected ? {color: COLORS.accent} : {color: COLORS.text},
                    ]}>
                      {config.label}
                    </Text>
                    <Text style={[styles.difficultySpeed, {color: COLORS.secondaryText}]}>
                      Kecepatan Bola: <Text style={{fontWeight: 'bold', color: COLORS.primary}}>{config.speed}</Text>
                    </Text>
                  </View>
                  
                  {isSelected && (
                    <View style={[styles.checkmark, {backgroundColor: COLORS.accent}]}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </View>
                
                <Text style={[
                  styles.difficultyDescription,
                  {color: COLORS.secondaryText},
                ]}>
                  {config.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.infoSection, {backgroundColor: COLORS.cardBackground}]}>
          <Text style={[styles.infoTitle, {color: COLORS.primary}]}>ℹ️ Informasi Penting</Text>
          <Text style={[styles.infoText, {color: COLORS.secondaryText}]}>
            • Kecepatan yang dipilih akan menjadi kecepatan dasar bola.{'\n'}
            • Pengaturan diterapkan pada awal permainan baru (Mulai Bermain).{'\n'}
            • Selama Power-Up aktif, kecepatan bola akan meningkat sementara.
          </Text>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.text,
    fontSize: 16,
    marginTop: 10,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 14,
    color: COLORS.secondaryText,
    marginBottom: 20,
    lineHeight: 20,
  },
  difficultyCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
    width: '100%',
  },
  difficultyCardSelected: {
    backgroundColor: '#3A4A70', // Warna sedikit berbeda saat dipilih
    borderColor: COLORS.accent,
  },
  difficultyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  difficultyInfo: {
    flex: 1,
  },
  difficultyLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  difficultySpeed: {
    fontSize: 14,
    color: COLORS.secondaryText,
  },
  checkmark: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  checkmarkText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  difficultyDescription: {
    fontSize: 14,
    color: COLORS.secondaryText,
    lineHeight: 20,
  },
  infoSection: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    width: '100%',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.secondaryText,
    lineHeight: 22,
  },
});