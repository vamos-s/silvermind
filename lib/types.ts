export type Difficulty = 'easy' | 'medium' | 'hard'

export type GameCategory = 'memory' | 'pattern' | 'logic' | 'reaction' | 'spatial'

export interface Game {
  id: string
  slug: string
  category: GameCategory
  title: Record<string, string>
  description: Record<string, string>
  minDifficulty: Difficulty
  maxDifficulty: Difficulty
  icon: string
}

export interface GameSession {
  id: string
  userId?: string
  gameId: string
  difficulty: Difficulty
  score: number
  completedAt: Date
  durationSeconds: number
}

export interface Achievement {
  id: string
  slug: string
  title: Record<string, string>
  description: Record<string, string>
  icon: string
  requirement: any
}

export interface UserProgress {
  totalScore: number
  gamesPlayed: number
  bestScores: Record<string, number>
}
