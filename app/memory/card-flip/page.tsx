'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

interface Card {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

const EMOJIS = {
  easy: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍒', '🥝'],
  medium: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍒', '🥝', '🥭', '🍍'],
  hard: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍒', '🥝', '🥭', '🍍', '🥝', '🍉', '🍌', '🥥', '🫐'],
}

const DIFFICULTY_SETTINGS = {
  easy: { rows: 4, cols: 4, timeLimit: 120 },
  medium: { rows: 5, cols: 4, timeLimit: 240 },
  hard: { rows: 6, cols: 5, timeLimit: 300 },
}

const DIFFICULTY_MULTIPLIERS = {
  easy: 1,
  medium: 1.5,
  hard: 2,
}

export default function CardFlipPage() {
  const { t } = useTranslation()
  const { currentDifficulty, addSession } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'preview' | 'playing' | 'victory' | 'gameover'>('menu')
  const [cards, setCards] = useState<Card[]>([])
  const [moves, setMoves] = useState(0)
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalPairs, setTotalPairs] = useState(0)
  const [previewCards, setPreviewCards] = useState<Card[]>([])

  const settings = DIFFICULTY_SETTINGS[currentDifficulty as keyof typeof DIFFICULTY_SETTINGS] || DIFFICULTY_SETTINGS.easy
  const multiplier = DIFFICULTY_MULTIPLIERS[currentDifficulty as keyof typeof DIFFICULTY_MULTIPLIERS] || 1

  const createCards = useCallback(() => {
    const emojiList = EMOJIS[currentDifficulty as keyof typeof EMOJIS] || EMOJIS.easy
    const pairCount = (settings.rows * settings.cols) / 2
    const emojis = emojiList.slice(0, pairCount)

    // Create pairs (each emoji appears twice)
    const cardEmojis = [...emojis, ...emojis]

    // Create card objects
    const allCards = cardEmojis.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }))

    // Shuffle
    for (let i = allCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[allCards[i], allCards[j]] = [allCards[j], allCards[i]]
    }

    return allCards
  }, [currentDifficulty, settings])

  const startGame = useCallback(() => {
    const newCards = createCards()
    setCards(newCards)
    setPreviewCards(newCards.map(card => ({ ...card, isFlipped: true })))
    setMoves(0)
    setMatchedPairs(0)
    setTimeLeft(settings.timeLimit)
    setTotalPairs(newCards.length / 2)

    setGameState('preview')

    // Hide cards after 3 seconds and start the game
    setTimeout(() => {
      setCards(newCards.map(card => ({ ...card, isFlipped: false })))
      setPreviewCards([])
      setGameState('playing')
    }, 3000)
  }, [createCards, settings])

  const flipCard = useCallback((cardId: number) => {
    const card = cards.find(c => c.id === cardId)
    if (!card) return
    if (card.isMatched) return
    if (card.isFlipped) return

    // Flip the card
    setCards(prev =>
      prev.map(c =>
        c.id === cardId ? { ...c, isFlipped: true } : c
      )
    )

    // Get currently flipped cards
    const currentlyFlipped = cards.filter(c => c.isFlipped && !c.isMatched)
    const flippedIds = [...currentlyFlipped.map(c => c.id), cardId]

    if (flippedIds.length === 2) {
      setMoves(prev => prev + 1)

      const [firstId, secondId] = flippedIds
      const firstCard = cards.find(c => c.id === firstId)!
      const secondCard = cards.find(c => c.id === secondId)!

      if (firstCard.emoji === secondCard.emoji) {
        // Match found!
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true }
                : c
            )
          )
          setMatchedPairs(prev => {
            const newCount = prev + 1
            // Check for victory
            if (newCount === totalPairs) {
              const score = Math.round(
                ((1000 - (moves + 1) * 10) * multiplier) + (timeLeft * multiplier)
              )
              addSession({
                id: Date.now().toString(),
                gameId: 'card-flip',
                difficulty: currentDifficulty,
                score: Math.max(score, 0),
                completedAt: new Date(),
                durationSeconds: settings.timeLimit - timeLeft
              })
              setGameState('victory')
            }
            return newCount
          })
        }, 500)
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c
            )
          )
        }, 1000)
      }
    }
  }, [cards, moves, matchedPairs, totalPairs, timeLeft, currentDifficulty, multiplier, settings, addSession])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (gameState === 'playing' && timeLeft === 0) {
      const score = Math.round(
        ((matchedPairs / totalPairs) * 500) * multiplier
      )
      addSession({
        id: Date.now().toString(),
        gameId: 'card-flip',
        difficulty: currentDifficulty,
        score,
        completedAt: new Date(),
        durationSeconds: settings.timeLimit
      })
      setGameState('gameover')
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [gameState, timeLeft, matchedPairs, totalPairs, currentDifficulty, multiplier, settings, addSession])

  const getCardSize = () => {
    const totalCards = settings.rows * settings.cols
    if (totalCards <= 16) return 'h-20 md:h-24'
    if (totalCards <= 20) return 'h-16 md:h-20'
    return 'h-14 md:h-18'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <Link
            href="/memory"
            className="inline-flex items-center text-gray-700 hover:text-gray-900 text-lg font-medium"
          >
            <span className="mr-2">←</span> {t('back', 'Back')}
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4">
            {t('cardFlip.title', 'Card Flip')}
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            {t('cardFlip.description', 'Match the pairs of cards!')}
          </p>
        </header>

        {/* Menu */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t('cardFlip.ready', 'Ready to test your memory?')}
            </h2>
            <p className="text-lg text-gray-700 mb-6 font-medium">
              {t('cardFlip.instructions', 'Find all matching pairs of cards before time runs out!')}
            </p>
            <div className="bg-purple-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 mb-2">{t('cardFlip.difficultyInfo', 'Difficulty Settings')}:</h3>
              <ul className="text-gray-700 space-y-1 font-medium">
                <li>• {t('cardFlip.gridSize', 'Grid')}: {settings.rows} × {settings.cols}</li>
                <li>• {t('cardFlip.pairs', 'Pairs')}: {(settings.rows * settings.cols) / 2}</li>
                <li>• {t('cardFlip.timeLimit', 'Time Limit')}: {Math.floor(settings.timeLimit / 60)}:{(settings.timeLimit % 60).toString().padStart(2, '0')}</li>
              </ul>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-purple-600 hover:to-pink-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Preview */}
        {gameState === 'preview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <h2 className="text-3xl font-bold text-purple-600 mb-4">
              {t('cardFlip.memorize', 'Memorize!')}
            </h2>
            <p className="text-lg text-gray-700 mb-6 font-medium">
              {t('cardFlip.memorizeText', 'Remember the card positions!')}
            </p>
            {/* Show all cards during preview */}
            <div
              className="grid gap-3 mb-6"
              style={{
                gridTemplateColumns: `repeat(${settings.cols}, 1fr)`,
              }}
            >
              {previewCards.map((card) => (
                <motion.div
                  key={card.id}
                  className={getCardSize()}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: card.id * 0.05 }}
                >
                  <div className="w-full h-full bg-white rounded-xl shadow-lg flex items-center justify-center border-4 border-purple-300">
                    <span className="text-4xl md:text-5xl">{card.emoji}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Playing */}
        {gameState === 'playing' && (
          <>
            {/* Stats Bar */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('cardFlip.moves', 'Moves')}</p>
                  <p className="text-2xl font-bold text-purple-600">{moves}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('cardFlip.time', 'Time')}</p>
                  <p className={`text-2xl font-bold ${timeLeft <= 30 ? 'text-red-500' : 'text-purple-600'}`}>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('cardFlip.pairs', 'Pairs')}</p>
                  <p className="text-2xl font-bold text-purple-600">{matchedPairs}/{totalPairs}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('cardFlip.level', 'Level')}</p>
                  <p className="text-2xl font-bold capitalize text-purple-600">{currentDifficulty}</p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(matchedPairs / totalPairs) * 100}%` }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full"
                />
              </div>
            </div>

            {/* Card Grid */}
            <div
              className="grid gap-3 mb-6"
              style={{
                gridTemplateColumns: `repeat(${settings.cols}, 1fr)`,
              }}
            >
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  className={getCardSize()}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: card.id * 0.05 }}
                  style={{ perspective: '1000px' }}
                >
                  <motion.button
                    onClick={() => flipCard(card.id)}
                    disabled={card.isFlipped || card.isMatched}
                    initial={false}
                    animate={{
                      rotateY: card.isFlipped || card.isMatched ? 180 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`w-full h-full relative cursor-pointer ${
                      card.isMatched ? 'cursor-default' : 'hover:scale-105'
                    }`}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Front of card (hidden) */}
                    <div
                      className="absolute inset-0 backface-hidden bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl shadow-lg flex items-center justify-center"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <span className="text-3xl text-white opacity-50">?</span>
                    </div>

                    {/* Back of card (shown when flipped) */}
                    <div
                      className="absolute inset-0 backface-hidden bg-white rounded-xl shadow-lg flex items-center justify-center border-4 border-purple-200"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
                        className={`text-4xl md:text-5xl ${card.isMatched ? 'opacity-50' : ''}`}
                      >
                        {card.emoji}
                      </motion.span>
                    </div>

                    {/* Match glow effect */}
                    <AnimatePresence>
                      {card.isMatched && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: [0.6, 0.3, 0], scale: [0.8, 1.2, 1] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0 bg-green-400 rounded-xl pointer-events-none"
                        />
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Victory */}
        {gameState === 'victory' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-purple-600 mb-4">
              {t('cardFlip.victory', 'Congratulations!')}
            </h2>
            <p className="text-xl text-gray-700 font-medium mb-6">
              {t('cardFlip.victoryMessage', `You found all ${totalPairs} pairs in ${moves} moves!`)}
            </p>
            <div className="bg-purple-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('cardFlip.moves', 'Moves')}</p>
                  <p className="text-3xl font-bold text-purple-600">{moves}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('cardFlip.time', 'Time')}</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {Math.floor((settings.timeLimit - timeLeft) / 60)}:{((settings.timeLimit - timeLeft) % 60).toString().padStart(2, '0')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('cardFlip.level', 'Level')}</p>
                  <p className="text-3xl font-bold capitalize text-purple-600">{currentDifficulty}</p>
                </div>
              </div>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-purple-600 hover:to-pink-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}

        {/* Game Over */}
        {gameState === 'gameover' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {t('cardFlip.gameOver', 'Time\'s Up!')}
            </h2>
            <p className="text-xl text-gray-700 font-medium mb-6">
              {t('cardFlip.progressMessage', `You found ${matchedPairs} out of ${totalPairs} pairs!`)}
            </p>
            <div className="bg-orange-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('cardFlip.moves', 'Moves')}</p>
                  <p className="text-3xl font-bold text-orange-600">{moves}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('cardFlip.pairsFound', 'Pairs')}</p>
                  <p className="text-3xl font-bold text-orange-600">{matchedPairs}/{totalPairs}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('cardFlip.level', 'Level')}</p>
                  <p className="text-3xl font-bold capitalize text-orange-600">{currentDifficulty}</p>
                </div>
              </div>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-red-600 shadow-lg transition-all w-full"
            >
              {t('tryAgain', 'Try Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
