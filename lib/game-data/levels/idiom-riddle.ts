import { Difficulty, QuestionLevelSettings } from '../types'

/**
 * Idiom Riddle Game - Guess idioms/proverbs from meanings
 */
export interface IdiomRiddleLevelSettings extends QuestionLevelSettings {
  language: 'ko' | 'en' | 'both'
  idiomDifficulty: 'common' | 'medium' | 'obscure'
  hintCount: number
  timePerQuestion: number
}

export const IDIOM_RIDDLE_LEVELS: Record<Difficulty, IdiomRiddleLevelSettings> = {
  easy: {
    difficulty: 'easy',
    questionCount: 5,
    optionCount: 4,
    language: 'both',
    idiomDifficulty: 'common',
    hintCount: 3,
    timePerQuestion: 45,
    inputTime: 225,
  },
  medium: {
    difficulty: 'medium',
    questionCount: 8,
    optionCount: 6,
    language: 'both',
    idiomDifficulty: 'common',
    hintCount: 2,
    timePerQuestion: 40,
    inputTime: 320,
  },
  hard: {
    difficulty: 'hard',
    questionCount: 10,
    optionCount: 8,
    language: 'both',
    idiomDifficulty: 'medium',
    hintCount: 2,
    timePerQuestion: 35,
    inputTime: 350,
  },
  expert: {
    difficulty: 'expert',
    questionCount: 12,
    optionCount: 10,
    language: 'both',
    idiomDifficulty: 'medium',
    hintCount: 1,
    timePerQuestion: 30,
    inputTime: 360,
  },
  master: {
    difficulty: 'master',
    questionCount: 15,
    optionCount: 12,
    language: 'both',
    idiomDifficulty: 'obscure',
    hintCount: 0,
    timePerQuestion: 25,
    inputTime: 375,
  },
}
