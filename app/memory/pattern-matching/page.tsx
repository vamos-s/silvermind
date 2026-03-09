'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'
import { PATTERN_MATCHING_LEVELS } from '@/lib/game-data/levels'
import { GAME_COLORS } from '@/lib/game-data/colors'

const MAX_LEVELS = 30

type PatternItem = {
  id: number
  color: string
  filled: boolean
}

const COLORS = GAME_COLORS.basic

export default function PatternMatchingPage() {
  const { t } = useTranslation()
  const { addSession } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'showing' | 'input' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [pattern, setPattern] = useState<PatternItem[]>([])
  const [userPattern, setUserPattern] = useState<PatternItem[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)

  const settings = useMemo(
    () => PATTERN_MATCHING_LEVELS[Math.min(level - 1, PATTERN_MATCHING_LEVELS.length - 1)],
    [level]
  )

  const getLevelScore = useCallback((correct: number) => {
    const baseScore = correct * 100
    const timeBonus = timeLeft * 5
    return baseScore + timeBonus
  }, [timeLeft])

  const generatePattern = useCallback(() => {
    const newPattern: PatternItem[] = []
    for (let i = 0; i < settings.patternSize; i++) {
      newPattern.push({
        id: i,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        filled: Math.random() > 0.5
      })
    }
    return newPattern
  }, [settings.patternSize])

  const startLevel = useCallback(() => {
    const newPattern = generatePattern()
    setPattern(newPattern)
    setUserPattern(newPattern.map(item => ({ ...item, filled: false })))
    setTimeLeft(settings.inputTime)
    setGameState('showing')

    setTimeout(() => {
      setGameState('input')
    }, settings.displayTime)
  }, [generatePattern, settings.inputTime, settings.displayTime])

  const startGame = useCallback(() => {
    setScore(0)
    setTotalScore(0)
    setLevel(1)
    startLevel()
  }, [startLevel])

  const toggleCell = useCallback((id: number) => {
    if (gameState !== 'input') return
    setUserPattern(prev => prev.map(item =>
      item.id === id ? { ...item, filled: !item.filled } : item
    ))
  }, [gameState])

  const handleSubmit = useCallback(() => {
    const correct = pattern.filter((item, index) => {
      const userItem = userPattern[index]
      return userItem && userItem.filled === item.filled
    }).length

    setCorrectCount(correct)
    const levelScore = Math.round(getLevelScore(correct))
    setScore(levelScore)
    setGameState('levelComplete')
  }, [pattern, userPattern, getLevelScore])

  const nextLevel = useCallback(() => {
    const levelScore = score
    setTotalScore(prev => prev + levelScore)

    if (level >= MAX_LEVELS) {
      addSession({
        id: Date.now().toString(),
        gameId: 'pattern-matching',
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
  }, [score, level, totalScore, startLevel, addSession])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (gameState === 'input' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (gameState === 'input' && timeLeft === 0) {
      handleSubmit()
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [gameState, timeLeft])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link
          href="/memory"
          className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium mb-6 text-lg"
        >
          <span className="mr-2">←</span> {t('back', 'Back')}
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          {t('patternMatching.title', 'Pattern Matching')}
        </h1>
        <p className="text-lg text-gray-700 font-medium mb-8">
          {t('patternMatching.description', 'Remember the pattern and recreate it!')}
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
                Total Score: <span className="text-indigo-600 font-bold">{totalScore}</span>
              </p>
            )}
            <div className="bg-indigo-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 mb-2">{t('patternMatching.levelInfo', 'Level Settings')}:</h3>
              <ul className="text-gray-700 space-y-1 font-medium">
                <li>• {t('patternMatching.patternSize', 'Pattern Size')}: {settings.patternSize} cells</li>
                <li>• {t('patternMatching.displayTime', 'Display Time')}: {settings.displayTime / 1000}s</li>
                <li>• {t('patternMatching.inputTime', 'Input Time')}: {settings.inputTime}s</li>
              </ul>
            </div>
            <button
              onClick={startLevel}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-indigo-600 hover:to-purple-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Showing pattern */}
        {gameState === 'showing' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-xl text-gray-600 mb-4 font-medium">
              {t('patternMatching.memorize', 'Memorize the pattern!')}
            </p>
            <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
              {pattern.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: item.id * 0.05 }}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-xl ${item.color} ${item.filled ? 'opacity-100' : 'opacity-30'} transition-all duration-200`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Input phase */}
        {gameState === 'input' && (
          <>
            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('patternMatching.level', 'Level')}</p>
                  <p className="text-3xl font-bold text-indigo-600">{level}/{MAX_LEVELS}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('patternMatching.score', 'Score')}</p>
                  <p className="text-3xl font-bold text-purple-600">{totalScore}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('patternMatching.timeLeft', 'Time Left')}</p>
                  <p className={`text-4xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-indigo-600'}`}>
                    {timeLeft}s
                  </p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((level - 1) / MAX_LEVELS) * 100}%` }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full"
                />
              </div>
            </div>

            {/* Pattern grid */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
              <p className="text-xl text-gray-600 mb-4 font-medium">
                {t('patternMatching.recreate', 'Recreate the pattern!')}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                {t('patternMatching.clickToToggle', 'Click cells to toggle filled/empty')}
              </p>
              <div className="grid grid-cols-4 gap-3 max-w-md mx-auto mb-6">
                {userPattern.map((item) => (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleCell(item.id)}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-xl ${item.color} ${item.filled ? 'opacity-100' : 'opacity-30'} transition-all duration-200`}
                  />
                ))}
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-2xl font-bold py-4 rounded-xl hover:from-indigo-600 hover:to-purple-600 shadow-lg transition-all"
              >
                {t('patternMatching.submit', 'Submit')}
              </button>
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
            <h2 className="text-4xl font-bold text-indigo-600 mb-4">Level {level} Complete!</h2>
            <div className="bg-indigo-50 rounded-xl p-6 mb-6">
              <div className="text-center mb-4">
                <p className="text-6xl font-bold text-indigo-600 mb-2">
                  {correctCount}/{pattern.length}
                </p>
                <p className="text-xl text-gray-600">
                  {t('patternMatching.correctCells', 'Correct cells')}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('patternMatching.levelScore', 'Level Score')}</p>
                  <p className="text-3xl font-bold text-indigo-600">{score}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('patternMatching.totalScore', 'Total Score')}</p>
                  <p className="text-3xl font-bold text-purple-600">{totalScore + score}</p>
                </div>
              </div>
            </div>
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-indigo-600 hover:to-purple-600 shadow-lg transition-all w-full mb-3"
            >
              {level < MAX_LEVELS ? `Next Level ${level + 1}` : 'View Final Score'}
            </button>
            <button
              onClick={startGame}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              {t('patternMatching.restart', 'Restart from Level 1')}
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
            <h2 className="text-4xl font-bold text-indigo-600 mb-4">{t('patternMatching.victory', 'Congratulations!')}</h2>
            <p className="text-xl text-gray-700 font-medium mb-6">
              {t('patternMatching.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className="bg-indigo-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 text-sm font-medium">{t('patternMatching.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-indigo-600">{totalScore + score}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-indigo-600 hover:to-purple-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
