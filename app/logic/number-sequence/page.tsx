'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

import { SettingsPanel } from "@/components/SettingsPanel"
const MAX_LEVELS = 30

type SequenceType = 'arithmetic' | 'geometric' | 'fibonacci' | 'prime' | 'square'

const LEVEL_SETTINGS = [
  // Levels 1-5: Easy introduction
  { sequenceLength: 5, inputTime: 25, difficulty: 'easy', type: 'arithmetic' as SequenceType },    // Level 1
  { sequenceLength: 5, inputTime: 23, difficulty: 'easy', type: 'arithmetic' as SequenceType },    // Level 2
  { sequenceLength: 6, inputTime: 28, difficulty: 'easy', type: 'arithmetic' as SequenceType },    // Level 3
  { sequenceLength: 6, inputTime: 26, difficulty: 'easy', type: 'geometric' as SequenceType },    // Level 4
  { sequenceLength: 7, inputTime: 30, difficulty: 'easy', type: 'geometric' as SequenceType },    // Level 5

  // Levels 6-10: Medium challenge
  { sequenceLength: 7, inputTime: 28, difficulty: 'medium', type: 'fibonacci' as SequenceType },  // Level 6
  { sequenceLength: 8, inputTime: 32, difficulty: 'medium', type: 'fibonacci' as SequenceType },  // Level 7
  { sequenceLength: 8, inputTime: 30, difficulty: 'medium', type: 'prime' as SequenceType },  // Level 8
  { sequenceLength: 9, inputTime: 34, difficulty: 'medium', type: 'prime' as SequenceType },  // Level 9
  { sequenceLength: 9, inputTime: 32, difficulty: 'medium', type: 'square' as SequenceType },  // Level 10

  // Levels 11-15: Harder progression
  { sequenceLength: 10, inputTime: 36, difficulty: 'hard', type: 'arithmetic' as SequenceType },   // Level 11
  { sequenceLength: 10, inputTime: 34, difficulty: 'hard', type: 'geometric' as SequenceType },    // Level 12
  { sequenceLength: 11, inputTime: 38, difficulty: 'hard', type: 'fibonacci' as SequenceType },    // Level 13
  { sequenceLength: 11, inputTime: 36, difficulty: 'hard', type: 'prime' as SequenceType },   // Level 14
  { sequenceLength: 12, inputTime: 40, difficulty: 'hard', type: 'square' as SequenceType },   // Level 15

  // Levels 16-20: Advanced challenge
  { sequenceLength: 12, inputTime: 38, difficulty: 'hard', type: 'arithmetic' as SequenceType },    // Level 16
  { sequenceLength: 13, inputTime: 42, difficulty: 'hard', type: 'geometric' as SequenceType },  // Level 17
  { sequenceLength: 13, inputTime: 40, difficulty: 'hard', type: 'fibonacci' as SequenceType },  // Level 18
  { sequenceLength: 14, inputTime: 44, difficulty: 'hard', type: 'prime' as SequenceType },  // Level 19
  { sequenceLength: 14, inputTime: 42, difficulty: 'hard', type: 'square' as SequenceType },   // Level 20

  // Levels 21-25: Expert level
  { sequenceLength: 15, inputTime: 46, difficulty: 'expert', type: 'arithmetic' as SequenceType }, // Level 21
  { sequenceLength: 15, inputTime: 44, difficulty: 'expert', type: 'geometric' as SequenceType }, // Level 22
  { sequenceLength: 16, inputTime: 48, difficulty: 'expert', type: 'fibonacci' as SequenceType }, // Level 23
  { sequenceLength: 16, inputTime: 46, difficulty: 'expert', type: 'prime' as SequenceType }, // Level 24
  { sequenceLength: 17, inputTime: 50, difficulty: 'expert', type: 'square' as SequenceType }, // Level 25

  // Levels 26-30: Master level
  { sequenceLength: 17, inputTime: 48, difficulty: 'expert', type: 'arithmetic' as SequenceType }, // Level 26
  { sequenceLength: 18, inputTime: 52, difficulty: 'expert', type: 'geometric' as SequenceType }, // Level 27
  { sequenceLength: 18, inputTime: 50, difficulty: 'expert', type: 'fibonacci' as SequenceType }, // Level 28
  { sequenceLength: 19, inputTime: 54, difficulty: 'expert', type: 'prime' as SequenceType }, // Level 29
  { sequenceLength: 19, inputTime: 52, difficulty: 'expert', type: 'square' as SequenceType }, // Level 30
]

const generateSequence = (type: SequenceType, length: number): { sequence: number[]; next: number } => {
  let sequence: number[] = []

  switch (type) {
    case 'arithmetic':
      const start = Math.floor(Math.random() * 20) + 1
      const diff = Math.floor(Math.random() * 10) + 1
      sequence = Array.from({ length }, (_, i) => start + diff * i)
      return { sequence, next: start + diff * length }

    case 'geometric':
      const gStart = Math.floor(Math.random() * 5) + 2
      const ratio = Math.floor(Math.random() * 3) + 2
      sequence = Array.from({ length }, (_, i) => gStart * Math.pow(ratio, i))
      return { sequence, next: gStart * Math.pow(ratio, length) }

    case 'fibonacci':
      sequence = [1, 1]
      for (let i = 2; i < length; i++) {
        sequence.push(sequence[i - 1] + sequence[i - 2])
      }
      return { sequence, next: sequence[length - 1] + sequence[length - 2] }

    case 'prime':
      const primes: number[] = []
      let num = 2
      while (primes.length < length + 1) {
        let isPrime = true
        for (let i = 2; i <= Math.sqrt(num); i++) {
          if (num % i === 0) {
            isPrime = false
            break
          }
        }
        if (isPrime) {
          primes.push(num)
        }
        num++
      }
      sequence = primes.slice(0, length)
      return { sequence, next: primes[length] }

    case 'square':
      sequence = Array.from({ length }, (_, i) => (i + 1) * (i + 1))
      return { sequence, next: (length + 1) * (length + 1) }

    default:
      return { sequence: [1, 2, 3, 4, 5], next: 6 }
  }
}

export default function NumberSequencePage() {
  const { t } = useTranslation()
  const { addSession, darkMode } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'showing' | 'input' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [sequence, setSequence] = useState<number[]>([])
  const [correctAnswer, setCorrectAnswer] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)

  const settings = useMemo(
    () => LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)],
    [level]
  )

  const getLevelScore = useCallback((correct: boolean) => {
    if (!correct) return 0
    const baseScore = 250 + (level * 20)
    const timeBonus = timeLeft * 10
    return baseScore + timeBonus
  }, [level, timeLeft])

  const startLevel = useCallback(() => {
    const { sequence: newSequence, next } = generateSequence(settings.type, settings.sequenceLength)
    setSequence(newSequence)
    setCorrectAnswer(next)
    setUserInput('')
    setTimeLeft(settings.inputTime)
    setGameState('showing')

    setTimeout(() => {
      setGameState('input')
    }, 2000)
  }, [settings.type, settings.sequenceLength, settings.inputTime])

  const startGame = useCallback(() => {
    setScore(0)
    setTotalScore(0)
    setLevel(1)
    startLevel()
  }, [startLevel])

  const handleSubmit = useCallback(() => {
    const isCorrect = parseInt(userInput) === correctAnswer
    const levelScore = Math.round(getLevelScore(isCorrect))
    setScore(levelScore)
    setGameState('levelComplete')
  }, [userInput, correctAnswer, getLevelScore])

  const nextLevel = useCallback(() => {
    const levelScore = score
    setTotalScore(prev => prev + levelScore)

    if (level >= MAX_LEVELS) {
      addSession({
        id: Date.now().toString(),
        gameId: 'number-sequence',
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
    <div className={`min-h-screen p-3 md:p-4 lg:p-8 transition-colors duration-300 ${darkMode ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" : "bg-gradient-to-br from-teal-50 via-white to-cyan-50"}`}
      <SettingsPanel />
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link
          href="/logic"
          className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium mb-6 text-sm md:text-base lg:text-lg"
        >
          <span className="mr-2">←</span> {t('back', 'Back')}
        </Link>

        <h1 className="text-3xl md:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2">
          {t('numberSequence.title', 'Number Sequence')}
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-8">
          {t('numberSequence.description', 'Find the next number in the sequence!')}
        </p>

        {/* Menu */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Level {level}
            </h2>
            {level > 1 && (
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 font-medium">
                Total Score: <span className="text-teal-600 font-bold">{totalScore}</span>
              </p>
            )}
            <div className="bg-teal-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">{t('numberSequence.levelInfo', 'Level Settings')}:</h3>
              <ul className="text-gray-700 dark:text-gray-300 space-y-1 font-medium">
                <li>• {t('numberSequence.type', 'Type')}: {settings.type}</li>
                <li>• {t('numberSequence.sequenceLength', 'Sequence Length')}: {settings.sequenceLength}</li>
                <li>• {t('numberSequence.inputTime', 'Time Limit')}: {settings.inputTime}s</li>
              </ul>
            </div>
            <button
              onClick={startLevel}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-teal-600 hover:to-cyan-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Showing sequence */}
        {gameState === 'showing' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 font-medium">
              {t('numberSequence.memorize', 'Memorize the pattern!')}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              <AnimatePresence>
                {sequence.map((num, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.15 }}
                    className="px-4 py-3 bg-gradient-to-br from-teal-100 to-cyan-100 text-teal-800 rounded-xl font-bold text-xl"
                  >
                    {num}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Input phase */}
        {gameState === 'input' && (
          <>
            {/* Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('numberSequence.level', 'Level')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-teal-600">{level}/{MAX_LEVELS}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('numberSequence.score', 'Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-cyan-600">{totalScore}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('numberSequence.timeLeft', 'Time Left')}</p>
                  <p className={`text-2xl md:text-3xl lg:text-4xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-teal-600'}`}>
                    {timeLeft}s
                  </p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((level - 1) / MAX_LEVELS) * 100}%` }}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full"
                />
              </div>
            </div>

            {/* Input area */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-6 text-center">
              <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-4">
                {t('numberSequence.nextNumber', 'What comes next?')}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {sequence.map((num, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium"
                  >
                    {num}
                  </span>
                ))}
                <span className="px-3 py-2 border-2 border-dashed border-gray-300 dark:border-gray-500 text-gray-400 rounded-lg">
                  ?
                </span>
              </div>
              <input
                type="number"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={t('numberSequence.placeholder', 'Enter the next number')}
                className="w-full p-6 text-2xl border-4 border-gray-300 dark:border-gray-500 rounded-xl focus:border-teal-300 focus:outline-none mb-6 text-center text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:border-gray-600"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit()
                  }
                }}
              />
              <motion.button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 rounded-xl hover:from-teal-600 hover:to-cyan-600 shadow-lg transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('numberSequence.submit', 'Submit')}
              </motion.button>
            </div>
          </>
        )}

        {/* Level Complete */}
        {gameState === 'levelComplete' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">
              {score > 0 ? '✅' : '❌'}
            </div>
            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ${score > 0 ? 'text-teal-600' : 'text-red-600'}`}>
              {score > 0 ? `Level ${level} Complete!` : 'Level Failed!'}
            </h2>
            {score > 0 ? (
              <div className="bg-teal-50 rounded-xl p-6 mb-6">
                <p className="text-gray-700 dark:text-gray-300 mb-2">{t('numberSequence.correctAnswer', 'Correct Answer')}:</p>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-teal-600">{correctAnswer}</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('numberSequence.levelScore', 'Level Score')}</p>
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-teal-600">{score}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('numberSequence.totalScore', 'Total Score')}</p>
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-cyan-600">{totalScore + score}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 rounded-xl p-6 mb-6">
                <p className="text-gray-700 dark:text-gray-300 mb-2">{t('numberSequence.yourAnswer', 'Your Answer')}:</p>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-red-600">{userInput || '---'}</p>
                <p className="text-gray-700 dark:text-gray-300 mt-4">{t('numberSequence.correctAnswer', 'Correct Answer')}:</p>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-green-600">{correctAnswer}</p>
              </div>
            )}
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-teal-600 hover:to-cyan-600 shadow-lg transition-all w-full mb-3"
            >
              {level < MAX_LEVELS ? `Next Level ${level + 1}` : 'View Final Score'}
            </button>
            <button
              onClick={startGame}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:text-white font-medium"
            >
              {t('numberSequence.restart', 'Restart from Level 1')}
            </button>
          </motion.div>
        )}

        {/* Victory */}
        {gameState === 'victory' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-teal-600 mb-4">{t('numberSequence.victory', 'Congratulations!')}</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 font-medium mb-6">
              {t('numberSequence.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className="bg-teal-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('numberSequence.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-teal-600">{totalScore + score}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-teal-600 hover:to-cyan-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
