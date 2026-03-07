'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

type Target = { id: number, x: number, y: number, isTarget: boolean, emoji: string }

export default function TargetDetectionPage() {
  const { t } = useTranslation()
  const { currentDifficulty, addSession } = useGameStore()

  const [targets, setTargets] = useState<Target[]>([])
  const [targetEmoji, setTargetEmoji] = useState('')
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameOver, setGameOver] = useState(false)

  const getTargetCount = () => {
    switch (currentDifficulty) {
      case 'easy': return 9
      case 'medium': return 16
      case 'hard': return 25
    }
  }

  const getGridSize = () => {
    switch (currentDifficulty) {
      case 'easy': return 3
      case 'medium': return 4
      case 'hard': return 5
    }
  }

  const getEmojis = () => {
    const allEmojis = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍒', '🌸', '🌺', '🌻', '🌷', '🌹', '⭐', '🌙', '☀️', '🔴', '🔵', '🟢', '🟡', '🟣']
    return allEmojis
  }

  const generateRound = () => {
    const count = getTargetCount()
    const emojis = getEmojis()
    const gridSize = getGridSize()

    const target = emojis[Math.floor(Math.random() * emojis.length)]
    setTargetEmoji(target)

    const newTargets: Target[] = []
    const distractor = emojis[Math.floor(Math.random() * emojis.length)]

    for (let i = 0; i < count; i++) {
      const isTarget = Math.random() < 0.3 + (round * 0.05) // More targets as rounds progress
      const x = (i % gridSize)
      const y = Math.floor(i / gridSize)

      newTargets.push({
        id: i,
        x,
        y,
        isTarget,
        emoji: isTarget ? target : distractor
      })
    }

    setTargets(newTargets.sort(() => Math.random() - 0.5))
    setTimeLeft(Math.max(10, 30 - Math.floor(round / 2)))
  }

  const handleTargetClick = (target: Target) => {
    if (gameOver) return

    if (target.isTarget) {
      setScore(score + 10)
    } else {
      // Penalty for wrong click
      setScore(Math.max(0, score - 5))
    }

    // Check if all targets found
    const remainingTargets = targets.filter(t => t.isTarget && t.id !== target.id).length
    if (remainingTargets === 0) {
      setRound(round + 1)
      setTimeout(generateRound, 500)
    } else {
      // Remove clicked target
      setTargets(targets.filter(t => t.id !== target.id))
    }
  }

  useEffect(() => {
    generateRound()
  }, [])

  useEffect(() => {
    if (gameOver) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true)
          addSession({
            id: Date.now().toString(),
            gameId: 'target-detection',
            difficulty: currentDifficulty,
            score: score,
            completedAt: new Date(),
            durationSeconds: 30 * Math.floor(round / 2 + 1)
          })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameOver, score, round])

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Over!</h2>
          <p className="text-xl text-gray-600 mb-2">Final Score: {score}</p>
          <p className="text-lg text-gray-500 mb-6">Round: {round}</p>
          <button
            onClick={() => {
              setScore(0)
              setRound(1)
              generateRound()
              setGameOver(false)
            }}
            className="bg-yellow-500 text-white px-8 py-3 rounded-xl text-xl font-bold hover:bg-yellow-600 transition"
          >
            Play Again
          </button>
          <Link href="/reaction" className="block mt-4 text-yellow-500 hover:underline">
            ← Back to Games
          </Link>
        </motion.div>
      </div>
    )
  }

  const gridSize = getGridSize()

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <header className="p-6 bg-white shadow-sm">
        <Link href="/reaction" className="text-yellow-500 hover:underline mb-4 block">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">🎯 Target Detection</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto text-center mb-8">
          <div className="flex justify-center gap-8 text-2xl mb-4">
            <p className="font-bold text-yellow-600">Score: {score}</p>
            <p className="font-bold text-orange-600">Round: {round}</p>
          </div>
          <div className={`text-3xl font-bold mb-4 ${timeLeft <= 5 ? 'text-red-500' : 'text-gray-700'}`}>
            ⏱️ {timeLeft}s
          </div>
          <p className="text-xl text-gray-600 mb-2">
            Find all <span className="text-4xl">{targetEmoji}</span> targets!
          </p>
          <p className="text-lg text-gray-500">
            Remaining: {targets.filter(t => t.isTarget).length}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-xl max-w-lg mx-auto mb-6">
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
            {targets.map((target) => (
              <motion.button
                key={target.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: target.id * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTargetClick(target)}
                disabled={gameOver}
                className="aspect-square rounded-xl shadow-lg text-4xl flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {target.emoji}
              </motion.button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
