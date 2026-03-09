'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'
import { SYNONYMS, LEVEL_SETTINGS } from '@/lib/constants/synonym-matcher'

const MAX_LEVELS = 30


interface WordCard {
  id: number
  word: string
  isOriginal: boolean
  matched: boolean
  isDistraction: boolean
  correctMatchId?: number
}

export default function SynonymMatcherPage() {
  const { t } = useTranslation()
  const { addSession } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [cards, setCards] = useState<WordCard[]>([])
  const [selectedCard, setSelectedCard] = useState<WordCard | null>(null)
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [wrongAttempts, setWrongAttempts] = useState(0)

  const settings = useMemo(
    () => LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)],
    [level]
  )

  const getLevelScore = useCallback(() => {
    const baseScore = level * 50
    const timeBonus = timeLeft * 3
    const wrongPenalty = wrongAttempts * 10
    return Math.max(0, baseScore + timeBonus - wrongPenalty)
  }, [level, timeLeft, wrongAttempts])

  const generateLevel = useCallback(() => {
    const timeLimit = LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)].timeLimit
    setTimeLeft(timeLimit)

    const pairCount = settings.pairs
    const distractionCount = settings.distractions
    const words = Object.keys(SYNONYMS)
    const selectedWords: string[] = []

    // Select random words
    while (selectedWords.length < pairCount) {
      const randomWord = words[Math.floor(Math.random() * words.length)]
      if (!selectedWords.includes(randomWord)) {
        selectedWords.push(randomWord)
      }
    }

    // Create cards
    const newCards: WordCard[] = []
    let cardId = 0

    // Add synonym pairs
    for (let i = 0; i < pairCount; i++) {
      const originalWord = selectedWords[i]
      const synonyms = SYNONYMS[originalWord]
      const synonymWord = synonyms[Math.floor(Math.random() * synonyms.length)]

      newCards.push({
        id: cardId++,
        word: originalWord,
        isOriginal: true,
        matched: false,
        isDistraction: false,
        correctMatchId: cardId + 1
      })

      newCards.push({
        id: cardId++,
        word: synonymWord,
        isOriginal: false,
        matched: false,
        isDistraction: false,
        correctMatchId: cardId - 1
      })
    }

    // Add distractions
    const usedSynonyms = new Set(newCards.map(c => c.word))
    for (let i = 0; i < distractionCount; i++) {
      let distractionWord
      let attempts = 0

      do {
        const randomKey = words[Math.floor(Math.random() * words.length)]
        const randomSynonyms = SYNONYMS[randomKey]
        distractionWord = randomSynonyms[Math.floor(Math.random() * randomSynonyms.length)]
        attempts++
      } while (usedSynonyms.has(distractionWord) && attempts < 50)

      newCards.push({
        id: cardId++,
        word: distractionWord,
        isOriginal: false,
        matched: false,
        isDistraction: true
      })
    }

    // Shuffle cards
    for (let i = newCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newCards[i], newCards[j]] = [newCards[j], newCards[i]]
    }

    setCards(newCards)
    setSelectedCard(null)
    setMatchedPairs(0)
    setWrongAttempts(0)
  }, [level, settings.pairs, settings.distractions])

  const handleCardClick = useCallback((card: WordCard) => {
    if (gameState !== 'playing') return
    if (card.matched) return

    if (!selectedCard) {
      setSelectedCard(card)
    } else {
      if (selectedCard.id === card.id) {
        setSelectedCard(null)
        return
      }

      // Check if match
      const isCorrectMatch =
        (card.correctMatchId === selectedCard.id) ||
        (selectedCard.correctMatchId === card.id)

      if (isCorrectMatch && !card.isDistraction && !selectedCard.isDistraction) {
        setCards(prev => prev.map(c =>
          c.id === card.id || c.id === selectedCard.id
            ? { ...c, matched: true }
            : c
        ))
        setMatchedPairs(prev => prev + 1)
        setSelectedCard(null)

        if (matchedPairs + 1 >= settings.pairs) {
          const levelScore = Math.round(getLevelScore())
          setScore(levelScore)
          setGameState('levelComplete')
        }
      } else {
        setWrongAttempts(prev => prev + 1)
        setSelectedCard(null)
      }
    }
  }, [gameState, selectedCard, matchedPairs, settings.pairs, getLevelScore])

  const startGame = useCallback(() => {
    setScore(0)
    setTotalScore(0)
    setLevel(1)
    generateLevel()
    setGameState('playing')
  }, [generateLevel])

  const nextLevel = useCallback(() => {
    const levelScore = Math.round(getLevelScore())
    setTotalScore(prev => prev + levelScore)

    if (level >= MAX_LEVELS) {
      addSession({
        id: Date.now().toString(),
        gameId: 'synonym-matcher',
        difficulty: 'hard',
        score: totalScore + levelScore,
        completedAt: new Date(),
        durationSeconds: 0
      })
      setGameState('victory')
    } else {
      setLevel(prev => prev + 1)
      generateLevel()
      setGameState('playing')
    }
  }, [level, totalScore, getLevelScore, addSession, generateLevel])

  // Timer
  useEffect(() => {
    if (gameState !== 'playing' || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          addSession({
            id: Date.now().toString(),
            gameId: 'synonym-matcher',
            difficulty: 'medium',
            score: totalScore,
            completedAt: new Date(),
            durationSeconds: settings.timeLimit - prev
          })
          setGameState('gameOver')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState, timeLeft, totalScore, addSession, settings.timeLimit])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Link
          href="/language"
          className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium mb-6 text-sm md:text-base lg:text-lg"
        >
          <span className="mr-2">←</span> {t('back', 'Back')}
        </Link>

        <h1 className="text-3xl md:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
          {t('synonymMatcher.title', 'Synonym Matcher')}
        </h1>
        <p className="text-lg text-gray-700 font-medium mb-8">
          {t('synonymMatcher.description', 'Match words with their synonyms!')}
        </p>

        {/* Menu */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">🔗</div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
              Level {level}
            </h2>
            <div className="bg-orange-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 mb-2">{t('synonymMatcher.levelInfo', 'Level Settings')}:</h3>
              <ul className="text-gray-700 space-y-1 font-medium">
                <li>• {t('synonymMatcher.pairsToMatch', 'Pairs to Match')}: {settings.pairs}</li>
                <li>• {t('synonymMatcher.distractions', 'Distractions')}: {settings.distractions}</li>
                <li>• {t('synonymMatcher.timeLimit', 'Time Limit')}: {settings.timeLimit}s</li>
              </ul>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-amber-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Playing */}
        {gameState === 'playing' && (
          <>
            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('synonymMatcher.level', 'Level')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">{level}/{MAX_LEVELS}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('synonymMatcher.score', 'Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-amber-600">{totalScore}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('synonymMatcher.timeLeft', 'Time')}</p>
                  <p className={`text-xl md:text-2xl lg:text-3xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-orange-600'}`}>{timeLeft}s</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('synonymMatcher.progress', 'Progress')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">{matchedPairs}/{settings.pairs}</p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((level - 1) / MAX_LEVELS) * 100}%` }}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-full"
                />
              </div>
            </div>

            {/* Cards Grid */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {cards.map((card) => (
                  <motion.button
                    key={card.id}
                    whileHover={{ scale: card.matched ? 1 : 1.05 }}
                    whileTap={{ scale: card.matched ? 1 : 0.95 }}
                    onClick={() => handleCardClick(card)}
                    disabled={card.matched}
                    className={`p-4 rounded-xl font-bold text-sm md:text-base lg:text-lg transition-all ${
                      card.matched
                        ? 'bg-green-500 text-white opacity-50 cursor-not-allowed'
                        : selectedCard?.id === card.id
                        ? 'bg-orange-500 text-white ring-4 ring-orange-300'
                        : card.isDistraction
                        ? 'bg-red-100 hover:bg-red-200 text-red-700'
                        : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                    }`}
                  >
                    {card.matched ? '✓' : card.word}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Wrong Attempts */}
            {wrongAttempts > 0 && (
              <div className="bg-red-50 rounded-xl p-4 text-center">
                <p className="text-red-600 font-bold">{t('synonymMatcher.wrongAttempts', 'Wrong attempts:')} {wrongAttempts} (-{wrongAttempts * 10} points)</p>
              </div>
            )}
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-orange-600 mb-4">{t('synonymMatcher.levelComplete', 'Level Complete!')}</h2>
            <div className="bg-orange-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('synonymMatcher.levelScore', 'Level Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">{Math.round(score)}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('synonymMatcher.totalScore', 'Total Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-amber-600">{totalScore + Math.round(score)}</p>
                </div>
              </div>
            </div>
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-amber-600 shadow-lg transition-all w-full"
            >
              {level < MAX_LEVELS ? `Next Level ${level + 1}` : 'View Final Score'}
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">{t('synonymMatcher.gameOver', 'Time\'s Up!')}</h2>
            <div className="bg-orange-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 text-sm font-medium">{t('synonymMatcher.finalScore', 'Final Score')}</p>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">{totalScore}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-red-600 shadow-lg transition-all w-full"
            >
              {t('tryAgain', 'Try Again')}
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-orange-600 mb-4">{t('synonymMatcher.victory', 'Congratulations!')}</h2>
            <p className="text-xl text-gray-700 font-medium mb-6">
              {t('synonymMatcher.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className="bg-orange-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 text-sm font-medium">{t('synonymMatcher.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-orange-600">{totalScore + Math.round(score)}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-amber-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
