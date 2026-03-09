'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

import { SettingsPanel } from "@/components/SettingsPanel"
const MAX_LEVELS = 30

type Comparison = {
  id: number
  item1X: number
  item1Y: number
  item2X: number
  item2Y: number
  correctAnswer: 'closer' | 'farther'
}

const LEVEL_SETTINGS = [
  // Levels 1-5: Easy introduction
  { comparisonCount: 3, inputTime: 25, difficulty: 'easy' },    // Level 1
  { comparisonCount: 4, inputTime: 28, difficulty: 'easy' },    // Level 2
  { comparisonCount: 4, inputTime: 26, difficulty: 'easy' },    // Level 3
  { comparisonCount: 5, inputTime: 30, difficulty: 'easy' },    // Level 4
  { comparisonCount: 5, inputTime: 28, difficulty: 'easy' },    // Level 5

  // Levels 6-10: Medium challenge
  { comparisonCount: 6, inputTime: 32, difficulty: 'medium' },  // Level 6
  { comparisonCount: 6, inputTime: 30, difficulty: 'medium' },  // Level 7
  { comparisonCount: 7, inputTime: 34, difficulty: 'medium' },  // Level 8
  { comparisonCount: 7, inputTime: 32, difficulty: 'medium' },  // Level 9
  { comparisonCount: 8, inputTime: 36, difficulty: 'medium' },  // Level 10

  // Levels 11-15: Harder progression
  { comparisonCount: 8, inputTime: 34, difficulty: 'hard' },   // Level 11
  { comparisonCount: 9, inputTime: 38, difficulty: 'hard' },    // Level 12
  { comparisonCount: 9, inputTime: 36, difficulty: 'hard' },    // Level 13
  { comparisonCount: 10, inputTime: 40, difficulty: 'hard' },   // Level 14
  { comparisonCount: 10, inputTime: 38, difficulty: 'hard' },   // Level 15

  // Levels 16-20: Advanced challenge
  { comparisonCount: 11, inputTime: 42, difficulty: 'hard' },    // Level 16
  { comparisonCount: 11, inputTime: 40, difficulty: 'hard' },   // Level 17
  { comparisonCount: 12, inputTime: 44, difficulty: 'hard' },  // Level 18
  { comparisonCount: 12, inputTime: 42, difficulty: 'hard' },  // Level 19
  { comparisonCount: 13, inputTime: 46, difficulty: 'hard' },   // Level 20

  // Levels 21-25: Expert level
  { comparisonCount: 13, inputTime: 44, difficulty: 'expert' }, // Level 21
  { comparisonCount: 14, inputTime: 48, difficulty: 'expert' }, // Level 22
  { comparisonCount: 14, inputTime: 46, difficulty: 'expert' }, // Level 23
  { comparisonCount: 15, inputTime: 50, difficulty: 'expert' }, // Level 24
  { comparisonCount: 15, inputTime: 48, difficulty: 'expert' }, // Level 25

  // Levels 26-30: Master level
  { comparisonCount: 16, inputTime: 52, difficulty: 'expert' }, // Level 26
  { comparisonCount: 16, inputTime: 50, difficulty: 'expert' }, // Level 27
  { comparisonCount: 17, inputTime: 54, difficulty: 'expert' }, // Level 28
  { comparisonCount: 17, inputTime: 52, difficulty: 'expert' }, // Level 29
  { comparisonCount: 18, inputTime: 56, difficulty: 'expert' }, // Level 30
]

const REFERENCE_POINT = { x: 50, y: 50 }

export default function DistanceJudgmentPage() {
  const { t } = useTranslation()
  const { addSession, darkMode } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'showing' | 'input' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [comparisons, setComparisons] = useState<Comparison[]>([])
  const [currentComparisonIndex, setCurrentComparisonIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<('closer' | 'farther')[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const settings = LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)]

  const getLevelScore = (correct: number, total: number) => {
    const baseScore = (correct / total) * 800
    const timeBonus = timeLeft * 12
    return Math.round(baseScore + timeBonus)
  }

  const calculateDistance = (x: number, y: number) => {
    return Math.sqrt(
      Math.pow(x - REFERENCE_POINT.x, 2) +
      Math.pow(y - REFERENCE_POINT.y, 2)
    )
  }

  const generateComparisons = useCallback(() => {
    const newComparisons: Comparison[] = []

    for (let i = 0; i < settings.comparisonCount; i++) {
      const item1Distance = 10 + Math.random() * 35
      const item1Angle = Math.random() * Math.PI * 2
      const item1X = REFERENCE_POINT.x + Math.cos(item1Angle) * item1Distance
      const item1Y = REFERENCE_POINT.y + Math.sin(item1Angle) * item1Distance

      const item2Distance = 10 + Math.random() * 35
      const item2Angle = Math.random() * Math.PI * 2
      const item2X = REFERENCE_POINT.x + Math.cos(item2Angle) * item2Distance
      const item2Y = REFERENCE_POINT.y + Math.sin(item2Angle) * item2Distance

      const dist1 = calculateDistance(item1X, item1Y)
      const dist2 = calculateDistance(item2X, item2Y)
      const correctAnswer = dist1 < dist2 ? 'closer' : 'farther'

      newComparisons.push({
        id: i,
        item1X,
        item1Y,
        item2X,
        item2Y,
        correctAnswer
      })
    }

    return newComparisons
  }, [settings.comparisonCount])

  const startGame = () => {
    setScore(0)
    setTotalScore(0)
    setLevel(1)
    startLevel()
  }

  const startLevel = () => {
    const newComparisons = generateComparisons()
    setComparisons(newComparisons)
    setCurrentComparisonIndex(0)
    setSelectedAnswers([])
    setShowResult(false)
    setTimeLeft(settings.inputTime)
    setGameState('showing')

    setTimeout(() => {
      setGameState('input')
    }, 1500)
  }

  const handleAnswerSelect = (answer: 'closer' | 'farther') => {
    if (gameState !== 'input' || showResult) return

    const newAnswers = [...selectedAnswers]
    newAnswers[currentComparisonIndex] = answer
    setSelectedAnswers(newAnswers)
    setShowResult(true)
  }

  const handleNext = () => {
    setShowResult(false)
    if (currentComparisonIndex < comparisons.length - 1) {
      setCurrentComparisonIndex(prev => prev + 1)
    } else {
      const correctCount = selectedAnswers.filter((answer, index) => {
        const comparison = comparisons[index]
        return answer === comparison.correctAnswer
      }).length

      const levelScore = getLevelScore(correctCount, comparisons.length)
      setScore(levelScore)
      setGameState('levelComplete')
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (gameState === 'input' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (gameState === 'input' && timeLeft === 0) {
      const correctCount = selectedAnswers.filter((answer, index) => {
        const comparison = comparisons[index]
        return answer === comparison.correctAnswer
      }).length

      const levelScore = getLevelScore(correctCount, comparisons.length)
      setScore(levelScore)
      setGameState('levelComplete')
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [gameState, timeLeft, selectedAnswers, comparisons])

  const nextLevel = () => {
    const levelScore = score
    setTotalScore(prev => prev + levelScore)

    if (level >= MAX_LEVELS) {
      addSession({
        id: Date.now().toString(),
        gameId: 'distance-judgment',
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

  const currentComparison = comparisons[currentComparisonIndex]

  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-300 {darkMode ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" : "bg-gradient-to-br from-sky-50 via-white to-blue-50 p-4 md:p-8"}">
      <SettingsPanel />
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link
          href="/spatial"
          className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium mb-6 text-lg"
        >
          <span className="mr-2">←</span> {t('back', 'Back')}
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
          {t('distanceJudgment.title', 'Distance Judgment')}
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-8">
          {t('distanceJudgment.description', 'Which item is closer to the center point?')}
        </p>

        {/* Menu */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Level {level}
            </h2>
            {level > 1 && (
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 font-medium">
                Total Score: <span className="text-sky-600 font-bold">{totalScore}</span>
              </p>
            )}
            <div className="bg-sky-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">{t('distanceJudgment.levelInfo', 'Level Settings')}:</h3>
              <ul className="text-gray-700 dark:text-gray-300 space-y-1 font-medium">
                <li>• {t('distanceJudgment.comparisonCount', 'Comparison Count')}: {settings.comparisonCount}</li>
                <li>• {t('distanceJudgment.inputTime', 'Time Limit')}: {settings.inputTime}s</li>
              </ul>
            </div>
            <button
              onClick={startLevel}
              className="bg-gradient-to-r from-sky-500 to-blue-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-sky-600 hover:to-blue-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Showing comparison */}
        {gameState === 'showing' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 font-medium">
              {t('distanceJudgment.memorize', 'Memorize the positions!')}
            </p>
            <div className="relative w-full aspect-square bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl overflow-hidden">
              {/* Reference point */}
              <div
                className="absolute w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg"
                style={{ left: `${REFERENCE_POINT.x}%`, top: `${REFERENCE_POINT.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">★</span>
              </div>

              {/* Items */}
              <AnimatePresence>
                {currentComparison && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute w-12 h-12 bg-sky-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold"
                      style={{
                        left: `${currentComparison.item1X}%`,
                        top: `${currentComparison.item1Y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      A
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="absolute w-12 h-12 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold"
                      style={{
                        left: `${currentComparison.item2X}%`,
                        top: `${currentComparison.item2Y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      B
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Input phase */}
        {gameState === 'input' && (
          <>
            {/* Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('distanceJudgment.question', 'Question')}</p>
                  <p className="text-3xl font-bold text-sky-600">
                    {currentComparisonIndex + 1}/{comparisons.length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('distanceJudgment.score', 'Score')}</p>
                  <p className="text-3xl font-bold text-blue-600">{totalScore}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('distanceJudgment.timeLeft', 'Time Left')}</p>
                  <p className={`text-4xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-sky-600'}`}>
                    {timeLeft}s
                  </p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentComparisonIndex) / comparisons.length) * 100}%` }}
                  className="bg-gradient-to-r from-sky-500 to-blue-500 h-full"
                />
              </div>
            </div>

            {/* Question area */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-6 text-center">
              {currentComparison && (
                <>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                    {t('distanceJudgment.whichIsCloser', 'Which is closer to the center?')}
                  </p>

                  <div className="relative w-full aspect-square bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl overflow-hidden mb-6">
                    {/* Reference point */}
                    <div
                      className="absolute w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg"
                      style={{ left: `${REFERENCE_POINT.x}%`, top: `${REFERENCE_POINT.y}%`, transform: 'translate(-50%, -50%)' }}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">★</span>
                    </div>

                    {/* Items */}
                    <div
                      className="absolute w-12 h-12 bg-sky-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold"
                      style={{
                        left: `${currentComparison.item1X}%`,
                        top: `${currentComparison.item1Y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      A
                    </div>
                    <div
                      className="absolute w-12 h-12 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold"
                      style={{
                        left: `${currentComparison.item2X}%`,
                        top: `${currentComparison.item2Y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      B
                    </div>
                  </div>

                  {showResult ? (
                    <div className="mb-6">
                      <div className={`p-4 rounded-xl ${
                        selectedAnswers[currentComparisonIndex] === currentComparison.correctAnswer
                          ? 'bg-green-50 border-2 border-green-500'
                          : 'bg-red-50 border-2 border-red-500'
                      }`}>
                        <p className="text-lg font-bold mb-2">
                          {selectedAnswers[currentComparisonIndex] === currentComparison.correctAnswer
                            ? '✅ Correct!'
                            : '❌ Incorrect!'}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          {t('distanceJudgment.correctAnswer', 'Correct Answer')}: {currentComparison.correctAnswer === 'closer' ? 'A' : 'B'}
                        </p>
                      </div>
                      <button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-sky-500 to-blue-500 text-white text-xl font-bold py-3 px-8 rounded-xl hover:from-sky-600 hover:to-blue-600 shadow-lg transition-all"
                      >
                        {currentComparisonIndex < comparisons.length - 1
                          ? t('distanceJudgment.nextQuestion', 'Next Question')
                          : t('distanceJudgment.seeResults', 'See Results')}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAnswerSelect('closer')}
                        className="p-6 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold text-xl shadow-lg transition-all"
                      >
                        A
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAnswerSelect('farther')}
                        className="p-6 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-xl shadow-lg transition-all"
                      >
                        B
                      </motion.button>
                    </div>
                  )}
                </>
              )}
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
            <div className="text-6xl mb-4">
              {score > 0 ? '✅' : '❌'}
            </div>
            <h2 className={`text-4xl font-bold mb-4 ${score > 0 ? 'text-sky-600' : 'text-red-500'}`}>
              {score > 0 ? `Level ${level} Complete!` : 'Level Failed!'}
            </h2>
            {score > 0 ? (
              <div className="bg-sky-50 rounded-xl p-6 mb-6">
                <div className="text-center mb-4">
                  <p className="text-6xl font-bold text-sky-600 mb-2">
                    {selectedAnswers.filter((answer, index) => answer === comparisons[index]?.correctAnswer).length}/{comparisons.length}
                  </p>
                  <p className="text-xl text-gray-600 dark:text-gray-400">
                    {t('distanceJudgment.correctAnswers', 'Correct Answers')}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('distanceJudgment.levelScore', 'Level Score')}</p>
                    <p className="text-3xl font-bold text-sky-600">{score}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('distanceJudgment.totalScore', 'Total Score')}</p>
                    <p className="text-3xl font-bold text-blue-600">{totalScore + score}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 rounded-xl p-6 mb-6">
                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('distanceJudgment.levelScore', 'Level Score')}</p>
                <p className="text-3xl font-bold text-red-600">{score}</p>
              </div>
            )}
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-sky-500 to-blue-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-sky-600 hover:to-blue-600 shadow-lg transition-all w-full mb-3"
            >
              {level < MAX_LEVELS ? `Next Level ${level + 1}` : 'View Final Score'}
            </button>
            <button
              onClick={startGame}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:text-white font-medium"
            >
              {t('distanceJudgment.restart', 'Restart from Level 1')}
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
            <h2 className="text-4xl font-bold text-sky-600 mb-4">{t('distanceJudgment.victory', 'Congratulations!')}</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 font-medium mb-6">
              {t('distanceJudgment.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className="bg-sky-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('distanceJudgment.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-sky-600">{totalScore + score}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-sky-500 to-blue-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-sky-600 hover:to-blue-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
