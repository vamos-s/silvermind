'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

const EMOJIS = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍒', '🌸', '🌺', '🌻', '🌷', '🌹']

export default function LocationMemoryPage() {
  const { t } = useTranslation()
  const { currentDifficulty, addSession } = useGameStore()

  const [grid, setGrid] = useState<{emoji: string, visible: boolean, found: boolean}[]>([])
  const [targetEmoji, setTargetEmoji] = useState<string>('')
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [isMemorizing, setIsMemorizing] = useState(true)

  const getGridSize = () => {
    switch (currentDifficulty) {
      case 'easy': return 9  // 3x3
      case 'medium': return 12 // 3x4 or 4x3
      case 'hard': return 16  // 4x4
    }
  }

  const getMemorizeTime = () => {
    switch (currentDifficulty) {
      case 'easy': return 4000 + level * 500
      case 'medium': return 3000 + level * 300
      case 'hard': return 2500 + level * 200
    }
  }

  const startLevel = () => {
    const size = getGridSize()
    const numItems = Math.min(Math.floor(size / 3) + Math.floor(level / 2), EMOJIS.length)
    const shuffled = [...EMOJIS].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, numItems)

    // Pick a target emoji from the selected ones
    const target = selected[Math.floor(Math.random() * selected.length)]
    setTargetEmoji(target)

    const positions = Array.from({ length: size }, (_, i) => ({
      index: i,
      emoji: selected[i] || '',
      visible: selected[i] !== '',
      found: false
    })).sort(() => Math.random() - 0.5)

    setGrid(positions.map(p => ({ ...p, visible: true })))
    setIsMemorizing(true)
    setGameOver(false)

    setTimeout(() => {
      setGrid(prev => prev.map(cell => ({ ...cell, visible: false })))
      setIsMemorizing(false)
    }, getMemorizeTime())
  }

  const handleCellClick = (index: number) => {
    if (isMemorizing || gameOver) return

    const cell = grid[index]
    if (cell.emoji === '' || cell.found || cell.visible) return

    // Reveal the cell
    setGrid(prev => prev.map((c, i) =>
      i === index ? { ...c, visible: true } : c
    ))

    // Check if this is the target emoji
    if (cell.emoji === targetEmoji) {
      setGrid(prev => prev.map((c, i) =>
        i === index ? { ...c, found: true } : c
      ))

      // Success! Next level
      setScore(score + level * 10)
      setLevel(level + 1)
      setTimeout(startLevel, 1500)
    } else {
      // Wrong click - game over
      setGameOver(true)
      addSession({
        id: Date.now().toString(),
        gameId: 'location-memory',
        difficulty: currentDifficulty,
        score: score,
        completedAt: new Date(),
        durationSeconds: 30 * level
      })
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

  const gridCols = getGridSize() === 9 ? 'grid-cols-3' : getGridSize() === 12 ? 'grid-cols-3 md:grid-cols-4' : 'grid-cols-4'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="p-6 bg-white shadow-sm">
        <Link href="/memory" className="text-blue-500 hover:underline mb-4 block">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">📍 Location Memory</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto text-center mb-8">
          <div className="flex justify-center gap-8 text-2xl mb-4">
            <p className="font-bold text-blue-600">Score: {score}</p>
            <p className="font-bold text-purple-600">Level: {level}</p>
          </div>
          {isMemorizing ? (
            <p className="text-xl text-gray-600">Remember where the items are!</p>
          ) : (
            <div className="text-xl text-gray-600">
              Find the <span className="text-4xl">{targetEmoji}</span>!
            </div>
          )}
        </div>

        <div className={`grid ${gridCols} gap-4 max-w-lg mx-auto`}>
          {grid.map((cell, index) => (
            <motion.button
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCellClick(index)}
              disabled={isMemorizing || gameOver}
              className={`aspect-square rounded-xl shadow-lg transition-all text-4xl flex items-center justify-center ${
                cell.visible
                  ? cell.found
                    ? 'bg-green-500 text-white'
                    : 'bg-white border-4 border-blue-500'
                  : 'bg-gray-200 hover:bg-gray-300'
              } ${isMemorizing || gameOver ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {cell.visible && cell.emoji}
            </motion.button>
          ))}
        </div>
      </main>
    </div>
  )
}
