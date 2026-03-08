# SilverMind - Architecture

## 🏗️ System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser                        │
│  (Next.js 15 + React 19 + Tailwind CSS)              │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Edge                          │
│  (CDN + Static Asset Hosting + Serverless Functions)    │
└────────────────────┬────────────────────────────────────┘
                     │
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│   Supabase      │    │   Vercel        │
│   (Backend)     │    │   Analytics     │
└──────────────────┘    └──────────────────┘
```

---

## 📦 Technology Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 15.x | React framework with App Router |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Styling |
| Framer Motion | 11.x | Animations |
| Zustand | 4.x | State management |
| react-i18next | 14.x | Internationalization |

### Backend & Database

| Technology | Version | Purpose |
|-----------|---------|---------|
| Supabase | Latest | Database (PostgreSQL) |
| Supabase Auth | Latest | User authentication |
| Supabase Realtime | Latest | Real-time features (future) |

### Deployment & Infrastructure

| Technology | Purpose |
|-----------|---------|
| Vercel | Hosting & CDN |
| GitHub | Version control |
| Vercel Analytics | Usage analytics |

---

## 📂 Project Structure

```
silvermind/
├── app/                        # Next.js App Router
│   ├── (main)/                # Main route group
│   │   ├── page.tsx           # Home page
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   └── not-found.tsx     # 404 page
│   ├── memory/                # Memory games
│   │   ├── page.tsx           # Category page
│   │   ├── number-recall/
│   │   ├── sequence-memory/
│   │   ├── word-recall/
│   │   ├── card-flip/
│   │   ├── pattern-matching/
│   │   └── location-memory/
│   ├── logic/                 # Logic games
│   │   ├── page.tsx           # Category page
│   │   ├── logic-puzzle/
│   │   └── sudoku/
│   ├── pattern/               # Pattern games
│   │   ├── page.tsx           # Category page
│   │   ├── pattern-recognition/
│   │   ├── sequence-completion/
│   │   ├── maze-navigation/
│   │   └── jigsaw-puzzle/
│   ├── reaction/              # Reaction games
│   │   ├── page.tsx           # Category page
│   │   ├── color-match/
│   │   ├── timing-game/
│   │   ├── target-detection/
│   │   └── quick-reaction/
│   ├── spatial/               # Spatial games
│   │   ├── page.tsx           # Category page
│   │   ├── rotated-shapes/
│   │   └── distance-judgment/
│   ├── dashboard/             # User dashboard
│   │   └── page.tsx
│   ├── stats/                 # Statistics page
│   │   └── page.tsx
│   └── settings/             # Settings page
│       └── page.tsx
├── lib/
│   ├── store.ts              # Zustand store
│   ├── db.ts                # Database utilities
│   ├── utils.ts             # Helper functions
│   └── types.ts             # TypeScript types
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── progress-bar.tsx
│   │   └── ...
│   ├── game/                # Game-specific components
│   │   ├── game-header.tsx
│   │   ├── game-stats.tsx
│   │   ├── game-grid.tsx
│   │   └── ...
│   └── layout/              # Layout components
│       ├── header.tsx
│       ├── footer.tsx
│       └── navigation.tsx
├── hooks/
│   ├── use-game-state.ts    # Game state hooks
│   ├── use-score.ts        # Score calculation hooks
│   └── use-timer.ts       # Timer hooks
├── public/                 # Static assets
│   ├── icons/             # Game icons
│   ├── images/            # Images
│   └── fonts/            # Custom fonts
├── prisma/
│   └── schema.prisma      # Database schema
├── docs/                  # Documentation
│   ├── PROJECT_PLAN.md
│   ├── GAME_DESIGN.md
│   ├── USER_GUIDE.md
│   ├── ARCHITECTURE.md    # This file
│   ├── DEVELOPMENT.md
│   └── API.md
├── .env.local             # Environment variables
├── next.config.ts         # Next.js config
├── tsconfig.json          # TypeScript config
├── tailwind.config.ts     # Tailwind config
└── package.json          # Dependencies
```

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  preferences JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}'
);
```

### GameSessions Table
```sql
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  difficulty TEXT,
  score INTEGER NOT NULL,
  duration_seconds INTEGER,
  level INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);
```

### Scores Table
```sql
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  level INTEGER,
  score INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Achievements Table
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔧 Component Architecture

### Game Component Structure

```
GamePage (Parent)
├── GameHeader
│   ├── Title
│   ├── Description
│   └── Back Button
├── GameMenu (Initial State)
│   ├── Level Info
│   ├── Settings Preview
│   └── Start Button
├── GameStats (Playing State)
│   ├── Level Progress
│   ├── Score Display
│   └── Timer
├── GameArea (Main Game)
│   ├── Question Display
│   ├── Input Area
│   └── Options/Controls
├── LevelComplete (Success State)
│   ├── Score Summary
│   ├── Performance Rating
│   └── Next Level Button
└── GameOver (Fail State)
    ├── Final Score
    ├── Retry Options
    └── Restart Button
```

---

## 🔄 State Management

### Zustand Store Structure

```typescript
interface GameState {
  // User Data
  user: User | null
  setUser: (user: User | null) => void

  // Current Game
  currentDifficulty: 'easy' | 'medium' | 'hard'
  setDifficulty: (diff: 'easy' | 'medium' | 'hard') => void

  // Game Sessions
  addSession: (session: GameSession) => void
  getSessions: (gameId: string) => GameSession[]
  getBestScore: (gameId: string) => number

  // Scores
  getScores: (gameId: string) => Score[]
  addScore: (score: Score) => void

  // Achievements
  achievements: Achievement[]
  addAchievement: (achievement: Achievement) => void
}
```

---

## 🎨 UI Architecture

### Design System

#### Colors
```typescript
const colors = {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    900: '#1e3a8a',
  },
  secondary: {
    50: '#faf5ff',
    500: '#a855f7',
    900: '#581c87',
  },
  success: '#22c55e',
  warning: '#f97316',
  error: '#ef4444',
}
```

#### Typography
```typescript
const typography = {
  heading: 'text-4xl font-bold',
  subheading: 'text-2xl font-semibold',
  body: 'text-lg font-medium',
  caption: 'text-sm font-normal',
}
```

#### Spacing
```typescript
const spacing = {
  xs: 'p-2',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12',
}
```

---

## 🚀 Performance Optimization

### Code Splitting
- Route-based splitting with Next.js App Router
- Lazy loading of game components
- Dynamic imports for heavy libraries

### Image Optimization
- Next.js Image component for all images
- WebP format support
- Responsive images with srcset

### Bundle Optimization
- Tree shaking for unused code
- Minification with Terser
- Gzip compression on Vercel

### Caching Strategy
- Static pages: Cached on CDN
- API responses: Cache-Control headers
- Game data: LocalStorage for offline play

---

## 🔒 Security Architecture

### Authentication
- JWT-based authentication via Supabase Auth
- Secure cookie storage
- Token refresh mechanism

### Data Protection
- HTTPS only
- Input validation and sanitization
- SQL injection prevention via Prisma
- XSS prevention with React's built-in protection

### API Security
- Rate limiting
- CORS configuration
- Request validation
- Error handling without sensitive data exposure

---

## 📱 Responsive Design

### Breakpoints
```typescript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
}
```

### Adaptive Layouts
- Mobile: 1-2 columns, larger touch targets
- Tablet: 2-3 columns, balanced spacing
- Desktop: 3-4 columns, optimal readability

---

## 🧪 Testing Strategy

### Unit Tests
- Game logic functions
- Score calculations
- Utility functions

### Integration Tests
- Game flow testing
- State management
- API interactions

### E2E Tests
- Playwright for critical user flows
- Cross-browser testing
- Mobile device testing

---

## 📊 Monitoring & Analytics

### Metrics Tracked
- Page views and unique visitors
- Game completion rates
- Average time per level
- Error rates and performance

### Tools
- Vercel Analytics (built-in)
- Custom event tracking
- Error monitoring (planned)

---

## 🔄 Deployment Pipeline

```
git push (main branch)
    ↓
Vercel: Build
    ↓
Vercel: Test
    ↓
Vercel: Deploy (Production)
    ↓
CDN Update (Edge Network)
```

---

## 📝 Future Enhancements

### Planned Features
- [ ] User authentication
- [ ] Leaderboards
- [ ] Achievements system
- [ ] Daily challenges
- [ ] Social features
- [ ] AI-powered difficulty adjustment
- [ ] Offline PWA support

### Technical Improvements
- [ ] Service Worker for offline support
- [ ] Web Workers for intensive calculations
- [ ] IndexedDB for local storage
- [ ] Web Speech API for voice input

---

**Last Updated**: 2026-03-08
**Version**: 1.0.0
