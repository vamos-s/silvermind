'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

export default function NumberRecallPage() {
  const { t } = useTranslation()
  const { currentDifficulty, addSession } = useGameStore()

  const [sequence, setSequence] = useState<number[]>([])
  const [playerInput, setPlayerInput] = useState<string>('')
  const [isShowingSequence, setIsShowingSequence] = useState(true)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameOver, setGameOver] = useState(false)

  const getSequenceLength = () => {
    switch (currentDifficulty) {
      case 'easy': return Math.min(3 + Math.floor(level / 2), 6)
      case 'medium': return Math.min(4 + Math.floor(level / 2), 8)
      case 'hard': return Math.min(5 + Math.floor(level / 2), 10)
    }
  }

  const getDisplayTime = () => {
    switch (currentDifficulty) {
      case 'easy': return 3000 + level * 500
      case 'medium': return 2500 + level * 300
      case 'hard': return 2000 + level * 200
    }
  }

  const startLevel = () => {
    const newSequence = Array.from({ length: getSequenceLength() }, () => 
      Math.floor(Math.random() * 10)
    )
    setSequence(newSequence)
    setPlayerInput('')
    setIsShowingSequence(true)
    setGameOver(false)

    setTimeout(() => {
      setIsShowingSequence(false)
    }, getDisplayTime())
  }

  const handleNumberClick = (num: number) => {
    const newInput = playerInput + num
    setPlayerInput(newInput)

    if (newInput.length === sequence.length) {
      const playerArray = newInput.split('').map(Number)
      if (JSON.stringify(playerArray) === JSON.stringify(sequence)) {
        setScore(score + level * 10)
        setLevel(level + 1)
        setTimeout(startLevel, 1000)
      } else {
        setGameOver(true)
        addSession({
          id: Date.now().toString(),
          gameId: 'number-recall',
          difficulty: currentDifficulty,
          score: score,
          completedAt: new Date(),
          durationSeconds: 30 * level
        })
      }
    }
  }

  const handleDelete = () => {
    setPlayerInput(playerInput.slice(0, -1))
  }

  useEffect(() => {
    startLevel()
  }, [])

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Over!</h2>
          <p className="text-xl text-gray-600 mb-2">Final Score: {score}</p>
          <p className="text-lg text-gray-500 mb-2">Level Reached: {level}</p>
          <p className="text-lg text-gray-500 mb-6">Sequence: {sequence.join('')}</p>
          <p className="text-lg text-gray-500 mb-6">Your answer: {playerInput}</p>
          <button
            onClick={() => {
              setScore(0)
              setLevel(1)
              startLevel()
            }}
            className="bg-blue-500 text-white px-8 py-3 rounded-xl text-xl font-bold hover:bg-blue-600 transition"
          >
            Play Again
          </button>
          <Link href="/memory" className="block mt-4 text-blue-500 hover:underline">
            ← Back to Games
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="p-6 bg-white shadow-sm">
        <Link href="/memory" className="text-blue-500 hover:underline mb-4 block">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">🔢 Number Recall</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto text-center mb-8">
          <div className="flex justify-center gap-8 text-2xl mb-4">
            <p className="font-bold text-blue-600">Score: {score}</p>
            <p className="font-bold text-purple-600">Level: {level}</p>
          </div>
        </div>

        {isShowingSequence ? (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl p-12 shadow-xl max-w-md mx-auto text-center"
          >
            <p className="text-xl text-gray-600 mb-6">Remember this sequence:</p>
            <p className="text-6xl font-bold text-blue-600 tracking-widest">
              {sequence.join('')}
            </p>
          </motion.div>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
              <p className="text-center text-xl text-gray-600 mb-4">Your answer:</p>
              <div className="bg-gray-100 rounded-lg p-4 text-center text-4xl font-bold tracking-widest h-16 flex items-center justify-center">
                {playerInput || '_'.repeat(sequence.length)}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <motion.button
                  key={num}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNumberClick(num)}
                  className="bg-blue-500 text-white text-4xl font-bold py-4 rounded-xl shadow-lg hover:bg-blue-600 transition"
                >
                  {num}
                </motion.button>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelete}
                className="bg-red-500 text-white text-2xl font-bold py-4 rounded-xl shadow-lg hover:bg-red-600 transition"
              >
                ⌫
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNumberClick(0)}
                className="bg-blue-500 text-white text-4xl font-bold py-4 rounded-xl shadow-lg hover:bg-blue-600 transition"
              >
                0
              </motion.button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
