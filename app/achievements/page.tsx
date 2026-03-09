'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'
import { achievements as achievementData } from '@/lib/achievements'
import { AchievementType } from '@/lib/types'
import { SettingsPanel } from '@/components/SettingsPanel'

export default function AchievementsPage() {
  const { t } = useTranslation()
  const { achievements, darkMode, gamesPlayed, playDates } = useGameStore()
  const [notification, setNotification] = useState<AchievementType | null>(null)

  // Calculate progress for each achievement
  const getProgress = (achievementId: AchievementType): number => {
    switch (achievementId) {
      case 'first_play':
        return achievements.includes('first_play') ? 100 : 0
      case 'score_100':
        return achievements.includes('score_100') ? 100 : 0
      case 'score_500':
        return achievements.includes('score_500') ? 100 : 0
      case 'play_all_games':
        const totalGames = 14 // Total number of games
        return Math.min(100, (gamesPlayed.size / totalGames) * 100)
      case 'streak_3':
        const streak3 = calculateCurrentStreak()
        return Math.min(100, (streak3 / 3) * 100)
      case 'streak_7':
        const streak7 = calculateCurrentStreak()
        return Math.min(100, (streak7 / 7) * 100)
      case 'perfect_score':
        return achievements.includes('perfect_score') ? 100 : 0
      default:
        return 0
    }
  }

  const calculateCurrentStreak = (): number => {
    const today = new Date()
    const uniqueDates = new Set(playDates)
    let currentStreak = 0
    
    if (uniqueDates.has(today.toISOString().split('T')[0])) {
      currentStreak = 1
      for (let i = 1; i < 7; i++) {
        const checkDate = new Date(today)
        checkDate.setDate(checkDate.getDate() - i)
        if (uniqueDates.has(checkDate.toISOString().split('T')[0])) {
          currentStreak++
        } else {
          break
        }
      }
    }
    
    return currentStreak
  }

  const getProgressText = (achievementId: AchievementType): string => {
    switch (achievementId) {
      case 'play_all_games':
        return `${gamesPlayed.size}/14`
      case 'streak_3':
        return `${calculateCurrentStreak()}/3`
      case 'streak_7':
        return `${calculateCurrentStreak()}/7`
      default:
        return achievements.includes(achievementId) ? '✓' : ''
    }
  }

  const totalAchievements = Object.keys(achievementData).length
  const unlockedCount = achievements.length
  const progressPercentage = (unlockedCount / totalAchievements) * 100

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
            {t('achievementsTitle')}
          </h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Settings Panel - Fixed Position */}
      <SettingsPanel />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 rounded-2xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('totalAchievements')}
            </h2>
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {unlockedCount}/{totalAchievements}
            </span>
          </div>

          <div className={`relative h-4 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-purple-100'}`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            />
          </div>

          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
            {progressPercentage.toFixed(0)}% {t('progress')}
          </p>
        </motion.div>

        {/* Unlocked Achievements */}
        {achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('unlocked')} ({achievements.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((achievementId, index) => {
                const achievement = achievementData[achievementId]
                const titleKey = `achievement.${achievementId}.title`
                const descKey = `achievement.${achievementId}.description`
                const title = t(titleKey, achievement.title.en)
                const description = t(descKey, achievement.description.en)

                return (
                  <motion.div
                    key={achievementId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                    className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl p-4 border-2 border-yellow-300 dark:border-yellow-600"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 dark:text-white">
                          {title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Locked Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('locked')} ({totalAchievements - achievements.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(achievementData)
              .filter(([id]) => !achievements.includes(id as AchievementType))
              .map(([achievementId, achievement], index) => {
                const progress = getProgress(achievementId as AchievementType)
                const progressText = getProgressText(achievementId as AchievementType)
                const titleKey = `achievement.${achievementId}.title`
                const descKey = `achievement.${achievementId}.description`
                const title = t(titleKey, achievement.title.en)
                const description = t(descKey, achievement.description.en)

                return (
                  <motion.div
                    key={achievementId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * (index + 1) }}
                    className={`rounded-xl p-4 border-2 ${
                      darkMode
                        ? 'bg-gray-800'
                        : 'bg-white'
                    } ${
                      progress === 0
                        ? 'border-gray-300 dark:border-gray-500 opacity-60'
                        : 'border-purple-400'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-4xl grayscale opacity-50">{achievement.icon}</span>
                      <div className="flex-1">
                        <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {title}
                        </h4>
                        <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {description}
                        </p>

                        {/* Progress Bar */}
                        <div className={`relative h-2 rounded-full overflow-hidden ${
                          darkMode ? 'bg-gray-700' : 'bg-purple-100'
                        }`}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                            className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          />
                        </div>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                          {progressText}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
          </div>
        </motion.div>
      </main>

      {/* Achievement Unlocked Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{achievementData[notification].icon}</span>
              <div>
                <p className="font-bold">{t('achievementUnlocked')}</p>
                <p className="text-sm">{t(`achievement.${notification}.title`, achievementData[notification].title.en)}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
