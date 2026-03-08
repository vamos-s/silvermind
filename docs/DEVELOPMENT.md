# SilverMind - Development Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Git
- Supabase account (for backend features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/vamos-s/silvermind.git
cd silvermind
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

4. **Configure Supabase (optional)**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. **Run development server**
```bash
npm run dev
# or
yarn dev
```

6. **Open browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure Deep Dive

### App Router Structure

```
app/
├── (main)/              # Route group (no effect on URL)
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page (/)
│   └── globals.css      # Global styles
├── memory/              # Memory category (/memory)
│   ├── page.tsx         # Category overview
│   └── [game]/         # Individual games (/memory/number-recall)
└── ...
```

### Key Files

| File | Purpose |
|------|---------|
| `lib/store.ts` | Zustand state management |
| `lib/db.ts` | Database utilities |
| `lib/utils.ts` | Helper functions |
| `lib/types.ts` | TypeScript type definitions |
| `next.config.ts` | Next.js configuration |
| `tailwind.config.ts` | Tailwind CSS configuration |
| `tsconfig.json` | TypeScript configuration |

---

## 🎮 Creating a New Game

### Step 1: Create Game Directory

```bash
mkdir -p app/[category]/[game-name]
```

### Step 2: Create Game Page

Create `app/[category]/[game-name]/page.tsx`:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

export default function GamePage() {
  const { t } = useTranslation()
  const { addSession } = useGameStore()

  // Game state
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'complete'>('menu')
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)

  // Game logic
  const startGame = () => {
    setScore(0)
    setLevel(1)
    setGameState('playing')
  }

  const handleGameAction = () => {
    // Game-specific logic
    setScore(prev => prev + 10)
  }

  const completeGame = () => {
    addSession({
      id: Date.now().toString(),
      gameId: 'game-name',
      difficulty: 'medium',
      score,
      completedAt: new Date(),
      durationSeconds: 60
    })
    setGameState('complete')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link href="/[category]" className="text-gray-700 hover:text-gray-900 font-medium mb-6 block">
          ← {t('back', 'Back')}
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {t('gameName.title', 'Game Title')}
        </h1>
        <p className="text-lg text-gray-700 font-medium mb-8">
          {t('gameName.description', 'Game description')}
        </p>

        {/* Game UI */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:from-blue-600 hover:to-purple-600 shadow-lg transition-all"
            >
              {t('start', 'Start')}
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <div>
            {/* Game area */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Game content */}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

### Step 3: Add Level Progression

```typescript
const MAX_LEVELS = 10

const LEVEL_SETTINGS = [
  { /* Level 1 settings */ },
  { /* Level 2 settings */ },
  // ... up to 10 levels
]

const settings = LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)]
```

### Step 4: Add to Category Page

Update `app/[category]/page.tsx`:

```typescript
const GAMES = [
  {
    id: 'game-name',
    title: 'Game Title',
    description: 'Game description',
    icon: '🎮',
  },
  // ... other games
]
```

---

## 🎨 UI Components

### Reusable Components

#### Button Component

```typescript
// components/ui/button.tsx
import { motion } from 'framer-motion'

interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

export function Button({ children, onClick, variant = 'primary', size = 'md', disabled }: ButtonProps) {
  const variants = {
    primary: 'from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
    secondary: 'from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700',
    danger: 'from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600',
  }

  const sizes = {
    sm: 'py-2 px-4 text-base',
    md: 'py-4 px-12 text-xl',
    lg: 'py-6 px-16 text-2xl',
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`bg-gradient-to-r ${variants[variant]} ${sizes[size]} text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </motion.button>
  )
}
```

#### Progress Bar Component

```typescript
// components/ui/progress-bar.tsx
import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number
  max: number
  color?: string
}

export function ProgressBar({ value, max, color = 'from-blue-500 to-purple-500' }: ProgressBarProps) {
  const percentage = (value / max) * 100

  return (
    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        className={`bg-gradient-to-r ${color} h-full`}
      />
    </div>
  )
}
```

---

## 🗄️ Database Operations

### Using Prisma

```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Example queries
export async function getUserSessions(userId: string) {
  return await prisma.gameSession.findMany({
    where: { userId },
    orderBy: { completedAt: 'desc' },
  })
}

export async function saveScore(userId: string, gameId: string, score: number) {
  return await prisma.score.create({
    data: {
      userId,
      gameId,
      score,
      completedAt: new Date(),
    },
  })
}
```

---

## 🌍 Internationalization

### Adding Translations

#### Create Translation Keys

```typescript
// locales/en/game.json
{
  "gameName": {
    "title": "Game Title",
    "description": "Game description",
    "start": "Start",
    "score": "Score",
    "level": "Level"
  }
}

// locales/ko/game.json
{
  "gameName": {
    "title": "게임 제목",
    "description": "게임 설명",
    "start": "시작",
    "score": "점수",
    "level": "레벨"
  }
}
```

#### Use in Components

```typescript
import { useTranslation } from 'react-i18next'

export function GameComponent() {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('gameName.title')}</h1>
      <p>{t('gameName.description')}</p>
    </div>
  )
}
```

---

## 🧪 Testing

### Unit Tests

```typescript
// __tests__/game-logic.test.ts
import { calculateScore } from '@/lib/game-logic'

describe('calculateScore', () => {
  it('should calculate correct score for perfect performance', () => {
    const score = calculateScore({ correct: 10, total: 10, time: 30 })
    expect(score).toBe(100)
  })

  it('should apply time bonus', () => {
    const score = calculateScore({ correct: 10, total: 10, time: 15 })
    expect(score).toBeGreaterThan(100)
  })
})
```

### E2E Tests with Playwright

```typescript
// e2e/game.spec.ts
import { test, expect } from '@playwright/test'

test('can complete game level', async ({ page }) => {
  await page.goto('/memory/number-recall')
  await page.click('text=Start')
  // ... game interactions
  await expect(page.locator('text=Level Complete')).toBeVisible()
})
```

---

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Environment Variables

Set these in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🐛 Debugging

### Common Issues

#### Game state not updating
```typescript
// ❌ Wrong
const [state, setState] = useState(0)
state = 1

// ✅ Correct
const [state, setState] = useState(0)
setState(1)
```

#### Animation not working
```typescript
// Ensure motion components are used
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  Content
</motion.div>
```

#### Translation not loading
```typescript
// Check i18n configuration
i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: { translation: enTranslations },
    ko: { translation: koTranslations },
  },
})
```

---

## 📚 Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Zustand](https://docs.pmnd.rs/zustand)

### Community
- [Next.js Discord](https://discord.com/invite/nextjs)
- [React Discord](https://discord.com/invite/reactiflux)
- [Supabase Discord](https://discord.com/invite/supabase)

---

## 🤝 Contributing

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

### Commit Message Format
```
type(scope): subject

type: feat, fix, docs, style, refactor, test, chore
scope: game name or component
subject: brief description

Example:
feat(memory): add level progression to number recall
```

---

## 📝 Checklist

Before creating a pull request:

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Translations are added for new text
- [ ] Game works on mobile devices
- [ ] Game works in both English and Korean
- [ ] No console errors or warnings

---

**Last Updated**: 2026-03-08
**Version**: 1.0.0
