import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      // Navigation
      leaderboard: 'Leaderboard',
      challenges: 'Daily Challenges',
      achievements: 'Achievements',

      // Common UI
      difficulty: 'Difficulty',
      allDifficulties: 'All Difficulties',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      bestScores: 'Best Scores',
      topScores: 'Top Scores',
      progress: 'Progress',
      anonymous: 'Anonymous',
      play: 'Play',
      start: 'Start',
      back: 'Back',

      // Leaderboard
      leaderboardTitle: 'Leaderboard',
      rank: 'Rank',
      player: 'Player',
      game: 'Game',
      games: 'Games',
      noScores: 'No scores yet. Start playing!',
      filterByGame: 'Filter by Game',
      allGames: 'All Games',

      // Achievements
      achievementsTitle: 'Achievements',
      unlocked: 'Unlocked',
      locked: 'Locked',
      totalAchievements: 'Total Achievements',
      achievementUnlocked: 'Achievement Unlocked!',
      achievement: {
        first_play: {
          title: 'First Steps',
          description: 'Play your first game'
        },
        score_100: {
          title: 'Century',
          description: 'Score 100 points in any game'
        },
        score_500: {
          title: 'Half Millennium',
          description: 'Score 500 points in any game'
        },
        play_all_games: {
          title: 'Explorer',
          description: 'Play all available games'
        },
        streak_3: {
          title: 'Streak of Three',
          description: 'Play games on 3 consecutive days'
        },
        streak_7: {
          title: 'Week Warrior',
          description: 'Play games on 7 consecutive days'
        },
        perfect_score: {
          title: 'Perfectionist',
          description: 'Get a perfect score in any game'
        }
      },

      // Challenges
      challengesTitle: 'Daily Challenges',
      todayChallenges: 'Today\'s Challenges',
      yesterday: 'Yesterday',
      completed: 'Completed',
      inProgress: 'In Progress',
      notStarted: 'Not Started',
      challengeCompleted: 'Challenge Completed!',
      allChallengesCompleted: 'All challenges completed today!',
      score: 'Score',
      complete: 'Complete',
      master: 'Master',
      challengeType: {
        score: 'Score',
        complete: 'Complete',
        master: 'Master'
      },

      // Game Categories
      memory: 'Memory',
      pattern: 'Pattern',
      logic: 'Logic',
      reaction: 'Reaction',
      spatial: 'Spatial',
      attention: 'Attention & Focus',
      language: 'Language & Verbal',

      // Games - Memory
      games: {
        'pattern-matching': {
          title: 'Pattern Matching',
          description: 'Remember and reproduce patterns'
        },
        'word-association': {
          title: 'Word Association',
          description: 'Find words in the same category'
        },
        'number-recall': {
          title: 'Number Recall',
          description: 'Remember number sequences'
        },
        'sequence-memory': {
          title: 'Sequence Memory',
          description: 'Watch and repeat the sequence'
        },
        'word-recall': {
          title: 'Word Recall',
          description: 'Remember and type the words'
        },
        'card-flip': {
          title: 'Card Flip',
          description: 'Match the pairs of cards'
        },
        'location-memory': {
          title: 'Location Memory',
          description: 'Remember item positions'
        },
        // Pattern
        'sequence-completion': {
          title: 'Sequence Completion',
          description: 'Complete the pattern sequence'
        },
        'pattern-recognition': {
          title: 'Pattern Recognition',
          description: 'Identify the correct pattern'
        },
        'symbol-matching': {
          title: 'Symbol Matching',
          description: 'Match identical symbols'
        },
        'pattern-memory': {
          title: 'Pattern Memory',
          description: 'Remember and recreate patterns'
        },
        'maze-navigation': {
          title: 'Maze Navigation',
          description: 'Find your way through the maze'
        },
        'jigsaw-puzzle': {
          title: 'Jigsaw Puzzle',
          description: 'Arrange the pieces'
        },
        // Logic
        'number-sequence': {
          title: 'Number Sequence',
          description: 'Find the next number in the sequence'
        },
        'word-puzzle': {
          title: 'Word Puzzle',
          description: 'Solve the word puzzle'
        },
        'logic-grid': {
          title: 'Logic Grid',
          description: 'Solve the logic puzzle'
        },
        'math-quiz': {
          title: 'Math Quiz',
          description: 'Solve math problems'
        },
        'sudoku': {
          title: 'Sudoku',
          description: 'Fill in the grid correctly'
        },
        'logic-problem': {
          title: 'Logic Problem',
          description: 'Solve logical reasoning problems'
        },
        // Reaction
        'quick-tap': {
          title: 'Quick Tap',
          description: 'Tap as fast as you can'
        },
        'reaction-time': {
          title: 'Reaction Time',
          description: 'Test your reaction speed'
        },
        'color-match': {
          title: 'Color Match',
          description: 'Match the color or word'
        },
        'symbol-reaction': {
          title: 'Symbol Reaction',
          description: 'React to symbols quickly'
        },
        'timing-game': {
          title: 'Timing Game',
          description: 'Click when color changes'
        },
        'target-detection': {
          title: 'Target Detection',
          description: 'Find targets quickly'
        },
        'quick-reaction': {
          title: 'Quick Reaction',
          description: 'Test your reaction speed'
        },
        // Spatial
        'rotation-puzzle': {
          title: 'Rotation Puzzle',
          description: 'Match the rotated shape'
        },
        'spatial-memory': {
          title: 'Spatial Memory',
          description: 'Remember the spatial arrangement'
        },
        'mental-rotation': {
          title: 'Mental Rotation',
          description: 'Rotate the shape mentally'
        },
        'block-puzzle': {
          title: 'Block Puzzle',
          description: 'Arrange the blocks correctly'
        },
        'rotated-shapes': {
          title: 'Rotated Shapes',
          description: 'Match rotated shapes'
        },
        'distance-judgment': {
          title: 'Distance Judgment',
          description: 'Estimate distances'
        },
        'pattern-in-3d': {
          title: 'Pattern in 3D',
          description: 'Match 3D patterns'
        },
        'mental-rotation-advanced': {
          title: 'Mental Rotation Advanced',
          description: 'Advanced complex shapes rotation'
        },
        'shape-reconstruction': {
          title: 'Shape Reconstruction',
          description: 'Reconstruct shapes from parts'
        },
        'perspective-matching': {
          title: 'Perspective Matching',
          description: 'Match object perspectives'
        },
        'cube-navigation': {
          title: 'Cube Navigation',
          description: 'Navigate through 3D cube'
        },
        // Attention
        'find-difference': {
          title: 'Find Difference',
          description: 'Find the differences'
        },
        'attention-test': {
          title: 'Attention Test',
          description: 'Test your attention span'
        },
        'focused-search': {
          title: 'Focused Search',
          description: 'Find the target item'
        },
        'spotlight': {
          title: 'Spotlight',
          description: 'Find hidden objects with limited visibility'
        },
        'selective-search': {
          title: 'Selective Search',
          description: 'Find targets among distractors'
        },
        'concentration-grid': {
          title: 'Concentration Grid',
          description: 'Find numbers in sequence quickly'
        },
        'focus-tracker': {
          title: 'Focus Tracker',
          description: 'Track one object among many moving objects'
        },
        // Language
        'word-chain': {
          title: 'Word Chain',
          description: 'Connect words with associations'
        },
        'spelling': {
          title: 'Spelling',
          description: 'Spell the words correctly'
        },
        'antonyms': {
          title: 'Antonyms',
          description: 'Find the opposite word'
        },
        'synonyms': {
          title: 'Synonyms',
          description: 'Find the similar word'
        },
        'word-scramble': {
          title: 'Word Scramble',
          description: 'Create correct words from scrambled letters'
        },
        'anagrams': {
          title: 'Anagrams',
          description: 'Create different words from same letters'
        },
        'synonym-matcher': {
          title: 'Synonym Matcher',
          description: 'Match words with same meaning'
        },
        'idiom-riddle': {
          title: 'Idiom Riddle',
          description: 'Guess meanings of idioms and proverbs'
        },
      },
    }
  },
  ko: {
    translation: {
      // Navigation
      leaderboard: '리더보드',
      challenges: '일일 챌린지',
      achievements: '업적',

      // Common UI
      difficulty: '난이도',
      allDifficulties: '모든 난이도',
      easy: '쉬움',
      medium: '보통',
      hard: '어려움',
      bestScores: '최고 점수',
      topScores: '최고 점수',
      progress: '진행률',
      anonymous: '익명',
      play: '플레이',
      start: '시작',
      back: '뒤로',

      // Leaderboard
      leaderboardTitle: '리더보드',
      rank: '순위',
      player: '플레이어',
      game: '개',
      games: '개',
      noScores: '아직 점수가 없습니다. 플레이를 시작하세요!',
      filterByGame: '게임별 필터',
      allGames: '모든 게임',

      // Achievements
      achievementsTitle: '업적',
      unlocked: '해금됨',
      locked: '잠김',
      totalAchievements: '총 업적',
      achievementUnlocked: '업적 달성!',
      achievement: {
        first_play: {
          title: '첫 걸음',
          description: '첫 게임 플레이'
        },
        score_100: {
          title: '세기',
          description: '어떤 게임에서 100점 획득'
        },
        score_500: {
          title: '반 천 년',
          description: '어떤 게임에서 500점 획득'
        },
        play_all_games: {
          title: '탐험가',
          description: '모든 게임 플레이'
        },
        streak_3: {
          title: '3일 연속',
          description: '3일 연속 게임 플레이'
        },
        streak_7: {
          title: '주간 워리어',
          description: '7일 연속 게임 플레이'
        },
        perfect_score: {
          title: '완벽주의자',
          description: '어떤 게임에서 완벽한 점수 획득'
        }
      },

      // Challenges
      challengesTitle: '일일 챌린지',
      todayChallenges: '오늘의 챌린지',
      completed: '완료',
      inProgress: '진행 중',
      notStarted: '시작 안 함',
      challengeCompleted: '챌린지 완료!',
      allChallengesCompleted: '오늘의 모든 챌린지 완료!',
      score: '점수',
      complete: '완료',
      master: '마스터',
      challengeType: {
        score: '점수',
        complete: '완료',
        master: '마스터'
      },

      // Game Categories
      memory: '기억력',
      pattern: '패턴',
      logic: '논리',
      reaction: '반응',
      spatial: '공간',
      attention: '주의력/집중력',
      language: '언어/언어적 능력',

      // Games - Memory
      games: {
        'pattern-matching': {
          title: '패턴 매칭',
          description: '패턴을 기억하고 재현하세요'
        },
        'word-association': {
          title: '단어 연상',
          description: '같은 카테고리의 단어를 찾으세요'
        },
        'number-recall': {
          title: '숫자 기억',
          description: '숫자 순서를 기억하세요'
        },
        'sequence-memory': {
          title: '시퀀스 기억',
          description: '순서를 보고 반복하세요'
        },
        'word-recall': {
          title: '단어 기억',
          description: '단어를 기억하고 입력하세요'
        },
        'card-flip': {
          title: '카드 뒤집기',
          description: '카드 쌍을 맞추세요'
        },
        'location-memory': {
          title: '위치 기억',
          description: '아이템 위치를 기억하세요'
        },
        // Pattern
        'sequence-completion': {
          title: '시퀀스 완성',
          description: '패턴 시퀀스를 완성하세요'
        },
        'pattern-recognition': {
          title: '패턴 인식',
          description: '올바른 패턴을 식별하세요'
        },
        'symbol-matching': {
          title: '심볼 매칭',
          description: '동일한 심볼을 맞추세요'
        },
        'pattern-memory': {
          title: '패턴 기억',
          description: '패턴을 기억하고 재현하세요'
        },
        'maze-navigation': {
          title: '미로 내비게이션',
          description: '미로를 통해 길을 찾으세요'
        },
        'jigsaw-puzzle': {
          title: '지그소 퍼즐',
          description: '조각을 배열하세요'
        },
        // Logic
        'number-sequence': {
          title: '숫자 시퀀스',
          description: '다음 숫자를 찾으세요'
        },
        'word-puzzle': {
          title: '단어 퍼즐',
          description: '단어 퍼즐을 풀으세요'
        },
        'logic-grid': {
          title: '논리 그리드',
          description: '논리 퍼즐을 풀으세요'
        },
        'math-quiz': {
          title: '수학 퀴즈',
          description: '수학 문제를 풀으세요'
        },
        'math-operations': {
          title: '수학 연산',
          description: '수학 문제를 풀으세요'
        },
        'sudoku': {
          title: '스도쿠',
          description: '그리드를 올바르게 채우세요'
        },
        'logic-problem': {
          title: '논리 문제',
          description: '논리적 추론 문제를 풀으세요'
        },
        'logic-puzzle': {
          title: '논리 퍼즐',
          description: '단서를 사용하여 상자를 정렬하세요'
        },
        // Reaction
        'quick-tap': {
          title: '빠른 탭',
          description: '최대한 빠르게 탭하세요'
        },
        'reaction-time': {
          title: '반응 시간',
          description: '반응 속도를 테스트하세요'
        },
        'color-match': {
          title: '색상 매칭',
          description: '색상 또는 단어를 맞추세요'
        },
        'symbol-reaction': {
          title: '심볼 반응',
          description: '심볼에 빠르게 반응하세요'
        },
        'timing-game': {
          title: '타이밍 게임',
          description: '색상이 변할 때 클릭하세요'
        },
        'target-detection': {
          title: '타겟 탐지',
          description: '타겟을 빠르게 찾으세요'
        },
        'quick-reaction': {
          title: '빠른 반응',
          description: '반응 속도를 테스트하세요'
        },
        // Spatial
        'rotation-puzzle': {
          title: '회전 퍼즐',
          description: '회전된 도형을 맞추세요'
        },
        'spatial-memory': {
          title: '공간 기억',
          description: '공간 배열을 기억하세요'
        },
        'mental-rotation': {
          title: '정신적 회전',
          description: '도형을 머릿속으로 회전시키세요'
        },
        'block-puzzle': {
          title: '블록 퍼즐',
          description: '블록을 올바르게 배열하세요'
        },
        'rotated-shapes': {
          title: '회전된 도형',
          description: '회전된 도형을 맞추세요'
        },
        'distance-judgment': {
          title: '거리 판단',
          description: '거리를 추정하세요'
        },
        'pattern-in-3d': {
          title: '3D 패턴',
          description: '3D 패턴을 맞추세요'
        },
        'mental-rotation-advanced': {
          title: '고급 정신적 회전',
          description: '복잡한 도형 회전'
        },
        'shape-reconstruction': {
          title: '도형 재구성',
          description: '부분에서 도형을 재구성하세요'
        },
        'perspective-matching': {
          title: '원근 매칭',
          description: '객체 원근을 맞추세요'
        },
        'cube-navigation': {
          title: '큐브 내비게이션',
          description: '3D 큐브를 탐색하세요'
        },
        // Attention
        'find-difference': {
          title: '틀린그림찾기',
          description: '차이점을 찾으세요'
        },
        'attention-test': {
          title: '주의력 테스트',
          description: '주의력 지속 시간 테스트'
        },
        'focused-search': {
          title: '집중 탐색',
          description: '타겟 아이템을 찾으세요'
        },
        'spotlight': {
          title: '스포트라이트',
          description: '제한된 시야로 숨겨진 물체를 찾으세요'
        },
        'selective-search': {
          title: '선택적 탐색',
          description: '방해 요소 속에서 타겟을 찾으세요'
        },
        'concentration-grid': {
          title: '집중력 그리드',
          description: '숫자를 순서대로 빠르게 찾으세요'
        },
        'focus-tracker': {
          title: '포커스 트래커',
          description: '여러 움직이는 물체 중 하나를 추적하세요'
        },
        // Language
        'word-chain': {
          title: '워드 체인',
          description: '단어를 연결하세요'
        },
        'spelling': {
          title: '스펠링',
          description: '단어를 올바르게 철자하세요'
        },
        'antonyms': {
          title: '반의어',
          description: '반대 의미의 단어를 찾으세요'
        },
        'synonyms': {
          title: '유의어',
          description: '비슷한 의미의 단어를 찾으세요'
        },
        'word-scramble': {
          title: '워드 스크램블',
          description: '섞인 글자로 올바른 단어를 만드세요'
        },
        'anagrams': {
          title: '아나그램',
          description: '같은 글자로 다른 단어 만들기'
        },
        'synonym-matcher': {
          title: '유의어 매칭',
          description: '같은 의미의 단어를 매칭하세요'
        },
        'idiom-riddle': {
          title: '속담 수수께끼',
          description: '속담과 관용사의 뜻을 맞추세요'
        },
      },
    }
  },
  ja: {
    translation: {
      leaderboard: 'リーダーボード',
      challenges: '日次チャレンジ',
      achievements: '実績',
      difficulty: '難易度',
      allDifficulties: '全難易度',
      easy: '簡単',
      medium: '普通',
      hard: '難しい',
      bestScores: 'ベストスコア',
      topScores: 'トップスコア',
      progress: '進行状況',
      anonymous: '匿名',
      play: 'プレイ',
      start: '開始',
      back: '戻る',
      leaderboardTitle: 'リーダーボード',
      rank: '順位',
      player: 'プレイヤー',
      game: 'ゲーム',
      games: 'ゲーム',
      noScores: 'まだスコアがありません。プレイを始めましょう！',
      filterByGame: 'ゲームで絞り込み',
      allGames: 'すべてのゲーム',
      achievementsTitle: '実績',
      unlocked: '解除済み',
      locked: 'ロック',
      totalAchievements: '総実績',
      achievementUnlocked: '実績解除！',
      challengesTitle: '日次チャレンジ',
      todayChallenges: '今日のチャレンジ',
      completed: '完了',
      inProgress: '進行中',
      notStarted: '未開始',
      challengeCompleted: 'チャレンジ完了！',
      allChallengesCompleted: '今日のすべてのチャレンジ完了！',
      score: 'スコア',
      complete: '完了',
      master: 'マスター',
      memory: '記憶力',
      pattern: 'パターン',
      logic: '論理',
      reaction: '反応',
      spatial: '空間',
      attention: '注意力/集中力',
      language: '言語/言語能力',
    }
  },
  zh: {
    translation: {
      leaderboard: '排行榜',
      challenges: '每日挑战',
      achievements: '成就',
      difficulty: '难度',
      allDifficulties: '所有难度',
      easy: '简单',
      medium: '中等',
      hard: '困难',
      bestScores: '最高分',
      topScores: '最高分',
      progress: '进度',
      anonymous: '匿名',
      play: '开始',
      start: '开始',
      back: '返回',
      leaderboardTitle: '排行榜',
      rank: '排名',
      player: '玩家',
      game: '个',
      games: '个',
      noScores: '暂无分数。开始游戏吧！',
      filterByGame: '按游戏筛选',
      allGames: '所有游戏',
      achievementsTitle: '成就',
      unlocked: '已解锁',
      locked: '锁定',
      totalAchievements: '总成就',
      achievementUnlocked: '成就解锁！',
      challengesTitle: '每日挑战',
      todayChallenges: '今日挑战',
      completed: '已完成',
      inProgress: '进行中',
      notStarted: '未开始',
      challengeCompleted: '挑战完成！',
      allChallengesCompleted: '今日所有挑战完成！',
      score: '得分',
      complete: '完成',
      master: '精通',
      memory: '记忆力',
      pattern: '模式',
      logic: '逻辑',
      reaction: '反应',
      spatial: '空间',
      attention: '注意力/专注力',
      language: '语言/语言能力',
    }
  },
  es: {
    translation: {
      leaderboard: 'Clasificación',
      challenges: 'Desafíos Diarios',
      achievements: 'Logros',
      difficulty: 'Dificultad',
      allDifficulties: 'Todas las dificultades',
      easy: 'Fácil',
      medium: 'Medio',
      hard: 'Difícil',
      bestScores: 'Mejores puntuaciones',
      topScores: 'Mejores puntuaciones',
      progress: 'Progreso',
      anonymous: 'Anónimo',
      play: 'Jugar',
      start: 'Iniciar',
      back: 'Atrás',
      leaderboardTitle: 'Clasificación',
      rank: 'Rango',
      player: 'Jugador',
      game: 'Juego',
      games: 'Juegos',
      noScores: 'Aún no hay puntuaciones. ¡Empieza a jugar!',
      filterByGame: 'Filtrar por juego',
      allGames: 'Todos los juegos',
      achievementsTitle: 'Logros',
      unlocked: 'Desbloqueado',
      locked: 'Bloqueado',
      totalAchievements: 'Total de logros',
      achievementUnlocked: '¡Logro desbloqueado!',
      challengesTitle: 'Desafíos Diarios',
      todayChallenges: 'Desafíos de hoy',
      completed: 'Completado',
      inProgress: 'En progreso',
      notStarted: 'No iniciado',
      challengeCompleted: '¡Desafío completado!',
      allChallengesCompleted: '¡Todos los desafíos completados!',
      score: 'Puntuación',
      complete: 'Completar',
      master: 'Maestro',
      memory: 'Memoria',
      pattern: 'Patrón',
      logic: 'Lógica',
      reaction: 'Reacción',
      spatial: 'Espacial',
      attention: 'Atención y Concentración',
      language: 'Lenguaje y Verbal',
    }
  },
  fr: {
    translation: {
      leaderboard: 'Classement',
      challenges: 'Défis quotidiens',
      achievements: 'Réalisations',
      difficulty: 'Difficulté',
      allDifficulties: 'Toutes les difficultés',
      easy: 'Facile',
      medium: 'Moyen',
      hard: 'Difficile',
      bestScores: 'Meilleurs scores',
      topScores: 'Meilleurs scores',
      progress: 'Progression',
      anonymous: 'Anonyme',
      play: 'Jouer',
      start: 'Commencer',
      back: 'Retour',
      leaderboardTitle: 'Classement',
      rank: 'Rang',
      player: 'Joueur',
      game: 'Jeu',
      games: 'Jeux',
      noScores: 'Aucun score pour le moment. Commencez à jouer !',
      filterByGame: 'Filtrer par jeu',
      allGames: 'Tous les jeux',
      achievementsTitle: 'Réalisations',
      unlocked: 'Débloqué',
      locked: 'Verrouillé',
      totalAchievements: 'Total des réalisations',
      achievementUnlocked: 'Réalisation débloquée !',
      challengesTitle: 'Défis quotidiens',
      todayChallenges: 'Défis du jour',
      completed: 'Terminé',
      inProgress: 'En cours',
      notStarted: 'Non commencé',
      challengeCompleted: 'Défi terminé !',
      allChallengesCompleted: 'Tous les défis terminés !',
      score: 'Score',
      complete: 'Compléter',
      master: 'Maître',
      memory: 'Mémoire',
      pattern: 'Motif',
      logic: 'Logique',
      reaction: 'Réaction',
      spatial: 'Spatial',
      attention: 'Attention et concentration',
      language: 'Langage et verbal',
    }
  },
  de: {
    translation: {
      leaderboard: 'Bestenliste',
      challenges: 'Tägliche Herausforderungen',
      achievements: 'Erfolge',
      difficulty: 'Schwierigkeit',
      allDifficulties: 'Alle Schwierigkeiten',
      easy: 'Einfach',
      medium: 'Mittel',
      hard: 'Schwer',
      bestScores: 'Bestpunktzahlen',
      topScores: 'Bestpunktzahlen',
      progress: 'Fortschritt',
      anonymous: 'Anonym',
      play: 'Spielen',
      start: 'Starten',
      back: 'Zurück',
      leaderboardTitle: 'Bestenliste',
      rank: 'Rang',
      player: 'Spieler',
      game: 'Spiel',
      games: 'Spiele',
      noScores: 'Noch keine Punkte. Fang an zu spielen!',
      filterByGame: 'Nach Spiel filtern',
      allGames: 'Alle Spiele',
      achievementsTitle: 'Erfolge',
      unlocked: 'Freigeschaltet',
      locked: 'Gesperrt',
      totalAchievements: 'Gesamterfolge',
      achievementUnlocked: 'Erfolg freigeschaltet!',
      challengesTitle: 'Tägliche Herausforderungen',
      todayChallenges: 'Herausforderungen des Tages',
      completed: 'Abgeschlossen',
      inProgress: 'In Bearbeitung',
      notStarted: 'Nicht gestartet',
      challengeCompleted: 'Herausforderung abgeschlossen!',
      allChallengesCompleted: 'Alle Herausforderungen abgeschlossen!',
      score: 'Punkte',
      complete: 'Abschließen',
      master: 'Meister',
      memory: 'Gedächtnis',
      pattern: 'Muster',
      logic: 'Logik',
      reaction: 'Reaktion',
      spatial: 'Räumlich',
      attention: 'Aufmerksamkeit und Konzentration',
      language: 'Sprache und verbal',
    }
  },
  pt: {
    translation: {
      leaderboard: 'Classificação',
      challenges: 'Desafios Diários',
      achievements: 'Conquistas',
      difficulty: 'Dificuldade',
      allDifficulties: 'Todas as dificuldades',
      easy: 'Fácil',
      medium: 'Médio',
      hard: 'Difícil',
      bestScores: 'Melhores pontuações',
      topScores: 'Melhores pontuações',
      progress: 'Progresso',
      anonymous: 'Anônimo',
      play: 'Jogar',
      start: 'Iniciar',
      back: 'Voltar',
      leaderboardTitle: 'Classificação',
      rank: 'Posição',
      player: 'Jogador',
      game: 'Jogo',
      games: 'Jogos',
      noScores: 'Ainda não há pontuações. Comece a jogar!',
      filterByGame: 'Filtrar por jogo',
      allGames: 'Todos os jogos',
      achievementsTitle: 'Conquistas',
      unlocked: 'Desbloqueado',
      locked: 'Bloqueado',
      totalAchievements: 'Total de conquistas',
      achievementUnlocked: 'Conquista desbloqueada!',
      challengesTitle: 'Desafios Diários',
      todayChallenges: 'Desafios de hoje',
      completed: 'Concluído',
      inProgress: 'Em andamento',
      notStarted: 'Não iniciado',
      challengeCompleted: 'Desafio concluído!',
      allChallengesCompleted: 'Todos os desafios concluídos!',
      score: 'Pontuação',
      complete: 'Concluir',
      master: 'Mestre',
      memory: 'Memória',
      pattern: 'Padrão',
      logic: 'Lógica',
      reaction: 'Reação',
      spatial: 'Espacial',
      attention: 'Atenção e Concentração',
      language: 'Linguagem e Verbal',
    }
  },
  ru: {
    translation: {
      leaderboard: 'Рейтинг',
      challenges: 'Ежедневные вызовы',
      achievements: 'Достижения',
      difficulty: 'Сложность',
      allDifficulties: 'Все сложности',
      easy: 'Легко',
      medium: 'Средне',
      hard: 'Сложно',
      bestScores: 'Лучшие результаты',
      topScores: 'Лучшие результаты',
      progress: 'Прогресс',
      anonymous: 'Аноним',
      play: 'Играть',
      start: 'Начать',
      back: 'Назад',
      leaderboardTitle: 'Рейтинг',
      rank: 'Ранг',
      player: 'Игрок',
      game: 'Игра',
      games: 'Игры',
      noScores: 'Результатов пока нет. Начните играть!',
      filterByGame: 'Фильтр по игре',
      allGames: 'Все игры',
      achievementsTitle: 'Достижения',
      unlocked: 'Разблокировано',
      locked: 'Заблокировано',
      totalAchievements: 'Всего достижений',
      achievementUnlocked: 'Достижение разблокировано!',
      challengesTitle: 'Ежедневные вызовы',
      todayChallenges: 'Вызовы дня',
      completed: 'Выполнено',
      inProgress: 'В процессе',
      notStarted: 'Не начато',
      challengeCompleted: 'Вызов выполнен!',
      allChallengesCompleted: 'Все вызовы выполнены!',
      score: 'Счёт',
      complete: 'Выполнить',
      master: 'Мастер',
      memory: 'Память',
      pattern: 'Шаблон',
      logic: 'Логика',
      reaction: 'Реакция',
      spatial: 'Пространственное',
      attention: 'Внимание и концентрация',
      language: 'Язык и вербальный',
    }
  },
  ar: {
    translation: {
      leaderboard: 'اللوحة المتصدرة',
      challenges: 'التحديات اليومية',
      achievements: 'الإنجازات',
      difficulty: 'الصعوبة',
      allDifficulties: 'جميع الصعوبات',
      easy: 'سهل',
      medium: 'متوسط',
      hard: 'صعب',
      bestScores: 'أعلى النتائج',
      topScores: 'أعلى النتائج',
      progress: 'التقدم',
      anonymous: 'مجهول',
      play: 'العب',
      start: 'ابدأ',
      back: 'رجوع',
      leaderboardTitle: 'اللوحة المتصدرة',
      rank: 'الترتيب',
      player: 'اللاعب',
      game: 'لعبة',
      games: 'ألعاب',
      noScores: 'لا توجد نتائج بعد. ابدأ اللعب!',
      filterByGame: 'تصفية حسب اللعبة',
      allGames: 'جميع الألعاب',
      achievementsTitle: 'الإنجازات',
      unlocked: 'مفتوح',
      locked: 'مقفل',
      totalAchievements: 'إجمالي الإنجازات',
      achievementUnlocked: 'تم فتح الإنجاز!',
      challengesTitle: 'التحديات اليومية',
      todayChallenges: 'تحديات اليوم',
      completed: 'مكتمل',
      inProgress: 'قيد التقدم',
      notStarted: 'لم يبدأ',
      challengeCompleted: 'اكتمل التحدي!',
      allChallengesCompleted: 'اكتملت جميع التحديات!',
      score: 'النتيجة',
      complete: 'إكمال',
      master: 'خبير',
      memory: 'الذاكرة',
      pattern: 'النمط',
      logic: 'المنطق',
      reaction: 'التفاعل',
      spatial: 'الفضاء',
      attention: 'التركيز والانتباه',
      language: 'اللغة والتعبير',
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
