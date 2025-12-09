/*
 * ============================================
 * WATERMARK DEVELOPER
 * ============================================
 * Nama        : Dendi Pratama Riawan
 * GitHub      : github/DendiPratamaRiawan
 * ============================================
 */
import PlayerForm from '@/components/PlayerForm';
import { getOrCreatePlayer, initDatabase, Player, updatePlayerName, updatePlayerScore } from '@/utils/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ============================================
// KONSTANTA WARNA BARU (Dark Mode Schema)
// ============================================
const COLORS = {
  darkBackground: '#1A1A2E', // Dark Blue/Ungu Gelap
  cardBackground: '#2E3A59', // Latar belakang elemen/kartu
  primary: '#FFC72C',        // Bright Gold/Aksen Utama
  text: '#FFFFFF',           // Teks utama
  secondaryText: '#A0A0B0',  // Teks sekunder
  danger: '#E74C3C',         // Merah untuk Game Over/Bahaya
  paddle: '#4ECDC4',         // Warna Paddle (Cyan)
};

// ============================================
// KONSTANTA PENGATURAN DEFAULT DAN KEY
// ============================================
const DEFAULT_BALL_SPEED = 6;
const SETTINGS_KEY = '@pemecah_bata:settings';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ============================================
// KONSTANTA GAME LAIN
// ============================================
const BALL_SIZE = 20;
const DEFAULT_PADDLE_WIDTH = 120;
const WIDE_PADDLE_WIDTH = 180;
const PADDLE_HEIGHT = 15;
const BRICK_WIDTH = 55;
const BRICK_HEIGHT = 25;
const BRICK_SPACING = 5;
const FAST_BALL_SPEED = 9;
const PADDLE_SPEED = 15;
const POWER_UP_SIZE = 25;
const POWER_UP_SPEED = 3;
const POWER_UP_DURATION = 5000;
const MAX_LIVES = 3;
const POWER_UP_DROP_CHANCE = 0.1;
const CONTROL_AREA_HEIGHT = 80;

// ============================================
// INTERFACE/TIPE DATA
// ============================================
interface Brick {
  id: number;
  x: number;
  y: number;
  destroyed: boolean;
  hitsRequired: number;
}

type PowerUpType = 'speed' | 'wide_paddle';

interface PowerUp {
  id: number;
  type: PowerUpType;
  x: number;
  y: number;
  active: boolean;
  velocityY: number;
}

// ============================================
// KOMPONEN UTAMA GAME
// ============================================
export default function BreakoutGame() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [showPlayerForm, setShowPlayerForm] = useState(true);
  const [showChangeNameForm, setShowChangeNameForm] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);
  
  const [ballSpeedSetting, setBallSpeedSetting] = useState(DEFAULT_BALL_SPEED);
  
  const [lives, setLives] = useState(MAX_LIVES);
  const [paddleWidth, setPaddleWidth] = useState(DEFAULT_PADDLE_WIDTH);
  const [activePowerUps, setActivePowerUps] = useState<PowerUp[]>([]);
  const powerUpTimerRef = useRef<any>(null);
  
  const ballSpeedRef = useRef(DEFAULT_BALL_SPEED); 

  // ============================================
  // KONTROL PADDLE JOYSTICK
  // ============================================
  const [paddleMoveDirection, setPaddleMoveDirection] = useState<'left' | 'right' | null>(null);
  const paddleIntervalRef = useRef<any>(null); 

  // ============================================
  // REF UNTUK POSISI DAN VELOCITY BOLA
  // ============================================
  const ballX = useRef(new Animated.Value(SCREEN_WIDTH / 2 - BALL_SIZE / 2)).current;
  const ballY = useRef(new Animated.Value(SCREEN_HEIGHT * 0.6)).current;
  const ballXPos = useRef(SCREEN_WIDTH / 2 - BALL_SIZE / 2);
  const ballYPos = useRef(SCREEN_HEIGHT * 0.6);
  const velocityX = useRef(DEFAULT_BALL_SPEED); 
  const velocityY = useRef(-DEFAULT_BALL_SPEED);

  // ============================================
  // REF UNTUK POSISI PADDLE
  // ============================================
  const paddleX = useRef(new Animated.Value(SCREEN_WIDTH / 2 - DEFAULT_PADDLE_WIDTH / 2)).current;
  const paddleXPos = useRef(SCREEN_WIDTH / 2 - DEFAULT_PADDLE_WIDTH / 2);

  // ============================================
  // STATE UNTUK BRICKS/BATA
  // ============================================
  const [bricks, setBricks] = useState<Brick[]>([]);
  const gameLoopRef = useRef<any>(null);

  // ============================================
  // HANDLER PADDLE JOYSTICK
  // ============================================
  const movePaddle = (direction: 'left' | 'right') => {
    let newX = paddleXPos.current;
    const currentPaddleWidth = paddleWidth;

    if (direction === 'left') {
      newX = newX - PADDLE_SPEED;
    } else if (direction === 'right') {
      newX = newX + PADDLE_SPEED;
    }

    newX = Math.max(0, Math.min(SCREEN_WIDTH - currentPaddleWidth, newX));

    paddleXPos.current = newX;
    paddleX.setValue(newX);
  };

  const handlePaddleStart = (direction: 'left' | 'right') => {
    if (!gameStarted || gameOver) return;

    if (paddleIntervalRef.current) {
      clearInterval(paddleIntervalRef.current);
    }

    setPaddleMoveDirection(direction);

    movePaddle(direction);
    paddleIntervalRef.current = setInterval(() => {
      movePaddle(direction);
    }, 16);
  };

  const handlePaddleEnd = () => {
    if (paddleIntervalRef.current) {
      clearInterval(paddleIntervalRef.current);
      paddleIntervalRef.current = null;
    }
    setPaddleMoveDirection(null);
  };

  /**
   * Handler saat layar disentuh (hanya untuk memulai game)
   */
  const handleTouchStart = () => {
    if (!gameStarted && !gameOver && !showPlayerForm && !showChangeNameForm && lives > 0) {
      if (lives < MAX_LIVES) {
        startNextLife();
      } else {
        startGame(true);
      }
      return;
    }
  };

  // ============================================
  // EFFECT DAN INITIALIZATION
  // ============================================
  useEffect(() => {
    initializeBricks();
  }, [level, paddleWidth]);

  useEffect(() => {
    const initApp = async () => {
      try {
        await initDatabase();
        setDbInitialized(true);
        await loadGameSettings(); 
      } catch (error) {
        console.error('Failed to initialize database/settings:', error);
      }
    };
    initApp();
  }, []);

  /**
   * FUNGSI BARU: Memuat pengaturan kecepatan bola dari AsyncStorage
   */
  const loadGameSettings = async () => {
    try {
      const settingsData = await AsyncStorage.getItem(SETTINGS_KEY);
      if (settingsData) {
        const settings = JSON.parse(settingsData);
        const newSpeed = settings.ballSpeed || DEFAULT_BALL_SPEED; 
        
        setBallSpeedSetting(newSpeed); 
        ballSpeedRef.current = newSpeed; 
        console.log("Settings loaded. Ball Speed:", newSpeed);
      } else {
        setBallSpeedSetting(DEFAULT_BALL_SPEED);
        ballSpeedRef.current = DEFAULT_BALL_SPEED;
      }
    } catch (error) {
      console.error('Error loading game settings:', error);
      setBallSpeedSetting(DEFAULT_BALL_SPEED);
      ballSpeedRef.current = DEFAULT_BALL_SPEED;
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadGameSettings();
    }, [gameStarted, gameOver])
  );

  useEffect(() => {
    const currentSpeed = Math.sqrt(velocityX.current ** 2 + velocityY.current ** 2);
    const targetSpeed = ballSpeedRef.current;
    
    if (gameStarted && !gameOver && currentSpeed > 0 && targetSpeed > 0) {
        const ratio = targetSpeed / currentSpeed;
        velocityX.current *= ratio;
        velocityY.current *= ratio;
    }
  }, [ballSpeedRef.current]);


  // ============================================
  // FUNGSI INISIALISASI BRICKS (Sama)
  // ============================================
  const initializeBricks = () => {
    const newBricks: Brick[] = [];
    const cols = 7;
    const rows = 6;

    const totalBrickWidth = cols * BRICK_WIDTH + (cols - 1) * BRICK_SPACING;
    const startX = (SCREEN_WIDTH - totalBrickWidth) / 2;
    const startY = 120 + insets.top; 

    let brickIdCounter = 0;

    for (let row = 0; row < rows; row++) {
      let bricksInRow = cols;
      let rowStartX = startX;
      let hitsRequired = 1;

      if (row < 2) {
        hitsRequired = 2;
      }

      if (level === 1) {
        if (row >= 6) continue;
        bricksInRow = 6;
        const rowWidth = bricksInRow * BRICK_WIDTH + (bricksInRow - 1) * BRICK_SPACING;
        rowStartX = (SCREEN_WIDTH - rowWidth) / 2;
      } else if (level === 2) {
        bricksInRow = cols - Math.floor(row / 2);
        if (bricksInRow < 1) continue;
        const rowWidth = bricksInRow * BRICK_WIDTH + (bricksInRow - 1) * BRICK_SPACING;
        rowStartX = (SCREEN_WIDTH - rowWidth) / 2;
      } else if (level === 3) {
        const distanceFromCenter = Math.abs(row - Math.floor(rows / 2));
        bricksInRow = cols - distanceFromCenter * 2 + 1;
        if (bricksInRow < 1) continue;
        const rowWidth = bricksInRow * BRICK_WIDTH + (bricksInRow - 1) * BRICK_SPACING;
        rowStartX = (SCREEN_WIDTH - rowWidth) / 2;
      } else {
        bricksInRow = 7;
        for (let col = 0; col < bricksInRow; col++) {
          const skipPattern = (row % 2 === 0 && col % 2 !== 0) || (row % 3 === 1 && col % 3 === 0);
          if (skipPattern) continue;

          newBricks.push({
            id: brickIdCounter++,
            x: startX + col * (BRICK_WIDTH + BRICK_SPACING),
            y: startY + row * (BRICK_HEIGHT + BRICK_SPACING),
            destroyed: false,
            hitsRequired: row < 3 ? 2 : 1,
          });
        }
        continue;
      }

      for (let col = 0; col < bricksInRow; col++) {
        newBricks.push({
          id: brickIdCounter++,
          x: rowStartX + col * (BRICK_WIDTH + BRICK_SPACING),
          y: startY + row * (BRICK_HEIGHT + BRICK_SPACING),
          destroyed: false,
          hitsRequired: hitsRequired,
        });
      }
    }

    setBricks(newBricks);
  };
  
  // ============================================
  // HANDLER PEMAIN (Sama)
  // ============================================
  const handlePlayerSubmit = async (name: string) => {
    try {
      if (!dbInitialized) await initDatabase();
      const player = await getOrCreatePlayer(name);
      setCurrentPlayer(player);
      setShowPlayerForm(false);
      setHighScore(player.highScore);
    } catch (error) {
      console.error('Error creating/getting player:', error);
      alert('Gagal memuat database. Silakan coba lagi.');
    }
  };

  const handleChangeName = async (newName: string) => {
    if (!currentPlayer) return;
    try {
      const updatedPlayer = await updatePlayerName(currentPlayer.id, newName);
      setCurrentPlayer(updatedPlayer);
      setShowChangeNameForm(false);
      alert('Nama berhasil diubah!');
    } catch (error: any) {
      console.error('Error changing name:', error);
      alert(error.message || 'Gagal mengubah nama. Silakan coba lagi.');
    }
  };


  // ============================================
  // FUNGSI UNTUK MEMULAI GAME / RESET BOLA
  // ============================================
  const resetBallAndPaddle = () => {
    const startX = SCREEN_WIDTH / 2 - BALL_SIZE / 2;
    const startY = SCREEN_HEIGHT * 0.6;
    ballXPos.current = startX;
    ballYPos.current = startY;
    ballX.setValue(startX);
    ballY.setValue(startY);

    const currentBaseSpeed = ballSpeedSetting; 
    ballSpeedRef.current = currentBaseSpeed;

    velocityX.current = (Math.random() > 0.5 ? 1 : -1) * currentBaseSpeed;
    velocityY.current = -currentBaseSpeed;

    const paddleStartX = SCREEN_WIDTH / 2 - paddleWidth / 2;
    paddleXPos.current = paddleStartX;
    paddleX.setValue(paddleStartX);
  }

  const startGame = (resetToLevel1: boolean = true) => {
    if (!currentPlayer) {
      setShowPlayerForm(true);
      return;
    }

    setGameStarted(true);
    setGameOver(false);
    setGameWon(false);
    setScore(0);
    scoreRef.current = 0;
    setLives(MAX_LIVES);
    setPaddleWidth(DEFAULT_PADDLE_WIDTH);
    setActivePowerUps([]);
    if(powerUpTimerRef.current) clearTimeout(powerUpTimerRef.current);

    if (resetToLevel1) {
      setLevel(1);
    }

    resetBallAndPaddle(); 
    initializeBricks();
    gameLoop();
  };

  const startFromLevel1 = () => {
    startGame(true);
  };

  const startNextLife = () => {
    if (lives > 0) {
      setGameStarted(true);
      setGameOver(false);
      setGameWon(false);
      
      setPaddleWidth(DEFAULT_PADDLE_WIDTH);
      setActivePowerUps([]);
      if(powerUpTimerRef.current) clearTimeout(powerUpTimerRef.current);
      
      resetBallAndPaddle();
      gameLoop();
    }
  };

  // ============================================
  // APLIKASI POWER-UP
  // ============================================
  const activatePowerUp = (type: PowerUpType) => {
    if (powerUpTimerRef.current) {
      clearTimeout(powerUpTimerRef.current);
    }

    if (type === 'wide_paddle') {
      setPaddleWidth(WIDE_PADDLE_WIDTH);
      
      powerUpTimerRef.current = setTimeout(() => {
        setPaddleWidth(DEFAULT_PADDLE_WIDTH);
        powerUpTimerRef.current = null;
      }, POWER_UP_DURATION);
    } else if (type === 'speed') {
      ballSpeedRef.current = FAST_BALL_SPEED; 

      powerUpTimerRef.current = setTimeout(() => {
        ballSpeedRef.current = ballSpeedSetting; 
        powerUpTimerRef.current = null;
      }, POWER_UP_DURATION);
    }
  };

  // ============================================
  // FUNGSI CEK COLLISION (Sama)
  // ============================================
  const checkCollisions = () => {
    const ballLeft = ballXPos.current;
    const ballRight = ballXPos.current + BALL_SIZE;
    const ballTop = ballYPos.current;
    const ballBottom = ballYPos.current + BALL_SIZE;
    
    // --- COLLISION DENGAN DINDING KIRI/KANAN & ATAS ---
    if (ballLeft <= 0 || ballRight >= SCREEN_WIDTH) {
      velocityX.current *= -1;
      if (ballLeft <= 0) ballXPos.current = 0;
      else ballXPos.current = SCREEN_WIDTH - BALL_SIZE;
      ballX.setValue(ballXPos.current);
    }

    if (ballTop <= 0) {
      velocityY.current *= -1;
      ballYPos.current = 0;
      ballY.setValue(0);
    }

    // --- COLLISION DENGAN PADDLE (Y position disesuaikan) ---
    const currentPaddleWidth = paddleWidth;
    const paddleLeft = paddleXPos.current;
    const paddleRight = paddleXPos.current + currentPaddleWidth;
    const paddleTop = SCREEN_HEIGHT - PADDLE_HEIGHT - 30 - insets.bottom - CONTROL_AREA_HEIGHT; 

    if (velocityY.current > 0) {
      const nextBallX = ballXPos.current + velocityX.current;
      const nextBallY = ballYPos.current + velocityY.current;
      const nextBallLeft = nextBallX;
      const nextBallRight = nextBallX + BALL_SIZE;
      const nextBallBottom = nextBallY + BALL_SIZE;

      const horizontalOverlap = nextBallRight > paddleLeft && nextBallLeft < paddleRight;

      if (horizontalOverlap && nextBallBottom >= paddleTop) {
        velocityY.current *= -1;
        ballYPos.current = paddleTop - BALL_SIZE;
        ballY.setValue(paddleTop - BALL_SIZE);

        const ballCenterX = ballXPos.current + BALL_SIZE / 2;
        const hitPosition = Math.max(0, Math.min(1, (ballCenterX - paddleLeft) / currentPaddleWidth));
        velocityX.current = (hitPosition - 0.5) * ballSpeedRef.current * 2; 
      }
    }

    // --- COLLISION DENGAN BRICKS ---
    let bricksUpdated = false;
    let brickDestroyed = false;

    const newBricks = bricks.map(brick => {
      if (brick.destroyed) return brick;

      const brickLeft = brick.x;
      const brickRight = brick.x + BRICK_WIDTH;
      const brickTop = brick.y;
      const brickBottom = brick.y + BRICK_HEIGHT;

      if (
        ballRight > brickLeft &&
        ballLeft < brickRight &&
        ballBottom > brickTop &&
        ballTop < brickBottom
      ) {
        bricksUpdated = true;
        
        const hitsLeft = brick.hitsRequired - 1;

        if (hitsLeft <= 0) {
          brickDestroyed = true;
          setScore(prevScore => {
            const newScore = prevScore + 20;
            scoreRef.current = newScore;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });

          if (Math.random() < POWER_UP_DROP_CHANCE) {
            const types: PowerUpType[] = ['speed', 'wide_paddle'];
            const randomType = types[Math.floor(Math.random() * types.length)];
            setActivePowerUps(prev => [
              ...prev,
              {
                id: Date.now() + Math.random(),
                type: randomType,
                x: brick.x + BRICK_WIDTH / 2 - POWER_UP_SIZE / 2,
                y: brick.y,
                active: true,
                velocityY: POWER_UP_SPEED,
              }
            ]);
          }

          const ballCenterX = ballXPos.current + BALL_SIZE / 2;
          const ballCenterY = ballYPos.current + BALL_SIZE / 2;
          const brickCenterX = brick.x + BRICK_WIDTH / 2;
          const brickCenterY = brick.y + BRICK_HEIGHT / 2;
          const dx = ballCenterX - brickCenterX;
          const dy = ballCenterY - brickCenterY;

          if (Math.abs(dx) > Math.abs(dy)) {
            velocityX.current *= -1;
          } else {
            velocityY.current *= -1;
          }

          return { ...brick, destroyed: true };
        } else {
          setScore(prevScore => {
            const newScore = prevScore + 10;
            scoreRef.current = newScore;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });

          const ballCenterX = ballXPos.current + BALL_SIZE / 2;
          const ballCenterY = ballYPos.current + BALL_SIZE / 2;
          const brickCenterX = brick.x + BRICK_WIDTH / 2;
          const brickCenterY = brick.y + BRICK_HEIGHT / 2;
          const dx = ballCenterX - brickCenterX;
          const dy = ballCenterY - brickCenterY;

          if (Math.abs(dx) > Math.abs(dy)) {
            velocityX.current *= -1;
          } else {
            velocityY.current *= -1;
          }
          
          return { ...brick, hitsRequired: hitsLeft };
        }
      }
      return brick;
    });

    if (bricksUpdated) {
      setBricks(newBricks);
    }

    // CEK LEVEL COMPLETE
    const remainingBricks = newBricks.filter(b => !b.destroyed).length;
    if (remainingBricks === 0 && brickDestroyed) {
      setTimeout(() => {
        setLevel(prevLevel => {
          const newLevel = prevLevel + 1;
          resetBallAndPaddle();
          return newLevel;
        });
        setTimeout(() => initializeBricks(), 100);
      }, 300);
    }

    // --- CEK GAME OVER (Lives System) ---
    if (ballTop > SCREEN_HEIGHT - CONTROL_AREA_HEIGHT) {
      setLives(prevLives => {
        const newLives = prevLives - 1;
        if (newLives <= 0) {
          setGameWon(false);
          setGameOver(true);
          setGameStarted(false);
          if (currentPlayer) {
            updatePlayerScore(currentPlayer.id, scoreRef.current, level).catch(console.error);
          }
        } else {
          setTimeout(() => {
            resetBallAndPaddle();
            setGameStarted(false); 
          }, 500);
        }
        return newLives;
      });
    }
  };

  // ============================================
  // FUNGSI GAME LOOP (Sama)
  // ============================================
  const gameLoop = () => {
    if (gameOver || !gameStarted) return;

    const update = () => {
      if (!gameStarted || gameOver) return;

      checkCollisions();

      let newX = ballXPos.current + velocityX.current;
      let newY = ballYPos.current + velocityY.current;

      ballXPos.current = newX;
      ballYPos.current = newY;
      ballX.setValue(newX);
      ballY.setValue(newY);

      setActivePowerUps(prevPowerUps => {
        const currentPaddleWidth = paddleWidth;
        const paddleLeft = paddleXPos.current;
        const paddleRight = paddleXPos.current + currentPaddleWidth;
        const paddleTop = SCREEN_HEIGHT - PADDLE_HEIGHT - 30 - insets.bottom - CONTROL_AREA_HEIGHT;

        return prevPowerUps.map(pu => {
          if (!pu.active) return pu;

          const newPuY = pu.y + pu.velocityY;

          const puBottom = newPuY + POWER_UP_SIZE;
          const puRight = pu.x + POWER_UP_SIZE;

          const isHit = (
            puRight > paddleLeft &&
            pu.x < paddleRight &&
            puBottom > paddleTop &&
            newPuY < paddleTop + PADDLE_HEIGHT
          );

          if (isHit) {
            activatePowerUp(pu.type);
            return { ...pu, active: false };
          }

          if (newPuY > SCREEN_HEIGHT) {
            return { ...pu, active: false };
          }

          return { ...pu, y: newPuY };
        }).filter(pu => pu.active);
      });

      gameLoopRef.current = requestAnimationFrame(update);
    };

    gameLoopRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    if (gameStarted && !gameOver && lives > 0) {
      gameLoop();
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      if (paddleIntervalRef.current) {
        clearInterval(paddleIntervalRef.current);
      }
    };
  }, [gameStarted, gameOver, bricks, lives, paddleWidth, ballSpeedRef.current, ballSpeedSetting]);

  // ============================================
  // FUNGSI RENDER
  // ============================================

  const getBrickColor = (hits: number, id: number): string => {
    const row = Math.floor(id / 7);
    const baseColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#ff85a1'];
    const baseColor = baseColors[row % baseColors.length];

    if (hits === 2) {
      return baseColor.replace('#', '#66');
    }
    return baseColor;
  };

  const getPowerUpIcon = (type: PowerUpType): string => {
    switch (type) {
      case 'speed':
        return '⚡';
      case 'wide_paddle':
        return '↔️';
      default:
        return '✨';
    }
  };


  const renderBricks = () => {
    return bricks.map((brick) => {
      if (brick.destroyed) return null;

      return (
        <View
          key={brick.id}
          style={[
            styles.brick,
            {
              left: brick.x,
              top: brick.y,
              backgroundColor: getBrickColor(brick.hitsRequired, brick.id),
              borderWidth: brick.hitsRequired > 1 ? 3 : 2,
            },
          ]}
        >
          {brick.hitsRequired > 1 && (
             <Text style={styles.brickHitText}>{brick.hitsRequired}</Text>
          )}
        </View>
      );
    });
  };

  const renderPowerUps = () => {
    return activePowerUps.map(pu => (
      <View
        key={pu.id}
        style={[
          styles.powerUp,
          {
            left: pu.x,
            top: pu.y,
            backgroundColor: pu.type === 'wide_paddle' ? '#2ecc71' : COLORS.danger,
          },
        ]}
      >
        <Text style={styles.powerUpText}>{getPowerUpIcon(pu.type)}</Text>
      </View>
    ));
  };


  return (
    <View
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      {/* Mengubah status bar agar kontras dengan latar belakang gelap */}
      <StatusBar style="light" /> 

      {/* HEADER SCORE */}
      <View style={[styles.scoreContainer, { top: insets.top + 10 }]}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>SKOR</Text>
          <Text style={[styles.scoreValue, { color: COLORS.text }]}>{score}</Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>LEVEL</Text>
          <Text style={[styles.scoreValue, { color: COLORS.primary }]}>{level}</Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>TERTINGGI</Text>
          <Text style={[styles.scoreValue, { color: COLORS.secondaryText }]}>{highScore}</Text>
        </View>
        <View style={styles.livesBox}>
          <Text style={styles.livesIcon}>❤️</Text>
          <Text style={styles.livesCount}>{lives}</Text>
        </View>
      </View>

      {/* AREA GAME */}
      <View style={styles.gameArea} onTouchStart={handleTouchStart}>
        {renderBricks()}
        {renderPowerUps()}

        <Animated.View
          style={[
            styles.ball,
            {
              left: ballX,
              top: ballY,
              // Bola berubah warna jika power-up kecepatan aktif
              backgroundColor: ballSpeedRef.current > ballSpeedSetting ? COLORS.primary : COLORS.text, 
            },
          ]}
        />

        <Animated.View
          style={[
            styles.paddle,
            {
              left: paddleX,
              bottom: 30 + CONTROL_AREA_HEIGHT, 
              width: paddleWidth,
              backgroundColor: COLORS.paddle, // Menggunakan warna paddle dari konstanta
              borderColor: COLORS.text,
            },
          ]}
        />
      </View>
      
      {/* KONTROL JOYSTICK */}
      <View style={styles.controlArea}>
        {/* Tombol Kiri */}
        <TouchableOpacity
          style={[styles.controlButton, paddleMoveDirection === 'left' && styles.controlButtonActive]}
          onPressIn={() => handlePaddleStart('left')}
          onPressOut={handlePaddleEnd}
          disabled={!gameStarted || gameOver}
        >
          <Text style={styles.controlButtonText}>◀️ Kiri</Text>
        </TouchableOpacity>
        
        {/* Tombol Kanan */}
        <TouchableOpacity
          style={[styles.controlButton, paddleMoveDirection === 'right' && styles.controlButtonActive]}
          onPressIn={() => handlePaddleStart('right')}
          onPressOut={handlePaddleEnd}
          disabled={!gameStarted || gameOver}
        >
          <Text style={styles.controlButtonText}>Kanan ▶️</Text>
        </TouchableOpacity>
      </View>


      {/* OVERLAY MODAL */}
      {!gameStarted && (
        <View style={styles.overlay} pointerEvents="box-none">
          <View style={styles.overlayContent} pointerEvents="auto">
            {showPlayerForm ? (
              <>
                <Text style={[styles.overlayTitle, { color: COLORS.primary }]}>🎮 Pemecah Bata</Text>
                {/* Asumsi PlayerForm sudah menggunakan style yang baik */}
                <PlayerForm onSubmit={handlePlayerSubmit} /> 
              </>
            ) :
            showChangeNameForm ? (
              <>
                <Text style={[styles.overlayTitle, { color: COLORS.primary }]}>Ubah Nama</Text>
                <PlayerForm
                  onSubmit={handleChangeName}
                  onCancel={() => setShowChangeNameForm(false)}
                  initialName={currentPlayer?.name}
                />
              </>
            ) :
            gameOver ? (
              <>
                <Text style={[styles.overlayTitle, { color: COLORS.danger }]}>
                  {gameWon ? '🎉 Selamat, Anda Menang!' : '💥 Game Over!'}
                </Text>
                <Text style={styles.overlayScore}>Skor Akhir: {score}</Text>
                <Text style={styles.overlayLevelText}>Level Tertinggi: {level}</Text>
                {currentPlayer && (
                  <Text style={styles.playerNameText}>Pemain: {currentPlayer.name}</Text>
                )}
                {/* Tombol Mulai Baru */}
                <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.primary }]} onPress={startFromLevel1}>
                  <Text style={[styles.buttonText, { color: COLORS.darkBackground }]}>Mulai Baru</Text>
                </TouchableOpacity>
                {/* Tombol Leaderboard */}
                <TouchableOpacity
                  style={[styles.button, styles.leaderboardButton, { backgroundColor: COLORS.cardBackground }]}
                  onPress={() => router.push('/leaderboard' as any)}
                > 
                  <Text style={styles.buttonText}>Lihat Leaderboard</Text>
                </TouchableOpacity>
              </>
            ) : 
            lives < MAX_LIVES && lives > 0 ? (
                // Lanjut Main setelah kehilangan nyawa
                <>
                    <Text style={[styles.overlayTitle, { color: COLORS.primary }]}>⚠️ Bola Jatuh!</Text>
                    <Text style={[styles.livesCount, {fontSize: 24, marginVertical: 10, color: COLORS.text}]}>Sisa Nyawa: ❤️ {lives}</Text>
                    <TouchableOpacity style={[styles.button, { backgroundColor: '#2ecc71' }]} onPress={startNextLife}>
                        <Text style={styles.buttonText}>Lanjut ({lives} Nyawa)</Text>
                    </TouchableOpacity>
                </>
            )
            :
            (
              // Tampilan Awal
              <>
                <Text style={[styles.overlayTitle, { color: COLORS.primary }]}>🎮 Pemecah Bata</Text>
                {currentPlayer && (
                  <>
                    <Text style={[styles.playerNameText, { color: COLORS.secondaryText }]}>Selamat Datang, <Text style={{ color: COLORS.text, fontWeight: 'bold' }}>{currentPlayer.name}</Text></Text>
                    <TouchableOpacity
                      style={[styles.button, styles.changeNameButton, { backgroundColor: COLORS.cardBackground, marginBottom: 15 }]}
                      onPress={() => setShowChangeNameForm(true)}
                    >
                      <Text style={styles.buttonText}>Ganti Nama</Text>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.primary }]} onPress={() => startGame(true)}>
                  <Text style={[styles.buttonText, { color: COLORS.darkBackground, fontWeight: '900' }]}>▶ MULAI BERMAIN</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.leaderboardButton, { backgroundColor: COLORS.cardBackground }]}
                  onPress={() => router.push('/leaderboard' as any)}
                >
                  <Text style={styles.buttonText}>🏆 Leaderboard</Text>
                </TouchableOpacity>
                <Text style={[styles.instructionsText, { color: COLORS.secondaryText }]}>
                  Gunakan tombol **Kiri** dan **Kanan** di bawah untuk mengontrol papan.
                </Text>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

/**
 * StyleSheet untuk semua komponen UI dalam game
 */
const styles = StyleSheet.create({
  // --- LAYOUT & CONTAINER ---
  container: {
    flex: 1,
    // Mengubah warna latar belakang utama
    backgroundColor: COLORS.darkBackground, 
  },
  
  // --- SCORE HEADER ---
  scoreContainer: {
    position: 'absolute',
    left: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    paddingVertical: 10,
    // Menggunakan warna kartu/elemen gelap
    backgroundColor: COLORS.cardBackground, 
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  scoreBox: {
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  scoreLabel: {
    fontSize: 10,
    color: COLORS.secondaryText,
    fontWeight: 'bold',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  livesBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#6C3483', // Warna Lives yang berbeda
  },
  livesIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  livesCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  
  // --- GAME AREA ---
  gameArea: {
    flex: 1,
    position: 'relative',
    paddingBottom: CONTROL_AREA_HEIGHT, 
  },
  ball: {
    position: 'absolute',
    width: BALL_SIZE,
    height: BALL_SIZE,
    backgroundColor: COLORS.text,
    borderRadius: BALL_SIZE / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  paddle: {
    position: 'absolute',
    height: PADDLE_HEIGHT,
    backgroundColor: COLORS.paddle, // Warna Paddle
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.text,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  brick: {
    position: 'absolute',
    width: BRICK_WIDTH,
    height: BRICK_HEIGHT,
    borderRadius: 4,
    borderColor: COLORS.text,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brickHitText: {
      color: COLORS.text,
      fontWeight: 'bold',
      fontSize: 14,
  },
  powerUp: {
    position: 'absolute',
    width: POWER_UP_SIZE,
    height: POWER_UP_SIZE,
    borderRadius: POWER_UP_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
  powerUpText: {
    fontSize: 16,
    lineHeight: 18,
  },
  
  // --- CONTROL AREA (JOYSTICK) ---
  controlArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: CONTROL_AREA_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    // Menggunakan warna kartu/elemen gelap
    backgroundColor: COLORS.cardBackground, 
    borderTopWidth: 1,
    borderTopColor: '#3A4A70', // Garis pemisah yang soft
    zIndex: 15,
  },
  controlButton: {
    backgroundColor: '#38425F',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    minWidth: '45%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4B5A80',
  },
  controlButtonActive: {
    backgroundColor: COLORS.primary, // Aksen aktif Bright Gold
    borderColor: COLORS.text,
  },
  controlButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // --- OVERLAY MODAL ---
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  overlayContent: {
    // Mengubah warna modal menjadi kartu gelap
    backgroundColor: COLORS.cardBackground, 
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 280,
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7, // Meningkatkan shadow agar lebih menonjol
    shadowRadius: 15,
  },
  overlayTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.danger, // Warna Title Game Over/Primary
    marginBottom: 15,
  },
  overlayScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary, // Skor utama menggunakan aksen
    marginBottom: 10,
  },
  overlayLevelText: { 
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondaryText,
    marginBottom: 15, 
  },
  playerNameText: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  instructionsText: {
    fontSize: 14,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    minWidth: 220,
    alignItems: 'center',
    // Menambahkan shadow ke tombol
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  leaderboardButton: {
    backgroundColor: '#6C3483', // Warna ungu untuk Leaderboard
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  changeNameButton: {
    backgroundColor: '#38425F',
    marginTop: 5,
    marginBottom: 5,
  },
});