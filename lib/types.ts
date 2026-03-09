export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'master'

export type GameCategory = 'memory' | 'pattern' | 'logic' | 'reaction' | 'spatial' | 'attention' | 'language'

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

// Achievement types
export type AchievementType = 
  | 'first_play'
  | 'score_100'
  | 'score_500'
  | 'play_all_games'
  | 'streak_3'
  | 'streak_7'
  | 'perfect_score'

export interface AchievementData {
  id: AchievementType
  title: Record<string, string>
  description: Record<string, string>
  icon: string
  unlocked: boolean
  unlockedAt?: Date
}

// Local storage types
export interface LocalStorageData {
  anonymousId: string
  sessions: GameSession[]
  bestScores: Record<string, Record<Difficulty, number>>
  achievements: AchievementType[]
  achievementProgress: Record<AchievementType, number>
  dailyChallenges: DailyChallenge[]
  playDates: string[] // ISO date strings for streak tracking
  gamesPlayed: Set<string> // Track unique games played
}

export interface DailyChallenge {
  id: string
  date: string // ISO date string
  type: 'score' | 'complete' | 'master'
  target: number
  gameId?: string // For score/master challenges
  description: Record<string, string>
  completed: boolean
  completedAt?: Date
}

export interface LeaderboardEntry {
  rank: number
  gameId: string
  score: number
  difficulty: Difficulty
  completedAt: Date
}
