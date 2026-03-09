'use client'

import { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

import { SettingsPanel } from "@/components/SettingsPanel"
interface Box {
  id: string
  color: string
  size: number
}

interface Puzzle {
  id: number
  boxes: Box[]
  clues: string[]
}

const COLORS = [
  { name: 'Red', bg: 'bg-red-400', border: 'border-red-600', text: 'text-red-800' },
  { name: 'Blue', bg: 'bg-blue-400', border: 'border-blue-600', text: 'text-blue-800' },
  { name: 'Green', bg: 'bg-green-400', border: 'border-green-600', text: 'text-green-800' },
  { name: 'Yellow', bg: 'bg-yellow-400', border: 'border-yellow-600', text: 'text-yellow-800' },
  { name: 'Purple', bg: 'bg-purple-400', border: 'border-purple-600', text: 'text-purple-800' },
  { name: 'Orange', bg: 'bg-orange-400', border: 'border-orange-600', text: 'text-orange-800' },
]

const LEVELS = [
  // Levels 1-5: Easy introduction (3 boxes)
  { boxCount: 3, clueCount: 2 },
  { boxCount: 3, clueCount: 2 },
  { boxCount: 3, clueCount: 2 },
  { boxCount: 3, clueCount: 3 },
  { boxCount: 3, clueCount: 3 },

  // Levels 6-10: Medium challenge (4 boxes)
  { boxCount: 4, clueCount: 3 },
  { boxCount: 4, clueCount: 3 },
  { boxCount: 4, clueCount: 4 },
  { boxCount: 4, clueCount: 4 },
  { boxCount: 4, clueCount: 4 },

  // Levels 11-15: Harder progression (5 boxes)
  { boxCount: 5, clueCount: 4 },
  { boxCount: 5, clueCount: 4 },
  { boxCount: 5, clueCount: 5 },
  { boxCount: 5, clueCount: 5 },
  { boxCount: 5, clueCount: 5 },

  // Levels 16-20: Advanced challenge (6 boxes, max complexity)
  { boxCount: 6, clueCount: 5 },
  { boxCount: 6, clueCount: 5 },
  { boxCount: 6, clueCount: 5 },
  { boxCount: 6, clueCount: 6 },
  { boxCount: 6, clueCount: 6 },

  // Levels 21-25: Expert level (6 boxes with tricky clues)
  { boxCount: 6, clueCount: 6 },
  { boxCount: 6, clueCount: 6 },
  { boxCount: 6, clueCount: 6 },
  { boxCount: 6, clueCount: 6 },
  { boxCount: 6, clueCount: 6 },

  // Levels 26-30: Master level (max complexity with 6 boxes)
  { boxCount: 6, clueCount: 6 },
  { boxCount: 6, clueCount: 6 },
  { boxCount: 6, clueCount: 6 },
  { boxCount: 6, clueCount: 6 },
  { boxCount: 6, clueCount: 6 },
]

const MAX_LEVELS = 30

export default function LogicPuzzlePage() {
  const { t } = useTranslation()
  const { addSession, darkMode } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu')
  const [level, setLevel] = useState(1)
  const [totalScore, setTotalScore] = useState(0)
  const [userBoxes, setUserBoxes] = useState<Box[]>([])
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const settings = useMemo(() => LEVELS[Math.min(level - 1, LEVELS.length - 1)], [level])

  const generatePuzzle = useCallback(() => {
    const shuffledColors = [...COLORS].sort(() => Math.random() - 0.5)
    const selectedColors = shuffledColors.slice(0, settings.boxCount)
    const sizes = Array.from({ length: settings.boxCount }, (_, i) => i + 1)
      .sort(() => Math.random() - 0.5)

    const boxes = selectedColors.map((color, i) => ({
      id: color.name.toLowerCase(),
      color: color.name,
      size: sizes[i],
    }))

    // Generate clues based on the actual solution
    const clues: string[] = []
    const sortedBoxes = [...boxes].sort((a, b) => a.size - b.size)

    // Add variety of clue types
    if (settings.clueCount >= 1) {
      clues.push(`The ${sortedBoxes[0].color.toLowerCase()} box is smallest.`)
    }
    if (settings.clueCount >= 2) {
      clues.push(`The ${sortedBoxes[sortedBoxes.length - 1].color.toLowerCase()} box is largest.`)
    }
    if (settings.clueCount >= 3) {
      const midIndex = Math.floor(sortedBoxes.length / 2)
      clues.push(`The ${sortedBoxes[midIndex].color.toLowerCase()} box is in the middle.`)
    }
    if (settings.clueCount >= 4) {
      const largerIndex = Math.floor(Math.random() * (sortedBoxes.length - 1))
      clues.push(`The ${sortedBoxes[largerIndex + 1].color.toLowerCase()} box is larger than the ${sortedBoxes[largerIndex].color.toLowerCase()} box.`)
    }

    return { id: level, boxes, clues }
  }, [settings.boxCount, settings.clueCount, level])

  const startLevel = useCallback(() => {
    const newPuzzle = generatePuzzle()
    setPuzzle(newPuzzle)
    setUserBoxes([...newPuzzle.boxes].sort(() => Math.random() - 0.5))
    setAttempts(0)
    setShowAnswer(false)
    setIsCorrect(false)
    setGameState('playing')
  }, [generatePuzzle])

  const startGame = useCallback(() => {
    setLevel(1)
    setTotalScore(0)
    startLevel()
  }, [startLevel])

  const nextLevel = useCallback(() => {
    if (level >= MAX_LEVELS) {
      addSession({
        id: Date.now().toString(),
        gameId: 'logic-puzzle',
        difficulty: 'hard',
        score: totalScore,
        completedAt: new Date(),
        durationSeconds: 0
      })
      setGameState('result')
    } else {
      setLevel(prev => prev + 1)
      setGameState('menu')
      setTimeout(() => startLevel(), 100)
    }
  }, [level, totalScore, addSession, startLevel])

  const handleDragStart = useCallback((e: any, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString())
  }, [])

  const handleDragOver = useCallback((e: any) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback((e: any, dropIndex: number) => {
    e.preventDefault()
    if (showAnswer) return

    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'))

    if (dragIndex === dropIndex) return

    const newBoxes = [...userBoxes]
    const [draggedBox] = newBoxes.splice(dragIndex, 1)
    newBoxes.splice(dropIndex, 0, draggedBox)

    setUserBoxes(newBoxes)
  }, [showAnswer, userBoxes])

  const checkAnswer = useCallback(() => {
    if (!puzzle) return

    const isCorrect = userBoxes.every(
      (box, index) => box.size === puzzle.boxes[index].size
    )

    setIsCorrect(isCorrect)
    setShowAnswer(true)
    setAttempts(attempts + 1)

    // Calculate score (100 base - 10 per attempt, minimum 10)
    const levelScore = Math.max(10, 100 - (attempts * 10))

    if (isCorrect) {
      setTotalScore(prev => prev + levelScore)
    }
  }, [puzzle, userBoxes, attempts])

  const resetPuzzle = useCallback(() => {
    if (!puzzle) return
    setUserBoxes([...puzzle.boxes].sort(() => Math.random() - 0.5))
    setAttempts(0)
    setShowAnswer(false)
    setIsCorrect(false)
  }, [puzzle])

  const getColorInfo = useCallback((colorName: string) => {
    return COLORS.find(c => c.name === colorName) || COLORS[0]
  }, [])

  return (
    <div className="min-h-screen p-3 md:p-4 lg:p-8 transition-colors duration-300 {darkMode ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" : "bg-gradient-to-br from-green-50 via-white to-blue-50 p-4 md:p-8"}">
      <SettingsPanel />
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link
          href="/logic"
          className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium mb-6 text-sm md:text-base lg:text-lg"
        >
          <span className="mr-2">←</span> {t('back', 'Back')}
        </Link>

        <h1 className="text-3xl md:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2">
          {t('logicPuzzle.title', 'Logic Puzzle')}
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-8">
          {t('logicPuzzle.description', 'Use clues to arrange boxes from smallest to largest!')}
        </p>

        {/* Menu */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Level {level}
            </h2>
            {level > 1 && (
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 font-medium">
                Total Score: <span className="text-green-600 font-bold">{totalScore}</span>
              </p>
            )}
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              {t('logicPuzzle.instructions', 'Read the clues, then drag boxes to arrange them from smallest to largest.')}
            </p>
            <div className="bg-green-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">{t('logicPuzzle.levelInfo', 'Level Settings')}:</h3>
              <ul className="text-gray-700 dark:text-gray-300 space-y-1 font-medium">
                <li>• {t('logicPuzzle.boxes', 'Boxes')}: {settings.boxCount}</li>
                <li>• {t('logicPuzzle.clues', 'Clues')}: {settings.clueCount}</li>
              </ul>
            </div>
            <button
              onClick={startLevel}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-green-600 hover:to-blue-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Playing */}
        {gameState === 'playing' && puzzle && (
          <>
            {/* Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 mb-6">
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('logicPuzzle.level', 'Level')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-green-600">{level}/{MAX_LEVELS}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('logicPuzzle.score', 'Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-600">{totalScore}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('logicPuzzle.attempts', 'Attempts')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-green-600">{attempts}</p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((level - 1) / MAX_LEVELS) * 100}%` }}
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-full"
                />
              </div>
            </div>

            {/* Clues */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-4">
                {t('logicPuzzle.clues', 'Clues')}
              </h2>
              <ul className="space-y-3">
                {puzzle.clues.map((clue, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-lg text-gray-700 dark:text-gray-300 pt-1">{clue}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Drag and drop area */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                  {t('logicPuzzle.boxes', 'Boxes')}
                </h2>
                <button
                  onClick={resetPuzzle}
                  disabled={showAnswer}
                  className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('logicPuzzle.reset', 'Reset')}
                </button>
              </div>

              <div className="space-y-3">
                {userBoxes.map((box, index) => {
                  const colorInfo = getColorInfo(box.color)
                  return (
                    <motion.div
                      key={box.id}
                      draggable={!showAnswer}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`${colorInfo.bg} ${colorInfo.border} border-4 rounded-xl p-6 flex items-center justify-between ${showAnswer ? 'cursor-not-allowed opacity-60' : 'cursor-move hover:scale-102'} transition-all`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`${colorInfo.bg} rounded-full w-12 h-12 flex items-center justify-center text-lg md:text-xl lg:text-2xl font-bold`}>
                          {box.color[0]}
                        </div>
                        <span className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                          {box.color} Box
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg text-gray-700 dark:text-gray-300 mr-4">
                          {showAnswer ? `Size: ${box.size}` : ''}
                        </span>
                        <div className="bg-gray-200 dark:bg-slate-700 rounded-lg px-3 py-1 text-gray-600 dark:text-gray-400">
                          #{index + 1}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {!showAnswer && (
                <button
                  onClick={checkAnswer}
                  className="w-full mt-6 bg-gradient-to-r from-green-500 to-blue-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 rounded-xl hover:from-green-600 hover:to-blue-600 shadow-lg transition-all"
                >
                  {t('logicPuzzle.checkAnswer', 'Check Answer')}
                </button>
              )}
            </div>

            {/* Result */}
            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'} border-4 rounded-2xl p-6 mb-6`}
              >
                <div className="text-center mb-4">
                  <div className={`text-6xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'} mb-2`}>
                    {isCorrect ? '✓' : '✗'}
                  </div>
                  <h3 className={`text-xl md:text-2xl lg:text-3xl font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect
                      ? t('logicPuzzle.correct', 'Correct!')
                      : t('logicPuzzle.incorrect', 'Not quite right!')}
                  </h3>
                  {isCorrect && (
                    <p className="text-xl text-gray-700 dark:text-gray-300 mt-2">
                      {t('logicPuzzle.levelScore', 'Level Score')}: <span className="font-bold text-green-600">{Math.max(10, 100 - ((attempts - 1) * 10))}</span>
                    </p>
                  )}
                </div>

                {!isCorrect && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 mb-4">
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                      {t('logicPuzzle.correctOrder', 'Correct Order:')}
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      {puzzle.boxes.map((box, index) => {
                        const colorInfo = getColorInfo(box.color)
                        return (
                          <div key={box.id} className={`${colorInfo.bg} ${colorInfo.border} border-2 rounded-lg px-3 py-2`}>
                            <span className="font-bold text-gray-800 dark:text-white">{box.color[0]}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">({box.size})</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {!isCorrect && (
                    <button
                      onClick={resetPuzzle}
                      className="flex-1 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xl font-bold py-3 rounded-lg hover:bg-gray-300 transition-all"
                    >
                      {t('logicPuzzle.tryAgain', 'Try Again')}
                    </button>
                  )}
                  {isCorrect && (
                    <button
                      onClick={nextLevel}
                      className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white text-xl font-bold py-3 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all"
                    >
                      {level < MAX_LEVELS ? `Next Level ${level + 1}` : 'View Final Score'}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Result (All levels complete) */}
        {gameState === 'result' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-600 mb-4">{t('logicPuzzle.victory', 'Congratulations!')}</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 font-medium mb-6">
              {t('logicPuzzle.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className="bg-green-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('logicPuzzle.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-green-600">{totalScore}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-green-600 hover:to-blue-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
