'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

import { SettingsPanel } from "@/components/SettingsPanel"
const MAX_LEVELS = 30

const LEVEL_SETTINGS = [
  { objectCount: 4, duration: 15, speed: 1, timeLimit: 30 },  // Level 1
  { objectCount: 4, duration: 15, speed: 1, timeLimit: 25 },  // Level 2
  { objectCount: 5, duration: 18, speed: 1.2, timeLimit: 25 },  // Level 3
  { objectCount: 5, duration: 18, speed: 1.2, timeLimit: 20 },  // Level 4
  { objectCount: 6, duration: 20, speed: 1.4, timeLimit: 20 },  // Level 5
  { objectCount: 6, duration: 20, speed: 1.4, timeLimit: 18 },  // Level 6
  { objectCount: 7, duration: 22, speed: 1.6, timeLimit: 18 },  // Level 7
  { objectCount: 7, duration: 22, speed: 1.6, timeLimit: 15 },  // Level 8
  { objectCount: 8, duration: 25, speed: 1.8, timeLimit: 15 },  // Level 9
  { objectCount: 8, duration: 25, speed: 1.8, timeLimit: 12 },  // Level 10
  { objectCount: 9, duration: 28, speed: 2, timeLimit: 12 },  // Level 11
  { objectCount: 9, duration: 28, speed: 2, timeLimit: 10 },  // Level 12
  { objectCount: 10, duration: 30, speed: 2.2, timeLimit: 10 },  // Level 13
  { objectCount: 10, duration: 30, speed: 2.2, timeLimit: 8 },  // Level 14
  { objectCount: 11, duration: 32, speed: 2.4, timeLimit: 8 },  // Level 15
  { objectCount: 11, duration: 32, speed: 2.4, timeLimit: 7 },  // Level 16
  { objectCount: 12, duration: 35, speed: 2.6, timeLimit: 7 },  // Level 17
  { objectCount: 12, duration: 35, speed: 2.6, timeLimit: 6 },  // Level 18
  { objectCount: 13, duration: 38, speed: 2.8, timeLimit: 6 },  // Level 19
  { objectCount: 13, duration: 38, speed: 2.8, timeLimit: 5 },  // Level 20
  { objectCount: 14, duration: 40, speed: 3, timeLimit: 5 },  // Level 21
  { objectCount: 14, duration: 40, speed: 3, timeLimit: 4 },  // Level 22
  { objectCount: 15, duration: 42, speed: 3.2, timeLimit: 4 },  // Level 23
  { objectCount: 15, duration: 42, speed: 3.2, timeLimit: 3 },  // Level 24
  { objectCount: 16, duration: 45, speed: 3.4, timeLimit: 3 },  // Level 25
  { objectCount: 16, duration: 45, speed: 3.4, timeLimit: 3 },  // Level 26
  { objectCount: 17, duration: 48, speed: 3.6, timeLimit: 2.5 },  // Level 27
  { objectCount: 17, duration: 48, speed: 3.6, timeLimit: 2.5 },  // Level 28
  { objectCount: 18, duration: 50, speed: 3.8, timeLimit: 2 },  // Level 29
  { objectCount: 18, duration: 50, speed: 4, timeLimit: 2 },  // Level 30
]

const SHAPES = ['⭐', '🔷', '🔶', '💎', '🌟', '🔴', '🟢', '🔵', '🟣', '⬜']

interface MovingObject {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  shape: string
  isTarget: boolean
}

export default function FocusTrackerPage() {
  const { t } = useTranslation()
  const { addSession, darkMode } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'tracking' | 'guessing' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [trackingTime, setTrackingTime] = useState(0)
  const [objects, setObjects] = useState<MovingObject[]>([])
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null)

  const settings = useMemo(
    () => LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)],
    [level]
  )

  const getLevelScore = useCallback(() => {
    const baseScore = level * 50
    return baseScore
  }, [level])

  const generateObjects = useCallback(() => {
    const objectCount = settings.objectCount
    const newObjects: MovingObject[] = []

    // Pick target shape
    const targetShape = SHAPES[Math.floor(Math.random() * SHAPES.length)]

    for (let i = 0; i < objectCount; i++) {
      const angle = (Math.PI * 2 * i) / objectCount
      const radius = 30 + Math.random() * 20
      newObjects.push({
        id: i,
        x: 50 + Math.cos(angle) * radius,
        y: 50 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * settings.speed,
        vy: (Math.random() - 0.5) * settings.speed,
        shape: targetShape,
        isTarget: i === 0
      })
    }

    return newObjects
  }, [settings])

  const updateObjects = useCallback(() => {
    setObjects(prev => prev.map(obj => {
      let newX = obj.x + obj.vx
      let newY = obj.y + obj.vy

      // Bounce off walls
      if (newX < 5 || newX > 95) obj.vx *= -1
      if (newY < 5 || newY > 95) obj.vy *= -1

      return {
        ...obj,
        x: Math.max(5, Math.min(95, newX)),
        y: Math.max(5, Math.min(95, newY))
      }
    }))
  }, [])

  const generateLevel = useCallback(() => {
    const timeLimit = LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)].timeLimit
    setTimeLeft(timeLimit)
    setTrackingTime(settings.duration)
    setObjects(generateObjects())
    setSelectedTarget(null)
  }, [level, settings.duration, generateObjects])

  const handleObjectClick = useCallback((obj: MovingObject) => {
    if (gameState !== 'guessing') return

    setSelectedTarget(obj.id)

    if (obj.isTarget) {
      const levelScore = Math.round(getLevelScore())
      setScore(levelScore)
      setGameState('levelComplete')
    } else {
      addSession({
        id: Date.now().toString(),
        gameId: 'focus-tracker',
        difficulty: 'medium',
        score: totalScore,
        completedAt: new Date(),
        durationSeconds: 0
      })
      setGameState('gameOver')
    }
  }, [gameState, getLevelScore, totalScore, addSession])

  const startGame = useCallback(() => {
    setScore(0)
    setTotalScore(0)
    setLevel(1)
    generateLevel()
    setGameState('tracking')
  }, [generateLevel])

  const nextLevel = useCallback(() => {
    const levelScore = Math.round(getLevelScore())
    setTotalScore(prev => prev + levelScore)

    if (level >= MAX_LEVELS) {
      addSession({
        id: Date.now().toString(),
        gameId: 'focus-tracker',
        difficulty: 'hard',
        score: totalScore + levelScore,
        completedAt: new Date(),
        durationSeconds: 0
      })
      setGameState('victory')
    } else {
      setLevel(prev => prev + 1)
      generateLevel()
      setGameState('tracking')
    }
  }, [level, totalScore, getLevelScore, addSession, generateLevel])

  // Animation loop for moving objects
  useEffect(() => {
    if (gameState !== 'tracking') return

    const interval = setInterval(updateObjects, 16) // ~60fps
    return () => clearInterval(interval)
  }, [gameState, updateObjects])

  // Tracking timer
  useEffect(() => {
    if (gameState !== 'tracking') return

    const timer = setInterval(() => {
      setTrackingTime(prev => {
        if (prev <= 1) {
          setGameState('guessing')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState])

  // Total time limit
  useEffect(() => {
    if ((gameState !== 'tracking' && gameState !== 'guessing') || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          addSession({
            id: Date.now().toString(),
            gameId: 'focus-tracker',
            difficulty: 'medium',
            score: totalScore,
            completedAt: new Date(),
            durationSeconds: 0
          })
          setGameState('gameOver')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState, timeLeft, totalScore, addSession])

  return (
    <div className={`min-h-screen p-3 md:p-4 lg:p-8 transition-colors duration-300 ${darkMode ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" : "bg-gradient-to-br from-violet-50 via-white to-purple-50 p-4 md:p-8"}`}">
      <SettingsPanel />
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link
          href="/attention"
          className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium mb-6 text-sm md:text-base lg:text-lg"
        >
          <span className="mr-2">←</span> {t('back', 'Back')}
        </Link>

        <h1 className="text-3xl md:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2">
          {t('focusTracker.title', 'Focus Tracker')}
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-8">
          {t('focusTracker.description', 'Track the target and identify it!')}
        </p>

        {/* Menu */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">👁️</div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Level {level}
            </h2>
            <div className="bg-violet-50 dark:bg-slate-800 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">{t('focusTracker.levelInfo', 'Level Settings')}:</h3>
              <ul className="text-gray-700 dark:text-gray-300 space-y-1 font-medium">
                <li>• {t('focusTracker.objects', 'Objects')}: {settings.objectCount}</li>
                <li>• {t('focusTracker.trackingTime', 'Track for')}: {settings.duration}s</li>
                <li>• {t('focusTracker.speed', 'Speed')}: {settings.speed.toFixed(1)}x</li>
                <li>• {t('focusTracker.timeLimit', 'Time Limit')}: {settings.timeLimit}s</li>
              </ul>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-violet-600 hover:to-purple-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Tracking Phase */}
        {(gameState === 'tracking' || gameState === 'guessing') && (
          <>
            {/* Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('focusTracker.level', 'Level')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-violet-600">{level}/{MAX_LEVELS}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('focusTracker.score', 'Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-600">{totalScore}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('focusTracker.timeLeft', 'Time')}</p>
                  <p className={`text-xl md:text-2xl lg:text-3xl font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-violet-600'}`}>{timeLeft}s</p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((level - 1) / MAX_LEVELS) * 100}%` }}
                  className="bg-gradient-to-r from-violet-500 to-purple-500 h-full"
                />
              </div>
            </div>

            {/* Status Display */}
            {gameState === 'tracking' && (
              <div className="bg-violet-100 rounded-2xl shadow-lg p-6 mb-6 text-center">
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-violet-700">
                  {t('focusTracker.trackTheObject', 'Watch carefully!')}
                </p>
                <p className="text-xl text-violet-600 mt-2">
                  {t('focusTracker.target', 'Target:')} {objects[0]?.shape} ({trackingTime}s)
                </p>
              </div>
            )}

            {gameState === 'guessing' && (
              <div className="bg-orange-100 rounded-2xl shadow-lg p-6 mb-6 text-center">
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-orange-700">
                  {t('focusTracker.whichWasIt', 'Which one was it?')}
                </p>
                <p className="text-xl text-orange-600 mt-2">
                  {t('focusTracker.clickTheTarget', 'Click the target!')}
                </p>
              </div>
            )}

            {/* Game Area */}
            <div className="bg-gray-100 dark:bg-slate-700 rounded-2xl shadow-lg p-4 mb-6 relative">
              <div className="relative w-full aspect-square">
                {objects.map((obj) => (
                  <motion.button
                    key={obj.id}
                    whileHover={{ scale: gameState === 'guessing' ? 1.15 : 1 }}
                    whileTap={{ scale: gameState === 'guessing' ? 0.9 : 1 }}
                    onClick={() => handleObjectClick(obj)}
                    disabled={gameState !== 'guessing'}
                    className={`absolute text-3xl md:text-4xl transition-all ${
                      gameState === 'guessing' ? 'cursor-pointer' : 'cursor-default'
                    } ${selectedTarget === obj.id ? 'opacity-50' : ''}`}
                    style={{
                      left: `${obj.x}%`,
                      top: `${obj.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {selectedTarget === obj.id ? '?' : obj.shape}
                  </motion.button>
                ))}
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-violet-600 mb-4">Level {level} Complete!</h2>
            <div className="bg-violet-50 dark:bg-slate-800 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('focusTracker.levelScore', 'Level Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-violet-600">{Math.round(score)}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('focusTracker.totalScore', 'Total Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-600">{totalScore + Math.round(score)}</p>
                </div>
              </div>
            </div>
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-violet-600 hover:to-purple-600 shadow-lg transition-all w-full"
            >
              {level < MAX_LEVELS ? `Next Level ${level + 1}` : 'View Final Score'}
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
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4">{t('focusTracker.gameOver', 'Wrong!')}</h2>
            <div className="bg-orange-50 dark:bg-slate-800 rounded-xl p-6 mb-6">
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('focusTracker.finalScore', 'Final Score')}</p>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">{totalScore}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-red-600 shadow-lg transition-all w-full"
            >
              {t('tryAgain', 'Try Again')}
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-violet-600 mb-4">{t('focusTracker.victory', 'Congratulations!')}</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 font-medium mb-6">
              {t('focusTracker.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className="bg-violet-50 dark:bg-slate-800 rounded-xl p-6 mb-6">
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('focusTracker.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-violet-600">{totalScore + Math.round(score)}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-violet-600 hover:to-purple-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
