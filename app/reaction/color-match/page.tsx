'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

type Color = { name: string, color: string, hex: string }

const COLORS = [
  { name: 'red', color: 'text-red-500', hex: '#ef4444' },
  { name: 'blue', color: 'text-blue-500', hex: '#3b82f6' },
  { name: 'green', color: 'text-green-500', hex: '#22c55e' },
  { name: 'yellow', color: 'text-yellow-500', hex: '#eab308' },
  { name: 'orange', color: 'text-orange-500', hex: '#f97316' },
  { name: 'purple', color: 'text-purple-500', hex: '#a855f7' },
  { name: 'pink', color: 'text-pink-500', hex: '#ec4899' },
  { name: 'teal', color: 'text-teal-500', hex: '#14b8a6' },
]

const MAX_LEVELS = 10

const LEVEL_SETTINGS = [
  { colorCount: 4, duration: 60, targetScore: 30 },    // Level 1
  { colorCount: 4, duration: 55, targetScore: 35 },    // Level 2
  { colorCount: 5, duration: 55, targetScore: 40 },    // Level 3
  { colorCount: 5, duration: 50, targetScore: 45 },    // Level 4
  { colorCount: 6, duration: 50, targetScore: 50 },    // Level 5
  { colorCount: 6, duration: 45, targetScore: 55 },    // Level 6
  { colorCount: 7, duration: 45, targetScore: 60 },    // Level 7
  { colorCount: 7, duration: 40, targetScore: 65 },    // Level 8
  { colorCount: 8, duration: 40, targetScore: 70 },    // Level 9
  { colorCount: 8, duration: 35, targetScore: 75 },    // Level 10
]

export default function ColorMatchPage() {
  const { t } = useTranslation()
  const { addSession } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [currentColors, setCurrentColors] = useState<Color[]>(COLORS.slice(0, 4))
  const [currentWord, setCurrentWord] = useState<Color>(COLORS[0])
  const [currentColor, setCurrentColor] = useState<Color>(COLORS[0])
  const [mode, setMode] = useState<'text' | 'color'>('text')
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [level, setLevel] = useState(1)

  const settings = LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)]

  const generateQuestion = useCallback(() => {
    const wordIndex = Math.floor(Math.random() * currentColors.length)
    const colorIndex = Math.floor(Math.random() * currentColors.length)

    setCurrentWord(currentColors[wordIndex])
    setCurrentColor(currentColors[colorIndex])
    setMode(Math.random() > 0.5 ? 'text' : 'color')
  }, [currentColors])

  const startGame = () => {
    setScore(0)
    setTotalScore(0)
    setStreak(0)
    setBestStreak(0)
    setLevel(1)
    startLevel()
  }

  const startLevel = () => {
    const colors = COLORS.slice(0, settings.colorCount)
    setCurrentColors(colors)
    setCurrentWord(colors[0])
    setCurrentColor(colors[0])
    setScore(0)
    setStreak(0)
    setTimeLeft(settings.duration)
    setGameState('playing')
    generateQuestion()
  }

  const handleAnswer = (color: Color) => {
    let correct = false
    let answer = ''

    if (mode === 'text') {
      correct = color.name === currentWord.name
      answer = currentWord.name
    } else {
      correct = color.name === currentColor.name
      answer = currentColor.name
    }

    if (correct) {
      setScore(prev => prev + 1)
      setStreak(prev => {
        const newStreak = prev + 1
        if (newStreak > bestStreak) {
          setBestStreak(newStreak)
        }
        return newStreak
      })
    } else {
      setStreak(0)
    }

    // Check if target score reached
    if (score + 1 >= settings.targetScore) {
      setGameState('levelComplete')
    } else {
      generateQuestion()
    }
  }

  const nextLevel = () => {
    setTotalScore(prev => prev + score)

    if (level >= MAX_LEVELS) {
      addSession({
        id: Date.now().toString(),
        gameId: 'color-match',
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
  }

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (gameState === 'playing' && timeLeft === 0) {
      addSession({
        id: Date.now().toString(),
        gameId: 'color-match',
        difficulty: 'medium',
        score: totalScore,
        completedAt: new Date(),
        durationSeconds: settings.duration
      })
      setGameState('gameOver')
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [gameState, timeLeft, totalScore, settings.duration, addSession])

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-indigo-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link
          href="/reaction"
          className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium mb-6 text-lg"
        >
          <span className="mr-2">←</span> {t('back', 'Back')}
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          {t('colorMatch.title', 'Color Match')}
        </h1>
        <p className="text-lg text-gray-700 font-medium mb-8">
          {t('colorMatch.description', 'Quick! Match color or word!')}
        </p>

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
                Total Score: <span className="text-rose-600 font-bold">{totalScore}</span>
              </p>
            )}
            <div className="bg-rose-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 mb-2">{t('colorMatch.levelInfo', 'Level Settings')}:</h3>
              <ul className="text-gray-700 space-y-1 font-medium">
                <li>• {t('colorMatch.colors', 'Colors')}: {settings.colorCount}</li>
                <li>• {t('colorMatch.timeLimit', 'Time Limit')}: {settings.duration}s</li>
                <li>• {t('colorMatch.targetScore', 'Target Score')}: {settings.targetScore}</li>
              </ul>
            </div>
            <button
              onClick={startLevel}
              className="bg-gradient-to-r from-rose-500 to-indigo-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-rose-600 hover:to-indigo-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Playing */}
        {gameState === 'playing' && (
          <>
            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('colorMatch.level', 'Level')}</p>
                  <p className="text-3xl font-bold text-rose-600">{level}/{MAX_LEVELS}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('colorMatch.score', 'Score')}</p>
                  <p className="text-3xl font-bold text-indigo-600">{score}/{settings.targetScore}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('colorMatch.timeLeft', 'Time')}</p>
                  <p className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-rose-600'}`}>
                    {timeLeft}s
                  </p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(score / settings.targetScore) * 100}%` }}
                  className="bg-gradient-to-r from-rose-500 to-indigo-500 h-full"
                />
              </div>
            </div>

            {/* Word display */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
              <motion.div
                key={currentWord.name + currentColor.hex}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-6xl md:text-8xl font-bold mb-4 ${currentColor.color}`}
                style={{ textShadow: `0 0 20px ${currentColor.hex}40` }}
              >
                {currentWord.name.toUpperCase()}
              </motion.div>
              <p className="text-xl text-gray-700 font-medium mb-2">
                {mode === 'text'
                  ? t('colorMatch.matchText', 'Match TEXT color')
                  : t('colorMatch.matchWord', 'Match WORD meaning')
                }
              </p>
            </div>

            {/* Color buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentColors.map((color) => (
                <motion.button
                  key={color.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(color)}
                  className="bg-white rounded-2xl shadow-lg p-4 md:p-6 flex flex-col items-center justify-center h-32 md:h-40 border-4 border-gray-200 hover:border-rose-300 transition-all"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full mb-3" style={{ backgroundColor: color.hex }}></div>
                  <span className={`text-xl md:text-2xl font-bold ${color.color}`}>
                    {color.name.toUpperCase()}
                  </span>
                </motion.button>
              ))}
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
            <h2 className="text-4xl font-bold text-rose-600 mb-4">Level {level} Complete!</h2>
            <div className="bg-rose-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('colorMatch.levelScore', 'Level Score')}</p>
                  <p className="text-3xl font-bold text-rose-600">{score}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('colorMatch.totalScore', 'Total Score')}</p>
                  <p className="text-3xl font-bold text-indigo-600">{totalScore + score}</p>
                </div>
              </div>
            </div>
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-rose-500 to-indigo-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-rose-600 hover:to-indigo-600 shadow-lg transition-all w-full mb-3"
            >
              {level < MAX_LEVELS ? `Next Level ${level + 1}` : 'View Final Score'}
            </button>
            <button
              onClick={startGame}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              {t('colorMatch.restart', 'Restart from Level 1')}
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
            <h2 className="text-4xl font-bold text-gray-800 mb-4">{t('colorMatch.gameOver', 'Game Over!')}</h2>
            <div className="bg-orange-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 text-sm font-medium">{t('colorMatch.finalScore', 'Final Score')}</p>
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
              {t('colorMatch.restart', 'Restart from Level 1')}
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
            <h2 className="text-4xl font-bold text-rose-600 mb-4">{t('colorMatch.victory', 'Congratulations!')}</h2>
            <p className="text-xl text-gray-700 font-medium mb-6">
              {t('colorMatch.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className="bg-rose-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 text-sm font-medium">{t('colorMatch.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-rose-600">{totalScore + score}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-rose-500 to-indigo-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-rose-600 hover:to-indigo-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
