'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

import { SettingsPanel } from "@/components/SettingsPanel"
const MAX_LEVELS = 30

const LEVEL_SETTINGS = [
  { gridSize: 3, differences: 2, timeLimit: 60 },  // Level 1
  { gridSize: 3, differences: 2, timeLimit: 55 },  // Level 2
  { gridSize: 3, differences: 3, timeLimit: 60 },  // Level 3
  { gridSize: 4, differences: 2, timeLimit: 55 },  // Level 4
  { gridSize: 4, differences: 3, timeLimit: 60 },  // Level 5
  { gridSize: 4, differences: 3, timeLimit: 50 },  // Level 6
  { gridSize: 5, differences: 3, timeLimit: 55 },  // Level 7
  { gridSize: 5, differences: 4, timeLimit: 60 },  // Level 8
  { gridSize: 5, differences: 4, timeLimit: 50 },  // Level 9
  { gridSize: 6, differences: 4, timeLimit: 55 },  // Level 10
  { gridSize: 6, differences: 5, timeLimit: 60 },  // Level 11
  { gridSize: 6, differences: 5, timeLimit: 50 },  // Level 12
  { gridSize: 6, differences: 5, timeLimit: 45 },  // Level 13
  { gridSize: 7, differences: 5, timeLimit: 55 },  // Level 14
  { gridSize: 7, differences: 6, timeLimit: 60 },  // Level 15
  { gridSize: 7, differences: 6, timeLimit: 50 },  // Level 16
  { gridSize: 7, differences: 6, timeLimit: 45 },  // Level 17
  { gridSize: 8, differences: 6, timeLimit: 50 },  // Level 18
  { gridSize: 8, differences: 7, timeLimit: 55 },  // Level 19
  { gridSize: 8, differences: 7, timeLimit: 45 },  // Level 20
  { gridSize: 8, differences: 7, timeLimit: 40 },  // Level 21
  { gridSize: 9, differences: 7, timeLimit: 50 },  // Level 22
  { gridSize: 9, differences: 8, timeLimit: 55 },  // Level 23
  { gridSize: 9, differences: 8, timeLimit: 45 },  // Level 24
  { gridSize: 10, differences: 8, timeLimit: 50 }, // Level 25
  { gridSize: 10, differences: 9, timeLimit: 55 }, // Level 26
  { gridSize: 10, differences: 9, timeLimit: 45 }, // Level 27
  { gridSize: 10, differences: 10, timeLimit: 50 }, // Level 28
  { gridSize: 10, differences: 10, timeLimit: 40 }, // Level 29
  { gridSize: 10, differences: 10, timeLimit: 35 }, // Level 30
]

const SHAPES = ['⭐', '🔷', '🔶', '💎', '🌟', '🔴', '🟢', '🔵', '🟣', '⬜']

export default function FindDifferencePage() {
  const { t } = useTranslation()
  const { addSession, darkMode } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [differences, setDifferences] = useState<Set<number>>(new Set())
  const [foundDifferences, setFoundDifferences] = useState<Set<number>>(new Set())
  const [hintUsed, setHintUsed] = useState(false)
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [wrongSelection, setWrongSelection] = useState<number | null>(null)
  const [gameOverReason, setGameOverReason] = useState<'time' | 'lives'>('time')
  const [hintedCell, setHintedCell] = useState<number | null>(null)
  const [hintsUsedCount, setHintsUsedCount] = useState(0)
  const MAX_HINTS_PER_GAME = 3
  const HINT_TIME_PENALTY = 10
  const MAX_WRONG_ATTEMPTS = 3

  const settings = useMemo(
    () => LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)],
    [level]
  )
  const gridSize = settings.gridSize
  const totalCells = gridSize * gridSize

  const getLevelScore = useCallback(() => {
    const baseScore = level * 50
    const timeBonus = timeLeft * 3
    return Math.max(0, baseScore + timeBonus)
  }, [level, timeLeft])

  const generateDifferences = useCallback(() => {
    const diffCount = settings.differences
    const newDifferences = new Set<number>()
    while (newDifferences.size < diffCount) {
      newDifferences.add(Math.floor(Math.random() * totalCells))
    }
    return newDifferences
  }, [settings.differences, totalCells])

  const generateLevel = useCallback(() => {
    const timeLimit = LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)].timeLimit
    setTimeLeft(timeLimit)
    setDifferences(generateDifferences())
    setFoundDifferences(new Set())
    setHintUsed(false)
    setHintedCell(null)
    setWrongAttempts(0)
    setWrongSelection(null)
  }, [level, generateDifferences])

  const handleCellClick = useCallback((cellIndex: number, isRightSide: boolean) => {
    if (gameState !== 'playing') return

    // Only check right side
    if (!isRightSide) return

    if (differences.has(cellIndex) && !foundDifferences.has(cellIndex)) {
      const newFound = new Set(foundDifferences)
      newFound.add(cellIndex)
      setFoundDifferences(newFound)
      setWrongSelection(null)

      if (newFound.size >= differences.size) {
        const levelScore = Math.round(getLevelScore())
        setScore(levelScore)
        setGameState('levelComplete')
      }
    } else if (!differences.has(cellIndex) && !foundDifferences.has(cellIndex)) {
      // Wrong selection
      setWrongSelection(cellIndex)
      setWrongAttempts(prev => {
        const newAttempts = prev + 1
        if (newAttempts >= MAX_WRONG_ATTEMPTS) {
          // Game over after 3 wrong attempts
          setGameOverReason('lives')
          setTimeout(() => {
            setGameState('gameOver')
          }, 500)
        }
        // Clear the wrong selection after 500ms
        setTimeout(() => {
          setWrongSelection(null)
        }, 500)
        return newAttempts
      })
    }
  }, [gameState, differences, foundDifferences, getLevelScore])

  const useHint = useCallback(() => {
    if (gameState !== 'playing' || hintsUsedCount >= MAX_HINTS_PER_GAME) return

    // Find first unfound difference
    for (const diff of differences) {
      if (!foundDifferences.has(diff)) {
        // Highlight only this cell
        setHintedCell(diff)
        setHintUsed(true)
        setHintsUsedCount(prev => prev + 1)

        // Apply time penalty
        setTimeLeft(prev => Math.max(0, prev - HINT_TIME_PENALTY))

        // Clear hint after showing
        setTimeout(() => {
          setHintedCell(null)
          setHintUsed(false)
        }, 1000)
        break
      }
    }
  }, [gameState, hintsUsedCount, differences, foundDifferences])

  const startGame = useCallback(() => {
    setScore(0)
    setTotalScore(0)
    setLevel(1)
    setHintsUsedCount(0)
    generateLevel()
    setGameState('playing')
  }, [generateLevel])

  const nextLevel = useCallback(() => {
    const levelScore = Math.round(getLevelScore())
    setTotalScore(prev => prev + levelScore)

    if (level >= MAX_LEVELS) {
      addSession({
        id: Date.now().toString(),
        gameId: 'find-difference',
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
          setGameOverReason('time')
          addSession({
            id: Date.now().toString(),
            gameId: 'find-difference',
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

  const getCellShape = useCallback((index: number, isRightSide: boolean) => {
    const baseShape = SHAPES[index % SHAPES.length]

    // If this is a different cell on the right side, use a different shape
    if (isRightSide && differences.has(index)) {
      // Use a shape that's 2-3 positions ahead to make it subtly different
      return SHAPES[(index + 3) % SHAPES.length]
    }

    return baseShape
  }, [differences])

  return (
    <div className={`min-h-screen p-3 md:p-4 lg:p-8 transition-colors duration-300 ${darkMode ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" : "bg-gradient-to-br from-violet-50 via-white to-purple-50 p-4 md:p-8"}`}">
      <SettingsPanel />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Link
          href="/attention"
          className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium mb-6 text-sm md:text-base lg:text-lg"
        >
          <span className="mr-2">←</span> {t('back', 'Back')}
        </Link>

        <h1 className="text-3xl md:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2">
          {t('findDifference.title', 'Find Difference')}
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-8">
          {t('findDifference.description', 'Find the differences between the two images!')}
        </p>

        {/* Menu */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Level {level}
            </h2>
            <div className="bg-violet-50 dark:bg-slate-800 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">{t('findDifference.levelInfo', 'Level Settings')}:</h3>
              <ul className="text-gray-700 dark:text-gray-300 space-y-1 font-medium">
                <li>• {t('findDifference.gridSize', 'Grid')}: {gridSize} × {gridSize}</li>
                <li>• {t('findDifference.differences', 'Differences')}: {settings.differences}</li>
                <li>• {t('findDifference.timeLimit', 'Time Limit')}: {settings.timeLimit}s</li>
                <li>• {t('findDifference.hintLimit', 'Hint Limit')}: {MAX_HINTS_PER_GAME} per game (-{HINT_TIME_PENALTY}s each)</li>
              </ul>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-violet-600 hover:to-purple-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Playing */}
        {gameState === 'playing' && (
          <>
            {/* Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('findDifference.level', 'Level')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-violet-600">{level}/{MAX_LEVELS}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('findDifference.score', 'Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-600">{totalScore}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('findDifference.timeLeft', 'Time')}</p>
                  <p className={`text-xl md:text-2xl lg:text-3xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-violet-600'}`}>{timeLeft}s</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('findDifference.progress', 'Progress')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-violet-600">{foundDifferences.size}/{differences.size}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('findDifference.lives', 'Lives')}</p>
                  <p className={`text-xl md:text-2xl lg:text-3xl font-bold ${wrongAttempts >= MAX_WRONG_ATTEMPTS - 1 ? 'text-red-500' : 'text-violet-600'}`}>
                    {MAX_WRONG_ATTEMPTS - wrongAttempts}/{MAX_WRONG_ATTEMPTS}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('findDifference.hints', 'Hints')}</p>
                  <p className={`text-xl md:text-2xl lg:text-3xl font-bold ${hintsUsedCount >= MAX_HINTS_PER_GAME - 1 ? 'text-red-500' : 'text-violet-600'}`}>
                    {MAX_HINTS_PER_GAME - hintsUsedCount}/{MAX_HINTS_PER_GAME}
                  </p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((level - 1) / MAX_LEVELS) * 100}%` }}
                  className="bg-gradient-to-r from-violet-500 to-purple-500 h-full"
                />
              </div>
            </div>

            {/* Game Grids */}
            <div className="grid md:grid-cols-2 gap-3 md:gap-4 lg:gap-6 mb-6">
              {/* Left Grid */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4">
                <p className="text-center font-bold text-gray-700 dark:text-gray-300 mb-4">{t('findDifference.original', 'Original')}</p>
                <div
                  className="grid gap-2 aspect-square"
                  style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
                >
                  {Array.from({ length: totalCells }).map((_, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-xl md:text-2xl"
                    >
                      {getCellShape(index, false)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Grid */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4">
                <p className="text-center font-bold text-gray-700 dark:text-gray-300 mb-4">{t('findDifference.different', 'Find Differences')}</p>
                <div
                  className="grid gap-2 aspect-square"
                  style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
                >
                  {Array.from({ length: totalCells }).map((_, index) => {
                    const isDifferent = differences.has(index)
                    const isFound = foundDifferences.has(index)
                    const isWrong = wrongSelection === index
                    const isHinted = hintedCell === index

                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCellClick(index, true)}
                        className={`aspect-square rounded-lg flex items-center justify-center text-xl md:text-2xl transition-all ${
                          isFound
                            ? 'bg-green-500 text-white'
                            : isWrong
                            ? 'bg-red-500 text-white animate-pulse'
                            : isHinted
                            ? 'bg-yellow-400 animate-pulse ring-4 ring-yellow-300'
                            : 'bg-gray-100 dark:bg-slate-700'
                        }`}
                      >
                        {isFound ? '✓' : isWrong ? '✗' : getCellShape(index, true)}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Hint Button */}
            <button
              onClick={useHint}
              disabled={hintsUsedCount >= MAX_HINTS_PER_GAME}
              className={`w-full text-xl font-bold py-4 rounded-xl shadow-lg transition-all ${
                hintsUsedCount >= MAX_HINTS_PER_GAME
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:from-yellow-500 hover:to-orange-500'
              }`}
            >
              {hintsUsedCount >= MAX_HINTS_PER_GAME
                ? `No Hints Left (${MAX_HINTS_PER_GAME}/${MAX_HINTS_PER_GAME})`
                : `Use Hint (-${HINT_TIME_PENALTY}s) • ${hintsUsedCount}/${MAX_HINTS_PER_GAME}`}
            </button>
          </>
        )}

        {/* Level Complete */}
        {gameState === 'levelComplete' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-violet-600 mb-4">Level {level} Complete!</h2>
            <div className="bg-violet-50 dark:bg-slate-800 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('findDifference.levelScore', 'Level Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-violet-600">{Math.round(score)}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('findDifference.totalScore', 'Total Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-600">{totalScore + Math.round(score)}</p>
                </div>
              </div>
            </div>
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-violet-600 hover:to-purple-600 shadow-lg transition-all w-full"
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
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">{gameOverReason === 'lives' ? '💔' : '❌'}</div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              {gameOverReason === 'lives'
                ? t('findDifference.noLives', 'No Lives Left!')
                : t('findDifference.gameOver', 'Time\'s Up!')}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-4">
              {gameOverReason === 'lives'
                ? t('findDifference.usedAllLives', 'You used all {count} lives.', { count: MAX_WRONG_ATTEMPTS })
                : t('findDifference.timeRanOut', 'Time ran out!')}
            </p>
            <div className="bg-orange-50 dark:bg-slate-800 rounded-xl p-6 mb-6">
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('findDifference.finalScore', 'Final Score')}</p>
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
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-violet-600 mb-4">{t('findDifference.victory', 'Congratulations!')}</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 font-medium mb-6">
              {t('findDifference.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className="bg-violet-50 dark:bg-slate-800 rounded-xl p-6 mb-6">
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('findDifference.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-violet-600">{totalScore + Math.round(score)}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-violet-600 hover:to-purple-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
