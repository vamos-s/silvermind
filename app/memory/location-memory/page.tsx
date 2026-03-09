'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'
import { LOCATION_MEMORY_LEVELS } from '@/lib/game-data/levels'
import { ICONS } from '@/lib/game-data/icons'

const MAX_LEVELS = 30

type LocationItem = {
  id: number
  x: number
  y: number
  icon: string
}

const ALL_ICONS = ICONS.all

export default function LocationMemoryPage() {
  const { t } = useTranslation()
  const { addSession } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'showing' | 'input' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [items, setItems] = useState<LocationItem[]>([])
  const [selectedItems, setSelectedItems] = useState<LocationItem[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)

  const settings = useMemo(
    () => LOCATION_MEMORY_LEVELS[Math.min(level - 1, LOCATION_MEMORY_LEVELS.length - 1)],
    [level]
  )

  const getLevelScore = useCallback((correct: number) => {
    const baseScore = correct * 150
    const timeBonus = timeLeft * 10
    return baseScore + timeBonus
  }, [timeLeft])

  const generateItems = useCallback(() => {
    const newItems: LocationItem[] = []
    const shuffledIcons = [...ALL_ICONS].sort(() => Math.random() - 0.5)

    for (let i = 0; i < settings.itemCount; i++) {
      const margin = 10
      const x = margin + Math.random() * (100 - margin * 2)
      const y = margin + Math.random() * (100 - margin * 2)

      newItems.push({
        id: i,
        x,
        y,
        icon: shuffledIcons[i]
      })
    }

    return newItems
  }, [settings.itemCount])

  const startLevel = useCallback(() => {
    const newItems = generateItems()
    setItems(newItems)
    setSelectedItems([])
    setTimeLeft(settings.inputTime)
    setGameState('showing')

    setTimeout(() => {
      setGameState('input')
    }, settings.displayTime)
  }, [generateItems, settings.inputTime, settings.displayTime])

  const startGame = useCallback(() => {
    setScore(0)
    setTotalScore(0)
    setLevel(1)
    startLevel()
  }, [startLevel])

  const handleItemClick = useCallback((item: LocationItem) => {
    if (gameState !== 'input') return

    setSelectedItems(prev => {
      const isSelected = prev.some(si => si.id === item.id)

      if (isSelected) {
        return prev.filter(si => si.id !== item.id)
      } else if (prev.length < settings.itemCount) {
        return [...prev, item]
      }
      return prev
    })
  }, [gameState, settings.itemCount])

  const handleSubmit = useCallback(() => {
    const correct = selectedItems.filter(selected => {
      const original = items.find(item => item.id === selected.id)
      if (!original) return false

      const distance = Math.sqrt(
        Math.pow(selected.x - original.x, 2) +
        Math.pow(selected.y - original.y, 2)
      )

      return distance < 15 // Within 15% tolerance
    }).length

    setCorrectCount(correct)
    const levelScore = Math.round(getLevelScore(correct))
    setScore(levelScore)
    setGameState('levelComplete')
  }, [selectedItems, items, getLevelScore])

  const nextLevel = useCallback(() => {
    const levelScore = score
    setTotalScore(prev => prev + levelScore)

    if (level >= MAX_LEVELS) {
      addSession({
        id: Date.now().toString(),
        gameId: 'location-memory',
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
  }, [score, level, totalScore, startLevel, addSession])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (gameState === 'input' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (gameState === 'input' && timeLeft === 0) {
      handleSubmit()
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [gameState, timeLeft])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link
          href="/memory"
          className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium mb-6 text-lg"
        >
          <span className="mr-2">←</span> {t('back', 'Back')}
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          {t('locationMemory.title', 'Location Memory')}
        </h1>
        <p className="text-lg text-gray-700 font-medium mb-8">
          {t('locationMemory.description', 'Remember where items are located!')}
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
                Total Score: <span className="text-emerald-600 font-bold">{totalScore}</span>
              </p>
            )}
            <div className="bg-emerald-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 mb-2">{t('locationMemory.levelInfo', 'Level Settings')}:</h3>
              <ul className="text-gray-700 space-y-1 font-medium">
                <li>• {t('locationMemory.itemCount', 'Item Count')}: {settings.itemCount}</li>
                <li>• {t('locationMemory.displayTime', 'Display Time')}: {settings.displayTime / 1000}s</li>
                <li>• {t('locationMemory.inputTime', 'Input Time')}: {settings.inputTime}s</li>
              </ul>
            </div>
            <button
              onClick={startLevel}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-emerald-600 hover:to-teal-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Showing items */}
        {gameState === 'showing' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-xl text-gray-600 mb-4 font-medium">
              {t('locationMemory.memorize', 'Memorize the locations!')}
            </p>
            <div className="relative w-full aspect-square bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl overflow-hidden">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="absolute text-3xl md:text-4xl cursor-default select-none"
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {item.icon}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Input phase */}
        {gameState === 'input' && (
          <>
            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('locationMemory.level', 'Level')}</p>
                  <p className="text-3xl font-bold text-emerald-600">{level}/{MAX_LEVELS}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('locationMemory.score', 'Score')}</p>
                  <p className="text-3xl font-bold text-teal-600">{totalScore}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('locationMemory.timeLeft', 'Time Left')}</p>
                  <p className={`text-4xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-emerald-600'}`}>
                    {timeLeft}s
                  </p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((level - 1) / MAX_LEVELS) * 100}%` }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full"
                />
              </div>
            </div>

            {/* Click area */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
              <p className="text-xl text-gray-600 mb-4 font-medium">
                {t('locationMemory.clickLocations', 'Click where items were located!')}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                {t('locationMemory.selected', 'Selected')}: {selectedItems.length}/{settings.itemCount}
              </p>
              <div
                className="relative w-full aspect-square bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl overflow-hidden cursor-crosshair"
                onClick={(e) => {
                  if (gameState !== 'input' || selectedItems.length >= settings.itemCount) return

                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = ((e.clientX - rect.left) / rect.width) * 100
                  const y = ((e.clientY - rect.top) / rect.height) * 100

                  const originalItem = items[selectedItems.length]
                  if (!originalItem) return

                  setSelectedItems(prev => [...prev, {
                    ...originalItem,
                    x,
                    y
                  }])
                }}
              >
                <AnimatePresence>
                  {selectedItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleItemClick(item)
                      }}
                      className="absolute text-3xl md:text-4xl cursor-pointer"
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      {item.icon}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <button
                onClick={handleSubmit}
                className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-2xl font-bold py-4 rounded-xl hover:from-emerald-600 hover:to-teal-600 shadow-lg transition-all"
              >
                {t('locationMemory.submit', 'Submit')}
              </button>
            </div>
          </>
        )}

        {/* Level Complete */}
        {gameState === 'levelComplete' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-4xl font-bold text-emerald-600 mb-4">Level {level} Complete!</h2>
            <div className="bg-emerald-50 rounded-xl p-6 mb-6">
              <div className="text-center mb-4">
                <p className="text-6xl font-bold text-emerald-600 mb-2">
                  {correctCount}/{items.length}
                </p>
                <p className="text-xl text-gray-600">
                  {t('locationMemory.correctLocations', 'Correct locations')}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('locationMemory.levelScore', 'Level Score')}</p>
                  <p className="text-3xl font-bold text-emerald-600">{score}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('locationMemory.totalScore', 'Total Score')}</p>
                  <p className="text-3xl font-bold text-teal-600">{totalScore + score}</p>
                </div>
              </div>
            </div>
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-emerald-600 hover:to-teal-600 shadow-lg transition-all w-full mb-3"
            >
              {level < MAX_LEVELS ? `Next Level ${level + 1}` : 'View Final Score'}
            </button>
            <button
              onClick={startGame}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              {t('locationMemory.restart', 'Restart from Level 1')}
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
            <h2 className="text-4xl font-bold text-emerald-600 mb-4">{t('locationMemory.victory', 'Congratulations!')}</h2>
            <p className="text-xl text-gray-700 font-medium mb-6">
              {t('locationMemory.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className="bg-emerald-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 text-sm font-medium">{t('locationMemory.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-emerald-600">{totalScore + score}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-emerald-600 hover:to-teal-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
