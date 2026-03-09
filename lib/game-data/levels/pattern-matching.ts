import { PatternLevelSettings } from '../types'

/**
 * Level settings for Pattern Matching game
 * Memory game where players remember color patterns
 */
export const PATTERN_MATCHING_LEVELS: PatternLevelSettings[] = [
  // Levels 1-5: Easy introduction
  { patternSize: 4, displayTime: 3000, inputTime: 20, difficulty: 'easy' },    // Level 1
  { patternSize: 5, displayTime: 2800, inputTime: 25, difficulty: 'easy' },    // Level 2
  { patternSize: 5, displayTime: 2600, inputTime: 30, difficulty: 'easy' },    // Level 3
  { patternSize: 6, displayTime: 2400, inputTime: 35, difficulty: 'easy' },    // Level 4
  { patternSize: 6, displayTime: 2200, inputTime: 40, difficulty: 'easy' },    // Level 5

  // Levels 6-10: Medium challenge
  { patternSize: 7, displayTime: 2000, inputTime: 45, difficulty: 'medium' },  // Level 6
  { patternSize: 7, displayTime: 1800, inputTime: 50, difficulty: 'medium' },  // Level 7
  { patternSize: 8, displayTime: 1600, inputTime: 55, difficulty: 'medium' },  // Level 8
  { patternSize: 8, displayTime: 1500, inputTime: 60, difficulty: 'medium' },  // Level 9
  { patternSize: 9, displayTime: 1400, inputTime: 65, difficulty: 'medium' },  // Level 10

  // Levels 11-15: Harder progression
  { patternSize: 9, displayTime: 1300, inputTime: 70, difficulty: 'hard' },   // Level 11
  { patternSize: 10, displayTime: 1200, inputTime: 75, difficulty: 'hard' },  // Level 12
  { patternSize: 10, displayTime: 1100, inputTime: 80, difficulty: 'hard' },  // Level 13
  { patternSize: 11, displayTime: 1000, inputTime: 85, difficulty: 'hard' },  // Level 14
  { patternSize: 11, displayTime: 950, inputTime: 90, difficulty: 'hard' },   // Level 15

  // Levels 16-20: Advanced challenge
  { patternSize: 12, displayTime: 900, inputTime: 95, difficulty: 'hard' },    // Level 16
  { patternSize: 12, displayTime: 850, inputTime: 100, difficulty: 'hard' },   // Level 17
  { patternSize: 13, displayTime: 800, inputTime: 105, difficulty: 'hard' },  // Level 18
  { patternSize: 13, displayTime: 750, inputTime: 110, difficulty: 'hard' },  // Level 19
  { patternSize: 14, displayTime: 700, inputTime: 115, difficulty: 'hard' },   // Level 20

  // Levels 21-25: Expert level
  { patternSize: 14, displayTime: 650, inputTime: 120, difficulty: 'expert' }, // Level 21
  { patternSize: 15, displayTime: 600, inputTime: 125, difficulty: 'expert' }, // Level 22
  { patternSize: 15, displayTime: 550, inputTime: 130, difficulty: 'expert' }, // Level 23
  { patternSize: 16, displayTime: 500, inputTime: 135, difficulty: 'expert' }, // Level 24
  { patternSize: 16, displayTime: 450, inputTime: 140, difficulty: 'expert' }, // Level 25

  // Levels 26-30: Master level
  { patternSize: 17, displayTime: 400, inputTime: 145, difficulty: 'expert' }, // Level 26
  { patternSize: 17, displayTime: 380, inputTime: 150, difficulty: 'expert' }, // Level 27
  { patternSize: 18, displayTime: 360, inputTime: 155, difficulty: 'expert' }, // Level 28
  { patternSize: 18, displayTime: 340, inputTime: 160, difficulty: 'expert' }, // Level 29
  { patternSize: 19, displayTime: 320, inputTime: 165, difficulty: 'expert' }, // Level 30
]
