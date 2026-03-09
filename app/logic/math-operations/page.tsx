'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

type Operation = '+' | '-' | '×' | '÷'

export default function MathOperationsPage() {
  const { t } = useTranslation()
  const { currentDifficulty, addSession } = useGameStore()

  const [problem, setProblem] = useState<{ a: number, b: number, op: Operation, answer: number }>({ a: 0, b: 0, op: '+', answer: 0 })
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameOver, setGameOver] = useState(false)

  const generateProblem = useCallback(() => {
    let a: number, b: number, op: Operation = '+', answer: number

    switch (currentDifficulty) {
      case 'easy':
        // Addition and subtraction only, single digits
        op = Math.random() > 0.5 ? '+' : '-'
        a = Math.floor(Math.random() * 10)
        b = Math.floor(Math.random() * 10)
        break
      case 'medium':
        // All operations, 2-digit numbers
        const ops: Operation[] = ['+', '-', '×', '÷']
        op = ops[Math.floor(Math.random() * ops.length)]
        a = Math.floor(Math.random() * 20) + 1
        b = Math.floor(Math.random() * 10) + 1
        break
      case 'hard':
        // All operations, 3-digit numbers
        const hardOps: Operation[] = ['+', '-', '×', '÷']
        op = hardOps[Math.floor(Math.random() * hardOps.length)]
        a = Math.floor(Math.random() * 100) + 1
        b = Math.floor(Math.random() * 20) + 1
        break
      default:
        a = Math.floor(Math.random() * 10)
        b = Math.floor(Math.random() * 10)
        op = '+'
        break
    }

    switch (op) {
      case '+':
        answer = a + b
        break
      case '-':
        if (a < b) [a, b] = [b, a]
        answer = a - b
        break
      case '×':
        a = Math.floor(a / 2)
        b = Math.floor(b / 2)
        answer = a * b
        break
      case '÷':
        answer = b
        b = 1
        a = answer * (Math.floor(Math.random() * 5) + 2)
        break
    }

    setProblem({ a, b, op, answer })
    setUserAnswer('')
    setTimeLeft(Math.max(10, 30 - Math.floor(score / 100)))
  }, [currentDifficulty, score])

  const handleSubmit = useCallback(() => {
    const numAnswer = parseInt(userAnswer)
    if (numAnswer === problem.answer) {
      const streakBonus = streak * 5
      const timeBonus = timeLeft * 2
      const points = 10 + streakBonus + timeBonus
      setScore(score + points)
      setStreak(streak + 1)
      generateProblem()
    } else {
      setGameOver(true)
      addSession({
        id: Date.now().toString(),
        gameId: 'math-operations',
        difficulty: currentDifficulty,
        score: score,
        completedAt: new Date(),
        durationSeconds: 30 * Math.floor(score / 100 + 1)
      })
    }
  }, [userAnswer, problem.answer, streak, timeLeft, score, generateProblem, addSession, currentDifficulty])

  useEffect(() => {
    generateProblem()
  }, [])

  useEffect(() => {
    if (gameOver) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true)
          addSession({
            id: Date.now().toString(),
            gameId: 'math-operations',
            difficulty: currentDifficulty,
            score: score,
            completedAt: new Date(),
            durationSeconds: 30 * Math.floor(score / 100 + 1)
          })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameOver, score])

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Over!</h2>
          <p className="text-xl text-gray-600 mb-2">Final Score: {score}</p>
          <p className="text-lg text-gray-500 mb-6">Best Streak: {streak}</p>
          <button
            onClick={() => {
              setScore(0)
              setStreak(0)
              generateProblem()
              setGameOver(false)
            }}
            className="bg-green-500 text-white px-8 py-3 rounded-xl text-xl font-bold hover:bg-green-600 transition"
          >
            Play Again
          </button>
          <Link href="/logic" className="block mt-4 text-green-500 hover:underline">
            ← Back to Games
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="p-6 bg-white shadow-sm">
        <Link href="/logic" className="text-green-500 hover:underline mb-4 block">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">➕ Math Operations</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto text-center mb-8">
          <div className="flex justify-center gap-8 text-2xl mb-4">
            <p className="font-bold text-green-600">Score: {score}</p>
            <p className="font-bold text-blue-600">Streak: {streak}🔥</p>
          </div>
          <div className={`text-3xl font-bold mb-4 ${timeLeft <= 5 ? 'text-red-500' : 'text-gray-700'}`}>
            ⏱️ {timeLeft}s
          </div>
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-12 shadow-xl max-w-md mx-auto mb-8"
        >
          <p className="text-5xl font-bold text-center text-gray-800 mb-8">
            {problem.a} {problem.op} {problem.b} = ?
          </p>

          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full text-center text-4xl font-bold p-4 border-4 border-green-500 rounded-xl focus:outline-none focus:border-green-600 text-gray-800"
            placeholder="?"
            autoFocus
            style={{ WebkitTextFillColor: 'gray' }}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="w-full mt-6 bg-green-500 text-white py-4 rounded-xl text-2xl font-bold hover:bg-green-600 transition"
          >
            Submit
          </motion.button>
        </motion.div>

        <div className="text-center">
          <button
            onClick={() => {
              setScore(0)
              setStreak(0)
              generateProblem()
            }}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            Give Up
          </button>
        </div>
      </main>
    </div>
  )
}
