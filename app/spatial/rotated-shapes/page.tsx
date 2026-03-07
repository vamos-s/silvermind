'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

type Shape = { id: number, type: string, path: string, rotation: number, color: string }

export default function RotatedShapesPage() {
  const { t } = useTranslation()
  const { currentDifficulty, addSession } = useGameStore()

  const [targetShape, setTargetShape] = useState<Shape | null>(null)
  const [options, setOptions] = useState<Shape[]>([])
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const getOptionCount = () => {
    switch (currentDifficulty) {
      case 'easy': return 4
      case 'medium': return 6
      case 'hard': return 8
    }
  }

  const getShapes = () => {
    return [
      { type: 'triangle', path: 'polygon(50% 0%, 0% 100%, 100% 100%)' },
      { type: 'square', path: 'none' },
      { type: 'circle', path: '50%' },
      { type: 'diamond', path: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' },
      { type: 'pentagon', path: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' },
      { type: 'hexagon', path: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' },
      { type: 'star', path: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' },
      { type: 'arrow', path: 'polygon(50% 0%, 100% 50%, 70% 50%, 70% 100%, 30% 100%, 30% 50%, 0% 50%)' }
    ]
  }

  const getColors = () => {
    return ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']
  }

  const generateQuestion = () => {
    const shapes = getShapes()
    const colors = getColors()
    const optionCount = getOptionCount()

    // Select target shape
    const target = shapes[Math.floor(Math.random() * shapes.length)]
    const targetColor = colors[Math.floor(Math.random() * colors.length)]
    const targetRotation = Math.floor(Math.random() * 8) * 45

    const newTarget: Shape = {
      id: 0,
      type: target.type,
      path: target.path,
      rotation: targetRotation,
      color: targetColor
    }
    setTargetShape(newTarget)

    // Generate options
    const newOptions: Shape[] = []

    // Add correct answer
    newOptions.push({
      id: 1,
      type: target.type,
      path: target.path,
      rotation: targetRotation,
      color: targetColor
    })

    // Add wrong answers
    const wrongShapes = shapes.filter(s => s.type !== target.type)
    const wrongColors = colors.filter(c => c !== targetColor)

    while (newOptions.length < optionCount) {
      const useSameShape = Math.random() < 0.5
      const useSameColor = Math.random() < 0.5

      if (useSameShape && useSameColor) {
        // Same shape, same color, different rotation
        const rotation = targetRotation + 45 + Math.floor(Math.random() * 3) * 45
        newOptions.push({
          id: newOptions.length + 1,
          type: target.type,
          path: target.path,
          rotation,
          color: targetColor
        })
      } else if (useSameShape) {
        // Same shape, different color
        const color = wrongColors[Math.floor(Math.random() * wrongColors.length)]
        newOptions.push({
          id: newOptions.length + 1,
          type: target.type,
          path: target.path,
          rotation: targetRotation,
          color
        })
      } else {
        // Different shape
        const shape = wrongShapes[Math.floor(Math.random() * wrongShapes.length)]
        const color = colors[Math.floor(Math.random() * colors.length)]
        const rotation = Math.floor(Math.random() * 8) * 45
        newOptions.push({
          id: newOptions.length + 1,
          type: shape.type,
          path: shape.path,
          rotation,
          color
        })
      }
    }

    setOptions(newOptions.sort(() => Math.random() - 0.5))
    setShowResult(false)
  }

  const handleAnswer = (shape: Shape) => {
    if (showResult || !targetShape) return

    const correct = shape.type === targetShape.type &&
                   shape.color === targetShape.color &&
                   shape.rotation === targetShape.rotation

    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      setScore(score + level * 10)
      setLevel(level + 1)
      setTimeout(() => {
        generateQuestion()
      }, 1500)
    } else {
      setGameOver(true)
      addSession({
        id: Date.now().toString(),
        gameId: 'rotated-shapes',
        difficulty: currentDifficulty,
        score: score,
        completedAt: new Date(),
        durationSeconds: 15 * level
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
          <p className="text-lg text-gray-500 mb-6">Level Reached: {level}</p>
          <button
            onClick={() => {
              setScore(0)
              setLevel(1)
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

  const renderShape = (shape: Shape, size: number = 60) => {
    const styles: React.CSSProperties = {
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: shape.color,
      transform: `rotate(${shape.rotation}deg)`,
      borderRadius: shape.type === 'circle' ? '50%' : '0'
    }

    if (shape.path !== 'none') {
      styles.clipPath = shape.path
    }

    return <div style={styles} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      <header className="p-6 bg-white shadow-sm">
        <Link href="/spatial" className="text-red-500 hover:underline mb-4 block">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">🔷 Rotated Shapes</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto text-center mb-8">
          <div className="flex justify-center gap-8 text-2xl mb-4">
            <p className="font-bold text-red-600">Score: {score}</p>
            <p className="font-bold text-pink-600">Level: {level}</p>
          </div>
          <p className="text-xl text-gray-600">Which shape matches?</p>
        </div>

        {targetShape && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-12 shadow-xl max-w-lg mx-auto mb-8 flex items-center justify-center min-h-[200px]"
          >
            {renderShape(targetShape, 120)}
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          {options.map((shape) => (
            <motion.button
              key={shape.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * shape.id }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(shape)}
              disabled={showResult}
              className={`bg-white rounded-xl shadow-lg p-8 flex items-center justify-center transition-all ${
                showResult
                  ? targetShape &&
                    shape.type === targetShape.type &&
                    shape.color === targetShape.color &&
                    shape.rotation === targetShape.rotation
                    ? 'bg-green-200 border-4 border-green-500'
                    : 'opacity-50'
                  : 'hover:shadow-xl'
              }`}
            >
              {renderShape(shape, 80)}
            </motion.button>
          ))}
        </div>

        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8"
          >
            <p className={`text-2xl font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
              {isCorrect ? '✅ Correct!' : '❌ Wrong!'}
            </p>
          </motion.div>
        )}
      </main>
    </div>
  )
}
