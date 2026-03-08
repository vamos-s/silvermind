'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

const WORDS = {
  easy: [
    'apple', 'book', 'chair', 'dog', 'egg', 'fish', 'glass', 'hat',
    '사과', '책', '의자', '개', '달걀', '물고기', '안경', '모자'
  ],
  medium: [
    'butterfly', 'mountain', 'rainbow', 'sunset', 'umbrella', 'window', 'zebra', 'garden',
    '나비', '산', '무지개', '일몰', '우산', '창문', '斑马', '정원'
  ],
  hard: [
    'adventure', 'chocolate', 'encyclopedia', 'philosophy', 'serendipity', 'extraordinary', 'magnificent', 'breathtaking',
    '모험', '초콜릿', '백과사전', '철학', '뜻밖의 발견', '비범한', '장엄한', '숨이 막히는'
  ]
}

const DURATION = { easy: 2000, medium: 1800, hard: 1500 }
const INPUT_TIME = 30

export default function WordRecallPage() {
  const { t, i18n } = useTranslation()
  const { currentDifficulty, addSession } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'showing' | 'input' | 'result'>('menu')
  const [words, setWords] = useState<string[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [correctWords, setCorrectWords] = useState<string[]>([])
  const [incorrectWords, setIncorrectWords] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(INPUT_TIME)

  const wordList = WORDS[currentDifficulty as keyof typeof WORDS]
  const duration = DURATION[currentDifficulty as keyof typeof DURATION]
  const wordCount = currentDifficulty === 'easy' ? 3 : currentDifficulty === 'medium' ? 5 : 7

  const filterByLanguage = (list: string[]) => {
    const isKorean = i18n.language === 'ko'
    return list.filter(word => (isKorean ? /[\uAC00-\uD7A3]/.test(word) : /[a-zA-Z]/.test(word)))
  }

  const startGame = () => {
    const languageFilteredWords = filterByLanguage(wordList)
    const shuffled = [...languageFilteredWords].sort(() => Math.random() - 0.5)
    const selectedWords = shuffled.slice(0, wordCount)

    setWords(selectedWords)
    setCurrentWordIndex(0)
    setUserInput('')
    setCorrectWords([])
    setIncorrectWords([])
    setTimeLeft(INPUT_TIME)
    setGameState('showing')

    // Show words one by one
    let index = 0
    const interval = setInterval(() => {
      index++
      if (index < words.length) {
        setCurrentWordIndex(index)
      } else {
        clearInterval(interval)
        setTimeout(() => {
          setGameState('input')
        }, 500)
      }
    }, duration)
  }

  const handleSubmit = () => {
    if (!userInput.trim()) return

    const inputWords = userInput.split(/[\s,]+/).filter(word => word.trim())
    const correct: string[] = []
    const incorrect: string[] = []

    inputWords.forEach(inputWord => {
      const normalizedInput = inputWord.toLowerCase().trim()
      const matchedWord = words.find(
        w => w.toLowerCase().trim() === normalizedInput
      )

      if (matchedWord && !correct.includes(matchedWord)) {
        correct.push(matchedWord)
      } else if (!incorrect.includes(inputWord.trim())) {
        incorrect.push(inputWord.trim())
      }
    })

    setCorrectWords(correct)
    setIncorrectWords(incorrect)

    addSession({
      id: Date.now().toString(),
      gameId: 'word-recall',
      difficulty: currentDifficulty,
      score: correct.length,
      completedAt: new Date(),
      durationSeconds: INPUT_TIME
    })

    setGameState('result')
  }

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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <Link
          href="/memory"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 text-lg"
        >
          <span className="mr-2">←</span> {t('back')}
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
          {t('wordRecall.title', 'Word Recall')}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {t('wordRecall.description', 'Remember the words and type them!')}
        </p>

        {/* Showing words */}
        {gameState === 'showing' && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center min-h-[400px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentWordIndex}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-gray-500 text-xl mb-6">
                  {t('wordRecall.word', 'Word')} {currentWordIndex + 1}/{words.length}
                </p>
                <p className="text-5xl md:text-7xl font-bold text-violet-600">
                  {words[currentWordIndex]}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Input phase */}
        {gameState === 'input' && (
          <>
            {/* Timer */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center">
                <p className="text-gray-600 text-lg">{t('wordRecall.timeLeft', 'Time Left')}</p>
                <p className={`text-4xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-violet-600'}`}>
                  {timeLeft}s
                </p>
              </div>
            </div>

            {/* Input area */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <p className="text-2xl font-bold text-gray-800 mb-4 text-center">
                {t('wordRecall.enterWords', 'Enter the words you remember')}
              </p>
              <p className="text-gray-600 mb-4 text-center">
                {t('wordRecall.separateByCommas', 'Separate words with commas or spaces')}
              </p>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={t('wordRecall.placeholder', 'apple, banana, orange')}
                className="w-full p-6 text-2xl border-4 border-gray-200 rounded-xl focus:border-violet-300 focus:outline-none resize-none min-h-[200px]"
                autoFocus
              />
              <button
                onClick={handleSubmit}
                className="w-full mt-6 bg-gradient-to-r from-violet-500 to-pink-500 text-white text-2xl font-bold py-4 rounded-xl hover:from-violet-600 hover:to-pink-600 shadow-lg transition-all"
              >
                {t('wordRecall.submit', 'Submit')}
              </button>
            </div>
          </>
        )}

        {/* Results */}
        {gameState === 'result' && (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                {t('wordRecall.results', 'Results')}
              </h2>
              <div className="text-center mb-6">
                <p className="text-6xl font-bold text-violet-600 mb-2">
                  {correctWords.length}/{words.length}
                </p>
                <p className="text-xl text-gray-600">
                  {t('wordRecall.correctWords', 'Correct words')}
                </p>
              </div>

              {correctWords.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-green-600 mb-3">
                    {t('wordRecall.correct', 'Correct')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {correctWords.map((word, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-lg font-semibold">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {incorrectWords.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-red-600 mb-3">
                    {t('wordRecall.incorrect', 'Incorrect')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {incorrectWords.map((word, index) => (
                      <span key={index} className="bg-red-100 text-red-800 px-4 py-2 rounded-lg text-lg font-semibold">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {correctWords.length < words.length && (
                <div className="p-4 bg-violet-50 rounded-lg">
                  <h3 className="text-xl font-bold text-violet-600 mb-2">
                    {t('wordRecall.missed', 'You missed')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {words
                      .filter(w => !correctWords.includes(w))
                      .map((word, index) => (
                        <span key={index} className="bg-violet-100 text-violet-800 px-4 py-2 rounded-lg text-lg font-semibold">
                          {word}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setGameState('menu')}
              className="w-full bg-gradient-to-r from-violet-500 to-pink-500 text-white text-2xl font-bold py-4 rounded-xl hover:from-violet-600 hover:to-pink-600 shadow-lg transition-all"
            >
              {t('playAgain', 'Play Again')}
            </button>
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
              {t('wordRecall.ready', 'Ready to test your memory?')}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {t('wordRecall.instructions', 'Watch the words appear, then type all the words you remember!')}
            </p>
            <div className="bg-violet-50 rounded-xl p-4 mb-6">
              <p className="text-gray-700">
                {t('wordRecall.difficultyInfo', 'Word count: ')}<span className="font-bold text-violet-600">{wordCount}</span>
                {' '}{t('wordRecall.timePerWord', 'seconds per word')}
              </p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-violet-500 to-pink-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-violet-600 hover:to-pink-600 shadow-lg transition-all"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
