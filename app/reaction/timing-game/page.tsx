'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

export default function TimingGamePage() {
  const { t } = useTranslation()
  const { currentDifficulty, addSession } = useGameStore()

  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'finished'>('waiting')
  const [startTime, setStartTime] = useState(0)
  const [reactionTime, setReactionTime] = useState(0)
  const [round, setRound] = useState(1)
  const [reactionTimes, setReactionTimes] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const getRounds = () => {
    switch (currentDifficulty) {
      case 'easy': return 5
      case 'medium': return 8
      case 'hard': return 10
    }
  }

  const getRandomDelay = () => {
    switch (currentDifficulty) {
      case 'easy': return 2000 + Math.random() * 3000
      case 'medium': return 1500 + Math.random() * 4000
      case 'hard': return 1000 + Math.random() * 5000
    }
  }

  const startRound = () => {
    setGameState('waiting')
    setReactionTime(0)

    const delay = getRandomDelay()
    setTimeout(() => {
      if (!gameOver) {
        setGameState('ready')
        setStartTime(Date.now())
      }
    }, delay)
  }

  const handleClick = () => {
    if (gameState === 'ready') {
      const endTime = Date.now()
      const time = endTime - startTime
      setReactionTime(time)
      setGameState('finished')
      setReactionTimes([...reactionTimes, time])

      // Calculate score (faster = more points)
      const roundScore = Math.max(0, Math.floor(1000 - time / 5))
      setScore(score + roundScore)

      if (round < getRounds()) {
        setRound(round + 1)
        setTimeout(() => {
          if (!gameOver) startRound()
        }, 1500)
      } else {
        setGameOver(true)
        addSession({
          id: Date.now().toString(),
          gameId: 'timing-game',
          difficulty: currentDifficulty,
          score: score + roundScore,
          completedAt: new Date(),
          durationSeconds: 60
        })
      }
    } else if (gameState === 'waiting') {
      // Clicked too early
      setGameState('finished')
      setReactionTime(-1) // -1 means clicked too early
      setReactionTimes([...reactionTimes, -1])

      if (round < getRounds()) {
        setRound(round + 1)
        setTimeout(() => {
          if (!gameOver) startRound()
        }, 1500)
      } else {
        setGameOver(true)
        addSession({
          id: Date.now().toString(),
          gameId: 'timing-game',
          difficulty: currentDifficulty,
          score: score,
          completedAt: new Date(),
          durationSeconds: 60
        })
      }
    }
  }

  useEffect(() => {
    startRound()
  }, [])

  if (gameOver) {
    const avgTime = reactionTimes.filter(t => t > 0).reduce((a, b) => a + b, 0) / reactionTimes.filter(t => t > 0).length

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Over!</h2>
          <p className="text-xl text-gray-600 mb-2">Final Score: {score}</p>
          <p className="text-lg text-gray-500 mb-6">
            Avg Reaction: {avgTime > 0 ? `${Math.round(avgTime)}ms` : 'N/A'}
          </p>
          <button
            onClick={() => {
              setScore(0)
              setRound(1)
              setReactionTimes([])
              startRound()
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <header className="p-6 bg-white shadow-sm">
        <Link href="/reaction" className="text-yellow-500 hover:underline mb-4 block">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">⏱️ Timing Game</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto text-center mb-8">
          <div className="flex justify-center gap-8 text-2xl mb-4">
            <p className="font-bold text-yellow-600">Score: {score}</p>
            <p className="font-bold text-orange-600">Round: {round}/{getRounds()}</p>
          </div>
        </div>

        <motion.button
          onClick={handleClick}
          className="w-full aspect-[4/3] rounded-2xl shadow-xl transition-all text-4xl font-bold flex items-center justify-center"
          animate={{
            scale: gameState === 'ready' ? 1.02 : 1,
            backgroundColor: gameState === 'ready' ? '#10B981' : '#EF4444'
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {gameState === 'waiting' && 'Wait for GREEN...'}
          {gameState === 'ready' && 'CLICK NOW!'}
          {gameState === 'finished' && (
            <div>
              {reactionTime === -1 ? (
                <div>
                  <p className="text-2xl mb-2">Too early! 😅</p>
                  <p className="text-xl">Click to continue</p>
                </div>
              ) : (
                <div>
                  <p className="text-2xl mb-2">{reactionTime}ms</p>
                  <p className="text-xl">Click to continue</p>
                </div>
              )}
            </div>
          )}
        </motion.button>

        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg max-w-lg mx-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Previous Times</h2>
          <div className="space-y-2">
            {reactionTimes.map((time, i) => (
              <div key={i} className="flex justify-between text-lg">
                <span className="text-gray-600">Round {i + 1}:</span>
                <span className={time === -1 ? 'text-red-500' : 'text-green-500'}>
                  {time === -1 ? 'Too early' : `${time}ms`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
