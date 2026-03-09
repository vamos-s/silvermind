/**
 * Common types for game level settings
 */

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

export interface BaseLevelSettings {
  inputTime: number
  difficulty: Difficulty
}

export interface DisplayLevelSettings extends BaseLevelSettings {
  displayTime: number
}

export interface PatternLevelSettings extends DisplayLevelSettings {
  patternSize: number
}

export interface LocationLevelSettings extends DisplayLevelSettings {
  itemCount: number
}

export interface QuestionLevelSettings extends BaseLevelSettings {
  questionCount: number
  optionCount?: number
}

export interface SequenceLevelSettings extends DisplayLevelSettings {
  sequenceLength: number
  type?: 'number' | 'letter' | 'color'
}
