'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

const MAX_LEVELS = 30

type Block = {
  id: number
  x: number
  y: number
  z: number
  color: string
}

type Question = {
  id: number
  pattern: Block[]
  options: Block[][]
  correctAnswer: number
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6', '#ec4899']

const LEVEL_SETTINGS = [
  // Levels 1-5: Easy introduction
  { patternComplexity: 3, optionCount: 3, timeLimit: 25, difficulty: 'easy' },
  { patternComplexity: 3, optionCount: 3, timeLimit: 23, difficulty: 'easy' },
  { patternComplexity: 4, optionCount: 3, timeLimit: 28, difficulty: 'easy' },
  { patternComplexity: 4, optionCount: 4, timeLimit: 26, difficulty: 'easy' },
  { patternComplexity: 5, optionCount: 4, timeLimit: 30, difficulty: 'easy' },

  // Levels 6-10: Medium challenge
  { patternComplexity: 5, optionCount: 4, timeLimit: 28, difficulty: 'medium' },
  { patternComplexity: 6, optionCount: 4, timeLimit: 32, difficulty: 'medium' },
  { patternComplexity: 6, optionCount: 5, timeLimit: 30, difficulty: 'medium' },
  { patternComplexity: 7, optionCount: 5, timeLimit: 34, difficulty: 'medium' },
  { patternComplexity: 7, optionCount: 5, timeLimit: 32, difficulty: 'medium' },

  // Levels 11-15: Harder progression
  { patternComplexity: 8, optionCount: 5, timeLimit: 36, difficulty: 'hard' },
  { patternComplexity: 8, optionCount: 6, timeLimit: 34, difficulty: 'hard' },
  { patternComplexity: 9, optionCount: 6, timeLimit: 38, difficulty: 'hard' },
  { patternComplexity: 9, optionCount: 6, timeLimit: 36, difficulty: 'hard' },
  { patternComplexity: 10, optionCount: 6, timeLimit: 40, difficulty: 'hard' },

  // Levels 16-20: Advanced challenge
  { patternComplexity: 10, optionCount: 6, timeLimit: 38, difficulty: 'hard' },
  { patternComplexity: 11, optionCount: 7, timeLimit: 42, difficulty: 'hard' },
  { patternComplexity: 11, optionCount: 7, timeLimit: 40, difficulty: 'hard' },
  { patternComplexity: 12, optionCount: 7, timeLimit: 44, difficulty: 'hard' },
  { patternComplexity: 12, optionCount: 7, timeLimit: 42, difficulty: 'hard' },

  // Levels 21-25: Expert level
  { patternComplexity: 13, optionCount: 7, timeLimit: 46, difficulty: 'expert' },
  { patternComplexity: 13, optionCount: 8, timeLimit: 44, difficulty: 'expert' },
  { patternComplexity: 14, optionCount: 8, timeLimit: 48, difficulty: 'expert' },
  { patternComplexity: 14, optionCount: 8, timeLimit: 46, difficulty: 'expert' },
  { patternComplexity: 15, optionCount: 8, timeLimit: 50, difficulty: 'expert' },

  // Levels 26-30: Master level
  { patternComplexity: 15, optionCount: 8, timeLimit: 48, difficulty: 'expert' },
  { patternComplexity: 16, optionCount: 8, timeLimit: 52, difficulty: 'expert' },
  { patternComplexity: 16, optionCount: 8, timeLimit: 50, difficulty: 'expert' },
  { patternComplexity: 17, optionCount: 8, timeLimit: 54, difficulty: 'expert' },
  { patternComplexity: 17, optionCount: 8, timeLimit: 52, difficulty: 'expert' },
]

export default function PatternIn3DPage() {
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

  const generateBlock = (id: number): Block => {
    return {
      id,
      x: Math.floor(Math.random() * 3),
      y: Math.floor(Math.random() * 3),
      z: Math.floor(Math.random() * 3),
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    }
  }

  const rotatePattern = (pattern: Block[]): Block[] => {
    return pattern.map(block => ({
      ...block,
      x: block.y,
      y: 2 - block.x
    }))
  }

  const mirrorPattern = (pattern: Block[]): Block[] => {
    return pattern.map(block => ({
      ...block,
      z: 2 - block.z
    }))
  }

  const isPatternMatch = (pattern1: Block[], pattern2: Block[]): boolean => {
    if (pattern1.length !== pattern2.length) return false

    const sorted1 = [...pattern1].sort((a, b) => 
      a.x - b.x || a.y - b.y || a.z - b.z || a.color.localeCompare(b.color)
    )
    const sorted2 = [...pattern2].sort((a, b) => 
      a.x - b.x || a.y - b.y || a.z - b.z || a.color.localeCompare(b.color)
    )

    return sorted1.every((block, i) => 
      block.x === sorted2[i].x && 
      block.y === sorted2[i].y && 
      block.z === sorted2[i].z && 
      block.color === sorted2[i].color
    )
  }

  const generateQuestions = useCallback(() => {
    const newQuestions: Question[] = []

    for (let i = 0; i < settings.patternComplexity; i++) {
      const pattern: Block[] = []
      const usedPositions = new Set<string>()

      for (let j = 0; j < 5 + Math.floor(Math.random() * 3); j++) {
        const block = generateBlock(j)
        const posKey = `${block.x},${block.y},${block.z}`
        if (!usedPositions.has(posKey)) {
          usedPositions.add(posKey)
          pattern.push(block)
        }
      }

      const correctAnswer = Math.floor(Math.random() * settings.optionCount)
      const options: Block[][] = []

      for (let j = 0; j < settings.optionCount; j++) {
        if (j === correctAnswer) {
          options.push([...pattern])
        } else {
          const transformedPattern = Math.random() > 0.5 
            ? rotatePattern([...pattern])
            : mirrorPattern([...pattern])
          
          if (isPatternMatch(transformedPattern, pattern)) {
            options.push([...pattern].sort(() => Math.random() - 0.5))
          } else {
            const modifiedPattern = [...transformedPattern].map(block => ({
              ...block,
              color: COLORS[Math.floor(Math.random() * COLORS.length)]
            }))
            options.push(modifiedPattern)
          }
        }
      }

      newQuestions.push({
        id: i,
        pattern,
        options: options.sort(() => Math.random() - 0.5),
        correctAnswer: options.findIndex((opt, idx) => isPatternMatch(opt, pattern))
      })
    }

    return newQuestions
  }, [settings.patternComplexity, settings.optionCount])

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
        gameId: 'pattern-in-3d',
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

  const render3DPattern = (pattern: Block[], size = 150) => {
    const gridSize = 60
    const offsetX = size / 2 - (gridSize * 3) / 2
    const offsetY = size / 2 - (gridSize * 3) / 2

    return (
      <div 
        className={`relative rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}
        style={{ width: size, height: size }}
      >
        {pattern.map((block) => {
          const x = offsetX + block.x * gridSize + block.z * 15
          const y = offsetY + block.y * gridSize - block.z * 15
          const scale = 1 - block.z * 0.15
          const zIndex = 3 - block.z

          return (
            <div
              key={block.id}
              className="absolute rounded-lg shadow-lg"
              style={{
                left: x,
                top: y,
                width: gridSize * scale,
                height: gridSize * scale,
                backgroundColor: block.color,
                transform: 'translate(-50%, -50%)',
                zIndex,
                border: darkMode ? '2px solid #1e293b' : '2px solid rgba(0,0,0,0.2)'
              }}
            />
          )
        })}
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-emerald-50 via-white to-teal-50'} p-4 md:p-8`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link
          href="/spatial"
          className={`inline-flex items-center ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium mb-6 text-lg`}
        >
          <span className="mr-2">←</span> {t('back', 'Back')}
        </Link>

        <h1 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-slate-50' : 'text-gray-800'} mb-2`}>
          {t('patternIn3D.title', 'Pattern in 3D')}
        </h1>
        <p className={`text-lg ${darkMode ? 'text-slate-300' : 'text-gray-700'} font-medium mb-8`}>
          {t('patternIn3D.description', 'Match the 3D pattern shown!')}
        </p>

        {/* Menu */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-8 text-center`}
          >
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-slate-50' : 'text-gray-800'} mb-2`}>
              Level {level}
            </h2>
            {level > 1 && (
              <p className={`text-lg ${darkMode ? 'text-slate-300' : 'text-gray-700'} mb-4 font-medium`}>
                Total Score: <span className="text-emerald-500 font-bold">{totalScore}</span>
              </p>
            )}
            <div className={`rounded-xl p-4 mb-6 text-left ${darkMode ? 'bg-slate-700' : 'bg-emerald-50'}`}>
              <h3 className={`font-bold ${darkMode ? 'text-slate-50' : 'text-gray-800'} mb-2`}>{t('patternIn3D.levelInfo', 'Level Settings')}:</h3>
              <ul className={`space-y-1 font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <li>• {t('patternIn3D.patternComplexity', 'Pattern Complexity')}: {settings.patternComplexity}</li>
                <li>• {t('patternIn3D.optionCount', 'Options per Question')}: {settings.optionCount}</li>
                <li>• {t('patternIn3D.timeLimit', 'Time Limit')}: {settings.timeLimit}s</li>
              </ul>
            </div>
            <button
              onClick={startLevel}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-emerald-600 hover:to-teal-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Showing pattern */}
        {gameState === 'showing' && (
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-8 text-center`}>
            <p className={`text-xl ${darkMode ? 'text-slate-300' : 'text-gray-600'} mb-4 font-medium`}>
              {t('patternIn3D.memorize', 'Memorize the pattern!')}
            </p>
            {currentQuestion && (
              <div className="flex justify-center">
                {render3DPattern(currentQuestion.pattern, 200)}
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
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('patternIn3D.question', 'Question')}</p>
                  <p className="text-3xl font-bold text-emerald-500">
                    {currentQuestionIndex + 1}/{questions.length}
                  </p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('patternIn3D.score', 'Score')}</p>
                  <p className="text-3xl font-bold text-teal-500">{totalScore}</p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('patternIn3D.timeLeft', 'Time Left')}</p>
                  <p className={`text-4xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {timeLeft}s
                  </p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 dark:bg-slate-600 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full"
                />
              </div>
            </div>

            {/* Question area */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-8 mb-6 text-center`}>
              {currentQuestion && (
                <>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-slate-50' : 'text-gray-800'} mb-6`}>
                    {t('patternIn3D.selectMatching', 'Select the matching pattern!')}
                  </p>

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
                          {t('patternIn3D.correctAnswer', 'Correct Answer')}: {currentQuestion.correctAnswer + 1}
                        </p>
                      </div>
                      <button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xl font-bold py-3 px-8 rounded-xl hover:from-emerald-600 hover:to-teal-600 shadow-lg transition-all"
                      >
                        {currentQuestionIndex < questions.length - 1
                          ? t('patternIn3D.nextQuestion', 'Next Question')
                          : t('patternIn3D.seeResults', 'See Results')}
                      </button>
                    </div>
                  ) : (
                    <div className={`grid grid-cols-2 gap-4 ${settings.optionCount === 3 ? 'max-w-lg mx-auto' : 'max-w-2xl mx-auto'}`}>
                      {currentQuestion.options.map((option, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleAnswerSelect(index)}
                          className={`p-4 rounded-xl transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                          <div className="mb-2 text-lg font-bold text-emerald-600">{index + 1}</div>
                          {render3DPattern(option, 100)}
                        </motion.button>
                      ))}
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
            className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-8 text-center`}
          >
            <div className="text-6xl mb-4">
              {score > 0 ? '✅' : '❌'}
            </div>
            <h2 className={`text-4xl font-bold mb-4 ${score > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {score > 0 ? `Level ${level} Complete!` : 'Level Failed!'}
            </h2>
            {score > 0 ? (
              <div className={`rounded-xl p-6 mb-6 ${darkMode ? 'bg-slate-700' : 'bg-emerald-50'}`}>
                <div className="text-center mb-4">
                  <p className="text-6xl font-bold text-emerald-500 mb-2">
                    {selectedAnswers.filter((answer, index) => answer === questions[index]?.correctAnswer).length}/{questions.length}
                  </p>
                  <p className={`text-xl ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                    {t('patternIn3D.correctAnswers', 'Correct Answers')}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('patternIn3D.levelScore', 'Level Score')}</p>
                    <p className="text-3xl font-bold text-emerald-500">{score}</p>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('patternIn3D.totalScore', 'Total Score')}</p>
                    <p className="text-3xl font-bold text-teal-500">{totalScore + score}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`rounded-xl p-6 mb-6 ${darkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
                <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('patternIn3D.levelScore', 'Level Score')}</p>
                <p className="text-3xl font-bold text-red-500">{score}</p>
              </div>
            )}
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-emerald-600 hover:to-teal-600 shadow-lg transition-all w-full mb-3"
            >
              {level < MAX_LEVELS ? `Next Level ${level + 1}` : 'View Final Score'}
            </button>
            <button
              onClick={startGame}
              className={darkMode ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}
            >
              {t('patternIn3D.restart', 'Restart from Level 1')}
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
            <h2 className="text-4xl font-bold text-emerald-500 mb-4">{t('patternIn3D.victory', 'Congratulations!')}</h2>
            <p className={`text-xl ${darkMode ? 'text-slate-300' : 'text-gray-700'} font-medium mb-6`}>
              {t('patternIn3D.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className={`rounded-xl p-6 mb-6 ${darkMode ? 'bg-slate-700' : 'bg-emerald-50'}`}>
              <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('patternIn3D.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-emerald-500">{totalScore + score}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-emerald-600 hover:to-teal-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
