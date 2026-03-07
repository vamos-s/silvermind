'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

const DIRECTIONS = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
}

type CellType = 'empty' | 'wall' | 'start' | 'end' | 'player'

export default function MazeNavigationPage() {
  const { t } = useTranslation()
  const { currentDifficulty, addSession } = useGameStore()

  const [maze, setMaze] = useState<CellType[][]>([])
  const [playerPos, setPlayerPos] = useState<[number, number]>([0, 0])
  const [endPos, setEndPos] = useState<[number, number]>([0, 0])
  const [moves, setMoves] = useState(0)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [victory, setVictory] = useState(false)

  const getMazeSize = () => {
    switch (currentDifficulty) {
      case 'easy': return 5
      case 'medium': return 7
      case 'hard': return 9
    }
  }

  const generateMaze = () => {
    const size = getMazeSize()
    const newMaze: CellType[][] = []

    // Initialize with walls
    for (let y = 0; y < size; y++) {
      newMaze.push(Array(size).fill('wall'))
    }

    // Simple maze generation using recursive backtracking
    const visited = new Set<string>()
    const stack: [number, number][] = []

    const getKey = (x: number, y: number) => `${x},${y}`

    const carve = (x: number, y: number) => {
      visited.add(getKey(x, y))
      newMaze[y][x] = 'empty'

      const directions = [
        [0, -2], [0, 2], [-2, 0], [2, 0]
      ].sort(() => Math.random() - 0.5)

      for (const [dx, dy] of directions) {
        const nx = x + dx
        const ny = y + dy

        if (nx >= 0 && nx < size && ny >= 0 && ny < size && !visited.has(getKey(nx, ny))) {
          newMaze[y + dy / 2][x + dx / 2] = 'empty'
          carve(nx, ny)
        }
      }
    }

    carve(1, 1)
    newMaze[1][1] = 'start'
    setPlayerPos([1, 1])

    // Set end position at bottom right
    let endX = size - 2
    let endY = size - 2
    while (newMaze[endY][endX] === 'wall') {
      endX = Math.floor(Math.random() * (size - 2)) + 1
      endY = Math.floor(Math.random() * (size - 2)) + 1
    }
    newMaze[endY][endX] = 'end'
    setEndPos([endX, endY])

    setMaze(newMaze)
    setMoves(0)
    setGameOver(false)
    setVictory(false)
  }

  const movePlayer = (direction: string) => {
    if (gameOver) return

    const [x, y] = playerPos
    let newX = x
    let newY = y

    switch (direction) {
      case DIRECTIONS.UP:
        newY = y - 1
        break
      case DIRECTIONS.DOWN:
        newY = y + 1
        break
      case DIRECTIONS.LEFT:
        newX = x - 1
        break
      case DIRECTIONS.RIGHT:
        newX = x + 1
        break
    }

    const size = maze.length

    if (newX >= 0 && newX < size && newY >= 0 && newY < size) {
      if (maze[newY][newX] !== 'wall') {
        setPlayerPos([newX, newY])
        setMoves(moves + 1)

        if (maze[newY][newX] === 'end') {
          setVictory(true)
          setGameOver(true)
          const levelScore = Math.max(0, (getMazeSize() * 10 - moves) * level)
          setScore(score + levelScore)
          addSession({
            id: Date.now().toString(),
            gameId: 'maze-navigation',
            difficulty: currentDifficulty,
            score: score + levelScore,
            completedAt: new Date(),
            durationSeconds: 60 * level
          })
        }
      }
    }
  }

  useEffect(() => {
    generateMaze()
  }, [])

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        movePlayer(DIRECTIONS.UP)
        break
      case 'ArrowDown':
      case 's':
      case 'S':
        movePlayer(DIRECTIONS.DOWN)
        break
      case 'ArrowLeft':
      case 'a':
      case 'A':
        movePlayer(DIRECTIONS.LEFT)
        break
      case 'ArrowRight':
      case 'd':
      case 'D':
        movePlayer(DIRECTIONS.RIGHT)
        break
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [playerPos, maze, gameOver])

  const getCellContent = (type: CellType) => {
    switch (type) {
      case 'wall':
        return '⬛'
      case 'start':
        return '🚩'
      case 'end':
        return '🏁'
      case 'player':
        return '🧙'
      default:
        return ''
    }
  }

  const getCellColor = (type: CellType, isPlayer: boolean) => {
    if (isPlayer) return 'bg-yellow-400'
    switch (type) {
      case 'wall':
        return 'bg-gray-800'
      case 'start':
        return 'bg-blue-500'
      case 'end':
        return 'bg-green-500'
      default:
        return 'bg-white'
    }
  }

  if (gameOver && victory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md"
        >
          <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Victory!</h2>
          <p className="text-xl text-gray-600 mb-2">Score: {score}</p>
          <p className="text-lg text-gray-500 mb-2">Moves: {moves}</p>
          <p className="text-lg text-gray-500 mb-6">Level: {level}</p>
          <button
            onClick={() => {
              setLevel(level + 1)
              generateMaze()
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
              generateMaze()
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="p-6 bg-white shadow-sm">
        <Link href="/pattern" className="text-purple-500 hover:underline mb-4 block">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">🧩 Maze Navigation</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto text-center mb-8">
          <div className="flex justify-center gap-8 text-2xl mb-4">
            <p className="font-bold text-purple-600">Score: {score}</p>
            <p className="font-bold text-pink-600">Level: {level}</p>
            <p className="font-bold text-blue-600">Moves: {moves}</p>
          </div>
          <p className="text-lg text-gray-600">Use arrow keys or buttons to navigate</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-2xl shadow-xl max-w-lg mx-auto mb-6">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${maze.length}, minmax(0, 1fr))` }}>
            {maze.map((row, y) =>
              row.map((cell, x) => {
                const isPlayer = playerPos[0] === x && playerPos[1] === y
                const isStart = cell === 'start' && !isPlayer
                const isEnd = cell === 'end' && !isPlayer

                return (
                  <motion.div
                    key={`${x}-${y}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: (x + y) * 0.02 }}
                    className={`aspect-square rounded flex items-center justify-center text-2xl ${getCellColor(cell, isPlayer)}`}
                  >
                    {isPlayer ? getCellContent('player') : getCellContent(cell)}
                  </motion.div>
                )
              })
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          <div></div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => movePlayer(DIRECTIONS.UP)}
            className="bg-purple-500 text-white text-2xl font-bold py-4 rounded-xl shadow-lg hover:bg-purple-600 transition"
          >
            ↑
          </motion.button>
          <div></div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => movePlayer(DIRECTIONS.LEFT)}
            className="bg-purple-500 text-white text-2xl font-bold py-4 rounded-xl shadow-lg hover:bg-purple-600 transition"
          >
            ←
          </motion.button>
          <div></div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => movePlayer(DIRECTIONS.RIGHT)}
            className="bg-purple-500 text-white text-2xl font-bold py-4 rounded-xl shadow-lg hover:bg-purple-600 transition"
          >
            →
          </motion.button>

          <div></div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => movePlayer(DIRECTIONS.DOWN)}
            className="bg-purple-500 text-white text-2xl font-bold py-4 rounded-xl shadow-lg hover:bg-purple-600 transition"
          >
            ↓
          </motion.button>
          <div></div>
        </div>

        <div className="text-center mt-6 text-gray-500">
          <p>🚩 Start | 🏁 Goal</p>
        </div>
      </main>
    </div>
  )
}
