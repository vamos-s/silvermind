'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

import { SettingsPanel } from "@/components/SettingsPanel"
type ShapeType = 'circle' | 'square' | 'triangle' | 'diamond'
type ColorType = 'red' | 'blue' | 'green' | 'yellow' | 'orange' | 'purple'
type PatternType = 'color' | 'shape' | 'size' | 'position'

interface PatternItem {
  shape: ShapeType
  color: ColorType
  size: 'small' | 'medium' | 'large'
  position: 'left' | 'center' | 'right'
}

const SHAPES: ShapeType[] = ['circle', 'square', 'triangle', 'diamond']
const COLORS: ColorType[] = ['red', 'blue', 'green', 'yellow', 'orange', 'purple']
const SIZES: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large']
const POSITIONS: ('left' | 'center' | 'right')[] = ['left', 'center', 'right']

const PATTERN_TYPES: PatternType[] = ['color', 'shape', 'size', 'position']

const COLOR_MAP: Record<ColorType, string> = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  orange: 'bg-orange-500',
  purple: 'bg-purple-500',
}

const SIZE_MAP: Record<'small' | 'medium' | 'large', string> = {
  small: 'w-12 h-12 md:w-16 md:h-16',
  medium: 'w-16 h-16 md:w-20 md:h-20',
  large: 'w-20 h-20 md:w-24 md:h-24',
}

const MAX_LEVELS = 30

const LEVEL_SETTINGS = [
  // Levels 1-5: Easy introduction
  { patternLength: 3, questions: 5, timePerQuestion: 30, shapes: 3, colors: 3 },  // Level 1
  { patternLength: 3, questions: 5, timePerQuestion: 28, shapes: 3, colors: 4 },  // Level 2
  { patternLength: 3, questions: 5, timePerQuestion: 26, shapes: 4, colors: 4 },  // Level 3
  { patternLength: 3, questions: 6, timePerQuestion: 24, shapes: 4, colors: 4 },  // Level 4
  { patternLength: 4, questions: 6, timePerQuestion: 22, shapes: 4, colors: 5 },  // Level 5

  // Levels 6-10: Medium challenge
  { patternLength: 4, questions: 7, timePerQuestion: 20, shapes: 4, colors: 5 },  // Level 6
  { patternLength: 4, questions: 7, timePerQuestion: 18, shapes: 4, colors: 6 },  // Level 7
  { patternLength: 5, questions: 8, timePerQuestion: 17, shapes: 4, colors: 6 },  // Level 8
  { patternLength: 5, questions: 9, timePerQuestion: 16, shapes: 4, colors: 6 },  // Level 9
  { patternLength: 5, questions: 10, timePerQuestion: 15, shapes: 4, colors: 6 }, // Level 10

  // Levels 11-15: Harder progression
  { patternLength: 5, questions: 10, timePerQuestion: 14, shapes: 4, colors: 6 }, // Level 11
  { patternLength: 6, questions: 10, timePerQuestion: 13, shapes: 4, colors: 6 }, // Level 12
  { patternLength: 6, questions: 11, timePerQuestion: 12, shapes: 4, colors: 6 }, // Level 13
  { patternLength: 6, questions: 12, timePerQuestion: 11, shapes: 4, colors: 6 }, // Level 14
  { patternLength: 7, questions: 12, timePerQuestion: 10, shapes: 4, colors: 6 }, // Level 15

  // Levels 16-20: Advanced challenge
  { patternLength: 7, questions: 13, timePerQuestion: 10, shapes: 4, colors: 6 }, // Level 16
  { patternLength: 7, questions: 14, timePerQuestion: 9, shapes: 4, colors: 6 },  // Level 17
  { patternLength: 8, questions: 14, timePerQuestion: 9, shapes: 4, colors: 6 },  // Level 18
  { patternLength: 8, questions: 15, timePerQuestion: 8, shapes: 4, colors: 6 },  // Level 19
  { patternLength: 8, questions: 16, timePerQuestion: 8, shapes: 4, colors: 6 },  // Level 20

  // Levels 21-25: Expert level
  { patternLength: 8, questions: 16, timePerQuestion: 7, shapes: 4, colors: 6 },  // Level 21
  { patternLength: 9, questions: 16, timePerQuestion: 7, shapes: 4, colors: 6 },  // Level 22
  { patternLength: 9, questions: 17, timePerQuestion: 6, shapes: 4, colors: 6 },  // Level 23
  { patternLength: 9, questions: 18, timePerQuestion: 6, shapes: 4, colors: 6 },  // Level 24
  { patternLength: 10, questions: 18, timePerQuestion: 5, shapes: 4, colors: 6 }, // Level 25

  // Levels 26-30: Master level
  { patternLength: 10, questions: 19, timePerQuestion: 5, shapes: 4, colors: 6 }, // Level 26
  { patternLength: 10, questions: 20, timePerQuestion: 4, shapes: 4, colors: 6 }, // Level 27
  { patternLength: 10, questions: 20, timePerQuestion: 4, shapes: 4, colors: 6 }, // Level 28
  { patternLength: 10, questions: 20, timePerQuestion: 3, shapes: 4, colors: 6 }, // Level 29
  { patternLength: 10, questions: 20, timePerQuestion: 3, shapes: 4, colors: 6 }, // Level 30
]

export default function PatternRecognitionPage() {
  const { t } = useTranslation()
  const { addSession } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'result' | 'victory'>('menu')
  const [pattern, setPattern] = useState<PatternItem[]>([])
  const [patternType, setPatternType] = useState<PatternType>('color')
  const [options, setOptions] = useState<PatternItem[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [correctIndex, setCorrectIndex] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [questionNumber, setQuestionNumber] = useState(0)
  const [level, setLevel] = useState(1)
  const [timeLeft, setTimeLeft] = useState(0)

  const settings = LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)]
  const levelShapes = SHAPES.slice(0, settings.shapes)
  const levelColors = COLORS.slice(0, settings.colors)

  const getShapeComponent = (item: PatternItem) => {
    const sizeClass = SIZE_MAP[item.size]
    const colorClass = COLOR_MAP[item.color]

    switch (item.shape) {
      case 'circle':
        return <div className={`${sizeClass} ${colorClass} rounded-full`} />
      case 'square':
        return <div className={`${sizeClass} ${colorClass} rounded-lg`} />
      case 'triangle':
        return (
          <div
            className={sizeClass}
            style={{
              width: '0',
              height: '0',
              borderLeft: item.size === 'small' ? '32px' : item.size === 'medium' ? '40px' : '48px',
              borderRight: item.size === 'small' ? '32px' : item.size === 'medium' ? '40px' : '48px',
              borderBottom: item.size === 'small' ? '56px' : item.size === 'medium' ? '70px' : '84px',
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: item.color === 'red' ? '#ef4444' :
                                 item.color === 'blue' ? '#3b82f6' :
                                 item.color === 'green' ? '#22c55e' :
                                 item.color === 'yellow' ? '#eab308' :
                                 item.color === 'orange' ? '#f97316' :
                                 '#a855f7',
            }}
          />
        )
      case 'diamond':
        return <div className={`${sizeClass} ${colorClass} rotate-45`} />
      default:
        return null
    }
  }

  const generatePattern = useCallback(() => {
    const type = PATTERN_TYPES[Math.floor(Math.random() * PATTERN_TYPES.length)]
    setPatternType(type)

    const length = settings.patternLength
    const newPattern: PatternItem[] = []

    // Start with random items
    for (let i = 0; i < length; i++) {
      newPattern.push({
        shape: levelShapes[Math.floor(Math.random() * levelShapes.length)],
        color: levelColors[Math.floor(Math.random() * levelColors.length)],
        size: SIZES[Math.floor(Math.random() * SIZES.length)],
        position: POSITIONS[Math.floor(Math.random() * POSITIONS.length)],
      })
    }

    // Apply pattern
    const baseIndex = Math.floor(Math.random() * (newPattern.length - 1))
    const nextIndex = baseIndex + 1

    const cycle = (arr: any[], index: number) => arr[(index + 1) % arr.length]

    switch (type) {
      case 'color':
        newPattern[nextIndex].color = cycle(levelColors, levelColors.indexOf(newPattern[baseIndex].color))
        break
      case 'shape':
        newPattern[nextIndex].shape = cycle(levelShapes, levelShapes.indexOf(newPattern[baseIndex].shape))
        break
      case 'size':
        newPattern[nextIndex].size = cycle(SIZES, SIZES.indexOf(newPattern[baseIndex].size))
        break
      case 'position':
        newPattern[nextIndex].position = cycle(POSITIONS, POSITIONS.indexOf(newPattern[baseIndex].position))
        break
    }

    // Apply pattern to rest of sequence
    for (let i = nextIndex + 1; i < length; i++) {
      switch (type) {
        case 'color':
          newPattern[i].color = cycle(levelColors, levelColors.indexOf(newPattern[i - 1].color))
          break
        case 'shape':
          newPattern[i].shape = cycle(levelShapes, levelShapes.indexOf(newPattern[i - 1].shape))
          break
        case 'size':
          newPattern[i].size = cycle(SIZES, SIZES.indexOf(newPattern[i - 1].size))
          break
        case 'position':
          newPattern[i].position = cycle(POSITIONS, POSITIONS.indexOf(newPattern[i - 1].position))
          break
      }
    }

    return { pattern: newPattern, type }
  }, [settings, levelShapes, levelColors])

  const generateOptions = useCallback((correctItem: PatternItem, type: PatternType): PatternItem[] => {
    const options: PatternItem[] = [correctItem]

    while (options.length < 4) {
      const wrongItem = { ...correctItem }

      switch (type) {
        case 'color':
          wrongItem.color = levelColors[Math.floor(Math.random() * levelColors.length)]
          break
        case 'shape':
          wrongItem.shape = levelShapes[Math.floor(Math.random() * levelShapes.length)]
          break
        case 'size':
          wrongItem.size = SIZES[Math.floor(Math.random() * SIZES.length)]
          break
        case 'position':
          wrongItem.position = POSITIONS[Math.floor(Math.random() * POSITIONS.length)]
          break
      }

      const exists = options.some(
        opt =>
          opt.shape === wrongItem.shape &&
          opt.color === wrongItem.color &&
          opt.size === wrongItem.size &&
          opt.position === wrongItem.position
      )

      if (!exists && (
        wrongItem.color !== correctItem.color ||
        wrongItem.shape !== correctItem.shape ||
        wrongItem.size !== correctItem.size ||
        wrongItem.position !== correctItem.position
      )) {
        options.push(wrongItem)
      }
    }

    return options.sort(() => Math.random() - 0.5)
  }, [levelColors, levelShapes])

  const getNextItem = (pattern: PatternItem[], type: PatternType): PatternItem => {
    const lastItem = pattern[pattern.length - 1]
    const cycle = (arr: any[], index: number) => arr[(index + 1) % arr.length]

    const nextItem = { ...lastItem }

    switch (type) {
      case 'color':
        nextItem.color = cycle(levelColors, levelColors.indexOf(lastItem.color))
        break
      case 'shape':
        nextItem.shape = cycle(levelShapes, levelShapes.indexOf(lastItem.shape))
        break
      case 'size':
        nextItem.size = cycle(SIZES, SIZES.indexOf(lastItem.size))
        break
      case 'position':
        nextItem.position = cycle(POSITIONS, POSITIONS.indexOf(lastItem.position))
        break
    }

    return nextItem
  }

  const startGame = () => {
    setLevel(1)
    setTotalScore(0)
    startLevel()
  }

  const startLevel = () => {
    setScore(0)
    setQuestionNumber(0)
    setTimeLeft(settings.questions * settings.timePerQuestion)
    startQuestion()
  }

  const startQuestion = () => {
    const { pattern: newPattern, type } = generatePattern()
    setPattern(newPattern)
    setPatternType(type)

    const nextItem = getNextItem(newPattern, type)
    const newOptions = generateOptions(nextItem, type)
    setOptions(newOptions)
    setCorrectIndex(newOptions.findIndex(opt =>
      opt.shape === nextItem.shape &&
      opt.color === nextItem.color &&
      opt.size === nextItem.size &&
      opt.position === nextItem.position
    ))

    setSelectedIndex(null)
  }

  const handleAnswer = (index: number) => {
    if (selectedIndex !== null) return

    setSelectedIndex(index)
    const isCorrect = index === correctIndex

    if (isCorrect) {
      setScore(prev => prev + 10)
    }

    setTimeout(() => {
      if (questionNumber + 1 >= settings.questions) {
        if (score + (isCorrect ? 10 : 0) >= settings.questions * 5) {
          setTotalScore(prev => prev + score + (isCorrect ? 10 : 0))
          if (level >= MAX_LEVELS) {
            addSession({
              id: Date.now().toString(),
              gameId: 'pattern-recognition',
              difficulty: 'hard',
              score: totalScore + score + (isCorrect ? 10 : 0),
              completedAt: new Date(),
              durationSeconds: 0
            })
            setGameState('victory')
          } else {
            setLevel(prev => prev + 1)
            setGameState('menu')
            setTimeout(() => startLevel(), 100)
          }
        } else {
          setGameState('result')
        }
      } else {
        setQuestionNumber(prev => prev + 1)
        startQuestion()
      }
    }, 1500)
  }

  const getPatternExplanation = (type: PatternType): string => {
    switch (type) {
      case 'color':
        return t('patternRecognition.colorPattern', 'The color cycles through the sequence')
      case 'shape':
        return t('patternRecognition.shapePattern', 'The shape cycles through the sequence')
      case 'size':
        return t('patternRecognition.sizePattern', 'The size cycles through the sequence')
      case 'position':
        return t('patternRecognition.positionPattern', 'The position cycles through the sequence')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-amber-50 p-4 md:p-8">
      <SettingsPanel />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Link
          href="/pattern"
          className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium mb-6 text-lg"
        >
          <span className="mr-2">←</span> {t('back', 'Back')}
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          {t('patternRecognition.title', 'Pattern Recognition')}
        </h1>
        <p className="text-lg text-gray-700 font-medium mb-8">
          {t('patternRecognition.description', 'Identify the pattern and find what comes next!')}
        </p>

        {/* Menu */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Level {level}
            </h2>
            {level > 1 && (
              <p className="text-lg text-gray-700 mb-4 font-medium">
                Total Score: <span className="text-cyan-600 font-bold">{totalScore}</span>
              </p>
            )}
            <div className="bg-cyan-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 mb-2">Level Settings:</h3>
              <ul className="text-gray-700 space-y-1 font-medium">
                <li>• Pattern Length: {settings.patternLength}</li>
                <li>• Questions: {settings.questions}</li>
                <li>• Shapes: {settings.shapes}</li>
                <li>• Colors: {settings.colors}</li>
              </ul>
            </div>
            <button
              onClick={startLevel}
              className="bg-gradient-to-r from-cyan-500 to-amber-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-cyan-600 hover:to-amber-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Playing */}
        {gameState === 'playing' && (
          <>
            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-gray-700 text-sm font-medium">Level</p>
                  <p className="text-3xl font-bold text-cyan-600">{level}/{MAX_LEVELS}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">Question</p>
                  <p className="text-3xl font-bold text-amber-600">{questionNumber + 1}/{settings.questions}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">Score</p>
                  <p className="text-3xl font-bold text-cyan-600">{score}</p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((questionNumber) / settings.questions) * 100}%` }}
                  className="bg-gradient-to-r from-cyan-500 to-amber-500 h-full"
                />
              </div>
            </div>

            {/* Pattern display */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Complete the pattern:
              </h2>
              <div className="flex justify-center items-center gap-4 md:gap-8 flex-wrap">
                <AnimatePresence mode="popLayout">
                  {pattern.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ delay: index * 0.15 }}
                      className="flex flex-col items-center"
                    >
                      {getShapeComponent(item)}
                      <span className="text-gray-400 mt-2 text-sm">{index + 1}</span>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-20 h-20 border-4 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
                      <span className="text-3xl text-gray-400">?</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Options */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                What comes next?
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: selectedIndex === null ? 1.05 : 1 }}
                    whileTap={{ scale: selectedIndex === null ? 0.95 : 1 }}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedIndex !== null}
                    className={`p-6 rounded-xl border-4 transition-all ${
                      selectedIndex === index
                        ? index === correctIndex
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : selectedIndex !== null && index === correctIndex
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-cyan-300 bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-center items-center h-32">
                      {getShapeComponent(option)}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Explanation */}
            {selectedIndex !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-6 text-center ${
                  selectedIndex === correctIndex ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                <p className="text-xl font-bold mb-2">
                  {selectedIndex === correctIndex ? 'Correct!' : 'Incorrect'}
                </p>
                <p className="text-lg">
                  {getPatternExplanation(patternType)}
                </p>
              </motion.div>
            )}
          </>
        )}

        {/* Result (Level Failed) */}
        {gameState === 'result' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Level {level} Failed</h2>
            <p className="text-xl text-gray-700 font-medium mb-6">
              You got {score} out of {settings.questions * 10} points needed
            </p>
            <button
              onClick={startLevel}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-red-600 shadow-lg transition-all w-full"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Victory */}
        {gameState === 'victory' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-cyan-600 mb-4">Congratulations!</h2>
            <p className="text-xl text-gray-700 font-medium mb-6">
              You completed all {MAX_LEVELS} levels!
            </p>
            <div className="bg-cyan-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 text-sm font-medium">Final Score</p>
              <p className="text-5xl font-bold text-cyan-600">{totalScore}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-cyan-500 to-amber-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-cyan-600 hover:to-amber-600 shadow-lg transition-all w-full"
            >
              Play Again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
