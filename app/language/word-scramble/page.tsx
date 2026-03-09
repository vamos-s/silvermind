'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

const MAX_LEVELS = 30

const WORDS = [
  // Easy
  'cat', 'dog', 'sun', 'run', 'hat', 'cup', 'box', 'red', 'big', 'top',
  'fun', 'map', 'pen', 'bed', 'car', 'bus', 'eye', 'fly', 'jet', 'key',
  // Medium
  'apple', 'grape', 'house', 'water', 'music', 'happy', 'dream', 'beach', 'cloud', 'dance',
  'earth', 'fire', 'fruit', 'glass', 'horse', 'light', 'money', 'night', 'party', 'queen',
  // Hard
  'banana', 'doctor', 'family', 'garden', 'island', 'jungle', 'kitten', 'lemons', 'monkey', 'number',
  'orange', 'planet', 'rabbit', 'school', 'turtle', 'violet', 'window', 'yellow', 'zebra', 'bridge',
  // Expert
  'adventure', 'butterfly', 'chocolate', 'dinosaur', 'elephant', 'fireworks', 'guitar', 'hamburger', 'icecream', 'jellyfish',
  'kangaroo', 'lollipop', 'mountain', 'notebook', 'octopus', 'pineapple', 'rainbow', 'strawberry', 'telescope', 'umbrella',
  // Master
  'astronaut', 'butterfly', 'championship', 'development', 'education', 'fundamental', 'grandmother', 'happiness', 'information', 'jellybean',
  'knowledge', 'laboratory', 'mathematics', 'neighborhood', 'opportunity', 'photography', 'questionnaire', 'refrigerator', 'satisfaction', 'technology',
]

const LEVEL_SETTINGS = [
  { wordLength: 3, timeLimit: 30, hints: 3 },  // Level 1
  { wordLength: 3, timeLimit: 25, hints: 2 },  // Level 2
  { wordLength: 4, timeLimit: 35, hints: 3 },  // Level 3
  { wordLength: 4, timeLimit: 30, hints: 2 },  // Level 4
  { wordLength: 5, timeLimit: 40, hints: 3 },  // Level 5
  { wordLength: 5, timeLimit: 35, hints: 2 },  // Level 6
  { wordLength: 5, timeLimit: 30, hints: 1 },  // Level 7
  { wordLength: 6, timeLimit: 45, hints: 3 },  // Level 8
  { wordLength: 6, timeLimit: 40, hints: 2 },  // Level 9
  { wordLength: 6, timeLimit: 35, hints: 1 },  // Level 10
  { wordLength: 7, timeLimit: 50, hints: 3 },  // Level 11
  { wordLength: 7, timeLimit: 45, hints: 2 },  // Level 12
  { wordLength: 7, timeLimit: 40, hints: 1 },  // Level 13
  { wordLength: 8, timeLimit: 55, hints: 3 },  // Level 14
  { wordLength: 8, timeLimit: 50, hints: 2 },  // Level 15
  { wordLength: 8, timeLimit: 45, hints: 1 },  // Level 16
  { wordLength: 9, timeLimit: 60, hints: 3 },  // Level 17
  { wordLength: 9, timeLimit: 55, hints: 2 },  // Level 18
  { wordLength: 9, timeLimit: 50, hints: 1 },  // Level 19
  { wordLength: 10, timeLimit: 65, hints: 3 },  // Level 20
  { wordLength: 10, timeLimit: 60, hints: 2 },  // Level 21
  { wordLength: 10, timeLimit: 55, hints: 1 },  // Level 22
  { wordLength: 11, timeLimit: 70, hints: 2 },  // Level 23
  { wordLength: 11, timeLimit: 65, hints: 1 },  // Level 24
  { wordLength: 11, timeLimit: 60, hints: 1 },  // Level 25
  { wordLength: 12, timeLimit: 75, hints: 2 },  // Level 26
  { wordLength: 12, timeLimit: 70, hints: 1 },  // Level 27
  { wordLength: 12, timeLimit: 65, hints: 1 },  // Level 28
  { wordLength: 13, timeLimit: 80, hints: 1 },  // Level 29
  { wordLength: 13, timeLimit: 75, hints: 0 },  // Level 30
]

export default function WordScramblePage() {
  const { t } = useTranslation()
  const { addSession } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [currentWord, setCurrentWord] = useState('')
  const [scrambledWord, setScrambledWord] = useState('')
  const [userGuess, setUserGuess] = useState('')
  const [hintsUsed, setHintsUsed] = useState(0)
  const [hintsRemaining, setHintsRemaining] = useState(3)
  const [revealedLetters, setRevealedLetters] = useState<Set<number>>(new Set())
  const [wrongAttempts, setWrongAttempts] = useState(0)

  const settings = useMemo(
    () => LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)],
    [level]
  )

  const getLevelScore = useCallback(() => {
    const baseScore = level * 50
    const timeBonus = timeLeft * 3
    const hintPenalty = hintsUsed * 15
    const wrongPenalty = wrongAttempts * 10
    return Math.max(0, baseScore + timeBonus - hintPenalty - wrongPenalty)
  }, [level, timeLeft, hintsUsed, wrongAttempts])

  const getWordsForLevel = useCallback((length: number) => {
    return WORDS.filter(word => word.length === length)
  }, [])

  const scrambleWord = useCallback((word: string) => {
    const letters = word.split('')
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[letters[i], letters[j]] = [letters[j], letters[i]]
    }
    const scrambled = letters.join('')
    // Make sure it's different from original
    if (scrambled === word) {
      return scrambleWord(word)
    }
    return scrambled
  }, [])

  const generateLevel = useCallback(() => {
    const timeLimit = LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)].timeLimit
    setTimeLeft(timeLimit)
    setHintsRemaining(settings.hints)

    const words = getWordsForLevel(settings.wordLength)
    if (words.length === 0) return

    const word = words[Math.floor(Math.random() * words.length)]
    setCurrentWord(word)
    setScrambledWord(scrambleWord(word))
    setUserGuess('')
    setHintsUsed(0)
    setWrongAttempts(0)
    setRevealedLetters(new Set())
  }, [level, settings.wordLength, settings.hints, getWordsForLevel, scrambleWord])

  const handleLetterClick = useCallback((letter: string) => {
    if (gameState !== 'playing') return
    setUserGuess(prev => prev + letter)
  }, [gameState])

  const handleBackspace = useCallback(() => {
    setUserGuess(prev => prev.slice(0, -1))
  }, [])

  const useHint = useCallback(() => {
    if (gameState !== 'playing' || hintsRemaining <= 0) return

    const unrevealedIndices: number[] = []
    for (let i = 0; i < currentWord.length; i++) {
      if (!revealedLetters.has(i)) {
        unrevealedIndices.push(i)
      }
    }

    if (unrevealedIndices.length === 0) return

    const revealIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)]
    setRevealedLetters(prev => new Set([...prev, revealIndex]))
    setHintsUsed(prev => prev + 1)
    setHintsRemaining(prev => prev - 1)

    // Fill in the letter
    let newGuess = userGuess
    while (newGuess.length < revealIndex) {
      newGuess += ' '
    }
    if (newGuess.length === revealIndex) {
      newGuess += currentWord[revealIndex]
    } else if (newGuess[revealIndex] === ' ') {
      newGuess = newGuess.substring(0, revealIndex) + currentWord[revealIndex] + newGuess.substring(revealIndex + 1)
    }
    setUserGuess(newGuess)
  }, [gameState, hintsRemaining, currentWord, revealedLetters, userGuess])

  const submitGuess = useCallback(() => {
    if (gameState !== 'playing') return

    const cleanGuess = userGuess.replace(/\s/g, '')

    if (cleanGuess === currentWord) {
      const levelScore = Math.round(getLevelScore())
      setScore(levelScore)
      setGameState('levelComplete')
    } else {
      setWrongAttempts(prev => prev + 1)
      setUserGuess('')
    }
  }, [gameState, userGuess, currentWord, getLevelScore])

  const startGame = useCallback(() => {
    setScore(0)
    setTotalScore(0)
    setLevel(1)
    generateLevel()
    setGameState('playing')
  }, [generateLevel])

  const nextLevel = useCallback(() => {
    const levelScore = Math.round(getLevelScore())
    setTotalScore(prev => prev + levelScore)

    if (level >= MAX_LEVELS) {
      addSession({
        id: Date.now().toString(),
        gameId: 'word-scramble',
        difficulty: 'hard',
        score: totalScore + levelScore,
        completedAt: new Date(),
        durationSeconds: 0
      })
      setGameState('victory')
    } else {
      setLevel(prev => prev + 1)
      generateLevel()
      setGameState('playing')
    }
  }, [level, totalScore, getLevelScore, addSession, generateLevel])

  // Timer
  useEffect(() => {
    if (gameState !== 'playing' || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          addSession({
            id: Date.now().toString(),
            gameId: 'word-scramble',
            difficulty: 'medium',
            score: totalScore,
            completedAt: new Date(),
            durationSeconds: settings.timeLimit - prev
          })
          setGameState('gameOver')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState, timeLeft, totalScore, addSession, settings.timeLimit])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link
          href="/language"
          className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium mb-6 text-sm md:text-base lg:text-lg"
        >
          <span className="mr-2">←</span> {t('back', 'Back')}
        </Link>

        <h1 className="text-3xl md:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
          {t('wordScramble.title', 'Word Scramble')}
        </h1>
        <p className="text-lg text-gray-700 font-medium mb-8">
          {t('wordScramble.description', 'Unscramble the letters to find the word!')}
        </p>

        {/* Menu */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
              Level {level}
            </h2>
            <div className="bg-orange-50 dark:bg-slate-700 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 mb-2">{t('wordScramble.levelInfo', 'Level Settings')}:</h3>
              <ul className="text-gray-700 space-y-1 font-medium">
                <li>• {t('wordScramble.wordLength', 'Word Length')}: {settings.wordLength} letters</li>
                <li>• {t('wordScramble.timeLimit', 'Time Limit')}: {settings.timeLimit}s</li>
                <li>• {t('wordScramble.hints', 'Hints Available')}: {settings.hints}</li>
              </ul>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-amber-600 shadow-lg transition-all w-full"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {/* Playing */}
        {gameState === 'playing' && (
          <>
            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('wordScramble.level', 'Level')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">{level}/{MAX_LEVELS}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('wordScramble.score', 'Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-amber-600">{totalScore}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('wordScramble.timeLeft', 'Time')}</p>
                  <p className={`text-xl md:text-2xl lg:text-3xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-orange-600'}`}>{timeLeft}s</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('wordScramble.hints', 'Hints')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">{hintsRemaining}</p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((level - 1) / MAX_LEVELS) * 100}%` }}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-full"
                />
              </div>
            </div>

            {/* Scrambled Word Display */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
              <p className="text-gray-700 font-medium mb-4">{t('wordScramble.unscrambleThis', 'Unscramble this word:')}</p>
              <div className="flex justify-center gap-2 mb-4">
                {scrambledWord.split('').map((letter, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-12 h-12 md:w-16 md:h-16 bg-orange-100 rounded-lg flex items-center justify-center text-2xl md:text-xl md:text-2xl lg:text-3xl font-bold text-orange-600"
                  >
                    {letter.toUpperCase()}
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-gray-500">{t('wordScramble.letterCount', `(${currentWord.length} letters)`)}</p>
            </div>

            {/* User Guess Display */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <div className="flex justify-center gap-2 mb-6">
                {Array.from({ length: currentWord.length }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-10 h-10 md:w-14 md:h-14 rounded-lg flex items-center justify-center text-xl md:text-lg md:text-xl lg:text-2xl font-bold transition-all ${
                      userGuess[index]
                        ? 'bg-green-50 dark:bg-slate-7000 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {userGuess[index] ? userGuess[index].toUpperCase() : '_'}
                  </div>
                ))}
              </div>

              {/* Letter Buttons */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {scrambledWord.split('').map((letter, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleLetterClick(letter)}
                    className="aspect-square bg-orange-100 hover:bg-orange-200 rounded-lg text-xl md:text-lg md:text-xl lg:text-2xl font-bold text-orange-600 transition-all"
                  >
                    {letter.toUpperCase()}
                  </motion.button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleBackspace}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg transition-all"
                >
                  ⌫ {t('wordScramble.backspace', 'Backspace')}
                </button>
                <button
                  onClick={useHint}
                  disabled={hintsRemaining <= 0}
                  className={`flex-1 font-bold py-3 px-4 rounded-lg transition-all ${
                    hintsRemaining > 0
                      ? 'bg-yellow-400 hover:bg-yellow-50 dark:bg-slate-7000 text-gray-800'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  💡 {t('wordScramble.hint', 'Hint')} ({hintsRemaining})
                </button>
                <button
                  onClick={submitGuess}
                  className="flex-1 bg-green-50 dark:bg-slate-7000 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-all"
                >
                  ✓ {t('wordScramble.submit', 'Submit')}
                </button>
              </div>
            </div>

            {/* Wrong Attempts */}
            {wrongAttempts > 0 && (
              <div className="bg-red-50 dark:bg-slate-700 rounded-xl p-4 text-center">
                <p className="text-red-600 font-bold">{t('wordScramble.wrongAttempts', 'Wrong attempts:')} {wrongAttempts} (-{wrongAttempts * 10} points)</p>
              </div>
            )}
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-orange-600 mb-4">{t('wordScramble.correct', 'Correct!')}</h2>
            <p className="text-2xl text-gray-700 mb-4">
              <span className="line-through text-gray-400">{scrambledWord}</span> → <span className="text-green-600 font-bold">{currentWord.toUpperCase()}</span>
            </p>
            <div className="bg-orange-50 dark:bg-slate-700 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('wordScramble.levelScore', 'Level Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">{Math.round(score)}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('wordScramble.totalScore', 'Total Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-amber-600">{totalScore + Math.round(score)}</p>
                </div>
              </div>
            </div>
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-amber-600 shadow-lg transition-all w-full"
            >
              {level < MAX_LEVELS ? `Next Level ${level + 1}` : 'View Final Score'}
            </button>
          </motion.div>
        )}

        {/* Game Over */}
        {gameState === 'gameOver' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">{t('wordScramble.gameOver', 'Time\'s Up!')}</h2>
            <p className="text-xl text-gray-700 mb-4">
              {t('wordScramble.answerWas', 'The answer was:')} <span className="text-green-600 font-bold">{currentWord.toUpperCase()}</span>
            </p>
            <div className="bg-orange-50 dark:bg-slate-700 rounded-xl p-6 mb-6">
              <p className="text-gray-700 text-sm font-medium">{t('wordScramble.finalScore', 'Final Score')}</p>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">{totalScore}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-red-600 shadow-lg transition-all w-full"
            >
              {t('tryAgain', 'Try Again')}
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-orange-600 mb-4">{t('wordScramble.victory', 'Congratulations!')}</h2>
            <p className="text-xl text-gray-700 font-medium mb-6">
              {t('wordScramble.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className="bg-orange-50 dark:bg-slate-700 rounded-xl p-6 mb-6">
              <p className="text-gray-700 text-sm font-medium">{t('wordScramble.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-orange-600">{totalScore + Math.round(score)}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-lg md:text-xl lg:text-2xl font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-amber-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
