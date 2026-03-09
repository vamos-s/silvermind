'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'
import { Difficulty } from '@/lib/types'
import { SettingsPanel } from '@/components/SettingsPanel'

export default function LeaderboardPage() {
  const { t } = useTranslation()
  const { sessions, bestScores, darkMode, updateSessionPlayerName } = useGameStore()
  const [selectedGame, setSelectedGame] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all')
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editingPlayerName, setEditingPlayerName] = useState<string>('')

  // Get unique game IDs from sessions
  const gameIds = Array.from(new Set(sessions.map(s => s.gameId)))

  // Format game ID for display
  const formatGameId = (gameId: string) => {
    return gameId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  // Filter and sort sessions
  const filteredSessions = sessions
    .filter(session => {
      const gameMatch = selectedGame === 'all' || session.gameId === selectedGame
      const difficultyMatch = selectedDifficulty === 'all' || session.difficulty === selectedDifficulty
      return gameMatch && difficultyMatch
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)

  // Get best scores per game and difficulty
  const bestScoresList = Object.entries(bestScores)
    .flatMap(([gameId, difficulties]) => 
      Object.entries(difficulties).map(([difficulty, score]) => ({
        gameId,
        difficulty: difficulty as Difficulty,
        score
      }))
    )
    .filter(item => {
      const gameMatch = selectedGame === 'all' || item.gameId === selectedGame
      const difficultyMatch = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty
      return gameMatch && difficultyMatch
    })
    .sort((a, b) => b.score - a.score)

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-800'}`}>
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
            {t('leaderboardTitle')}
          </h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Settings Panel - Fixed Position */}
      <SettingsPanel />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                {t('filterByGame')}
              </label>
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 dark:border-gray-500 text-gray-800'}`}
              >
                <option value="all">{t('allGames')}</option>
                {gameIds.map(gameId => (
                  <option key={gameId} value={gameId}>
                    {formatGameId(gameId)}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-48">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                {t('difficulty')}
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty | 'all')}
                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 dark:border-gray-500 text-gray-800'}`}
              >
                <option value="all">{t('allDifficulties')}</option>
                <option value="easy">{t('easy')}</option>
                <option value="medium">{t('medium')}</option>
                <option value="hard">{t('hard')}</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Best Scores Section */}
        {bestScoresList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`mb-8 rounded-2xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('bestScores')}
            </h2>
            <div className="space-y-3">
              {bestScoresList.map((item, index) => (
                <motion.div
                  key={`${item.gameId}-${item.difficulty}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    index === 0 ? 'bg-yellow-50 dark:bg-yellow-900/30' :
                    index === 1 ? 'bg-gray-50 dark:bg-gray-700/50' :
                    index === 2 ? 'bg-orange-50 dark:bg-orange-900/30' :
                    'bg-gray-50 dark:bg-gray-700/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-50 dark:bg-slate-7000 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-orange-50 dark:bg-slate-7000 text-white' :
                      'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {formatGameId(item.gameId)}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {t(item.difficulty)}
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {item.score}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Sessions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('topScores')}
          </h2>

          {filteredSessions.length === 0 ? (
            <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <p className="text-6xl mb-4">🎮</p>
              <p>{t('noScores')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * (index + 1) }}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    index === 0 ? 'bg-yellow-50 dark:bg-yellow-900/30' :
                    index === 1 ? 'bg-gray-50 dark:bg-gray-700/50' :
                    index === 2 ? 'bg-orange-50 dark:bg-orange-900/30' :
                    'bg-gray-50 dark:bg-gray-700/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-50 dark:bg-slate-7000 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-orange-50 dark:bg-slate-7000 text-white' :
                      'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      {editingSessionId === session.id ? (
                        <input
                          type="text"
                          value={editingPlayerName}
                          onChange={(e) => setEditingPlayerName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && editingPlayerName.trim()) {
                              updateSessionPlayerName(session.id, editingPlayerName.trim())
                              setEditingSessionId(null)
                            } else if (e.key === 'Escape') {
                              setEditingSessionId(null)
                            }
                          }}
                          onBlur={() => {
                            if (editingPlayerName.trim()) {
                              updateSessionPlayerName(session.id, editingPlayerName.trim())
                            }
                            setEditingSessionId(null)
                          }}
                          autoFocus
                          className={`w-32 p-1 rounded text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} border ${darkMode ? 'border-gray-600' : 'border-gray-300 dark:border-gray-500'}`}
                        />
                      ) : (
                        <p
                          onClick={() => {
                            setEditingSessionId(session.id)
                            setEditingPlayerName(session.playerName || '')
                          }}
                          className={`font-semibold cursor-pointer hover:underline ${darkMode ? 'text-white' : 'text-gray-800'}`}
                        >
                          {session.playerName || t('anonymous', 'Anonymous')}
                        </p>
                      )}
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {t(session.difficulty)} • {new Date(session.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {session.score}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
