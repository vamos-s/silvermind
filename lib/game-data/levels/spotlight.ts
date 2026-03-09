import { Difficulty, DisplayLevelSettings } from '../types'

/**
 * Spotlight Game - Find hidden objects with limited visibility
 */
export interface SpotlightLevelSettings extends DisplayLevelSettings {
  gridWidth: number
  gridHeight: number
  spotlightSize: number // Radius of the spotlight
  targetCount: number
  obstacleCount: number
  timeLimit: number // Total time to find all targets
}

export const SPOTLIGHT_LEVELS: Record<Difficulty, SpotlightLevelSettings> = {
  easy: {
    difficulty: 'easy',
    gridWidth: 4,
    gridHeight: 4,
    spotlightSize: 2,
    targetCount: 3,
    obstacleCount: 0,
    displayTime: 3,
    inputTime: 30,
    timeLimit: 30,
  },
  medium: {
    difficulty: 'medium',
    gridWidth: 5,
    gridHeight: 5,
    spotlightSize: 1.5,
    targetCount: 5,
    obstacleCount: 5,
    displayTime: 2,
    inputTime: 45,
    timeLimit: 45,
  },
  hard: {
    difficulty: 'hard',
    gridWidth: 6,
    gridHeight: 6,
    spotlightSize: 1,
    targetCount: 7,
    obstacleCount: 10,
    displayTime: 1.5,
    inputTime: 60,
    timeLimit: 60,
  },
  expert: {
    difficulty: 'expert',
    gridWidth: 8,
    gridHeight: 8,
    spotlightSize: 0.8,
    targetCount: 10,
    obstacleCount: 15,
    displayTime: 1,
    inputTime: 90,
    timeLimit: 90,
  },
  master: {
    difficulty: 'master',
    gridWidth: 10,
    gridHeight: 10,
    spotlightSize: 0.6,
    targetCount: 15,
    obstacleCount: 25,
    displayTime: 0.8,
    inputTime: 120,
    timeLimit: 120,
  },
}
