'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

const MAX_LEVELS = 30

const IDIOMS: { idiom: string; meaning: string; hint: string; difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'master' }[] = [
  { idiom: 'break a leg', meaning: 'Good luck', hint: 'Said before a performance', difficulty: 'easy' },
  { idiom: 'piece of cake', meaning: 'Very easy', hint: 'Something simple', difficulty: 'easy' },
  { idiom: 'hit the sack', meaning: 'Go to sleep', hint: 'Bedtime phrase', difficulty: 'easy' },
  { idiom: 'under the weather', meaning: 'Feeling sick', hint: 'Health related', difficulty: 'easy' },
  { idiom: 'cost an arm and a leg', meaning: 'Very expensive', hint: 'Paying a lot', difficulty: 'easy' },
  { idiom: 'once in a blue moon', meaning: 'Rarely', hint: 'Not often', difficulty: 'easy' },
  { idiom: 'spill the beans', meaning: 'Reveal a secret', hint: 'Telling secrets', difficulty: 'easy' },
  { idiom: 'bite the bullet', meaning: 'Face difficulty bravely', hint: 'Being brave', difficulty: 'medium' },
  { idiom: 'burn the midnight oil', meaning: 'Work late', hint: 'Staying up late', difficulty: 'medium' },
  { idiom: 'cut corners', meaning: 'Do something cheaply', hint: 'Saving money/time', difficulty: 'medium' },
  { idiom: 'call it a day', meaning: 'Stop working', hint: 'Ending the day', difficulty: 'medium' },
  { idiom: 'get out of hand', meaning: 'Become uncontrollable', hint: 'Losing control', difficulty: 'medium' },
  { idiom: 'miss the boat', meaning: 'Miss an opportunity', hint: 'Too late', difficulty: 'medium' },
  { idiom: 'no pain no gain', meaning: 'Effort required', hint: 'Working hard', difficulty: 'medium' },
  { idiom: 'speak of the devil', meaning: 'Person appears when mentioned', hint: 'Coincidence', difficulty: 'medium' },
  { idiom: 'let the cat out of the bag', meaning: 'Reveal secret accidentally', hint: 'Oops moment', difficulty: 'medium' },
  { idiom: 'go Dutch', meaning: 'Split the bill', hint: 'Paying together', difficulty: 'medium' },
  { idiom: 'kill two birds with one stone', meaning: 'Achieve two things at once', hint: 'Efficient', difficulty: 'medium' },
  { idiom: 'beat around the bush', meaning: 'Avoid direct approach', hint: 'Not straightforward', difficulty: 'medium' },
  { idiom: 'pull yourself together', meaning: 'Calm down', hint: 'Regain composure', difficulty: 'medium' },
  { idiom: 'a blessing in disguise', meaning: 'Something good from bad', hint: 'Unexpected benefit', difficulty: 'hard' },
  { idiom: 'actions speak louder than words', meaning: 'Actions more important than speech', hint: 'Show dont tell', difficulty: 'hard' },
  { idiom: 'barking up the wrong tree', meaning: 'Wrong approach', hint: 'Mistaken', difficulty: 'hard' },
  { idiom: 'call it quits', meaning: 'Give up', hint: 'Stopping', difficulty: 'hard' },
  { idiom: 'devil\'s advocate', meaning: 'Opposing for debate', hint: 'Alternative view', difficulty: 'hard' },
  { idiom: 'don\'t judge a book by its cover', meaning: 'Don\'t judge by appearance', hint: 'Look deeper', difficulty: 'hard' },
  { idiom: 'elephant in the room', meaning: 'Obvious problem', hint: 'Unspoken issue', difficulty: 'hard' },
  { idiom: 'get your act together', meaning: 'Organize yourself', hint: 'Be prepared', difficulty: 'hard' },
  { idiom: 'give someone the benefit of the doubt', meaning: 'Trust someone', hint: 'Positive assumption', difficulty: 'hard' },
  { idiom: 'go back to the drawing board', meaning: 'Start over', hint: 'New beginning', difficulty: 'hard' },
  { idiom: 'hang in there', meaning: 'Don\'t give up', hint: 'Keep going', difficulty: 'hard' },
  { idiom: 'hit the nail on the head', meaning: 'Exactly right', hint: 'Perfect answer', difficulty: 'hard' },
  { idiom: 'ignorance is bliss', meaning: 'Not knowing is better', hint: 'Unaware is happy', difficulty: 'hard' },
  { idiom: 'jump on the bandwagon', meaning: 'Follow trends', hint: 'Joining popular', difficulty: 'hard' },
  { idiom: 'keep your chin up', meaning: 'Stay positive', hint: 'Be hopeful', difficulty: 'hard' },
  { idiom: 'let sleeping dogs lie', meaning: 'Leave things alone', hint: 'Don\'t disturb', difficulty: 'hard' },
  { idiom: 'make a long story short', meaning: 'Summarize', hint: 'Brief version', difficulty: 'hard' },
  { idiom: 'no love lost', meaning: 'Dislike each other', hint: 'Bad feelings', difficulty: 'hard' },
  { idiom: 'on the ball', meaning: 'Alert and prepared', hint: 'Pay attention', difficulty: 'hard' },
  { idiom: 'out of the blue', meaning: 'Unexpectedly', hint: 'Surprise', difficulty: 'hard' },
  { idiom: 'play devil\'s advocate', meaning: 'Argue opposing view', hint: 'Alternative perspective', difficulty: 'expert' },
  { idiom: 'pull the wool over someone\'s eyes', meaning: 'Deceive someone', hint: 'Trickery', difficulty: 'expert' },
  { idiom: 'put all your eggs in one basket', meaning: 'Risk everything', hint: 'Not diversifying', difficulty: 'expert' },
  { idiom: 'see eye to eye', meaning: 'Agree', hint: 'Same view', difficulty: 'expert' },
  { idiom: 'sit on the fence', meaning: 'Undecided', hint: 'Neutral position', difficulty: 'expert' },
  { idiom: 'take it with a grain of salt', meaning: 'Don\'t believe completely', hint: 'Skepticism', difficulty: 'expert' },
  { idiom: 'the ball is in your court', meaning: 'Your turn', hint: 'Your move', difficulty: 'expert' },
  { idiom: 'the best of both worlds', meaning: 'Two good things', hint: 'Ideal situation', difficulty: 'expert' },
  { idiom: 'the devil is in the details', meaning: 'Small things matter', hint: 'Attention to detail', difficulty: 'expert' },
  { idiom: 'the last straw', meaning: 'Final limit', hint: 'Breaking point', difficulty: 'expert' },
  { idiom: 'throw in the towel', meaning: 'Give up', hint: 'Quitting', difficulty: 'expert' },
  { idiom: 'time flies when you\'re having fun', meaning: 'Time passes quickly', hint: 'Fun moments', difficulty: 'expert' },
  { idiom: 'under the radar', meaning: 'Undetected', hint: 'Hidden', difficulty: 'expert' },
  { idiom: 'up in the air', meaning: 'Uncertain', hint: 'Unresolved', difficulty: 'expert' },
  { idiom: 'when pigs fly', meaning: 'Never', hint: 'Impossible', difficulty: 'expert' },
  { idiom: 'you can\'t have your cake and eat it too', meaning: 'Can\'t have both', hint: 'Make a choice', difficulty: 'expert' },
  { idiom: 'a dime a dozen', meaning: 'Common and cheap', hint: 'Worth little', difficulty: 'master' },
  { idiom: 'bury the hatchet', meaning: 'Make peace', hint: 'End conflict', difficulty: 'master' },
  { idiom: 'cold feet', meaning: 'Nervous', hint: 'Anxious feeling', difficulty: 'master' },
  { idiom: 'cry over spilled milk', meaning: 'Don\'t worry about past', hint: 'Move on', difficulty: 'master' },
  { idiom: 'curiosity killed the cat', meaning: 'Curiosity can be dangerous', hint: 'Warning', difficulty: 'master' },
  { idiom: 'don\'t count your chickens before they hatch', meaning: 'Don\'t assume', hint: 'Be careful', difficulty: 'master' },
  { idiom: 'every cloud has a silver lining', meaning: 'Good in bad', hint: 'Optimistic', difficulty: 'master' },
  { idiom: 'fly off the handle', meaning: 'Get angry quickly', hint: 'Sudden anger', difficulty: 'master' },
  { idiom: 'have your head in the clouds', meaning: 'Daydreaming', hint: 'Not focused', difficulty: 'master' },
  { idiom: 'hit the hay', meaning: 'Go to sleep', hint: 'Bedtime', difficulty: 'master' },
  { idiom: 'keep something at bay', meaning: 'Keep away', hint: 'Distance', difficulty: 'master' },
  { idiom: 'make ends meet', meaning: 'Cover expenses', hint: 'Financial struggle', difficulty: 'master' },
  { idiom: 'pull strings', meaning: 'Use influence', hint: 'Connections', difficulty: 'master' },
  { idiom: 'see the light', meaning: 'Understand', hint: 'Realization', difficulty: 'master' },
  { idiom: 'steal someone\'s thunder', meaning: 'Take credit', hint: 'Taking spotlight', difficulty: 'master' },
  { idiom: 'strike while the iron is hot', meaning: 'Act quickly', hint: 'Opportunity timing', difficulty: 'master' },
  { idiom: 'take the bull by the horns', meaning: 'Face directly', hint: 'Confront', difficulty: 'master' },
  { idiom: 'the early bird catches the worm', meaning: 'Success comes early', hint: 'Timing matters', difficulty: 'master' },
]

const LEVEL_SETTINGS = [
  { difficulty: 'easy', timeLimit: 30, hints: 2 },  // Level 1
  { difficulty: 'easy', timeLimit: 25, hints: 1 },  // Level 2
  { difficulty: 'easy', timeLimit: 20, hints: 0 },  // Level 3
  { difficulty: 'medium', timeLimit: 35, hints: 2 },  // Level 4
  { difficulty: 'medium', timeLimit: 30, hints: 1 },  // Level 5
  { difficulty: 'medium', timeLimit: 25, hints: 0 },  // Level 6
  { difficulty: 'medium', timeLimit: 20, hints: 0 },  // Level 7
  { difficulty: 'hard', timeLimit: 40, hints: 2 },  // Level 8
  { difficulty: 'hard', timeLimit: 35, hints: 1 },  // Level 9
  { difficulty: 'hard', timeLimit: 30, hints: 0 },  // Level 10
  { difficulty: 'hard', timeLimit: 25, hints: 0 },  // Level 11
  { difficulty: 'hard', timeLimit: 20, hints: 0 },  // Level 12
  { difficulty: 'expert', timeLimit: 45, hints: 2 },  // Level 13
  { difficulty: 'expert', timeLimit: 40, hints: 1 },  // Level 14
  { difficulty: 'expert', timeLimit: 35, hints: 0 },  // Level 15
  { difficulty: 'expert', timeLimit: 30, hints: 0 },  // Level 16
  { difficulty: 'expert', timeLimit: 25, hints: 0 },  // Level 17
  { difficulty: 'expert', timeLimit: 20, hints: 0 },  // Level 18
  { difficulty: 'master', timeLimit: 50, hints: 2 },  // Level 19
  { difficulty: 'master', timeLimit: 45, hints: 1 },  // Level 20
  { difficulty: 'master', timeLimit: 40, hints: 0 },  // Level 21
  { difficulty: 'master', timeLimit: 35, hints: 0 },  // Level 22
  { difficulty: 'master', timeLimit: 30, hints: 0 },  // Level 23
  { difficulty: 'master', timeLimit: 25, hints: 0 },  // Level 24
  { difficulty: 'master', timeLimit: 20, hints: 0 },  // Level 25
  { difficulty: 'master', timeLimit: 18, hints: 0 },  // Level 26
  { difficulty: 'master', timeLimit: 15, hints: 0 },  // Level 27
  { difficulty: 'master', timeLimit: 12, hints: 0 },  // Level 28
  { difficulty: 'master', timeLimit: 10, hints: 0 },  // Level 29
  { difficulty: 'master', timeLimit: 8, hints: 0 },  // Level 30
]

export default function IdiomRiddlePage() {
  const { t } = useTranslation()
  const { addSession } = useGameStore()

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'levelComplete' | 'gameOver' | 'victory'>('menu')
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [currentIdiom, setCurrentIdiom] = useState<(typeof IDIOMS)[0] | null>(null)
  const [options, setOptions] = useState<string[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [hintsRemaining, setHintsRemaining] = useState(2)
  const [hintShown, setHintShown] = useState(false)

  const settings = useMemo(
    () => LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)],
    [level]
  )

  const getLevelScore = useCallback(() => {
    const baseScore = level * 50
    const timeBonus = timeLeft * 3
    const hintPenalty = hintShown ? 15 : 0
    const wrongPenalty = wrongAttempts * 20
    return Math.max(0, baseScore + timeBonus - hintPenalty - wrongPenalty)
  }, [level, timeLeft, hintShown, wrongAttempts])

  const getIdiomsForDifficulty = useCallback((difficulty: string) => {
    return IDIOMS.filter(idiom => idiom.difficulty === difficulty)
  }, [])

  const generateLevel = useCallback(() => {
    const timeLimit = LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)].timeLimit
    setTimeLeft(timeLimit)
    setHintsRemaining(settings.hints)
    setHintShown(false)

    const idioms = getIdiomsForDifficulty(settings.difficulty)
    if (idioms.length === 0) return

    const idiom = idioms[Math.floor(Math.random() * idioms.length)]
    setCurrentIdiom(idiom)

    // Generate options (correct answer + 3 distractors)
    const allIdioms = IDIOMS.filter(i => i.idiom !== idiom.idiom)
    const distractors = allIdioms
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(i => i.meaning)

    const allOptions = [...distractors, idiom.meaning].sort(() => Math.random() - 0.5)
    setOptions(allOptions)
    setSelectedAnswer(null)
    setWrongAttempts(0)
  }, [level, settings.difficulty, settings.hints, getIdiomsForDifficulty])

  const handleAnswerClick = useCallback((answer: string) => {
    if (gameState !== 'playing' || selectedAnswer !== null) return

    setSelectedAnswer(answer)

    if (answer === currentIdiom?.meaning) {
      const levelScore = Math.round(getLevelScore())
      setScore(levelScore)
      setGameState('levelComplete')
    } else {
      setWrongAttempts(prev => prev + 1)
      if (wrongAttempts + 1 >= 2) {
        addSession({
          id: Date.now().toString(),
          gameId: 'idiom-riddle',
          difficulty: 'medium',
          score: totalScore,
          completedAt: new Date(),
          durationSeconds: 0
        })
        setGameState('gameOver')
      }
    }
  }, [gameState, selectedAnswer, currentIdiom, wrongAttempts, getLevelScore, totalScore, addSession])

  const showHint = useCallback(() => {
    if (gameState !== 'playing' || hintsRemaining <= 0 || hintShown) return
    setHintShown(true)
    setHintsRemaining(prev => prev - 1)
  }, [gameState, hintsRemaining, hintShown])

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
        gameId: 'idiom-riddle',
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
            gameId: 'idiom-riddle',
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link
          href="/language"
          className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium mb-6 text-sm md:text-base lg:text-lg"
        >
          <span className="mr-2">←</span> {t('back', 'Back')}
        </Link>

        <h1 className="text-3xl md:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
          {t('idiomRiddle.title', 'Idiom Riddle')}
        </h1>
        <p className="text-lg text-gray-700 font-medium mb-8">
          {t('idiomRiddle.description', 'Guess the meaning of these idioms!')}
        </p>

        {/* Menu */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">💭</div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
              Level {level}
            </h2>
            <div className="bg-orange-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 mb-2">{t('idiomRiddle.levelInfo', 'Level Settings')}:</h3>
              <ul className="text-gray-700 space-y-1 font-medium">
                <li>• {t('idiomRiddle.difficulty', 'Difficulty')}: {settings.difficulty}</li>
                <li>• {t('idiomRiddle.timeLimit', 'Time Limit')}: {settings.timeLimit}s</li>
                <li>• {t('idiomRiddle.hints', 'Hints Available')}: {settings.hints}</li>
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
        {gameState === 'playing' && currentIdiom && (
          <>
            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('idiomRiddle.level', 'Level')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">{level}/{MAX_LEVELS}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('idiomRiddle.score', 'Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-amber-600">{totalScore}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('idiomRiddle.timeLeft', 'Time')}</p>
                  <p className={`text-xl md:text-2xl lg:text-3xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-orange-600'}`}>{timeLeft}s</p>
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

            {/* Idiom Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
              <div className="bg-orange-50 rounded-xl p-6 mb-4">
                <p className="text-sm text-gray-500 mb-2">{t('idiomRiddle.whatDoesThisMean', 'What does this mean?')}</p>
                <p className="text-2xl md:text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">&quot;{currentIdiom.idiom}&quot;</p>
              </div>

              {hintShown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-yellow-50 rounded-lg p-3 mb-4"
                >
                  <p className="text-yellow-700 font-medium">{t('idiomRiddle.hint', 'Hint')}: {currentIdiom.hint}</p>
                </motion.div>
              )}
            </div>

            {/* Answer Options */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="grid gap-3">
                {options.map((option, index) => {
                  let bgColor = 'bg-gray-100 hover:bg-gray-200'
                  let textColor = 'text-gray-700'

                  if (selectedAnswer) {
                    if (option === currentIdiom.meaning) {
                      bgColor = 'bg-green-500'
                      textColor = 'text-white'
                    } else if (option === selectedAnswer) {
                      bgColor = 'bg-red-500'
                      textColor = 'text-white'
                    }
                  }

                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: selectedAnswer ? 1 : 1.02 }}
                      whileTap={{ scale: selectedAnswer ? 1 : 0.98 }}
                      onClick={() => handleAnswerClick(option)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-4 rounded-xl font-bold text-sm md:text-base lg:text-lg transition-all ${bgColor} ${textColor}`}
                    >
                      {option}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Hint Button */}
            <button
              onClick={showHint}
              disabled={hintsRemaining <= 0 || hintShown}
              className={`w-full text-xl font-bold py-4 rounded-xl shadow-lg transition-all mb-4 ${
                hintsRemaining > 0 && !hintShown
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:from-yellow-500 hover:to-orange-500'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              💡 {t('idiomRiddle.showHint', 'Show Hint')} ({hintsRemaining})
            </button>

            {/* Wrong Attempts */}
            {wrongAttempts > 0 && (
              <div className="bg-red-50 rounded-xl p-4 text-center">
                <p className="text-red-600 font-bold">{t('idiomRiddle.wrongAttempts', 'Wrong attempts:')} {wrongAttempts} (-{wrongAttempts * 20} points)</p>
              </div>
            )}
          </>
        )}

        {/* Level Complete */}
        {gameState === 'levelComplete' && currentIdiom && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-orange-600 mb-4">{t('idiomRiddle.correct', 'Correct!')}</h2>
            <div className="bg-orange-50 rounded-xl p-6 mb-6">
              <p className="text-xl text-gray-700 mb-2">
                &quot;{currentIdiom.idiom}&quot;
              </p>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">{currentIdiom.meaning}</p>
              <p className="text-gray-500 mt-2">{currentIdiom.hint}</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('idiomRiddle.levelScore', 'Level Score')}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">{Math.round(score)}</p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{t('idiomRiddle.totalScore', 'Total Score')}</p>
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
        {gameState === 'gameOver' && currentIdiom && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">{t('idiomRiddle.gameOver', 'Wrong!')}</h2>
            <div className="bg-orange-50 rounded-xl p-6 mb-6">
              <p className="text-xl text-gray-700 mb-2">
                &quot;{currentIdiom.idiom}&quot;
              </p>
              <p className="text-2xl text-gray-700 mb-2">{t('idiomRiddle.means', 'means')}</p>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">{currentIdiom.meaning}</p>
              <p className="text-gray-700 text-sm font-medium mt-4">{t('idiomRiddle.finalScore', 'Final Score')}</p>
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-orange-600 mb-4">{t('idiomRiddle.victory', 'Congratulations!')}</h2>
            <p className="text-xl text-gray-700 font-medium mb-6">
              {t('idiomRiddle.victoryMessage', 'You completed all {count} levels!', { count: MAX_LEVELS })}
            </p>
            <div className="bg-orange-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 text-sm font-medium">{t('idiomRiddle.finalScore', 'Final Score')}</p>
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
