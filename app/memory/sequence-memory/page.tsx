'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

const GRID_SIZE = { easy: 4, medium: 5, hard: 6 }
const SEQUENCE_START_LENGTH = 3

export default function SequenceMemoryPage() {
  const { t } = useTranslation()
  const { currentDifficulty, addSession } = useGameStore()

  const gridSize = GRID_SIZE[currentDifficulty as keyof typeof GRID_SIZE]
  const totalCells = gridSize * gridSize

  const [gameState, setGameState] = useState<'menu' | 'showing' | 'playing' | 'gameover'>('menu')
  const [sequence, setSequence] = useState<number[]>([])
  const [currentSequenceLength, setCurrentSequenceLength] = useState(SEQUENCE_START_LENGTH)
  const [userSequence, setUserSequence] = useState<number[]>([])
  const [showingIndex, setShowingIndex] = useState(-1)
  const [bestScore, setBestScore] = useState(0)

  const generateSequence = useCallback(() => {
    const newSequence: number[] = []
    for (let i = 0; i < currentSequenceLength; i++) {
      newSequence.push(Math.floor(Math.random() * totalCells))
    }
    return newSequence
  }, [currentSequenceLength, totalCells])

  const startGame = () => {
    const newSequence = generateSequence()
    setSequence(newSequence)
    setUserSequence([])
    setCurrentSequenceLength(SEQUENCE_START_LENGTH)
    setGameState('showing')
    showSequence(newSequence)
  }

  const showSequence = (seq: number[]) => {
    let index = 0
    setShowingIndex(-1)

    const interval = setInterval(() => {
      if (index < seq.length) {
        setShowingIndex(seq[index])
        setTimeout(() => setShowingIndex(-1), 500)
        index++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          setGameState('playing')
        }, 600)
      }
    }, 800)
  }

  const handleCellClick = (cellIndex: number) => {
    if (gameState !== 'playing') return

    const newUserSequence = [...userSequence, cellIndex]
    setUserSequence(newUserSequence)

    const currentIndex = newUserSequence.length - 1

    if (cellIndex !== sequence[currentIndex]) {
      // Wrong answer
      const finalScore = currentSequenceLength - 1
      if (finalScore > bestScore) {
        setBestScore(finalScore)
      }
      addSession({
        id: Date.now().toString(),
        gameId: 'sequence-memory',
        difficulty: currentDifficulty,
        score: finalScore,
        completedAt: new Date(),
        durationSeconds: 60
      })
      setGameState('gameover')
      return
    }

    // Check if sequence is complete
    if (newUserSequence.length === sequence.length) {
      const newLength = currentSequenceLength + 1
      setCurrentSequenceLength(newLength)
      setTimeout(() => {
        const newSequence = generateSequence()
        setSequence(newSequence)
        setUserSequence([])
        setGameState('showing')
        showSequence(newSequence)
      }, 500)
    }
  }

  const getGridPosition = (index: number) => {
    const col = index % gridSize
    const row = Math.floor(index / gridSize)
    return { col, row }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <Link
          href="/memory"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 text-lg"
        >
          <span className="mr-2">←</span> {t('back')}
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
          {t('sequenceMemory.title', 'Sequence Memory')}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {t('sequenceMemory.description', 'Watch the sequence, then repeat it!')}
        </p>

        {/* Score display */}
        {gameState !== 'menu' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex justify-around text-center">
              <div>
                <p className="text-gray-600 text-lg mb-1">{t('sequenceMemory.currentLevel', 'Current Level')}</p>
                <p className="text-4xl font-bold text-indigo-600">
                  {currentSequenceLength - 1}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-lg mb-1">{t('sequenceMemory.best', 'Best')}</p>
                <p className="text-4xl font-bold text-purple-600">
                  {bestScore}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Game state indicator */}
        {gameState !== 'menu' && gameState !== 'gameover' && (
          <div className="text-center mb-6">
            {gameState === 'showing' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-semibold text-indigo-600"
              >
                {t('sequenceMemory.watchSequence', 'Watch the sequence...')}
              </motion.p>
            )}
            {gameState === 'playing' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-semibold text-purple-600"
              >
                {t('sequenceMemory.yourTurn', 'Your turn!')}
              </motion.p>
            )}
          </div>
        )}

        {/* Grid */}
        {(gameState === 'showing' || gameState === 'playing' || gameState === 'gameover') && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div
              className="grid gap-3 mx-auto"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                maxWidth: `${gridSize * 80 + (gridSize - 1) * 12}px`,
              }}
            >
              {Array.from({ length: totalCells }, (_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: gameState === 'playing' ? 1.05 : 1 }}
                  whileTap={{ scale: gameState === 'playing' ? 0.95 : 1 }}
                  onClick={() => handleCellClick(index)}
                  disabled={gameState !== 'playing'}
                  className={`aspect-square rounded-xl transition-all shadow-md ${
                    showingIndex === index
                      ? 'bg-indigo-500 scale-110 shadow-lg ring-4 ring-indigo-300'
                      : gameState === 'playing'
                      ? 'bg-gray-200 hover:bg-gray-300'
                      : 'bg-gray-200'
                  }`}
                  animate={showingIndex === index ? {
                    scale: [1, 1.1, 1],
                    backgroundColor: ['#e5e7eb', '#6366f1', '#6366f1']
                  } : {}}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Menu or Game Over */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t('sequenceMemory.ready', 'Ready to challenge your memory?')}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {t('sequenceMemory.instructions', 'Watch the highlighted cells, then tap them in the same order!')}
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-indigo-600 hover:to-purple-600 shadow-lg transition-all"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {gameState === 'gameover' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t('sequenceMemory.gameOver', 'Game Over!')}
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              {t('sequenceMemory.finalScore', 'Your score:')}
            </p>
            <p className="text-6xl font-bold text-indigo-600 mb-4">
              {currentSequenceLength - 1}
            </p>
            {currentSequenceLength - 1 >= bestScore && (
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-xl font-bold text-purple-600 mb-6"
              >
                🎉 {t('sequenceMemory.newRecord', 'New Record!')} 🎉
              </motion.p>
            )}
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-indigo-600 hover:to-purple-600 shadow-lg transition-all"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
