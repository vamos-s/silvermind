'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

const MAX_LEVELS = 30

const LEVEL_SETTINGS = [
  // Levels 1-5: Easy introduction
  { minWait: 2000, maxWait: 5000, targetTime: 400, rounds: 5 },  // Level 1
  { minWait: 1900, maxWait: 4800, targetTime: 380, rounds: 5 },  // Level 2
  { minWait: 1800, maxWait: 4600, targetTime: 360, rounds: 5 },  // Level 3
  { minWait: 1700, maxWait: 4400, targetTime: 340, rounds: 5 },  // Level 4
  { minWait: 1600, maxWait: 4200, targetTime: 320, rounds: 5 },  // Level 5

  // Levels 6-10: Medium challenge
  { minWait: 1500, maxWait: 4000, targetTime: 300, rounds: 6 },  // Level 6
  { minWait: 1400, maxWait: 3800, targetTime: 280, rounds: 6 },  // Level 7
  { minWait: 1300, maxWait: 3600, targetTime: 260, rounds: 7 },  // Level 8
  { minWait: 1200, maxWait: 3400, targetTime: 240, rounds: 7 },  // Level 9
  { minWait: 1100, maxWait: 3200, targetTime: 220, rounds: 8 },  // Level 10

  // Levels 11-15: Harder progression
  { minWait: 1000, maxWait: 3000, targetTime: 200, rounds: 8 },  // Level 11
  { minWait: 950, maxWait: 2850, targetTime: 190, rounds: 9 },   // Level 12
  { minWait: 900, maxWait: 2700, targetTime: 180, rounds: 9 },   // Level 13
  { minWait: 850, maxWait: 2550, targetTime: 170, rounds: 10 },  // Level 14
  { minWait: 800, maxWait: 2400, targetTime: 160, rounds: 10 },  // Level 15

  // Levels 16-20: Advanced challenge
  { minWait: 750, maxWait: 2250, targetTime: 150, rounds: 11 },  // Level 16
  { minWait: 700, maxWait: 2100, targetTime: 140, rounds: 11 },  // Level 17
  { minWait: 650, maxWait: 1950, targetTime: 130, rounds: 12 },  // Level 18
  { minWait: 600, maxWait: 1800, targetTime: 120, rounds: 12 },  // Level 19
  { minWait: 550, maxWait: 1650, targetTime: 110, rounds: 13 },  // Level 20

  // Levels 21-25: Expert level
  { minWait: 500, maxWait: 1500, targetTime: 100, rounds: 13 },  // Level 21
  { minWait: 480, maxWait: 1440, targetTime: 95, rounds: 14 },   // Level 22
  { minWait: 460, maxWait: 1380, targetTime: 90, rounds: 14 },   // Level 23
  { minWait: 440, maxWait: 1320, targetTime: 85, rounds: 15 },   // Level 24
  { minWait: 420, maxWait: 1260, targetTime: 80, rounds: 15 },   // Level 25

  // Levels 26-30: Master level
  { minWait: 400, maxWait: 1200, targetTime: 75, rounds: 16 },   // Level 26
  { minWait: 380, maxWait: 1140, targetTime: 70, rounds: 16 },   // Level 27
  { minWait: 360, maxWait: 1080, targetTime: 65, rounds: 17 },   // Level 28
  { minWait: 340, maxWait: 1020, targetTime: 60, rounds: 17 },   // Level 29
  { minWait: 320, maxWait: 960, targetTime: 55, rounds: 18 },    // Level 30
]

const WAIT_COLOR = 'bg-red-500'
const ACTIVE_COLOR = 'bg-green-500'
const TOO_EARLY_COLOR = 'bg-orange-500'

export default function QuickReactionPage() {
  const { t } = useTranslation()
  const { addSession } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'waiting' | 'active' | 'early' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [currentRound, setCurrentRound] = useState(0)
  const [reactionTimes, setReactionTimes] = useState<number[]>([])
  const [startTime, setStartTime] = useState(0)
  const [averageTime, setAverageTime] = useState(0)
  const [waitingTimeout, setWaitingTimeout] = useState<NodeJS.Timeout | null>(null)
  const [level, setLevel] = useState(1)
  const [totalScore, setTotalScore] = useState(0)
  const [levelScore, setLevelScore] = useState(0)

  const settings = LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)]

  const calculateScore = (avgTime: number) => {
    const ratio = settings.targetTime / avgTime
    return Math.round(ratio * 100 * level)
  }

  const startGame = useCallback(() => {
    setLevel(1)
    setTotalScore(0)
    startLevel()
  }, [])

  const startLevel = useCallback(() => {
    setCurrentRound(0)
    setReactionTimes([])
    setAverageTime(0)
    setLevelScore(0)
    startRound()
  }, [])

  const startRound = useCallback(() => {
    setCurrentRound(prev => prev + 1)
    setGameState('waiting')

    const waitTime = Math.random() * (settings.maxWait - settings.minWait) + settings.minWait

    const timeout = setTimeout(() => {
      setStartTime(Date.now())
      setGameState('active')
    }, waitTime)

    setWaitingTimeout(timeout)
  }, [settings])

  const handleClick = useCallback(() => {
    if (gameState === 'waiting') {
      // Clicked too early - penalize
      if (waitingTimeout) clearTimeout(waitingTimeout)
      setGameState('early')
      return
    }

    if (gameState === 'active') {
      const reactionTime = Date.now() - startTime
      const newTimes = [...reactionTimes, reactionTime]
      setReactionTimes(newTimes)

      if (newTimes.length >= settings.rounds) {
        // Level complete
        const avg = Math.round(newTimes.reduce((a, b) => a + b, 0) / newTimes.length)
        setAverageTime(avg)
        setLevelScore(calculateScore(avg))
        setGameState('levelComplete')
      } else {
        // Next round
        setGameState('waiting')
        setTimeout(() => startRound(), 1000)
      }
    }

    if (gameState === 'early') {
      // Try again for this round - add penalty
      const newTimes = [...reactionTimes, 2000] // 2 second penalty
      setReactionTimes(newTimes)

      if (newTimes.length >= settings.rounds) {
        const avg = Math.round(newTimes.reduce((a, b) => a + b, 0) / newTimes.length)
        setAverageTime(avg)
        setLevelScore(calculateScore(avg))
        setGameState('levelComplete')
      } else {
        startRound()
      }
    }
  }, [gameState, startTime, reactionTimes, settings, waitingTimeout, calculateScore])

  const nextLevel = () => {
    setTotalScore(prev => prev + levelScore)

    if (level >= MAX_LEVELS) {
      addSession({
        id: Date.now().toString(),
        gameId: 'quick-reaction',
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

  const resetGame = useCallback(() => {
    if (waitingTimeout) clearTimeout(waitingTimeout)
    setGameState('menu')
    setCurrentRound(0)
    setReactionTimes([])
    setAverageTime(0)
  }, [waitingTimeout])

  useEffect(() => {
    return () => {
      if (waitingTimeout) clearTimeout(waitingTimeout)
    }
  }, [waitingTimeout])

  const getRating = (avgTime: number) => {
    const target = settings.targetTime
    const ratio = target / avgTime

    if (ratio >= 1.5) return { text: 'Amazing!', color: 'text-green-600', emoji: '🚀' }
    if (ratio >= 1.3) return { text: 'Excellent!', color: 'text-green-500', emoji: '⭐' }
    if (ratio >= 1.1) return { text: 'Great!', color: 'text-blue-600', emoji: '👍' }
    if (ratio >= 0.9) return { text: 'Good!', color: 'text-blue-500', emoji: '👌' }
    if (ratio >= 0.8) return { text: 'Almost there!', color: 'text-yellow-600', emoji: '😊' }
    return { text: 'Keep trying!', color: 'text-orange-500', emoji: '💪' }
  }

  const rating = getRating(averageTime)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-6">
        <Link
          href="/reaction"
          className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium mb-4 text-lg"
        >
          <span className="mr-2">←</span> {t('back', 'Back')}
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">
          {t('quickReaction.title', 'Quick Reaction')}
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Menu */}
          {gameState === 'menu' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Level {level}
              </h2>
              {level > 1 && (
                <p className="text-lg text-gray-700 mb-4 font-medium">
                  Total Score: <span className="text-green-600 font-bold">{totalScore}</span>
                </p>
              )}
              <p className="text-lg text-gray-600 mb-6">
                {t('quickReaction.instructions', 'Wait for screen to turn GREEN, then click as fast as you can!')}
              </p>
              <div className="bg-green-50 rounded-xl p-4 mb-6 text-left">
                <h3 className="font-bold text-gray-800 mb-2">{t('quickReaction.levelInfo', 'Level Settings')}:</h3>
                <ul className="text-gray-700 space-y-1 font-medium">
                  <li>• {t('quickReaction.rounds', 'Rounds')}: {settings.rounds}</li>
                  <li>• {t('quickReaction.waitTime', 'Wait time')}: {settings.minWait / 1000}-{settings.maxWait / 1000}s</li>
                  <li>• {t('quickReaction.targetTime', 'Target Time')}: {settings.targetTime}ms</li>
                </ul>
              </div>
              <button
                onClick={startLevel}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-green-600 hover:to-blue-600 shadow-lg transition-all w-full"
              >
                {t('start', 'Start')}
              </button>
            </motion.div>
          )}

          {/* Game Area */}
          {(gameState === 'waiting' || gameState === 'active' || gameState === 'early') && (
            <>
              {/* Progress */}
              <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <p className="text-gray-700 text-sm font-medium">{t('quickReaction.level', 'Level')}</p>
                  <p className="text-3xl font-bold text-green-600">{level}/{MAX_LEVELS}</p>
                  <p className="text-gray-700 text-sm font-medium">{t('quickReaction.round', 'Round')}</p>
                  <p className="text-3xl font-bold text-blue-600">{currentRound}/{settings.rounds}</p>
                </div>
                {/* Progress Bar */}
                <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentRound) / settings.rounds) * 100}%` }}
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-full"
                  />
                </div>
              </div>

              {/* Click Area */}
              <motion.button
                onClick={handleClick}
                initial={{ scale: 1 }}
                animate={{ scale: gameState === 'active' ? 1.02 : 1 }}
                transition={{ duration: 0.1 }}
                className={`
                  w-full h-96 rounded-2xl shadow-2xl transition-all cursor-pointer
                  ${gameState === 'waiting' && WAIT_COLOR}
                  ${gameState === 'active' && ACTIVE_COLOR}
                  ${gameState === 'early' && TOO_EARLY_COLOR}
                `}
              >
                <div className="flex flex-col items-center justify-center h-full text-white">
                  <AnimatePresence mode="wait">
                    {gameState === 'waiting' && (
                      <motion.div
                        key="waiting"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center"
                      >
                        <p className="text-6xl mb-4">⏳</p>
                        <p className="text-4xl font-bold">{t('quickReaction.waitForGreen', 'Wait for green...')}</p>
                      </motion.div>
                    )}

                    {gameState === 'active' && (
                      <motion.div
                        key="active"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="text-center"
                      >
                        <p className="text-6xl mb-4">⚡</p>
                        <p className="text-5xl font-bold">{t('quickReaction.clickNow', 'CLICK NOW!')}</p>
                      </motion.div>
                    )}

                    {gameState === 'early' && (
                      <motion.div
                        key="early"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center"
                      >
                        <p className="text-6xl mb-4">⚠️</p>
                        <p className="text-4xl font-bold mb-4">{t('quickReaction.tooEarly', 'Too Early!')}</p>
                        <p className="text-xl">{t('quickReaction.clickToRetry', 'Click to retry')}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>

              {/* Cancel Button */}
              <button
                onClick={resetGame}
                className="mt-6 w-full bg-gray-200 text-gray-700 text-xl font-bold py-3 rounded-xl hover:bg-gray-300 transition-all"
              >
                {t('quickReaction.cancel', 'Cancel')}
              </button>
            </>
          )}

          {/* Level Complete */}
          {gameState === 'levelComplete' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center"
            >
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-4xl font-bold text-green-600 mb-4">Level {level} Complete!</h2>

              {/* Rating */}
              <div className={`text-5xl mb-2 ${rating.color}`}>
                {rating.emoji}
              </div>
              <p className={`text-2xl font-bold mb-6 ${rating.color}`}>
                {rating.text}
              </p>

              {/* Average Time */}
              <div className="bg-green-50 rounded-xl p-6 mb-6">
                <p className="text-gray-700 text-lg mb-2">
                  {t('quickReaction.averageTime', 'Average Reaction Time')}
                </p>
                <p className="text-6xl font-bold text-gray-800">
                  {averageTime}ms
                </p>
                <p className="text-gray-600 mt-2">
                  Target: {settings.targetTime}ms
                </p>
              </div>

              {/* Score */}
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-700 text-sm font-medium">{t('quickReaction.levelScore', 'Level Score')}</p>
                    <p className="text-3xl font-bold text-green-600">{levelScore}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 text-sm font-medium">{t('quickReaction.totalScore', 'Total Score')}</p>
                    <p className="text-3xl font-bold text-blue-600">{totalScore + levelScore}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={nextLevel}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-green-600 hover:to-blue-600 shadow-lg transition-all w-full mb-3"
              >
                {level < MAX_LEVELS ? `Next Level ${level + 1}` : 'View Final Score'}
              </button>
              <button
                onClick={startGame}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                {t('quickReaction.restart', 'Restart from Level 1')}
              </button>
            </motion.div>
          )}

          {/* Game Over */}
          {gameState === 'gameOver' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center"
            >
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">{t('quickReaction.gameOver', 'Game Over!')}</h2>
              <div className="bg-orange-50 rounded-xl p-6 mb-6">
                <p className="text-gray-700 text-sm font-medium">{t('quickReaction.finalScore', 'Final Score')}</p>
                <p className="text-3xl font-bold text-orange-600">{totalScore}</p>
              </div>
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-red-600 shadow-lg transition-all w-full mb-3"
              >
                {t('tryAgain', 'Try Again')}
              </button>
              <button
                onClick={startGame}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                {t('quickReaction.restart', 'Restart from Level 1')}
              </button>
            </motion.div>
          )}

          {/* Victory */}
          {gameState === 'victory' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-4xl font-bold text-green-600 mb-4">{t('quickReaction.victory', 'Congratulations!')}</h2>
              <p className="text-xl text-gray-700 font-medium mb-6">
                {t('quickReaction.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
              </p>
              <div className="bg-green-50 rounded-xl p-6 mb-6">
                <p className="text-gray-700 text-sm font-medium">{t('quickReaction.finalScore', 'Final Score')}</p>
                <p className="text-5xl font-bold text-green-600">{totalScore + levelScore}</p>
              </div>
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-green-600 hover:to-blue-600 shadow-lg transition-all w-full"
              >
                {t('playAgain', 'Play Again')}
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
