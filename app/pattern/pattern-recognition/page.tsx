'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

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

export default function PatternRecognitionPage() {
  const { t } = useTranslation()
  const { currentDifficulty, addSession } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu')
  const [pattern, setPattern] = useState<PatternItem[]>([])
  const [patternType, setPatternType] = useState<PatternType>('color')
  const [options, setOptions] = useState<PatternItem[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [correctIndex, setCorrectIndex] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [questionNumber, setQuestionNumber] = useState(0)
  const totalQuestions = currentDifficulty === 'easy' ? 5 : currentDifficulty === 'medium' ? 8 : 10

  const getShapeComponent = (item: PatternItem, index?: number) => {
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
            className={`${sizeClass}`}
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

    const length = currentDifficulty === 'easy' ? 3 : currentDifficulty === 'medium' ? 4 : 5
    const newPattern: PatternItem[] = []

    // Start with random items
    for (let i = 0; i < length; i++) {
      newPattern.push({
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: SIZES[Math.floor(Math.random() * SIZES.length)],
        position: POSITIONS[Math.floor(Math.random() * POSITIONS.length)],
      })
    }

    // Apply pattern
    const baseIndex = Math.floor(Math.random() * (newPattern.length - 1))
    const nextIndex = baseIndex + 1

    // Determine the pattern and apply it
    const cycle = (arr: any[], index: number) => arr[(index + 1) % arr.length]

    switch (type) {
      case 'color':
        newPattern[nextIndex].color = cycle(COLORS, COLORS.indexOf(newPattern[baseIndex].color))
        break
      case 'shape':
        newPattern[nextIndex].shape = cycle(SHAPES, SHAPES.indexOf(newPattern[baseIndex].shape))
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
          newPattern[i].color = cycle(COLORS, COLORS.indexOf(newPattern[i - 1].color))
          break
        case 'shape':
          newPattern[i].shape = cycle(SHAPES, SHAPES.indexOf(newPattern[i - 1].shape))
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
  }, [currentDifficulty])

  const generateOptions = useCallback((correctItem: PatternItem, type: PatternType): PatternItem[] => {
    const options: PatternItem[] = [correctItem]

    while (options.length < 4) {
      const wrongItem = { ...correctItem }

      switch (type) {
        case 'color':
          wrongItem.color = COLORS[Math.floor(Math.random() * COLORS.length)]
          break
        case 'shape':
          wrongItem.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
          break
        case 'size':
          wrongItem.size = SIZES[Math.floor(Math.random() * SIZES.length)]
          break
        case 'position':
          wrongItem.position = POSITIONS[Math.floor(Math.random() * POSITIONS.length)]
          break
      }

      // Check if this option already exists
      const exists = options.some(
        opt =>
          opt.shape === wrongItem.shape &&
          opt.color === wrongItem.color &&
          opt.size === wrongItem.size &&
          opt.position === wrongItem.position
      )

      if (!exists && wrongItem.color !== correctItem.color && wrongItem.shape !== correctItem.shape &&
          wrongItem.size !== correctItem.size && wrongItem.position !== correctItem.position) {
        options.push(wrongItem)
      }
    }

    // Shuffle options
    return options.sort(() => Math.random() - 0.5)
  }, [])

  const getNextItem = (pattern: PatternItem[], type: PatternType): PatternItem => {
    const lastItem = pattern[pattern.length - 1]
    const cycle = (arr: any[], index: number) => arr[(index + 1) % arr.length]

    const nextItem = { ...lastItem }

    switch (type) {
      case 'color':
        nextItem.color = cycle(COLORS, COLORS.indexOf(lastItem.color))
        break
      case 'shape':
        nextItem.shape = cycle(SHAPES, SHAPES.indexOf(lastItem.shape))
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
    setScore(0)
    setQuestionNumber(0)
    startQuestion()
    setGameState('playing')
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
      setScore(prev => prev + 1)
    }

    setTimeout(() => {
      if (questionNumber + 1 >= totalQuestions) {
        addSession({
          id: Date.now().toString(),
          gameId: 'pattern-recognition',
          difficulty: currentDifficulty,
          score: score + (isCorrect ? 1 : 0),
          completedAt: new Date(),
          durationSeconds: 60
        })
        setGameState('result')
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
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          href="/pattern"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 text-lg"
        >
          <span className="mr-2">←</span> {t('back')}
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
          {t('patternRecognition.title', 'Pattern Recognition')}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {t('patternRecognition.description', 'Identify the pattern and find what comes next!')}
        </p>

        {/* Score display */}
        {gameState !== 'menu' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex justify-around text-center">
              <div>
                <p className="text-gray-600 text-lg mb-1">{t('patternRecognition.question', 'Question')}</p>
                <p className="text-4xl font-bold text-cyan-600">
                  {questionNumber + 1}/{totalQuestions}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-lg mb-1">{t('patternRecognition.score', 'Score')}</p>
                <p className="text-4xl font-bold text-amber-600">
                  {score}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Game Area */}
        {gameState === 'playing' && (
          <>
            {/* Pattern display */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {t('patternRecognition.completeThePattern', 'Complete the pattern:')}
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
                {t('patternRecognition.whatsNext', 'What comes next?')}
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
                  {selectedIndex === correctIndex
                    ? t('patternRecognition.correct', 'Correct!')
                    : t('patternRecognition.incorrect', 'Incorrect')}
                </p>
                <p className="text-lg">
                  {getPatternExplanation(patternType)}
                </p>
              </motion.div>
            )}
          </>
        )}

        {/* Menu */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t('patternRecognition.ready', 'Ready to test your pattern recognition?')}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {t('patternRecognition.instructions', 'Watch the sequence and identify what comes next!')}
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-cyan-500 to-amber-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-cyan-600 hover:to-amber-600 shadow-lg transition-all"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Results */}
        {gameState === 'result' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t('patternRecognition.results', 'Results')}
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              {t('patternRecognition.finalScore', 'Your score:')}
            </p>
            <p className="text-6xl font-bold text-cyan-600 mb-4">
              {score}/{totalQuestions}
            </p>
            <p className="text-2xl text-gray-700 mb-6">
              {t('patternRecognition.accuracy', 'Accuracy')}: {Math.round((score / totalQuestions) * 100)}%
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-cyan-500 to-amber-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-cyan-600 hover:to-amber-600 shadow-lg transition-all"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
