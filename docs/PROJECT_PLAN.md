# SilverMind - Project Plan

## 📋 Project Overview

**SilverMind** is a brain training web application designed to help users improve various cognitive abilities through engaging games.

### Core Value
"Train your brain, improve your mind"

### Target Audience
- Adults looking to maintain cognitive health
- Students wanting to improve memory and focus
- Seniors wanting to keep their minds sharp
- Anyone interested in brain training

---

## 🎯 Project Goals

### Primary Goals
1. Provide 20+ brain training games across 5 categories
2. Implement a progression system for long-term engagement
3. Track user performance and progress
4. Provide multilingual support (Korean, English)
5. Deploy as a responsive PWA (Progressive Web App)

### Secondary Goals
- Add social features (leaderboards, achievements)
- Implement daily challenges
- Create personalized training programs
- Add AI-powered difficulty adjustment

---

## 📂 Project Structure

```
silvermind/
├── app/
│   ├── memory/          # Memory games (6 games)
│   ├── logic/           # Logic games (4 games)
│   ├── pattern/         # Pattern games (4 games)
│   ├── reaction/        # Reaction games (4 games)
│   ├── spatial/         # Spatial games (2 games)
│   ├── dashboard/       # User dashboard
│   └── stats/           # Performance statistics
├── lib/
│   ├── store.ts         # Zustand state management
│   ├── db.ts            # Database utilities
│   └── utils.ts         # Helper functions
├── components/
│   ├── ui/              # Reusable UI components
│   └── game/            # Game-specific components
├── docs/
│   ├── PROJECT_PLAN.md          # This file
│   ├── GAME_DESIGN.md           # Game design document
│   ├── USER_GUIDE.md            # User guide
│   ├── ARCHITECTURE.md          # Technical architecture
│   ├── DEVELOPMENT.md           # Development guide
│   └── API.md                   # API documentation
└── public/
    └── icons/          # Game icons and assets
```

---

## 🎮 Game Categories

### 1. Memory (6 games)
Focus on short-term memory, working memory, and recall.

| Game | Description | Levels |
|------|-------------|--------|
| Number Recall | Remember and repeat number sequences | 10 |
| Sequence Memory | Watch and repeat cell sequences | 10 |
| Word Recall | Remember and type words | 10 |
| Card Flip | Classic memory card matching | 5 |
| Pattern Matching | Remember and reproduce patterns | - |
| Location Memory | Remember item positions | - |

### 2. Logic (4 games)
Focus on logical reasoning and problem-solving.

| Game | Description | Levels |
|------|-------------|--------|
| Logic Puzzle | Arrange boxes using clues | 10 |
| Sudoku | Classic number puzzle | 3 |

### 3. Pattern (4 games)
Focus on pattern recognition and completion.

| Game | Description | Levels |
|------|-------------|--------|
| Pattern Recognition | Identify what comes next | 10 |
| Sequence Completion | Complete the pattern | - |
| Maze Navigation | Find your way through the maze | - |
| Jigsaw Puzzle | Arrange the pieces | - |

### 4. Reaction (4 games)
Focus on reflexes and speed.

| Game | Description | Levels |
|------|-------------|--------|
| Color Match | Match color or word (Stroop test) | 10 |
| Timing Game | Click when the color changes | 10 |
| Target Detection | Find the targets quickly | - |
| Quick Reaction | Test reaction speed | 10 |

### 5. Spatial (2 games)
Focus on spatial awareness and visualization.

| Game | Description | Levels |
|------|-------------|--------|
| Rotated Shapes | Identify rotated shapes | - |
| Distance Judgment | Estimate distances | - |

---

## 🚀 Roadmap

### Phase 1: Core Development (Q1 2026)
- ✅ Project setup with Next.js 15, React 19, TypeScript
- ✅ Implement 20 basic games
- ✅ Add state management with Zustand
- ✅ Implement multilingual support
- ✅ Deploy to Vercel

### Phase 2: Progression & Features (Q2 2026)
- ✅ Add level progression system (10 levels per game)
- ✅ Add game difficulty scaling
- ✅ Implement user statistics tracking
- ✅ Add performance analytics
- ✅ Optimize for mobile devices

### Phase 3: Social & Gamification (Q3 2026)
- ⏳ User authentication (Supabase Auth)
- ⏳ Leaderboards and rankings
- ⏳ Achievements and badges
- ⏳ Daily challenges
- ⏳ Streak system

### Phase 4: AI & Personalization (Q4 2026)
- ⏳ AI-powered difficulty adjustment
- ⏳ Personalized training programs
- ⏳ Performance insights and recommendations
- ⏳ Adaptive learning paths

---

## 📊 Progress Tracking

### Game Progression Status
- ✅ 8 games with 10-level progression
- ✅ 2 games with partial progression (Card Flip: 5 levels, Sudoku: 3 levels)
- ⏳ 10 games need progression system

### Technical Progress
- ✅ Frontend: Next.js 15, React 19, TypeScript
- ✅ State Management: Zustand
- ✅ Styling: Tailwind CSS
- ✅ Animations: Framer Motion
- ✅ Internationalization: i18next
- ✅ Deployment: Vercel (silvermind.vercel.app)
- ⏳ Backend: Supabase (Database, Auth, Realtime)
- ⏳ Analytics: Custom implementation

---

## 🔧 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State**: Zustand
- **i18n**: react-i18next

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **API**: Supabase REST API
- **Realtime**: Supabase Realtime (for future features)

### Deployment
- **Hosting**: Vercel
- **Domain**: silvermind.vercel.app
- **CI/CD**: Git push to main branch

---

## 📝 Next Steps

1. Complete progression system for remaining 10 games
2. Implement user authentication with Supabase
3. Add user statistics dashboard
4. Create leaderboards
5. Add achievements and badges
6. Implement daily challenges
7. Add AI-powered difficulty adjustment

---

## 📞 Contact

For questions or suggestions, please visit:
- GitHub: https://github.com/vamos-s/silvermind
- Live Demo: https://silvermind.vercel.app

---

**Last Updated**: 2026-03-08
**Version**: 1.0.0
