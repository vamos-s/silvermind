import { Difficulty, QuestionLevelSettings } from '../types'

/**
 * Selective Search Game - Find targets among distractors (Stroop test style)
 */
export interface SelectiveSearchLevelSettings extends QuestionLevelSettings {
  targetColor: string
  targetWord: string
  distractorCount: number
  stroopMode: boolean // If true, color and word might mismatch
}

export const SELECTIVE_SEARCH_LEVELS: Record<Difficulty, SelectiveSearchLevelSettings> = {
  easy: {
    difficulty: 'easy',
    questionCount: 10,
    optionCount: 4,
    targetColor: 'red',
    targetWord: 'RED',
    distractorCount: 6,
    stroopMode: false,
    inputTime: 30,
  },
  medium: {
    difficulty: 'medium',
    questionCount: 15,
    optionCount: 6,
    targetColor: 'blue',
    targetWord: 'BLUE',
    distractorCount: 10,
    stroopMode: true,
    inputTime: 45,
  },
  hard: {
    difficulty: 'hard',
    questionCount: 20,
    optionCount: 8,
    targetColor: 'green',
    targetWord: 'GREEN',
    distractorCount: 15,
    stroopMode: true,
    inputTime: 60,
  },
  expert: {
    difficulty: 'expert',
    questionCount: 25,
    optionCount: 10,
    targetColor: 'yellow',
    targetWord: 'YELLOW',
    distractorCount: 20,
    stroopMode: true,
    inputTime: 75,
  },
  master: {
    difficulty: 'master',
    questionCount: 30,
    optionCount: 12,
    targetColor: 'purple',
    targetWord: 'PURPLE',
    distractorCount: 25,
    stroopMode: true,
    inputTime: 90,
  },
}
