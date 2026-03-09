'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

import { SettingsPanel } from "@/components/SettingsPanel"
const MAX_LEVELS = 30

type PerspectiveView = {
  id: number
  type: 'front' | 'side' | 'top' | 'isometric' | 'corner'
  rotation: number
}

type Object3D = {
  id: number
  type: 'cube' | 'pyramid' | 'cylinder' | 'cone' | 'sphere' | 'prism'
  color: string
  perspectives: PerspectiveView[]
}

type Question = {
  id: number
  object: Object3D
  targetPerspective: PerspectiveView
  options: PerspectiveView[]
  correctAnswer: number
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6', '#ec4899', '#6366f1']

const LEVEL_SETTINGS = [
  // Levels 1-5: Easy introduction
  { optionCount: 3, timeLimit: 30, difficulty: 'easy' },
  { optionCount: 3, timeLimit: 28, difficulty: 'easy' },
  { optionCount: 4, timeLimit: 32, difficulty: 'easy' },
  { optionCount: 4, timeLimit: 30, difficulty: 'easy' },
  { optionCount: 4, timeLimit: 35, difficulty: 'easy' },

  // Levels 6-10: Medium challenge
  { optionCount: 4, timeLimit: 32, difficulty: 'medium' },
  { optionCount: 5, timeLimit: 36, difficulty: 'medium' },
  { optionCount: 5, timeLimit: 34, difficulty: 'medium' },
  { optionCount: 5, timeLimit: 38, difficulty: 'medium' },
  { optionCount: 5, timeLimit: 36, difficulty: 'medium' },

  // Levels 11-15: Harder progression
  { optionCount: 6, timeLimit: 40, difficulty: 'hard' },
  { optionCount: 6, timeLimit: 38, difficulty: 'hard' },
  { optionCount: 6, timeLimit: 42, difficulty: 'hard' },
  { optionCount: 6, timeLimit: 40, difficulty: 'hard' },
  { optionCount: 6, timeLimit: 44, difficulty: 'hard' },

  // Levels 16-20: Advanced challenge
  { optionCount: 6, timeLimit: 42, difficulty: 'hard' },
  { optionCount: 7, timeLimit: 46, difficulty: 'hard' },
  { optionCount: 7, timeLimit: 44, difficulty: 'hard' },
  { optionCount: 7, timeLimit: 48, difficulty: 'hard' },
  { optionCount: 7, timeLimit: 46, difficulty: 'hard' },

  // Levels 21-25: Expert level
  { optionCount: 7, timeLimit: 50, difficulty: 'expert' },
  { optionCount: 7, timeLimit: 48, difficulty: 'expert' },
  { optionCount: 7, timeLimit: 52, difficulty: 'expert' },
  { optionCount: 7, timeLimit: 50, difficulty: 'expert' },
  { optionCount: 7, timeLimit: 54, difficulty: 'expert' },

  // Levels 26-30: Master level
  { optionCount: 7, timeLimit: 52, difficulty: 'expert' },
  { optionCount: 7, timeLimit: 56, difficulty: 'expert' },
  { optionCount: 7, timeLimit: 54, difficulty: 'expert' },
  { optionCount: 7, timeLimit: 58, difficulty: 'expert' },
  { optionCount: 7, timeLimit: 56, difficulty: 'expert' },
]

export default function PerspectiveMatchingPage() {
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

  const generateObject3D = (id: number): Object3D => {
    const types: Object3D['type'][] = ['cube', 'pyramid', 'cylinder', 'cone', 'sphere', 'prism']
    const type = types[Math.floor(Math.random() * types.length)]
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    
    const perspectiveTypes: PerspectiveView['type'][] = ['front', 'side', 'top', 'isometric', 'corner']
    const perspectives: PerspectiveView[] = perspectiveTypes.map((type, index) => ({
      id: index,
      type,
      rotation: Math.random() * 360
    }))

    return { id, type, color, perspectives }
  }

  const generateQuestions = useCallback(() => {
    const newQuestions: Question[] = []

    for (let i = 0; i < 5; i++) {
      const object = generateObject3D(i)
      const targetPerspective = object.perspectives[Math.floor(Math.random() * object.perspectives.length)]
      
      const correctAnswer = Math.floor(Math.random() * settings.optionCount)
      const options: PerspectiveView[] = []

      for (let j = 0; j < settings.optionCount; j++) {
        if (j === correctAnswer) {
          options.push(targetPerspective)
        } else {
          const randomPerspective = object.perspectives.filter(p => p.type !== targetPerspective.type)[
            Math.floor(Math.random() * (object.perspectives.length - 1))
          ]
          options.push(randomPerspective)
        }
      }

      newQuestions.push({
        id: i,
        object,
        targetPerspective,
        options: options.sort(() => Math.random() - 0.5),
        correctAnswer: options.findIndex(opt => opt.type === targetPerspective.type)
      })
    }

    return newQuestions
  }, [settings.optionCount])

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
        gameId: 'perspective-matching',
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

  const render3DObject = (object: Object3D, perspective: PerspectiveView, size = 120) => {
    const getTransform = () => {
      switch (perspective.type) {
        case 'front':
          return 'rotateX(0deg) rotateY(0deg)'
        case 'side':
          return 'rotateX(0deg) rotateY(90deg)'
        case 'top':
          return 'rotateX(90deg) rotateY(0deg)'
        case 'isometric':
          return 'rotateX(30deg) rotateY(45deg)'
        case 'corner':
          return 'rotateX(45deg) rotateY(45deg)'
        default:
          return 'rotateX(0deg) rotateY(0deg)'
      }
    }

    const renderShape = () => {
      const baseStyle = {
        width: size,
        height: size,
        backgroundColor: object.color,
        position: 'relative' as const,
        transformStyle: 'preserve-3d' as const,
        transform: getTransform()
      }

      switch (object.type) {
        case 'cube':
          return (
            <div style={baseStyle} className="transform-gpu">
              <div className="absolute inset-0 border-4 border-black/20" />
              <div className="absolute inset-0 transform translate-z-[10px] bg-gradient-to-br from-white/30 to-transparent" />
              <div className="absolute right-0 top-0 w-[30px] h-full bg-gradient-to-r from-black/20 to-transparent transform rotate-y-90 origin-left" />
              <div className="absolute bottom-0 left-0 w-full h-[30px] bg-gradient-to-b from-black/20 to-transparent transform rotate-x-90 origin-top" />
            </div>
          )
        case 'pyramid':
          return (
            <div style={{ ...baseStyle, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          )
        case 'cylinder':
          return (
            <div style={baseStyle} className="rounded-full">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-[10px] rounded-t-full bg-white/30" />
              <div className="absolute bottom-0 left-0 right-0 h-[10px] rounded-b-full bg-black/20" />
            </div>
          )
        case 'cone':
          return (
            <div style={{ ...baseStyle, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', borderRadius: '50% 50% 0 0' }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          )
        case 'sphere':
          return (
            <div style={baseStyle} className="rounded-full">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/30 rounded-full" />
            </div>
          )
        case 'prism':
          return (
            <div style={baseStyle}>
              <div className="absolute inset-0 border-4 border-black/20" />
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-black/10" />
            </div>
          )
        default:
          return <div style={baseStyle} />
      }
    }

    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        {renderShape()}
        <div className={`mt-2 text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
          {perspective.type.toUpperCase()}
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'} p-4 md:p-8`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link
          href="/spatial"
          className={`inline-flex items-center ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium mb-6 text-sm md:text-base lg:text-lg`}
        >
          <span className="mr-2">←</span> {t('back', 'Back')}
        </Link>

        <h1 className={`text-3xl md:text-2xl md:text-3xl lg:text-4xl font-bold ${darkMode ? 'text-slate-50' : 'text-gray-800'} mb-2`}>
          {t('perspectiveMatching.title', 'Perspective Matching')}
        </h1>
        <p className={`text-sm md:text-base lg:text-lg ${darkMode ? 'text-slate-300' : 'text-gray-700'} font-medium mb-8`}>
          {t('perspectiveMatching.description', 'Match the correct perspective of the object!')}
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
                Total Score: <span className="text-indigo-600 font-bold">{totalScore}</span>
              </p>
            )}
            <div className={`rounded-xl p-4 mb-6 text-left ${darkMode ? 'bg-slate-700' : 'bg-indigo-50'}`}>
              <h3 className={`font-bold ${darkMode ? 'text-slate-50' : 'text-gray-800'} mb-2`}>{t('perspectiveMatching.levelInfo', 'Level Settings')}:</h3>
              <ul className={`space-y-1 font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <li>• {t('perspectiveMatching.optionCount', 'Options per Question')}: {settings.optionCount}</li>
                <li>• {t('perspectiveMatching.timeLimit', 'Time Limit')}: {settings.timeLimit}s</li>
              </ul>
            </div>
            <button
              onClick={startLevel}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-indigo-600 hover:to-purple-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Showing object */}
        {gameState === 'showing' && currentQuestion && (
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-8 text-center`}>
            <p className={`text-xl ${darkMode ? 'text-slate-300' : 'text-gray-600'} mb-4 font-medium`}>
              {t('perspectiveMatching.memorize', 'Memorize the object!')}
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 lg:gap-6 mb-6">
              {currentQuestion.object.perspectives.slice(0, 4).map(perspective => (
                <div key={perspective.id}>
                  {render3DObject(currentQuestion.object, perspective, 100)}
                </div>
              ))}
            </div>
            <p className={`text-sm md:text-base lg:text-lg ${darkMode ? 'text-slate-300' : 'text-gray-700'} font-medium`}>
              {t('perspectiveMatching.matchPerspective', 'Match the {type} perspective!', { type: currentQuestion.targetPerspective.type.toUpperCase() })}
            </p>
          </div>
        )}

        {/* Input phase */}
        {gameState === 'input' && currentQuestion && (
          <>
            {/* Stats */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-6 mb-6`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('perspectiveMatching.question', 'Question')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-indigo-600">
                    {currentQuestionIndex + 1}/{questions.length}
                  </p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('perspectiveMatching.score', 'Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-600">{totalScore}</p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('perspectiveMatching.timeLeft', 'Time Left')}</p>
                  <p className={`text-2xl md:text-3xl lg:text-4xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-indigo-600'}`}>
                    {timeLeft}s
                  </p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 dark:bg-slate-600 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full"
                />
              </div>
            </div>

            {/* Question area */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-8 mb-6 text-center`}>
              <p className={`text-lg md:text-xl lg:text-2xl font-bold ${darkMode ? 'text-slate-50' : 'text-gray-800'} mb-4`}>
                {t('perspectiveMatching.selectMatching', 'Select the {type} view!', { type: currentQuestion.targetPerspective.type.toUpperCase() })}
              </p>

              {/* Reference object */}
              <div className={`mb-6 p-4 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-indigo-50'}`}>
                <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'} mb-3`}>
                  {t('perspectiveMatching.reference', 'Reference Object')}
                </p>
                {render3DObject(currentQuestion.object, { id: 0, type: 'isometric', rotation: 0 }, 100)}
              </div>

              {showAnswer ? (
                <div className="mb-6">
                  <div className={`p-4 rounded-xl ${
                    selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer
                      ? 'bg-green-50 border-2 border-green-500 dark:bg-green-900/30'
                      : 'bg-red-50 border-2 border-red-500 dark:bg-red-900/30'
                  }`}>
                    <p className="text-lg font-bold mb-2">
                      {selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer
                        ? '✅ Correct!'
                        : '❌ Incorrect!'}
                    </p>
                    <p className={darkMode ? 'text-slate-300' : 'text-gray-700'}>
                      {t('perspectiveMatching.correctAnswer', 'Correct Answer')}: {currentQuestion.correctAnswer + 1}
                    </p>
                  </div>
                  <button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xl font-bold py-3 px-8 rounded-xl hover:from-indigo-600 hover:to-purple-600 shadow-lg transition-all"
                  >
                    {currentQuestionIndex < questions.length - 1
                      ? t('perspectiveMatching.nextQuestion', 'Next Question')
                      : t('perspectiveMatching.seeResults', 'See Results')}
                  </button>
                </div>
              ) : (
                <div className={`grid ${settings.optionCount <= 4 ? 'grid-cols-2' : 'grid-cols-3'} gap-4 max-w-2xl mx-auto`}>
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleAnswerSelect(index)}
                      className={`p-4 rounded-xl transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      <div className="mb-2 text-lg font-bold text-indigo-600">{index + 1}</div>
                      {render3DObject(currentQuestion.object, option, 80)}
                    </motion.button>
                  ))}
                </div>
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
            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ${score > 0 ? 'text-indigo-600' : 'text-red-500'}`}>
              {score > 0 ? `Level ${level} Complete!` : 'Level Failed!'}
            </h2>
            {score > 0 ? (
              <div className={`rounded-xl p-6 mb-6 ${darkMode ? 'bg-slate-700' : 'bg-indigo-50'}`}>
                <div className="text-center mb-4">
                  <p className="text-6xl font-bold text-indigo-600 mb-2">
                    {selectedAnswers.filter((answer, index) => answer === questions[index]?.correctAnswer).length}/{questions.length}
                  </p>
                  <p className={`text-xl ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                    {t('perspectiveMatching.correctAnswers', 'Correct Answers')}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('perspectiveMatching.levelScore', 'Level Score')}</p>
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-indigo-600">{score}</p>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('perspectiveMatching.totalScore', 'Total Score')}</p>
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-600">{totalScore + score}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`rounded-xl p-6 mb-6 ${darkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
                <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('perspectiveMatching.levelScore', 'Level Score')}</p>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-red-500">{score}</p>
              </div>
            )}
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-indigo-600 hover:to-purple-600 shadow-lg transition-all w-full mb-3"
            >
              {level < MAX_LEVELS ? `Next Level ${level + 1}` : 'View Final Score'}
            </button>
            <button
              onClick={startGame}
              className={darkMode ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}
            >
              {t('perspectiveMatching.restart', 'Restart from Level 1')}
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-600 mb-4">{t('perspectiveMatching.victory', 'Congratulations!')}</h2>
            <p className={`text-xl ${darkMode ? 'text-slate-300' : 'text-gray-700'} font-medium mb-6`}>
              {t('perspectiveMatching.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className={`rounded-xl p-6 mb-6 ${darkMode ? 'bg-slate-700' : 'bg-indigo-50'}`}>
              <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('perspectiveMatching.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-indigo-600">{totalScore + score}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-indigo-600 hover:to-purple-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
