'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

import { SettingsPanel } from "@/components/SettingsPanel"
const MAX_LEVELS = 30

const LEVEL_SETTINGS = [
  { gridSize: 4, itemCount: 12, targetCount: 2, timeLimit: 30 },  // Level 1
  { gridSize: 4, itemCount: 14, targetCount: 2, timeLimit: 25 },  // Level 2
  { gridSize: 4, itemCount: 16, targetCount: 3, timeLimit: 25 },  // Level 3
  { gridSize: 5, itemCount: 18, targetCount: 3, timeLimit: 30 },  // Level 4
  { gridSize: 5, itemCount: 20, targetCount: 3, timeLimit: 25 },  // Level 5
  { gridSize: 5, itemCount: 22, targetCount: 4, timeLimit: 25 },  // Level 6
  { gridSize: 6, itemCount: 25, targetCount: 4, timeLimit: 30 },  // Level 7
  { gridSize: 6, itemCount: 28, targetCount: 4, timeLimit: 25 },  // Level 8
  { gridSize: 6, itemCount: 30, targetCount: 5, timeLimit: 25 },  // Level 9
  { gridSize: 7, itemCount: 32, targetCount: 5, timeLimit: 30 },  // Level 10
  { gridSize: 7, itemCount: 35, targetCount: 5, timeLimit: 25 },  // Level 11
  { gridSize: 7, itemCount: 38, targetCount: 6, timeLimit: 25 },  // Level 12
  { gridSize: 7, itemCount: 40, targetCount: 6, timeLimit: 20 },  // Level 13
  { gridSize: 8, itemCount: 42, targetCount: 6, timeLimit: 25 },  // Level 14
  { gridSize: 8, itemCount: 45, targetCount: 7, timeLimit: 25 },  // Level 15
  { gridSize: 8, itemCount: 48, targetCount: 7, timeLimit: 20 },  // Level 16
  { gridSize: 8, itemCount: 50, targetCount: 8, timeLimit: 20 },  // Level 17
  { gridSize: 9, itemCount: 52, targetCount: 8, timeLimit: 25 },  // Level 18
  { gridSize: 9, itemCount: 55, targetCount: 8, timeLimit: 20 },  // Level 19
  { gridSize: 9, itemCount: 58, targetCount: 9, timeLimit: 20 },  // Level 20
  { gridSize: 9, itemCount: 60, targetCount: 9, timeLimit: 18 },  // Level 21
  { gridSize: 10, itemCount: 62, targetCount: 9, timeLimit: 20 },  // Level 22
  { gridSize: 10, itemCount: 65, targetCount: 10, timeLimit: 20 },  // Level 23
  { gridSize: 10, itemCount: 68, targetCount: 10, timeLimit: 18 },  // Level 24
  { gridSize: 10, itemCount: 70, targetCount: 11, timeLimit: 18 },  // Level 25
  { gridSize: 10, itemCount: 72, targetCount: 11, timeLimit: 15 },  // Level 26
  { gridSize: 10, itemCount: 75, targetCount: 12, timeLimit: 15 },  // Level 27
  { gridSize: 10, itemCount: 78, targetCount: 12, timeLimit: 12 },  // Level 28
  { gridSize: 10, itemCount: 80, targetCount: 13, timeLimit: 12 },  // Level 29
  { gridSize: 10, itemCount: 80, targetCount: 15, timeLimit: 10 },  // Level 30
]

const SHAPES = ['⭐', '🔷', '🔶', '💎', '🌟', '🔴', '🟢', '🔵', '🟣', '⬜', '🔺', '⬡']

const STROOP_WORDS = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'ORANGE', 'PURPLE']
const STROOP_COLORS = ['text-red-500', 'text-blue-500', 'text-green-500', 'text-yellow-500', 'text-orange-500', 'text-purple-500']

export default function SelectiveSearchPage() {
  const { t } = useTranslation()
  const { addSession, darkMode } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [items, setItems] = useState<{ id: number; shape: string; color: string; isTarget: boolean; x: number; y: number }[]>([])
  const [foundTargets, setFoundTargets] = useState(0)
  const [targetShape, setTargetShape] = useState('')
  const [wrongClicks, setWrongClicks] = useState(0)

  const settings = useMemo(
    () => LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)],
    [level]
  )
  const totalTargets = settings.targetCount

  const getLevelScore = useCallback(() => {
    const baseScore = level * 50
    const timeBonus = timeLeft * 5
    const wrongPenalty = wrongClicks * 10
    return Math.max(0, baseScore + timeBonus - wrongPenalty)
  }, [level, timeLeft, wrongClicks])

  const generateItems = useCallback(() => {
    const itemCount = settings.itemCount
    const targetCount = settings.targetCount
    const newItems = []
    const usedPositions = new Set<string>()

    // Pick target shape
    const target = SHAPES[Math.floor(Math.random() * SHAPES.length)]
    setTargetShape(target)

    // Generate target items
    for (let i = 0; i < targetCount; i++) {
      let x, y, key
      do {
        x = Math.floor(Math.random() * settings.gridSize)
        y = Math.floor(Math.random() * settings.gridSize)
        key = `${x},${y}`
      } while (usedPositions.has(key))

      usedPositions.add(key)
      newItems.push({
        id: i,
        shape: target,
        color: STROOP_COLORS[Math.floor(Math.random() * STROOP_COLORS.length)],
        isTarget: true,
        x,
        y
      })
    }

    // Generate distractor items
    for (let i = targetCount; i < itemCount; i++) {
      let x, y, key
      do {
        x = Math.floor(Math.random() * settings.gridSize)
        y = Math.floor(Math.random() * settings.gridSize)
        key = `${x},${y}`
      } while (usedPositions.has(key))

      usedPositions.add(key)
      let shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
      while (shape === target) {
        shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
      }

      newItems.push({
        id: i,
        shape,
        color: STROOP_COLORS[Math.floor(Math.random() * STROOP_COLORS.length)],
        isTarget: false,
        x,
        y
      })
    }

    return newItems
  }, [settings])

  const generateLevel = useCallback(() => {
    const timeLimit = LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)].timeLimit
    setTimeLeft(timeLimit)
    setItems(generateItems())
    setFoundTargets(0)
    setWrongClicks(0)
  }, [level, generateItems])

  const handleItemClick = useCallback((item: { id: number; isTarget: boolean }) => {
    if (gameState !== 'playing') return

    if (item.isTarget) {
      const newFound = foundTargets + 1
      setFoundTargets(newFound)
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, isTarget: false } : i))

      if (newFound >= totalTargets) {
        const levelScore = Math.round(getLevelScore())
        setScore(levelScore)
        setGameState('levelComplete')
      }
    } else {
      setWrongClicks(prev => prev + 1)
    }
  }, [gameState, foundTargets, totalTargets, getLevelScore])

  const startGame = useCallback(() => {
    setScore(0)
    setTotalScore(0)
    setLevel(1)
    generateLevel()
    setGameState('playing')
  }, [generateLevel])

  const nextLevel = useCallback(() => {
    const levelScore = Math.round(getLevelScore())
    setTotalScore(prev => prev + levelScore)

    if (level >= MAX_LEVELS) {
      addSession({
        id: Date.now().toString(),
        gameId: 'selective-search',
        difficulty: 'hard',
        score: totalScore + levelScore,
        completedAt: new Date(),
        durationSeconds: 0
      })
      setGameState('victory')
    } else {
      setLevel(prev => prev + 1)
      generateLevel()
      setGameState('playing')
    }
  }, [level, totalScore, getLevelScore, addSession, generateLevel])

  // Timer
  useEffect(() => {
    if (gameState !== 'playing' || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          addSession({
            id: Date.now().toString(),
            gameId: 'selective-search',
            difficulty: 'medium',
            score: totalScore,
            completedAt: new Date(),
            durationSeconds: settings.timeLimit - prev
          })
          setGameState('gameOver')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState, timeLeft, totalScore, addSession, settings.timeLimit])

  return (
    <div className={`min-h-screen p-3 md:p-4 lg:p-8 transition-colors duration-300 ${darkMode ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" : "bg-gradient-to-br from-violet-50 via-white to-purple-50"}`}>
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
          {t('selectiveSearch.title', 'Selective Search')}
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-8">
          {t('selectiveSearch.description', 'Find the target shapes among the distractions!')}
        </p>

        {/* Menu */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Level {level}
            </h2>
            <div className="bg-violet-50 dark:bg-slate-800 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">{t('selectiveSearch.levelInfo', 'Level Settings')}:</h3>
              <ul className="text-gray-700 dark:text-gray-300 space-y-1 font-medium">
                <li>• {t('selectiveSearch.gridSize', 'Grid')}: {settings.gridSize} × {settings.gridSize}</li>
                <li>• {t('selectiveSearch.itemCount', 'Items')}: {settings.itemCount}</li>
                <li>• {t('selectiveSearch.targetsToFind', 'Targets')}: {settings.targetCount}</li>
                <li>• {t('selectiveSearch.timeLimit', 'Time Limit')}: {settings.timeLimit}s</li>
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

        {/* Playing */}
        {gameState === 'playing' && (
          <>
            {/* Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('selectiveSearch.level', 'Level')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-violet-600">{level}/{MAX_LEVELS}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('selectiveSearch.score', 'Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-600">{totalScore}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('selectiveSearch.timeLeft', 'Time')}</p>
                  <p className={`text-xl md:text-2xl lg:text-3xl font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-violet-600'}`}>{timeLeft}s</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('selectiveSearch.progress', 'Progress')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-violet-600">{foundTargets}/{totalTargets}</p>
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

            {/* Target Display */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 mb-6 text-center">
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">{t('selectiveSearch.findThisShape', 'Find this shape:')}</p>
              <div className="text-5xl">{targetShape}</div>
              <p className="text-gray-700 dark:text-gray-300 font-medium mt-2">{t('selectiveSearch.ignoringColors', '(ignore the colors!)')}</p>
            </div>

            {/* Game Grid */}
            <div className="bg-gray-100 dark:bg-slate-700 rounded-2xl shadow-lg p-4 mb-6 relative">
              <div className="relative w-full aspect-square">
                {items.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleItemClick(item)}
                    className="absolute text-2xl md:text-3xl transition-all"
                    style={{
                      left: `${(item.x / settings.gridSize) * 100}%`,
                      top: `${(item.y / settings.gridSize) * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <span className={`${item.color}`}>{item.shape}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Wrong Click Indicator */}
            {wrongClicks > 0 && (
              <div className="bg-red-50 rounded-xl p-4 text-center">
                <p className="text-red-600 font-bold">Wrong clicks: {wrongClicks} (-{wrongClicks * 10} points)</p>
              </div>
            )}
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
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('selectiveSearch.levelScore', 'Level Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-violet-600">{Math.round(score)}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('selectiveSearch.totalScore', 'Total Score')}</p>
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4">{t('selectiveSearch.gameOver', 'Time\'s Up!')}</h2>
            <div className="bg-orange-50 dark:bg-slate-800 rounded-xl p-6 mb-6">
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('selectiveSearch.finalScore', 'Final Score')}</p>
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-violet-600 mb-4">{t('selectiveSearch.victory', 'Congratulations!')}</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 font-medium mb-6">
              {t('selectiveSearch.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className="bg-violet-50 dark:bg-slate-800 rounded-xl p-6 mb-6">
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('selectiveSearch.finalScore', 'Final Score')}</p>
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
