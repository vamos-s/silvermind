import { create } from 'zustand'
import { GameSession, Difficulty } from './types'

interface GameStore {
  currentDifficulty: Difficulty
  currentGame: string | null
  recentSessions: GameSession[]
  setDifficulty: (difficulty: Difficulty) => void
  setCurrentGame: (gameId: string | null) => void
  addSession: (session: GameSession) => void
}

export const useGameStore = create<GameStore>((set) => ({
  currentDifficulty: 'easy',
  currentGame: null,
  recentSessions: [],
  setDifficulty: (difficulty) => set({ currentDifficulty: difficulty }),
  setCurrentGame: (gameId) => set({ currentGame: gameId }),
  addSession: (session) => set((state) => ({ 
    recentSessions: [session, ...state.recentSessions].slice(0, 10) 
  }))
}))
