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
      achievement: {
        first_play: { title: '最初の一歩', description: '最初のゲームをプレイする' },
        score_100: { title: 'センチュリー', description: '任意のゲームで100点を取る' },
        score_500: { title: 'ハーフミレニアム', description: '任意のゲームで500点を取る' },
        play_all_games: { title: '探検家', description: '利用可能なすべてのゲームをプレイする' },
        streak_3: { title: '3日連続', description: '3日連続でゲームをプレイする' },
        streak_7: { title: '週間ウォリアー', description: '7日連続でゲームをプレイする' },
        perfect_score: { title: '完璧主義者', description: '任意のゲームで完璧なスコアを取る' }
      },
      challengesTitle: '日次チャレンジ',
      todayChallenges: '今日のチャレンジ',
      yesterday: '昨日',
      completed: '完了',
      inProgress: '進行中',
      notStarted: '未開始',
      challengeCompleted: 'チャレンジ完了！',
      allChallengesCompleted: '今日のすべてのチャレンジ完了！',
      score: 'スコア',
      complete: '完了',
      master: 'マスター',
      challengeType: { score: 'スコア', complete: '完了', master: 'マスター' },

      memory: '記憶力',
      pattern: 'パターン',
      logic: '論理',
      reaction: '反応',
      spatial: '空間',
      attention: '注意力/集中力',
      language: '言語/言語能力',

      games: {
        'pattern-matching': { title: 'パターンマッチング', description: 'パターンを記憶して再現する' },
        'word-association': { title: '単語連想', description: '同じカテゴリの単語を見つける' },
        'number-recall': { title: '数字の記憶', description: '数字の順序を記憶する' },
        'sequence-memory': { title: 'シーケンス記憶', description: '順序を見て繰り返す' },
        'word-recall': { title: '単語の記憶', description: '単語を記憶して入力する' },
        'card-flip': { title: 'カードめくり', description: 'カードのペアを合わせる' },
        'location-memory': { title: '位置記憶', description: 'アイテムの位置を記憶する' },
        'sequence-completion': { title: 'シーケンス完成', description: 'パターンシーケンスを完成させる' },
        'pattern-recognition': { title: 'パターン認識', description: '正しいパターンを識別する' },
        'symbol-matching': { title: 'シンボルマッチング', description: '同じシンボルを合わせる' },
        'pattern-memory': { title: 'パターン記憶', description: 'パターンを記憶して再現する' },
        'maze-navigation': { title: '迷路ナビゲーション', description: '迷路の道を見つける' },
        'jigsaw-puzzle': { title: 'ジグソーパズル', description: 'ピースを配置する' },
        'number-sequence': { title: '数字シーケンス', description: '次の数字を見つける' },
        'word-puzzle': { title: '単語パズル', description: '単語パズルを解く' },
        'logic-grid': { title: '論理グリッド', description: '論理パズルを解く' },
        'math-quiz': { title: '数学クイズ', description: '数学問題を解く' },
        'math-operations': { title: '計算', description: '数学問題を解く' },
        'sudoku': { title: '数独', description: 'グリッドを正しく埋める' },
        'logic-problem': { title: '論理問題', description: '論理的推論問題を解く' },
        'logic-puzzle': { title: '論理パズル', description: '手がかりを使って箱を配置する' },
        'quick-tap': { title: 'クイックタップ', description: 'できるだけ速くタップする' },
        'reaction-time': { title: '反応時間', description: '反応速度をテストする' },
        'color-match': { title: '色マッチング', description: '色または単語を合わせる' },
        'symbol-reaction': { title: 'シンボル反応', description: 'シンボルに素早く反応する' },
        'timing-game': { title: 'タイミングゲーム', description: '色が変わったらクリックする' },
        'target-detection': { title: 'ターゲット検出', description: 'ターゲットを素早く見つける' },
        'quick-reaction': { title: 'クイックリアクション', description: '反応速度をテストする' },
        'rotation-puzzle': { title: '回転パズル', description: '回転した図形を合わせる' },
        'spatial-memory': { title: '空間記憶', description: '空間配置を記憶する' },
        'mental-rotation': { title: 'メンタルローテーション', description: '図形を頭の中で回転させる' },
        'block-puzzle': { title: 'ブロックパズル', description: 'ブロックを正しく配置する' },
        'rotated-shapes': { title: '回転した図形', description: '回転した図形を合わせる' },
        'distance-judgment': { title: '距離判断', description: '距離を推定する' },
        'pattern-in-3d': { title: '3Dパターン', description: '3Dパターンを合わせる' },
        'mental-rotation-advanced': { title: '高度なメンタルローテーション', description: '複雑な図形の回転' },
        'shape-reconstruction': { title: '図形再構築', description: '部品から図形を再構築する' },
        'perspective-matching': { title: 'パースペクティブマッチング', description: 'オブジェクトの視点を合わせる' },
        'cube-navigation': { title: 'キューブナビゲーション', description: '3Dキューブをナビゲートする' },
        'find-difference': { title: '間違い探し', description: '違いを見つける' },
        'attention-test': { title: '注意力テスト', description: '注意力持続時間をテストする' },
        'focused-search': { title: '集中検索', description: 'ターゲットアイテムを見つける' },
        'spotlight': { title: 'スポットライト', description: '限られた視野で隠されたオブジェクトを見つける' },
        'selective-search': { title: '選択的検索', description: '邪魔なものの中でターゲットを見つける' },
        'concentration-grid': { title: '集中力グリッド', description: '数字を順番に素早く見つける' },
        'focus-tracker': { title: 'フォーカストラッカー', description: '多くの動くオブジェクトの中から1つを追跡する' },
        'word-chain': { title: '単語チェーン', description: '単語を繋げる' },
        'spelling': { title: 'スペリング', description: '単語を正しく綴る' },
        'antonyms': { title: '反対語', description: '反対の意味の単語を見つける' },
        'synonyms': { title: '類義語', description: '似た意味の単語を見つける' },
        'word-scramble': { title: 'ワードスクランブル', description: 'バラバラの文字で正しい単語を作る' },
        'anagrams': { title: 'アナグラム', description: '同じ文字で違う単語を作る' },
        'synonym-matcher': { title: '類義語マッチング', description: '同じ意味の単語を合わせる' },
        'idiom-riddle': { title: 'ことわざなぞなぞ', description: 'ことわざと慣用句の意味を当てる' },
      },
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
      achievement: {
        first_play: { title: '第一步', description: '玩你的第一个游戏' },
        score_100: { title: '百年', description: '任意游戏中获得100分' },
        score_500: { title: '半千年', description: '任意游戏中获得500分' },
        play_all_games: { title: '探索者', description: '玩所有可用游戏' },
        streak_3: { title: '三天连续', description: '连续3天玩游戏' },
        streak_7: { title: '周战士', description: '连续7天玩游戏' },
        perfect_score: { title: '完美主义者', description: '任意游戏中获得完美分数' }
      },
      challengesTitle: '每日挑战',
      todayChallenges: '今日挑战',
      yesterday: '昨天',
      completed: '已完成',
      inProgress: '进行中',
      notStarted: '未开始',
      challengeCompleted: '挑战完成！',
      allChallengesCompleted: '今日所有挑战完成！',
      score: '得分',
      complete: '完成',
      master: '精通',
      challengeType: { score: '得分', complete: '完成', master: '精通' },

      memory: '记忆力',
      pattern: '模式',
      logic: '逻辑',
      reaction: '反应',
      spatial: '空间',
      attention: '注意力/专注力',
      language: '语言/语言能力',

      games: {
        'pattern-matching': { title: '图案匹配', description: '记住并重现图案' },
        'word-association': { title: '词语联想', description: '找出同类词语' },
        'number-recall': { title: '数字记忆', description: '记住数字顺序' },
        'sequence-memory': { title: '序列记忆', description: '观察并重复序列' },
        'word-recall': { title: '词语记忆', description: '记住并输入词语' },
        'card-flip': { title: '翻牌', description: '配对卡片' },
        'location-memory': { title: '位置记忆', description: '记住物品位置' },
        'sequence-completion': { title: '序列完成', description: '完成图案序列' },
        'pattern-recognition': { title: '图案识别', description: '识别正确的图案' },
        'symbol-matching': { title: '符号匹配', description: '匹配相同符号' },
        'pattern-memory': { title: '图案记忆', description: '记住并重现图案' },
        'maze-navigation': { title: '迷宫导航', description: '找到迷宫出路' },
        'jigsaw-puzzle': { title: '拼图', description: '排列拼图' },
        'number-sequence': { title: '数字序列', description: '找出下一个数字' },
        'word-puzzle': { title: '词语谜题', description: '解词谜' },
        'logic-grid': { title: '逻辑网格', description: '解逻辑谜题' },
        'math-quiz': { title: '数学测验', description: '解决数学问题' },
        'math-operations': { title: '数学运算', description: '解决数学问题' },
        'sudoku': { title: '数独', description: '正确填充网格' },
        'logic-problem': { title: '逻辑问题', description: '解决逻辑推理问题' },
        'logic-puzzle': { title: '逻辑谜题', description: '使用线索排列盒子' },
        'quick-tap': { title: '快速点击', description: '尽可能快地点击' },
        'reaction-time': { title: '反应时间', description: '测试反应速度' },
        'color-match': { title: '颜色匹配', description: '匹配颜色或文字' },
        'symbol-reaction': { title: '符号反应', description: '对符号快速反应' },
        'timing-game': { title: '时机游戏', description: '颜色变化时点击' },
        'target-detection': { title: '目标检测', description: '快速找到目标' },
        'quick-reaction': { title: '快速反应', description: '测试反应速度' },
        'rotation-puzzle': { title: '旋转谜题', description: '匹配旋转形状' },
        'spatial-memory': { title: '空间记忆', description: '记住空间排列' },
        'mental-rotation': { title: '心理旋转', description: '在脑海中旋转形状' },
        'block-puzzle': { title: '方块谜题', description: '正确排列方块' },
        'rotated-shapes': { title: '旋转形状', description: '匹配旋转形状' },
        'distance-judgment': { title: '距离判断', description: '估算距离' },
        'pattern-in-3d': { title: '3D图案', description: '匹配3D图案' },
        'mental-rotation-advanced': { title: '高级心理旋转', description: '复杂形状旋转' },
        'shape-reconstruction': { title: '形状重构', description: '从部分重构形状' },
        'perspective-matching': { title: '透视匹配', description: '匹配物体视角' },
        'cube-navigation': { title: '立方体导航', description: '导航3D立方体' },
        'find-difference': { title: '找不同', description: '找出差异' },
        'attention-test': { title: '注意力测试', description: '测试注意力持续时间' },
        'focused-search': { title: '集中搜索', description: '找到目标物品' },
        'spotlight': { title: '聚光灯', description: '用有限视野找到隐藏物品' },
        'selective-search': { title: '选择性搜索', description: '在干扰项中找到目标' },
        'concentration-grid': { title: '注意力网格', description: '按顺序快速找到数字' },
        'focus-tracker': { title: '焦点追踪', description: '从多个移动物体中追踪一个' },
        'word-chain': { title: '词语链', description: '连接词语' },
        'spelling': { title: '拼写', description: '正确拼写词语' },
        'antonyms': { title: '反义词', description: '找反义词语' },
        'synonyms': { title: '同义词', description: '找近义词语' },
        'word-scramble': { title: '词语重组', description: '从打乱的字母组成正确词语' },
        'anagrams': { title: '变位词', description: '用相同字母组成不同词语' },
        'synonym-matcher': { title: '同义词匹配', description: '匹配同义词语' },
        'idiom-riddle': { title: '成语谜语', description: '猜成语和谚语的意思' },
      },
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
      achievement: {
        first_play: { title: 'Primeros Pasos', description: 'Juega tu primer juego' },
        score_100: { title: 'Centuria', description: 'Obtén 100 puntos en cualquier juego' },
        score_500: { title: 'Medio Milenio', description: 'Obtén 500 puntos en cualquier juego' },
        play_all_games: { title: 'Explorador', description: 'Juega todos los juegos disponibles' },
        streak_3: { title: 'Racha de Tres', description: 'Juega por 3 días consecutivos' },
        streak_7: { title: 'Guerrero Semanal', description: 'Juega por 7 días consecutivos' },
        perfect_score: { title: 'Perfeccionista', description: 'Obtén un puntaje perfecto en cualquier juego' }
      },
      challengesTitle: 'Desafíos Diarios',
      todayChallenges: 'Desafíos de hoy',
      yesterday: 'Ayer',
      completed: 'Completado',
      inProgress: 'En progreso',
      notStarted: 'No iniciado',
      challengeCompleted: '¡Desafío completado!',
      allChallengesCompleted: '¡Todos los desafíos completados!',
      score: 'Puntuación',
      complete: 'Completar',
      master: 'Maestro',
      challengeType: { score: 'Puntuación', complete: 'Completar', master: 'Maestro' },

      memory: 'Memoria',
      pattern: 'Patrón',
      logic: 'Lógica',
      reaction: 'Reacción',
      spatial: 'Espacial',
      attention: 'Atención y Concentración',
      language: 'Lenguaje y Verbal',

      games: {
        'pattern-matching': { title: 'Coincidencia de Patrones', description: 'Recuerda y reproduce patrones' },
        'word-association': { title: 'Asociación de Palabras', description: 'Encuentra palabras en la misma categoría' },
        'number-recall': { title: 'Recordar Números', description: 'Recuerda secuencias de números' },
        'sequence-memory': { title: 'Memoria de Secuencia', description: 'Mira y repite la secuencia' },
        'word-recall': { title: 'Recordar Palabras', description: 'Recuerda y escribe las palabras' },
        'card-flip': { title: 'Voltear Cartas', description: 'Empareja los pares de cartas' },
        'location-memory': { title: 'Memoria de Ubicación', description: 'Recuerda las posiciones de los elementos' },
        'sequence-completion': { title: 'Completar Secuencia', description: 'Completa la secuencia del patrón' },
        'pattern-recognition': { title: 'Reconocimiento de Patrones', description: 'Identifica el patrón correcto' },
        'symbol-matching': { title: 'Coincidencia de Símbolos', description: 'Empareja símbolos idénticos' },
        'pattern-memory': { title: 'Memoria de Patrones', description: 'Recuerda y recrea patrones' },
        'maze-navigation': { title: 'Navegación de Laberinto', description: 'Encuentra tu camino a través del laberinto' },
        'jigsaw-puzzle': { title: 'Rompecabezas', description: 'Arma las piezas' },
        'number-sequence': { title: 'Secuencia Numérica', description: 'Encuentra el siguiente número' },
        'word-puzzle': { title: 'Rompecabezas de Palabras', description: 'Resuelve el rompecabezas' },
        'logic-grid': { title: 'Cuadrícula Lógica', description: 'Resuelve el acertijo lógico' },
        'math-quiz': { title: 'Cuestionario de Matemáticas', description: 'Resuelve problemas matemáticos' },
        'math-operations': { title: 'Operaciones Matemáticas', description: 'Resuelve problemas matemáticos' },
        'sudoku': { title: 'Sudoku', description: 'Llena la cuadrícula correctamente' },
        'logic-problem': { title: 'Problema Lógico', description: 'Resuelve problemas de razonamiento lógico' },
        'logic-puzzle': { title: 'Rompecabezas Lógico', description: 'Arma las cajas usando pistas' },
        'quick-tap': { title: 'Tocar Rápido', description: 'Toca lo más rápido posible' },
        'reaction-time': { title: 'Tiempo de Reacción', description: 'Prueba tu velocidad de reacción' },
        'color-match': { title: 'Coincidencia de Colores', description: 'Coincide el color o la palabra' },
        'symbol-reaction': { title: 'Reacción a Símbolos', description: 'Reacciona rápidamente a símbolos' },
        'timing-game': { title: 'Juego de Tiempos', description: 'Haz clic cuando cambie el color' },
        'target-detection': { title: 'Detección de Objetivos', description: 'Encuentra objetivos rápidamente' },
        'quick-reaction': { title: 'Reacción Rápida', description: 'Prueba tu velocidad de reacción' },
        'rotation-puzzle': { title: 'Rompecabezas de Rotación', description: 'Coincide la forma rotada' },
        'spatial-memory': { title: 'Memoria Espacial', description: 'Recuerda el arreglo espacial' },
        'mental-rotation': { title: 'Rotación Mental', description: 'Rota la forma mentalmente' },
        'block-puzzle': { title: 'Rompecabezas de Bloques', description: 'Arma los bloques correctamente' },
        'rotated-shapes': { title: 'Formas Rotadas', description: 'Coincide formas rotadas' },
        'distance-judgment': { title: 'Juicio de Distancia', description: 'Estima distancias' },
        'pattern-in-3d': { title: 'Patrón en 3D', description: 'Coincide patrones 3D' },
        'mental-rotation-advanced': { title: 'Rotación Mental Avanzada', description: 'Rotación de formas complejas' },
        'shape-reconstruction': { title: 'Reconstrucción de Formas', description: 'Reconstruye formas a partir de partes' },
        'perspective-matching': { title: 'Coincidencia de Perspectiva', description: 'Coincide perspectivas de objetos' },
        'cube-navigation': { title: 'Navegación de Cubo', description: 'Navega a través del cubo 3D' },
        'find-difference': { title: 'Encuentra la Diferencia', description: 'Encuentra las diferencias' },
        'attention-test': { title: 'Prueba de Atención', description: 'Prueba tu tiempo de atención' },
        'focused-search': { title: 'Búsqueda Focalizada', description: 'Encuentra el elemento objetivo' },
        'spotlight': { title: 'Foco', description: 'Encuentra objetos ocultos con visibilidad limitada' },
        'selective-search': { title: 'Búsqueda Selectiva', description: 'Encuentra objetivos entre distractores' },
        'concentration-grid': { title: 'Cuadrícula de Concentración', description: 'Encuentra números en secuencia rápidamente' },
        'focus-tracker': { title: 'Rastreador de Enfoque', description: 'Rastrea un objeto entre muchos en movimiento' },
        'word-chain': { title: 'Cadena de Palabras', description: 'Conecta palabras con asociaciones' },
        'spelling': { title: 'Ortografía', description: 'Escribe las palabras correctamente' },
        'antonyms': { title: 'Antónimos', description: 'Encuentra la palabra opuesta' },
        'synonyms': { title: 'Sinónimos', description: 'Encuentra una palabra similar' },
        'word-scramble': { title: 'Palabras Desordenadas', description: 'Crea palabras correctas de letras desordenadas' },
        'anagrams': { title: 'Anagramas', description: 'Crea palabras diferentes de las mismas letras' },
        'synonym-matcher': { title: 'Emparejador de Sinónimos', description: 'Empareja palabras con el mismo significado' },
        'idiom-riddle': { title: 'Acertijo de Modismos', description: 'Adivina significados de modismos y proverbios' },
      },
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
      achievement: {
        first_play: { title: 'Premiers Pas', description: 'Jouez votre premier jeu' },
        score_100: { title: 'Centenaire', description: 'Obtenez 100 points dans n\'importe quel jeu' },
        score_500: { title: 'Demi-Millénaire', description: 'Obtenez 500 points dans n\'importe quel jeu' },
        play_all_games: { title: 'Explorateur', description: 'Jouez tous les jeux disponibles' },
        streak_3: { title: 'Série de Trois', description: 'Jouez pendant 3 jours consécutifs' },
        streak_7: { title: 'Guerrier de la Semaine', description: 'Jouez pendant 7 jours consécutifs' },
        perfect_score: { title: 'Perfectionniste', description: 'Obtenez un score parfait dans n\'importe quel jeu' }
      },
      challengesTitle: 'Défis quotidiens',
      todayChallenges: 'Défis du jour',
      yesterday: 'Hier',
      completed: 'Terminé',
      inProgress: 'En cours',
      notStarted: 'Non commencé',
      challengeCompleted: 'Défi terminé !',
      allChallengesCompleted: 'Tous les défis terminés !',
      score: 'Score',
      complete: 'Compléter',
      master: 'Maître',
      challengeType: { score: 'Score', complete: 'Compléter', master: 'Maître' },

      memory: 'Mémoire',
      pattern: 'Motif',
      logic: 'Logique',
      reaction: 'Réaction',
      spatial: 'Spatial',
      attention: 'Attention et concentration',
      language: 'Langage et verbal',

      games: {
        'pattern-matching': { title: 'Correspondance de Motifs', description: 'Mémorisez et reproduisez les motifs' },
        'word-association': { title: 'Association de Mots', description: 'Trouvez des mots dans la même catégorie' },
        'number-recall': { title: 'Mémorisation de Nombres', description: 'Mémorisez des séquences de nombres' },
        'sequence-memory': { title: 'Mémoire de Séquence', description: 'Regardez et répétez la séquence' },
        'word-recall': { title: 'Mémorisation de Mots', description: 'Mémorisez et tapez les mots' },
        'card-flip': { title: 'Retournement de Cartes', description: 'Faites correspondre les paires de cartes' },
        'location-memory': { title: 'Mémoire des Lieux', description: 'Mémorisez les positions des objets' },
        'sequence-completion': { title: 'Complétion de Séquence', description: 'Complétez la séquence de motifs' },
        'pattern-recognition': { title: 'Reconnaissance de Motifs', description: 'Identifiez le bon motif' },
        'symbol-matching': { title: 'Correspondance de Symboles', description: 'Faites correspondre les symboles identiques' },
        'pattern-memory': { title: 'Mémoire de Motifs', description: 'Mémorisez et recréez des motifs' },
        'maze-navigation': { title: 'Navigation de Labyrinthe', description: 'Trouvez votre chemin dans le labyrinthe' },
        'jigsaw-puzzle': { title: 'Puzzle', description: 'Disposez les pièces' },
        'number-sequence': { title: 'Séquence de Nombres', description: 'Trouvez le nombre suivant' },
        'word-puzzle': { title: 'Puzzle de Mots', description: 'Résolvez le puzzle' },
        'logic-grid': { title: 'Grille Logique', description: 'Résolvez le puzzle logique' },
        'math-quiz': { title: 'Quiz Mathématique', description: 'Résolvez des problèmes mathématiques' },
        'math-operations': { title: 'Opérations Mathématiques', description: 'Résolvez des problèmes mathématiques' },
        'sudoku': { title: 'Sudoku', description: 'Remplissez la grille correctement' },
        'logic-problem': { title: 'Problème Logique', description: 'Résolvez des problèmes de raisonnement logique' },
        'logic-puzzle': { title: 'Puzzle Logique', description: 'Disposez les boîtes en utilisant des indices' },
        'quick-tap': { title: 'Tap Rapide', description: 'Appuyez aussi vite que possible' },
        'reaction-time': { title: 'Temps de Réaction', description: 'Testez votre vitesse de réaction' },
        'color-match': { title: 'Correspondance de Couleurs', description: 'Faites correspondre la couleur ou le mot' },
        'symbol-reaction': { title: 'Réaction aux Symboles', description: 'Réagissez rapidement aux symboles' },
        'timing-game': { title: 'Jeu de Timing', description: 'Cliquez quand la couleur change' },
        'target-detection': { title: 'Détection de Cibles', description: 'Trouvez rapidement les cibles' },
        'quick-reaction': { title: 'Réaction Rapide', description: 'Testez votre vitesse de réaction' },
        'rotation-puzzle': { title: 'Puzzle de Rotation', description: 'Faites correspondre la forme rotative' },
        'spatial-memory': { title: 'Mémoire Spatiale', description: 'Mémorisez l\'arrangement spatial' },
        'mental-rotation': { title: 'Rotation Mentale', description: 'Faites pivoter la forme mentalement' },
        'block-puzzle': { title: 'Puzzle de Blocs', description: 'Disposez les blocs correctement' },
        'rotated-shapes': { title: 'Formes Rotatives', description: 'Faites correspondre les formes rotatives' },
        'distance-judgment': { title: 'Jugement de Distance', description: 'Estimez les distances' },
        'pattern-in-3d': { title: 'Motif en 3D', description: 'Faites correspondre les motifs 3D' },
        'mental-rotation-advanced': { title: 'Rotation Mentale Avancée', description: 'Rotation de formes complexes' },
        'shape-reconstruction': { title: 'Reconstruction de Formes', description: 'Reconstituez des formes à partir de parties' },
        'perspective-matching': { title: 'Correspondance de Perspective', description: 'Faites correspondre les perspectives d\'objets' },
        'cube-navigation': { title: 'Navigation de Cube', description: 'Naviguez dans le cube 3D' },
        'find-difference': { title: 'Trouvez la Différence', description: 'Trouvez les différences' },
        'attention-test': { title: 'Test d\'Attention', description: 'Testez votre durée d\'attention' },
        'focused-search': { title: 'Recherche Focalisée', description: 'Trouvez l\'objet cible' },
        'spotlight': { title: 'Spotlight', description: 'Trouvez des objets cachés avec une visibilité limitée' },
        'selective-search': { title: 'Recherche Sélective', description: 'Trouvez des cibles parmi les distracteurs' },
        'concentration-grid': { title: 'Grille de Concentration', description: 'Trouvez rapidement des nombres en séquence' },
        'focus-tracker': { title: 'Suivi de Focus', description: 'Suivez un objet parmi plusieurs en mouvement' },
        'word-chain': { title: 'Chaîne de Mots', description: 'Connectez les mots par associations' },
        'spelling': { title: 'Orthographe', description: 'Épelez les mots correctement' },
        'antonyms': { title: 'Antonymes', description: 'Trouvez le mot opposé' },
        'synonyms': { title: 'Synonymes', description: 'Trouvez un mot similaire' },
        'word-scramble': { title: 'Mots Mêlés', description: 'Créez des mots corrects à partir de lettres mélangées' },
        'anagrams': { title: 'Anagrammes', description: 'Créez des mots différents à partir des mêmes lettres' },
        'synonym-matcher': { title: 'Correspondance de Synonymes', description: 'Faites correspondre des mots avec le même sens' },
        'idiom-riddle': { title: 'Énigme d\'Idiomes', description: 'Devinez les significations d\'idiomes et de proverbes' },
      },
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

      games: {
        'pattern-matching': { title: 'Mustererkennung', description: 'Muster merken und reproduzieren' },
        'word-association': { title: 'Wortassoziation', description: 'Wörter gleicher Kategorie finden' },
        'number-recall': { title: 'Zahlenmerken', description: 'Zahlenfolgen merken' },
        'sequence-memory': { title: 'Reihenfolgespeicher', description: 'Reihenfolge ansehen und wiederholen' },
        'word-recall': { title: 'Wortgedächtnis', description: 'Wörter merken und eingeben' },
        'card-flip': { title: 'Karten umdrehen', description: 'Kartenpaare finden' },
        'location-memory': { title: 'Standortgedächtnis', description: 'Objektstandorte merken' },
        'sequence-completion': { title: 'Reihenfolgen-Vervollständigung', description: 'Muster-Reihenfolge vervollständigen' },
        'pattern-recognition': { title: 'Mustererkennung', description: 'Richtiges Muster identifizieren' },
        'symbol-matching': { title: 'Symbolabgleich', description: 'Identische Symbole zuordnen' },
        'pattern-memory': { title: 'Mustergedächtnis', description: 'Muster merken und neu erstellen' },
        'maze-navigation': { title: 'Labyrinthnavigation', description: 'Weg durch das Labyrinth finden' },
        'jigsaw-puzzle': { title: 'Puzzle', description: 'Teile anordnen' },
        'number-sequence': { title: 'Zahlenfolge', description: 'Nächste Zahl finden' },
        'word-puzzle': { title: 'Worträtsel', description: 'Rätsel lösen' },
        'logic-grid': { title: 'Logikgitter', description: 'Logikrätsel lösen' },
        'math-quiz': { title: 'Mathequiz', description: 'Mathematikaufgaben lösen' },
        'math-operations': { title: 'Rechenoperationen', description: 'Mathematikaufgaben lösen' },
        'sudoku': { title: 'Sudoku', description: 'Gitter korrekt ausfüllen' },
        'logic-problem': { title: 'Logikproblem', description: 'Logische Probleme lösen' },
        'logic-puzzle': { title: 'Logikrätsel', description: 'Boxen mit Hinweisen anordnen' },
        'quick-tap': { title: 'Schnelles Tippen', description: 'So schnell wie möglich tippen' },
        'reaction-time': { title: 'Reaktionszeit', description: 'Reaktionsgeschwindigkeit testen' },
        'color-match': { title: 'Farbabgleich', description: 'Farbe oder Wort zuordnen' },
        'symbol-reaction': { title: 'Symbolreaktion', description: 'Schnell auf Symbole reagieren' },
        'timing-game': { title: 'Zeitspiel', description: 'Klicken, wenn Farbe sich ändert' },
        'target-detection': { title: 'Zielerfassung', description: 'Ziele schnell finden' },
        'quick-reaction': { title: 'Schnelle Reaktion', description: 'Reaktionsgeschwindigkeit testen' },
        'rotation-puzzle': { title: 'Drehrätsel', description: 'Gedrehte Form zuordnen' },
        'spatial-memory': { title: 'Räumliches Gedächtnis', description: 'Räumliche Anordnung merken' },
        'mental-rotation': { title: 'Mentale Drehung', description: 'Form im Kopf drehen' },
        'block-puzzle': { title: 'Blockrätsel', description: 'Blöcke korrekt anordnen' },
        'rotated-shapes': { title: 'Gedrehte Formen', description: 'Gedrehte Formen zuordnen' },
        'distance-judgment': { title: 'Abstandseinschätzung', description: 'Entfernungen schätzen' },
        'pattern-in-3d': { title: '3D-Muster', description: '3D-Muster zuordnen' },
        'mental-rotation-advanced': { title: 'Erweiterte mentale Drehung', description: 'Komplexe Formdrehungen' },
        'shape-reconstruction': { title: 'Formrekonstruktion', description: 'Formen aus Teilen wiederherstellen' },
        'perspective-matching': { title: 'Perspektivabgleich', description: 'Objektperspektiven zuordnen' },
        'cube-navigation': { title: 'Würfelnavigation', description: 'Durch 3D-Würfel navigieren' },
        'find-difference': { title: 'Unterschiede finden', description: 'Unterschiede finden' },
        'attention-test': { title: 'Aufmerksamkeitstest', description: 'Aufmerksamkeitsspanne testen' },
        'focused-search': { title: 'Fokussierte Suche', description: 'Zielobjekt finden' },
        'spotlight': { title: 'Scheinwerfer', description: 'Versteckte Objekte mit eingeschränkter Sicht finden' },
        'selective-search': { title: 'Selektive Suche', description: 'Ziele unter Störreizen finden' },
        'concentration-grid': { title: 'Konzentrationsgitter', description: 'Zahlen schnell in Reihenfolge finden' },
        'focus-tracker': { title: 'Fokus-Tracker', description: 'Einem Objekt unter mehreren beweglichen folgen' },
        'word-chain': { title: 'Wortkette', description: 'Wörter mit Assoziationen verbinden' },
        'spelling': { title: 'Rechtschreibung', description: 'Wörter richtig schreiben' },
        'antonyms': { title: 'Gegenteile', description: 'Entgegengesetztes Wort finden' },
        'synonyms': { title: 'Synonyme', description: 'Ähnliches Wort finden' },
        'word-scramble': { title: 'Wörteraten', description: 'Richtige Wörter aus vermischten Buchstaben bilden' },
        'anagrams': { title: 'Anagramme', description: 'Andere Wörter aus denselben Buchstaben' },
        'synonym-matcher': { title: 'Synonym-Abgleich', description: 'Wörter gleicher Bedeutung zuordnen' },
        'idiom-riddle': { title: 'Redewendungs-Rätsel', description: 'Bedeutungen von Redewendungen und Sprichwörtern erraten' },
      },
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

      games: {
        'pattern-matching': { title: 'Correspondência de Padrões', description: 'Lembre e reproduza padrões' },
        'word-association': { title: 'Associação de Palavras', description: 'Encontre palavras na mesma categoria' },
        'number-recall': { title: 'Memorizar Números', description: 'Lembre de sequências de números' },
        'sequence-memory': { title: 'Memória de Sequência', description: 'Observe e repita a sequência' },
        'word-recall': { title: 'Memorizar Palavras', description: 'Lembre e digite as palavras' },
        'card-flip': { title: 'Virar Cartas', description: 'Combine os pares de cartas' },
        'location-memory': { title: 'Memória de Localização', description: 'Lembre das posições dos itens' },
        'sequence-completion': { title: 'Completar Sequência', description: 'Complete a sequência do padrão' },
        'pattern-recognition': { title: 'Reconhecimento de Padrões', description: 'Identifique o padrão correto' },
        'symbol-matching': { title: 'Correspondência de Símbolos', description: 'Combine símbolos idênticos' },
        'pattern-memory': { title: 'Memória de Padrões', description: 'Lembre e recrie padrões' },
        'maze-navigation': { title: 'Navegação de Labirinto', description: 'Encontre o caminho pelo labirinto' },
        'jigsaw-puzzle': { title: 'Quebra-Cabeça', description: 'Organize as peças' },
        'number-sequence': { title: 'Sequência Numérica', description: 'Encontre o próximo número' },
        'word-puzzle': { title: 'Quebra-Cabeça de Palavras', description: 'Resolva o quebra-cabeça' },
        'logic-grid': { title: 'Grade Lógica', description: 'Resolva o quebra-cabeça lógico' },
        'math-quiz': { title: 'Quiz de Matemática', description: 'Resolva problemas matemáticos' },
        'math-operations': { title: 'Operações Matemáticas', description: 'Resolva problemas matemáticos' },
        'sudoku': { title: 'Sudoku', description: 'Preencha a grade corretamente' },
        'logic-problem': { title: 'Problema Lógico', description: 'Resolva problemas de raciocínio lógico' },
        'logic-puzzle': { title: 'Quebra-Cabeça Lógico', description: 'Organize as caixas usando dicas' },
        'quick-tap': { title: 'Toque Rápido', description: 'Toque o mais rápido possível' },
        'reaction-time': { title: 'Tempo de Reação', description: 'Teste sua velocidade de reação' },
        'color-match': { title: 'Correspondência de Cores', description: 'Combine a cor ou a palavra' },
        'symbol-reaction': { title: 'Reação a Símbolos', description: 'Reaja rapidamente aos símbolos' },
        'timing-game': { title: 'Jogo de Tempo', description: 'Clique quando a cor mudar' },
        'target-detection': { title: 'Detecção de Alvos', description: 'Encontre alvos rapidamente' },
        'quick-reaction': { title: 'Reação Rápida', description: 'Teste sua velocidade de reação' },
        'rotation-puzzle': { title: 'Quebra-Cabeça de Rotação', description: 'Combine a forma rotacionada' },
        'spatial-memory': { title: 'Memória Espacial', description: 'Lembre do arranjo espacial' },
        'mental-rotation': { title: 'Rotação Mental', description: 'Gire a forma mentalmente' },
        'block-puzzle': { title: 'Quebra-Cabeça de Blocos', description: 'Organize os blocos corretamente' },
        'rotated-shapes': { title: 'Formas Rotacionadas', description: 'Combine formas rotacionadas' },
        'distance-judgment': { title: 'Julgamento de Distância', description: 'Estime distâncias' },
        'pattern-in-3d': { title: 'Padrão em 3D', description: 'Combine padrões 3D' },
        'mental-rotation-advanced': { title: 'Rotação Mental Avançada', description: 'Rotação de formas complexas' },
        'shape-reconstruction': { title: 'Reconstrução de Formas', description: 'Reconstrua formas a partir de partes' },
        'perspective-matching': { title: 'Correspondência de Perspectiva', description: 'Combine perspectivas de objetos' },
        'cube-navigation': { title: 'Navegação de Cubo', description: 'Navegue pelo cubo 3D' },
        'find-difference': { title: 'Encontre a Diferença', description: 'Encontre as diferenças' },
        'attention-test': { title: 'Teste de Atenção', description: 'Teste seu tempo de atenção' },
        'focused-search': { title: 'Busca Focada', description: 'Encontre o item alvo' },
        'spotlight': { title: 'Holofote', description: 'Encontre objetos ocultos com visibilidade limitada' },
        'selective-search': { title: 'Busca Seletiva', description: 'Encontre alvos entre distratores' },
        'concentration-grid': { title: 'Grade de Concentração', description: 'Encontre números em sequência rapidamente' },
        'focus-tracker': { title: 'Rastreador de Foco', description: 'Rastreie um objeto entre muitos em movimento' },
        'word-chain': { title: 'Cadeia de Palavras', description: 'Conecte palavras com associações' },
        'spelling': { title: 'Ortografia', description: 'Escreva as palavras corretamente' },
        'antonyms': { title: 'Antônimos', description: 'Encontre a palavra oposta' },
        'synonyms': { title: 'Sinônimos', description: 'Encontre uma palavra semelhante' },
        'word-scramble': { title: 'Palavras Misturadas', description: 'Crie palavras corretas de letras misturadas' },
        'anagrams': { title: 'Anagramas', description: 'Crie palavras diferentes das mesmas letras' },
        'synonym-matcher': { title: 'Correspondência de Sinônimos', description: 'Combine palavras com o mesmo significado' },
        'idiom-riddle': { title: 'Adivinhação de expressões', description: 'Adivinhe significados de expressões e provérbios' },
      },
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

      games: {
        'pattern-matching': { title: 'Соответствие шаблонов', description: 'Запомните и воспроизведите шаблоны' },
        'word-association': { title: 'Ассоциация слов', description: 'Найдите слова в той же категории' },
        'number-recall': { title: 'Запоминание чисел', description: 'Запоминайте последовательности чисел' },
        'sequence-memory': { title: 'Память последовательности', description: 'Смотрите и повторяйте последовательность' },
        'word-recall': { title: 'Запоминание слов', description: 'Запомните и введите слова' },
        'card-flip': { title: 'Переворачивание карт', description: 'Найдите пары карт' },
        'location-memory': { title: 'Память местоположения', description: 'Запоминайте позиции предметов' },
        'sequence-completion': { title: 'Завершение последовательности', description: 'Завершите последовательность шаблона' },
        'pattern-recognition': { title: 'Распознавание шаблонов', description: 'Определите правильный шаблон' },
        'symbol-matching': { title: 'Соответствие символов', description: 'Совместите идентичные символы' },
        'pattern-memory': { title: 'Память шаблонов', description: 'Запомните и воссоздайте шаблоны' },
        'maze-navigation': { title: 'Навигация по лабиринту', description: 'Найдите путь через лабиринт' },
        'jigsaw-puzzle': { title: 'Пазл', description: 'Разложите кусочки' },
        'number-sequence': { title: 'Числовая последовательность', description: 'Найдите следующее число' },
        'word-puzzle': { title: 'Словесный пазл', description: 'Решите пазл' },
        'logic-grid': { title: 'Логическая сетка', description: 'Решите логическую головоломку' },
        'math-quiz': { title: 'Математический квиз', description: 'Решайте математические задачи' },
        'math-operations': { title: 'Математические операции', description: 'Решайте математические задачи' },
        'sudoku': { title: 'Судоку', description: 'Правильно заполните сетку' },
        'logic-problem': { title: 'Логическая задача', description: 'Решайте задачи логического мышления' },
        'logic-puzzle': { title: 'Логический пазл', description: 'Разложите коробки используя подсказки' },
        'quick-tap': { title: 'Быстрое нажатие', description: 'Нажимайте как можно быстрее' },
        'reaction-time': { title: 'Время реакции', description: 'Проверьте скорость реакции' },
        'color-match': { title: 'Соответствие цветов', description: 'Совместите цвет или слово' },
        'symbol-reaction': { title: 'Реакция на символы', description: 'Быстро реагируйте на символы' },
        'timing-game': { title: 'Игра на время', description: 'Нажмите когда цвет изменится' },
        'target-detection': { title: 'Обнаружение целей', description: 'Быстро находите цели' },
        'quick-reaction': { title: 'Быстрая реакция', description: 'Проверьте скорость реакции' },
        'rotation-puzzle': { title: 'Пазл вращения', description: 'Совместите вращающуюся форму' },
        'spatial-memory': { title: 'Пространственная память', description: 'Запоминайте пространственное расположение' },
        'mental-rotation': { title: 'Ментальное вращение', description: 'Вращайте форму мысленно' },
        'block-puzzle': { title: 'Пазл блоков', description: 'Правильно разместите блоки' },
        'rotated-shapes': { title: 'Вращающиеся формы', description: 'Совместите вращающиеся формы' },
        'distance-judgment': { title: 'Оценка расстояния', description: 'Оцените расстояния' },
        'pattern-in-3d': { title: 'Шаблон в 3D', description: 'Совместите 3D шаблоны' },
        'mental-rotation-advanced': { title: 'Продвинутое ментальное вращение', description: 'Вращение сложных форм' },
        'shape-reconstruction': { title: 'Реконструкция форм', description: 'Восстановите формы из частей' },
        'perspective-matching': { title: 'Совпадение перспектив', description: 'Совместите перспективы объектов' },
        'cube-navigation': { title: 'Навигация по кубу', description: 'Навигируйте через 3D куб' },
        'find-difference': { title: 'Найди отличия', description: 'Найдите отличия' },
        'attention-test': { title: 'Тест внимания', description: 'Проверьте время внимания' },
        'focused-search': { title: 'Фокусированный поиск', description: 'Найдите целевой предмет' },
        'spotlight': { title: 'Прожектор', description: 'Находите скрытые объекты с ограниченной видимостью' },
        'selective-search': { title: 'Выборочный поиск', description: 'Найдите цели среди отвлекающих факторов' },
        'concentration-grid': { title: 'Сетка концентрации', description: 'Быстро находите числа в последовательности' },
        'focus-tracker': { title: 'Трекер фокуса', description: 'Отслеживайте один объект среди многих движущихся' },
        'word-chain': { title: 'Цепочка слов', description: 'Соединяйте слова ассоциациями' },
        'spelling': { title: 'Орфография', description: 'Правильно пишите слова' },
        'antonyms': { title: 'Антонимы', description: 'Найдите противоположное слово' },
        'synonyms': { title: 'Синонимы', description: 'Найдите похожее слово' },
        'word-scramble': { title: 'Слова вперемешку', description: 'Создавайте правильные слова из перемешанных букв' },
        'anagrams': { title: 'Анаграммы', description: 'Создавайте разные слова из одинаковых букв' },
        'synonym-matcher': { title: 'Совпадение синонимов', description: 'Совмещайте слова с тем же значением' },
        'idiom-riddle': { title: 'Загадка идиом', description: 'Угадайте значения идиом и пословиц' },
      },
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

      games: {
        'pattern-matching': { title: 'مطابقة الأنماط', description: 'تذكر وأعد إنتاج الأنماط' },
        'word-association': { title: 'ارتباط الكلمات', description: 'ابحث عن كلمات في نفس الفئة' },
        'number-recall': { title: 'تذكر الأرقام', description: 'تذكر تسلسلات الأرقام' },
        'sequence-memory': { title: 'تذكر التسلسل', description: 'شاهِد وأعد التسلسل' },
        'word-recall': { title: 'تذكر الكلمات', description: 'تذكر واكتب الكلمات' },
        'card-flip': { title: 'قلب البطاقات', description: 'طابق أزواج البطاقات' },
        'location-memory': { title: 'تذكر الموقع', description: 'تذكر مواقع العناصر' },
        'sequence-completion': { title: 'إكمال التسلسل', description: 'أكمل تسلسل النمط' },
        'pattern-recognition': { title: 'التعرف على الأنماط', description: 'حدد النمط الصحيح' },
        'symbol-matching': { title: 'مطابقة الرموز', description: 'طابق الرموز المتطابقة' },
        'pattern-memory': { title: 'تذكر الأنماط', description: 'تذكر وأعد إنشاء الأنماط' },
        'maze-navigation': { title: 'التنقل في المتاهة', description: 'اعثر على طريقك عبر المتاهة' },
        'jigsaw-puzzle': { title: 'لغز الصورة', description: 'رتّب القطع' },
        'number-sequence': { title: 'تسلسل الأرقام', description: 'ابحث عن الرقم التالي' },
        'word-puzzle': { title: 'لغز الكلمات', description: 'حل اللغز' },
        'logic-grid': { title: 'شبكة المنطق', description: 'حل لغز المنطق' },
        'math-quiz': { title: 'اختبار الرياضيات', description: 'حل المشاكل الرياضية' },
        'math-operations': { title: 'العمليات الحسابية', description: 'حل المشاكل الرياضية' },
        'sudoku': { title: 'سودوكو', description: 'املأ الشبكة بشكل صحيح' },
        'logic-problem': { title: 'مشكلة منطقية', description: 'حل مشاكل التفكير المنطقي' },
        'logic-puzzle': { title: 'لغز منطقي', description: 'رتّب الصناديق باستخدام الأدلة' },
        'quick-tap': { title: 'النقر السريع', description: 'انقر بأسرع ما يمكن' },
        'reaction-time': { title: 'وقت الاستجابة', description: 'اختبر سرعة استجابتك' },
        'color-match': { title: 'مطابقة الألوان', description: 'طابق اللون أو الكلمة' },
        'symbol-reaction': { title: 'الاستجابة للرموز', description: 'استجب بسرعة للرموز' },
        'timing-game': { title: 'لعبة التوقيت', description: 'انقر عندما يتغير اللون' },
        'target-detection': { title: 'كشف الأهداف', description: 'اعثر على الأهداف بسرعة' },
        'quick-reaction': { title: 'الاستجابة السريعة', description: 'اختبر سرعة استجابتك' },
        'rotation-puzzle': { title: 'لغز الدوران', description: 'طابق الشكل المدور' },
        'spatial-memory': { title: 'الذاكرة المكانية', description: 'تذكر الترتيب المكاني' },
        'mental-rotation': { title: 'الدوران الذهني', description: 'دوّر الشكل ذهنيًا' },
        'block-puzzle': { title: 'لغز الكتل', description: 'رتّب الكتل بشكل صحيح' },
        'rotated-shapes': { title: 'الأشكال المدورة', description: 'طابق الأشكال المدورة' },
        'distance-judgment': { title: 'تقدير المسافة', description: 'قدّر المسافات' },
        'pattern-in-3d': { title: 'نمط ثلاثي الأبعاد', description: 'طابق الأنماط ثلاثية الأبعاد' },
        'mental-rotation-advanced': { title: 'الدوران الذهني المتقدم', description: 'دوران الأشكال المعقدة' },
        'shape-reconstruction': { title: 'إعادة بناء الشكل', description: 'أعد بناء الأشكال من الأجزاء' },
        'perspective-matching': { title: 'مطابقة المنظور', description: 'طابق منظور الكائنات' },
        'cube-navigation': { title: 'التنقل في المكعب', description: 'تنقل عبر المكعب ثلاثي الأبعاد' },
        'find-difference': { title: 'ابحث عن الفرق', description: 'اعثر على الاختلافات' },
        'attention-test': { title: 'اختبار الانتباه', description: 'اختبر مدى انتباهك' },
        'focused-search': { title: 'البحث المركز', description: 'اعثر على العنصر الهدف' },
        'spotlight': { title: 'الإضاءة', description: 'اعثر على كائنات مخفية مع رؤية محدودة' },
        'selective-search': { title: 'البحث الانتقائي', description: 'اعثر على الأهداف بين المشتتات' },
        'concentration-grid': { title: 'شبكة التركيز', description: 'اعثر على الأرقام في التسلسل بسرعة' },
        'focus-tracker': { title: 'متعقب التركيز', description: 'تتبع كائنًا واحدًا بين العديد من الكائنات المتحركة' },
        'word-chain': { title: 'سلسلة الكلمات', description: 'اربط الكلمات بالارتباطات' },
        'spelling': { title: 'الإملاء', description: 'تهجى الكلمات بشكل صحيح' },
        'antonyms': { title: 'المترادفات المضادة', description: 'ابحث عن الكلمة المقابلة' },
        'synonyms': { title: 'المترادفات', description: 'ابحث عن كلمة مشابهة' },
        'word-scramble': { title: 'كلمات مبعثرة', description: 'أنشئ كلمات صحيحة من حروف مبعثرة' },
        'anagrams': { title: 'الجناس', description: 'أنشئ كلمات مختلفة من نفس الحروف' },
        'synonym-matcher': { title: 'مطابق المترادفات', description: 'طابق الكلمات بنفس المعنى' },
        'idiom-riddle': { title: 'لغز الأمثال', description: 'خمّن معاني الأمثال والأقوال المأثورة' },
      },
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

// Note: Added achievement, yesterday, challengeType translations to all languages
