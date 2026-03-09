'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'
import { WORD_ASSOCIATION_LEVELS } from '@/lib/game-data/levels'

import { SettingsPanel } from "@/components/SettingsPanel"
const MAX_LEVELS = 30

type WordPair = {
  word: string
  category: string
}

type Question = {
  word: string
  options: string[]
  correctIndex: number
}

const WORD_ASSOCIATIONS: Record<string, string[]> = {
  'fruits': ['apple', 'banana', 'orange', 'grape', 'mango', 'peach', 'pear', 'kiwi'],
  'animals': ['dog', 'cat', 'elephant', 'lion', 'tiger', 'zebra', 'giraffe', 'panda'],
  'colors': ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown'],
  'countries': ['Korea', 'USA', 'Japan', 'China', 'France', 'Germany', 'Brazil', 'India'],
  'sports': ['soccer', 'basketball', 'tennis', 'swimming', 'baseball', 'volleyball', 'golf', 'hockey'],
  'weather': ['sunny', 'rainy', 'cloudy', 'snowy', 'windy', 'stormy', 'foggy', 'hot'],
  'vehicles': ['car', 'bus', 'train', 'airplane', 'bicycle', 'motorcycle', 'boat', 'helicopter'],
  'food': ['pizza', 'burger', 'sushi', 'pasta', 'salad', 'soup', 'sandwich', 'steak'],
  'music': ['pop', 'rock', 'jazz', 'classical', 'hip-hop', 'country', 'blues', 'metal'],
  'technology': ['computer', 'phone', 'tablet', 'laptop', 'watch', 'camera', 'drone', 'robot'],
  'clothes': ['shirt', 'pants', 'dress', 'jacket', 'shoes', 'hat', 'socks', 'gloves'],
  'emotions': ['happy', 'sad', 'angry', 'excited', 'scared', 'surprised', 'bored', 'tired'],
  'nature': ['tree', 'flower', 'mountain', 'river', 'ocean', 'forest', 'desert', 'sky'],
  'furniture': ['chair', 'table', 'bed', 'sofa', 'desk', 'shelf', 'cabinet', 'lamp'],
  'instruments': ['piano', 'guitar', 'violin', 'drums', 'flute', 'trumpet', 'saxophone', 'cello'],
}

const generateQuestions = (questionCount: number, optionCount: number): Question[] => {
  const categories = Object.keys(WORD_ASSOCIATIONS)
  const questions: Question[] = []

  for (let i = 0; i < questionCount; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const words = WORD_ASSOCIATIONS[category]
    const shuffled = [...words].sort(() => Math.random() - 0.5)
    const word = shuffled[0]

    // Get correct word from same category
    const correctWord = shuffled.slice(1, 2)[0]

    // Get distractors from different categories
    const distractors: string[] = []
    const otherCategories = categories.filter(c => c !== category)
    while (distractors.length < optionCount - 1) {
      const randomCategory = otherCategories[Math.floor(Math.random() * otherCategories.length)]
      const categoryWords = WORD_ASSOCIATIONS[randomCategory]
      const randomWord = categoryWords[Math.floor(Math.random() * categoryWords.length)]
      if (!distractors.includes(randomWord) && randomWord !== correctWord) {
        distractors.push(randomWord)
      }
    }

    // Combine and shuffle
    const options = [correctWord, ...distractors].sort(() => Math.random() - 0.5)
    const correctIndex = options.indexOf(correctWord)

    questions.push({
      word,
      options,
      correctIndex
    })
  }

  return questions
}

export default function WordAssociationPage() {
  const { t } = useTranslation()
  const { addSession } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'showing' | 'input' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const settings = useMemo(
    () => WORD_ASSOCIATION_LEVELS[Math.min(level - 1, WORD_ASSOCIATION_LEVELS.length - 1)],
    [level]
  )

  const correctCount = useMemo(
    () => selectedAnswers.filter((answer, index) => {
      const question = questions[index]
      return question && answer === question.correctIndex
    }).length,
    [selectedAnswers, questions]
  )

  const getLevelScore = useCallback((correct: number, total: number) => {
    const baseScore = (correct / total) * 1000
    const timeBonus = timeLeft * 15
    return Math.round(baseScore + timeBonus)
  }, [timeLeft])

  const startLevel = useCallback(() => {
    const newQuestions = generateQuestions(settings.questionCount, settings.optionCount || 4)
    setQuestions(newQuestions)
    setCurrentQuestionIndex(0)
    setSelectedAnswers([])
    setShowResult(false)
    setTimeLeft(settings.inputTime)
    setGameState('showing')

    setTimeout(() => {
      setGameState('input')
    }, 2000)
  }, [settings.questionCount, settings.optionCount, settings.inputTime])

  const startGame = useCallback(() => {
    setScore(0)
    setTotalScore(0)
    setLevel(1)
    startLevel()
  }, [startLevel])

  const handleAnswerSelect = useCallback((optionIndex: number) => {
    if (gameState !== 'input' || showResult) return

    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = optionIndex
    setSelectedAnswers(newAnswers)
    setShowResult(true)
  }, [gameState, showResult, selectedAnswers, currentQuestionIndex])

  const handleNext = useCallback(() => {
    setShowResult(false)
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      const correctCount = selectedAnswers.filter((answer, index) => {
        const question = questions[index]
        return answer === question.correctIndex
      }).length

      const levelScore = getLevelScore(correctCount, questions.length)
      setScore(levelScore)
      setGameState('levelComplete')
    }
  }, [currentQuestionIndex, questions, selectedAnswers, getLevelScore])

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
        return question && answer === question.correctIndex
      }).length

      const levelScore = getLevelScore(correctCount, questions.length)
      setScore(levelScore)
      setGameState('levelComplete')
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [gameState, timeLeft, selectedAnswers, questions])

  const nextLevel = useCallback(() => {
    const levelScore = score
    setTotalScore(prev => prev + levelScore)

    if (level >= MAX_LEVELS) {
      addSession({
        id: Date.now().toString(),
        gameId: 'word-association',
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

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-pink-50 p-4 md:p-8">
      <SettingsPanel />
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link
          href="/memory"
          className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium mb-6 text-lg"
        >
          <span className="mr-2">←</span> {t('back', 'Back')}
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          {t('wordAssociation.title', 'Word Association')}
        </h1>
        <p className="text-lg text-gray-700 font-medium mb-8">
          {t('wordAssociation.description', 'Find the word that belongs in the same category!')}
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
                Total Score: <span className="text-fuchsia-600 font-bold">{totalScore}</span>
              </p>
            )}
            <div className="bg-fuchsia-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 mb-2">{t('wordAssociation.levelInfo', 'Level Settings')}:</h3>
              <ul className="text-gray-700 space-y-1 font-medium">
                <li>• {t('wordAssociation.questionCount', 'Question Count')}: {settings.questionCount}</li>
                <li>• {t('wordAssociation.optionCount', 'Options per Question')}: {settings.optionCount}</li>
                <li>• {t('wordAssociation.inputTime', 'Time Limit')}: {settings.inputTime}s</li>
              </ul>
            </div>
            <button
              onClick={startLevel}
              className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-fuchsia-600 hover:to-pink-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Showing word */}
        {gameState === 'showing' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-xl text-gray-600 mb-4 font-medium">
              {t('wordAssociation.memorize', 'Remember the category!')}
            </p>
            {currentQuestion && (
              <div className="bg-gradient-to-br from-fuchsia-100 to-pink-100 rounded-2xl p-12">
                <p className="text-5xl md:text-6xl font-bold text-fuchsia-600">
                  {currentQuestion.word}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Input phase */}
        {gameState === 'input' && (
          <>
            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('wordAssociation.question', 'Question')}</p>
                  <p className="text-3xl font-bold text-fuchsia-600">
                    {currentQuestionIndex + 1}/{questions.length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('wordAssociation.score', 'Score')}</p>
                  <p className="text-3xl font-bold text-pink-600">{totalScore}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('wordAssociation.timeLeft', 'Time Left')}</p>
                  <p className={`text-4xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-fuchsia-600'}`}>
                    {timeLeft}s
                  </p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                  className="bg-gradient-to-r from-fuchsia-500 to-pink-500 h-full"
                />
              </div>
            </div>

            {/* Question area */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
              {currentQuestion && (
                <>
                  <div className="bg-gradient-to-br from-fuchsia-100 to-pink-100 rounded-2xl p-8 mb-6">
                    <p className="text-4xl md:text-5xl font-bold text-fuchsia-600">
                      {currentQuestion.word}
                    </p>
                  </div>

                  {showResult ? (
                    <div className="mb-6">
                      <div className={`p-4 rounded-xl ${
                        selectedAnswers[currentQuestionIndex] === currentQuestion.correctIndex
                          ? 'bg-green-50 border-2 border-green-500'
                          : 'bg-red-50 border-2 border-red-500'
                      }`}>
                        <p className="text-lg font-bold mb-2">
                          {selectedAnswers[currentQuestionIndex] === currentQuestion.correctIndex
                            ? '✅ Correct!'
                            : '❌ Incorrect!'}
                        </p>
                        <p className="text-gray-700">
                          {t('wordAssociation.yourAnswer', 'Your Answer')}: {currentQuestion.options[selectedAnswers[currentQuestionIndex]]}
                        </p>
                        <p className="text-gray-700">
                          {t('wordAssociation.correctAnswer', 'Correct Answer')}: {currentQuestion.options[currentQuestion.correctIndex]}
                        </p>
                      </div>
                      <button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white text-xl font-bold py-3 px-8 rounded-xl hover:from-fuchsia-600 hover:to-pink-600 shadow-lg transition-all"
                      >
                        {currentQuestionIndex < questions.length - 1
                          ? t('wordAssociation.nextQuestion', 'Next Question')
                          : t('wordAssociation.seeResults', 'See Results')}
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-gray-800 mb-6">
                        {t('wordAssociation.selectRelated', 'Select the related word!')}
                      </p>
                      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                        {currentQuestion.options.map((option, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAnswerSelect(index)}
                            className="p-4 bg-fuchsia-100 hover:bg-fuchsia-200 rounded-xl font-bold text-fuchsia-800 transition-colors text-lg"
                          >
                            {option}
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
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">
              {score > 0 ? '✅' : '❌'}
            </div>
            <h2 className={`text-4xl font-bold mb-4 ${score > 0 ? 'text-fuchsia-600' : 'text-red-500'}`}>
              {score > 0 ? `Level ${level} Complete!` : 'Level Failed!'}
            </h2>
            {score > 0 ? (
              <div className="bg-fuchsia-50 rounded-xl p-6 mb-6">
                <div className="text-center mb-4">
                  <p className="text-6xl font-bold text-fuchsia-600 mb-2">
                    {correctCount}/{questions.length}
                  </p>
                  <p className="text-xl text-gray-600">
                    {t('wordAssociation.correctAnswers', 'Correct Answers')}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-gray-700 text-sm font-medium">{t('wordAssociation.levelScore', 'Level Score')}</p>
                    <p className="text-3xl font-bold text-fuchsia-600">{score}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 text-sm font-medium">{t('wordAssociation.totalScore', 'Total Score')}</p>
                    <p className="text-3xl font-bold text-pink-600">{totalScore + score}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 rounded-xl p-6 mb-6">
                <p className="text-gray-700 text-sm font-medium">{t('wordAssociation.levelScore', 'Level Score')}</p>
                <p className="text-3xl font-bold text-red-600">{score}</p>
              </div>
            )}
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-fuchsia-600 hover:to-pink-600 shadow-lg transition-all w-full mb-3"
            >
              {level < MAX_LEVELS ? `Next Level ${level + 1}` : 'View Final Score'}
            </button>
            <button
              onClick={startGame}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              {t('wordAssociation.restart', 'Restart from Level 1')}
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
            <h2 className="text-4xl font-bold text-fuchsia-600 mb-4">{t('wordAssociation.victory', 'Congratulations!')}</h2>
            <p className="text-xl text-gray-700 font-medium mb-6">
              {t('wordAssociation.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className="bg-fuchsia-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 text-sm font-medium">{t('wordAssociation.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-fuchsia-600">{totalScore + score}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-fuchsia-600 hover:to-pink-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
