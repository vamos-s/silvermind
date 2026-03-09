import { Difficulty, QuestionLevelSettings } from '../types'

/**
 * Synonym Matcher Game - Match words with same meaning
 */
export interface SynonymMatcherLevelSettings extends QuestionLevelSettings {
  language: 'ko' | 'en' | 'mixed'
  pairCount: number
  timePerPair: number
  distractionLevel: number // 0-1, how similar distractors are
}

export const SYNONYM_MATCHER_LEVELS: Record<Difficulty, SynonymMatcherLevelSettings> = {
  easy: {
    difficulty: 'easy',
    questionCount: 5,
    optionCount: 4,
    language: 'mixed',
    pairCount: 5,
    timePerPair: 20,
    distractionLevel: 0.2,
    inputTime: 100,
  },
  medium: {
    difficulty: 'medium',
    questionCount: 8,
    optionCount: 6,
    language: 'mixed',
    pairCount: 8,
    timePerPair: 18,
    distractionLevel: 0.4,
    inputTime: 144,
  },
  hard: {
    difficulty: 'hard',
    questionCount: 10,
    optionCount: 8,
    language: 'mixed',
    pairCount: 10,
    timePerPair: 15,
    distractionLevel: 0.6,
    inputTime: 150,
  },
  expert: {
    difficulty: 'expert',
    questionCount: 12,
    optionCount: 10,
    language: 'mixed',
    pairCount: 12,
    timePerPair: 12,
    distractionLevel: 0.7,
    inputTime: 144,
  },
  master: {
    difficulty: 'master',
    questionCount: 15,
    optionCount: 12,
    language: 'mixed',
    pairCount: 15,
    timePerPair: 10,
    distractionLevel: 0.85,
    inputTime: 150,
  },
}
