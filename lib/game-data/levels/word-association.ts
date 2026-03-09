import { QuestionLevelSettings } from '../types'

/**
 * Level settings for Word Association game
 * Find words that belong in the same category
 */
export const WORD_ASSOCIATION_LEVELS: QuestionLevelSettings[] = [
  // Levels 1-5: Easy introduction
  { questionCount: 3, optionCount: 4, inputTime: 20, difficulty: 'easy' },    // Level 1
  { questionCount: 4, optionCount: 4, inputTime: 22, difficulty: 'easy' },    // Level 2
  { questionCount: 4, optionCount: 5, inputTime: 25, difficulty: 'easy' },    // Level 3
  { questionCount: 5, optionCount: 5, inputTime: 27, difficulty: 'easy' },    // Level 4
  { questionCount: 5, optionCount: 6, inputTime: 30, difficulty: 'easy' },    // Level 5

  // Levels 6-10: Medium challenge
  { questionCount: 6, optionCount: 6, inputTime: 33, difficulty: 'medium' },  // Level 6
  { questionCount: 6, optionCount: 7, inputTime: 35, difficulty: 'medium' },  // Level 7
  { questionCount: 7, optionCount: 7, inputTime: 38, difficulty: 'medium' },  // Level 8
  { questionCount: 7, optionCount: 8, inputTime: 40, difficulty: 'medium' },  // Level 9
  { questionCount: 8, optionCount: 8, inputTime: 43, difficulty: 'medium' },  // Level 10

  // Levels 11-15: Harder progression
  { questionCount: 8, optionCount: 8, inputTime: 45, difficulty: 'hard' },   // Level 11
  { questionCount: 9, optionCount: 9, inputTime: 48, difficulty: 'hard' },    // Level 12
  { questionCount: 9, optionCount: 9, inputTime: 50, difficulty: 'hard' },    // Level 13
  { questionCount: 10, optionCount: 10, inputTime: 53, difficulty: 'hard' },   // Level 14
  { questionCount: 10, optionCount: 10, inputTime: 55, difficulty: 'hard' },   // Level 15

  // Levels 16-20: Advanced challenge
  { questionCount: 11, optionCount: 10, inputTime: 58, difficulty: 'hard' },    // Level 16
  { questionCount: 11, optionCount: 11, inputTime: 60, difficulty: 'hard' },   // Level 17
  { questionCount: 12, optionCount: 11, inputTime: 63, difficulty: 'hard' },  // Level 18
  { questionCount: 12, optionCount: 12, inputTime: 65, difficulty: 'hard' },  // Level 19
  { questionCount: 13, optionCount: 12, inputTime: 68, difficulty: 'hard' },   // Level 20

  // Levels 21-25: Expert level
  { questionCount: 13, optionCount: 13, inputTime: 70, difficulty: 'expert' }, // Level 21
  { questionCount: 14, optionCount: 13, inputTime: 73, difficulty: 'expert' }, // Level 22
  { questionCount: 14, optionCount: 14, inputTime: 75, difficulty: 'expert' }, // Level 23
  { questionCount: 15, optionCount: 14, inputTime: 78, difficulty: 'expert' }, // Level 24
  { questionCount: 15, optionCount: 15, inputTime: 80, difficulty: 'expert' }, // Level 25

  // Levels 26-30: Master level
  { questionCount: 16, optionCount: 15, inputTime: 83, difficulty: 'expert' }, // Level 26
  { questionCount: 16, optionCount: 16, inputTime: 85, difficulty: 'expert' }, // Level 27
  { questionCount: 17, optionCount: 16, inputTime: 88, difficulty: 'expert' }, // Level 28
  { questionCount: 17, optionCount: 17, inputTime: 90, difficulty: 'expert' }, // Level 29
  { questionCount: 18, optionCount: 17, inputTime: 93, difficulty: 'expert' }, // Level 30
]
