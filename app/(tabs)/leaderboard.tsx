/*
 * ============================================
 * WATERMARK DEVELOPER
 * ============================================
 * Nama        : Dendi Pratama Riawan
 * GitHub      : github/DendiPratamaRiawan
 * ============================================
 */
import PlayerForm from '@/components/PlayerForm';
import { GameSession, getAllPlayers, getPlayerSessions, initDatabase, Player, updatePlayerName } from '@/utils/database';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
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

// ============================================
// KONSTANTA WARNA (Dark Mode Schema)
// ============================================
const COLORS = {
  darkBackground: '#1A1A2E',
  cardBackground: '#2E3A59',
  primary: '#FFC72C', // Bright Gold (Aksen untuk skor/peringkat tinggi)
  text: '#FFFFFF',
  secondaryText: '#A0A0B0',
  accent: '#4ECDC4', // Cyan (Untuk tombol, link, dan indikator aktif)
  danger: '#E74C3C',
};


// ============================================
// KOMPONEN SCREEN
// ============================================
export default function LeaderboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChangeNameForm, setShowChangeNameForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  useEffect(() => {
    // Initialize database on mount
    const initDb = async () => {
      try {
        await initDatabase();
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };
    initDb();
  }, []);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadPlayers();
      // Reset selected player and sessions when focusing, unless re-focusing after name change
      if (!editingPlayer && !showChangeNameForm) {
        setSelectedPlayer(null);
        setSessions([]);
      }
    }, [])
  );

  const loadPlayers = async () => {
    try {
      setLoading(true);
      await initDatabase();
      // Mengambil semua pemain dan mengurutkannya berdasarkan HighScore
      const allPlayers = await getAllPlayers();
      // Sortasi di sisi klien: HighScore descending, lalu TotalGames descending
      allPlayers.sort((a, b) => {
        if (b.highScore !== a.highScore) {
            return b.highScore - a.highScore;
        }
        return b.totalGames - a.totalGames;
      });
      setPlayers(allPlayers);
    } catch (error) {
      console.error('Error loading players:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPlayerSessions = async (player: Player) => {
    try {
      // Jika pemain yang sama diklik, tutup detail
      if (selectedPlayer?.id === player.id) {
        setSelectedPlayer(null);
        setSessions([]);
        return;
      }
      
      // Memberi efek loading sederhana saat sesi dimuat
      setSessions([]); 
      const playerSessions = await getPlayerSessions(player.id, 10);
      setSessions(playerSessions);
      setSelectedPlayer(player);
      
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleChangeName = async (newName: string) => {
    if (!editingPlayer) return;
    
    try {
      const updatedPlayer = await updatePlayerName(editingPlayer.id, newName);
      
      // Update daftar pemain
      setPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
      
      // Update pemain yang sedang dipilih
      if (selectedPlayer?.id === updatedPlayer.id) {
        setSelectedPlayer(updatedPlayer);
      }
      
      setShowChangeNameForm(false);
      setEditingPlayer(null);
      alert('Nama berhasil diubah!');
    } catch (error: any) {
      console.error('Error changing name:', error);
      alert(error.message || 'Gagal mengubah nama. Silakan coba lagi.');
    }
  };

  const renderRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <MaterialIcons name="emoji-events" size={28} color={COLORS.primary} />;
      case 1:
        return <MaterialIcons name="emoji-events" size={24} color={COLORS.secondaryText} />;
      case 2:
        return <MaterialIcons name="emoji-events" size={20} color={COLORS.accent} />;
      default:
        return <Text style={styles.rankNumberText}>{index + 1}</Text>;
    }
  };


  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      
      {/* HEADER BAR */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back-ios" size={24} color={COLORS.accent} />
        </TouchableOpacity>
        <Text style={styles.title}>
            <MaterialIcons name="leaderboard" size={24} color={COLORS.primary} /> Papan Peringkat
        </Text>
      </View>

      {/* MODAL UBAH NAMA */}
      {showChangeNameForm && editingPlayer && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ubah Nama Pemain</Text>
            <PlayerForm 
              onSubmit={handleChangeName} 
              onCancel={() => {
                setShowChangeNameForm(false);
                setEditingPlayer(null);
              }}
              initialName={editingPlayer.name}
            />
          </View>
        </View>
      )}

      {/* CONTENT */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.loadingText}>Memuat data...</Text>
        </View>
      ) : players.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Belum ada data pemain 😔</Text>
          <Text style={styles.emptySubtext}>Mulai bermain untuk melihat skor!</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          
          {/* SECTION: TOP PLAYERS */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🥇 Pemain Teratas ({players.length} Total)</Text>
            {players.slice(0, 10).map((player, index) => (
              <TouchableOpacity
                key={player.id}
                style={[
                  styles.playerCard,
                  selectedPlayer?.id === player.id && styles.selectedCard,
                  index === 0 && styles.firstRankCard, // Styling khusus untuk Rank 1
                ]}
                onPress={() => loadPlayerSessions(player)}
              >
                <View style={styles.rankContainer}>
                  {renderRankIcon(index)}
                </View>
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.playerStats}>
                    Main: {player.totalGames} | Level Terbaik: {player.bestLevel}
                  </Text>
                </View>
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreLabel}>SKOR TERTINGGI</Text>
                  <Text style={styles.scoreText}>{player.highScore}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* SECTION: PLAYER DETAILS (RIWAYAT) */}
          {selectedPlayer && (
            <View style={styles.section}>
              <View style={styles.playerHeader}>
                <Text style={styles.sectionTitle}>
                  👤 Detail & Riwayat {selectedPlayer.name}
                </Text>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => {
                    setEditingPlayer(selectedPlayer);
                    setShowChangeNameForm(true);
                  }}
                >
                  <Text style={styles.editButtonText}>✏️ Ubah Nama</Text>
                </TouchableOpacity>
              </View>
              
              {/* STATS GRID */}
              <View style={styles.statsCardGrid}>
                <View style={styles.statGridItem}>
                    <Text style={styles.statLabel}>Skor Tertinggi</Text>
                    <Text style={styles.statValue}>{selectedPlayer.highScore}</Text>
                </View>
                <View style={styles.statGridItem}>
                    <Text style={styles.statLabel}>Total Main</Text>
                    <Text style={styles.statValue}>{selectedPlayer.totalGames}</Text>
                </View>
                <View style={styles.statGridItem}>
                    <Text style={styles.statLabel}>Level Terbaik</Text>
                    <Text style={styles.statValue}>{selectedPlayer.bestLevel}</Text>
                </View>
                <View style={styles.statGridItem}>
                    <Text style={styles.statLabel}>Rata-rata Skor</Text>
                    <Text style={styles.statValue}>
                        {selectedPlayer.totalGames > 0
                          ? Math.round(selectedPlayer.totalScore / selectedPlayer.totalGames)
                          : 0}
                    </Text>
                </View>
              </View>

              {/* SESSIONS TABLE */}
              {sessions.length > 0 ? (
                <>
                  <Text style={styles.sectionSubtitle}>10 Sesi Permainan Terakhir</Text>
                  <View style={styles.sessionTable}>
                    <View style={styles.sessionHeaderRow}>
                      <Text style={[styles.sessionHeaderCell, { flex: 1.5 }]}>Waktu</Text>
                      <Text style={styles.sessionHeaderCell}>Skor</Text>
                      <Text style={styles.sessionHeaderCell}>Level</Text>
                    </View>
                    {sessions.map((session) => (
                      <View key={session.id} style={styles.sessionRow}>
                        <Text style={[styles.sessionCell, { flex: 1.5, color: COLORS.secondaryText }]}>{formatDate(session.playedAt)}</Text>
                        <Text style={[styles.sessionCell, { fontWeight: 'bold', color: COLORS.primary }]}>{session.score}</Text>
                        <Text style={[styles.sessionCell, { color: COLORS.accent }]}>{session.level}</Text>
                      </View>
                    ))}
                  </View>
                </>
              ) : (
                <Text style={[styles.emptySubtext, { marginTop: 20, color: COLORS.secondaryText }]}>Belum ada riwayat permainan untuk pemain ini.</Text>
              )}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBackground,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 5,
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
  emptyText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtext: {
    color: COLORS.secondaryText,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
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
    marginBottom: 15,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginTop: 20,
    marginBottom: 10,
  },
  // PLAYER CARD STYLES
  playerCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
    // Shadow di iOS dan Android
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedCard: {
    borderColor: COLORS.accent,
    backgroundColor: '#38425F', // Sedikit lebih terang dari cardBackground
  },
  firstRankCard: {
    borderLeftColor: COLORS.primary,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondaryText,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 3,
  },
  playerStats: {
    fontSize: 11,
    color: COLORS.secondaryText,
  },
  scoreContainer: {
    alignItems: 'flex-end',
    minWidth: 70,
  },
  scoreLabel: {
    fontSize: 10,
    color: COLORS.secondaryText,
    marginBottom: 2,
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary, // Gunakan primary untuk skor
  },

  // PLAYER DETAILS STYLES
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  editButtonText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: 'bold',
  },

  // STATS GRID STYLES
  statsCardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statGridItem: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    padding: 15,
    width: '48%', // Untuk dua kolom
    marginBottom: 10,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginBottom: 5,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },

  // SESSIONS TABLE STYLES
  sessionTable: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    overflow: 'hidden',
  },
  sessionHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#38425F',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sessionHeaderCell: {
    flex: 1,
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  sessionRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  sessionCell: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },

  // MODAL STYLES
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modalContent: {
    backgroundColor: COLORS.text,
    borderRadius: 12,
    padding: 25,
    minWidth: 300,
    maxWidth: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.darkBackground,
    marginBottom: 20,
    textAlign: 'center',
  }
});