'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

const MAX_LEVELS = 30

const WORDS = new Set([
  // Common 3-4 letter words
  'cat', 'dog', 'sun', 'run', 'hat', 'cup', 'box', 'red', 'big', 'top',
  'fun', 'map', 'pen', 'bed', 'car', 'bus', 'eye', 'fly', 'jet', 'key',
  'act', 'apt', 'art', 'ate', 'ear', 'eat', 'pat', 'tap', 'tea', 'ant',
  'bad', 'bag', 'bar', 'bat', 'bog', 'bow', 'bus', 'but', 'car', 'cot',
  'cow', 'cud', 'cup', 'cut', 'dog', 'dot', 'dug', 'dun', 'elf', 'far',
  'fit', 'fog', 'fop', 'gap', 'gas', 'god', 'got', 'gum', 'gut', 'has',
  'hat', 'hen', 'her', 'hip', 'hod', 'hog', 'hop', 'hot', 'how', 'hug',
  'hut', 'jam', 'jaw', 'jet', 'jog', 'jot', 'kin', 'kit', 'lab', 'lap',
  'law', 'lay', 'led', 'leg', 'let', 'lid', 'lie', 'lip', 'log', 'low',
  'mad', 'man', 'map', 'mat', 'mew', 'mop', 'mot', 'mug', 'nap', 'net',
  'new', 'nod', 'not', 'now', 'nut', 'oar', 'odd', 'opt', 'owl', 'own',
  'pan', 'par', 'pat', 'paw', 'pay', 'pen', 'pet', 'pie', 'pig', 'pin',
  'pit', 'pot', 'pro', 'put', 'rag', 'ram', 'rap', 'rat', 'raw', 'red',
  'rib', 'rig', 'rim', 'rob', 'rod', 'row', 'rub', 'rug', 'run', 'saw',
  'say', 'sea', 'set', 'sew', 'she', 'sin', 'sir', 'sit', 'ski', 'sky',
  'sly', 'sob', 'sod', 'sop', 'sot', 'spa', 'spy', 'sub', 'sue', 'sum',
  'tab', 'tag', 'tan', 'tap', 'tar', 'tax', 'tea', 'tee', 'ten', 'the',
  'tin', 'tip', 'toe', 'top', 'tot', 'tow', 'toy', 'tub', 'tug', 'tun',
  'two', 'urn', 'use', 'van', 'vet', 'war', 'was', 'wax', 'way', 'web',
  'wed', 'wet', 'who', 'why', 'wig', 'win', 'wit', 'won', 'wow', 'yak',
  'yam', 'yes', 'yet', 'yew', 'yip', 'you', 'zip', 'zoo',
  // 5+ letter words
  'apple', 'grape', 'house', 'water', 'music', 'happy', 'dream', 'beach', 'cloud', 'dance',
  'earth', 'fire', 'fruit', 'glass', 'horse', 'light', 'money', 'night', 'party', 'queen',
  'radio', 'river', 'sheep', 'snake', 'stone', 'table', 'tiger', 'train', 'uncle', 'video',
  'watch', 'woman', 'zebra', 'abide', 'about', 'above', 'abuse', 'actor', 'acute', 'admit',
  'adopt', 'adult', 'after', 'again', 'agent', 'agree', 'ahead', 'alarm', 'album', 'alert',
  'alive', 'allow', 'alone', 'along', 'alter', 'among', 'anger', 'angle', 'angry', 'apart',
  'apple', 'apply', 'arena', 'argue', 'arise', 'array', 'aside', 'asset', 'audio', 'audit',
  'avoid', 'award', 'aware', 'badly', 'baker', 'bases', 'basic', 'basis', 'beach', 'began',
  'begin', 'begun', 'being', 'below', 'bench', 'billy', 'birth', 'black', 'blame', 'blind',
  'block', 'blood', 'board', 'boost', 'booth', 'bound', 'brain', 'brand', 'bread', 'break',
  'breed', 'brief', 'bring', 'broad', 'brown', 'brush', 'build', 'built', 'buyer', 'cable',
  'calif', 'carry', 'catch', 'cause', 'chain', 'chair', 'chart', 'chase', 'cheap', 'check',
  'chest', 'chief', 'child', 'china', 'chose', 'civil', 'claim', 'class', 'clean', 'clear',
  'click', 'clock', 'close', 'coach', 'coast', 'could', 'count', 'court', 'cover', 'craft',
  'crash', 'cream', 'crime', 'cross', 'crowd', 'crown', 'curve', 'cycle', 'daily', 'dance',
  'dated', 'dealt', 'death', 'debut', 'delay', 'depth', 'doing', 'doubt', 'dozen', 'draft',
  'drama', 'drawn', 'dream', 'dress', 'drill', 'drink', 'drive', 'drove', 'dying', 'eager',
  'early', 'earth', 'eight', 'elite', 'empty', 'enemy', 'enjoy', 'enter', 'entry', 'equal',
  'error', 'event', 'every', 'exact', 'exist', 'extra', 'faith', 'false', 'fault', 'fiber',
  'field', 'fifth', 'fifty', 'fight', 'final', 'first', 'fixed', 'flash', 'fleet', 'floor',
  'fluid', 'focus', 'force', 'forth', 'forty', 'forum', 'found', 'frame', 'frank', 'fraud',
  'fresh', 'front', 'fruit', 'fully', 'funny', 'giant', 'given', 'glass', 'globe', 'going',
  'grace', 'grade', 'grand', 'grant', 'grass', 'great', 'green', 'gross', 'group', 'grown',
  'guard', 'guess', 'guest', 'guide', 'happy', 'harry', 'heart', 'heavy', 'hence', 'hello',
  'hobby', 'horse', 'hotel', 'house', 'human', 'ideal', 'image', 'index', 'inner', 'input',
  'issue', 'japan', 'jimmy', 'joint', 'jones', 'judge', 'known', 'label', 'large', 'laser',
  'later', 'laugh', 'layer', 'learn', 'lease', 'least', 'leave', 'legal', 'level', 'lewis',
  'light', 'limit', 'links', 'lives', 'local', 'logic', 'loose', 'lower', 'lucky', 'lunch',
  'lying', 'magic', 'major', 'maker', 'march', 'maria', 'match', 'maybe', 'mayor', 'meant',
  'media', 'metal', 'might', 'minor', 'minus', 'mixed', 'model', 'money', 'month', 'moral',
  'motor', 'mount', 'mouse', 'mouth', 'movie', 'music', 'needs', 'never', 'newly', 'night',
  'noise', 'north', 'noted', 'novel', 'nurse', 'occur', 'ocean', 'offer', 'often', 'order',
  'other', 'ought', 'paint', 'panel', 'paper', 'party', 'peace', 'penny', 'phase', 'phone',
  'photo', 'pilot', 'pitch', 'place', 'plain', 'plane', 'plant', 'plate', 'point', 'pound',
  'power', 'press', 'price', 'pride', 'prime', 'print', 'prior', 'prize', 'proof', 'proud',
  'prove', 'queen', 'quick', 'quiet', 'quite', 'radio', 'raise', 'range', 'rapid', 'ratio',
  'reach', 'ready', 'refer', 'right', 'rival', 'river', 'robot', 'roger', 'roman', 'rough',
  'round', 'route', 'royal', 'rural', 'scale', 'scene', 'scope', 'score', 'sense', 'serve',
  'seven', 'shall', 'shape', 'share', 'sharp', 'sheet', 'shelf', 'shell', 'shift', 'shirt',
  'shock', 'shoot', 'short', 'shown', 'sight', 'since', 'sixth', 'sixty', 'sized', 'skill',
  'sleep', 'slide', 'small', 'smart', 'smile', 'smith', 'smoke', 'solid', 'solve', 'sorry',
  'sound', 'south', 'space', 'spare', 'speak', 'speed', 'spend', 'spent', 'split', 'spoke',
  'sport', 'staff', 'stage', 'stake', 'stand', 'start', 'state', 'steam', 'steel', 'stick',
  'still', 'stock', 'stone', 'stood', 'store', 'storm', 'story', 'strip', 'stuck', 'study',
  'stuff', 'style', 'sugar', 'suite', 'super', 'sweet', 'table', 'taken', 'taste', 'taxes',
  'teach', 'teeth', 'terry', 'texas', 'thank', 'theft', 'their', 'theme', 'there', 'these',
  'thick', 'thing', 'think', 'third', 'those', 'three', 'threw', 'throw', 'tight', 'times',
  'tired', 'title', 'today', 'topic', 'total', 'touch', 'tough', 'tower', 'track', 'trade',
  'train', 'treat', 'trend', 'trial', 'tribe', 'trick', 'tried', 'tries', 'truck', 'truly',
  'trust', 'truth', 'twice', 'under', 'undue', 'union', 'unity', 'until', 'upper', 'upset',
  'urban', 'usage', 'usual', 'valid', 'value', 'video', 'virus', 'visit', 'vital', 'voice',
  'waste', 'watch', 'water', 'wheel', 'where', 'which', 'while', 'white', 'whole', 'whose',
  'woman', 'women', 'world', 'worry', 'worse', 'worst', 'worth', 'would', 'wound', 'write',
  'wrong', 'wrote', 'yield', 'young', 'youth',
])

const LEVEL_SETTINGS = [
  { minWordLength: 3, wordsNeeded: 5, timePerWord: 15, bannedWords: 2 },  // Level 1
  { minWordLength: 3, wordsNeeded: 5, timePerWord: 12, bannedWords: 2 },  // Level 2
  { minWordLength: 3, wordsNeeded: 6, timePerWord: 15, bannedWords: 2 },  // Level 3
  { minWordLength: 4, wordsNeeded: 6, timePerWord: 15, bannedWords: 3 },  // Level 4
  { minWordLength: 4, wordsNeeded: 6, timePerWord: 12, bannedWords: 3 },  // Level 5
  { minWordLength: 4, wordsNeeded: 7, timePerWord: 15, bannedWords: 3 },  // Level 6
  { minWordLength: 4, wordsNeeded: 7, timePerWord: 12, bannedWords: 4 },  // Level 7
  { minWordLength: 5, wordsNeeded: 7, timePerWord: 15, bannedWords: 4 },  // Level 8
  { minWordLength: 5, wordsNeeded: 7, timePerWord: 12, bannedWords: 4 },  // Level 9
  { minWordLength: 5, wordsNeeded: 8, timePerWord: 15, bannedWords: 4 },  // Level 10
  { minWordLength: 5, wordsNeeded: 8, timePerWord: 12, bannedWords: 5 },  // Level 11
  { minWordLength: 5, wordsNeeded: 8, timePerWord: 10, bannedWords: 5 },  // Level 12
  { minWordLength: 6, wordsNeeded: 8, timePerWord: 15, bannedWords: 5 },  // Level 13
  { minWordLength: 6, wordsNeeded: 8, timePerWord: 12, bannedWords: 5 },  // Level 14
  { minWordLength: 6, wordsNeeded: 9, timePerWord: 15, bannedWords: 5 },  // Level 15
  { minWordLength: 6, wordsNeeded: 9, timePerWord: 12, bannedWords: 6 },  // Level 16
  { minWordLength: 6, wordsNeeded: 9, timePerWord: 10, bannedWords: 6 },  // Level 17
  { minWordLength: 7, wordsNeeded: 9, timePerWord: 15, bannedWords: 6 },  // Level 18
  { minWordLength: 7, wordsNeeded: 9, timePerWord: 12, bannedWords: 6 },  // Level 19
  { minWordLength: 7, wordsNeeded: 10, timePerWord: 15, bannedWords: 6 },  // Level 20
  { minWordLength: 7, wordsNeeded: 10, timePerWord: 12, bannedWords: 7 },  // Level 21
  { minWordLength: 7, wordsNeeded: 10, timePerWord: 10, bannedWords: 7 },  // Level 22
  { minWordLength: 8, wordsNeeded: 10, timePerWord: 15, bannedWords: 7 },  // Level 23
  { minWordLength: 8, wordsNeeded: 10, timePerWord: 12, bannedWords: 7 },  // Level 24
  { minWordLength: 8, wordsNeeded: 11, timePerWord: 15, bannedWords: 7 },  // Level 25
  { minWordLength: 8, wordsNeeded: 11, timePerWord: 12, bannedWords: 8 },  // Level 26
  { minWordLength: 9, wordsNeeded: 11, timePerWord: 15, bannedWords: 8 },  // Level 27
  { minWordLength: 9, wordsNeeded: 11, timePerWord: 12, bannedWords: 8 },  // Level 28
  { minWordLength: 10, wordsNeeded: 12, timePerWord: 15, bannedWords: 8 },  // Level 29
  { minWordLength: 10, wordsNeeded: 12, timePerWord: 12, bannedWords: 8 },  // Level 30
]

export default function WordChainPage() {
  const { t } = useTranslation()
  const { addSession } = useGameStore()
  const inputRef = useRef<HTMLInputElement>(null)

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [currentWord, setCurrentWord] = useState('')
  const [lastLetter, setLastLetter] = useState('')
  const [userInput, setUserInput] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set())
  const [invalidWords, setInvalidWords] = useState<string[]>([])
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const settings = useMemo(
    () => LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)],
    [level]
  )

  const getLevelScore = useCallback(() => {
    const baseScore = level * 50
    const timeBonus = timeLeft * 5
    return baseScore + timeBonus
  }, [level, timeLeft])

  const generateLevel = useCallback(() => {
    const wordList = [...WORDS].filter(w => w.length >= settings.minWordLength)
    if (wordList.length === 0) return

    const startWord = wordList[Math.floor(Math.random() * wordList.length)]
    setCurrentWord(startWord)
    setLastLetter(startWord[startWord.length - 1])
    setWordCount(0)
    setUsedWords(new Set([startWord]))
    setInvalidWords([])
    setUserInput('')
    setMessage(null)

    const totalTime = settings.wordsNeeded * settings.timePerWord
    setTimeLeft(totalTime)

    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [settings.minWordLength, settings.wordsNeeded, settings.timePerWord])

  const isValidWord = useCallback((word: string) => {
    if (word.length < settings.minWordLength) return false
    if (!WORDS.has(word)) return false
    if (usedWords.has(word)) return false
    if (invalidWords.includes(word)) return false

    // Check chain rule
    const previousLastLetter = wordCount === 0 ? currentWord[currentWord.length - 1] : currentWord[currentWord.length - 1]
    if (word[0].toLowerCase() !== previousLastLetter.toLowerCase()) return false

    return true
  }, [settings.minWordLength, usedWords, invalidWords, wordCount, currentWord])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (gameState !== 'playing') return

    const word = userInput.toLowerCase().trim()

    if (!word) return

    // Check chain rule
    const requiredLetter = wordCount === 0 ? currentWord[currentWord.length - 1] : currentWord[currentWord.length - 1]
    if (word[0].toLowerCase() !== requiredLetter.toLowerCase()) {
      setMessage({ type: 'error', text: `Word must start with "${requiredLetter.toUpperCase()}"` })
      setUserInput('')
      return
    }

    if (word.length < settings.minWordLength) {
      setMessage({ type: 'error', text: `Word must be at least ${settings.minWordLength} letters` })
      setUserInput('')
      return
    }

    if (usedWords.has(word)) {
      setMessage({ type: 'error', text: 'Word already used!' })
      setUserInput('')
      return
    }

    if (!WORDS.has(word)) {
      setMessage({ type: 'error', text: 'Not a valid word!' })
      setInvalidWords(prev => [...prev, word])
      setUserInput('')
      return
    }

    // Valid word
    setCurrentWord(word)
    setLastLetter(word[word.length - 1])
    setUsedWords(prev => new Set([...prev, word]))
    setWordCount(prev => prev + 1)
    setUserInput('')
    setMessage({ type: 'success', text: `Good! Now start with "${word[word.length - 1].toUpperCase()}"` })

    // Check win condition
    if (wordCount + 1 >= settings.wordsNeeded) {
      const levelScore = Math.round(getLevelScore())
      setScore(levelScore)
      setGameState('levelComplete')
    }
  }, [gameState, userInput, wordCount, currentWord, settings.minWordLength, settings.wordsNeeded, usedWords, getLevelScore])

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
        gameId: 'word-chain',
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
            gameId: 'word-chain',
            difficulty: 'medium',
            score: totalScore,
            completedAt: new Date(),
            durationSeconds: 0
          })
          setGameState('gameOver')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState, timeLeft, totalScore, addSession])

  // Focus input when playing
  useEffect(() => {
    if (gameState === 'playing' && inputRef.current) {
      inputRef.current.focus()
    }
  }, [gameState])

  // Auto-clear message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link
          href="/language"
          className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium mb-6 text-lg"
        >
          <span className="mr-2">←</span> {t('back', 'Back')}
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          {t('wordChain.title', 'Word Chain')}
        </h1>
        <p className="text-lg text-gray-700 font-medium mb-8">
          {t('wordChain.description', 'Create a chain of words! Each word must start with the last letter of the previous word.')}
        </p>

        {/* Menu */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">🔗</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Level {level}
            </h2>
            <div className="bg-orange-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 mb-2">{t('wordChain.levelInfo', 'Level Settings')}:</h3>
              <ul className="text-gray-700 space-y-1 font-medium">
                <li>• {t('wordChain.minWordLength', 'Min Word Length')}: {settings.minWordLength} letters</li>
                <li>• {t('wordChain.wordsNeeded', 'Words Needed')}: {settings.wordsNeeded}</li>
                <li>• {t('wordChain.timePerWord', 'Time Per Word')}: {settings.timePerWord}s</li>
              </ul>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-amber-600 shadow-lg transition-all w-full"
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
                  <p className="text-gray-700 text-sm font-medium">{t('wordChain.level', 'Level')}</p>
                  <p className="text-3xl font-bold text-orange-600">{level}/{MAX_LEVELS}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('wordChain.score', 'Score')}</p>
                  <p className="text-3xl font-bold text-amber-600">{totalScore}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('wordChain.timeLeft', 'Time')}</p>
                  <p className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-orange-600'}`}>{timeLeft}s</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('wordChain.progress', 'Progress')}</p>
                  <p className="text-3xl font-bold text-orange-600">{wordCount}/{settings.wordsNeeded}</p>
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

            {/* Current Word Display */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <p className="text-gray-700 text-sm font-medium mb-2 text-center">
                {wordCount === 0 ? t('wordChain.startingWord', 'Starting Word') : t('wordChain.currentWord', 'Current Word')}
              </p>
              <div className="text-center">
                <div className="inline-block bg-orange-100 text-orange-600 text-3xl md:text-4xl font-bold px-8 py-4 rounded-xl">
                  {currentWord}
                </div>
                <div className="mt-4 text-xl font-bold text-amber-600">
                  {t('wordChain.nextLetter', 'Next letter')}: <span className="text-3xl text-orange-600">{currentWord[currentWord.length - 1].toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={`${t('wordChain.enterWord', 'Enter word starting with')} "${currentWord[currentWord.length - 1].toUpperCase()}"`}
                className="w-full p-4 text-xl border-2 border-gray-300 rounded-xl focus:border-orange-400 focus:outline-none text-center text-gray-800 placeholder-gray-500"
                autoFocus
                autoComplete="off"
              />
              <button
                type="submit"
                className="w-full mt-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xl font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-amber-600 shadow-lg transition-all"
              >
                {t('wordChain.submit', 'Submit')}
              </button>
            </form>

            {/* Message */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`rounded-xl p-4 mb-6 text-center font-bold ${
                    message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Used Words */}
            {usedWords.size > 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <p className="text-gray-700 text-sm font-medium mb-3 text-center">{t('wordChain.usedWords', 'Used Words')}:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[...usedWords].map((word, index) => (
                    <div
                      key={index}
                      className={`px-3 py-1 rounded-lg font-bold ${
                        index === usedWords.size - 1
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {word}
                    </div>
                  ))}
                </div>
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
            <h2 className="text-4xl font-bold text-orange-600 mb-4">{t('wordChain.levelComplete', 'Level Complete!')}</h2>
            <div className="bg-orange-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 mb-4">{t('wordChain.wordsChain', 'Words in chain:')} {settings.wordsNeeded}</p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {[...usedWords].map((word, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg font-bold"
                  >
                    {word}
                  </motion.div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('wordChain.levelScore', 'Level Score')}</p>
                  <p className="text-3xl font-bold text-orange-600">{Math.round(score)}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('wordChain.totalScore', 'Total Score')}</p>
                  <p className="text-3xl font-bold text-amber-600">{totalScore + Math.round(score)}</p>
                </div>
              </div>
            </div>
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-amber-600 shadow-lg transition-all w-full"
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
            <h2 className="text-4xl font-bold text-gray-800 mb-4">{t('wordChain.gameOver', 'Time\'s Up!')}</h2>
            <div className="bg-orange-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 mb-4">{t('wordChain.wordsInChain', 'Words in chain:')} {wordCount}</p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {[...usedWords].map((word, index) => (
                  <div
                    key={index}
                    className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg font-bold"
                  >
                    {word}
                  </div>
                ))}
              </div>
              <p className="text-gray-700 text-sm font-medium">{t('wordChain.finalScore', 'Final Score')}</p>
              <p className="text-3xl font-bold text-orange-600">{totalScore}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-red-600 shadow-lg transition-all w-full"
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
            <h2 className="text-4xl font-bold text-orange-600 mb-4">{t('wordChain.victory', 'Congratulations!')}</h2>
            <p className="text-xl text-gray-700 font-medium mb-6">
              {t('wordChain.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className="bg-orange-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 text-sm font-medium">{t('wordChain.finalScore', 'Final Score')}</p>
              <p className="text-5xl font-bold text-orange-600">{totalScore + Math.round(score)}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-amber-600 shadow-lg transition-all w-full"
            >
              {t('playAgain', 'Play Again')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
