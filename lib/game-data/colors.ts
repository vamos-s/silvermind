/**
 * Common color palette for pattern-based games
 */

export const GAME_COLORS = {
  basic: [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-teal-500',
  ],

  extended: [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-cyan-800',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-lime-500',
    'bg-emerald-500',
    'bg-sky-500',
    'bg-violet-500',
    'bg-fuchsia-500',
    'bg-rose-500',
  ],
}

/**
 * Category color palette for UI
 */
export const CATEGORY_COLORS = {
  memory: {
    primary: 'bg-indigo-500',
    dark: 'bg-slate-800',
    light: 'text-indigo-400',
  },
  pattern: {
    primary: 'bg-amber-500',
    dark: 'bg-slate-800',
    light: 'text-amber-400',
  },
  logic: {
    primary: 'bg-emerald-500',
    dark: 'bg-slate-800',
    light: 'text-emerald-400',
  },
  reaction: {
    primary: 'bg-rose-500',
    dark: 'bg-slate-800',
    light: 'text-rose-400',
  },
  spatial: {
    primary: 'bg-cyan-500',
    dark: 'bg-slate-800',
    light: 'text-cyan-400',
  },
  attention: {
    primary: 'bg-violet-500',
    dark: 'bg-slate-800',
    light: 'text-violet-400',
  },
  language: {
    primary: 'bg-orange-500',
    dark: 'bg-slate-800',
    light: 'text-orange-400',
  },
} as const

export type CategoryKey = keyof typeof CATEGORY_COLORS
