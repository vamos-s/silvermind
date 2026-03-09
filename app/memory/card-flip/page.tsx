'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

import { SettingsPanel } from "@/components/SettingsPanel"
interface Card {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

const EMOJIS = {
  easy: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍒', '🥝'],
  medium: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍒', '🥝', '🥭', '🍍', '🍉', '🍌'],
  hard: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍒', '🥝', '🥭', '🍍', '🍉', '🍌', '🥥', '🫐', '🍐', '🥑', '🍆', '🥔'],
  expert: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍒', '🥝', '🥭', '🍍', '🍉', '🍌', '🥥', '🫐', '🍐', '🥑', '🍆', '🥔', '🥕', '🌽', '🥦', '🍄'],
}

const LEVEL_SETTINGS = [
  // Levels 1-6: Easy (4×4 grid, 8 pairs)
  { rows: 4, cols: 4, timeLimit: 120, hintCount: 3 }, // Level 1
  { rows: 4, cols: 4, timeLimit: 115, hintCount: 3 }, // Level 2
  { rows: 4, cols: 4, timeLimit: 110, hintCount: 3 }, // Level 3
  { rows: 4, cols: 4, timeLimit: 105, hintCount: 3 }, // Level 4
  { rows: 4, cols: 4, timeLimit: 100, hintCount: 3 }, // Level 5
  { rows: 4, cols: 4, timeLimit: 95, hintCount: 3 },  // Level 6

  // Levels 7-12: Medium-Easy (5×4 grid, 10 pairs)
  { rows: 5, cols: 4, timeLimit: 180, hintCount: 2 }, // Level 7
  { rows: 5, cols: 4, timeLimit: 175, hintCount: 2 }, // Level 8
  { rows: 5, cols: 4, timeLimit: 170, hintCount: 2 }, // Level 9
  { rows: 5, cols: 4, timeLimit: 165, hintCount: 2 }, // Level 10
  { rows: 5, cols: 4, timeLimit: 160, hintCount: 2 }, // Level 11
  { rows: 5, cols: 4, timeLimit: 155, hintCount: 2 }, // Level 12

  // Levels 13-18: Medium (5×5 grid, 12 pairs)
  { rows: 5, cols: 5, timeLimit: 240, hintCount: 2 }, // Level 13
  { rows: 5, cols: 5, timeLimit: 235, hintCount: 2 }, // Level 14
  { rows: 5, cols: 5, timeLimit: 230, hintCount: 2 }, // Level 15
  { rows: 5, cols: 5, timeLimit: 225, hintCount: 2 }, // Level 16
  { rows: 5, cols: 5, timeLimit: 220, hintCount: 2 }, // Level 17
  { rows: 5, cols: 5, timeLimit: 215, hintCount: 2 }, // Level 18

  // Levels 19-24: Hard (6×5 grid, 15 pairs)
  { rows: 6, cols: 5, timeLimit: 300, hintCount: 1 }, // Level 19
  { rows: 6, cols: 5, timeLimit: 295, hintCount: 1 }, // Level 20
  { rows: 6, cols: 5, timeLimit: 290, hintCount: 1 }, // Level 21
  { rows: 6, cols: 5, timeLimit: 285, hintCount: 1 }, // Level 22
  { rows: 6, cols: 5, timeLimit: 280, hintCount: 1 }, // Level 23
  { rows: 6, cols: 5, timeLimit: 275, hintCount: 1 }, // Level 24

  // Levels 25-30: Expert (6×6 grid, 18 pairs)
  { rows: 6, cols: 6, timeLimit: 360, hintCount: 1 }, // Level 25
  { rows: 6, cols: 6, timeLimit: 350, hintCount: 1 }, // Level 26
  { rows: 6, cols: 6, timeLimit: 340, hintCount: 1 }, // Level 27
  { rows: 6, cols: 6, timeLimit: 330, hintCount: 1 }, // Level 28
  { rows: 6, cols: 6, timeLimit: 320, hintCount: 1 }, // Level 29
  { rows: 6, cols: 6, timeLimit: 300, hintCount: 1 }, // Level 30
]

const DIFFICULTY_MULTIPLIERS = {
  easy: 1,
  medium: 1.5,
  hard: 2,
}

export default function CardFlipPage() {
  const { t } = useTranslation()
  const { addSession } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'preview' | 'playing' | 'victory' | 'gameover' | 'levelComplete'>('menu')
  const [cards, setCards] = useState<Card[]>([])
  const [moves, setMoves] = useState(0)
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalPairs, setTotalPairs] = useState(0)
  const [previewCards, setPreviewCards] = useState<Card[]>([])
  const [currentLevel, setCurrentLevel] = useState(1)
  const [totalLevels, setTotalLevels] = useState(30)
  const [hintsRemaining, setHintsRemaining] = useState(3)
  const [isShowingHint, setIsShowingHint] = useState(false)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)

  const settings = LEVEL_SETTINGS[Math.min(currentLevel - 1, LEVEL_SETTINGS.length - 1)]
  const multiplier = DIFFICULTY_MULTIPLIERS[getDifficulty() as keyof typeof DIFFICULTY_MULTIPLIERS] || 1

  function getDifficulty() {
    if (currentLevel <= 6) return 'easy'
    if (currentLevel <= 12) return 'medium'
    if (currentLevel <= 18) return 'hard'
    return 'expert'
  }

  const createCards = useCallback(() => {
    const emojiList = EMOJIS[getDifficulty() as keyof typeof EMOJIS] || EMOJIS.easy
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
  }, [settings])

  const startGame = useCallback(() => {
    const newCards = createCards()
    setCards(newCards)
    setPreviewCards(newCards.map(card => ({ ...card, isFlipped: true })))
    setMoves(0)
    setMatchedPairs(0)
    setTimeLeft(settings.timeLimit)
    setTotalPairs(newCards.length / 2)
    setHintsRemaining(settings.hintCount)
    setIsShowingHint(false)
    setScore(0)

    setGameState('preview')

    // Hide cards after 3 seconds and start the game
    setTimeout(() => {
      setCards(newCards.map(card => ({ ...card, isFlipped: false })))
      setPreviewCards([])
      setGameState('playing')
    }, 3000)
  }, [createCards, settings])

  const startLevel = useCallback(() => {
    startGame()
  }, [startGame])

  const nextLevel = useCallback(() => {
    if (currentLevel < totalLevels) {
      setCurrentLevel(prev => prev + 1)
      setGameState('menu')
      // Small delay to allow UI to update
      setTimeout(() => {
        startGame()
      }, 100)
    } else {
      // All levels complete
      addSession({
        id: Date.now().toString(),
        gameId: 'card-flip',
        difficulty: 'hard',
        score: totalScore,
        completedAt: new Date(),
        durationSeconds: 0
      })
      setGameState('victory')
    }
  }, [currentLevel, totalLevels, startGame, totalScore, addSession])

  const useHint = useCallback(() => {
    if (hintsRemaining <= 0 || isShowingHint) return

    // Find all unmatched pairs
    const unmatchedCards = cards.filter(c => !c.isMatched)
    const emojiSet = new Set(unmatchedCards.map(c => c.emoji))

    // Pick a random emoji that hasn't been matched
    const emojisArray = Array.from(emojiSet)
    const randomEmoji = emojisArray[Math.floor(Math.random() * emojisArray.length)]

    // Find both cards with this emoji
    const hintCards = unmatchedCards.filter(c => c.emoji === randomEmoji)

    if (hintCards.length === 2) {
      setIsShowingHint(true)
      setHintsRemaining(prev => prev - 1)

      // Temporarily show the cards
      setCards(prev =>
        prev.map(c =>
          hintCards.some(h => h.id === c.id) ? { ...c, isFlipped: true } : c
        )
      )

      // Hide after 2 seconds
      setTimeout(() => {
        setCards(prev =>
          prev.map(c =>
            hintCards.some(h => h.id === c.id) ? { ...c, isFlipped: false } : c
          )
        )
        setIsShowingHint(false)
      }, 2000)
    }
  }, [cards, hintsRemaining, isShowingHint])

  const flipCard = useCallback((cardId: number) => {
    if (isShowingHint) return
    const card = cards.find(c => c.id === cardId)
    if (!card) return
    if (card.isMatched) return
    if (card.isFlipped) return

    // Prevent flipping if 2 cards are already flipped and waiting for match check
    const currentlyFlipped = cards.filter(c => c.isFlipped && !c.isMatched)
    if (currentlyFlipped.length >= 2) return

    // Flip the card
    setCards(prev =>
      prev.map(c =>
        c.id === cardId ? { ...c, isFlipped: true } : c
      )
    )

    // Get currently flipped cards (including the one we just flipped)
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
            // Calculate level score
            const levelScore = Math.round(
              ((100 - moves * 2) * multiplier) + (timeLeft / 5)
            )
            setScore(levelScore)

            // Check for level complete
            if (newCount === totalPairs) {
              setTotalScore(prev => prev + levelScore)
              if (currentLevel < totalLevels) {
                setGameState('levelComplete')
              } else {
                // All levels complete
                addSession({
                  id: Date.now().toString(),
                  gameId: 'card-flip',
                  difficulty: 'hard',
                  score: totalScore + levelScore,
                  completedAt: new Date(),
                  durationSeconds: 0
                })
                setGameState('victory')
              }
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
  }, [cards, moves, matchedPairs, totalPairs, timeLeft, currentLevel, totalLevels, totalScore, multiplier, addSession, isShowingHint])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (gameState === 'playing' && timeLeft === 0) {
      setGameState('gameover')
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [gameState, timeLeft])

  const getCardSize = () => {
    const totalCards = settings.rows * settings.cols
    if (totalCards <= 16) return 'h-20 md:h-24'
    if (totalCards <= 20) return 'h-16 md:h-20'
    return 'h-14 md:h-18'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4 md:p-8">
      <SettingsPanel />
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
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {currentLevel > 1 ? `Level ${currentLevel}` : t('cardFlip.ready', 'Ready to test your memory?')}
            </h2>
            {currentLevel > 1 && (
              <p className="text-lg text-gray-700 mb-4 font-medium">
                Total Score: <span className="text-purple-600 font-bold">{totalScore}</span>
              </p>
            )}
            <p className="text-lg text-gray-700 mb-6 font-medium">
              {t('cardFlip.instructions', 'Find all matching pairs of cards before time runs out!')}
            </p>
            <div className="bg-purple-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 mb-2">{t('cardFlip.levelInfo', 'Level Settings')}:</h3>
              <ul className="text-gray-700 space-y-1 font-medium">
                <li>• {t('cardFlip.gridSize', 'Grid')}: {settings.rows} × {settings.cols}</li>
                <li>• {t('cardFlip.pairs', 'Pairs')}: {(settings.rows * settings.cols) / 2}</li>
                <li>• {t('cardFlip.timeLimit', 'Time Limit')}: {Math.floor(settings.timeLimit / 60)}:{(settings.timeLimit % 60).toString().padStart(2, '0')}</li>
                <li>• {t('cardFlip.hints', 'Hints')}: {settings.hintCount}</li>
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
              <div className="grid grid-cols-5 gap-4 text-center">
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('cardFlip.level', 'Level')}</p>
                  <p className="text-2xl font-bold text-purple-600">{currentLevel}/{totalLevels}</p>
                </div>
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
                  <p className="text-gray-700 text-sm font-medium">{t('cardFlip.hints', 'Hints')}</p>
                  <p className="text-2xl font-bold text-purple-600">{hintsRemaining}</p>
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

            {/* Hint Button */}
            <div className="mb-4 text-center">
              <button
                onClick={useHint}
                disabled={hintsRemaining === 0 || isShowingHint}
                className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${
                  hintsRemaining > 0 && !isShowingHint
                    ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white hover:from-amber-500 hover:to-orange-500 shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isShowingHint ? '👀 Showing...' : `💡 Hint (${hintsRemaining})`}
              </button>
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

        {/* Level Complete */}
        {gameState === 'levelComplete' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-4xl font-bold text-purple-600 mb-4">
              Level {currentLevel} Complete!
            </h2>
            <p className="text-xl text-gray-700 font-medium mb-6">
              You found all {totalPairs} pairs in {moves} moves!
            </p>
            <div className="bg-purple-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('cardFlip.levelScore', 'Level Score')}</p>
                  <p className="text-3xl font-bold text-purple-600">{score}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('cardFlip.totalScore', 'Total Score')}</p>
                  <p className="text-3xl font-bold text-purple-600">{totalScore + score}</p>
                </div>
              </div>
            </div>
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-purple-600 hover:to-pink-600 shadow-lg transition-all w-full mb-3"
            >
              {currentLevel < totalLevels ? `Next Level ${currentLevel + 1}` : 'View Final Score'}
            </button>
            <button
              onClick={() => {
                setCurrentLevel(1)
                setTotalScore(0)
                setGameState('menu')
              }}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              {t('cardFlip.restart', 'Restart from Level 1')}
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
            <h2 className="text-4xl font-bold text-purple-600 mb-4">
              {t('cardFlip.victory', 'Congratulations!')}
            </h2>
            <p className="text-xl text-gray-700 font-medium mb-6">
              You completed all {totalLevels} levels!
            </p>
            <div className="bg-purple-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 text-sm font-medium">{t('cardFlip.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-purple-600">{totalScore}</p>
            </div>
            <button
              onClick={() => {
                setCurrentLevel(1)
                setTotalScore(0)
                setGameState('menu')
              }}
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
              You found {matchedPairs} out of {totalPairs} pairs!
            </p>
            <div className="bg-orange-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 text-sm font-medium">{t('cardFlip.currentScore', 'Current Score')}</p>
              <p className="text-3xl font-bold text-orange-600">{totalScore}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-red-600 shadow-lg transition-all w-full mb-3"
            >
              {t('tryAgain', 'Try Again')}
            </button>
            <button
              onClick={() => {
                setCurrentLevel(1)
                setTotalScore(0)
                setGameState('menu')
              }}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              {t('cardFlip.restart', 'Restart from Level 1')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
