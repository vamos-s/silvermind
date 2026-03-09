'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'
import { DailyChallenge } from '@/lib/types'
import { SettingsPanel } from '@/components/SettingsPanel'

export default function ChallengesPage() {
  const { t } = useTranslation()
  const { 
    dailyChallenges, 
    generateDailyChallenges, 
    completeChallenge,
    sessions,
    darkMode 
  } = useGameStore()
  const [notification, setNotification] = useState<string | null>(null)

  // Generate daily challenges on load
  useEffect(() => {
    generateDailyChallenges()
  }, [generateDailyChallenges])

  // Get today's challenges
  const today = new Date().toISOString().split('T')[0]
  const todayChallenges = dailyChallenges.filter(c => c.date === today)

  // Get yesterday's challenges for reference
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]
  const yesterdayChallenges = dailyChallenges.filter(c => c.date === yesterdayStr)

  // Check challenge progress
  const getChallengeProgress = (challenge: DailyChallenge): number => {
    switch (challenge.type) {
      case 'score':
        const scoreProgress = sessions
          .filter(s => s.gameId === challenge.gameId)
          .reduce((max, s) => Math.max(max, s.score), 0)
        return Math.min(100, (scoreProgress / challenge.target) * 100)

      case 'complete':
        const todaySessions = sessions.filter(s => 
          new Date(s.completedAt).toISOString().split('T')[0] === today
        )
        return Math.min(100, (todaySessions.length / challenge.target) * 100)

      case 'master':
        const hardSessions = sessions.filter(s => 
          s.difficulty === 'hard' && 
          new Date(s.completedAt).toISOString().split('T')[0] === today
        )
        return Math.min(100, (hardSessions.length / challenge.target) * 100)

      default:
        return 0
    }
  }

  const getChallengeStatus = (challenge: DailyChallenge): string => {
    if (challenge.completed) return 'completed'
    const progress = getChallengeProgress(challenge)
    if (progress === 0) return 'notStarted'
    return 'inProgress'
  }

  const getProgressText = (challenge: DailyChallenge): string => {
    switch (challenge.type) {
      case 'score':
        const scoreProgress = sessions
          .filter(s => s.gameId === challenge.gameId)
          .reduce((max, s) => Math.max(max, s.score), 0)
        return `${scoreProgress}/${challenge.target}`

      case 'complete':
        const todaySessions = sessions.filter(s => 
          new Date(s.completedAt).toISOString().split('T')[0] === today
        )
        return `${todaySessions.length}/${challenge.target}`

      case 'master':
        const hardSessions = sessions.filter(s => 
          s.difficulty === 'hard' && 
          new Date(s.completedAt).toISOString().split('T')[0] === today
        )
        return `${hardSessions.length}/${challenge.target}`

      default:
        return '0/0'
    }
  }

  const handleCompleteChallenge = (challengeId: string) => {
    completeChallenge(challengeId)
    setNotification(t('challengeCompleted'))
    setTimeout(() => setNotification(null), 3000)
  }

  const allCompleted = todayChallenges.length > 0 && 
    todayChallenges.every(c => c.completed)

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <header className={`p-6 shadow-sm ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
            >
              <span>←</span>
              <span>{t('back')}</span>
            </motion.button>
          </Link>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('challengesTitle')}
          </h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Settings Panel - Fixed Position */}
      <SettingsPanel />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Today's Challenges */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('todayChallenges')}
          </h2>

          {allCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 bg-gradient-to-r from-green-400 to-emerald-500 text-white p-6 rounded-2xl text-center"
            >
              <span className="text-4xl mb-2 block">🎉</span>
              <p className="text-xl font-bold">{t('allChallengesCompleted')}</p>
            </motion.div>
          )}

          <div className="space-y-4">
            {todayChallenges.map((challenge, index) => {
              const progress = getChallengeProgress(challenge)
              const status = getChallengeStatus(challenge)
              const progressText = getProgressText(challenge)
              const isCompleted = status === 'completed'
              const canComplete = progress >= 100 && !isCompleted

              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                  className={`rounded-2xl p-6 shadow-lg border-2 ${
                    isCompleted
                      ? 'border-green-400 dark:border-green-600'
                      : progress > 0
                        ? 'border-purple-400 dark:border-purple-600'
                        : 'border-gray-200 dark:border-gray-600 dark:border-gray-700'
                  } ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          challenge.type === 'score' ? 'bg-blue-600 text-white' :
                          challenge.type === 'complete' ? 'bg-green-600 text-white' :
                          'bg-purple-600 text-white'
                        }`}>
                          {t(`challengeType.${challenge.type}`)}
                        </span>
                        {isCompleted && (
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-green-600 text-white">
                            {t('completed')}
                          </span>
                        )}
                      </div>
                      <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {challenge.description.en}
                      </h3>
                    </div>
                    {isCompleted && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-3xl"
                      >
                        ✅
                      </motion.span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className={`relative h-4 rounded-full overflow-hidden mb-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, delay: 0.2 * index }}
                      className={`absolute h-full rounded-full ${
                        isCompleted
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {progressText}
                    </p>

                    {canComplete && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCompleteChallenge(challenge.id)}
                        className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-500 hover:to-emerald-600 transition-colors"
                      >
                        {t('completed')}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Yesterday's Challenges */}
        {yesterdayChallenges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Yesterday
            </h2>
            <div className="space-y-3 opacity-60">
              {yesterdayChallenges.map((challenge, index) => (
                <div
                  key={challenge.id}
                  className={`rounded-xl p-4 border-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 dark:border-gray-600'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {challenge.description.en}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {challenge.completed ? `✓ ${t('completed')}` : `✗ ${t('notStarted')}`}
                      </p>
                    </div>
                    {challenge.completed && (
                      <span className="text-2xl">🎯</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      {/* Challenge Completed Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">🎯</span>
              <div>
                <p className="font-bold">{notification}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
