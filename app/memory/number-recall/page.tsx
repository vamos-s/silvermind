'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

import { SettingsPanel } from "@/components/SettingsPanel"
const MAX_LEVELS = 30

export default function NumberRecallPage() {
  const { t } = useTranslation()
  const { addSession, darkMode } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'showing' | 'input' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [sequence, setSequence] = useState<number[]>([])
  const [playerInput, setPlayerInput] = useState<string>('')
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [level, setLevel] = useState(1)

  const getSequenceLength = useCallback(() => {
    if (level <= 5) return 3 + level - 1
    if (level <= 10) return 7 + (level - 5)
    if (level <= 15) return 12 + (level - 10)
    if (level <= 20) return 17 + (level - 15)
    return 22 + (level - 20)
  }, [level])

  const getDisplayTime = useCallback(() => {
    if (level <= 5) return 3000 - (level - 1) * 300
    if (level <= 10) return 1800 - (level - 6) * 200
    if (level <= 15) return 800 - (level - 11) * 100
    if (level <= 20) return 300 - (level - 16) * 40
    return 100 - (level - 21) * 10
  }, [level])

  const getLevelScore = useCallback(() => {
    const displayTime = getDisplayTime()
    return level * 10 * (displayTime / 1000)
  }, [level, getDisplayTime])

  const startLevel = useCallback(() => {
    const seqLength = getSequenceLength()
    const newSequence = Array.from({ length: seqLength }, () =>
      Math.floor(Math.random() * 10)
    )
    setSequence(newSequence)
    setPlayerInput('')
    setGameState('showing')

    const displayTime = getDisplayTime()
    setTimeout(() => {
      setGameState('input')
    }, displayTime)
  }, [getSequenceLength, getDisplayTime])

  const startGame = useCallback(() => {
    setScore(0)
    setTotalScore(0)
    setLevel(1)
    startLevel()
  }, [startLevel])

  const nextLevel = useCallback(() => {
    const levelScore = Math.round(getLevelScore())
    setTotalScore(prev => prev + levelScore)

    if (level >= MAX_LEVELS) {
      addSession({
        id: Date.now().toString(),
        gameId: 'number-recall',
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
  }, [level, totalScore, getLevelScore, addSession, startLevel])

  const handleNumberClick = useCallback((num: number) => {
    const newInput = playerInput + num
    setPlayerInput(newInput)

    if (newInput.length === sequence.length) {
      const playerArray = newInput.split('').map(Number)
      if (JSON.stringify(playerArray) === JSON.stringify(sequence)) {
        const levelScore = Math.round(getLevelScore())
        setScore(levelScore)
        setGameState('levelComplete')
      } else {
        addSession({
          id: Date.now().toString(),
          gameId: 'number-recall',
          difficulty: 'medium',
          score: totalScore,
          completedAt: new Date(),
          durationSeconds: level * 30
        })
        setGameState('gameOver')
      }
    }
  }, [playerInput, sequence, level, totalScore, getLevelScore, addSession])

  const handleDelete = useCallback(() => {
    setPlayerInput(playerInput.slice(0, -1))
  }, [playerInput])

  return (
    <div className={`min-h-screen p-3 md:p-4 lg:p-8 transition-colors duration-300 ${darkMode ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" : "bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8"}`}>
      <SettingsPanel />
      <div className="max-w-lg mx-auto">
        <header className="mb-6">
          <Link href="/memory" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium mb-4 block">
            ← {t('back', 'Back')}
          </Link>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mt-4">
            🔢 {t('numberRecall.title', 'Number Recall')}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
            {t('numberRecall.description', 'Remember and repeat the number sequence!')}
          </p>
        </header>

        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2">Level {level}</h2>
            {level > 1 && (
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 font-medium">
                Total Score: <span className="text-blue-600 font-bold">{totalScore}</span>
              </p>
            )}
            <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">{t('numberRecall.levelInfo', 'Level Settings')}:</h3>
              <ul className="text-gray-700 dark:text-gray-300 space-y-1 font-medium">
                <li>• {t('numberRecall.sequenceLength', 'Sequence Length')}: {getSequenceLength()}</li>
                <li>• {t('numberRecall.displayTime', 'Display Time')}: {Math.round(getDisplayTime() / 100) / 10}s</li>
              </ul>
            </div>
            <button onClick={startLevel} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-blue-600 hover:to-purple-600 shadow-lg transition-all w-full">
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {gameState === 'showing' && (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white dark:bg-slate-800 rounded-2xl p-12 shadow-xl text-center">
            <p className="text-xl text-gray-700 dark:text-gray-300 font-medium mb-6">{t('numberRecall.remember', 'Remember this sequence:')}</p>
            <p className={`font-bold text-blue-600 tracking-widest ${sequence.length <= 6 ? 'text-6xl' : sequence.length <= 10 ? 'text-4xl' : 'text-2xl'}`}>
              {sequence.join('')}
            </p>
          </motion.div>
        )}

        {gameState === 'input' && (
          <>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-center gap-4 md:gap-6 lg:gap-8 text-2xl mb-4">
                <p className="font-bold text-blue-600">{t('numberRecall.level', 'Level')}: {level}/{MAX_LEVELS}</p>
                <p className="font-bold text-purple-600">{t('numberRecall.score', 'Score')}: {totalScore}</p>
              </div>
              <div className="bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${((level - 1) / MAX_LEVELS) * 100}%` }} className="bg-gradient-to-r from-blue-500 to-purple-500 h-full" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-6">
              <p className="text-center text-xl text-gray-700 dark:text-gray-300 font-medium mb-4">{t('numberRecall.yourAnswer', 'Your answer:')}</p>
              <input type="text" value={playerInput} readOnly className={`w-full bg-gray-100 dark:bg-slate-700 rounded-lg p-4 text-center font-bold tracking-widest text-gray-800 dark:text-white border-2 border-gray-300 dark:border-gray-500 dark:border-slate-600 ${sequence.length <= 6 ? 'text-4xl h-16' : sequence.length <= 10 ? 'text-2xl h-14' : 'text-xl h-12'}`} placeholder={'_'.repeat(sequence.length)} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <motion.button key={num} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleNumberClick(num)} className="bg-blue-500 text-white text-2xl md:text-3xl lg:text-4xl font-bold py-4 rounded-xl shadow-lg hover:bg-blue-600 transition">{num}</motion.button>
              ))}
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleDelete} className="bg-red-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 rounded-xl shadow-lg hover:bg-red-600 transition">⌫</motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleNumberClick(0)} className="bg-blue-500 text-white text-2xl md:text-3xl lg:text-4xl font-bold py-4 rounded-xl shadow-lg hover:bg-blue-600 transition">0</motion.button>
            </div>
          </>
        )}

        {gameState === 'levelComplete' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 mb-4">Level {level} Complete!</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 font-medium mb-6">{t('numberRecall.sequence', 'Sequence')}: {sequence.join('')}</p>
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('numberRecall.levelScore', 'Level Score')}</p><p className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-600">{Math.round(score)}</p></div>
                <div><p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('numberRecall.totalScore', 'Total Score')}</p><p className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-600">{totalScore + Math.round(score)}</p></div>
              </div>
            </div>
            <button onClick={nextLevel} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-blue-600 hover:to-purple-600 shadow-lg transition-all w-full mb-3">{level < MAX_LEVELS ? `Next Level ${level + 1}` : 'View Final Score'}</button>
            <button onClick={startGame} className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:text-white font-medium">{t('numberRecall.restart', 'Restart from Level 1')}</button>
          </motion.div>
        )}

        {gameState === 'gameOver' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4">{t('numberRecall.gameOver', 'Game Over!')}</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-2">{t('numberRecall.correctSequence', 'Correct sequence:')}</p>
            <p className="text-lg md:text-xl lg:text-2xl font-bold text-blue-600 mb-2">{sequence.join('')}</p>
            <p className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-2">{t('numberRecall.yourAnswer', 'Your answer:')}</p>
            <p className="text-lg md:text-xl lg:text-2xl font-bold text-red-500 mb-6">{playerInput}</p>
            <div className="bg-orange-50 dark:bg-slate-800 rounded-xl p-6 mb-6"><p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('numberRecall.finalScore', 'Final Score')}</p><p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">{totalScore}</p></div>
            <button onClick={startGame} className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-red-600 shadow-lg transition-all w-full mb-3">{t('tryAgain', 'Try Again')}</button>
            <button onClick={startGame} className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:text-white font-medium">{t('numberRecall.restart', 'Restart from Level 1')}</button>
          </motion.div>
        )}

        {gameState === 'victory' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 mb-4">{t('numberRecall.victory', 'Congratulations!')}</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 font-medium mb-6">{t('numberRecall.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}</p>
            <div className="bg-blue-50 rounded-xl p-6 mb-6"><p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('numberRecall.finalScore', 'Final Score')}</p><p className="text-5xl font-bold text-blue-600">{totalScore + Math.round(score)}</p></div>
            <button onClick={startGame} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-blue-600 hover:to-purple-600 shadow-lg transition-all w-full">{t('playAgain', 'Play Again')}</button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
