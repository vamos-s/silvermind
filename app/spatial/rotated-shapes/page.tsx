'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

import { SettingsPanel } from "@/components/SettingsPanel"
const MAX_LEVELS = 30

type ShapeType = 'square' | 'triangle' | 'pentagon' | 'hexagon'
type Question = {
  id: number
  shape: ShapeType
  rotation: number
  options: number[]
  correctAnswer: number
}

const LEVEL_SETTINGS = [
  // Levels 1-5: Easy introduction
  { shapeCount: 2, optionCount: 4, inputTime: 20, difficulty: 'easy' },    // Level 1
  { shapeCount: 2, optionCount: 4, inputTime: 18, difficulty: 'easy' },    // Level 2
  { shapeCount: 3, optionCount: 5, inputTime: 22, difficulty: 'easy' },    // Level 3
  { shapeCount: 3, optionCount: 5, inputTime: 20, difficulty: 'easy' },    // Level 4
  { shapeCount: 4, optionCount: 6, inputTime: 25, difficulty: 'easy' },    // Level 5

  // Levels 6-10: Medium challenge
  { shapeCount: 4, optionCount: 6, inputTime: 23, difficulty: 'medium' },  // Level 6
  { shapeCount: 5, optionCount: 7, inputTime: 28, difficulty: 'medium' },  // Level 7
  { shapeCount: 5, optionCount: 7, inputTime: 26, difficulty: 'medium' },  // Level 8
  { shapeCount: 6, optionCount: 8, inputTime: 30, difficulty: 'medium' },  // Level 9
  { shapeCount: 6, optionCount: 8, inputTime: 28, difficulty: 'medium' },  // Level 10

  // Levels 11-15: Harder progression
  { shapeCount: 7, optionCount: 9, inputTime: 33, difficulty: 'hard' },   // Level 11
  { shapeCount: 7, optionCount: 9, inputTime: 30, difficulty: 'hard' },    // Level 12
  { shapeCount: 8, optionCount: 10, inputTime: 35, difficulty: 'hard' },    // Level 13
  { shapeCount: 8, optionCount: 10, inputTime: 33, difficulty: 'hard' },   // Level 14
  { shapeCount: 9, optionCount: 11, inputTime: 38, difficulty: 'hard' },   // Level 15

  // Levels 16-20: Advanced challenge
  { shapeCount: 9, optionCount: 11, inputTime: 35, difficulty: 'hard' },    // Level 16
  { shapeCount: 10, optionCount: 12, inputTime: 40, difficulty: 'hard' },  // Level 17
  { shapeCount: 10, optionCount: 12, inputTime: 38, difficulty: 'hard' },  // Level 18
  { shapeCount: 11, optionCount: 13, inputTime: 43, difficulty: 'hard' },  // Level 19
  { shapeCount: 11, optionCount: 13, inputTime: 40, difficulty: 'hard' },   // Level 20

  // Levels 21-25: Expert level
  { shapeCount: 12, optionCount: 14, inputTime: 45, difficulty: 'expert' }, // Level 21
  { shapeCount: 12, optionCount: 14, inputTime: 43, difficulty: 'expert' }, // Level 22
  { shapeCount: 13, optionCount: 15, inputTime: 48, difficulty: 'expert' }, // Level 23
  { shapeCount: 13, optionCount: 15, inputTime: 45, difficulty: 'expert' }, // Level 24
  { shapeCount: 14, optionCount: 16, inputTime: 50, difficulty: 'expert' }, // Level 25

  // Levels 26-30: Master level
  { shapeCount: 14, optionCount: 16, inputTime: 48, difficulty: 'expert' }, // Level 26
  { shapeCount: 15, optionCount: 17, inputTime: 53, difficulty: 'expert' }, // Level 27
  { shapeCount: 15, optionCount: 17, inputTime: 50, difficulty: 'expert' }, // Level 28
  { shapeCount: 16, optionCount: 18, inputTime: 55, difficulty: 'expert' }, // Level 29
  { shapeCount: 16, optionCount: 18, inputTime: 53, difficulty: 'expert' }, // Level 30
]

const SHAPES: Record<ShapeType, string> = {
  square: 'M50 10 L90 50 L50 90 L10 50 Z',
  triangle: 'M50 10 L90 90 L10 90 Z',
  pentagon: 'M50 10 L85 40 L72 85 L28 85 L15 40 Z',
  hexagon: 'M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z',
}

export default function RotatedShapesPage() {
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

  const generateQuestions = useCallback(() => {
    const newQuestions: Question[] = []
    const shapeTypes: ShapeType[] = ['square', 'triangle', 'pentagon', 'hexagon']

    for (let i = 0; i < settings.shapeCount; i++) {
      const shape = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
      const rotation = Math.floor(Math.random() * 360)
      const correctAnswer = rotation

      // Generate options
      const options = [correctAnswer]
      while (options.length < settings.optionCount) {
        const offset = Math.floor(Math.random() * 30) + 5
        const newOption = (rotation + (Math.random() > 0.5 ? offset : -offset) + 360) % 360
        if (!options.includes(newOption)) {
          options.push(newOption)
        }
      }

      newQuestions.push({
        id: i,
        shape,
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
    setTimeLeft(settings.inputTime)
    setGameState('showing')

    setTimeout(() => {
      setGameState('input')
    }, 2000)
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
      // Calculate score with current answers
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
        gameId: 'rotated-shapes',
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

  const renderShape = (shape: ShapeType, rotation: number, size = 100) => (
    <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-lg">
      <motion.path
        d={SHAPES[shape]}
        fill="currentColor"
        className="text-purple-600"
        style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center' }}
      />
    </svg>
  )

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className={`min-h-screen p-3 md:p-4 lg:p-8 transition-colors duration-300 ${darkMode ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" : "bg-gradient-to-br from-purple-50 via-white to-violet-50 p-4 md:p-8"}`}">
      <SettingsPanel />
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link
          href="/spatial"
          className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium mb-6 text-sm md:text-base lg:text-lg"
        >
          <span className="mr-2">←</span> {t('back', 'Back')}
        </Link>

        <h1 className="text-3xl md:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2">
          {t('rotatedShapes.title', 'Rotated Shapes')}
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-8">
          {t('rotatedShapes.description', 'Estimate the rotation angle of each shape!')}
        </p>

        {/* Menu */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Level {level}
            </h2>
            {level > 1 && (
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 font-medium">
                Total Score: <span className="text-purple-600 font-bold">{totalScore}</span>
              </p>
            )}
            <div className="bg-purple-50 dark:bg-slate-800 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">{t('rotatedShapes.levelInfo', 'Level Settings')}:</h3>
              <ul className="text-gray-700 dark:text-gray-300 space-y-1 font-medium">
                <li>• {t('rotatedShapes.shapeCount', 'Shape Count')}: {settings.shapeCount}</li>
                <li>• {t('rotatedShapes.optionCount', 'Options per Question')}: {settings.optionCount}</li>
                <li>• {t('rotatedShapes.inputTime', 'Time Limit')}: {settings.inputTime}s</li>
              </ul>
            </div>
            <button
              onClick={startLevel}
              className="bg-gradient-to-r from-purple-500 to-violet-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-purple-600 hover:to-violet-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Showing shape */}
        {gameState === 'showing' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 font-medium">
              {t('rotatedShapes.memorize', 'Memorize the rotation!')}
            </p>
            {currentQuestion && (
              <div className="flex justify-center">
                {renderShape(currentQuestion.shape, currentQuestion.rotation, 200)}
              </div>
            )}
          </div>
        )}

        {/* Input phase */}
        {gameState === 'input' && (
          <>
            {/* Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('rotatedShapes.question', 'Question')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-600">
                    {currentQuestionIndex + 1}/{questions.length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('rotatedShapes.score', 'Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-violet-600">{totalScore}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('rotatedShapes.timeLeft', 'Time Left')}</p>
                  <p className={`text-2xl md:text-3xl lg:text-4xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-purple-600'}`}>
                    {timeLeft}s
                  </p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                  className="bg-gradient-to-r from-purple-500 to-violet-500 h-full"
                />
              </div>
            </div>

            {/* Question area */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-6 text-center">
              {currentQuestion && (
                <>
                  <div className="flex justify-center mb-6">
                    {renderShape(currentQuestion.shape, currentQuestion.rotation, 150)}
                  </div>

                  {showAnswer ? (
                    <div className="mb-6">
                      <div className={`p-4 rounded-xl ${
                        selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer
                          ? 'bg-green-50 border-2 border-green-500'
                          : 'bg-red-50 border-2 border-red-500'
                      }`}>
                        <p className="text-lg font-bold mb-2">
                          {selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer
                            ? '✅ Correct!'
                            : '❌ Incorrect!'}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          {t('rotatedShapes.yourAnswer', 'Your Answer')}: {selectedAnswers[currentQuestionIndex]}°
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          {t('rotatedShapes.correctAnswer', 'Correct Answer')}: {currentQuestion.correctAnswer}°
                        </p>
                      </div>
                      <button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-purple-500 to-violet-500 text-white text-xl font-bold py-3 px-8 rounded-xl hover:from-purple-600 hover:to-violet-600 shadow-lg transition-all"
                      >
                        {currentQuestionIndex < questions.length - 1
                          ? t('rotatedShapes.nextQuestion', 'Next Question')
                          : t('rotatedShapes.seeResults', 'See Results')}
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-6">
                        {t('rotatedShapes.selectRotation', 'Select the rotation angle!')}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-md mx-auto">
                        {currentQuestion.options.map((option, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAnswerSelect(option)}
                            className="p-4 bg-purple-100 hover:bg-purple-200 rounded-xl font-bold text-purple-800 transition-colors"
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
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">
              {score > 0 ? '✅' : '❌'}
            </div>
            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ${score > 0 ? 'text-purple-600' : 'text-red-500'}`}>
              {score > 0 ? `Level ${level} Complete!` : 'Level Failed!'}
            </h2>
            {score > 0 ? (
              <div className="bg-purple-50 dark:bg-slate-800 rounded-xl p-6 mb-6">
                <div className="text-center mb-4">
                  <p className="text-6xl font-bold text-purple-600 mb-2">
                    {selectedAnswers.filter((answer, index) => answer === questions[index]?.correctAnswer).length}/{questions.length}
                  </p>
                  <p className="text-xl text-gray-600 dark:text-gray-400">
                    {t('rotatedShapes.correctAnswers', 'Correct Answers')}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('rotatedShapes.levelScore', 'Level Score')}</p>
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-600">{score}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('rotatedShapes.totalScore', 'Total Score')}</p>
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-violet-600">{totalScore + score}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 rounded-xl p-6 mb-6">
                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('rotatedShapes.levelScore', 'Level Score')}</p>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-red-600">{score}</p>
              </div>
            )}
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-purple-500 to-violet-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-purple-600 hover:to-violet-600 shadow-lg transition-all w-full mb-3"
            >
              {level < MAX_LEVELS ? `Next Level ${level + 1}` : 'View Final Score'}
            </button>
            <button
              onClick={startGame}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:text-white font-medium"
            >
              {t('rotatedShapes.restart', 'Restart from Level 1')}
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-purple-600 mb-4">{t('rotatedShapes.victory', 'Congratulations!')}</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 font-medium mb-6">
              {t('rotatedShapes.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className="bg-purple-50 dark:bg-slate-800 rounded-xl p-6 mb-6">
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('rotatedShapes.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-purple-600">{totalScore + score}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-purple-500 to-violet-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-purple-600 hover:to-violet-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
