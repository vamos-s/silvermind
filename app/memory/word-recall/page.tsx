'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

import { SettingsPanel } from "@/components/SettingsPanel"
const MAX_LEVELS = 30

const WORDS = {
  easy: [
    'apple', 'book', 'chair', 'dog', 'egg', 'fish', 'glass', 'hat', 'ink', 'jam', 'key', 'lamp', 'moon',
    '사과', '책', '의자', '개', '달걀', '물고기', '안경', '모자', '잉크', '잼', '열쇠', '램프', '달'
  ],
  medium: [
    'butterfly', 'mountain', 'rainbow', 'sunset', 'umbrella', 'window', 'zebra', 'garden', 'pyramid', 'dolphin', 'galaxy', 'symphony',
    '나비', '산', '무지개', '일몰', '우산', '창문', '斑马', '정원', '피라미드', '돌고래', '은하', '교향곡'
  ],
  hard: [
    'adventure', 'chocolate', 'encyclopedia', 'philosophy', 'serendipity', 'extraordinary', 'magnificent', 'breathtaking', 'consciousness', 'electromagnetic', 'phenomenological', 'understanding',
    '모험', '초콜릿', '백과사전', '철학', '뜻밖의 발견', '비범한', '장엄한', '숨이 막히는', '의식', '전자기', '현상학적', '이해'
  ],
  expert: [
    'epistemological', 'psycholinguistics', 'neuroplasticity', 'phenomenologically', 'characteristically', 'unquestionably', 'simultaneously', 'comprehensive', 'straightforward', 'interchangeable',
    '인식론적', '심리언어학', '신경가소성', '현상학적으로', '특성적으로', '의심할 여지 없이', '동시에', '포괄적인', '간단명료한', '상호 교환 가능한'
  ]
}

const LEVEL_SETTINGS = [
  // Levels 1-5: Easy introduction
  { wordCount: 3, duration: 2500, inputTime: 30, difficulty: 'easy' },    // Level 1
  { wordCount: 4, duration: 2300, inputTime: 35, difficulty: 'easy' },    // Level 2
  { wordCount: 5, duration: 2000, inputTime: 40, difficulty: 'easy' },    // Level 3
  { wordCount: 5, duration: 1800, inputTime: 45, difficulty: 'easy' },    // Level 4
  { wordCount: 6, duration: 1600, inputTime: 50, difficulty: 'easy' },    // Level 5

  // Levels 6-10: Medium challenge
  { wordCount: 6, duration: 1500, inputTime: 55, difficulty: 'medium' },  // Level 6
  { wordCount: 7, duration: 1400, inputTime: 60, difficulty: 'medium' },  // Level 7
  { wordCount: 7, duration: 1300, inputTime: 65, difficulty: 'medium' },  // Level 8
  { wordCount: 8, duration: 1200, inputTime: 70, difficulty: 'medium' },  // Level 9
  { wordCount: 8, duration: 1100, inputTime: 75, difficulty: 'medium' },  // Level 10

  // Levels 11-15: Harder progression
  { wordCount: 8, duration: 1000, inputTime: 80, difficulty: 'hard' },   // Level 11
  { wordCount: 9, duration: 950, inputTime: 85, difficulty: 'hard' },     // Level 12
  { wordCount: 9, duration: 900, inputTime: 90, difficulty: 'hard' },     // Level 13
  { wordCount: 10, duration: 850, inputTime: 95, difficulty: 'hard' },    // Level 14
  { wordCount: 10, duration: 800, inputTime: 100, difficulty: 'hard' },   // Level 15

  // Levels 16-20: Advanced challenge
  { wordCount: 10, duration: 750, inputTime: 105, difficulty: 'hard' },   // Level 16
  { wordCount: 11, duration: 700, inputTime: 110, difficulty: 'hard' },   // Level 17
  { wordCount: 11, duration: 650, inputTime: 115, difficulty: 'hard' },   // Level 18
  { wordCount: 12, duration: 600, inputTime: 120, difficulty: 'hard' },   // Level 19
  { wordCount: 12, duration: 550, inputTime: 125, difficulty: 'hard' },   // Level 20

  // Levels 21-25: Expert level
  { wordCount: 12, duration: 500, inputTime: 130, difficulty: 'expert' }, // Level 21
  { wordCount: 13, duration: 480, inputTime: 135, difficulty: 'expert' }, // Level 22
  { wordCount: 13, duration: 460, inputTime: 140, difficulty: 'expert' }, // Level 23
  { wordCount: 14, duration: 440, inputTime: 145, difficulty: 'expert' }, // Level 24
  { wordCount: 14, duration: 420, inputTime: 150, difficulty: 'expert' }, // Level 25

  // Levels 26-30: Master level
  { wordCount: 15, duration: 400, inputTime: 155, difficulty: 'expert' }, // Level 26
  { wordCount: 15, duration: 380, inputTime: 160, difficulty: 'expert' }, // Level 27
  { wordCount: 16, duration: 360, inputTime: 165, difficulty: 'expert' }, // Level 28
  { wordCount: 16, duration: 340, inputTime: 170, difficulty: 'expert' }, // Level 29
  { wordCount: 17, duration: 320, inputTime: 175, difficulty: 'expert' }, // Level 30
]

export default function WordRecallPage() {
  const { t, i18n } = useTranslation()
  const { addSession } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'showing' | 'input' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [words, setWords] = useState<string[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [correctWords, setCorrectWords] = useState<string[]>([])
  const [incorrectWords, setIncorrectWords] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)

  const settings = useMemo(() => LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)], [level])

  const filterByLanguage = useCallback((list: string[]) => {
    const isKorean = i18n.language === 'ko'
    return list.filter(word => (isKorean ? /[\uAC00-\uD7A3]/.test(word) : /[a-zA-Z]/.test(word)))
  }, [i18n.language])

  const getLevelScore = useCallback((correct: number) => {
    const baseScore = correct * 50
    const timeBonus = timeLeft * 2
    return baseScore + timeBonus
  }, [timeLeft])

  const startLevel = useCallback(() => {
    const wordList = WORDS[settings.difficulty as keyof typeof WORDS]
    const languageFilteredWords = filterByLanguage(wordList)
    const shuffled = [...languageFilteredWords].sort(() => Math.random() - 0.5)
    const selectedWords = shuffled.slice(0, settings.wordCount)

    setWords(selectedWords)
    setCurrentWordIndex(0)
    setUserInput('')
    setCorrectWords([])
    setIncorrectWords([])
    setTimeLeft(settings.inputTime)
    setGameState('showing')

    // Show words one by one
    let index = 0
    const interval = setInterval(() => {
      index++
      if (index < selectedWords.length) {
        setCurrentWordIndex(index)
      } else {
        clearInterval(interval)
        setTimeout(() => {
          setGameState('input')
        }, 500)
      }
    }, settings.duration)
  }, [settings.difficulty, settings.wordCount, settings.inputTime, settings.duration, filterByLanguage])

  const startGame = useCallback(() => {
    setScore(0)
    setTotalScore(0)
    setLevel(1)
    startLevel()
  }, [startLevel])

  const handleSubmit = useCallback(() => {
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

    const levelScore = Math.round(getLevelScore(correct.length))
    setScore(levelScore)
    setGameState('levelComplete')
  }, [userInput, words, getLevelScore])

  const nextLevel = useCallback(() => {
    const levelScore = score
    setTotalScore(prev => prev + levelScore)

    if (level >= MAX_LEVELS) {
      addSession({
        id: Date.now().toString(),
        gameId: 'word-recall',
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
  }, [score, level, totalScore, addSession, startLevel])

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
          {t('wordRecall.title', 'Word Recall')}
        </h1>
        <p className="text-lg text-gray-700 font-medium mb-8">
          {t('wordRecall.description', 'Remember the words and type them!')}
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
                Total Score: <span className="text-violet-600 font-bold">{totalScore}</span>
              </p>
            )}
            <div className="bg-violet-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 mb-2">{t('wordRecall.levelInfo', 'Level Settings')}:</h3>
              <ul className="text-gray-700 space-y-1 font-medium">
                <li>• {t('wordRecall.wordCount', 'Word Count')}: {settings.wordCount}</li>
                <li>• {t('wordRecall.displayTime', 'Display Time')}: {settings.duration / 1000}s per word</li>
                <li>• {t('wordRecall.inputTime', 'Input Time')}: {settings.inputTime}s</li>
              </ul>
            </div>
            <button
              onClick={startLevel}
              className="bg-gradient-to-r from-violet-500 to-pink-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-violet-600 hover:to-pink-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

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
            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('wordRecall.level', 'Level')}</p>
                  <p className="text-3xl font-bold text-violet-600">{level}/{MAX_LEVELS}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('wordRecall.score', 'Score')}</p>
                  <p className="text-3xl font-bold text-pink-600">{totalScore}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('wordRecall.timeLeft', 'Time Left')}</p>
                  <p className={`text-4xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-violet-600'}`}>
                    {timeLeft}s
                  </p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((level - 1) / MAX_LEVELS) * 100}%` }}
                  className="bg-gradient-to-r from-violet-500 to-pink-500 h-full"
                />
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
                className="w-full p-6 text-2xl border-4 border-gray-300 rounded-xl focus:border-violet-300 focus:outline-none resize-none min-h-[200px] text-gray-800 placeholder-gray-500"
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

        {/* Level Complete */}
        {gameState === 'levelComplete' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-4xl font-bold text-violet-600 mb-4">Level {level} Complete!</h2>
            <div className="bg-violet-50 rounded-xl p-6 mb-6">
              <div className="text-center mb-4">
                <p className="text-6xl font-bold text-violet-600 mb-2">
                  {correctWords.length}/{words.length}
                </p>
                <p className="text-xl text-gray-600">
                  {t('wordRecall.correctWords', 'Correct words')}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('wordRecall.levelScore', 'Level Score')}</p>
                  <p className="text-3xl font-bold text-violet-600">{score}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('wordRecall.totalScore', 'Total Score')}</p>
                  <p className="text-3xl font-bold text-pink-600">{totalScore + score}</p>
                </div>
              </div>
            </div>
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-violet-500 to-pink-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-violet-600 hover:to-pink-600 shadow-lg transition-all w-full mb-3"
            >
              {level < MAX_LEVELS ? `Next Level ${level + 1}` : 'View Final Score'}
            </button>
            <button
              onClick={startGame}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              {t('wordRecall.restart', 'Restart from Level 1')}
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
            <h2 className="text-4xl font-bold text-gray-800 mb-4">{t('wordRecall.gameOver', 'Game Over!')}</h2>
            <div className="bg-orange-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 text-sm font-medium">{t('wordRecall.finalScore', 'Final Score')}</p>
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
              {t('wordRecall.restart', 'Restart from Level 1')}
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
            <h2 className="text-4xl font-bold text-violet-600 mb-4">{t('wordRecall.victory', 'Congratulations!')}</h2>
            <p className="text-xl text-gray-700 font-medium mb-6">
              {t('wordRecall.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className="bg-violet-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 text-sm font-medium">{t('wordRecall.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-violet-600">{totalScore + score}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-violet-500 to-pink-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-violet-600 hover:to-pink-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
