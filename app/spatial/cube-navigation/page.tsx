'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

import { SettingsPanel } from "@/components/SettingsPanel"
const MAX_LEVELS = 30

type CubeCell = {
  x: number
  y: number
  z: number
  isPath: boolean
  isVisited: boolean
  isObstacle: boolean
  isGoal: boolean
  isStart: boolean
}

type CubeLevel = {
  id: number
  size: number
  start: { x: number; y: number; z: number }
  goal: { x: number; y: number; z: number }
  cells: CubeCell[]
  maxMoves: number
}

const LEVEL_SETTINGS = [
  // Levels 1-5: Easy introduction
  { cubeSize: 2, obstacles: 0, timeLimit: 45, difficulty: 'easy' },
  { cubeSize: 2, obstacles: 1, timeLimit: 42, difficulty: 'easy' },
  { cubeSize: 3, obstacles: 2, timeLimit: 50, difficulty: 'easy' },
  { cubeSize: 3, obstacles: 3, timeLimit: 48, difficulty: 'easy' },
  { cubeSize: 3, obstacles: 4, timeLimit: 52, difficulty: 'easy' },

  // Levels 6-10: Medium challenge
  { cubeSize: 3, obstacles: 5, timeLimit: 48, difficulty: 'medium' },
  { cubeSize: 3, obstacles: 6, timeLimit: 52, difficulty: 'medium' },
  { cubeSize: 4, obstacles: 8, timeLimit: 58, difficulty: 'medium' },
  { cubeSize: 4, obstacles: 10, timeLimit: 56, difficulty: 'medium' },
  { cubeSize: 4, obstacles: 12, timeLimit: 60, difficulty: 'medium' },

  // Levels 11-15: Harder progression
  { cubeSize: 4, obstacles: 14, timeLimit: 56, difficulty: 'hard' },
  { cubeSize: 4, obstacles: 16, timeLimit: 60, difficulty: 'hard' },
  { cubeSize: 4, obstacles: 18, timeLimit: 64, difficulty: 'hard' },
  { cubeSize: 5, obstacles: 20, timeLimit: 70, difficulty: 'hard' },
  { cubeSize: 5, obstacles: 22, timeLimit: 68, difficulty: 'hard' },

  // Levels 16-20: Advanced challenge
  { cubeSize: 5, obstacles: 24, timeLimit: 66, difficulty: 'hard' },
  { cubeSize: 5, obstacles: 26, timeLimit: 72, difficulty: 'hard' },
  { cubeSize: 5, obstacles: 28, timeLimit: 70, difficulty: 'hard' },
  { cubeSize: 5, obstacles: 30, timeLimit: 76, difficulty: 'hard' },
  { cubeSize: 5, obstacles: 32, timeLimit: 74, difficulty: 'hard' },

  // Levels 21-25: Expert level
  { cubeSize: 5, obstacles: 34, timeLimit: 72, difficulty: 'expert' },
  { cubeSize: 5, obstacles: 36, timeLimit: 78, difficulty: 'expert' },
  { cubeSize: 5, obstacles: 38, timeLimit: 76, difficulty: 'expert' },
  { cubeSize: 5, obstacles: 40, timeLimit: 82, difficulty: 'expert' },
  { cubeSize: 5, obstacles: 42, timeLimit: 80, difficulty: 'expert' },

  // Levels 26-30: Master level
  { cubeSize: 5, obstacles: 44, timeLimit: 78, difficulty: 'expert' },
  { cubeSize: 5, obstacles: 46, timeLimit: 84, difficulty: 'expert' },
  { cubeSize: 5, obstacles: 48, timeLimit: 82, difficulty: 'expert' },
  { cubeSize: 5, obstacles: 50, timeLimit: 88, difficulty: 'expert' },
  { cubeSize: 5, obstacles: 52, timeLimit: 86, difficulty: 'expert' },
]

export default function CubeNavigationPage() {
  const { t } = useTranslation()
  const { addSession, darkMode } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [levels, setLevels] = useState<CubeLevel[]>([])
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0, z: 0 })
  const [moves, setMoves] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [levelWon, setLevelWon] = useState(false)

  const settings = LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)]

  const getLevelScore = (movesUsed: number, maxMoves: number) => {
    const efficiencyBonus = Math.max(0, (maxMoves - movesUsed) / maxMoves) * 500
    const timeBonus = timeLeft * 10
    return Math.round(500 + efficiencyBonus + timeBonus)
  }

  const generateCubeLevel = (id: number): CubeLevel => {
    const size = settings.cubeSize
    const cells: CubeCell[] = []
    const maxMoves = size * 2 + 5

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        for (let z = 0; z < size; z++) {
          cells.push({
            x, y, z,
            isPath: true,
            isVisited: false,
            isObstacle: false,
            isGoal: false,
            isStart: false
          })
        }
      }
    }

    // Set start and goal
    const start = { x: 0, y: 0, z: 0 }
    const goal = { x: size - 1, y: size - 1, z: size - 1 }

    cells.forEach(cell => {
      if (cell.x === start.x && cell.y === start.y && cell.z === start.z) {
        cell.isStart = true
      }
      if (cell.x === goal.x && cell.y === goal.y && cell.z === goal.z) {
        cell.isGoal = true
      }
    })

    // Add obstacles
    let obstaclesPlaced = 0
    while (obstaclesPlaced < settings.obstacles) {
      const randomCell = cells[Math.floor(Math.random() * cells.length)]
      if (!randomCell.isStart && !randomCell.isGoal && !randomCell.isObstacle) {
        randomCell.isObstacle = true
        obstaclesPlaced++
      }
    }

    return {
      id,
      size,
      start,
      goal,
      cells,
      maxMoves
    }
  }

  const generateLevels = useCallback(() => {
    const newLevels: CubeLevel[] = []
    for (let i = 0; i < 5; i++) {
      newLevels.push(generateCubeLevel(i))
    }
    return newLevels
  }, [settings])

  const startGame = () => {
    setScore(0)
    setTotalScore(0)
    setLevel(1)
    startLevel()
  }

  const startLevel = () => {
    const newLevels = generateLevels()
    setLevels(newLevels)
    setCurrentLevelIndex(0)
    setShowResult(false)
    setLevelWon(false)
    setTimeLeft(settings.timeLimit)
    startCubeLevel()
  }

  const startCubeLevel = () => {
    const currentLevel = levels[currentLevelIndex]
    if (!currentLevel) return

    const resetCells = currentLevel.cells.map(cell => ({
      ...cell,
      isVisited: cell.isStart
    }))

    setLevels(prev => prev.map((level, idx) => 
      idx === currentLevelIndex ? { ...level, cells: resetCells } : level
    ))

    setPlayerPosition({ ...currentLevel.start })
    setMoves(0)
    setGameState('playing')
  }

  const canMove = (x: number, y: number, z: number): boolean => {
    const currentLevel = levels[currentLevelIndex]
    if (!currentLevel) return false

    const cell = currentLevel.cells.find(c => c.x === x && c.y === y && c.z === z)
    return cell !== undefined && !cell.isObstacle
  }

  const movePlayer = (dx: number, dy: number, dz: number) => {
    if (gameState !== 'playing' || showResult) return

    const newX = playerPosition.x + dx
    const newY = playerPosition.y + dy
    const newZ = playerPosition.z + dz

    if (canMove(newX, newY, newZ)) {
      const currentLevel = levels[currentLevelIndex]
      const updatedCells = currentLevel.cells.map(cell => {
        if (cell.x === newX && cell.y === newY && cell.z === newZ) {
          return { ...cell, isVisited: true }
        }
        return cell
      })

      setLevels(prev => prev.map((level, idx) => 
        idx === currentLevelIndex ? { ...level, cells: updatedCells } : level
      ))

      setPlayerPosition({ x: newX, y: newY, z: newZ })
      setMoves(prev => prev + 1)

      const goalCell = currentLevel.cells.find(c => c.x === newX && c.y === newY && c.z === newZ)
      if (goalCell?.isGoal) {
        const levelScore = getLevelScore(moves + 1, currentLevel.maxMoves)
        setScore(levelScore)
        setLevelWon(true)
        setShowResult(true)
      } else if (moves + 1 >= currentLevel.maxMoves) {
        setScore(0)
        setLevelWon(false)
        setShowResult(true)
      }
    }
  }

  const handleNext = () => {
    setShowResult(false)
    
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(prev => prev + 1)
      setTimeout(() => startCubeLevel(), 100)
    } else {
      setGameState('levelComplete')
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (gameState === 'playing' && timeLeft > 0 && !showResult) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (gameState === 'playing' && timeLeft === 0 && !showResult) {
      setScore(0)
      setLevelWon(false)
      setShowResult(true)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [gameState, timeLeft, showResult])

  const nextLevel = () => {
    const levelScore = score
    setTotalScore(prev => prev + levelScore)

    if (level >= MAX_LEVELS) {
      addSession({
        id: Date.now().toString(),
        gameId: 'cube-navigation',
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

  const currentCube = levels[currentLevelIndex]

  const renderCubeSlice = (z: number) => {
    if (!currentCube) return null

    const sliceCells = currentCube.cells.filter(cell => cell.z === z)

    return (
      <div key={z} className="mb-4">
        <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'} mb-2`}>
          {t('cubeNavigation.layer', 'Layer')} {z + 1}
        </p>
        <div 
          className="inline-grid gap-1"
          style={{ gridTemplateColumns: `repeat(${currentCube.size}, 1fr)` }}
        >
          {sliceCells.map(cell => (
            <motion.div
              key={`${cell.x}-${cell.y}-${cell.z}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-2 flex items-center justify-center font-bold text-sm cursor-pointer transition-all
                ${cell.isStart ? 'bg-green-50 dark:bg-slate-7000 border-green-600 text-white' : ''}
                ${cell.isGoal ? 'bg-yellow-50 dark:bg-slate-7000 border-yellow-600 text-white' : ''}
                ${cell.isObstacle ? 'bg-gray-700 border-gray-800 text-white' : ''}
                ${!cell.isStart && !cell.isGoal && !cell.isObstacle ? (darkMode ? 'bg-slate-600 border-slate-700' : 'bg-gray-100 border-gray-300 dark:border-gray-500') : ''}
                ${cell.isVisited && !cell.isStart && !cell.isGoal ? 'bg-blue-200 border-blue-300 dark:bg-blue-800 dark:border-blue-900' : ''}
                ${playerPosition.x === cell.x && playerPosition.y === cell.y && playerPosition.z === cell.z ? 'ring-4 ring-blue-500' : ''}
              `}
            >
              {cell.isStart && 'S'}
              {cell.isGoal && 'G'}
              {cell.isObstacle && '✕'}
              {playerPosition.x === cell.x && playerPosition.y === cell.y && playerPosition.z === cell.z && !cell.isStart && !cell.isGoal && '●'}
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800'} p-4 md:p-8`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link
          href="/spatial"
          className={`inline-flex items-center ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium mb-6 text-sm md:text-base lg:text-lg`}
        >
          <span className="mr-2">←</span> {t('back', 'Back')}
        </Link>

        <h1 className={`text-3xl md:text-2xl md:text-3xl lg:text-4xl font-bold ${darkMode ? 'text-slate-50' : 'text-gray-800'} mb-2`}>
          {t('cubeNavigation.title', 'Cube Navigation')}
        </h1>
        <p className={`text-sm md:text-base lg:text-lg ${darkMode ? 'text-slate-300' : 'text-gray-700'} font-medium mb-8`}>
          {t('cubeNavigation.description', 'Navigate through the 3D cube to reach the goal!')}
        </p>

        {/* Menu */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-8 text-center`}
          >
            <h2 className={`text-xl md:text-2xl lg:text-3xl font-bold ${darkMode ? 'text-slate-50' : 'text-gray-800'} mb-2`}>
              Level {level}
            </h2>
            {level > 1 && (
              <p className={`text-sm md:text-base lg:text-lg ${darkMode ? 'text-slate-300' : 'text-gray-700'} mb-4 font-medium`}>
                Total Score: <span className="text-orange-600 font-bold">{totalScore}</span>
              </p>
            )}
            <div className={`rounded-xl p-4 mb-6 text-left ${darkMode ? 'bg-slate-700' : 'bg-orange-50 dark:bg-slate-700'}`}>
              <h3 className={`font-bold ${darkMode ? 'text-slate-50' : 'text-gray-800'} mb-2`}>{t('cubeNavigation.levelInfo', 'Level Settings')}:</h3>
              <ul className={`space-y-1 font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <li>• {t('cubeNavigation.cubeSize', 'Cube Size')}: {settings.cubeSize}x{settings.cubeSize}x{settings.cubeSize}</li>
                <li>• {t('cubeNavigation.obstacles', 'Obstacles')}: {settings.obstacles}</li>
                <li>• {t('cubeNavigation.timeLimit', 'Time Limit')}: {settings.timeLimit}s</li>
              </ul>
            </div>
            <button
              onClick={startLevel}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-amber-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Playing */}
        {gameState === 'playing' && currentCube && (
          <>
            {/* Stats */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-6 mb-6`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('cubeNavigation.level', 'Level')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">
                    {currentLevelIndex + 1}/{levels.length}
                  </p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('cubeNavigation.moves', 'Moves')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-amber-600">
                    {moves}/{currentCube.maxMoves}
                  </p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('cubeNavigation.score', 'Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">{totalScore}</p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('cubeNavigation.timeLeft', 'Time Left')}</p>
                  <p className={`text-2xl md:text-3xl lg:text-4xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-orange-600'}`}>
                    {timeLeft}s
                  </p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 dark:bg-slate-600 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentLevelIndex) / levels.length) * 100}%` }}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-full"
                />
              </div>
            </div>

            {/* Cube display */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-8 mb-6`}>
              <p className={`text-lg md:text-xl lg:text-2xl font-bold ${darkMode ? 'text-slate-50' : 'text-gray-800'} mb-4 text-center`}>
                {t('cubeNavigation.navigateToGoal', 'Navigate to the Goal (G)!')}
              </p>
              
              <div className="flex justify-center overflow-x-auto pb-4">
                <div className="flex flex-col">
                  {Array.from({ length: currentCube.size }, (_, i) => renderCubeSlice(i))}
                </div>
              </div>

              {/* Current position */}
              <div className={`mt-6 text-center ${darkMode ? 'bg-slate-700' : 'bg-orange-50 dark:bg-slate-700'} rounded-xl p-4`}>
                <p className={`font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  {t('cubeNavigation.currentPosition', 'Current Position')}: ({playerPosition.x}, {playerPosition.y}, {playerPosition.z})
                </p>
              </div>
            </div>

            {/* Controls */}
            {!showResult && (
              <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-8`}>
                <p className={`text-xl font-bold ${darkMode ? 'text-slate-50' : 'text-gray-800'} mb-4 text-center`}>
                  {t('cubeNavigation.useControls', 'Use controls to move')}
                </p>
                
                <div className="max-w-sm mx-auto">
                  {/* Y-axis controls */}
                  <div className="flex justify-center mb-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => movePlayer(0, 1, 0)}
                      className="w-16 h-16 bg-gradient-to-b from-orange-400 to-orange-600 text-white rounded-xl shadow-lg text-lg md:text-xl lg:text-2xl font-bold"
                    >
                      ↑
                    </motion.button>
                  </div>
                  
                  <div className="flex justify-center gap-4 mb-4">
                    {/* X-axis controls */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => movePlayer(-1, 0, 0)}
                      className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-xl shadow-lg text-lg md:text-xl lg:text-2xl font-bold"
                    >
                      ←
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => movePlayer(1, 0, 0)}
                      className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-xl shadow-lg text-lg md:text-xl lg:text-2xl font-bold"
                    >
                      →
                    </motion.button>
                  </div>
                  
                  {/* Y-axis down */}
                  <div className="flex justify-center mb-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => movePlayer(0, -1, 0)}
                      className="w-16 h-16 bg-gradient-to-t from-orange-400 to-orange-600 text-white rounded-xl shadow-lg text-lg md:text-xl lg:text-2xl font-bold"
                    >
                      ↓
                    </motion.button>
                  </div>
                  
                  {/* Z-axis controls */}
                  <div className="flex justify-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => movePlayer(0, 0, -1)}
                      className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-xl shadow-lg text-xl font-bold"
                    >
                      Z↓
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => movePlayer(0, 0, 1)}
                      className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-xl shadow-lg text-xl font-bold"
                    >
                      Z↑
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            {/* Result */}
            {showResult && (
              <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-8 text-center`}>
                <div className="text-6xl mb-4">
                  {levelWon ? '✅' : '❌'}
                </div>
                <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ${levelWon ? 'text-green-500' : 'text-red-500'}`}>
                  {levelWon ? t('cubeNavigation.goalReached', 'Goal Reached!') : t('cubeNavigation.failed', 'Failed!')}
                </h2>
                {levelWon && (
                  <div className={`rounded-xl p-6 mb-6 ${darkMode ? 'bg-slate-700' : 'bg-green-50 dark:bg-slate-700'}`}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('cubeNavigation.movesUsed', 'Moves Used')}</p>
                        <p className="text-xl md:text-2xl lg:text-3xl font-bold text-green-600">{moves}</p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('cubeNavigation.levelScore', 'Level Score')}</p>
                        <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">{score}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-3 justify-center">
                  {!levelWon && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setShowResult(false)
                        startCubeLevel()
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white text-lg font-bold py-2 px-6 rounded-xl shadow-lg transition-all"
                    >
                      {t('cubeNavigation.retry', 'Retry')}
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-lg font-bold py-2 px-6 rounded-xl hover:from-orange-600 hover:to-amber-600 shadow-lg transition-all"
                  >
                    {currentLevelIndex < levels.length - 1
                      ? t('cubeNavigation.nextLevel', 'Next Level')
                      : t('cubeNavigation.seeResults', 'See Results')}
                  </motion.button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Level Complete */}
        {gameState === 'levelComplete' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-8 text-center`}
          >
            <div className="text-6xl mb-4">
              {totalScore > 0 ? '✅' : '❌'}
            </div>
            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ${totalScore > 0 ? 'text-orange-600' : 'text-red-500'}`}>
              {totalScore > 0 ? `Level ${level} Complete!` : 'Level Failed!'}
            </h2>
            {totalScore > 0 ? (
              <div className={`rounded-xl p-6 mb-6 ${darkMode ? 'bg-slate-700' : 'bg-orange-50 dark:bg-slate-700'}`}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('cubeNavigation.levelScore', 'Level Score')}</p>
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">{score}</p>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('cubeNavigation.totalScore', 'Total Score')}</p>
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-amber-600">{totalScore + score}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`rounded-xl p-6 mb-6 ${darkMode ? 'bg-red-900/30' : 'bg-red-50 dark:bg-slate-700'}`}>
                <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('cubeNavigation.levelScore', 'Level Score')}</p>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-red-500">{score}</p>
              </div>
            )}
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-amber-600 shadow-lg transition-all w-full mb-3"
            >
              {level < MAX_LEVELS ? `Next Level ${level + 1}` : 'View Final Score'}
            </button>
            <button
              onClick={startGame}
              className={darkMode ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}
            >
              {t('cubeNavigation.restart', 'Restart from Level 1')}
            </button>
          </motion.div>
        )}

        {/* Victory */}
        {gameState === 'victory' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-8 text-center`}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-orange-600 mb-4">{t('cubeNavigation.victory', 'Congratulations!')}</h2>
            <p className={`text-xl ${darkMode ? 'text-slate-300' : 'text-gray-700'} font-medium mb-6`}>
              {t('cubeNavigation.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className={`rounded-xl p-6 mb-6 ${darkMode ? 'bg-slate-700' : 'bg-orange-50 dark:bg-slate-700'}`}>
              <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('cubeNavigation.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-orange-600">{totalScore + score}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-amber-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
