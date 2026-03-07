'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

type Point = { id: number, x: number, y: number }

export default function DistanceJudgmentPage() {
  const { t } = useTranslation()
  const { currentDifficulty, addSession } = useGameStore()

  const [referencePoint, setReferencePoint] = useState<Point | null>(null)
  const [targetPoint, setTargetPoint] = useState<Point | null>(null)
  const [options, setOptions] = useState<Point[]>([])
  const [actualDistance, setActualDistance] = useState(0)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [accuracy, setAccuracy] = useState(0)

  const getGridSize = () => {
    switch (currentDifficulty) {
      case 'easy': return 300
      case 'medium': return 400
      case 'hard': return 500
    }
  }

  const getOptionCount = () => {
    switch (currentDifficulty) {
      case 'easy': return 3
      case 'medium': return 4
      case 'hard': return 5
    }
  }

  const calculateDistance = (p1: Point, p2: Point) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
  }

  const generateQuestion = () => {
    const gridSize = getGridSize()
    const optionCount = getOptionCount()
    const margin = 50

    // Reference point (red dot)
    const refX = margin + Math.random() * (gridSize - margin * 2)
    const refY = margin + Math.random() * (gridSize - margin * 2)
    const refPoint: Point = { id: 0, x: refX, y: refY }
    setReferencePoint(refPoint)

    // Target point (not shown - user must estimate)
    const minDist = currentDifficulty === 'easy' ? 100 : currentDifficulty === 'medium' ? 150 : 200
    const maxDist = currentDifficulty === 'easy' ? 200 : currentDifficulty === 'medium' ? 300 : 400
    const targetDist = minDist + Math.random() * (maxDist - minDist)
    const angle = Math.random() * Math.PI * 2

    const targetX = refX + targetDist * Math.cos(angle)
    const targetY = refY + targetDist * Math.sin(angle)
    const target: Point = { id: -1, x: targetX, y: targetY }
    setTargetPoint(target)
    setActualDistance(targetDist)

    // Generate options
    const newOptions: Point[] = []
    const usedDistances = new Set<number>()

    for (let i = 0; i < optionCount; i++) {
      let optDist: number
      let attempts = 0

      do {
        const variance = currentDifficulty === 'easy' ? 30 : currentDifficulty === 'medium' ? 20 : 15
        optDist = targetDist + (Math.random() - 0.5) * variance * 2
        attempts++
      } while (
        (usedDistances.has(Math.round(optDist)) || Math.abs(optDist - targetDist) < 10) &&
        attempts < 50
      )

      usedDistances.add(Math.round(optDist))

      const optAngle = Math.random() * Math.PI * 2
      const optX = refX + optDist * Math.cos(optAngle)
      const optY = refY + optDist * Math.sin(optAngle)

      newOptions.push({ id: i + 1, x: optX, y: optY })
    }

    // Sort by distance to reference (closest to correct answer should be near middle)
    newOptions.sort((a, b) => {
      const distA = calculateDistance(refPoint, a)
      const distB = calculateDistance(refPoint, b)
      return Math.abs(distA - targetDist) - Math.abs(distB - targetDist)
    })

    // Shuffle but keep correct answer accessible
    const shuffled = newOptions.sort(() => Math.random() - 0.5)
    setOptions(shuffled)
    setShowResult(false)
    setSelectedIndex(null)
  }

  const handleAnswer = (index: number) => {
    if (showResult || !targetPoint || !referencePoint) return

    const selected = options[index]
    const selectedDist = calculateDistance(referencePoint, selected)
    const error = Math.abs(selectedDist - actualDistance)
    const errorPercent = (error / actualDistance) * 100

    setSelectedIndex(index)
    setShowResult(true)

    // Calculate accuracy
    const accuracyScore = Math.max(0, 100 - errorPercent)
    setAccuracy(accuracyScore)

    // Calculate points
    const points = Math.round(accuracyScore / 10)
    setScore(score + points)

    // Next round
    if (round < 5) {
      setTimeout(() => {
        setRound(round + 1)
        generateQuestion()
      }, 2000)
    } else {
      setGameOver(true)
      addSession({
        id: Date.now().toString(),
        gameId: 'distance-judgment',
        difficulty: currentDifficulty,
        score: score,
        completedAt: new Date(),
        durationSeconds: 60
      })
    }
  }

  useEffect(() => {
    generateQuestion()
  }, [])

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Over!</h2>
          <p className="text-xl text-gray-600 mb-2">Final Score: {score}</p>
          <p className="text-lg text-gray-500 mb-6">Rounds: {round}/5</p>
          <button
            onClick={() => {
              setScore(0)
              setRound(1)
              generateQuestion()
              setGameOver(false)
            }}
            className="bg-red-500 text-white px-8 py-3 rounded-xl text-xl font-bold hover:bg-red-600 transition"
          >
            Play Again
          </button>
          <Link href="/spatial" className="block mt-4 text-red-500 hover:underline">
            ← Back to Games
          </Link>
        </motion.div>
      </div>
    )
  }

  const gridSize = getGridSize()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      <header className="p-6 bg-white shadow-sm">
        <Link href="/spatial" className="text-red-500 hover:underline mb-4 block">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">📏 Distance Judgment</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto text-center mb-8">
          <div className="flex justify-center gap-8 text-2xl mb-4">
            <p className="font-bold text-red-600">Score: {score}</p>
            <p className="font-bold text-pink-600">Round: {round}/5</p>
          </div>
          <p className="text-xl text-gray-600">
            Which point is at the closest distance from the red dot?
          </p>
        </div>

        {referencePoint && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-4 shadow-xl max-w-lg mx-auto mb-8"
          >
            <div
              className="relative bg-gray-100 rounded-lg"
              style={{ width: `${gridSize}px`, height: `${gridSize}px`, margin: '0 auto' }}
            >
              {/* Reference point */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute w-4 h-4 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg"
                style={{ left: `${referencePoint.x}px`, top: `${referencePoint.y}px` }}
              />

              {/* Option points */}
              {options.map((opt, i) => (
                <motion.button
                  key={opt.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleAnswer(i)}
                  disabled={showResult}
                  className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg transition-all ${
                    showResult && selectedIndex === i
                      ? accuracy >= 80
                        ? 'bg-green-500 ring-4 ring-green-300'
                        : accuracy >= 60
                        ? 'bg-yellow-500 ring-4 ring-yellow-300'
                        : 'bg-red-500 ring-4 ring-red-300'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  style={{ left: `${opt.x}px`, top: `${opt.y}px` }}
                />
              ))}

              {/* Target point (only shown after answer) */}
              {showResult && targetPoint && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute w-4 h-4 bg-purple-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg ring-2 ring-purple-300"
                  style={{ left: `${targetPoint.x}px`, top: `${targetPoint.y}px` }}
                />
              )}
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Reference distance is not shown
            </p>
          </motion.div>
        )}

        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg max-w-lg mx-auto text-center"
          >
            <p className={`text-2xl font-bold mb-4 ${
              accuracy >= 80 ? 'text-green-500' : accuracy >= 60 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              Accuracy: {accuracy.toFixed(1)}%
            </p>
            <p className="text-lg text-gray-600 mb-2">
              Your answer: {calculateDistance(referencePoint!, options[selectedIndex!]).toFixed(0)}px
            </p>
            <p className="text-lg text-gray-600">
              Actual distance: {actualDistance.toFixed(0)}px
            </p>
            <p className="text-sm text-purple-600 mt-4">
              💡 Purple dot shows the actual target position
            </p>
          </motion.div>
        )}
      </main>
    </div>
  )
}
