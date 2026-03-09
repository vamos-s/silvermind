'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

import { SettingsPanel } from "@/components/SettingsPanel"
const MAX_LEVELS = 30

type Position = { x: number; y: number }

const LEVEL_SETTINGS = [
  // Levels 1-5: Easy introduction
  { gridSize: 5, inputTime: 30, difficulty: 'easy' },    // Level 1
  { gridSize: 5, inputTime: 28, difficulty: 'easy' },    // Level 2
  { gridSize: 6, inputTime: 30, difficulty: 'easy' },    // Level 3
  { gridSize: 6, inputTime: 28, difficulty: 'easy' },    // Level 4
  { gridSize: 7, inputTime: 30, difficulty: 'easy' },    // Level 5

  // Levels 6-10: Medium challenge
  { gridSize: 7, inputTime: 28, difficulty: 'medium' },  // Level 6
  { gridSize: 8, inputTime: 30, difficulty: 'medium' },  // Level 7
  { gridSize: 8, inputTime: 28, difficulty: 'medium' },  // Level 8
  { gridSize: 9, inputTime: 30, difficulty: 'medium' },  // Level 9
  { gridSize: 9, inputTime: 28, difficulty: 'medium' },  // Level 10

  // Levels 11-15: Harder progression
  { gridSize: 10, inputTime: 30, difficulty: 'hard' },   // Level 11
  { gridSize: 10, inputTime: 28, difficulty: 'hard' },    // Level 12
  { gridSize: 11, inputTime: 30, difficulty: 'hard' },    // Level 13
  { gridSize: 11, inputTime: 28, difficulty: 'hard' },   // Level 14
  { gridSize: 12, inputTime: 30, difficulty: 'hard' },   // Level 15

  // Levels 16-20: Advanced challenge
  { gridSize: 12, inputTime: 28, difficulty: 'hard' },    // Level 16
  { gridSize: 13, inputTime: 30, difficulty: 'hard' },  // Level 17
  { gridSize: 13, inputTime: 28, difficulty: 'hard' },  // Level 18
  { gridSize: 14, inputTime: 30, difficulty: 'hard' },  // Level 19
  { gridSize: 14, inputTime: 28, difficulty: 'hard' },   // Level 20

  // Levels 21-25: Expert level
  { gridSize: 15, inputTime: 30, difficulty: 'expert' }, // Level 21
  { gridSize: 15, inputTime: 28, difficulty: 'expert' }, // Level 22
  { gridSize: 16, inputTime: 30, difficulty: 'expert' }, // Level 23
  { gridSize: 16, inputTime: 28, difficulty: 'expert' }, // Level 24
  { gridSize: 17, inputTime: 30, difficulty: 'expert' }, // Level 25

  // Levels 26-30: Master level
  { gridSize: 17, inputTime: 28, difficulty: 'expert' }, // Level 26
  { gridSize: 18, inputTime: 30, difficulty: 'expert' }, // Level 27
  { gridSize: 18, inputTime: 28, difficulty: 'expert' }, // Level 28
  { gridSize: 19, inputTime: 30, difficulty: 'expert' }, // Level 29
  { gridSize: 19, inputTime: 28, difficulty: 'expert' }, // Level 30
]

export default function MazeNavigationPage() {
  const { t } = useTranslation()
  const { addSession, darkMode } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [maze, setMaze] = useState<boolean[][]>([])
  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 })
  const [endPos, setEndPos] = useState<Position>({ x: 0, y: 0 })
  const [timeLeft, setTimeLeft] = useState(0)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [moves, setMoves] = useState(0)

  const settings = LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)]

  const getLevelScore = (movesTaken: number) => {
    const baseScore = 500 + (level * 30)
    const movePenalty = movesTaken * 10
    const timeBonus = timeLeft * 15
    return Math.max(0, baseScore - movePenalty + timeBonus)
  }

  const generateMaze = useCallback(() => {
    const size = settings.gridSize
    const newMaze: boolean[][] = []

    // Initialize maze with all walls
    for (let i = 0; i < size; i++) {
      newMaze[i] = []
      for (let j = 0; j < size; j++) {
        newMaze[i][j] = true
      }
    }

    // Simple maze generation using randomized DFS
    const stack: Position[] = []
    const start: Position = { x: 0, y: 0 }
    newMaze[start.y][start.x] = false
    stack.push(start)

    while (stack.length > 0) {
      const current = stack[stack.length - 1]
      const neighbors: Position[] = []

      const directions = [
        { dx: 0, dy: -2 },
        { dx: 2, dy: 0 },
        { dx: 0, dy: 2 },
        { dx: -2, dy: 0 }
      ]

      for (const dir of directions) {
        const nx = current.x + dir.dx
        const ny = current.y + dir.dy

        if (nx >= 0 && nx < size && ny >= 0 && ny < size && newMaze[ny][nx]) {
          neighbors.push({ x: nx, y: ny })
        }
      }

      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)]
        newMaze[current.y + (next.y - current.y) / 2][current.x + (next.x - current.x) / 2] = false
        newMaze[next.y][next.x] = false
        stack.push(next)
      } else {
        stack.pop()
      }
    }

    // Set end position
    const end: Position = { x: size - 1, y: size - 1 }
    newMaze[end.y][end.x] = false

    return { maze: newMaze, start, end }
  }, [settings.gridSize])

  const startGame = () => {
    setScore(0)
    setTotalScore(0)
    setLevel(1)
    startLevel()
  }

  const startLevel = () => {
    const { maze: newMaze, start, end } = generateMaze()
    setMaze(newMaze)
    setPlayerPos(start)
    setEndPos(end)
    setMoves(0)
    setTimeLeft(settings.inputTime)
    setGameState('playing')
  }

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (gameState !== 'playing') return

    const newX = playerPos.x + dx
    const newY = playerPos.y + dy

    if (
      newX >= 0 &&
      newX < settings.gridSize &&
      newY >= 0 &&
      newY < settings.gridSize &&
      !maze[newY][newX]
    ) {
      const newPlayerPos = { x: newX, y: newY }
      setPlayerPos(newPlayerPos)
      setMoves(prev => prev + 1)

      // Check if reached end
      if (newX === endPos.x && newY === endPos.y) {
        const levelScore = Math.round(getLevelScore(moves + 1))
        setScore(levelScore)
        setGameState('levelComplete')
      }
    }
  }, [gameState, playerPos, maze, settings.gridSize, endPos, moves])

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

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          movePlayer(0, -1)
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          movePlayer(0, 1)
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          movePlayer(-1, 0)
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          movePlayer(1, 0)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameState, movePlayer])

  const nextLevel = () => {
    const levelScore = score
    setTotalScore(prev => prev + levelScore)

    if (level >= MAX_LEVELS) {
      addSession({
        id: Date.now().toString(),
        gameId: 'maze-navigation',
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
    <div className={`min-h-screen p-3 md:p-4 lg:p-8 transition-colors duration-300 ${darkMode ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" : "bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 p-4 md:p-8"}`}>
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
          {t('mazeNavigation.title', 'Maze Navigation')}
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-8">
          {t('mazeNavigation.description', 'Navigate through the maze to the exit!')}
        </p>

        {/* Menu */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2">
              {t('mazeNavigation.level', 'Level')} {level}
            </h2>
            {level > 1 && (
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 font-medium">
                {t('mazeNavigation.totalScore', 'Total Score')}: <span className="text-slate-600 dark:text-gray-300 font-bold">{totalScore}</span>
              </p>
            )}
            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">{t('mazeNavigation.levelInfo', 'Level Settings')}:</h3>
              <ul className="text-gray-700 dark:text-gray-300 space-y-1 font-medium">
                <li>• {t('mazeNavigation.gridSize', 'Grid Size')}: {settings.gridSize}x{settings.gridSize}</li>
                <li>• {t('mazeNavigation.inputTime', 'Time Limit')}: {settings.inputTime}s</li>
              </ul>
            </div>
            <button
              onClick={startLevel}
              className="bg-gradient-to-r from-slate-500 to-gray-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-slate-600 hover:to-gray-600 shadow-lg transition-all w-full"
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
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('mazeNavigation.level', 'Level')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-600 dark:text-slate-200">{level}/{MAX_LEVELS}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('mazeNavigation.moves', 'Moves')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-600 dark:text-slate-200">{moves}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('mazeNavigation.timeLeft', 'Time Left')}</p>
                  <p className={`text-2xl md:text-3xl lg:text-4xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-slate-600 dark:text-slate-200'}`}>
                    {timeLeft}s
                  </p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((level - 1) / MAX_LEVELS) * 100}%` }}
                  className="bg-gradient-to-r from-slate-500 to-gray-500 h-full"
                />
              </div>
            </div>

            {/* Maze */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {t('mazeNavigation.controls', 'Use Arrow Keys or WASD to move')}
              </p>
              <div className="grid gap-1 max-w-md mx-auto" style={{
                gridTemplateColumns: `repeat(${settings.gridSize}, minmax(0, 1fr))`
              }}>
                {maze.map((row, y) =>
                  row.map((isWall, x) => (
                    <motion.div
                      key={`${x}-${y}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (x + y) * 0.02 }}
                      className={`aspect-square rounded-lg ${
                        isWall
                          ? 'bg-slate-700 dark:bg-slate-600'
                          : 'bg-slate-100 dark:bg-slate-700'
                      } ${playerPos.x === x && playerPos.y === y ? 'bg-blue-500' : ''} ${
                        endPos.x === x && endPos.y === y ? 'bg-green-500' : ''
                      }`}
                    >
                      {playerPos.x === x && playerPos.y === y && (
                        <span className="text-white text-sm md:text-base lg:text-lg">🧍</span>
                      )}
                      {endPos.x === x && endPos.y === y && (
                        <span className="text-white text-sm md:text-base lg:text-lg">🚪</span>
                      )}
                    </motion.div>
                  ))
                )}
              </div>

              {/* Mobile Controls */}
              <div className="mt-6 flex justify-center">
                <div className="grid grid-cols-3 gap-2">
                  <div></div>
                  <motion.button
                    onClick={() => movePlayer(0, -1)}
                    className="w-16 h-16 bg-slate-200 rounded-xl hover:bg-slate-300 active:bg-slate-400 transition-colors text-lg md:text-xl lg:text-2xl font-bold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ↑
                  </motion.button>
                  <div></div>
                  <motion.button
                    onClick={() => movePlayer(-1, 0)}
                    className="w-16 h-16 bg-slate-200 rounded-xl hover:bg-slate-300 active:bg-slate-400 transition-colors text-lg md:text-xl lg:text-2xl font-bold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ←
                  </motion.button>
                  <motion.button
                    onClick={() => movePlayer(0, 1)}
                    className="w-16 h-16 bg-slate-200 rounded-xl hover:bg-slate-300 active:bg-slate-400 transition-colors text-lg md:text-xl lg:text-2xl font-bold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ↓
                  </motion.button>
                  <motion.button
                    onClick={() => movePlayer(1, 0)}
                    className="w-16 h-16 bg-slate-200 rounded-xl hover:bg-slate-300 active:bg-slate-400 transition-colors text-lg md:text-xl lg:text-2xl font-bold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    →
                  </motion.button>
                </div>
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-600 dark:text-white mb-4">
              {t('mazeNavigation.level', 'Level')} {level} {t('mazeNavigation.levelComplete', 'Complete!')}
            </h2>
            <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('mazeNavigation.moves', 'Moves')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-600 dark:text-white">{moves}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('mazeNavigation.levelScore', 'Level Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-600 dark:text-white">{score}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('mazeNavigation.totalScore', 'Total Score')}</p>
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-600 dark:text-white">{totalScore + score}</p>
              </div>
            </div>
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-slate-500 to-gray-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-slate-600 hover:to-gray-600 shadow-lg transition-all w-full mb-3"
            >
              {level < MAX_LEVELS ? `${t('mazeNavigation.nextLevel', 'Next Level')} ${level + 1}` : t('mazeNavigation.finalScore', 'View Final Score')}
            </button>
            <button
              onClick={startGame}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white font-medium"
            >
              {t('mazeNavigation.restart', 'Restart from Level 1')}
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4">{t('mazeNavigation.timeUp', 'Time is up!')}</h2>
            <div className="bg-orange-50 dark:bg-slate-700 rounded-xl p-6 mb-6">
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('mazeNavigation.totalScore', 'Total Score')}</p>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600 dark:text-orange-400">{totalScore}</p>
            </div>
            <button
              onClick={startLevel}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-red-600 shadow-lg transition-all w-full mb-3"
            >
              {t('tryAgain', 'Try Again')}
            </button>
            <button
              onClick={startGame}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white font-medium"
            >
              {t('mazeNavigation.restart', 'Restart from Level 1')}
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-600 dark:text-white mb-4">{t('mazeNavigation.victory', 'Congratulations!')}</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 font-medium mb-6">
              {t('mazeNavigation.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6 mb-6">
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('mazeNavigation.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-slate-600 dark:text-white">{totalScore + score}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-slate-500 to-gray-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-slate-600 hover:to-gray-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
