'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

type PuzzlePiece = { id: number, currentPos: number, correctPos: number }

export default function JigsawPuzzlePage() {
  const { t } = useTranslation()
  const { currentDifficulty, addSession } = useGameStore()

  const [pieces, setPieces] = useState<PuzzlePiece[]>([])
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null)
  const [moves, setMoves] = useState(0)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const getGridSize = () => {
    switch (currentDifficulty) {
      case 'easy': return 3  // 3x3
      case 'medium': return 4  // 4x4
      case 'hard': return 5   // 5x5
    }
  }

  const getColors = () => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ]
    return colors
  }

  const initializePuzzle = () => {
    const size = getGridSize()
    const numPieces = size * size
    const colors = getColors()

    const newPieces: PuzzlePiece[] = Array.from({ length: numPieces }, (_, i) => ({
      id: i,
      currentPos: i,
      correctPos: i
    }))

    // Shuffle pieces (swap adjacent pieces to ensure solvability)
    const shuffled = [...newPieces]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = shuffled[i].currentPos
      shuffled[i].currentPos = shuffled[j].currentPos
      shuffled[j].currentPos = temp
    }

    setPieces(shuffled)
    setMoves(0)
    setSelectedPiece(null)
    setGameOver(false)
  }

  const handlePieceClick = (index: number) => {
    if (gameOver) return

    const piece = pieces.find(p => p.currentPos === index)
    if (!piece) return

    if (selectedPiece === null) {
      setSelectedPiece(index)
    } else if (selectedPiece === index) {
      setSelectedPiece(null)
    } else {
      // Swap pieces
      const newPieces = pieces.map(p => {
        if (p.currentPos === selectedPiece) {
          return { ...p, currentPos: index }
        } else if (p.currentPos === index) {
          return { ...p, currentPos: selectedPiece }
        }
        return p
      })
      setPieces(newPieces)
      setMoves(moves + 1)
      setSelectedPiece(null)

      // Check if solved
      const isSolved = newPieces.every(p => p.currentPos === p.correctPos)
      if (isSolved) {
        setGameOver(true)
        const levelScore = Math.max(0, (getGridSize() * 20 - moves * 2) * level)
        setScore(score + levelScore)
        addSession({
          id: Date.now().toString(),
          gameId: 'jigsaw-puzzle',
          difficulty: currentDifficulty,
          score: score + levelScore,
          completedAt: new Date(),
          durationSeconds: 60 * level
        })
      }
    }
  }

  const getPieceColor = (pos: number) => {
    const size = getGridSize()
    const colors = getColors()
    const row = Math.floor(pos / size)
    const col = pos % size
    return colors[(row * 2 + col) % colors.length]
  }

  useEffect(() => {
    initializePuzzle()
  }, [])

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md"
        >
          <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Puzzle Solved!</h2>
          <p className="text-xl text-gray-600 mb-2">Score: {score}</p>
          <p className="text-lg text-gray-500 mb-2">Moves: {moves}</p>
          <p className="text-lg text-gray-500 mb-6">Level: {level}</p>
          <button
            onClick={() => {
              setLevel(level + 1)
              initializePuzzle()
            }}
            className="bg-green-500 text-white px-8 py-3 rounded-xl text-xl font-bold hover:bg-green-600 transition mb-4"
          >
            Next Level
          </button>
          <br />
          <button
            onClick={() => {
              setScore(0)
              setLevel(1)
              initializePuzzle()
            }}
            className="bg-purple-500 text-white px-8 py-3 rounded-xl text-xl font-bold hover:bg-purple-600 transition"
          >
            Restart
          </button>
          <Link href="/pattern" className="block mt-4 text-purple-500 hover:underline">
            ← Back to Games
          </Link>
        </motion.div>
      </div>
    )
  }

  const size = getGridSize()
  const sortedPieces = [...pieces].sort((a, b) => a.currentPos - b.currentPos)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="p-6 bg-white shadow-sm">
        <Link href="/pattern" className="text-purple-500 hover:underline mb-4 block">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">🖼️ Jigsaw Puzzle</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto text-center mb-8">
          <div className="flex justify-center gap-8 text-2xl mb-4">
            <p className="font-bold text-purple-600">Score: {score}</p>
            <p className="font-bold text-pink-600">Level: {level}</p>
            <p className="font-bold text-blue-600">Moves: {moves}</p>
          </div>
          <p className="text-lg text-gray-600">Click two pieces to swap them</p>
        </div>

        <div
          className="bg-white p-4 rounded-2xl shadow-xl max-w-lg mx-auto"
          style={{ maxWidth: '400px', margin: '0 auto' }}
        >
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
            {sortedPieces.map((piece) => (
              <motion.button
                key={piece.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePieceClick(piece.currentPos)}
                className={`aspect-square rounded-lg shadow transition-all border-4 ${
                  selectedPiece === piece.currentPos
                    ? 'border-yellow-400 scale-105'
                    : 'border-transparent'
                }`}
                style={{
                  backgroundColor: getPieceColor(piece.correctPos),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                {piece.id + 1}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => initializePuzzle()}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Shuffle
          </button>
        </div>
      </main>
    </div>
  )
}
