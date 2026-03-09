'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

import { SettingsPanel } from "@/components/SettingsPanel"
const MAX_LEVELS = 30

type ComplexShape = {
  type: 'cube' | 'pyramid' | 'prism' | 'cylinder'
  size: number
  color: string
}

type Question = {
  id: number
  baseShape: ComplexShape
  shapes: ComplexShape[]
  rotation: number
  options: number[]
  correctAnswer: number
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6', '#ec4899', '#f43f5e']

const LEVEL_SETTINGS = [
  // Levels 1-5: Easy introduction
  { shapeCount: 2, optionCount: 4, timeLimit: 20, difficulty: 'easy' },
  { shapeCount: 2, optionCount: 4, timeLimit: 18, difficulty: 'easy' },
  { shapeCount: 3, optionCount: 5, timeLimit: 22, difficulty: 'easy' },
  { shapeCount: 3, optionCount: 5, timeLimit: 20, difficulty: 'easy' },
  { shapeCount: 3, optionCount: 6, timeLimit: 25, difficulty: 'easy' },

  // Levels 6-10: Medium challenge
  { shapeCount: 4, optionCount: 6, timeLimit: 23, difficulty: 'medium' },
  { shapeCount: 4, optionCount: 6, timeLimit: 21, difficulty: 'medium' },
  { shapeCount: 5, optionCount: 7, timeLimit: 26, difficulty: 'medium' },
  { shapeCount: 5, optionCount: 7, timeLimit: 24, difficulty: 'medium' },
  { shapeCount: 5, optionCount: 7, timeLimit: 28, difficulty: 'medium' },

  // Levels 11-15: Harder progression
  { shapeCount: 6, optionCount: 8, timeLimit: 30, difficulty: 'hard' },
  { shapeCount: 6, optionCount: 8, timeLimit: 28, difficulty: 'hard' },
  { shapeCount: 7, optionCount: 8, timeLimit: 32, difficulty: 'hard' },
  { shapeCount: 7, optionCount: 8, timeLimit: 30, difficulty: 'hard' },
  { shapeCount: 7, optionCount: 9, timeLimit: 34, difficulty: 'hard' },

  // Levels 16-20: Advanced challenge
  { shapeCount: 8, optionCount: 9, timeLimit: 32, difficulty: 'hard' },
  { shapeCount: 8, optionCount: 9, timeLimit: 30, difficulty: 'hard' },
  { shapeCount: 9, optionCount: 10, timeLimit: 36, difficulty: 'hard' },
  { shapeCount: 9, optionCount: 10, timeLimit: 34, difficulty: 'hard' },
  { shapeCount: 9, optionCount: 10, timeLimit: 38, difficulty: 'hard' },

  // Levels 21-25: Expert level
  { shapeCount: 10, optionCount: 10, timeLimit: 40, difficulty: 'expert' },
  { shapeCount: 10, optionCount: 10, timeLimit: 38, difficulty: 'expert' },
  { shapeCount: 11, optionCount: 11, timeLimit: 42, difficulty: 'expert' },
  { shapeCount: 11, optionCount: 11, timeLimit: 40, difficulty: 'expert' },
  { shapeCount: 11, optionCount: 11, timeLimit: 44, difficulty: 'expert' },

  // Levels 26-30: Master level
  { shapeCount: 12, optionCount: 12, timeLimit: 46, difficulty: 'expert' },
  { shapeCount: 12, optionCount: 12, timeLimit: 44, difficulty: 'expert' },
  { shapeCount: 13, optionCount: 12, timeLimit: 48, difficulty: 'expert' },
  { shapeCount: 13, optionCount: 12, timeLimit: 46, difficulty: 'expert' },
  { shapeCount: 13, optionCount: 12, timeLimit: 50, difficulty: 'expert' },
]

const SHAPES: Record<ComplexShape['type'], (x: number, y: number, size: number) => string> = {
  cube: (x, y, size) => `M${x-size/2} ${y-size/2} L${x+size/2} ${y-size/2} L${x+size/2} ${y+size/2} L${x-size/2} ${y+size/2} Z`,
  pyramid: (x, y, size) => `M${x} ${y-size/2} L${x+size/2} ${y+size/2} L${x-size/2} ${y+size/2} Z`,
  prism: (x, y, size) => `M${x-size/2} ${y-size/3} L${x} ${y-size/2} L${x+size/2} ${y-size/3} L${x+size/2} ${y+size/2} L${x-size/2} ${y+size/2} Z`,
  cylinder: (x, y, size) => `M${x-size/2} ${y-size/2} Q${x} ${y-size/2-size/4} ${x+size/2} ${y-size/2} L${x+size/2} ${y+size/2} Q${x} ${y+size/2+size/4} ${x-size/2} ${y+size/2} Z`,
}

export default function MentalRotationAdvancedPage() {
  const { t } = useTranslation()
  const { addSession, darkMode } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'showing' | 'input' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const settings = LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)]

  const getLevelScore = (correct: number, total: number) => {
    const baseScore = (correct / total) * 1000
    const timeBonus = timeLeft * 15
    return Math.round(baseScore + timeBonus)
  }

  const generateShape = (): ComplexShape => {
    const types: ComplexShape['type'][] = ['cube', 'pyramid', 'prism', 'cylinder']
    return {
      type: types[Math.floor(Math.random() * types.length)],
      size: 30 + Math.random() * 20,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    }
  }

  const generateQuestions = useCallback(() => {
    const newQuestions: Question[] = []

    for (let i = 0; i < settings.shapeCount; i++) {
      const baseShape = generateShape()
      const shapes: ComplexShape[] = [baseShape]

      for (let j = 1; j < 3 + Math.floor(Math.random() * 2); j++) {
        const newShape = generateShape()
        shapes.push(newShape)
      }

      const rotation = Math.floor(Math.random() * 360)
      const correctAnswer = rotation

      const options = [correctAnswer]
      while (options.length < settings.optionCount) {
        const offset = Math.floor(Math.random() * 45) + 15
        const newOption = (rotation + (Math.random() > 0.5 ? offset : -offset) + 360) % 360
        if (!options.includes(newOption)) {
          options.push(newOption)
        }
      }

      newQuestions.push({
        id: i,
        baseShape,
        shapes,
        rotation,
        options: options.sort(() => Math.random() - 0.5),
        correctAnswer
      })
    }

    return newQuestions
  }, [settings.shapeCount, settings.optionCount])

  const startGame = () => {
    setScore(0)
    setTotalScore(0)
    setLevel(1)
    startLevel()
  }

  const startLevel = () => {
    const newQuestions = generateQuestions()
    setQuestions(newQuestions)
    setCurrentQuestionIndex(0)
    setSelectedAnswers([])
    setShowAnswer(false)
    setTimeLeft(settings.timeLimit)
    setGameState('showing')

    setTimeout(() => {
      setGameState('input')
    }, 2500)
  }

  const handleAnswerSelect = (answer: number) => {
    if (gameState !== 'input' || showAnswer) return

    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = answer
    setSelectedAnswers(newAnswers)
    setShowAnswer(true)
  }

  const handleNext = () => {
    setShowAnswer(false)
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      const correctCount = selectedAnswers.filter((answer, index) => {
        const question = questions[index]
        return answer === question.correctAnswer
      }).length

      const levelScore = getLevelScore(correctCount, questions.length)
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
        const question = questions[index]
        return question && answer === question.correctAnswer
      }).length

      const levelScore = getLevelScore(correctCount, questions.length)
      setScore(levelScore)
      setGameState('levelComplete')
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [gameState, timeLeft, selectedAnswers, questions])

  const nextLevel = () => {
    const levelScore = score
    setTotalScore(prev => prev + levelScore)

    if (level >= MAX_LEVELS) {
      addSession({
        id: Date.now().toString(),
        gameId: 'mental-rotation-advanced',
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

  const renderShape = (shape: ComplexShape, x: number, y: number, rotation: number) => (
    <g transform={`rotate(${rotation} ${x} ${y})`}>
      <motion.path
        d={SHAPES[shape.type](x, y, shape.size)}
        fill={shape.color}
        stroke={darkMode ? '#1e293b' : 'rgba(0,0,0,0.2)'}
        strokeWidth="2"
      />
    </g>
  )

  const renderComplexShape = (shapes: ComplexShape[], rotation: number, size = 180) => {
    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 3

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-lg">
        {shapes.map((shape, index) => {
          const angle = (index / shapes.length) * Math.PI * 2 - Math.PI / 2
          const x = centerX + Math.cos(angle) * radius * 0.5
          const y = centerY + Math.sin(angle) * radius * 0.5
          return renderShape(shape, x, y, rotation)
        })}
      </svg>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800'} p-4 md:p-8`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link
          href="/spatial"
          className={`inline-flex items-center ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium mb-6 text-sm md:text-base lg:text-lg`}
        >
          <span className="mr-2">←</span> {t('back', 'Back')}
        </Link>

        <h1 className={`text-3xl md:text-2xl md:text-3xl lg:text-4xl font-bold ${darkMode ? 'text-slate-50' : 'text-gray-800'} mb-2`}>
          {t('mentalRotationAdvanced.title', 'Mental Rotation Advanced')}
        </h1>
        <p className={`text-sm md:text-base lg:text-lg ${darkMode ? 'text-slate-300' : 'text-gray-700'} font-medium mb-8`}>
          {t('mentalRotationAdvanced.description', 'Mentally rotate complex shapes and estimate angles!')}
        </p>

        {/* Menu */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-8 text-center`}
          >
            <h2 className={`text-xl md:text-2xl lg:text-3xl font-bold ${darkMode ? 'text-slate-50' : 'text-gray-800'} mb-2`}>
              Level {level}
            </h2>
            {level > 1 && (
              <p className={`text-sm md:text-base lg:text-lg ${darkMode ? 'text-slate-300' : 'text-gray-700'} mb-4 font-medium`}>
                Total Score: <span className="text-amber-500 font-bold">{totalScore}</span>
              </p>
            )}
            <div className={`rounded-xl p-4 mb-6 text-left ${darkMode ? 'bg-slate-700' : 'bg-amber-50 dark:bg-slate-700'}`}>
              <h3 className={`font-bold ${darkMode ? 'text-slate-50' : 'text-gray-800'} mb-2`}>{t('mentalRotationAdvanced.levelInfo', 'Level Settings')}:</h3>
              <ul className={`space-y-1 font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <li>• {t('mentalRotationAdvanced.shapeCount', 'Shape Count')}: {settings.shapeCount}</li>
                <li>• {t('mentalRotationAdvanced.optionCount', 'Options per Question')}: {settings.optionCount}</li>
                <li>• {t('mentalRotationAdvanced.timeLimit', 'Time Limit')}: {settings.timeLimit}s</li>
              </ul>
            </div>
            <button
              onClick={startLevel}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-amber-600 hover:to-orange-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Showing shape */}
        {gameState === 'showing' && (
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-8 text-center`}>
            <p className={`text-xl ${darkMode ? 'text-slate-300' : 'text-gray-600'} mb-4 font-medium`}>
              {t('mentalRotationAdvanced.memorize', 'Memorize the rotation!')}
            </p>
            {currentQuestion && (
              <div className="flex justify-center">
                {renderComplexShape(currentQuestion.shapes, currentQuestion.rotation, 200)}
              </div>
            )}
          </div>
        )}

        {/* Input phase */}
        {gameState === 'input' && (
          <>
            {/* Stats */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-6 mb-6`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('mentalRotationAdvanced.question', 'Question')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-amber-500">
                    {currentQuestionIndex + 1}/{questions.length}
                  </p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('mentalRotationAdvanced.score', 'Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-500">{totalScore}</p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('mentalRotationAdvanced.timeLeft', 'Time Left')}</p>
                  <p className={`text-2xl md:text-3xl lg:text-4xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-amber-500'}`}>
                    {timeLeft}s
                  </p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 dark:bg-slate-600 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full"
                />
              </div>
            </div>

            {/* Question area */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-8 mb-6 text-center`}>
              {currentQuestion && (
                <>
                  <div className="flex justify-center mb-6">
                    {renderComplexShape(currentQuestion.shapes, currentQuestion.rotation, 150)}
                  </div>

                  {showAnswer ? (
                    <div className="mb-6">
                      <div className={`p-4 rounded-xl ${
                        selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer
                          ? 'bg-green-50 dark:bg-slate-700 border-2 border-green-500 dark:bg-green-900/30'
                          : 'bg-red-50 dark:bg-slate-700 border-2 border-red-500 dark:bg-red-900/30'
                      }`}>
                        <p className="text-lg font-bold mb-2">
                          {selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer
                            ? '✅ Correct!'
                            : '❌ Incorrect!'}
                        </p>
                        <p className={darkMode ? 'text-slate-300' : 'text-gray-700'}>
                          {t('mentalRotationAdvanced.yourAnswer', 'Your Answer')}: {selectedAnswers[currentQuestionIndex]}°
                        </p>
                        <p className={darkMode ? 'text-slate-300' : 'text-gray-700'}>
                          {t('mentalRotationAdvanced.correctAnswer', 'Correct Answer')}: {currentQuestion.correctAnswer}°
                        </p>
                      </div>
                      <button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xl font-bold py-3 px-8 rounded-xl hover:from-amber-600 hover:to-orange-600 shadow-lg transition-all"
                      >
                        {currentQuestionIndex < questions.length - 1
                          ? t('mentalRotationAdvanced.nextQuestion', 'Next Question')
                          : t('mentalRotationAdvanced.seeResults', 'See Results')}
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className={`text-lg md:text-xl lg:text-2xl font-bold ${darkMode ? 'text-slate-50' : 'text-gray-800'} mb-6`}>
                        {t('mentalRotationAdvanced.selectRotation', 'Select the rotation angle!')}
                      </p>
                      <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                        {currentQuestion.options.map((option, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAnswerSelect(option)}
                            className={`p-4 rounded-xl font-bold transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-amber-400' : 'bg-amber-100 hover:bg-amber-200 text-amber-800'}`}
                          >
                            {option}°
                          </motion.button>
                        ))}
                      </div>
                    </>
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
            className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-8 text-center`}
          >
            <div className="text-6xl mb-4">
              {score > 0 ? '✅' : '❌'}
            </div>
            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ${score > 0 ? 'text-amber-500' : 'text-red-500'}`}>
              {score > 0 ? `Level ${level} Complete!` : 'Level Failed!'}
            </h2>
            {score > 0 ? (
              <div className={`rounded-xl p-6 mb-6 ${darkMode ? 'bg-slate-700' : 'bg-amber-50 dark:bg-slate-700'}`}>
                <div className="text-center mb-4">
                  <p className="text-6xl font-bold text-amber-500 mb-2">
                    {selectedAnswers.filter((answer, index) => answer === questions[index]?.correctAnswer).length}/{questions.length}
                  </p>
                  <p className={`text-xl ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                    {t('mentalRotationAdvanced.correctAnswers', 'Correct Answers')}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('mentalRotationAdvanced.levelScore', 'Level Score')}</p>
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-amber-500">{score}</p>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('mentalRotationAdvanced.totalScore', 'Total Score')}</p>
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-500">{totalScore + score}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`rounded-xl p-6 mb-6 ${darkMode ? 'bg-red-900/30' : 'bg-red-50 dark:bg-slate-700'}`}>
                <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('mentalRotationAdvanced.levelScore', 'Level Score')}</p>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-red-500">{score}</p>
              </div>
            )}
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-amber-600 hover:to-orange-600 shadow-lg transition-all w-full mb-3"
            >
              {level < MAX_LEVELS ? `Next Level ${level + 1}` : 'View Final Score'}
            </button>
            <button
              onClick={startGame}
              className={darkMode ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}
            >
              {t('mentalRotationAdvanced.restart', 'Restart from Level 1')}
            </button>
          </motion.div>
        )}

        {/* Victory */}
        {gameState === 'victory' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-8 text-center`}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-amber-500 mb-4">{t('mentalRotationAdvanced.victory', 'Congratulations!')}</h2>
            <p className={`text-xl ${darkMode ? 'text-slate-300' : 'text-gray-700'} font-medium mb-6`}>
              {t('mentalRotationAdvanced.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className={`rounded-xl p-6 mb-6 ${darkMode ? 'bg-slate-700' : 'bg-amber-50 dark:bg-slate-700'}`}>
              <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('mentalRotationAdvanced.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-amber-500">{totalScore + score}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-amber-600 hover:to-orange-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
