'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

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

const PUZZLES: Record<string, Puzzle[]> = {
  easy: [
    {
      id: 1,
      boxes: [
        { id: 'red', color: 'Red', size: 1 },
        { id: 'blue', color: 'Blue', size: 2 },
        { id: 'green', color: 'Green', size: 3 },
      ],
      clues: [
        'The red box is the smallest.',
        'The blue box is larger than the red box.',
      ],
    },
    {
      id: 2,
      boxes: [
        { id: 'yellow', color: 'Yellow', size: 1 },
        { id: 'green', color: 'Green', size: 2 },
        { id: 'blue', color: 'Blue', size: 3 },
      ],
      clues: [
        'The green box is in the middle.',
        'The yellow box is smaller than the green box.',
      ],
    },
    {
      id: 3,
      boxes: [
        { id: 'purple', color: 'Purple', size: 1 },
        { id: 'orange', color: 'Orange', size: 2 },
        { id: 'red', color: 'Red', size: 3 },
      ],
      clues: [
        'The red box is the largest.',
        'The purple box is not the largest.',
      ],
    },
  ],
  medium: [
    {
      id: 4,
      boxes: [
        { id: 'red', color: 'Red', size: 1 },
        { id: 'blue', color: 'Blue', size: 2 },
        { id: 'green', color: 'Green', size: 3 },
        { id: 'yellow', color: 'Yellow', size: 4 },
      ],
      clues: [
        'The yellow box is the largest.',
        'The blue box is larger than the red box.',
        'The green box is between blue and yellow.',
      ],
    },
    {
      id: 5,
      boxes: [
        { id: 'purple', color: 'Purple', size: 1 },
        { id: 'orange', color: 'Orange', size: 2 },
        { id: 'green', color: 'Green', size: 3 },
        { id: 'blue', color: 'Blue', size: 4 },
      ],
      clues: [
        'The purple box is the smallest.',
        'The orange box is larger than purple but smaller than green.',
        'The blue box is the largest.',
      ],
    },
    {
      id: 6,
      boxes: [
        { id: 'yellow', color: 'Yellow', size: 1 },
        { id: 'red', color: 'Red', size: 2 },
        { id: 'blue', color: 'Blue', size: 3 },
        { id: 'green', color: 'Green', size: 4 },
      ],
      clues: [
        'The yellow box is not the largest.',
        'The green box is larger than the red box.',
        'The blue box is between red and green.',
      ],
    },
  ],
  hard: [
    {
      id: 7,
      boxes: [
        { id: 'red', color: 'Red', size: 1 },
        { id: 'blue', color: 'Blue', size: 2 },
        { id: 'green', color: 'Green', size: 3 },
        { id: 'yellow', color: 'Yellow', size: 4 },
        { id: 'purple', color: 'Purple', size: 5 },
      ],
      clues: [
        'The purple box is the largest.',
        'The yellow box is larger than the green box.',
        'The blue box is between red and green.',
        'The yellow box is not the second largest.',
      ],
    },
    {
      id: 8,
      boxes: [
        { id: 'orange', color: 'Orange', size: 1 },
        { id: 'green', color: 'Green', size: 2 },
        { id: 'blue', color: 'Blue', size: 3 },
        { id: 'red', color: 'Red', size: 4 },
        { id: 'yellow', color: 'Yellow', size: 5 },
      ],
      clues: [
        'The orange box is the smallest.',
        'The red box is larger than the blue box.',
        'The yellow box is the largest.',
        'The green box is between orange and blue.',
      ],
    },
    {
      id: 9,
      boxes: [
        { id: 'red', color: 'Red', size: 1 },
        { id: 'purple', color: 'Purple', size: 2 },
        { id: 'blue', color: 'Blue', size: 3 },
        { id: 'green', color: 'Green', size: 4 },
        { id: 'orange', color: 'Orange', size: 5 },
      ],
      clues: [
        'The red box is the smallest.',
        'The green box is larger than the blue box.',
        'The orange box is the largest.',
        'The purple box is between red and blue.',
      ],
    },
  ],
}

export default function LogicPuzzlePage() {
  const { t } = useTranslation()
  const { currentDifficulty, addSession } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu')
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0)
  const [userBoxes, setUserBoxes] = useState<Box[]>([])
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const puzzles = PUZZLES[currentDifficulty] || PUZZLES.easy

  const startGame = () => {
    const puzzle = puzzles[currentPuzzleIndex]
    // Shuffle the boxes for the user
    const shuffledBoxes = [...puzzle.boxes].sort(() => Math.random() - 0.5)
    setPuzzle(puzzle)
    setUserBoxes(shuffledBoxes)
    setAttempts(0)
    setShowAnswer(false)
    setIsCorrect(false)
    setGameState('playing')
  }

  const nextPuzzle = () => {
    const nextIndex = (currentPuzzleIndex + 1) % puzzles.length
    setCurrentPuzzleIndex(nextIndex)
    startGame()
  }

  const handleDragStart = (e: any, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString())
  }

  const handleDragOver = (e: any) => {
    e.preventDefault()
  }

  const handleDrop = (e: any, dropIndex: number) => {
    e.preventDefault()
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'))

    if (dragIndex === dropIndex) return

    const newBoxes = [...userBoxes]
    const [draggedBox] = newBoxes.splice(dragIndex, 1)
    newBoxes.splice(dropIndex, 0, draggedBox)

    setUserBoxes(newBoxes)
  }

  const checkAnswer = () => {
    if (!puzzle) return

    const isCorrect = userBoxes.every(
      (box, index) => box.size === puzzle.boxes[index].size
    )

    setIsCorrect(isCorrect)
    setShowAnswer(true)
    setAttempts(attempts + 1)

    // Calculate score (100 base - 10 per attempt, minimum 10)
    const score = Math.max(10, 100 - (attempts * 10))

    addSession({
      id: Date.now().toString(),
      gameId: 'logic-puzzle',
      difficulty: currentDifficulty,
      score: isCorrect ? score : 0,
      completedAt: new Date(),
      durationSeconds: 60
    })
  }

  const resetPuzzle = () => {
    if (!puzzle) return
    const shuffledBoxes = [...puzzle.boxes].sort(() => Math.random() - 0.5)
    setUserBoxes(shuffledBoxes)
    setAttempts(0)
    setShowAnswer(false)
    setIsCorrect(false)
  }

  const getColorInfo = (colorName: string) => {
    return COLORS.find(c => c.name === colorName) || COLORS[0]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <Link
          href="/logic"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 text-lg"
        >
          <span className="mr-2">←</span> {t('back')}
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
          {t('logicPuzzle.title', 'Logic Puzzle')}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {t('logicPuzzle.description', 'Use clues to arrange boxes from smallest to largest!')}
        </p>

        {/* Menu */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t('logicPuzzle.ready', 'Ready for a challenge?')}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {t('logicPuzzle.instructions', 'Read the clues, then drag the boxes to arrange them from smallest to largest.')}
            </p>
            <div className="bg-green-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 mb-2">
                {t('logicPuzzle.example', 'Example Clues:')}
              </h3>
              <ul className="space-y-1 text-gray-700">
                <li>1. {t('logicPuzzle.exampleClue1', 'The red box is the smallest.')}</li>
                <li>2. {t('logicPuzzle.exampleClue2', 'The blue box is larger than the red box.')}</li>
              </ul>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-green-600 hover:to-blue-600 shadow-lg transition-all"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Playing */}
        {gameState === 'playing' && puzzle && (
          <>
            {/* Clues */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {t('logicPuzzle.clues', 'Clues')}
              </h2>
              <ul className="space-y-3">
                {puzzle.clues.map((clue, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-lg text-gray-700 pt-1">{clue}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Drag and drop area */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {t('logicPuzzle.boxes', 'Boxes')}
                </h2>
                <div className="flex items-center gap-4">
                  <span className="text-lg text-gray-600">
                    {t('logicPuzzle.attempts', 'Attempts')}: {attempts}
                  </span>
                  <button
                    onClick={resetPuzzle}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    {t('logicPuzzle.reset', 'Reset')}
                  </button>
                </div>
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
                      className={`${colorInfo.bg} ${colorInfo.border} border-4 rounded-xl p-6 flex items-center justify-between cursor-move ${showAnswer ? 'cursor-not-allowed opacity-60' : 'hover:scale-102'} transition-all`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`${colorInfo.bg} rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold`}>
                          {box.color[0]}
                        </div>
                        <span className="text-2xl font-bold text-gray-800">
                          {box.color} Box
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg text-gray-700 mr-4">
                          {showAnswer ? `Size: ${box.size}` : ''}
                        </span>
                        <div className="bg-gray-200 rounded-lg px-3 py-1 text-gray-600">
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
                  className="w-full mt-6 bg-gradient-to-r from-green-500 to-blue-500 text-white text-2xl font-bold py-4 rounded-xl hover:from-green-600 hover:to-blue-600 shadow-lg transition-all"
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
                  <h3 className={`text-3xl font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect
                      ? t('logicPuzzle.correct', 'Correct!')
                      : t('logicPuzzle.incorrect', 'Not quite right!')}
                  </h3>
                  <p className="text-xl text-gray-700 mt-2">
                    {isCorrect
                      ? t('logicPuzzle.correctMessage', `You solved it in ${attempts} attempt${attempts > 1 ? 's' : ''}!`)
                      : t('logicPuzzle.incorrectMessage', 'Try again or see the correct answer below.')}
                  </p>
                </div>

                {!isCorrect && (
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      {t('logicPuzzle.correctOrder', 'Correct Order:')}
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      {puzzle.boxes.map((box, index) => {
                        const colorInfo = getColorInfo(box.color)
                        return (
                          <div key={box.id} className={`${colorInfo.bg} ${colorInfo.border} border-2 rounded-lg px-3 py-2`}>
                            <span className="font-bold text-gray-800">{box.color[0]}</span>
                            <span className="text-sm text-gray-600 ml-1">({box.size})</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={resetPuzzle}
                    className="flex-1 bg-gray-200 text-gray-700 text-xl font-bold py-3 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    {t('logicPuzzle.tryAgain', 'Try Again')}
                  </button>
                  <button
                    onClick={nextPuzzle}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white text-xl font-bold py-3 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all"
                  >
                    {t('logicPuzzle.nextPuzzle', 'Next Puzzle')}
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
