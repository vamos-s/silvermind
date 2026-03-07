'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

const COLORS = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500']

export default function PatternMatchingPage() {
  const { t } = useTranslation()
  const { currentDifficulty, addSession } = useGameStore()

  const [sequence, setSequence] = useState<number[]>([])
  const [playerSequence, setPlayerSequence] = useState<number[]>([])
  const [isShowingPattern, setIsShowingPattern] = useState(true)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [flashIndex, setFlashIndex] = useState<number | null>(null)

  const getSequenceLength = () => {
    switch (currentDifficulty) {
      case 'easy': return Math.min(3 + level, 8)
      case 'medium': return Math.min(4 + level, 10)
      case 'hard': return Math.min(5 + level, 12)
    }
  }

  const getFlashDuration = () => {
    switch (currentDifficulty) {
      case 'easy': return 600
      case 'medium': return 400
      case 'hard': return 300
    }
  }

  const getFlashInterval = () => {
    switch (currentDifficulty) {
      case 'easy': return 800
      case 'medium': return 600
      case 'hard': return 400
    }
  }

  const startLevel = () => {
    const newSequence = Array.from({ length: getSequenceLength() }, () =>
      Math.floor(Math.random() * COLORS.length)
    )
    setSequence(newSequence)
    setPlayerSequence([])
    setIsShowingPattern(true)
    setGameOver(false)
    setFlashIndex(null)

    let index = 0
    const interval = setInterval(() => {
      if (index >= newSequence.length) {
        clearInterval(interval)
        setIsShowingPattern(false)
        return
      }
      setFlashIndex(newSequence[index])
      setTimeout(() => setFlashIndex(null), getFlashDuration())
      index++
    }, getFlashInterval())
  }

  const handleColorClick = (colorIndex: number) => {
    if (isShowingPattern || gameOver) return

    const newPlayerSequence = [...playerSequence, colorIndex]
    setPlayerSequence(newPlayerSequence)

    const currentStep = newPlayerSequence.length - 1
    if (newPlayerSequence[currentStep] !== sequence[currentStep]) {
      setGameOver(true)
      addSession({
        id: Date.now().toString(),
        gameId: 'pattern-matching',
        difficulty: currentDifficulty,
        score: score + (level - 1) * 10,
        completedAt: new Date(),
        durationSeconds: 60 * level
      })
      return
    }

    if (newPlayerSequence.length === sequence.length) {
      setScore(score + level * 10)
      setLevel(level + 1)
      setTimeout(startLevel, 1000)
    }
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
          <p className="text-lg text-gray-500 mb-6">Level Reached: {level}</p>
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
        <h1 className="text-3xl font-bold text-gray-800">🎨 Pattern Matching</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto text-center mb-8">
          <p className="text-xl text-gray-600 mb-4">
            {isShowingPattern ? 'Watch the pattern...' : 'Repeat the pattern!'}
          </p>
          <div className="flex justify-center gap-8 text-2xl">
            <p className="font-bold text-blue-600">Score: {score}</p>
            <p className="font-bold text-purple-600">Level: {level}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          {COLORS.map((color, index) => (
            <motion.button
              key={color}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={flashIndex === index ? {
                scale: 1.15,
                boxShadow: '0 0 30px rgba(0,0,0,0.5)',
                filter: 'brightness(1.3)'
              } : {}}
              transition={{ duration: 0.15 }}
              onClick={() => handleColorClick(index)}
              disabled={isShowingPattern || gameOver}
              className={`${color} aspect-square rounded-2xl shadow-lg transition-all ${
                isShowingPattern || gameOver ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
              }`}
            />
          ))}
        </div>

        <p className="text-center mt-8 text-gray-500">
          Progress: {playerSequence.length} / {sequence.length}
        </p>
      </main>
    </div>
  )
}
