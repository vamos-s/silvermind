'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

const MAX_LEVELS = 30

type ShapePart = {
  id: number
  type: 'triangle' | 'square' | 'rectangle' | 'trapezoid' | 'pentagon' | 'hexagon' | 'circle' | 'semicircle'
  x: number
  y: number
  rotation: number
  color: string
  width: number
  height: number
}

type Puzzle = {
  id: number
  parts: ShapePart[]
  outlineShape: string
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6', '#ec4899', '#6366f1']

const LEVEL_SETTINGS = [
  // Levels 1-5: Easy introduction
  { partCount: 3, timeLimit: 30, difficulty: 'easy' },
  { partCount: 3, timeLimit: 28, difficulty: 'easy' },
  { partCount: 4, timeLimit: 32, difficulty: 'easy' },
  { partCount: 4, timeLimit: 30, difficulty: 'easy' },
  { partCount: 5, timeLimit: 35, difficulty: 'easy' },

  // Levels 6-10: Medium challenge
  { partCount: 5, timeLimit: 32, difficulty: 'medium' },
  { partCount: 6, timeLimit: 36, difficulty: 'medium' },
  { partCount: 6, timeLimit: 34, difficulty: 'medium' },
  { partCount: 7, timeLimit: 38, difficulty: 'medium' },
  { partCount: 7, timeLimit: 36, difficulty: 'medium' },

  // Levels 11-15: Harder progression
  { partCount: 8, timeLimit: 40, difficulty: 'hard' },
  { partCount: 8, timeLimit: 38, difficulty: 'hard' },
  { partCount: 9, timeLimit: 42, difficulty: 'hard' },
  { partCount: 9, timeLimit: 40, difficulty: 'hard' },
  { partCount: 10, timeLimit: 44, difficulty: 'hard' },

  // Levels 16-20: Advanced challenge
  { partCount: 10, timeLimit: 42, difficulty: 'hard' },
  { partCount: 11, timeLimit: 46, difficulty: 'hard' },
  { partCount: 11, timeLimit: 44, difficulty: 'hard' },
  { partCount: 12, timeLimit: 48, difficulty: 'hard' },
  { partCount: 12, timeLimit: 46, difficulty: 'hard' },

  // Levels 21-25: Expert level
  { partCount: 13, timeLimit: 50, difficulty: 'expert' },
  { partCount: 13, timeLimit: 48, difficulty: 'expert' },
  { partCount: 14, timeLimit: 52, difficulty: 'expert' },
  { partCount: 14, timeLimit: 50, difficulty: 'expert' },
  { partCount: 15, timeLimit: 54, difficulty: 'expert' },

  // Levels 26-30: Master level
  { partCount: 15, timeLimit: 52, difficulty: 'expert' },
  { partCount: 16, timeLimit: 56, difficulty: 'expert' },
  { partCount: 16, timeLimit: 54, difficulty: 'expert' },
  { partCount: 17, timeLimit: 58, difficulty: 'expert' },
  { partCount: 17, timeLimit: 56, difficulty: 'expert' },
]

export default function ShapeReconstructionPage() {
  const { t } = useTranslation()
  const { addSession, darkMode } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'showing' | 'input' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [puzzles, setPuzzles] = useState<Puzzle[]>([])
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0)
  const [placedParts, setPlacedParts] = useState<ShapePart[]>([])
  const [selectedPart, setSelectedPart] = useState<ShapePart | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const settings = LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)]

  const getLevelScore = (correct: number, total: number) => {
    const baseScore = (correct / total) * 1000
    const timeBonus = timeLeft * 15
    return Math.round(baseScore + timeBonus)
  }

  const generateShapePart = (id: number, canvasWidth: number, canvasHeight: number): ShapePart => {
    const types: ShapePart['type'][] = ['triangle', 'square', 'rectangle', 'trapezoid', 'circle', 'semicircle']
    const type = types[Math.floor(Math.random() * types.length)]
    const width = 40 + Math.random() * 60
    const height = 40 + Math.random() * 60
    
    return {
      id,
      type,
      x: Math.random() * (canvasWidth - 100) + 50,
      y: Math.random() * (canvasHeight - 100) + 50,
      rotation: Math.random() * 360,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      width: type === 'circle' || type === 'semicircle' ? Math.min(width, height) : width,
      height: type === 'circle' ? Math.min(width, height) : height
    }
  }

  const generatePuzzles = useCallback(() => {
    const newPuzzles: Puzzle[] = []
    const canvasWidth = 400
    const canvasHeight = 400

    for (let i = 0; i < 5; i++) {
      const parts: ShapePart[] = []
      for (let j = 0; j < settings.partCount; j++) {
        parts.push(generateShapePart(j, canvasWidth, canvasHeight))
      }

      const outlineShapes = ['star', 'heart', 'house', 'tree', 'rocket', 'car', 'boat', 'flower']
      newPuzzles.push({
        id: i,
        parts,
        outlineShape: outlineShapes[Math.floor(Math.random() * outlineShapes.length)]
      })
    }

    return newPuzzles
  }, [settings.partCount])

  const startGame = () => {
    setScore(0)
    setTotalScore(0)
    setLevel(1)
    startLevel()
  }

  const startLevel = () => {
    const newPuzzles = generatePuzzles()
    setPuzzles(newPuzzles)
    setCurrentPuzzleIndex(0)
    setPlacedParts([])
    setSelectedPart(null)
    setShowResult(false)
    setTimeLeft(settings.timeLimit)
    setGameState('showing')

    setTimeout(() => {
      setGameState('input')
    }, 2000)
  }

  const handlePartClick = (part: ShapePart) => {
    if (gameState !== 'input' || showResult) return
    
    setSelectedPart(part)
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'input' || !selectedPart || showResult) return

    const canvas = e.currentTarget
    const rect = canvas.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setPlacedParts([...placedParts, { ...selectedPart, x, y }])
    setSelectedPart(null)
  }

  const handleCheckAnswer = () => {
    if (gameState !== 'input' || showResult) return

    const currentPuzzle = puzzles[currentPuzzleIndex]
    const allPartsPlaced = placedParts.length === currentPuzzle.parts.length
    
    if (allPartsPlaced) {
      setIsCorrect(true)
      setShowResult(true)
    } else {
      setIsCorrect(false)
      setShowResult(true)
    }
  }

  const handleNext = () => {
    setShowResult(false)
    setPlacedParts([])
    setSelectedPart(null)
    
    if (currentPuzzleIndex < puzzles.length - 1) {
      setCurrentPuzzleIndex(prev => prev + 1)
    } else {
      const correctCount = puzzles.filter((puzzle, index) => {
        return index <= currentPuzzleIndex && (isCorrect || puzzles[index].parts.length <= placedParts.length)
      }).length

      const levelScore = getLevelScore(correctCount, puzzles.length)
      setScore(levelScore)
      setGameState('levelComplete')
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (gameState === 'input' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (gameState === 'input' && timeLeft === 0) {
      const levelScore = getLevelScore(0, puzzles.length)
      setScore(levelScore)
      setGameState('levelComplete')
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [gameState, timeLeft])

  const nextLevel = () => {
    const levelScore = score
    setTotalScore(prev => prev + levelScore)

    if (level >= MAX_LEVELS) {
      addSession({
        id: Date.now().toString(),
        gameId: 'shape-reconstruction',
        difficulty: 'hard',
        score: totalScore + levelScore,
        completedAt: new Date(),
        durationSeconds: 0
      })
      setGameState('victory')
    } else {
      setLevel(prev => prev + 1)
      setGameState('menu')
      setTimeout(() => startLevel(), 100)
    }
  }

  const renderShapePart = (part: ShapePart, size = 60) => {
    const baseStyle = {
      width: size,
      height: size,
      position: 'relative' as const,
      transform: `rotate(${part.rotation}deg)`,
      transition: 'all 0.2s ease'
    }

    let shape = null

    switch (part.type) {
      case 'triangle':
        shape = (
          <div
            style={{
              ...baseStyle,
              width: 0,
              height: 0,
              borderLeft: `${size/2}px solid transparent`,
              borderRight: `${size/2}px solid transparent`,
              borderBottom: `${size}px solid ${part.color}`
            }}
          />
        )
        break
      case 'square':
        shape = (
          <div style={{ ...baseStyle, backgroundColor: part.color, borderRadius: '4px' }} />
        )
        break
      case 'rectangle':
        shape = (
          <div style={{ ...baseStyle, width: size * 1.5, backgroundColor: part.color, borderRadius: '4px' }} />
        )
        break
      case 'trapezoid':
        shape = (
          <div style={{ ...baseStyle, backgroundColor: part.color, clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }} />
        )
        break
      case 'circle':
        shape = (
          <div style={{ ...baseStyle, backgroundColor: part.color, borderRadius: '50%' }} />
        )
        break
      case 'semicircle':
        shape = (
          <div style={{ ...baseStyle, backgroundColor: part.color, borderRadius: '50% 50% 0 0' }} />
        )
        break
      default:
        shape = (
          <div style={{ ...baseStyle, backgroundColor: part.color, borderRadius: '4px' }} />
        )
    }

    return shape
  }

  const renderOutlineShape = (shape: string) => {
    const shapes: Record<string, JSX.Element> = {
      star: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" 
            fill="none" stroke={darkMode ? "#94a3b8" : "#6b7280"} strokeWidth="2" strokeDasharray="5,5" />
        </svg>
      ),
      heart: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50 90 L20 60 Q5 40 20 20 Q35 5 50 25 Q65 5 80 20 Q95 40 80 60 Z" 
            fill="none" stroke={darkMode ? "#94a3b8" : "#6b7280"} strokeWidth="2" strokeDasharray="5,5" />
        </svg>
      ),
      house: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M10 40 L50 10 L90 40 L90 90 L10 90 Z" 
            fill="none" stroke={darkMode ? "#94a3b8" : "#6b7280"} strokeWidth="2" strokeDasharray="5,5" />
        </svg>
      ),
      tree: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M20 80 L50 20 L80 80 Z" 
            fill="none" stroke={darkMode ? "#94a3b8" : "#6b7280"} strokeWidth="2" strokeDasharray="5,5" />
          <rect x="40" y="80" width="20" height="20" 
            fill="none" stroke={darkMode ? "#94a3b8" : "#6b7280"} strokeWidth="2" strokeDasharray="5,5" />
        </svg>
      ),
      rocket: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50 10 L70 40 L70 70 L50 90 L30 70 L30 40 Z" 
            fill="none" stroke={darkMode ? "#94a3b8" : "#6b7280"} strokeWidth="2" strokeDasharray="5,5" />
          <polygon points="30,70 20,90 30,80" 
            fill="none" stroke={darkMode ? "#94a3b8" : "#6b7280"} strokeWidth="2" strokeDasharray="5,5" />
          <polygon points="70,70 80,90 70,80" 
            fill="none" stroke={darkMode ? "#94a3b8" : "#6b7280"} strokeWidth="2" strokeDasharray="5,5" />
        </svg>
      ),
      car: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M10 60 L20 40 L80 40 L90 60 L90 80 L10 80 Z" 
            fill="none" stroke={darkMode ? "#94a3b8" : "#6b7280"} strokeWidth="2" strokeDasharray="5,5" />
          <circle cx="25" cy="85" r="10" 
            fill="none" stroke={darkMode ? "#94a3b8" : "#6b7280"} strokeWidth="2" strokeDasharray="5,5" />
          <circle cx="75" cy="85" r="10" 
            fill="none" stroke={darkMode ? "#94a3b8" : "#6b7280"} strokeWidth="2" strokeDasharray="5,5" />
        </svg>
      ),
      boat: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M10 60 L90 60 L80 80 L20 80 Z" 
            fill="none" stroke={darkMode ? "#94a3b8" : "#6b7280"} strokeWidth="2" strokeDasharray="5,5" />
          <path d="M50 60 L50 20 L70 60 Z" 
            fill="none" stroke={darkMode ? "#94a3b8" : "#6b7280"} strokeWidth="2" strokeDasharray="5,5" />
        </svg>
      ),
      flower: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="10" 
            fill="none" stroke={darkMode ? "#94a3b8" : "#6b7280"} strokeWidth="2" strokeDasharray="5,5" />
          <circle cx="50" cy="25" r="15" 
            fill="none" stroke={darkMode ? "#94a3b8" : "#6b7280"} strokeWidth="2" strokeDasharray="5,5" />
          <circle cx="75" cy="50" r="15" 
            fill="none" stroke={darkMode ? "#94a3b8" : "#6b7280"} strokeWidth="2" strokeDasharray="5,5" />
          <circle cx="50" cy="75" r="15" 
            fill="none" stroke={darkMode ? "#94a3b8" : "#6b7280"} strokeWidth="2" strokeDasharray="5,5" />
          <circle cx="25" cy="50" r="15" 
            fill="none" stroke={darkMode ? "#94a3b8" : "#6b7280"} strokeWidth="2" strokeDasharray="5,5" />
        </svg>
      )
    }

    return shapes[shape] || shapes.star
  }

  const currentPuzzle = puzzles[currentPuzzleIndex]
  const remainingParts = currentPuzzle ? currentPuzzle.parts.filter(p => !placedParts.some(pl => pl.id === p.id)) : []

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-purple-50 via-white to-pink-50'} p-4 md:p-8`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link
          href="/spatial"
          className={`inline-flex items-center ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium mb-6 text-lg`}
        >
          <span className="mr-2">←</span> {t('back', 'Back')}
        </Link>

        <h1 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-slate-50' : 'text-gray-800'} mb-2`}>
          {t('shapeReconstruction.title', 'Shape Reconstruction')}
        </h1>
        <p className={`text-lg ${darkMode ? 'text-slate-300' : 'text-gray-700'} font-medium mb-8`}>
          {t('shapeReconstruction.description', 'Drag and place parts to reconstruct the shape!')}
        </p>

        {/* Menu */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-8 text-center`}
          >
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-slate-50' : 'text-gray-800'} mb-2`}>
              Level {level}
            </h2>
            {level > 1 && (
              <p className={`text-lg ${darkMode ? 'text-slate-300' : 'text-gray-700'} mb-4 font-medium`}>
                Total Score: <span className="text-purple-600 font-bold">{totalScore}</span>
              </p>
            )}
            <div className={`rounded-xl p-4 mb-6 text-left ${darkMode ? 'bg-slate-700' : 'bg-purple-50'}`}>
              <h3 className={`font-bold ${darkMode ? 'text-slate-50' : 'text-gray-800'} mb-2`}>{t('shapeReconstruction.levelInfo', 'Level Settings')}:</h3>
              <ul className={`space-y-1 font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <li>• {t('shapeReconstruction.partCount', 'Parts per Shape')}: {settings.partCount}</li>
                <li>• {t('shapeReconstruction.timeLimit', 'Time Limit')}: {settings.timeLimit}s</li>
              </ul>
            </div>
            <button
              onClick={startLevel}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-purple-600 hover:to-pink-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Showing puzzle */}
        {gameState === 'showing' && currentPuzzle && (
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-8 text-center`}>
            <p className={`text-xl ${darkMode ? 'text-slate-300' : 'text-gray-600'} mb-4 font-medium`}>
              {t('shapeReconstruction.memorize', 'Memorize the shape!')}
            </p>
            <div className="w-full aspect-square max-w-md mx-auto mb-4">
              {renderOutlineShape(currentPuzzle.outlineShape)}
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {currentPuzzle.parts.map(part => (
                <div key={part.id} className="transform scale-75">
                  {renderShapePart(part)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input phase */}
        {gameState === 'input' && currentPuzzle && (
          <>
            {/* Stats */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-6 mb-6`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('shapeReconstruction.puzzle', 'Puzzle')}</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {currentPuzzleIndex + 1}/{puzzles.length}
                  </p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('shapeReconstruction.score', 'Score')}</p>
                  <p className="text-3xl font-bold text-pink-600">{totalScore}</p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('shapeReconstruction.timeLeft', 'Time Left')}</p>
                  <p className={`text-4xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-purple-600'}`}>
                    {timeLeft}s
                  </p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 dark:bg-slate-600 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentPuzzleIndex) / puzzles.length) * 100}%` }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full"
                />
              </div>
            </div>

            {/* Canvas area */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-8 mb-6`}>
              <p className={`text-2xl font-bold ${darkMode ? 'text-slate-50' : 'text-gray-800'} mb-4 text-center`}>
                {t('shapeReconstruction.reconstruct', 'Reconstruct the shape!')}
              </p>
              
              {/* Canvas */}
              <div
                onClick={handleCanvasClick}
                className={`relative w-full aspect-square max-w-md mx-auto rounded-xl cursor-crosshair border-4 border-dashed ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-300'}`}
              >
                {renderOutlineShape(currentPuzzle.outlineShape)}
                
                {/* Placed parts */}
                <AnimatePresence>
                  {placedParts.map((part) => (
                    <motion.div
                      key={part.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute pointer-events-none"
                      style={{ left: `${part.x}%`, top: `${part.y}%`, transform: 'translate(-50%, -50%)' }}
                    >
                      {renderShapePart(part, 40)}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Parts to place */}
              <div className="mt-6">
                <p className={`text-lg font-bold ${darkMode ? 'text-slate-50' : 'text-gray-800'} mb-3 text-center`}>
                  {t('shapeReconstruction.tapToSelect', 'Tap a part, then tap the canvas to place it')}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {remainingParts.map(part => (
                    <motion.button
                      key={part.id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handlePartClick(part)}
                      className={`transform ${selectedPart?.id === part.id ? 'scale-110 ring-4 ring-purple-500' : ''}`}
                    >
                      {renderShapePart(part, 50)}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              {!showResult && (
                <div className="mt-6 text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCheckAnswer}
                    disabled={placedParts.length === 0}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold py-3 px-8 rounded-xl hover:from-purple-600 hover:to-pink-600 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('shapeReconstruction.checkAnswer', 'Check Answer')}
                  </motion.button>
                </div>
              )}

              {/* Result */}
              {showResult && (
                <div className="mt-6 text-center">
                  <div className={`p-4 rounded-xl mb-4 ${
                    isCorrect ? 'bg-green-50 border-2 border-green-500 dark:bg-green-900/30' : 'bg-red-50 border-2 border-red-500 dark:bg-red-900/30'
                  }`}>
                    <p className="text-lg font-bold mb-2">
                      {isCorrect ? '✅ Correct!' : '❌ Try Again!'}
                    </p>
                    <p className={darkMode ? 'text-slate-300' : 'text-gray-700'}>
                      {placedParts.length}/{currentPuzzle.parts.length} {t('shapeReconstruction.partsPlaced', 'parts placed')}
                    </p>
                  </div>
                  <div className="flex gap-3 justify-center">
                    {!isCorrect && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowResult(false)}
                        className="bg-gray-500 hover:bg-gray-600 text-white text-lg font-bold py-2 px-6 rounded-xl shadow-lg transition-all"
                      >
                        {t('shapeReconstruction.continue', 'Continue')}
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNext}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold py-2 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 shadow-lg transition-all"
                    >
                      {currentPuzzleIndex < puzzles.length - 1
                        ? t('shapeReconstruction.nextPuzzle', 'Next Puzzle')
                        : t('shapeReconstruction.seeResults', 'See Results')}
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Level Complete */}
        {gameState === 'levelComplete' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-8 text-center`}
          >
            <div className="text-6xl mb-4">
              {score > 0 ? '✅' : '❌'}
            </div>
            <h2 className={`text-4xl font-bold mb-4 ${score > 0 ? 'text-purple-600' : 'text-red-500'}`}>
              {score > 0 ? `Level ${level} Complete!` : 'Level Failed!'}
            </h2>
            {score > 0 ? (
              <div className={`rounded-xl p-6 mb-6 ${darkMode ? 'bg-slate-700' : 'bg-purple-50'}`}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('shapeReconstruction.levelScore', 'Level Score')}</p>
                    <p className="text-3xl font-bold text-purple-600">{score}</p>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('shapeReconstruction.totalScore', 'Total Score')}</p>
                    <p className="text-3xl font-bold text-pink-600">{totalScore + score}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`rounded-xl p-6 mb-6 ${darkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
                <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('shapeReconstruction.levelScore', 'Level Score')}</p>
                <p className="text-3xl font-bold text-red-500">{score}</p>
              </div>
            )}
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-purple-600 hover:to-pink-600 shadow-lg transition-all w-full mb-3"
            >
              {level < MAX_LEVELS ? `Next Level ${level + 1}` : 'View Final Score'}
            </button>
            <button
              onClick={startGame}
              className={darkMode ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}
            >
              {t('shapeReconstruction.restart', 'Restart from Level 1')}
            </button>
          </motion.div>
        )}

        {/* Victory */}
        {gameState === 'victory' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-8 text-center`}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-purple-600 mb-4">{t('shapeReconstruction.victory', 'Congratulations!')}</h2>
            <p className={`text-xl ${darkMode ? 'text-slate-300' : 'text-gray-700'} font-medium mb-6`}>
              {t('shapeReconstruction.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className={`rounded-xl p-6 mb-6 ${darkMode ? 'bg-slate-700' : 'bg-purple-50'}`}>
              <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('shapeReconstruction.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-purple-600">{totalScore + score}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-purple-600 hover:to-pink-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
