'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

import { SettingsPanel } from "@/components/SettingsPanel"
const MAX_LEVELS = 30

const LEVEL_SETTINGS = [
  // Levels 1-5: Easy introduction
  { rounds: 5, minDelay: 2500, maxDelay: 5000, targetTime: 500 },  // Level 1
  { rounds: 5, minDelay: 2400, maxDelay: 4800, targetTime: 480 },  // Level 2
  { rounds: 5, minDelay: 2300, maxDelay: 4600, targetTime: 460 },  // Level 3
  { rounds: 5, minDelay: 2200, maxDelay: 4400, targetTime: 440 },  // Level 4
  { rounds: 5, minDelay: 2100, maxDelay: 4200, targetTime: 420 },  // Level 5

  // Levels 6-10: Medium challenge
  { rounds: 6, minDelay: 2000, maxDelay: 4000, targetTime: 400 },  // Level 6
  { rounds: 6, minDelay: 1900, maxDelay: 3800, targetTime: 380 },  // Level 7
  { rounds: 6, minDelay: 1800, maxDelay: 3600, targetTime: 360 },  // Level 8
  { rounds: 7, minDelay: 1700, maxDelay: 3400, targetTime: 340 },  // Level 9
  { rounds: 7, minDelay: 1600, maxDelay: 3200, targetTime: 320 },  // Level 10

  // Levels 11-15: Harder progression
  { rounds: 7, minDelay: 1500, maxDelay: 3000, targetTime: 300 },  // Level 11
  { rounds: 8, minDelay: 1450, maxDelay: 2900, targetTime: 285 },  // Level 12
  { rounds: 8, minDelay: 1400, maxDelay: 2800, targetTime: 270 },  // Level 13
  { rounds: 8, minDelay: 1350, maxDelay: 2700, targetTime: 255 },  // Level 14
  { rounds: 9, minDelay: 1300, maxDelay: 2600, targetTime: 240 },  // Level 15

  // Levels 16-20: Advanced challenge
  { rounds: 9, minDelay: 1250, maxDelay: 2500, targetTime: 225 },  // Level 16
  { rounds: 9, minDelay: 1200, maxDelay: 2400, targetTime: 210 },  // Level 17
  { rounds: 10, minDelay: 1150, maxDelay: 2300, targetTime: 195 },  // Level 18
  { rounds: 10, minDelay: 1100, maxDelay: 2200, targetTime: 180 },  // Level 19
  { rounds: 10, minDelay: 1050, maxDelay: 2100, targetTime: 165 },  // Level 20

  // Levels 21-25: Expert level
  { rounds: 10, minDelay: 1000, maxDelay: 2000, targetTime: 150 },  // Level 21
  { rounds: 11, minDelay: 950, maxDelay: 1900, targetTime: 140 },   // Level 22
  { rounds: 11, minDelay: 900, maxDelay: 1800, targetTime: 130 },   // Level 23
  { rounds: 12, minDelay: 850, maxDelay: 1700, targetTime: 120 },   // Level 24
  { rounds: 12, minDelay: 800, maxDelay: 1600, targetTime: 110 },   // Level 25

  // Levels 26-30: Master level
  { rounds: 12, minDelay: 750, maxDelay: 1500, targetTime: 100 },   // Level 26
  { rounds: 13, minDelay: 700, maxDelay: 1400, targetTime: 90 },    // Level 27
  { rounds: 13, minDelay: 650, maxDelay: 1300, targetTime: 80 },    // Level 28
  { rounds: 14, minDelay: 600, maxDelay: 1200, targetTime: 70 },    // Level 29
  { rounds: 14, minDelay: 550, maxDelay: 1100, targetTime: 60 },    // Level 30
]

export default function TimingGamePage() {
  const { t } = useTranslation()
  const { addSession, darkMode } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'waiting' | 'ready' | 'finished' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [startTime, setStartTime] = useState(0)
  const [reactionTime, setReactionTime] = useState(0)
  const [round, setRound] = useState(0)
  const [reactionTimes, setReactionTimes] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [level, setLevel] = useState(1)

  const settings = useMemo(() => LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)], [level])

  const calculateRoundScore = useCallback((time: number) => {
    if (time < 0) return 0 // Too early
    const ratio = settings.targetTime / time
    return Math.round(ratio * 100)
  }, [settings.targetTime])

  const startLevel = useCallback(() => {
    setRound(0)
    setReactionTimes([])
    setScore(0)
    setGameState('menu')
    setTimeout(() => {
      setGameState('waiting')
      setRound(1)
      setTimeout(() => {
        setGameState('ready')
        setStartTime(Date.now())
      }, 1200)
    }, 100)
  }, [])

  const startGame = useCallback(() => {
    setScore(0)
    setTotalScore(0)
    setLevel(1)
    startLevel()
  }, [startLevel])

  const startRound = useCallback(() => {
    setRound(prev => prev + 1)
    setGameState('waiting')
    setReactionTime(0)

    const delay = settings.minDelay + Math.random() * (settings.maxDelay - settings.minDelay)
    setTimeout(() => {
      if (gameState === 'waiting') {
        setGameState('ready')
        setStartTime(Date.now())
      }
    }, delay)
  }, [settings.minDelay, settings.maxDelay, gameState])

  const handleClick = useCallback(() => {
    if (gameState === 'ready') {
      const endTime = Date.now()
      const time = endTime - startTime
      setReactionTime(time)
      setGameState('finished')

      const roundScore = calculateRoundScore(time)
      const newTimes = [...reactionTimes, time]
      setReactionTimes(newTimes)
      setScore(prev => prev + roundScore)

      if (round < settings.rounds) {
        setTimeout(() => {
          startRound()
        }, 1500)
      } else {
        setGameState('levelComplete')
      }
    } else if (gameState === 'waiting') {
      // Clicked too early
      setReactionTime(-1)
      setGameState('finished')
      setReactionTimes([...reactionTimes, -1])

      if (round < settings.rounds) {
        setTimeout(() => {
          startRound()
        }, 1500)
      } else {
        setGameState('levelComplete')
      }
    } else if (gameState === 'finished') {
      // Continue to next
      if (round < settings.rounds) {
        startRound()
      } else {
        setGameState('levelComplete')
      }
    }
  }, [gameState, startTime, reactionTimes, round, settings.rounds, calculateRoundScore, startRound])

  const nextLevel = useCallback(() => {
    setTotalScore(prev => prev + score)

    if (level >= MAX_LEVELS) {
      addSession({
        id: Date.now().toString(),
        gameId: 'timing-game',
        difficulty: 'hard',
        score: totalScore + score,
        completedAt: new Date(),
        durationSeconds: 0
      })
      setGameState('victory')
    } else {
      setLevel(prev => prev + 1)
      setGameState('menu')
      setTimeout(() => startLevel(), 100)
    }
  }, [score, level, totalScore, addSession, startLevel])

  const avgTime = useMemo(() => reactionTimes.filter(t => t > 0).reduce((a, b) => a + b, 0) / reactionTimes.filter(t => t > 0).length || 0, [reactionTimes])

  if (gameState === 'menu') {
    return (
      <div className={`min-h-screen p-3 md:p-4 lg:p-8 transition-colors duration-300 ${darkMode ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" : "bg-gradient-to-br from-yellow-50 to-orange-50 p-4 md:p-8"}`}">
      <SettingsPanel />
        <div className="max-w-lg mx-auto">
          <Link href="/reaction" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium mb-6 block">
            ← {t('back', 'Back')}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2">⏱️ Timing Game</h1>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Level {level}
            </h2>
            {level > 1 && (
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 font-medium">
                Total Score: <span className="text-yellow-600 font-bold">{totalScore}</span>
              </p>
            )}
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Wait for the screen to turn GREEN, then click as fast as you can!
            </p>
            <div className="bg-yellow-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">Level Settings:</h3>
              <ul className="text-gray-700 dark:text-gray-300 space-y-1 font-medium">
                <li>• Rounds: {settings.rounds}</li>
                <li>• Delay: {settings.minDelay / 1000}-{settings.maxDelay / 1000}s</li>
                <li>• Target Time: {settings.targetTime}ms</li>
              </ul>
            </div>
            <button
              onClick={startRound}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-yellow-600 hover:to-orange-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <header className="p-6 bg-white dark:bg-slate-800 shadow-sm">
        <Link href="/reaction" className="text-yellow-500 hover:underline mb-4 block">
          ← Back
        </Link>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">⏱️ Timing Game</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto text-center mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 mb-6">
            <div className="flex justify-around text-center">
              <div>
                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">Level</p>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-600">{level}/{MAX_LEVELS}</p>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">Round</p>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">{round}/{settings.rounds}</p>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">Score</p>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-600">{score}</p>
              </div>
            </div>
            <div className="mt-4 bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(round / settings.rounds) * 100}%` }}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-full"
              />
            </div>
          </div>
        </div>

        <motion.button
          onClick={handleClick}
          className="w-full aspect-[4/3] rounded-2xl shadow-xl transition-all text-2xl md:text-3xl lg:text-4xl font-bold flex items-center justify-center"
          animate={{
            scale: gameState === 'ready' ? 1.02 : 1,
            backgroundColor: gameState === 'ready' ? '#10B981' : '#EF4444'
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {gameState === 'waiting' && 'Wait for GREEN...'}
          {gameState === 'ready' && 'CLICK NOW!'}
          {gameState === 'finished' && (
            <div>
              {reactionTime === -1 ? (
                <div>
                  <p className="text-2xl mb-2">Too early! 😅</p>
                  <p className="text-xl">Click to continue</p>
                </div>
              ) : (
                <div>
                  <p className="text-2xl mb-2">{reactionTime}ms</p>
                  <p className="text-xl">Click to continue</p>
                </div>
              )}
            </div>
          )}
        </motion.button>

        <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg max-w-lg mx-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Previous Times</h2>
          <div className="space-y-2">
            {reactionTimes.map((time, i) => (
              <div key={i} className="flex justify-between text-sm md:text-base lg:text-lg">
                <span className="text-gray-600 dark:text-gray-400">Round {i + 1}:</span>
                <span className={time === -1 ? 'text-red-500' : 'text-green-500'}>
                  {time === -1 ? 'Too early' : `${time}ms`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Level Complete */}
        {gameState === 'levelComplete' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <div className="text-6xl mb-4 text-center">✅</div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-yellow-600 mb-4 text-center">Level {level} Complete!</h2>
              <div className="bg-yellow-50 rounded-xl p-6 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">Level Score</p>
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-600">{score}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">Total Score</p>
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">{totalScore + score}</p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-gray-600 dark:text-gray-400">Avg Time: {avgTime > 0 ? `${Math.round(avgTime)}ms` : 'N/A'}</p>
                  <p className="text-gray-600 dark:text-gray-400">Target: {settings.targetTime}ms</p>
                </div>
              </div>
              <button
                onClick={nextLevel}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-yellow-600 hover:to-orange-600 shadow-lg transition-all w-full mb-3"
              >
                {level < MAX_LEVELS ? `Next Level ${level + 1}` : 'View Final Score'}
              </button>
              <button
                onClick={startGame}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:text-white font-medium w-full text-center"
              >
                Restart from Level 1
              </button>
            </div>
          </motion.div>
        )}

        {/* Victory */}
        {gameState === 'victory' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <div className="text-6xl mb-4 text-center">🎉</div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-yellow-600 mb-4 text-center">Congratulations!</h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 text-center mb-6">
                You completed all {MAX_LEVELS} levels!
              </p>
              <div className="bg-yellow-50 rounded-xl p-6 mb-6">
                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium text-center">Final Score</p>
                <p className="text-5xl font-bold text-yellow-600 text-center">{totalScore + score}</p>
              </div>
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-yellow-600 hover:to-orange-600 shadow-lg transition-all w-full"
              >
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
