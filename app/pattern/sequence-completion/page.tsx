'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'
import { SEQUENCE_COMPLETION_LEVELS } from '@/lib/game-data/levels'

import { SettingsPanel } from "@/components/SettingsPanel"
const MAX_LEVELS = 30

export default function SequenceCompletionPage() {
  const { t } = useTranslation()
  const { addSession, darkMode } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'showing' | 'input' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [sequence, setSequence] = useState<string[]>([])
  const [userInput, setUserInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [correctAnswer, setCorrectAnswer] = useState('')

  const settings = useMemo(
    () => SEQUENCE_COMPLETION_LEVELS[Math.min(level - 1, SEQUENCE_COMPLETION_LEVELS.length - 1)],
    [level]
  )

  const getLevelScore = useCallback((correct: boolean) => {
    if (!correct) return 0
    const baseScore = 200 + (level * 20)
    const timeBonus = timeLeft * 8
    return baseScore + timeBonus
  }, [level, timeLeft])

  const generateSequence = useCallback(() => {
    let newSequence: string[] = []

    if (settings.type === 'number') {
      const start = Math.floor(Math.random() * 10) + 1
      const step = Math.floor(Math.random() * 5) + 1
      for (let i = 0; i < settings.sequenceLength; i++) {
        newSequence.push((start + step * i).toString())
      }
      setCorrectAnswer((start + step * settings.sequenceLength).toString())
    } else if (settings.type === 'letter') {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const start = Math.floor(Math.random() * (letters.length - 10))
      const step = Math.floor(Math.random() * 3) + 1
      for (let i = 0; i < settings.sequenceLength; i++) {
        newSequence.push(letters[(start + step * i) % letters.length])
      }
      setCorrectAnswer(letters[(start + step * settings.sequenceLength) % letters.length])
    } else {
      const colors = [
        { name: 'Red', class: 'bg-red-500 text-white' },
        { name: 'Blue', class: 'bg-blue-500 text-white' },
        { name: 'Green', class: 'bg-green-500 text-white' },
        { name: 'Yellow', class: 'bg-yellow-500 text-black' },
        { name: 'Purple', class: 'bg-purple-50 dark:bg-slate-8000 text-white' },
        { name: 'Orange', class: 'bg-orange-50 dark:bg-slate-8000 text-white' },
      ]
      const patternLength = Math.min(3, Math.floor(settings.sequenceLength / 2))
      const pattern = []
      for (let i = 0; i < patternLength; i++) {
        pattern.push(colors[Math.floor(Math.random() * colors.length)])
      }

      for (let i = 0; i < settings.sequenceLength; i++) {
        newSequence.push(pattern[i % patternLength].name)
      }
      setCorrectAnswer(pattern[settings.sequenceLength % patternLength].name)
    }

    return newSequence
  }, [settings.type, settings.sequenceLength])

  const startLevel = useCallback(() => {
    const newSequence = generateSequence()
    setSequence(newSequence)
    setUserInput('')
    setTimeLeft(settings.inputTime)
    setGameState('showing')

    setTimeout(() => {
      setGameState('input')
    }, settings.displayTime)
  }, [generateSequence, settings.inputTime, settings.displayTime])

  const startGame = useCallback(() => {
    setScore(0)
    setTotalScore(0)
    setLevel(1)
    startLevel()
  }, [startLevel])

  const handleSubmit = useCallback(() => {
    const isCorrect = userInput.trim().toLowerCase() === correctAnswer.toLowerCase()
    const levelScore = Math.round(getLevelScore(isCorrect))
    setScore(levelScore)
    setGameState('levelComplete')
  }, [userInput, correctAnswer, getLevelScore])

  const nextLevel = useCallback(() => {
    const levelScore = score

    if (level >= MAX_LEVELS) {
      addSession({
        id: Date.now().toString(),
        gameId: 'sequence-completion',
        difficulty: 'hard',
        score: totalScore + levelScore,
        completedAt: new Date(),
        durationSeconds: 0
      })
      setGameState('victory')
    } else {
      setLevel(prev => prev + 1)
      setTotalScore(prev => prev + levelScore)
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
    <div className={`min-h-screen p-3 md:p-4 lg:p-8 transition-colors duration-300 ${darkMode ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" : "bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4 md:p-8"}`}
      <SettingsPanel />
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link
          href="/pattern"
          className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium mb-6 text-sm md:text-base lg:text-lg"
        >
          <span className="mr-2">←</span> {t('back', 'Back')}
        </Link>

        <h1 className="text-3xl md:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2">
          {t('sequenceCompletion.title', 'Sequence Completion')}
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-8">
          {t('sequenceCompletion.description', 'Find the pattern and complete the sequence!')}
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
                Total Score: <span className="text-amber-600 font-bold">{totalScore}</span>
              </p>
            )}
            <div className="bg-amber-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">{t('sequenceCompletion.levelInfo', 'Level Settings')}:</h3>
              <ul className="text-gray-700 dark:text-gray-300 space-y-1 font-medium">
                <li>• {t('sequenceCompletion.type', 'Type')}: {settings.type.toUpperCase()}</li>
                <li>• {t('sequenceCompletion.sequenceLength', 'Sequence Length')}: {settings.sequenceLength}</li>
                <li>• {t('sequenceCompletion.displayTime', 'Display Time')}: {settings.displayTime / 1000}s</li>
                <li>• {t('sequenceCompletion.inputTime', 'Input Time')}: {settings.inputTime}s</li>
              </ul>
            </div>
            <button
              onClick={startLevel}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-amber-600 hover:to-orange-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Showing sequence */}
        {gameState === 'showing' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 font-medium">
              {t('sequenceCompletion.memorize', 'Memorize the pattern!')}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {sequence.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`px-6 py-4 rounded-xl font-bold text-2xl ${
                    settings.type === 'color'
                      ? ''
                      : 'bg-gradient-to-br from-amber-100 to-orange-100 text-amber-800'
                  }`}
                >
                  {item}
                </motion.div>
              ))}
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
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('sequenceCompletion.level', 'Level')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-amber-600">{level}/{MAX_LEVELS}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('sequenceCompletion.score', 'Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">{totalScore}</p>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('sequenceCompletion.timeLeft', 'Time Left')}</p>
                  <p className={`text-2xl md:text-3xl lg:text-4xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-amber-600'}`}>
                    {timeLeft}s
                  </p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((level - 1) / MAX_LEVELS) * 100}%` }}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full"
                />
              </div>
            </div>

            {/* Input area */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-6 text-center">
              <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-4">
                {t('sequenceCompletion.nextItem', 'What comes next?')}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {sequence.map((item, index) => (
                  <span
                    key={index}
                    className={`px-3 py-2 rounded-lg font-medium ${
                      settings.type === 'color'
                        ? ''
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {item}
                  </span>
                ))}
                <span className="px-3 py-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-500 text-gray-400">
                  ?
                </span>
              </div>
              <motion.input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={t('sequenceCompletion.placeholder', 'Enter the next item')}
                className="w-full p-6 text-2xl border-4 border-gray-300 dark:border-gray-500 rounded-xl focus:border-amber-300 focus:outline-none mb-6 text-center text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:border-gray-600"
                autoFocus
                whileFocus={{ scale: 1.01 }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit()
                  }
                }}
              />
              <motion.button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 rounded-xl hover:from-amber-600 hover:to-orange-600 shadow-lg transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('sequenceCompletion.submit', 'Submit')}
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
            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ${score > 0 ? 'text-amber-600' : 'text-red-600'}`}>
              {score > 0 ? `Level ${level} Complete!` : 'Level Failed!'}
            </h2>
            {score > 0 ? (
              <div className="bg-amber-50 rounded-xl p-6 mb-6">
                <p className="text-gray-700 dark:text-gray-300 mb-2">{t('sequenceCompletion.correctAnswer', 'Correct Answer')}:</p>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-amber-600">{correctAnswer}</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('sequenceCompletion.levelScore', 'Level Score')}</p>
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-amber-600">{score}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('sequenceCompletion.totalScore', 'Total Score')}</p>
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">{totalScore + score}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 rounded-xl p-6 mb-6">
                <p className="text-gray-700 dark:text-gray-300 mb-2">{t('sequenceCompletion.yourAnswer', 'Your Answer')}:</p>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-red-600">{userInput || '---'}</p>
                <p className="text-gray-700 dark:text-gray-300 mt-4">{t('sequenceCompletion.correctAnswer', 'Correct Answer')}:</p>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-green-600">{correctAnswer}</p>
              </div>
            )}
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-amber-600 hover:to-orange-600 shadow-lg transition-all w-full mb-3"
            >
              {level < MAX_LEVELS ? `Next Level ${level + 1}` : 'View Final Score'}
            </button>
            <button
              onClick={startGame}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:text-white font-medium"
            >
              {t('sequenceCompletion.restart', 'Restart from Level 1')}
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-amber-600 mb-4">{t('sequenceCompletion.victory', 'Congratulations!')}</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 font-medium mb-6">
              {t('sequenceCompletion.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className="bg-amber-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('sequenceCompletion.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-amber-600">{totalScore + score}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-amber-600 hover:to-orange-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
