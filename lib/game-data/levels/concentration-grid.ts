import { Difficulty, BaseLevelSettings } from '../types'

/**
 * Concentration Grid Game - Find numbers in sequence (1-100)
 */
export interface ConcentrationGridLevelSettings extends BaseLevelSettings {
  gridSize: number
  startNumber: number
  endNumber: number
  showNumbers: boolean // If false, show symbols instead
  timeLimit: number
}

export const CONCENTRATION_GRID_LEVELS: Record<Difficulty, ConcentrationGridLevelSettings> = {
  easy: {
    difficulty: 'easy',
    gridSize: 5, // 5x5 = 25 cells
    startNumber: 1,
    endNumber: 15,
    showNumbers: true,
    timeLimit: 60,
    inputTime: 60,
  },
  medium: {
    difficulty: 'medium',
    gridSize: 6, // 6x6 = 36 cells
    startNumber: 1,
    endNumber: 25,
    showNumbers: true,
    timeLimit: 90,
    inputTime: 90,
  },
  hard: {
    difficulty: 'hard',
    gridSize: 8, // 8x8 = 64 cells
    startNumber: 1,
    endNumber: 40,
    showNumbers: true,
    timeLimit: 120,
    inputTime: 120,
  },
  expert: {
    difficulty: 'expert',
    gridSize: 10, // 10x10 = 100 cells
    startNumber: 1,
    endNumber: 60,
    showNumbers: true,
    timeLimit: 150,
    inputTime: 150,
  },
  master: {
    difficulty: 'master',
    gridSize: 10, // 10x10 = 100 cells
    startNumber: 1,
    endNumber: 100,
    showNumbers: false, // Challenge: symbols instead of numbers
    timeLimit: 180,
    inputTime: 180,
  },
}
