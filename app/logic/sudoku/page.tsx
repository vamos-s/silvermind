'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

type CellValue = number | null

export default function SudokuPage() {
  const { t } = useTranslation()
  const { currentDifficulty, addSession } = useGameStore()

  const [grid, setGrid] = useState<CellValue[][]>([])
  const [solution, setSolution] = useState<CellValue[][]>([])
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [maxLevel] = useState(30)
  const [mistakes, setMistakes] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [victory, setVictory] = useState(false)

  const getGridSize = () => {
    // Scale with level: 4x4 → 6x6 → 9x9
    if (level <= 6) return 4
    if (level <= 12) return 6
    return 9
  }

  const getEmptyCells = (size: number) => {
    // More empty cells for higher levels and difficulties
    const baseMultiplier = {
      easy: 0.3,
      medium: 0.45,
      hard: 0.6
    }[currentDifficulty]

    // Add level bonus (harder at higher levels) - scaled for 30 levels
    const levelBonus = Math.min(level * 0.01, 0.25)

    const emptyRatio = baseMultiplier + levelBonus
    return Math.floor(size * size * emptyRatio)
  }

  const getSubGridSize = (size: number): [number, number] => {
    // Return [rows, cols] for subgrid
    if (size === 4) return [2, 2]
    if (size === 6) return [2, 3]
    if (size === 9) return [3, 3]
    return [2, 2] // default
  }

  const generateSudoku = () => {
    const size = getGridSize()
    const [subRows, subCols] = getSubGridSize(size)

    // Initialize empty grid
    const newGrid: CellValue[][] = Array(size).fill(null).map(() => Array(size).fill(null))

    // Fill diagonal boxes with random numbers (these are independent and don't conflict)
    for (let boxRow = 0; boxRow < size; boxRow += subRows) {
      for (let boxCol = 0; boxCol < size; boxCol += subCols) {
        // Only fill diagonal boxes (boxRow === boxCol) - they're independent
        if (boxRow !== boxCol) continue

        const numbers = Array.from({ length: size }, (_, i) => i + 1).sort(() => Math.random() - 0.5)
        let numIdx = 0
        for (let i = 0; i < subRows; i++) {
          for (let j = 0; j < subCols; j++) {
            newGrid[boxRow + i][boxCol + j] = numbers[numIdx++]
          }
        }
      }
    }

    // Solve the rest using backtracking - this creates a complete valid Sudoku
    solveSudoku(newGrid, size)

    // Create copy for solution
    const solutionCopy = newGrid.map(row => [...row])

    // Remove some cells based on difficulty and level
    const emptyCount = getEmptyCells(size)
    const positions: [number, number][] = []
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        positions.push([i, j])
      }
    }

    const shuffled = positions.sort(() => Math.random() - 0.5)
    for (let i = 0; i < emptyCount && i < shuffled.length; i++) {
      const [r, c] = shuffled[i]
      newGrid[r][c] = null
    }

    setGrid(newGrid)
    setSolution(solutionCopy)
    setMistakes(0)
    setSelectedCell(null)
    setGameOver(false)
    setVictory(false)
  }

  const solveSudoku = (grid: CellValue[][], size: number): boolean => {
    const [subRows, subCols] = getSubGridSize(size)

    const findEmpty = (): [number, number] | null => {
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (grid[i][j] === null) return [i, j]
        }
      }
      return null
    }

    const isValid = (grid: CellValue[][], row: number, col: number, num: number): boolean => {
      // Check row
      for (let i = 0; i < size; i++) {
        if (grid[row][i] === num) return false
      }

      // Check column
      for (let i = 0; i < size; i++) {
        if (grid[i][col] === num) return false
      }

      // Check subgrid (variable size: 2x2, 2x3, or 3x3)
      const startRow = Math.floor(row / subRows) * subRows
      const startCol = Math.floor(col / subCols) * subCols
      for (let i = 0; i < subRows; i++) {
        for (let j = 0; j < subCols; j++) {
          if (grid[startRow + i][startCol + j] === num) return false
        }
      }

      return true
    }

    const empty = findEmpty()
    if (!empty) return true

    const [row, col] = empty

    const numbers = Array.from({ length: size }, (_, i) => i + 1).sort(() => Math.random() - 0.5)
    for (const num of numbers) {
      if (isValid(grid, row, col, num)) {
        grid[row][col] = num
        if (solveSudoku(grid, size)) return true
        grid[row][col] = null
      }
    }

    return false
  }

  const handleCellClick = (row: number, col: number) => {
    if (gameOver || grid[row][col] !== null) return
    setSelectedCell([row, col])
  }

  const handleNumberInput = (num: number) => {
    if (!selectedCell || gameOver) return

    const [row, col] = selectedCell
    const correct = solution[row][col]

    if (num === correct) {
      const newGrid = grid.map(r => [...r])
      newGrid[row][col] = num
      setGrid(newGrid)

      // Check if solved
      let solved = true
      for (let i = 0; i < newGrid.length && solved; i++) {
        for (let j = 0; j < newGrid[i].length && solved; j++) {
          if (newGrid[i][j] !== solution[i][j]) solved = false
        }
      }

      if (solved) {
        setVictory(true)
        setGameOver(true)
        const levelScore = (getGridSize() * 20 - mistakes * 5) * level
        setScore(score + levelScore)
        addSession({
          id: Date.now().toString(),
          gameId: 'sudoku',
          difficulty: currentDifficulty,
          score: score + levelScore,
          completedAt: new Date(),
          durationSeconds: 120 * level
        })
      }
    } else {
      setMistakes(mistakes + 1)
      if (mistakes >= 3) {
        setGameOver(true)
        addSession({
          id: Date.now().toString(),
          gameId: 'sudoku',
          difficulty: currentDifficulty,
          score: score,
          completedAt: new Date(),
          durationSeconds: 120 * level
        })
      }
    }
    setSelectedCell(null)
  }

  useEffect(() => {
    generateSudoku()
  }, [])

  // Regenerate when level changes
  useEffect(() => {
    if (level > 1) {
      generateSudoku()
    }
  }, [level])

  const size = getGridSize()
  const [subRows, subCols] = getSubGridSize(size)

  if (gameOver && victory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md"
        >
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            {level === maxLevel ? '🏆 Complete!' : '🎉 Solved!'}
          </h2>
          <p className="text-xl text-gray-600 mb-2">Score: {score}</p>
          <p className="text-lg text-gray-500 mb-6">Mistakes: {mistakes}</p>
          {level < maxLevel && (
            <button
              onClick={() => {
                setLevel(level + 1)
                generateSudoku()
              }}
              className="bg-green-500 text-white px-8 py-3 rounded-xl text-xl font-bold hover:bg-green-600 transition mb-4"
            >
              Next Level
            </button>
          )}
          <br />
          <button
            onClick={() => {
              setScore(0)
              setLevel(1)
              generateSudoku()
            }}
            className="bg-blue-500 text-white px-8 py-3 rounded-xl text-xl font-bold hover:bg-blue-600 transition"
          >
            Restart
          </button>
          <Link href="/logic" className="block mt-4 text-green-500 hover:underline">
            ← Back to Games
          </Link>
        </motion.div>
      </div>
    )
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md"
        >
          <h2 className="text-3xl font-bold text-red-600 mb-4">Game Over!</h2>
          <p className="text-xl text-gray-600 mb-2">Score: {score}</p>
          <p className="text-lg text-gray-500 mb-6">Too many mistakes</p>
          <button
            onClick={() => {
              setScore(0)
              setLevel(1)
              generateSudoku()
            }}
            className="bg-green-500 text-white px-8 py-3 rounded-xl text-xl font-bold hover:bg-green-600 transition"
          >
            Try Again
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
        <h1 className="text-3xl font-bold text-gray-800">🔢 Sudoku</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto text-center mb-8">
          <div className="flex justify-center gap-8 text-2xl mb-4">
            <p className="font-bold text-green-600">Score: {score}</p>
            <p className="font-bold text-blue-600">Level: {level}</p>
          </div>
          <p className="text-xl text-red-500">Mistakes: {mistakes}/3</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-xl max-w-md mx-auto mb-8">
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`
            }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => {
                // Variable subgrid borders: 2x2, 2x3, or 3x3
                const isSubGridBorder = (c + 1) % subCols === 0 && c < size - 1
                const isRowBorder = (r + 1) % subRows === 0 && r < size - 1

                return (
                  <motion.button
                    key={`${r}-${c}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: (r * size + c) * 0.02 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCellClick(r, c)}
                    disabled={cell !== null || gameOver}
                    className={`aspect-square rounded-lg text-2xl font-bold transition-all border-2 ${
                      cell !== null
                        ? 'bg-gray-100 border-gray-300 text-gray-800'
                        : selectedCell && selectedCell[0] === r && selectedCell[1] === c
                        ? 'bg-green-200 border-green-500'
                        : 'bg-white border-gray-200 hover:border-green-400'
                    } ${isSubGridBorder ? 'mr-1' : ''} ${isRowBorder ? 'mb-1' : ''} ${
                      cell === null && !gameOver ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    {cell ?? ''}
                  </motion.button>
                )
              })
            )}
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            {size}x{size} Grid (Level {level})
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg max-w-md mx-auto">
          <p className="text-center text-gray-600 mb-4">Select a number:</p>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: size }, (_, i) => i + 1).map((num) => (
              <motion.button
                key={num}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNumberInput(num)}
                disabled={!selectedCell || gameOver}
                className="bg-green-500 text-white text-2xl font-bold py-3 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {num}
              </motion.button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
