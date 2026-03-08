'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

type Color = { name: string, color: string, hex: string }

const COLORS: Record<string, Color[]> = {
  easy: [
    { name: 'red', color: 'text-red-500', hex: '#ef4444' },
    { name: 'blue', color: 'text-blue-500', hex: '#3b82f6' },
    { name: 'green', color: 'text-green-500', hex: '#22c55e' },
    { name: 'yellow', color: 'text-yellow-500', hex: '#eab308' },
  ],
  medium: [
    { name: 'red', color: 'text-red-500', hex: '#ef4444' },
    { name: 'blue', color: 'text-blue-500', hex: '#3b82f6' },
    { name: 'green', color: 'text-green-500', hex: '#22c55e' },
    { name: 'yellow', color: 'text-yellow-500', hex: '#eab308' },
    { name: 'orange', color: 'text-orange-500', hex: '#f97316' },
    { name: 'purple', color: 'text-purple-500', hex: '#a855f7' },
  ],
  hard: [
    { name: 'red', color: 'text-red-500', hex: '#ef4444' },
    { name: 'blue', color: 'text-blue-500', hex: '#3b82f6' },
    { name: 'green', color: 'text-green-500', hex: '#22c55e' },
    { name: 'yellow', color: 'text-yellow-500', hex: '#eab308' },
    { name: 'orange', color: 'text-orange-500', hex: '#f97316' },
    { name: 'purple', color: 'text-purple-500', hex: '#a855f7' },
    { name: 'pink', color: 'text-pink-500', hex: '#ec4899' },
    { name: 'teal', color: 'text-teal-500', hex: '#14b8a6' },
  ],
}

const GAME_DURATION = 60

export default function ColorMatchPage() {
  const { t } = useTranslation()
  const { currentDifficulty, addSession } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu')
  const [currentColors] = useState(COLORS[currentDifficulty as keyof typeof COLORS] || COLORS.easy)
  const [currentWord, setCurrentWord] = useState<Color>(currentColors[0])
  const [currentColor, setCurrentColor] = useState<Color>(currentColors[0])
  const [mode, setMode] = useState<'text' | 'color'>('text')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [showFeedback, setShowFeedback] = useState<{ correct: boolean, answer: string } | null>(null)

  const generateQuestion = useCallback(() => {
    const wordIndex = Math.floor(Math.random() * currentColors.length)
    const colorIndex = Math.floor(Math.random() * currentColors.length)

    setCurrentWord(currentColors[wordIndex])
    setCurrentColor(currentColors[colorIndex])
    setMode(Math.random() > 0.5 ? 'text' : 'color')
  }, [currentColors])

  const startGame = () => {
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setTimeLeft(GAME_DURATION)
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
      setShowFeedback({ correct: true, answer })
    } else {
      setStreak(0)
      setShowFeedback({ correct: false, answer })
    }

    setTimeout(() => {
      setShowFeedback(null)
      generateQuestion()
    }, 300)
  }

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (gameState === 'playing' && timeLeft === 0) {
      addSession('color-match', currentDifficulty, score, score)
      setGameState('result')
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [gameState, timeLeft, score, currentDifficulty, addSession])

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-indigo-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <Link
          href="/reaction"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 text-lg"
        >
          <span className="mr-2">←</span> {t('back')}
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
          {t('colorMatch.title', 'Color Match')}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {t('colorMatch.description', 'Quick! Match the color or word!')}
        </p>

        {/* Timer and Score */}
        {gameState === 'playing' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex justify-around text-center">
              <div>
                <p className="text-gray-600 text-lg mb-1">{t('colorMatch.timeLeft', 'Time Left')}</p>
                <p className={`text-4xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-rose-600'}`}>
                  {timeLeft}s
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-lg mb-1">{t('colorMatch.score', 'Score')}</p>
                <p className="text-4xl font-bold text-indigo-600">
                  {score}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-lg mb-1">{t('colorMatch.streak', 'Streak')}</p>
                <p className={`text-4xl font-bold ${streak >= 5 ? 'text-green-500' : 'text-amber-600'}`}>
                  {streak}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Game Area */}
        {gameState === 'playing' && (
          <>
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
              <p className="text-xl text-gray-600 mb-2">
                {mode === 'text'
                  ? t('colorMatch.matchText', 'Match the TEXT color')
                  : t('colorMatch.matchWord', 'Match the WORD meaning')
                }
              </p>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-2xl font-bold mb-2 ${showFeedback.correct ? 'text-green-500' : 'text-red-500'}`}
                >
                  {showFeedback.correct ? t('correct', 'Correct') : t('incorrect', 'Wrong')} - {showFeedback.answer}
                </motion.div>
              )}
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

        {/* Menu */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t('colorMatch.ready', 'Ready to test your reaction?')}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {t('colorMatch.instructions', 'A color word appears in a different color. Click the button matching either the TEXT color or the WORD meaning!')}
            </p>
            <div className="space-y-4">
              <p className="text-gray-700">
                <span className="text-rose-600 font-bold">{t('colorMatch.example1', 'Example:')}</span>
              </p>
              <p className={`text-3xl font-bold text-blue-500 mb-2`}>
                RED
              </p>
              <p className="text-gray-600 mb-6">
                {t('colorMatch.example2', 'If asked to match the TEXT color, click BLUE!')}
              </p>
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-rose-500 to-indigo-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-rose-600 hover:to-indigo-600 shadow-lg transition-all w-full"
              >
                {t('start', 'Start')}
              </button>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {gameState === 'result' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t('colorMatch.results', 'Time\'s Up!')}
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              {t('colorMatch.finalScore', 'Your score:')}
            </p>
            <p className="text-6xl font-bold text-rose-600 mb-4">
              {score}
            </p>
            <div className="flex justify-center gap-8 mb-6">
              <div>
                <p className="text-gray-600 mb-1">{t('colorMatch.bestStreak', 'Best Streak')}</p>
                <p className="text-3xl font-bold text-amber-600">
                  {bestStreak}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">{t('colorMatch.avgPerSec', 'Avg/Sec')}</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {(score / GAME_DURATION).toFixed(1)}
                </p>
              </div>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-rose-500 to-indigo-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-rose-600 hover:to-indigo-600 shadow-lg transition-all"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
