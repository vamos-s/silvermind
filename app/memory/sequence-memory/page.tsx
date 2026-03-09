'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

import { SettingsPanel } from "@/components/SettingsPanel"
const MAX_LEVELS = 30

const LEVEL_SETTINGS = [
  { gridSize: 3, sequenceStart: 3 },  // Level 1: 3×3, start with 3
  { gridSize: 3, sequenceStart: 4 },  // Level 2: 3×3, start with 4
  { gridSize: 3, sequenceStart: 5 },  // Level 3: 3×3, start with 5
  { gridSize: 3, sequenceStart: 6 },  // Level 4: 3×3, start with 6
  { gridSize: 3, sequenceStart: 7 },  // Level 5: 3×3, start with 7
  { gridSize: 4, sequenceStart: 8 },  // Level 6: 4×4, start with 8
  { gridSize: 4, sequenceStart: 9 },  // Level 7: 4×4, start with 9
  { gridSize: 4, sequenceStart: 10 },  // Level 8: 4×4, start with 10
  { gridSize: 4, sequenceStart: 11 },  // Level 9: 4×4, start with 11
  { gridSize: 4, sequenceStart: 12 },  // Level 10: 4×4, start with 12
  { gridSize: 5, sequenceStart: 13 },  // Level 11: 5×5, start with 13
  { gridSize: 5, sequenceStart: 14 },  // Level 12: 5×5, start with 14
  { gridSize: 5, sequenceStart: 15 },  // Level 13: 5×5, start with 15
  { gridSize: 5, sequenceStart: 16 },  // Level 14: 5×5, start with 16
  { gridSize: 5, sequenceStart: 17 },  // Level 15: 5×5, start with 17
  { gridSize: 6, sequenceStart: 18 },  // Level 16: 6×6, start with 18
  { gridSize: 6, sequenceStart: 19 },  // Level 17: 6×6, start with 19
  { gridSize: 6, sequenceStart: 20 },  // Level 18: 6×6, start with 20
  { gridSize: 6, sequenceStart: 21 },  // Level 19: 6×6, start with 21
  { gridSize: 6, sequenceStart: 22 },  // Level 20: 6×6, start with 22
  { gridSize: 7, sequenceStart: 23 },  // Level 21: 7×7, start with 23
  { gridSize: 7, sequenceStart: 24 },  // Level 22: 7×7, start with 24
  { gridSize: 7, sequenceStart: 25 },  // Level 23: 7×7, start with 25
  { gridSize: 7, sequenceStart: 26 },  // Level 24: 7×7, start with 26
  { gridSize: 7, sequenceStart: 27 },  // Level 25: 7×7, start with 27
  { gridSize: 8, sequenceStart: 28 },  // Level 26: 8×8, start with 28
  { gridSize: 8, sequenceStart: 29 },  // Level 27: 8×8, start with 29
  { gridSize: 8, sequenceStart: 30 },  // Level 28: 8×8, start with 30
  { gridSize: 8, sequenceStart: 31 },  // Level 29: 8×8, start with 31
  { gridSize: 8, sequenceStart: 32 },  // Level 30: 8×8, start with 32
]

export default function SequenceMemoryPage() {
  const { t } = useTranslation()
  const { addSession } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'showing' | 'playing' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [sequence, setSequence] = useState<number[]>([])
  const [userSequence, setUserSequence] = useState<number[]>([])
  const [showingIndex, setShowingIndex] = useState(-1)
  const [clickedIndex, setClickedIndex] = useState(-1)
  const [isWrong, setIsWrong] = useState(false)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)

  const settings = useMemo(
    () => LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)],
    [level]
  )
  const gridSize = settings.gridSize
  const totalCells = gridSize * gridSize

  const getSequenceLength = useCallback(() => settings.sequenceStart, [settings.sequenceStart])

  const getLevelScore = useCallback(() => {
    const baseScore = level * 50
    const timeBonus = 0
    return baseScore + timeBonus
  }, [level])

  const generateSequence = useCallback(() => {
    const newSequence: number[] = []
    const sequenceLength = getSequenceLength()
    for (let i = 0; i < sequenceLength; i++) {
      newSequence.push(Math.floor(Math.random() * totalCells))
    }
    return newSequence
  }, [totalCells, getSequenceLength])

  const showSequence = useCallback((seq: number[]) => {
    let index = 0
    setShowingIndex(-1)

    const interval = setInterval(() => {
      if (index < seq.length) {
        setShowingIndex(seq[index])
        setTimeout(() => setShowingIndex(-1), 600 - level * 30)
        index++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          setGameState('playing')
        }, 800)
      }
    }, 800)
  }, [level])

  const startLevel = useCallback(() => {
    const newSequence = generateSequence()
    setSequence(newSequence)
    setUserSequence([])
    setGameState('showing')
    showSequence(newSequence)
  }, [generateSequence, showSequence])

  const startGame = useCallback(() => {
    setScore(0)
    setTotalScore(0)
    setLevel(1)
    startLevel()
  }, [startLevel])

  const handleCellClick = useCallback((cellIndex: number) => {
    if (gameState !== 'playing') return

    // Show immediate visual feedback
    setClickedIndex(cellIndex)

    const newUserSequence = [...userSequence, cellIndex]
    const currentIndex = newUserSequence.length - 1

    // Check if wrong
    if (cellIndex !== sequence[currentIndex]) {
      setIsWrong(true)
      // Play wrong animation
      setTimeout(() => {
        addSession({
          id: Date.now().toString(),
          gameId: 'sequence-memory',
          difficulty: 'medium',
          score: totalScore,
          completedAt: new Date(),
          durationSeconds: 60
        })
        setGameState('gameOver')
        setClickedIndex(-1)
        setIsWrong(false)
      }, 500)
      return
    }

    // Correct click
    setUserSequence(newUserSequence)

    // Clear clicked feedback after delay
    setTimeout(() => setClickedIndex(-1), 200)

    // Check if level complete
    if (newUserSequence.length === sequence.length) {
      const levelScore = getLevelScore()
      setScore(levelScore)
      setGameState('levelComplete')
    }
  }, [gameState, userSequence, sequence, totalScore, addSession, getLevelScore])

  const nextLevel = useCallback(() => {
    const levelScore = Math.round(getLevelScore())
    setTotalScore(prev => prev + levelScore)

    if (level >= MAX_LEVELS) {
      addSession({
        id: Date.now().toString(),
        gameId: 'sequence-memory',
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
  }, [level, totalScore, getLevelScore, addSession, startLevel])

  const getCellSize = useCallback(() => {
    if (gridSize <= 3) return 'h-24 md:h-28'
    if (gridSize <= 4) return 'h-20 md:h-24'
    return 'h-16 md:h-20'
  }, [gridSize])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
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
          {t('sequenceMemory.title', 'Sequence Memory')}
        </h1>
        <p className="text-lg text-gray-700 font-medium mb-8">
          {t('sequenceMemory.description', 'Watch the sequence, then repeat it!')}
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
                Total Score: <span className="text-indigo-600 font-bold">{totalScore}</span>
              </p>
            )}
            <div className="bg-indigo-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 mb-2">{t('sequenceMemory.levelInfo', 'Level Settings')}:</h3>
              <ul className="text-gray-700 space-y-1 font-medium">
                <li>• {t('sequenceMemory.gridSize', 'Grid')}: {gridSize} × {gridSize}</li>
                <li>• {t('sequenceMemory.sequenceLength', 'Sequence Length')}: {getSequenceLength()}</li>
              </ul>
            </div>
            <button
              onClick={startLevel}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-indigo-600 hover:to-purple-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Showing/Playing */}
        {(gameState === 'showing' || gameState === 'playing') && (
          <>
            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('sequenceMemory.level', 'Level')}</p>
                  <p className="text-3xl font-bold text-indigo-600">{level}/{MAX_LEVELS}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('sequenceMemory.score', 'Score')}</p>
                  <p className="text-3xl font-bold text-purple-600">{totalScore}</p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((level - 1) / MAX_LEVELS) * 100}%` }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full"
                />
              </div>
            </div>

            {/* Game state indicator */}
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

            {/* Grid */}
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
                    className={`${getCellSize()} rounded-xl transition-all shadow-md ${
                      showingIndex === index
                        ? 'bg-indigo-500 scale-110 shadow-lg ring-4 ring-indigo-300'
                        : clickedIndex === index && isWrong
                        ? 'bg-red-500 scale-110 shadow-lg ring-4 ring-red-300'
                        : clickedIndex === index
                        ? 'bg-green-500 scale-110 shadow-lg ring-4 ring-green-300'
                        : gameState === 'playing'
                        ? 'bg-gray-200 hover:bg-gray-300'
                        : 'bg-gray-200'
                    }`}
                    animate={showingIndex === index ? {
                      scale: [1, 1.1, 1],
                      backgroundColor: ['#e5e7eb', '#6366f1', '#6366f1']
                    } : clickedIndex === index ? {
                      scale: [1, 1.15, 1.1],
                    } : {}}
                    transition={{ duration: 0.15 }}
                  />
                ))}
              </div>
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
            <h2 className="text-4xl font-bold text-indigo-600 mb-4">Level {level} Complete!</h2>
            <div className="bg-indigo-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('sequenceMemory.levelScore', 'Level Score')}</p>
                  <p className="text-3xl font-bold text-indigo-600">{Math.round(score)}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('sequenceMemory.totalScore', 'Total Score')}</p>
                  <p className="text-3xl font-bold text-purple-600">{totalScore + Math.round(score)}</p>
                </div>
              </div>
            </div>
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-indigo-600 hover:to-purple-600 shadow-lg transition-all w-full mb-3"
            >
              {level < MAX_LEVELS ? `Next Level ${level + 1}` : 'View Final Score'}
            </button>
            <button
              onClick={startGame}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              {t('sequenceMemory.restart', 'Restart from Level 1')}
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
            <h2 className="text-4xl font-bold text-gray-800 mb-4">{t('sequenceMemory.gameOver', 'Game Over!')}</h2>
            <div className="bg-orange-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 text-sm font-medium">{t('sequenceMemory.finalScore', 'Final Score')}</p>
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
              {t('sequenceMemory.restart', 'Restart from Level 1')}
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
            <h2 className="text-4xl font-bold text-indigo-600 mb-4">{t('sequenceMemory.victory', 'Congratulations!')}</h2>
            <p className="text-xl text-gray-700 font-medium mb-6">
              {t('sequenceMemory.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className="bg-indigo-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 text-sm font-medium">{t('sequenceMemory.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-indigo-600">{totalScore + Math.round(score)}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-indigo-600 hover:to-purple-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
