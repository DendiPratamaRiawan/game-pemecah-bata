/*
 * ============================================
 * WATERMARK DEVELOPER
 * ============================================
 * Nama        : Dendi Pratama Riawan
 * GitHub      : github/DendiPratamaRiawan
 * ============================================
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================
// INTERFACE/TIPE DATA
// ============================================

export interface Player {
  id: number;
  name: string;
  highScore: number;
  totalGames: number;
  totalScore: number;
  bestLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface GameSession {
  id: number;
  playerId: number;
  score: number;
  level: number;
  playedAt: string;
}

// ============================================
// KONSTANTA UNTUK ASYNCSTORAGE KEYS
// ============================================
const PLAYERS_KEY = '@pemecah_bata:players';
const SESSIONS_KEY = '@pemecah_bata:sessions';
const NEXT_ID_KEY = '@pemecah_bata:nextId';

// ============================================
// VARIABEL CACHE DAN STATE
// ============================================
let playersCache: Player[] | null = null;
let nextPlayerId = 1;
let isInitialized = false;

// --- Helper Functions ---

const ensureDatabaseInitialized = async (): Promise<void> => {
    if (isInitialized && playersCache !== null) {
        return;
    }
    await initDatabase();
    if (!isInitialized || playersCache === null) {
        throw new Error('Database failed to initialize or cache is null.');
    }
};

const savePlayers = async (): Promise<void> => {
  if (playersCache) {
    try {
      await AsyncStorage.setItem(PLAYERS_KEY, JSON.stringify(playersCache));
      await AsyncStorage.setItem(NEXT_ID_KEY, nextPlayerId.toString());
      
      console.log('Players saved:', playersCache.length, 'players');
    } catch (error) {
      console.error('Error saving players:', error);
      throw error;
    }
  }
};

const saveSession = async (session: GameSession): Promise<void> => {
  try {
    const sessionsData = await AsyncStorage.getItem(SESSIONS_KEY);
    let sessions: GameSession[] = [];
    
    if (sessionsData) {
      sessions = JSON.parse(sessionsData);
    }
    
    sessions.push(session);
    
    // Batasi jumlah sesi per pemain (MAKSIMAL 100)
    const playerSessions = sessions.filter(s => s.playerId === session.playerId);
    
    if (playerSessions.length > 100) {
      const toKeep = playerSessions
        .sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime())
        .slice(0, 100);
      
      sessions = sessions.filter(s => s.playerId !== session.playerId).concat(toKeep);
    }
    
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error saving session:', error);
  }
};


// --- Core Database Functions ---

/**
 * Fungsi untuk menginisialisasi database
 */
export const initDatabase = async (): Promise<void> => {
  try {
    if (isInitialized) return;

    const playersData = await AsyncStorage.getItem(PLAYERS_KEY);
    
    if (playersData) {
      playersCache = JSON.parse(playersData);
      
      if (playersCache && playersCache.length > 0) {
        nextPlayerId = Math.max(...playersCache.map(p => p.id)) + 1;
      } else {
        playersCache = []; // Pastikan ini array kosong jika data stringify tapi kosong
      }
    } else {
      playersCache = [];
    }

    const nextIdData = await AsyncStorage.getItem(NEXT_ID_KEY);
    if (nextIdData) {
      nextPlayerId = Math.max(nextPlayerId, parseInt(nextIdData, 10));
    }

    isInitialized = true;
    
    // PERBAIKAN 2: Cek playersCache sebelum mengakses length
    const totalPlayers = playersCache ? playersCache.length : 0;
    console.log('Database initialized. Total players:', totalPlayers); 

  } catch (error) {
    console.error('Error initializing database:', error);
    playersCache = [];
    isInitialized = false;
  }
};

/**
 * Fungsi untuk mendapatkan pemain yang sudah ada atau membuat pemain baru
 */
export const getOrCreatePlayer = async (name: string): Promise<Player> => {
  try {
    await ensureDatabaseInitialized();

    const existingPlayer = playersCache!.find(p => p.name === name);
    if (existingPlayer) {
      console.log('Found existing player (from cache):', existingPlayer.name);
      return existingPlayer;
    }

    const now = new Date().toISOString();
    
    const newPlayer: Player = {
      id: nextPlayerId++,
      name,
      highScore: 0,
      totalGames: 0,
      totalScore: 0,
      bestLevel: 1,
      createdAt: now,
      updatedAt: now,
    };

    console.log('Creating new player:', newPlayer.name);
    
    playersCache!.push(newPlayer);
    
    await savePlayers();
    
    return newPlayer;
  } catch (error) {
    console.error('Error getting/creating player:', error);
    throw error;
  }
};

/**
 * Fungsi untuk mengupdate skor pemain setelah permainan selesai
 */
export const updatePlayerScore = async (
  playerId: number,
  score: number,
  level: number
): Promise<void> => {
  try {
    console.log('updatePlayerScore called:', { playerId, score, level });
    
    await ensureDatabaseInitialized();

    // PERBAIKAN 1: Deklarasikan playerIndex menggunakan 'let' atau tanpa 'let' di blok if
    let playerIndex = playersCache!.findIndex(p => p.id === playerId);
    
    if (playerIndex === -1) {
      console.warn(`Player with id ${playerId} not found in cache. Attempting full reload.`);
      await initDatabase(); // Reload darurat
      playerIndex = playersCache!.findIndex(p => p.id === playerId);
      
      if (playerIndex === -1) {
          console.warn(`Player with id ${playerId} still not found after reload. Aborting score update.`);
          return; 
      }
    }

    let player = playersCache![playerIndex];
    
    const newHighScore = Math.max(player.highScore, score);
    const newBestLevel = Math.max(player.bestLevel, level);
    const newTotalGames = player.totalGames + 1;
    const newTotalScore = player.totalScore + score;
    const now = new Date().toISOString();

    // UPDATE DATA PEMAIN DI CACHE
    playersCache![playerIndex] = {
      ...player,
      highScore: newHighScore,
      bestLevel: newBestLevel,
      totalGames: newTotalGames,
      totalScore: newTotalScore,
      updatedAt: now,
    };

    // SIMPAN PERUBAHAN KE STORAGE
    await savePlayers();

    // BUAT SESI PERMAINAN BARU
    const session: GameSession = {
      id: Date.now(),
      playerId,
      score,
      level,
      playedAt: now,
    };

    await saveSession(session);
    console.log('Score and Session saved successfully');
  } catch (error) {
    console.error('Error updating player score:', error);
    throw error;
  }
};

/**
 * Fungsi untuk mendapatkan semua pemain yang terdaftar
 */
export const getAllPlayers = async (): Promise<Player[]> => {
  try {
    const playersData = await AsyncStorage.getItem(PLAYERS_KEY);
    
    if (playersData) {
      playersCache = JSON.parse(playersData);
      isInitialized = true;
    } else {
      if (!playersCache) {
          playersCache = [];
      }
    }

    if (!playersCache || playersCache.length === 0) {
      return [];
    }

    const sorted = [...playersCache].sort((a, b) => {
      if (b.highScore !== a.highScore) {
        return b.highScore - a.highScore;
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    
    return sorted;
  } catch (error) {
    console.error('Error getting all players:', error);
    return [];
  }
};

/**
 * Fungsi untuk mendapatkan riwayat sesi permainan dari seorang pemain
 */
export const getPlayerSessions = async (playerId: number, limit: number = 10): Promise<GameSession[]> => {
  try {
    const sessionsData = await AsyncStorage.getItem(SESSIONS_KEY);
    
    if (!sessionsData) {
      return [];
    }

    const allSessions: GameSession[] = JSON.parse(sessionsData);
    
    const playerSessions = allSessions
      .filter(s => s.playerId === playerId)
      .sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime())
      .slice(0, limit);

    return playerSessions;
  } catch (error) {
    console.error('Error getting player sessions:', error);
    return [];
  }
};

/**
 * Fungsi untuk mendapatkan pemain teratas berdasarkan ranking
 */
export const getTopPlayers = async (limit: number = 10): Promise<Player[]> => {
  try {
    const allPlayers = await getAllPlayers();
    return allPlayers.slice(0, limit);
  } catch (error) {
    console.error('Error getting top players:', error);
    return [];
  }
};

/**
 * Fungsi untuk mengupdate nama pemain
 */
export const updatePlayerName = async (
  playerId: number,
  newName: string
): Promise<Player> => {
  try {
    console.log('updatePlayerName called:', { playerId, newName });
    
    await ensureDatabaseInitialized();

    const nameExists = playersCache!.some(p => p.name === newName && p.id !== playerId);
    
    if (nameExists) {
      throw new Error('Nama sudah digunakan oleh pemain lain');
    }

    const playerIndex = playersCache!.findIndex(p => p.id === playerId);
    
    if (playerIndex === -1) {
      throw new Error(`Player with id ${playerId} not found`);
    }

    const player = playersCache![playerIndex];
    const now = new Date().toISOString();

    playersCache![playerIndex] = {
      ...player,
      name: newName,
      updatedAt: now,
    };

    await savePlayers();

    return playersCache![playerIndex];
  } catch (error) {
    console.error('Error updating player name:', error);
    throw error;
  }
};

/**
 * Fungsi untuk menghapus pemain dari database
 */
export const deletePlayer = async (playerId: number): Promise<void> => {
  try {
    await ensureDatabaseInitialized();

    const initialLength = playersCache!.length;
    playersCache = playersCache!.filter(p => p.id !== playerId);
    
    if (playersCache.length === initialLength) {
        console.warn(`Player with ID ${playerId} not found for deletion.`);
        return;
    }

    await savePlayers();

    const sessionsData = await AsyncStorage.getItem(SESSIONS_KEY);
    
    if (sessionsData) {
      const sessions: GameSession[] = JSON.parse(sessionsData);
      const filteredSessions = sessions.filter(s => s.playerId !== playerId);
      await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(filteredSessions));
    }
    
    console.log(`Player ${playerId} and related sessions deleted successfully.`);
  } catch (error) {
    console.error('Error deleting player:', error);
    throw error;
  }
};