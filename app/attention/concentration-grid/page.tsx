'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

const MAX_LEVELS = 30

const LEVEL_SETTINGS = [
  { gridSize: 8, maxNumber: 20, timeLimit: 45 },  // Level 1
  { gridSize: 8, maxNumber: 25, timeLimit: 45 },  // Level 2
  { gridSize: 8, maxNumber: 30, timeLimit: 40 },  // Level 3
  { gridSize: 9, maxNumber: 30, timeLimit: 45 },  // Level 4
  { gridSize: 9, maxNumber: 35, timeLimit: 40 },  // Level 5
  { gridSize: 9, maxNumber: 40, timeLimit: 40 },  // Level 6
  { gridSize: 10, maxNumber: 40, timeLimit: 45 },  // Level 7
  { gridSize: 10, maxNumber: 45, timeLimit: 40 },  // Level 8
  { gridSize: 10, maxNumber: 50, timeLimit: 40 },  // Level 9
  { gridSize: 10, maxNumber: 55, timeLimit: 35 },  // Level 10
  { gridSize: 10, maxNumber: 60, timeLimit: 35 },  // Level 11
  { gridSize: 10, maxNumber: 65, timeLimit: 35 },  // Level 12
  { gridSize: 10, maxNumber: 70, timeLimit: 30 },  // Level 13
  { gridSize: 10, maxNumber: 75, timeLimit: 30 },  // Level 14
  { gridSize: 10, maxNumber: 80, timeLimit: 30 },  // Level 15
  { gridSize: 10, maxNumber: 85, timeLimit: 28 },  // Level 16
  { gridSize: 10, maxNumber: 90, timeLimit: 28 },  // Level 17
  { gridSize: 10, maxNumber: 95, timeLimit: 28 },  // Level 18
  { gridSize: 10, maxNumber: 100, timeLimit: 25 },  // Level 19
  { gridSize: 10, maxNumber: 100, timeLimit: 25 },  // Level 20
  { gridSize: 10, maxNumber: 100, timeLimit: 22 },  // Level 21
  { gridSize: 10, maxNumber: 100, timeLimit: 22 },  // Level 22
  { gridSize: 10, maxNumber: 100, timeLimit: 20 },  // Level 23
  { gridSize: 10, maxNumber: 100, timeLimit: 20 },  // Level 24
  { gridSize: 10, maxNumber: 100, timeLimit: 18 },  // Level 25
  { gridSize: 10, maxNumber: 100, timeLimit: 18 },  // Level 26
  { gridSize: 10, maxNumber: 100, timeLimit: 15 },  // Level 27
  { gridSize: 10, maxNumber: 100, timeLimit: 15 },  // Level 28
  { gridSize: 10, maxNumber: 100, timeLimit: 12 },  // Level 29
  { gridSize: 10, maxNumber: 100, timeLimit: 12 },  // Level 30
]

export default function ConcentrationGridPage() {
  const { t } = useTranslation()
  const { addSession } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [currentNumber, setCurrentNumber] = useState(1)
  const [numbers, setNumbers] = useState<{ value: number; found: boolean }[]>([])

  const settings = useMemo(
    () => LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)],
    [level]
  )

  const getLevelScore = useCallback(() => {
    const baseScore = level * 50
    const timeBonus = timeLeft * 5
    return baseScore + timeBonus
  }, [level, timeLeft])

  const generateNumbers = useCallback(() => {
    const maxNumber = settings.maxNumber
    const numberArray: { value: number; found: boolean }[] = []

    for (let i = 1; i <= maxNumber; i++) {
      numberArray.push({ value: i, found: false })
    }

    // Shuffle
    for (let i = numberArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[numberArray[i], numberArray[j]] = [numberArray[j], numberArray[i]]
    }

    return numberArray
  }, [settings.maxNumber])

  const generateLevel = useCallback(() => {
    const timeLimit = LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)].timeLimit
    setTimeLeft(timeLimit)
    setNumbers(generateNumbers())
    setCurrentNumber(1)
  }, [level, generateNumbers])

  const handleNumberClick = useCallback((numObj: { value: number; found: boolean }) => {
    if (gameState !== 'playing') return
    if (numObj.found) return
    if (numObj.value !== currentNumber) return

    const newNumbers = numbers.map(n =>
      n.value === numObj.value ? { ...n, found: true } : n
    )
    setNumbers(newNumbers)

    if (numObj.value >= settings.maxNumber) {
      const levelScore = Math.round(getLevelScore())
      setScore(levelScore)
      setGameState('levelComplete')
    } else {
      setCurrentNumber(prev => prev + 1)
    }
  }, [gameState, currentNumber, numbers, settings.maxNumber, getLevelScore])

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
        gameId: 'concentration-grid',
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
            gameId: 'concentration-grid',
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link
          href="/attention"
          className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium mb-6 text-lg"
        >
          <span className="mr-2">←</span> {t('back', 'Back')}
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          {t('concentrationGrid.title', 'Concentration Grid')}
        </h1>
        <p className="text-lg text-gray-700 font-medium mb-8">
          {t('concentrationGrid.description', 'Find numbers in order as fast as you can!')}
        </p>

        {/* Menu */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">🔢</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Level {level}
            </h2>
            <div className="bg-violet-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 mb-2">{t('concentrationGrid.levelInfo', 'Level Settings')}:</h3>
              <ul className="text-gray-700 space-y-1 font-medium">
                <li>• {t('concentrationGrid.gridSize', 'Grid')}: {settings.gridSize} × {settings.gridSize}</li>
                <li>• {t('concentrationGrid.maxNumber', 'Numbers')}: 1-{settings.maxNumber}</li>
                <li>• {t('concentrationGrid.timeLimit', 'Time Limit')}: {settings.timeLimit}s</li>
              </ul>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-violet-600 hover:to-purple-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Playing */}
        {gameState === 'playing' && (
          <>
            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('concentrationGrid.level', 'Level')}</p>
                  <p className="text-3xl font-bold text-violet-600">{level}/{MAX_LEVELS}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('concentrationGrid.score', 'Score')}</p>
                  <p className="text-3xl font-bold text-purple-600">{totalScore}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('concentrationGrid.timeLeft', 'Time')}</p>
                  <p className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-violet-600'}`}>{timeLeft}s</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('concentrationGrid.currentNumber', 'Find')}</p>
                  <p className="text-3xl font-bold text-violet-600">{currentNumber}</p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((level - 1) / MAX_LEVELS) * 100}%` }}
                  className="bg-gradient-to-r from-violet-500 to-purple-500 h-full"
                />
              </div>
            </div>

            {/* Game Grid */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${settings.gridSize}, minmax(0, 1fr))` }}
              >
                {numbers.map((num, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: num.found ? 1 : 1.05 }}
                    whileTap={{ scale: num.found ? 1 : 0.95 }}
                    onClick={() => handleNumberClick(num)}
                    disabled={num.found || num.value !== currentNumber}
                    className={`aspect-square rounded-lg font-bold text-lg md:text-xl transition-all ${
                      num.found
                        ? 'bg-green-500 text-white'
                        : num.value === currentNumber
                        ? 'bg-violet-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    } ${num.value !== currentNumber ? 'cursor-not-allowed' : ''}`}
                  >
                    {num.found ? '✓' : num.value}
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
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-4xl font-bold text-violet-600 mb-4">Level {level} Complete!</h2>
            <div className="bg-violet-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('concentrationGrid.levelScore', 'Level Score')}</p>
                  <p className="text-3xl font-bold text-violet-600">{Math.round(score)}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('concentrationGrid.totalScore', 'Total Score')}</p>
                  <p className="text-3xl font-bold text-purple-600">{totalScore + Math.round(score)}</p>
                </div>
              </div>
            </div>
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-violet-600 hover:to-purple-600 shadow-lg transition-all w-full"
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
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">{t('concentrationGrid.gameOver', 'Time\'s Up!')}</h2>
            <div className="bg-orange-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 text-sm font-medium">{t('concentrationGrid.finalScore', 'Final Score')}</p>
              <p className="text-3xl font-bold text-orange-600">{totalScore}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-red-600 shadow-lg transition-all w-full"
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
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-violet-600 mb-4">{t('concentrationGrid.victory', 'Congratulations!')}</h2>
            <p className="text-xl text-gray-700 font-medium mb-6">
              {t('concentrationGrid.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className="bg-violet-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 text-sm font-medium">{t('concentrationGrid.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-violet-600">{totalScore + Math.round(score)}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-violet-600 hover:to-purple-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
