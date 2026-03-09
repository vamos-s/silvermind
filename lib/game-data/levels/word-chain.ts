import { Difficulty, BaseLevelSettings } from '../types'

/**
 * Word Chain Game - Chain words where each starts with last letter
 */
export interface WordChainLevelSettings extends BaseLevelSettings {
  chainLength: number // Target chain length
  firstLetter?: string // If specified, start with this letter
  minLength: number
  maxLength: number
  language: 'ko' | 'en' | 'both'
  forbiddenLetters?: string[] // Letters that cannot be used
  timePerWord: number
}

export const WORD_CHAIN_LEVELS: Record<Difficulty, WordChainLevelSettings> = {
  easy: {
    difficulty: 'easy',
    chainLength: 5,
    minLength: 2,
    maxLength: 5,
    language: 'both',
    timePerWord: 20,
    inputTime: 100,
  },
  medium: {
    difficulty: 'medium',
    chainLength: 8,
    minLength: 2,
    maxLength: 6,
    language: 'both',
    timePerWord: 18,
    inputTime: 144,
  },
  hard: {
    difficulty: 'hard',
    chainLength: 12,
    minLength: 3,
    maxLength: 7,
    language: 'both',
    timePerWord: 15,
    inputTime: 180,
  },
  expert: {
    difficulty: 'expert',
    chainLength: 15,
    minLength: 3,
    maxLength: 8,
    language: 'both',
    forbiddenLetters: ['q', 'x', 'z'],
    timePerWord: 12,
    inputTime: 180,
  },
  master: {
    difficulty: 'master',
    chainLength: 20,
    minLength: 4,
    maxLength: 8,
    language: 'both',
    forbiddenLetters: ['q', 'x', 'z', 'j'],
    timePerWord: 10,
    inputTime: 200,
  },
}
