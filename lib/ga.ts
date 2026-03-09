// Google Analytics 4 configuration

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}

// Track events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    window.gtag('event', eventName, parameters)
  }
}

// Game-specific events
export const trackGameStart = (category: string, game: string) => {
  trackEvent('game_start', {
    event_category: category,
    game_name: game,
  })
}

export const trackGameComplete = (
  category: string,
  game: string,
  score: number,
  difficulty: string
) => {
  trackEvent('game_complete', {
    event_category: category,
    game_name: game,
    score,
    difficulty,
  })
}

export const trackLevelUp = (category: string, game: string, level: number) => {
  trackEvent('level_up', {
    event_category: category,
    game_name: game,
    level,
  })
}

// Type declarations for gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void
  }
}
