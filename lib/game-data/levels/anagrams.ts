import { Difficulty, QuestionLevelSettings } from '../types'

/**
 * Anagrams Game - Create new words from same letters
 */
export interface AnagramsLevelSettings extends QuestionLevelSettings {
  baseWordLength: number
  targetWordCount: number
  language: 'ko' | 'en' | 'both'
  minLength: number
  timePerWord: number
}

export const ANAGRAMS_LEVELS: Record<Difficulty, AnagramsLevelSettings> = {
  easy: {
    difficulty: 'easy',
    questionCount: 3,
    baseWordLength: 5,
    targetWordCount: 3,
    language: 'both',
    minLength: 3,
    timePerWord: 45,
    inputTime: 135,
  },
  medium: {
    difficulty: 'medium',
    questionCount: 4,
    baseWordLength: 6,
    targetWordCount: 4,
    language: 'both',
    minLength: 3,
    timePerWord: 40,
    inputTime: 160,
  },
  hard: {
    difficulty: 'hard',
    questionCount: 5,
    baseWordLength: 7,
    targetWordCount: 5,
    language: 'both',
    minLength: 3,
    timePerWord: 35,
    inputTime: 175,
  },
  expert: {
    difficulty: 'expert',
    questionCount: 6,
    baseWordLength: 8,
    targetWordCount: 6,
    language: 'both',
    minLength: 4,
    timePerWord: 30,
    inputTime: 180,
  },
  master: {
    difficulty: 'master',
    questionCount: 8,
    baseWordLength: 9,
    targetWordCount: 8,
    language: 'both',
    minLength: 4,
    timePerWord: 25,
    inputTime: 200,
  },
}
