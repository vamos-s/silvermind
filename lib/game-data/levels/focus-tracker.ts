import { Difficulty, DisplayLevelSettings } from '../types'

/**
 * Focus Tracker Game - Track one moving object among many
 */
export interface FocusTrackerLevelSettings extends DisplayLevelSettings {
  objectCount: number
  speed: number // Pixels per second
  directionChangeInterval: number // How often objects change direction
  trackingDuration: number // How long to track
  colorSimilarity: number // 0-1, how similar target color is to others
}

export const FOCUS_TRACKER_LEVELS: Record<Difficulty, FocusTrackerLevelSettings> = {
  easy: {
    difficulty: 'easy',
    objectCount: 3,
    speed: 100,
    directionChangeInterval: 3,
    trackingDuration: 15,
    colorSimilarity: 0.2,
    displayTime: 3,
    inputTime: 20,
  },
  medium: {
    difficulty: 'medium',
    objectCount: 5,
    speed: 150,
    directionChangeInterval: 2,
    trackingDuration: 20,
    colorSimilarity: 0.4,
    displayTime: 2,
    inputTime: 25,
  },
  hard: {
    difficulty: 'hard',
    objectCount: 8,
    speed: 200,
    directionChangeInterval: 1.5,
    trackingDuration: 30,
    colorSimilarity: 0.6,
    displayTime: 1.5,
    inputTime: 35,
  },
  expert: {
    difficulty: 'expert',
    objectCount: 12,
    speed: 250,
    directionChangeInterval: 1,
    trackingDuration: 45,
    colorSimilarity: 0.7,
    displayTime: 1,
    inputTime: 50,
  },
  master: {
    difficulty: 'master',
    objectCount: 15,
    speed: 300,
    directionChangeInterval: 0.8,
    trackingDuration: 60,
    colorSimilarity: 0.85,
    displayTime: 0.8,
    inputTime: 70,
  },
}
