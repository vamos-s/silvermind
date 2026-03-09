'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

import { SettingsPanel } from "@/components/SettingsPanel"
const MAX_LEVELS = 30

type Piece = {
  id: number
  correctPosition: number
  currentPosition: number
}

const LEVEL_SETTINGS = [
  // Levels 1-5: Easy introduction (2x2, 2x3)
  { gridSize: 2, inputTime: 45, difficulty: 'easy' },    // Level 1
  { gridSize: 2, inputTime: 42, difficulty: 'easy' },    // Level 2
  { gridSize: 2, inputTime: 40, difficulty: 'easy' },    // Level 3
  { gridSize: 3, inputTime: 45, difficulty: 'easy' },    // Level 4 (2x3)
  { gridSize: 3, inputTime: 42, difficulty: 'easy' },    // Level 5 (2x3)

  // Levels 6-10: Medium challenge (3x3)
  { gridSize: 3, inputTime: 50, difficulty: 'medium' },  // Level 6 (3x3)
  { gridSize: 3, inputTime: 48, difficulty: 'medium' },  // Level 7
  { gridSize: 3, inputTime: 46, difficulty: 'medium' },  // Level 8
  { gridSize: 3, inputTime: 44, difficulty: 'medium' },  // Level 9
  { gridSize: 4, inputTime: 50, difficulty: 'medium' },  // Level 10 (3x4)

  // Levels 11-15: Harder progression (4x4)
  { gridSize: 4, inputTime: 55, difficulty: 'hard' },   // Level 11 (4x4)
  { gridSize: 4, inputTime: 52, difficulty: 'hard' },    // Level 12
  { gridSize: 4, inputTime: 50, difficulty: 'hard' },    // Level 13
  { gridSize: 4, inputTime: 48, difficulty: 'hard' },   // Level 14
  { gridSize: 4, inputTime: 46, difficulty: 'hard' },   // Level 15

  // Levels 16-20: Advanced challenge (5x4 or 5x5)
  { gridSize: 5, inputTime: 55, difficulty: 'hard' },    // Level 16 (5x4)
  { gridSize: 5, inputTime: 52, difficulty: 'hard' },  // Level 17
  { gridSize: 5, inputTime: 50, difficulty: 'hard' },  // Level 18 (5x5)
  { gridSize: 5, inputTime: 48, difficulty: 'hard' },  // Level 19
  { gridSize: 5, inputTime: 46, difficulty: 'hard' },   // Level 20

  // Levels 21-25: Expert level (6x5 or 6x6)
  { gridSize: 6, inputTime: 55, difficulty: 'expert' }, // Level 21 (6x5)
  { gridSize: 6, inputTime: 52, difficulty: 'expert' }, // Level 22
  { gridSize: 6, inputTime: 50, difficulty: 'expert' }, // Level 23 (6x6)
  { gridSize: 6, inputTime: 48, difficulty: 'expert' }, // Level 24
  { gridSize: 6, inputTime: 46, difficulty: 'expert' }, // Level 25

  // Levels 26-30: Master level (7x6 or 7x7)
  { gridSize: 7, inputTime: 55, difficulty: 'expert' }, // Level 26 (7x6)
  { gridSize: 7, inputTime: 52, difficulty: 'expert' }, // Level 27
  { gridSize: 7, inputTime: 50, difficulty: 'expert' }, // Level 28 (7x7)
  { gridSize: 7, inputTime: 48, difficulty: 'expert' }, // Level 29
  { gridSize: 7, inputTime: 46, difficulty: 'expert' }, // Level 30
]

// Grid dimensions for each gridSize value
const GRID_DIMENSIONS: Record<number, { rows: number; cols: number }> = {
  2: { rows: 2, cols: 2 },
  3: { rows: 2, cols: 3 },
  4: { rows: 3, cols: 4 },
  5: { rows: 5, cols: 4 },
  6: { rows: 6, cols: 5 },
  7: { rows: 7, cols: 6 },
}

const COLORS = [
  'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400',
  'bg-purple-400', 'bg-pink-400', 'bg-orange-400', 'bg-cyan-400',
  'bg-indigo-400', 'bg-teal-400', 'bg-rose-400', 'bg-emerald-400',
]

export default function JigsawPuzzlePage() {
  const { t } = useTranslation()
  const { addSession, darkMode } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [pieces, setPieces] = useState<Piece[]>([])
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [moves, setMoves] = useState(0)

  const settings = LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)]
  const { rows, cols } = GRID_DIMENSIONS[settings.gridSize]
  const totalPieces = rows * cols

  const getLevelScore = (movesTaken: number) => {
    const baseScore = 300 + (level * 25)
    const movePenalty = movesTaken * 5
    const timeBonus = timeLeft * 10
    return Math.max(0, baseScore - movePenalty + timeBonus)
  }

  const generatePieces = useCallback(() => {
    const newPieces: Piece[] = []
    const positions = Array.from({ length: totalPieces }, (_, i) => i)

    // Shuffle positions
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[positions[i], positions[j]] = [positions[j], positions[i]]
    }

    for (let i = 0; i < totalPieces; i++) {
      newPieces.push({
        id: i,
        correctPosition: i,
        currentPosition: positions[i]
      })
    }

    return newPieces
  }, [totalPieces])

  const startGame = () => {
    setScore(0)
    setTotalScore(0)
    setLevel(1)
    startLevel()
  }

  const startLevel = () => {
    const newPieces = generatePieces()
    setPieces(newPieces)
    setSelectedPiece(null)
    setMoves(0)
    setTimeLeft(settings.inputTime)
    setGameState('playing')
  }

  const handlePieceClick = (index: number) => {
    if (gameState !== 'playing') return

    if (selectedPiece === null) {
      setSelectedPiece(index)
    } else if (selectedPiece === index) {
      setSelectedPiece(null)
    } else {
      // Swap pieces
      setPieces(prev => {
        const newPieces = [...prev]
        const tempPos = newPieces[selectedPiece].currentPosition
        newPieces[selectedPiece].currentPosition = newPieces[index].currentPosition
        newPieces[index].currentPosition = tempPos
        return newPieces
      })
      setMoves(prev => prev + 1)
      setSelectedPiece(null)
    }
  }

  const checkWin = useCallback(() => {
    return pieces.every(piece => piece.correctPosition === piece.currentPosition)
  }, [pieces])

  useEffect(() => {
    if (gameState === 'playing' && checkWin()) {
      const levelScore = Math.round(getLevelScore(moves))
      setScore(levelScore)
      setGameState('levelComplete')
    }
  }, [gameState, pieces, checkWin, moves])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (gameState === 'playing' && timeLeft === 0) {
      setGameState('gameOver')
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [gameState, timeLeft])

  const nextLevel = () => {
    const levelScore = score
    setTotalScore(prev => prev + levelScore)

    if (level >= MAX_LEVELS) {
      addSession({
        id: Date.now().toString(),
        gameId: 'jigsaw-puzzle',
        difficulty: 'hard',
        score: totalScore + levelScore,
        completedAt: new Date(),
        durationSeconds: 0
      })
      setGameState('victory')
    } else {
      setLevel(prev => prev + 1)
      setGameState('menu')
      setTimeout(() => startLevel(), 100)
    }
  }

  return (
    <div className={`min-h-screen p-3 md:p-4 lg:p-8 transition-colors duration-300 ${darkMode ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" : "bg-gradient-to-br from-rose-50 via-white to-pink-50 p-4 md:p-8"}`}">
      <SettingsPanel />
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link
          href="/pattern"
          className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium mb-6 text-sm md:text-base lg:text-lg"
        >
          <span className="mr-2">←</span> {t('back', 'Back')}
        </Link>

        <h1 className="text-3xl md:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2">
          {t('jigsawPuzzle.title', 'Jigsaw Puzzle')}
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-8">
          {t('jigsawPuzzle.description', 'Arrange the pieces to complete the pattern!')}
        </p>

        {/* Menu */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Level {level}
            </h2>
            {level > 1 && (
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 font-medium">
                Total Score: <span className="text-rose-600 font-bold">{totalScore}</span>
              </p>
            )}
            <div className="bg-rose-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">{t('jigsawPuzzle.levelInfo', 'Level Settings')}:</h3>
              <ul className="text-gray-700 dark:text-gray-300 space-y-1 font-medium">
                <li>• {t('jigsawPuzzle.gridSize', 'Grid Size')}: {rows}x{cols}</li>
                <li>• {t('jigsawPuzzle.pieces', 'Pieces')}: {totalPieces}</li>
                <li>• {t('jigsawPuzzle.inputTime', 'Time Limit')}: {settings.inputTime}s</li>
              </ul>
            </div>
            <button
              onClick={startLevel}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-rose-600 hover:to-pink-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Playing */}
        {gameState === 'playing' && (
          <>
            {/* Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('jigsawPuzzle.level', 'Level')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-rose-600">{level}/{MAX_LEVELS}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('jigsawPuzzle.moves', 'Moves')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-600 dark:text-gray-400">{moves}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('jigsawPuzzle.timeLeft', 'Time Left')}</p>
                  <p className={`text-2xl md:text-3xl lg:text-4xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-rose-600'}`}>
                    {timeLeft}s
                  </p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((level - 1) / MAX_LEVELS) * 100}%` }}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 h-full"
                />
              </div>
            </div>

            {/* Puzzle Grid */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-6 text-center">
              <p className="text-sm text-gray-500 mb-4">
                {t('jigsawPuzzle.instruction', 'Click two pieces to swap them')}
              </p>
              <div className="grid gap-2 max-w-md mx-auto" style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
              }}>
                {Array.from({ length: totalPieces }).map((_, index) => {
                  const piece = pieces.find(p => p.currentPosition === index)
                  const isSelected = selectedPiece === pieces.findIndex(p => p.currentPosition === index)
                  const isCorrect = piece && piece.correctPosition === piece.currentPosition

                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => {
                        const pieceIndex = pieces.findIndex(p => p.currentPosition === index)
                        handlePieceClick(pieceIndex)
                      }}
                      className={`aspect-square rounded-lg font-bold text-2xl flex items-center justify-center transition-all ${
                        isSelected
                          ? 'ring-4 ring-rose-500 ring-offset-2'
                          : 'hover:scale-105'
                      } ${piece ? COLORS[piece.correctPosition % COLORS.length] : 'bg-gray-200 dark:bg-slate-700'}`}
                    >
                      {piece && isCorrect ? '✓' : piece ? piece.correctPosition + 1 : ''}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* Level Complete */}
        {gameState === 'levelComplete' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-rose-600 mb-4">Level {level} Complete!</h2>
            <div className="bg-rose-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('jigsawPuzzle.moves', 'Moves')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-rose-600">{moves}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('jigsawPuzzle.levelScore', 'Level Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-rose-600">{score}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('jigsawPuzzle.totalScore', 'Total Score')}</p>
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-pink-600">{totalScore + score}</p>
              </div>
            </div>
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-rose-600 hover:to-pink-600 shadow-lg transition-all w-full mb-3"
            >
              {level < MAX_LEVELS ? `Next Level ${level + 1}` : 'View Final Score'}
            </button>
            <button
              onClick={startGame}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:text-white font-medium"
            >
              {t('jigsawPuzzle.restart', 'Restart from Level 1')}
            </button>
          </motion.div>
        )}

        {/* Game Over */}
        {gameState === 'gameOver' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4">{t('jigsawPuzzle.timeUp', 'Time is up!')}</h2>
            <div className="bg-orange-50 dark:bg-slate-800 rounded-xl p-6 mb-6">
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('jigsawPuzzle.totalScore', 'Total Score')}</p>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">{totalScore}</p>
            </div>
            <button
              onClick={startLevel}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-red-600 shadow-lg transition-all w-full mb-3"
            >
              {t('tryAgain', 'Try Again')}
            </button>
            <button
              onClick={startGame}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:text-white font-medium"
            >
              {t('jigsawPuzzle.restart', 'Restart from Level 1')}
            </button>
          </motion.div>
        )}

        {/* Victory */}
        {gameState === 'victory' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-rose-600 mb-4">{t('jigsawPuzzle.victory', 'Congratulations!')}</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 font-medium mb-6">
              {t('jigsawPuzzle.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className="bg-rose-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('jigsawPuzzle.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-rose-600">{totalScore + score}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-rose-600 hover:to-pink-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
