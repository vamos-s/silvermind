import { AchievementType } from './types'

export const achievements: Record<AchievementType, {
  title: Record<string, string>
  description: Record<string, string>
  icon: string
}> = {
  first_play: {
    title: { en: 'First Steps', ko: '첫 걸음' },
    description: { en: 'Play your first game', ko: '첫 번째 게임 플레이' },
    icon: '🎮'
  },
  score_100: {
    title: { en: 'Century', ko: '세기' },
    description: { en: 'Score 100+ in any game', ko: '어느 게임에서든 100+ 점 달성' },
    icon: '💯'
  },
  score_500: {
    title: { en: 'High Scorer', ko: '고득점자' },
    description: { en: 'Score 500+ in any game', ko: '어느 게임에서든 500+ 점 달성' },
    icon: '🏆'
  },
  play_all_games: {
    title: { en: 'Game Master', ko: '게임 마스터' },
    description: { en: 'Play all games at least once', ko: '모든 게임을 최소 한 번씩 플레이' },
    icon: '👑'
  },
  streak_3: {
    title: { en: 'On Fire', ko: '불타오르네' },
    description: { en: 'Play for 3 consecutive days', ko: '3일 연속 플레이' },
    icon: '🔥'
  },
  streak_7: {
    title: { en: 'Week Warrior', ko: '주간 워리어' },
    description: { en: 'Play for 7 consecutive days', ko: '7일 연속 플레이' },
    icon: '⚔️'
  },
  perfect_score: {
    title: { en: 'Perfect!', ko: '완벽!' },
    description: { en: 'Get a perfect score (100% accuracy)', ko: '완벽한 점수 획득 (100% 정확도)' },
    icon: '✨'
  }
}
