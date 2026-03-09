'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

import { SettingsPanel } from "@/components/SettingsPanel"
const MAX_LEVELS = 30

const LEVEL_SETTINGS = [
  { gridCount: 4, spotlightSize: 2, timeLimit: 30 },  // Level 1: 4x4, 2x2 spotlight, 30s
  { gridCount: 4, spotlightSize: 2, timeLimit: 25 },  // Level 2
  { gridCount: 4, spotlightSize: 2, timeLimit: 20 },  // Level 3
  { gridCount: 5, spotlightSize: 2, timeLimit: 25 },  // Level 4
  { gridCount: 5, spotlightSize: 2, timeLimit: 20 },  // Level 5
  { gridCount: 5, spotlightSize: 3, timeLimit: 20 },  // Level 6
  { gridCount: 6, spotlightSize: 3, timeLimit: 25 },  // Level 7
  { gridCount: 6, spotlightSize: 3, timeLimit: 20 },  // Level 8
  { gridCount: 6, spotlightSize: 3, timeLimit: 18 },  // Level 9
  { gridCount: 7, spotlightSize: 3, timeLimit: 20 },  // Level 10
  { gridCount: 7, spotlightSize: 3, timeLimit: 18 },  // Level 11
  { gridCount: 7, spotlightSize: 3, timeLimit: 15 },  // Level 12
  { gridCount: 8, spotlightSize: 3, timeLimit: 18 },  // Level 13
  { gridCount: 8, spotlightSize: 3, timeLimit: 15 },  // Level 14
  { gridCount: 8, spotlightSize: 4, timeLimit: 15 },  // Level 15
  { gridCount: 9, spotlightSize: 4, timeLimit: 18 },  // Level 16
  { gridCount: 9, spotlightSize: 4, timeLimit: 15 },  // Level 17
  { gridCount: 9, spotlightSize: 4, timeLimit: 12 },  // Level 18
  { gridCount: 10, spotlightSize: 4, timeLimit: 15 },  // Level 19
  { gridCount: 10, spotlightSize: 4, timeLimit: 12 },  // Level 20
  { gridCount: 10, spotlightSize: 4, timeLimit: 10 },  // Level 21
  { gridCount: 11, spotlightSize: 4, timeLimit: 12 },  // Level 22
  { gridCount: 11, spotlightSize: 4, timeLimit: 10 },  // Level 23
  { gridCount: 11, spotlightSize: 5, timeLimit: 10 },  // Level 24
  { gridCount: 12, spotlightSize: 5, timeLimit: 12 },  // Level 25
  { gridCount: 12, spotlightSize: 5, timeLimit: 10 },  // Level 26
  { gridCount: 12, spotlightSize: 5, timeLimit: 8 },   // Level 27
  { gridCount: 13, spotlightSize: 5, timeLimit: 10 },  // Level 28
  { gridCount: 13, spotlightSize: 5, timeLimit: 8 },   // Level 29
  { gridCount: 13, spotlightSize: 5, timeLimit: 6 },   // Level 30
]

const SHAPES = ['⭐', '🔷', '🔶', '💎', '🌟', '🔴', '🟢', '🔵']

export default function SpotlightPage() {
  const { t } = useTranslation()
  const { addSession, darkMode } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 })
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 })
  const [foundTargets, setFoundTargets] = useState(0)
  const [totalTargets, setTotalTargets] = useState(1)
  const [targetShape, setTargetShape] = useState(SHAPES[0])

  const settings = useMemo(
    () => LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)],
    [level]
  )
  const gridCount = settings.gridCount
  const spotlightSize = settings.spotlightSize

  const getLevelScore = useCallback(() => {
    const baseScore = level * 50
    const timeBonus = timeLeft * 5
    return baseScore + timeBonus
  }, [level, timeLeft])

  const generateLevel = useCallback(() => {
    const timeLimit = LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)].timeLimit
    setTimeLeft(timeLimit)
    setFoundTargets(0)
    setTotalTargets(Math.min(3 + Math.floor(level / 10), 5))
    setTargetShape(SHAPES[Math.floor(Math.random() * SHAPES.length)])
    setSpotlightPos({ x: 0, y: 0 })
    setTargetPos({ x: 0, y: 0 })
  }, [level])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'playing') return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(gridCount - spotlightSize, Math.floor((e.clientX - rect.left) / (rect.width / gridCount)) - Math.floor(spotlightSize / 2)))
    const y = Math.max(0, Math.min(gridCount - spotlightSize, Math.floor((e.clientY - rect.top) / (rect.height / gridCount)) - Math.floor(spotlightSize / 2)))
    setSpotlightPos({ x, y })
  }, [gameState, gridCount, spotlightSize])

  const handleGridClick = useCallback(() => {
    if (gameState !== 'playing') return

    // Check if spotlight is on target
    const inSpotlight = (
      targetPos.x >= spotlightPos.x && targetPos.x < spotlightPos.x + spotlightSize &&
      targetPos.y >= spotlightPos.y && targetPos.y < spotlightPos.y + spotlightSize
    )

    if (inSpotlight) {
      const newFound = foundTargets + 1
      setFoundTargets(newFound)

      if (newFound >= totalTargets) {
        const levelScore = Math.round(getLevelScore())
        setScore(levelScore)
        setGameState('levelComplete')
      } else {
        // Move target to new position
        setTargetPos({
          x: Math.floor(Math.random() * gridCount),
          y: Math.floor(Math.random() * gridCount)
        })
      }
    }
  }, [gameState, targetPos, spotlightPos, spotlightSize, foundTargets, totalTargets, getLevelScore, gridCount])

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
        gameId: 'spotlight',
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
            gameId: 'spotlight',
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

  // Generate initial target when level starts
  useEffect(() => {
    if (gameState === 'playing' && foundTargets === 0 && targetPos.x === 0 && targetPos.y === 0) {
      setTargetPos({
        x: Math.floor(Math.random() * gridCount),
        y: Math.floor(Math.random() * gridCount)
      })
    }
  }, [gameState, foundTargets, targetPos, gridCount])

  const getDifficultyColor = useCallback(() => {
    if (level <= 6) return 'text-green-600'
    if (level <= 16) return 'text-yellow-600'
    if (level <= 23) return 'text-orange-600'
    return 'text-red-600'
  }, [level])

  const getDifficultyLabel = useCallback(() => {
    if (level <= 6) return 'Easy'
    if (level <= 16) return 'Medium'
    if (level <= 23) return 'Hard'
    return 'Expert'
  }, [level])

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
          {t('spotlight.title', 'Spotlight')}
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-8">
          {t('spotlight.description', 'Find hidden targets with your spotlight!')}
        </p>

        {/* Menu */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">🔦</div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Level {level}
            </h2>
            <div className="bg-violet-50 dark:bg-slate-800 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">{t('spotlight.levelInfo', 'Level Settings')}:</h3>
              <ul className="text-gray-700 dark:text-gray-300 space-y-1 font-medium">
                <li>• {t('spotlight.gridSize', 'Grid')}: {gridCount} × {gridCount}</li>
                <li>• {t('spotlight.spotlightSize', 'Spotlight')}: {spotlightSize} × {spotlightSize}</li>
                <li>• {t('spotlight.timeLimit', 'Time Limit')}: {settings.timeLimit}s</li>
                <li>• {t('spotlight.targetsToFind', 'Targets to Find')}: {Math.min(3 + Math.floor(level / 10), 5)}</li>
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
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('spotlight.level', 'Level')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-violet-600">{level}/{MAX_LEVELS}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('spotlight.score', 'Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-600">{totalScore}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('spotlight.timeLeft', 'Time')}</p>
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

            {/* Target Display */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 mb-6 text-center">
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">{t('spotlight.findThisShape', 'Find this shape:')}</p>
              <div className="text-5xl">{targetShape}</div>
              <p className="text-gray-700 dark:text-gray-300 font-medium mt-2">{t('spotlight.progress', 'Progress')}: {foundTargets} / {totalTargets}</p>
            </div>

            {/* Game Grid */}
            <div
              className="bg-gray-900 rounded-2xl shadow-lg p-4 mb-6 relative cursor-pointer"
              onMouseMove={handleMouseMove}
              onClick={handleGridClick}
            >
              <div className="relative w-full aspect-square">
                {/* Hidden targets grid */}
                <div className="absolute inset-0 grid gap-1" style={{ gridTemplateColumns: `repeat(${gridCount}, 1fr)` }}>
                  {Array.from({ length: gridCount * gridCount }).map((_, index) => {
                    const x = index % gridCount
                    const y = Math.floor(index / gridCount)
                    const isTarget = targetPos.x === x && targetPos.y === y

                    return (
                      <div
                        key={index}
                        className="aspect-square flex items-center justify-center text-2xl"
                      >
                        {isTarget && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>{targetShape}</motion.span>}
                      </div>
                    )
                  })}
                </div>

                {/* Spotlight overlay */}
                <div className="absolute inset-0 bg-black/90 pointer-events-none">
                  <motion.div
                    className="bg-transparent border-4 border-yellow-400 rounded-lg dark:border-gray-600"
                    style={{
                      position: 'absolute',
                      left: `${(spotlightPos.x / gridCount) * 100}%`,
                      top: `${(spotlightPos.y / gridCount) * 100}%`,
                      width: `${(spotlightSize / gridCount) * 100}%`,
                      height: `${(spotlightSize / gridCount) * 100}%`,
                    }}
                  />
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-violet-600 mb-4">Level {level} Complete!</h2>
            <div className="bg-violet-50 dark:bg-slate-800 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('spotlight.levelScore', 'Level Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-violet-600">{Math.round(score)}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('spotlight.totalScore', 'Total Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-600">{totalScore + Math.round(score)}</p>
                </div>
              </div>
            </div>
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-violet-600 hover:to-purple-600 shadow-lg transition-all w-full mb-3"
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4">{t('spotlight.gameOver', 'Time\'s Up!')}</h2>
            <div className="bg-orange-50 dark:bg-slate-800 rounded-xl p-6 mb-6">
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('spotlight.finalScore', 'Final Score')}</p>
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-violet-600 mb-4">{t('spotlight.victory', 'Congratulations!')}</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 font-medium mb-6">
              {t('spotlight.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className="bg-violet-50 dark:bg-slate-800 rounded-xl p-6 mb-6">
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('spotlight.finalScore', 'Final Score')}</p>
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
