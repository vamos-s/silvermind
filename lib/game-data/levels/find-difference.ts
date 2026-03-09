import { Difficulty, DisplayLevelSettings } from '../types'

/**
 * Find Difference Game - Find differences between two images
 */
export interface FindDifferenceLevelSettings extends DisplayLevelSettings {
  gridWidth: number
  gridHeight: number
  differenceCount: number
  timeLimit: number
  maxMisses: number
}

export const FIND_DIFFERENCE_LEVELS: Record<Difficulty, FindDifferenceLevelSettings> = {
  easy: {
    difficulty: 'easy',
    gridWidth: 4,
    gridHeight: 4,
    differenceCount: 3,
    timeLimit: 60,
    maxMisses: 5,
    displayTime: 5,
    inputTime: 60,
  },
  medium: {
    difficulty: 'medium',
    gridWidth: 5,
    gridHeight: 5,
    differenceCount: 5,
    timeLimit: 90,
    maxMisses: 4,
    displayTime: 3,
    inputTime: 90,
  },
  hard: {
    difficulty: 'hard',
    gridWidth: 6,
    gridHeight: 6,
    differenceCount: 7,
    timeLimit: 120,
    maxMisses: 3,
    displayTime: 2,
    inputTime: 120,
  },
  expert: {
    difficulty: 'expert',
    gridWidth: 8,
    gridHeight: 8,
    differenceCount: 10,
    timeLimit: 150,
    maxMisses: 2,
    displayTime: 1.5,
    inputTime: 150,
  },
  master: {
    difficulty: 'master',
    gridWidth: 10,
    gridHeight: 10,
    differenceCount: 12,
    timeLimit: 180,
    maxMisses: 1,
    displayTime: 1,
    inputTime: 180,
  },
}
