'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

import { SettingsPanel } from "@/components/SettingsPanel"
const MAX_LEVELS = 30

type Target = {
  id: number
  x: number
  y: number
  isTarget: boolean
  appearedAt: number
}

const LEVEL_SETTINGS = [
  // Levels 1-5: Easy introduction
  { targetCount: 5, displayTime: 2000, inputTime: 10, difficulty: 'easy' },    // Level 1
  { targetCount: 6, displayTime: 1900, inputTime: 12, difficulty: 'easy' },    // Level 2
  { targetCount: 7, displayTime: 1800, inputTime: 14, difficulty: 'easy' },    // Level 3
  { targetCount: 8, displayTime: 1700, inputTime: 16, difficulty: 'easy' },    // Level 4
  { targetCount: 9, displayTime: 1600, inputTime: 18, difficulty: 'easy' },    // Level 5

  // Levels 6-10: Medium challenge
  { targetCount: 10, displayTime: 1500, inputTime: 20, difficulty: 'medium' },  // Level 6
  { targetCount: 11, displayTime: 1400, inputTime: 22, difficulty: 'medium' },  // Level 7
  { targetCount: 12, displayTime: 1300, inputTime: 24, difficulty: 'medium' },  // Level 8
  { targetCount: 13, displayTime: 1250, inputTime: 26, difficulty: 'medium' },  // Level 9
  { targetCount: 14, displayTime: 1200, inputTime: 28, difficulty: 'medium' },  // Level 10

  // Levels 11-15: Harder progression
  { targetCount: 15, displayTime: 1150, inputTime: 30, difficulty: 'hard' },   // Level 11
  { targetCount: 16, displayTime: 1100, inputTime: 32, difficulty: 'hard' },    // Level 12
  { targetCount: 17, displayTime: 1050, inputTime: 34, difficulty: 'hard' },    // Level 13
  { targetCount: 18, displayTime: 1000, inputTime: 36, difficulty: 'hard' },   // Level 14
  { targetCount: 19, displayTime: 950, inputTime: 38, difficulty: 'hard' },   // Level 15

  // Levels 16-20: Advanced challenge
  { targetCount: 20, displayTime: 900, inputTime: 40, difficulty: 'hard' },    // Level 16
  { targetCount: 21, displayTime: 850, inputTime: 42, difficulty: 'hard' },   // Level 17
  { targetCount: 22, displayTime: 800, inputTime: 44, difficulty: 'hard' },  // Level 18
  { targetCount: 23, displayTime: 750, inputTime: 46, difficulty: 'hard' },  // Level 19
  { targetCount: 24, displayTime: 700, inputTime: 48, difficulty: 'hard' },   // Level 20

  // Levels 21-25: Expert level
  { targetCount: 25, displayTime: 680, inputTime: 50, difficulty: 'expert' }, // Level 21
  { targetCount: 26, displayTime: 660, inputTime: 52, difficulty: 'expert' }, // Level 22
  { targetCount: 27, displayTime: 640, inputTime: 54, difficulty: 'expert' }, // Level 23
  { targetCount: 28, displayTime: 620, inputTime: 56, difficulty: 'expert' }, // Level 24
  { targetCount: 29, displayTime: 600, inputTime: 58, difficulty: 'expert' }, // Level 25

  // Levels 26-30: Master level
  { targetCount: 30, displayTime: 580, inputTime: 60, difficulty: 'expert' }, // Level 26
  { targetCount: 31, displayTime: 560, inputTime: 62, difficulty: 'expert' }, // Level 27
  { targetCount: 32, displayTime: 540, inputTime: 64, difficulty: 'expert' }, // Level 28
  { targetCount: 33, displayTime: 520, inputTime: 66, difficulty: 'expert' }, // Level 29
  { targetCount: 35, displayTime: 500, inputTime: 68, difficulty: 'expert' }, // Level 30
]

const TARGET_COLOR = 'bg-red-500'
const DISTRACTOR_COLORS = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-orange-500']

export default function TargetDetectionPage() {
  const { t } = useTranslation()
  const { addSession } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'showing' | 'input' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [targets, setTargets] = useState<Target[]>([])
  const [clickedTargets, setClickedTargets] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [correctClicks, setCorrectClicks] = useState(0)
  const [missedClicks, setMissedClicks] = useState(0)

  const settings = LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)]

  const getLevelScore = (correct: number, missed: number) => {
    const baseScore = correct * 100
    const missPenalty = missed * 50
    const timeBonus = timeLeft * 20
    return Math.max(0, baseScore - missPenalty + timeBonus)
  }

  const generateTargets = () => {
    const newTargets: Target[] = []
    const targetIndex = Math.floor(Math.random() * settings.targetCount)

    for (let i = 0; i < settings.targetCount; i++) {
      const margin = 5
      const x = margin + Math.random() * (100 - margin * 2)
      const y = margin + Math.random() * (100 - margin * 2)

      newTargets.push({
        id: i,
        x,
        y,
        isTarget: i === targetIndex,
        appearedAt: Date.now()
      })
    }

    return newTargets
  }

  const startGame = () => {
    setScore(0)
    setTotalScore(0)
    setLevel(1)
    startLevel()
  }

  const startLevel = () => {
    const newTargets = generateTargets()
    setTargets(newTargets)
    setClickedTargets([])
    setCorrectClicks(0)
    setMissedClicks(0)
    setTimeLeft(settings.inputTime)
    setGameState('showing')

    setTimeout(() => {
      setGameState('input')
    }, settings.displayTime)
  }

  const handleTargetClick = useCallback((target: Target) => {
    if (gameState !== 'input' || clickedTargets.includes(target.id)) return

    if (target.isTarget) {
      setCorrectClicks(prev => prev + 1)
    } else {
      setMissedClicks(prev => prev + 1)
    }

    setClickedTargets(prev => [...prev, target.id])

    // Check if all targets clicked or correct target found
    const actualTargets = targets.filter(t => t.isTarget)
    if (clickedTargets.length + 1 >= actualTargets.length) {
      const levelScore = Math.round(getLevelScore(
        correctClicks + (target.isTarget ? 1 : 0),
        missedClicks + (target.isTarget ? 0 : 1)
      ))
      setScore(levelScore)
      setGameState('levelComplete')
    }
  }, [gameState, clickedTargets, targets, correctClicks, missedClicks])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (gameState === 'input' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (gameState === 'input' && timeLeft === 0) {
      const levelScore = Math.round(getLevelScore(correctClicks, missedClicks))
      setScore(levelScore)
      setGameState('levelComplete')
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [gameState, timeLeft, correctClicks, missedClicks])

  const nextLevel = () => {
    const levelScore = score
    setTotalScore(prev => prev + levelScore)

    if (level >= MAX_LEVELS) {
      addSession({
        id: Date.now().toString(),
        gameId: 'target-detection',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 p-4 md:p-8">
      <SettingsPanel />
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link
          href="/reaction"
          className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium mb-6 text-lg"
        >
          <span className="mr-2">←</span> {t('back', 'Back')}
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          {t('targetDetection.title', 'Target Detection')}
        </h1>
        <p className="text-lg text-gray-700 font-medium mb-8">
          {t('targetDetection.description', 'Find the red target as fast as you can!')}
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
                Total Score: <span className="text-red-600 font-bold">{totalScore}</span>
              </p>
            )}
            <div className="bg-red-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 mb-2">{t('targetDetection.levelInfo', 'Level Settings')}:</h3>
              <ul className="text-gray-700 space-y-1 font-medium">
                <li>• {t('targetDetection.targetCount', 'Target Count')}: {settings.targetCount}</li>
                <li>• {t('targetDetection.displayTime', 'Display Time')}: {settings.displayTime}ms</li>
                <li>• {t('targetDetection.inputTime', 'Time Limit')}: {settings.inputTime}s</li>
              </ul>
            </div>
            <button
              onClick={startLevel}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-red-600 hover:to-orange-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Showing targets */}
        {gameState === 'showing' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-xl text-gray-600 mb-4 font-medium">
              {t('targetDetection.memorize', 'Watch carefully!')}
            </p>
            <div className="relative w-full aspect-square bg-gradient-to-br from-red-100 to-orange-100 rounded-xl overflow-hidden">
              <AnimatePresence>
                {targets.map((target, index) => (
                  <motion.button
                    key={target.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`absolute w-10 h-10 md:w-12 md:h-12 rounded-full ${target.isTarget ? TARGET_COLOR : DISTRACTOR_COLORS[index % DISTRACTOR_COLORS.length]} cursor-pointer`}
                    style={{
                      left: `${target.x}%`,
                      top: `${target.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
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
                  <p className="text-gray-700 text-sm font-medium">{t('targetDetection.level', 'Level')}</p>
                  <p className="text-3xl font-bold text-red-600">{level}/{MAX_LEVELS}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('targetDetection.score', 'Score')}</p>
                  <p className="text-3xl font-bold text-orange-600">{totalScore}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('targetDetection.timeLeft', 'Time Left')}</p>
                  <p className={`text-4xl font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-red-600'}`}>
                    {timeLeft}s
                  </p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((level - 1) / MAX_LEVELS) * 100}%` }}
                  className="bg-gradient-to-r from-red-500 to-orange-500 h-full"
                />
              </div>
            </div>

            {/* Click area */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
              <p className="text-xl text-gray-600 mb-4 font-medium">
                {t('targetDetection.clickTarget', 'Click the red target!')}
              </p>
              <div className="relative w-full aspect-square bg-gradient-to-br from-red-100 to-orange-100 rounded-xl overflow-hidden">
                {targets.map((target) => {
                  const isClicked = clickedTargets.includes(target.id)
                  return (
                    <motion.button
                      key={target.id}
                      onClick={() => handleTargetClick(target)}
                      disabled={isClicked}
                      whileTap={{ scale: 0.9 }}
                      className={`absolute w-10 h-10 md:w-12 md:h-12 rounded-full transition-all ${
                        isClicked
                          ? target.isTarget
                            ? 'bg-green-500 opacity-50'
                            : 'bg-gray-400 opacity-30'
                          : target.isTarget
                            ? TARGET_COLOR + ' hover:scale-110'
                            : DISTRACTOR_COLORS[target.id % DISTRACTOR_COLORS.length] + ' hover:scale-110'
                      } ${!isClicked ? 'cursor-pointer' : 'cursor-default'}`}
                      style={{
                        left: `${target.x}%`,
                        top: `${target.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      {isClicked && target.isTarget && <span className="text-white font-bold text-xl">✓</span>}
                      {isClicked && !target.isTarget && <span className="text-white font-bold text-xl">✗</span>}
                    </motion.button>
                  )
                })}
              </div>
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
            <div className="text-6xl mb-4">
              {score > 0 ? '✅' : '❌'}
            </div>
            <h2 className={`text-4xl font-bold mb-4 ${score > 0 ? 'text-red-600' : 'text-red-500'}`}>
              {score > 0 ? `Level ${level} Complete!` : 'Level Failed!'}
            </h2>
            {score > 0 ? (
              <div className="bg-red-50 rounded-xl p-6 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-700 text-sm font-medium">{t('targetDetection.correctClicks', 'Correct')}</p>
                    <p className="text-3xl font-bold text-green-600">{correctClicks}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 text-sm font-medium">{t('targetDetection.missedClicks', 'Missed')}</p>
                    <p className="text-3xl font-bold text-red-600">{missedClicks}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-gray-700 text-sm font-medium">{t('targetDetection.levelScore', 'Level Score')}</p>
                    <p className="text-3xl font-bold text-red-600">{score}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 text-sm font-medium">{t('targetDetection.totalScore', 'Total Score')}</p>
                    <p className="text-3xl font-bold text-orange-600">{totalScore + score}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 rounded-xl p-6 mb-6">
                <p className="text-gray-700 text-sm font-medium">{t('targetDetection.levelScore', 'Level Score')}</p>
                <p className="text-3xl font-bold text-red-600">{score}</p>
              </div>
            )}
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-red-600 hover:to-orange-600 shadow-lg transition-all w-full mb-3"
            >
              {level < MAX_LEVELS ? `Next Level ${level + 1}` : 'View Final Score'}
            </button>
            <button
              onClick={startGame}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              {t('targetDetection.restart', 'Restart from Level 1')}
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
            <h2 className="text-4xl font-bold text-red-600 mb-4">{t('targetDetection.victory', 'Congratulations!')}</h2>
            <p className="text-xl text-gray-700 font-medium mb-6">
              {t('targetDetection.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className="bg-red-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 text-sm font-medium">{t('targetDetection.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-red-600">{totalScore + score}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-red-600 hover:to-orange-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
