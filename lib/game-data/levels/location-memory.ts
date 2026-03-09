import { LocationLevelSettings } from '../types'

/**
 * Level settings for Location Memory game
 * Remember where icons are displayed on screen
 */
export const LOCATION_MEMORY_LEVELS: LocationLevelSettings[] = [
  // Levels 1-5: Easy introduction
  { itemCount: 3, displayTime: 4000, inputTime: 25, difficulty: 'easy' },    // Level 1
  { itemCount: 4, displayTime: 3800, inputTime: 30, difficulty: 'easy' },    // Level 2
  { itemCount: 4, displayTime: 3600, inputTime: 35, difficulty: 'easy' },    // Level 3
  { itemCount: 5, displayTime: 3400, inputTime: 40, difficulty: 'easy' },    // Level 4
  { itemCount: 5, displayTime: 3200, inputTime: 45, difficulty: 'easy' },    // Level 5

  // Levels 6-10: Medium challenge
  { itemCount: 6, displayTime: 3000, inputTime: 50, difficulty: 'medium' },  // Level 6
  { itemCount: 6, displayTime: 2800, inputTime: 55, difficulty: 'medium' },  // Level 7
  { itemCount: 7, displayTime: 2600, inputTime: 60, difficulty: 'medium' },  // Level 8
  { itemCount: 7, displayTime: 2400, inputTime: 65, difficulty: 'medium' },  // Level 9
  { itemCount: 8, displayTime: 2200, inputTime: 70, difficulty: 'medium' },  // Level 10

  // Levels 11-15: Harder progression
  { itemCount: 8, displayTime: 2000, inputTime: 75, difficulty: 'hard' },   // Level 11
  { itemCount: 9, displayTime: 1900, inputTime: 80, difficulty: 'hard' },    // Level 12
  { itemCount: 9, displayTime: 1800, inputTime: 85, difficulty: 'hard' },    // Level 13
  { itemCount: 10, displayTime: 1700, inputTime: 90, difficulty: 'hard' },   // Level 14
  { itemCount: 10, displayTime: 1600, inputTime: 95, difficulty: 'hard' },   // Level 15

  // Levels 16-20: Advanced challenge
  { itemCount: 11, displayTime: 1500, inputTime: 100, difficulty: 'hard' },  // Level 16
  { itemCount: 11, displayTime: 1400, inputTime: 105, difficulty: 'hard' },  // Level 17
  { itemCount: 12, displayTime: 1300, inputTime: 110, difficulty: 'hard' },  // Level 18
  { itemCount: 12, displayTime: 1200, inputTime: 115, difficulty: 'hard' },  // Level 19
  { itemCount: 13, displayTime: 1100, inputTime: 120, difficulty: 'hard' },   // Level 20

  // Levels 21-25: Expert level
  { itemCount: 13, displayTime: 1000, inputTime: 125, difficulty: 'expert' }, // Level 21
  { itemCount: 14, displayTime: 950, inputTime: 130, difficulty: 'expert' }, // Level 22
  { itemCount: 14, displayTime: 900, inputTime: 135, difficulty: 'expert' }, // Level 23
  { itemCount: 15, displayTime: 850, inputTime: 140, difficulty: 'expert' }, // Level 24
  { itemCount: 15, displayTime: 800, inputTime: 145, difficulty: 'expert' }, // Level 25

  // Levels 26-30: Master level
  { itemCount: 16, displayTime: 750, inputTime: 150, difficulty: 'expert' }, // Level 26
  { itemCount: 16, displayTime: 700, inputTime: 155, difficulty: 'expert' }, // Level 27
  { itemCount: 17, displayTime: 650, inputTime: 160, difficulty: 'expert' }, // Level 28
  { itemCount: 17, displayTime: 600, inputTime: 165, difficulty: 'expert' }, // Level 29
  { itemCount: 18, displayTime: 550, inputTime: 170, difficulty: 'expert' }, // Level 30
]
