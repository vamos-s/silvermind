'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

const DIFFICULTY_SETTINGS = {
  easy: { minWait: 2000, maxWait: 5000, rounds: 5 },
  medium: { minWait: 1500, maxWait: 4000, rounds: 7 },
  hard: { minWait: 1000, maxWait: 3000, rounds: 10 },
}

const WAIT_COLOR = 'bg-red-500'
const ACTIVE_COLOR = 'bg-green-500'
const TOO_EARLY_COLOR = 'bg-orange-500'

export default function QuickReactionPage() {
  const { t } = useTranslation()
  const { currentDifficulty, addSession } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'waiting' | 'active' | 'early' | 'result'>('menu')
  const [currentRound, setCurrentRound] = useState(0)
  const [reactionTimes, setReactionTimes] = useState<number[]>([])
  const [startTime, setStartTime] = useState(0)
  const [averageTime, setAverageTime] = useState(0)
  const [waitingTimeout, setWaitingTimeout] = useState<NodeJS.Timeout | null>(null)

  const settings = DIFFICULTY_SETTINGS[currentDifficulty as keyof typeof DIFFICULTY_SETTINGS] || DIFFICULTY_SETTINGS.easy

  const startGame = useCallback(() => {
    setCurrentRound(0)
    setReactionTimes([])
    setAverageTime(0)
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
      // Clicked too early
      if (waitingTimeout) clearTimeout(waitingTimeout)
      setGameState('early')
      return
    }

    if (gameState === 'active') {
      const reactionTime = Date.now() - startTime
      const newTimes = [...reactionTimes, reactionTime]
      setReactionTimes(newTimes)

      if (newTimes.length >= settings.rounds) {
        // Game over
        const avg = Math.round(newTimes.reduce((a, b) => a + b, 0) / newTimes.length)
        setAverageTime(avg)

        // Calculate score based on average reaction time
        // Better (lower) reaction time = higher score
        let score = 0
        if (avg < 200) score = 100
        else if (avg < 250) score = 90
        else if (avg < 300) score = 80
        else if (avg < 350) score = 70
        else if (avg < 400) score = 60
        else if (avg < 500) score = 50
        else if (avg < 600) score = 40
        else if (avg < 700) score = 30
        else score = 20

        addSession({
          id: Date.now().toString(),
          gameId: 'quick-reaction',
          difficulty: currentDifficulty,
          score: score,
          completedAt: new Date(),
          durationSeconds: Math.round((settings.rounds * 3) / 1000) // Rough estimate
        })

        setGameState('result')
      } else {
        // Next round
        setGameState('waiting')
        setTimeout(() => startRound(), 1000)
      }
    }

    if (gameState === 'early') {
      // Try again for this round
      startRound()
    }
  }, [gameState, startTime, reactionTimes, settings, waitingTimeout, addSession, currentDifficulty])

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
    if (avgTime < 200) return { text: 'Amazing!', color: 'text-green-600', emoji: '🚀' }
    if (avgTime < 250) return { text: 'Excellent!', color: 'text-green-500', emoji: '⭐' }
    if (avgTime < 300) return { text: 'Great!', color: 'text-blue-600', emoji: '👍' }
    if (avgTime < 350) return { text: 'Good!', color: 'text-blue-500', emoji: '👌' }
    if (avgTime < 400) return { text: 'Not bad!', color: 'text-yellow-600', emoji: '😊' }
    if (avgTime < 500) return { text: 'Keep practicing!', color: 'text-yellow-500', emoji: '💪' }
    if (avgTime < 600) return { text: 'Average!', color: 'text-orange-600', emoji: '🎯' }
    return { text: 'Keep trying!', color: 'text-orange-500', emoji: '🏋️' }
  }

  const rating = getRating(averageTime)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-6">
        <Link
          href="/reaction"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 text-lg"
        >
          <span className="mr-2">←</span> {t('back')}
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
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {t('quickReaction.ready', 'Test your reaction speed!')}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {t('quickReaction.instructions', 'Wait for the screen to turn GREEN, then click as fast as you can!')}
              </p>
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="flex justify-around">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-500 rounded-xl mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">{t('quickReaction.wait', 'Wait')}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-xl mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">{t('quickReaction.click', 'Click!')}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-500 rounded-xl mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">{t('quickReaction.tooEarly', 'Too Early')}</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
                <h3 className="font-bold text-gray-800 mb-2">{t('quickReaction.difficultyInfo', 'Difficulty Settings')}:</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• {t('quickReaction.rounds', 'Rounds')}: {settings.rounds}</li>
                  <li>• {t('quickReaction.waitTime', 'Wait time')}: {settings.minWait / 1000}-{settings.maxWait / 1000}s</li>
                </ul>
              </div>
              <button
                onClick={startGame}
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
                  <p className="text-gray-600">
                    {t('quickReaction.round', 'Round')} {currentRound}/{settings.rounds}
                  </p>
                  {reactionTimes.length > 0 && (
                    <p className="text-gray-600">
                      {t('quickReaction.lastTime', 'Last')}: {reactionTimes[reactionTimes.length - 1]}ms
                    </p>
                  )}
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

          {/* Results */}
          {gameState === 'result' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {t('quickReaction.results', 'Results')}
              </h2>

              {/* Rating */}
              <div className={`text-5xl mb-4 ${rating.color}`}>
                {rating.emoji}
              </div>
              <p className={`text-3xl font-bold mb-6 ${rating.color}`}>
                {rating.text}
              </p>

              {/* Average Time */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6">
                <p className="text-gray-600 text-lg mb-2">
                  {t('quickReaction.averageTime', 'Average Reaction Time')}
                </p>
                <p className="text-6xl font-bold text-gray-800">
                  {averageTime}ms
                </p>
              </div>

              {/* Individual Times */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {t('quickReaction.individualTimes', 'Individual Times')}
                </h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {reactionTimes.map((time, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 rounded-lg px-4 py-2 text-center"
                    >
                      <p className="text-sm text-gray-500">#{index + 1}</p>
                      <p className="text-xl font-bold text-gray-800">{time}ms</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best Time */}
              <div className="bg-green-50 rounded-xl p-4 mb-6">
                <p className="text-gray-600">
                  {t('quickReaction.bestTime', 'Best Time')}: <span className="text-2xl font-bold text-green-600">{Math.min(...reactionTimes)}ms</span>
                </p>
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
