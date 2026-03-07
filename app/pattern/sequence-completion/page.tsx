'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

type PatternType = 'numbers' | 'colors' | 'shapes'

export default function SequenceCompletionPage() {
  const { t } = useTranslation()
  const { currentDifficulty, addSession } = useGameStore()

  const [pattern, setPattern] = useState<string[]>([])
  const [options, setOptions] = useState<string[]>([])
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const getSequenceLength = () => {
    switch (currentDifficulty) {
      case 'easy': return 4
      case 'medium': return 5
      case 'hard': return 6
    }
  }

  const generateNumberPattern = (length: number): { pattern: string[], next: string } => {
    const patterns = [
      // Simple arithmetic progression (easy to spot)
      () => {
        const start = Math.floor(Math.random() * 5) + 1
        const step = Math.floor(Math.random() * 2) + 1
        const seq = Array.from({ length: length - 1 }, (_, i) => (start + i * step).toString())
        return { pattern: seq, next: (start + (length - 1) * step).toString() }
      },
      // Counting by 2, 5, or 10
      () => {
        const multiples = [2, 5, 10]
        const step = multiples[Math.floor(Math.random() * multiples.length)]
        const start = step
        const seq = Array.from({ length: length - 1 }, (_, i) => (start + i * step).toString())
        return { pattern: seq, next: (start + (length - 1) * step).toString() }
      },
      // Squares: 1, 4, 9, 16...
      () => {
        const start = Math.floor(Math.random() * 3) + 1
        const seq = Array.from({ length: length - 1 }, (_, i) => Math.pow(i + start, 2).toString())
        return { pattern: seq, next: Math.pow(length - 1 + start, 2).toString() }
      },
      // Doubles: 2, 4, 8, 16...
      () => {
        const start = Math.floor(Math.random() * 2) + 1
        const seq = Array.from({ length: length - 1 }, (_, i) => Math.pow(2, i + start).toString())
        return { pattern: seq, next: Math.pow(2, length - 1 + start).toString() }
      },
      // Triangular numbers: 1, 3, 6, 10...
      () => {
        const seq = Array.from({ length: length - 1 }, (_, i) => ((i + 1) * (i + 2) / 2).toString())
        return { pattern: seq, next: (length * (length + 1) / 2).toString() }
      },
    ]
    const patternFunc = patterns[Math.floor(Math.random() * patterns.length)]
    return patternFunc()
  }

  const generateColorPattern = (length: number): { pattern: string[], next: string } => {
    const colors = ['🔴', '🔵', '🟢', '🟡', '🟣']
    const patterns = [
      // Alternating
      () => {
        const idx1 = Math.floor(Math.random() * colors.length)
        const idx2 = Math.floor(Math.random() * colors.length)
        const seq = Array.from({ length: length - 1 }, (_, i) => colors[(idx1 + idx2 * i) % colors.length])
        return { pattern: seq, next: colors[(idx1 + idx2 * (length - 1)) % colors.length] }
      },
      // Repeating sequence
      () => {
        const seqLength = Math.floor(Math.random() * 2) + 2
        const base = colors.slice(0, seqLength)
        const seq = Array.from({ length: length - 1 }, (_, i) => base[i % seqLength])
        return { pattern: seq, next: base[(length - 1) % seqLength] }
      },
    ]
    const patternFunc = patterns[Math.floor(Math.random() * patterns.length)]
    return patternFunc()
  }

  const generateShapePattern = (length: number): { pattern: string[], next: string } => {
    const shapes = ['⬜', '⬛', '🔺', '🔷', '⭐', '❌']
    const patterns = [
      // Alternating
      () => {
        const idx1 = Math.floor(Math.random() * shapes.length)
        const idx2 = Math.floor(Math.random() * shapes.length)
        const seq = Array.from({ length: length - 1 }, (_, i) => shapes[(idx1 + idx2 * i) % shapes.length])
        return { pattern: seq, next: shapes[(idx1 + idx2 * (length - 1)) % shapes.length] }
      },
      // Repeating sequence
      () => {
        const seqLength = Math.floor(Math.random() * 2) + 2
        const base = shapes.slice(0, seqLength)
        const seq = Array.from({ length: length - 1 }, (_, i) => base[i % seqLength])
        return { pattern: seq, next: base[(length - 1) % seqLength] }
      },
    ]
    const patternFunc = patterns[Math.floor(Math.random() * patterns.length)]
    return patternFunc()
  }

  const generateQuestion = () => {
    const length = getSequenceLength()
    const type = Math.floor(Math.random() * 3) // 0: numbers, 1: colors, 2: shapes

    let result: { pattern: string[], next: string }
    switch (type) {
      case 0:
        result = generateNumberPattern(length)
        break
      case 1:
        result = generateColorPattern(length)
        break
      default:
        result = generateShapePattern(length)
        break
    }

    setPattern(result.pattern)
    setCorrectAnswer(result.next)

    // Generate logical wrong options
    const wrongOptions: string[] = []
    while (wrongOptions.length < 3) {
      let wrong: string
      if (type === 0) {
        // For numbers, generate logical distractors
        const nextNum = parseInt(result.next)
        const distractorOffsets = [
          nextNum - 1,
          nextNum + 1,
          nextNum - 2,
          nextNum + 2,
          Math.floor(nextNum / 2),
          Math.floor(nextNum * 1.5),
        ]
        wrong = distractorOffsets[Math.floor(Math.random() * distractorOffsets.length)].toString()
      } else {
        const pool = type === 1 ? ['🔴', '🔵', '🟢', '🟡', '🟣'] : ['⬜', '⬛', '🔺', '🔷', '⭐', '❌']
        wrong = pool[Math.floor(Math.random() * pool.length)]
      }
      if (wrong !== result.next && !wrongOptions.includes(wrong)) {
        wrongOptions.push(wrong)
      }
    }

    const allOptions = [result.next, ...wrongOptions].sort(() => Math.random() - 0.5)
    setOptions(allOptions)
    setShowResult(false)
  }

  const handleAnswer = (answer: string) => {
    if (showResult) return

    const correct = answer === correctAnswer
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
        gameId: 'sequence-completion',
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Over!</h2>
          <p className="text-xl text-gray-600 mb-2">Final Score: {score}</p>
          <p className="text-lg text-gray-500 mb-6">Level Reached: {level}</p>
          <p className="text-lg text-gray-500 mb-6">Correct answer: {correctAnswer}</p>
          <button
            onClick={() => {
              setScore(0)
              setLevel(1)
              generateQuestion()
              setGameOver(false)
            }}
            className="bg-purple-500 text-white px-8 py-3 rounded-xl text-xl font-bold hover:bg-purple-600 transition"
          >
            Play Again
          </button>
          <Link href="/pattern" className="block mt-4 text-purple-500 hover:underline">
            ← Back to Games
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="p-6 bg-white shadow-sm">
        <Link href="/pattern" className="text-purple-500 hover:underline mb-4 block">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">📊 Sequence Completion</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto text-center mb-8">
          <div className="flex justify-center gap-8 text-2xl mb-4">
            <p className="font-bold text-purple-600">Score: {score}</p>
            <p className="font-bold text-pink-600">Level: {level}</p>
          </div>
          <p className="text-xl text-gray-600">What comes next?</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-lg mx-auto mb-8">
          <div className="flex justify-center items-center gap-4 flex-wrap">
            {pattern.map((item, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-5xl text-gray-800 font-bold"
              >
                {item}
              </motion.div>
            ))}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: pattern.length * 0.1 }}
              className="text-5xl text-purple-500 font-bold"
            >
              ?
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          {options.map((option, i) => (
            <motion.button
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(option)}
              disabled={showResult}
              className={`text-5xl py-8 rounded-xl shadow-lg transition-all ${
                showResult
                  ? option === correctAnswer
                    ? 'bg-green-500 text-white cursor-default'
                    : 'bg-gray-200 opacity-50 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-100 hover:shadow-xl cursor-pointer'
              }`}
            >
              {option}
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
