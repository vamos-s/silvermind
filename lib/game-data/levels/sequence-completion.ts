import { SequenceLevelSettings } from '../types'

export type SequenceType = 'number' | 'letter' | 'color'

/**
 * Level settings for Sequence Completion game
 * Find patterns and complete sequences
 */
export const SEQUENCE_COMPLETION_LEVELS: (SequenceLevelSettings & { type: SequenceType })[] = [
  // Levels 1-5: Easy introduction
  { sequenceLength: 4, displayTime: 3500, inputTime: 20, difficulty: 'easy', type: 'number' },    // Level 1
  { sequenceLength: 5, displayTime: 3300, inputTime: 25, difficulty: 'easy', type: 'number' },    // Level 2
  { sequenceLength: 5, displayTime: 3100, inputTime: 30, difficulty: 'easy', type: 'letter' },    // Level 3
  { sequenceLength: 6, displayTime: 2900, inputTime: 35, difficulty: 'easy', type: 'letter' },    // Level 4
  { sequenceLength: 6, displayTime: 2700, inputTime: 40, difficulty: 'easy', type: 'number' },    // Level 5

  // Levels 6-10: Medium challenge
  { sequenceLength: 7, displayTime: 2500, inputTime: 45, difficulty: 'medium', type: 'number' },  // Level 6
  { sequenceLength: 7, displayTime: 2300, inputTime: 50, difficulty: 'medium', type: 'letter' },  // Level 7
  { sequenceLength: 8, displayTime: 2100, inputTime: 55, difficulty: 'medium', type: 'letter' },  // Level 8
  { sequenceLength: 8, displayTime: 2000, inputTime: 60, difficulty: 'medium', type: 'color' },  // Level 9
  { sequenceLength: 9, displayTime: 1900, inputTime: 65, difficulty: 'medium', type: 'color' },  // Level 10

  // Levels 11-15: Harder progression
  { sequenceLength: 9, displayTime: 1800, inputTime: 70, difficulty: 'hard', type: 'color' },   // Level 11
  { sequenceLength: 10, displayTime: 1700, inputTime: 75, difficulty: 'hard', type: 'number' },  // Level 12
  { sequenceLength: 10, displayTime: 1600, inputTime: 80, difficulty: 'hard', type: 'number' },  // Level 13
  { sequenceLength: 11, displayTime: 1500, inputTime: 85, difficulty: 'hard', type: 'letter' },  // Level 14
  { sequenceLength: 11, displayTime: 1400, inputTime: 90, difficulty: 'hard', type: 'letter' },  // Level 15

  // Levels 16-20: Advanced challenge
  { sequenceLength: 12, displayTime: 1300, inputTime: 95, difficulty: 'hard', type: 'color' },    // Level 16
  { sequenceLength: 12, displayTime: 1200, inputTime: 100, difficulty: 'hard', type: 'color' },   // Level 17
  { sequenceLength: 13, displayTime: 1100, inputTime: 105, difficulty: 'hard', type: 'number' },  // Level 18
  { sequenceLength: 13, displayTime: 1000, inputTime: 110, difficulty: 'hard', type: 'number' },  // Level 19
  { sequenceLength: 14, displayTime: 950, inputTime: 115, difficulty: 'hard', type: 'letter' },   // Level 20

  // Levels 21-25: Expert level
  { sequenceLength: 14, displayTime: 900, inputTime: 120, difficulty: 'expert', type: 'letter' }, // Level 21
  { sequenceLength: 15, displayTime: 850, inputTime: 125, difficulty: 'expert', type: 'color' }, // Level 22
  { sequenceLength: 15, displayTime: 800, inputTime: 130, difficulty: 'expert', type: 'color' }, // Level 23
  { sequenceLength: 16, displayTime: 750, inputTime: 135, difficulty: 'expert', type: 'number' }, // Level 24
  { sequenceLength: 16, displayTime: 700, inputTime: 140, difficulty: 'expert', type: 'number' }, // Level 25

  // Levels 26-30: Master level
  { sequenceLength: 17, displayTime: 650, inputTime: 145, difficulty: 'expert', type: 'letter' }, // Level 26
  { sequenceLength: 17, displayTime: 600, inputTime: 150, difficulty: 'expert', type: 'letter' }, // Level 27
  { sequenceLength: 18, displayTime: 550, inputTime: 155, difficulty: 'expert', type: 'color' }, // Level 28
  { sequenceLength: 18, displayTime: 500, inputTime: 160, difficulty: 'expert', type: 'color' }, // Level 29
  { sequenceLength: 19, displayTime: 450, inputTime: 165, difficulty: 'expert', type: 'number' }, // Level 30
]
