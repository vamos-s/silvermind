import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to SilverMind',
      selectGame: 'Select a Game',
      play: 'Play',
      score: 'Score',
      difficulty: 'Difficulty',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      memory: 'Memory',
      pattern: 'Pattern',
      logic: 'Logic',
      reaction: 'Reaction',
      spatial: 'Spatial',
      achievements: 'Achievements',
      progress: 'Progress',
      settings: 'Settings'
    }
  },
  ko: {
    translation: {
      welcome: 'SilverMind에 오신 것을 환영합니다',
      selectGame: '게임 선택',
      play: '플레이',
      score: '점수',
      difficulty: '난이도',
      easy: '쉬움',
      medium: '보통',
      hard: '어려움',
      memory: '기억력',
      pattern: '패턴',
      logic: '논리',
      reaction: '반응',
      spatial: '공간',
      achievements: '업적',
      progress: '진행',
      settings: '설정'
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  })

export default i18n
