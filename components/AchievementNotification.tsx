'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { achievements } from '@/lib/achievements'
import { AchievementType } from '@/lib/types'

interface AchievementNotificationProps {
  achievement: AchievementType | null
  onClose: () => void
}

export default function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl shadow-2xl min-w-[300px]">
            <div className="flex items-start gap-4">
              <motion.span 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="text-4xl"
              >
                {achievements[achievement].icon}
              </motion.span>
              <div className="flex-1">
                <p className="font-bold text-sm">Achievement Unlocked!</p>
                <p className="text-lg font-semibold">{achievements[achievement].title.en}</p>
                <p className="text-xs opacity-90 mt-1">{achievements[achievement].description.en}</p>
              </div>
              <button 
                onClick={onClose}
                className="text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
