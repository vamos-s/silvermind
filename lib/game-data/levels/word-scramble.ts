import { Difficulty, QuestionLevelSettings } from '../types'

/**
 * Word Scramble Game - Unscramble letters to form words
 */
export interface WordScrambleLevelSettings extends QuestionLevelSettings {
  wordLength: number
  language: 'ko' | 'en' | 'both'
  timePerWord: number
  hintsAllowed: number
}

export const WORD_SCRAMBLE_LEVELS: Record<Difficulty, WordScrambleLevelSettings> = {
  easy: {
    difficulty: 'easy',
    questionCount: 5,
    wordLength: 4,
    language: 'both',
    timePerWord: 30,
    hintsAllowed: 2,
    inputTime: 150,
  },
  medium: {
    difficulty: 'medium',
    questionCount: 8,
    wordLength: 5,
    language: 'both',
    timePerWord: 25,
    hintsAllowed: 1,
    inputTime: 200,
  },
  hard: {
    difficulty: 'hard',
    questionCount: 10,
    wordLength: 6,
    language: 'both',
    timePerWord: 20,
    hintsAllowed: 1,
    inputTime: 200,
  },
  expert: {
    difficulty: 'expert',
    questionCount: 12,
    wordLength: 7,
    language: 'both',
    timePerWord: 18,
    hintsAllowed: 1,
    inputTime: 216,
  },
  master: {
    difficulty: 'master',
    questionCount: 15,
    wordLength: 8,
    language: 'both',
    timePerWord: 15,
    hintsAllowed: 0,
    inputTime: 225,
  },
}
