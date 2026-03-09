import { create } from 'zustand'
import { GameSession, Difficulty, AchievementType, DailyChallenge, LocalStorageData } from './types'

// Local storage keys
const STORAGE_KEY = 'silvermind_data'

// Get or create anonymous ID
const getAnonymousId = (): string => {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem('silvermind_anonymous_id')
  if (!id) {
    id = 'anon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('silvermind_anonymous_id', id)
  }
  return id
}

// Load data from localStorage
const loadLocalStorageData = (): LocalStorageData => {
  if (typeof window === 'undefined') {
    return {
      anonymousId: '',
      sessions: [],
      bestScores: {},
      achievements: [],
      achievementProgress: {
        first_play: 0,
        score_100: 0,
        score_500: 0,
        play_all_games: 0,
        streak_3: 0,
        streak_7: 0,
        perfect_score: 0
      },
      dailyChallenges: [],
      playDates: [],
      gamesPlayed: new Set()
    }
  }
  
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      return {
        ...parsed,
        gamesPlayed: new Set(parsed.gamesPlayed || []),
        sessions: (parsed.sessions || []).map((s: any) => ({
          ...s,
          completedAt: new Date(s.completedAt)
        }))
      }
    }
  } catch (e) {
    console.error('Failed to load local storage data:', e)
  }
  
  return {
    anonymousId: getAnonymousId(),
    sessions: [],
    bestScores: {},
    achievements: [],
    achievementProgress: {
      first_play: 0,
      score_100: 0,
      score_500: 0,
      play_all_games: 0,
      streak_3: 0,
      streak_7: 0,
      perfect_score: 0
    },
    dailyChallenges: [],
    playDates: [],
    gamesPlayed: new Set()
  }
}

// Save data to localStorage
const saveLocalStorageData = (data: LocalStorageData) => {
  if (typeof window === 'undefined') return
  try {
    const toSave = {
      ...data,
      gamesPlayed: Array.from(data.gamesPlayed)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch (e) {
    console.error('Failed to save local storage data:', e)
  }
}

interface GameStore {
  currentDifficulty: Difficulty
  currentGame: string | null
  recentSessions: GameSession[]
  darkMode: boolean
  anonymousId: string
  sessions: GameSession[]
  bestScores: Record<string, Record<Difficulty, number>>
  achievements: AchievementType[]
  achievementProgress: Record<AchievementType, number>
  dailyChallenges: DailyChallenge[]
  playDates: string[]
  gamesPlayed: Set<string>
  setDifficulty: (difficulty: Difficulty) => void
  setCurrentGame: (gameId: string | null) => void
  addSession: (session: GameSession) => void
  toggleDarkMode: () => void
  updateBestScore: (gameId: string, difficulty: Difficulty, score: number) => void
  unlockAchievement: (achievement: AchievementType) => void
  checkAchievements: (session: GameSession, accuracy?: number) => void
  generateDailyChallenges: () => void
  completeChallenge: (challengeId: string) => void
  resetAllData: () => void
  updateSessionPlayerName: (sessionId: string, playerName: string) => void
}

const initialData = loadLocalStorageData()

export const useGameStore = create<GameStore>((set, get) => ({
  currentDifficulty: 'easy',
  currentGame: null,
  recentSessions: [],
  darkMode: typeof window !== 'undefined' ? localStorage.getItem('darkMode') === 'true' : false,
  anonymousId: initialData.anonymousId,
  sessions: initialData.sessions,
  bestScores: initialData.bestScores,
  achievements: initialData.achievements,
  achievementProgress: initialData.achievementProgress,
  dailyChallenges: initialData.dailyChallenges,
  playDates: initialData.playDates,
  gamesPlayed: initialData.gamesPlayed,
  
  setDifficulty: (difficulty) => set({ currentDifficulty: difficulty }),
  setCurrentGame: (gameId) => set({ currentGame: gameId }),
  
  addSession: (session) => set((state) => {
    const newSessions = [session, ...state.sessions]
    
    // Update play dates for streak tracking
    const today = new Date().toISOString().split('T')[0]
    const playDates = state.playDates.includes(today) 
      ? state.playDates 
      : [...state.playDates, today]
    
    // Track games played
    const gamesPlayed = new Set(state.gamesPlayed)
    gamesPlayed.add(session.gameId)
    
    // Update recent sessions (max 10)
    const recentSessions = [session, ...state.recentSessions].slice(0, 10)
    
    // Save to localStorage
    saveLocalStorageData({
      anonymousId: state.anonymousId,
      sessions: newSessions,
      bestScores: state.bestScores,
      achievements: state.achievements,
      achievementProgress: state.achievementProgress,
      dailyChallenges: state.dailyChallenges,
      playDates,
      gamesPlayed
    })
    
    return { sessions: newSessions, recentSessions, playDates, gamesPlayed }
  }),
  
  toggleDarkMode: () => set((state) => {
    const newMode = !state.darkMode
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', String(newMode))
      if (newMode) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.add('light')
      }
    }
    return { darkMode: newMode }
  }),

  // Sync darkMode from localStorage (useful when ThemeToggle changes it externally)
  syncDarkMode: () => {
    const fromStorage = typeof window !== 'undefined'
      ? localStorage.getItem('darkMode') === 'true'
      : false
    if (get().darkMode !== fromStorage) {
      return set({ darkMode: fromStorage })
    }
    return {}
  },
  
  updateBestScore: (gameId, difficulty, score) => set((state) => {
    const currentBest = state.bestScores[gameId]?.[difficulty] || 0
    if (score <= currentBest) return state
    
    const newBestScores = {
      ...state.bestScores,
      [gameId]: {
        ...state.bestScores[gameId],
        [difficulty]: score
      }
    }
    
    saveLocalStorageData({
      anonymousId: state.anonymousId,
      sessions: state.sessions,
      bestScores: newBestScores,
      achievements: state.achievements,
      achievementProgress: state.achievementProgress,
      dailyChallenges: state.dailyChallenges,
      playDates: state.playDates,
      gamesPlayed: state.gamesPlayed
    })
    
    return { bestScores: newBestScores }
  }),
  
  unlockAchievement: (achievement) => set((state) => {
    if (state.achievements.includes(achievement)) return state
    
    const newAchievements = [...state.achievements, achievement]
    
    saveLocalStorageData({
      anonymousId: state.anonymousId,
      sessions: state.sessions,
      bestScores: state.bestScores,
      achievements: newAchievements,
      achievementProgress: state.achievementProgress,
      dailyChallenges: state.dailyChallenges,
      playDates: state.playDates,
      gamesPlayed: state.gamesPlayed
    })
    
    return { achievements: newAchievements }
  }),
  
  checkAchievements: (session, accuracy) => {
    const state = get()
    const newAchievements: AchievementType[] = []
    const newProgress = { ...state.achievementProgress }
    
    // First play
    if (!state.achievements.includes('first_play')) {
      newAchievements.push('first_play')
      newProgress.first_play = 1
    }
    
    // Score achievements
    if (session.score >= 100 && !state.achievements.includes('score_100')) {
      newAchievements.push('score_100')
      newProgress.score_100 = session.score
    }
    
    if (session.score >= 500 && !state.achievements.includes('score_500')) {
      newAchievements.push('score_500')
      newProgress.score_500 = session.score
    }
    
    // Perfect score (100% accuracy)
    if (accuracy === 100 && !state.achievements.includes('perfect_score')) {
      newAchievements.push('perfect_score')
      newProgress.perfect_score = 100
    }
    
    // Play all games
    const allGames = ['number-recall', 'sequence-memory', 'chess-memory', 'pattern-match', 'mental-rotation', 'mental-math', 'color-match', 'quick-reaction', 'aim-trainer', 'pattern-in-3d', 'mental-rotation-advanced', 'shape-reconstruction', 'perspective-matching', 'cube-navigation']
    if (state.gamesPlayed.size >= allGames.length && !state.achievements.includes('play_all_games')) {
      newAchievements.push('play_all_games')
      newProgress.play_all_games = state.gamesPlayed.size
    }
    
    // Streak achievements
    const today = new Date()
    const uniqueDates = new Set(state.playDates)
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
    
    if (currentStreak >= 3 && !state.achievements.includes('streak_3')) {
      newAchievements.push('streak_3')
      newProgress.streak_3 = currentStreak
    }
    
    if (currentStreak >= 7 && !state.achievements.includes('streak_7')) {
      newAchievements.push('streak_7')
      newProgress.streak_7 = currentStreak
    }
    
    // Apply changes
    if (newAchievements.length > 0) {
      const updatedAchievements = [...state.achievements, ...newAchievements]
      saveLocalStorageData({
        anonymousId: state.anonymousId,
        sessions: state.sessions,
        bestScores: state.bestScores,
        achievements: updatedAchievements,
        achievementProgress: newProgress,
        dailyChallenges: state.dailyChallenges,
        playDates: state.playDates,
        gamesPlayed: state.gamesPlayed
      })
      
      set({
        achievements: updatedAchievements,
        achievementProgress: newProgress
      })
      
      return newAchievements
    }
    
    return []
  },
  
  generateDailyChallenges: () => set((state) => {
    const today = new Date().toISOString().split('T')[0]
    const existingChallenges = state.dailyChallenges.filter(c => c.date === today)
    
    if (existingChallenges.length > 0) {
      return state // Already generated today
    }
    
    const gameIds = ['number-recall', 'sequence-memory', 'chess-memory', 'pattern-match', 'mental-rotation', 'mental-math', 'color-match', 'quick-reaction', 'aim-trainer', 'pattern-in-3d', 'mental-rotation-advanced', 'shape-reconstruction', 'perspective-matching', 'cube-navigation']
    const randomGame = gameIds[Math.floor(Math.random() * gameIds.length)]
    
    const newChallenges: DailyChallenge[] = [
      {
        id: `challenge_${today}_1`,
        date: today,
        type: 'score',
        target: 500,
        gameId: randomGame,
        description: {
          en: `Score ${500}+ in ${randomGame.replace('-', ' ')}`,
          ko: `${randomGame.replace('-', ' ')}에서 ${500}+ 점 달성`
        },
        completed: false
      },
      {
        id: `challenge_${today}_2`,
        date: today,
        type: 'complete',
        target: 5,
        description: {
          en: 'Complete 5 games',
          ko: '5개 게임 완료'
        },
        completed: false
      },
      {
        id: `challenge_${today}_3`,
        date: today,
        type: 'master',
        target: 3,
        description: {
          en: 'Master 3 levels on hard',
          ko: '어려움 난이도에서 3개 레벨 마스터'
        },
        completed: false
      }
    ]
    
    const updatedChallenges = [...newChallenges, ...state.dailyChallenges]
    
    saveLocalStorageData({
      anonymousId: state.anonymousId,
      sessions: state.sessions,
      bestScores: state.bestScores,
      achievements: state.achievements,
      achievementProgress: state.achievementProgress,
      dailyChallenges: updatedChallenges,
      playDates: state.playDates,
      gamesPlayed: state.gamesPlayed
    })
    
    return { dailyChallenges: updatedChallenges }
  }),
  
  completeChallenge: (challengeId) => set((state) => {
    const updatedChallenges = state.dailyChallenges.map(c => 
      c.id === challengeId ? { ...c, completed: true, completedAt: new Date() } : c
    )
    
    saveLocalStorageData({
      anonymousId: state.anonymousId,
      sessions: state.sessions,
      bestScores: state.bestScores,
      achievements: state.achievements,
      achievementProgress: state.achievementProgress,
      dailyChallenges: updatedChallenges,
      playDates: state.playDates,
      gamesPlayed: state.gamesPlayed
    })
    
    return { dailyChallenges: updatedChallenges }
  }),
  
  resetAllData: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem('silvermind_anonymous_id')
    }

    const newData = loadLocalStorageData()
    return {
      anonymousId: newData.anonymousId,
      sessions: newData.sessions,
      bestScores: newData.bestScores,
      achievements: newData.achievements,
      achievementProgress: newData.achievementProgress,
      dailyChallenges: newData.dailyChallenges,
      playDates: newData.playDates,
      gamesPlayed: newData.gamesPlayed
    }
  },

  updateSessionPlayerName: (sessionId: string, playerName: string) => set((state) => {
    const updatedSessions = state.sessions.map(session =>
      session.id === sessionId ? { ...session, playerName } : session
    )

    saveLocalStorageData({
      anonymousId: state.anonymousId,
      sessions: updatedSessions,
      bestScores: state.bestScores,
      achievements: state.achievements,
      achievementProgress: state.achievementProgress,
      dailyChallenges: state.dailyChallenges,
      playDates: state.playDates,
      gamesPlayed: state.gamesPlayed
    })

    return { sessions: updatedSessions }
  })
}))
