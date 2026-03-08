# SilverMind - Game Design Document

## 🎮 Game Design Philosophy

### Core Principles
1. **Progressive Difficulty**: Each game should start easy and gradually increase in difficulty
2. **Clear Feedback**: Users should always know how they performed
3. **Motivation**: Progress bars, scores, and achievements encourage continued play
4. **Accessibility**: Games should be playable on both desktop and mobile devices

### Level System Design

#### General Rules
- Each game should have 10 levels (where applicable)
- Levels should be incrementally harder
- Each level should be completable in 2-5 minutes
- Score should reflect performance across all levels

#### Progression Patterns

**Pattern 1: Quantity Increase**
```typescript
Level 1: 3 items
Level 2: 4 items
Level 3: 5 items
...
Level 10: 12 items
```

**Pattern 2: Time Reduction**
```typescript
Level 1: 60 seconds
Level 2: 55 seconds
Level 3: 50 seconds
...
Level 10: 15 seconds
```

**Pattern 3: Complexity Increase**
```typescript
Level 1: 3×3 grid, 3 items
Level 2: 4×4 grid, 4 items
Level 3: 5×5 grid, 5 items
...
Level 10: 8×8 grid, 8 items
```

---

## 📊 Scoring System

### Score Calculation

#### Base Score Formula
```typescript
levelScore = baseScore × difficultyMultiplier
totalScore = Σ(levelScore × timeBonus)
```

#### Time Bonus
```typescript
timeBonus = remainingTime / totalTime
finalScore = levelScore × (1 + timeBonus × 0.5)
```

#### Accuracy Bonus
```typescript
accuracyBonus = correctAnswers / totalAnswers
finalScore = levelScore × (0.5 + accuracyBonus × 0.5)
```

### Score Tiers
- **Perfect**: 100% of max score + bonus
- **Excellent**: 90-99% of max score
- **Good**: 75-89% of max score
- **Average**: 50-74% of max score
- **Poor**: < 50% of max score

---

## 🎯 Game-Specific Designs

### Memory Games

#### 1. Number Recall
**Concept**: Users see a sequence of numbers and must recall them in order.

**Progression**:
| Level | Sequence Length | Display Time |
|-------|----------------|--------------|
| 1 | 3 | 3000ms |
| 2 | 4 | 2500ms |
| 3 | 5 | 2000ms |
| 4 | 6 | 1800ms |
| 5 | 7 | 1600ms |
| 6 | 8 | 1400ms |
| 7 | 9 | 1200ms |
| 8 | 10 | 1100ms |
| 9 | 11 | 1000ms |
| 10 | 12 | 800ms |

**Scoring**:
- Each correct digit: 10 points
- Speed bonus: Based on input speed
- Level complete: Show sequence + score

**Status**: ✅ Implemented (10 levels)

---

#### 2. Sequence Memory
**Concept**: Users watch a pattern of cells light up and must repeat it.

**Progression**:
| Level | Grid Size | Sequence Length | Display Speed |
|-------|-----------|-----------------|---------------|
| 1 | 3×3 | 3 | 800ms |
| 2 | 3×3 | 4 | 770ms |
| 3 | 4×4 | 4 | 740ms |
| 4 | 4×4 | 5 | 710ms |
| 5 | 5×5 | 5 | 680ms |
| 6 | 5×5 | 6 | 650ms |
| 7 | 6×6 | 6 | 620ms |
| 8 | 6×6 | 7 | 590ms |
| 9 | 6×6 | 8 | 560ms |
| 10 | 6×6 | 9 | 530ms |

**Scoring**:
- Complete sequence: 50 points per level
- No speed penalty (accuracy focused)

**Status**: ✅ Implemented (10 levels)

---

#### 3. Word Recall
**Concept**: Users see a list of words and must recall them.

**Progression**:
| Level | Word Count | Difficulty | Display Time | Input Time |
|-------|-----------|------------|--------------|------------|
| 1 | 3 | Easy | 2.5s | 30s |
| 2 | 4 | Easy | 2.3s | 35s |
| 3 | 5 | Easy | 2.0s | 40s |
| 4 | 5 | Medium | 1.8s | 45s |
| 5 | 6 | Medium | 1.6s | 45s |
| 6 | 7 | Medium | 1.5s | 50s |
| 7 | 7 | Hard | 1.3s | 55s |
| 8 | 8 | Hard | 1.2s | 60s |
| 9 | 9 | Hard | 1.1s | 65s |
| 10 | 10 | Hard | 1.0s | 70s |

**Scoring**:
- Each correct word: 50 points
- Time bonus: 2 points per second remaining
- Level complete: Show score

**Status**: ✅ Implemented (10 levels)

---

#### 4. Card Flip
**Concept**: Classic memory card matching game.

**Progression**:
| Level | Grid Size | Cards | Time Limit |
|-------|-----------|-------|------------|
| 1 | 4×4 | 16 | 2 min |
| 2 | 4×4 | 16 | 2 min |
| 3 | 4×5 | 20 | 3 min |
| 4 | 5×4 | 20 | 4 min |
| 5 | 6×5 | 30 | 5 min |

**Features**:
- 2-second preview of all cards
- Hint system (shows matching pair)
- No clicking same card twice

**Scoring**:
- Each pair: 10 points
- Each hint used: -5 points
- Time bonus: Based on remaining time

**Status**: ✅ Implemented (5 levels)

---

### Reaction Games

#### 5. Color Match (Stroop Test)
**Concept**: Match either the text or the color, depending on the instruction.

**Progression**:
| Level | Color Count | Time Limit | Target Score |
|-------|-------------|------------|--------------|
| 1 | 4 | 60s | 30 |
| 2 | 4 | 55s | 35 |
| 3 | 5 | 55s | 40 |
| 4 | 5 | 50s | 45 |
| 5 | 6 | 50s | 50 |
| 6 | 6 | 45s | 55 |
| 7 | 7 | 45s | 60 |
| 8 | 7 | 40s | 65 |
| 9 | 8 | 40s | 70 |
| 10 | 8 | 35s | 75 |

**Scoring**:
- Correct answer: +1 point
- Wrong answer: No penalty
- Level complete when target score reached

**Status**: ✅ Implemented (10 levels)

---

#### 6. Quick Reaction
**Concept**: Click when the screen turns green.

**Progression**:
| Level | Rounds | Min Wait | Max Wait | Target Time |
|-------|--------|----------|----------|-------------|
| 1 | 5 | 2000ms | 5000ms | 400ms |
| 2 | 5 | 1900ms | 4800ms | 380ms |
| 3 | 6 | 1800ms | 4600ms | 360ms |
| 4 | 6 | 1700ms | 4400ms | 340ms |
| 5 | 7 | 1600ms | 4200ms | 320ms |
| 6 | 7 | 1500ms | 4000ms | 300ms |
| 7 | 8 | 1400ms | 3800ms | 280ms |
| 8 | 8 | 1300ms | 3600ms | 260ms |
| 9 | 9 | 1200ms | 3400ms | 240ms |
| 10 | 10 | 1000ms | 3000ms | 220ms |

**Scoring**:
- Score = (Target Time / Actual Time) × 100 × Level
- Too early: 2000ms penalty

**Status**: ✅ Implemented (10 levels)

---

#### 7. Timing Game
**Concept**: Click when the color changes from red to green.

**Progression**:
| Level | Rounds | Min Delay | Max Delay | Target Time |
|-------|--------|-----------|-----------|-------------|
| 1 | 5 | 2500ms | 5000ms | 500ms |
| 2 | 5 | 2400ms | 4800ms | 480ms |
| 3 | 6 | 2300ms | 4600ms | 460ms |
| 4 | 6 | 2200ms | 4400ms | 440ms |
| 5 | 7 | 2100ms | 4200ms | 420ms |
| 6 | 7 | 2000ms | 4000ms | 400ms |
| 7 | 8 | 1900ms | 3800ms | 380ms |
| 8 | 8 | 1800ms | 3600ms | 360ms |
| 9 | 9 | 1700ms | 3400ms | 340ms |
| 10 | 10 | 1500ms | 3000ms | 320ms |

**Scoring**:
- Round Score = (Target Time / Reaction Time) × 100
- Too early: 0 points

**Status**: ✅ Implemented (10 levels)

---

### Logic Games

#### 8. Logic Puzzle
**Concept**: Arrange boxes based on logical clues.

**Progression**:
| Level | Box Count | Clue Count | Attempts |
|-------|-----------|------------|----------|
| 1 | 3 | 2 | 5 |
| 2 | 3 | 2 | 5 |
| 3 | 3 | 2 | 5 |
| 4 | 4 | 3 | 5 |
| 5 | 4 | 3 | 5 |
| 6 | 4 | 3 | 5 |
| 7 | 5 | 4 | 5 |
| 8 | 5 | 4 | 5 |
| 9 | 5 | 4 | 5 |
| 10 | 5 | 4 | 5 |

**Scoring**:
- Base: 100 points
- Penalty: -10 points per attempt
- Minimum: 10 points

**Status**: ✅ Implemented (10 levels)

---

#### 9. Sudoku
**Concept**: Classic 9×9 number puzzle.

**Progression**:
| Level | Grid Size | Empty Cells |
|-------|-----------|-------------|
| 1 | 4×4 | 4 |
| 2 | 4×4 | 5 |
| 3 | 6×6 | 12 |
| 4 | 6×6 | 15 |
| 5 | 9×9 | 30 |
| 6 | 9×9 | 40 |
| 7 | 9×9 | 45 |
| 8 | 9×9 | 50 |
| 9 | 9×9 | 55 |
| 10 | 9×9 | 60 |

**Features**:
- 3×3 subgrids for 9×9
- Valid diagonal filling

**Status**: ✅ Implemented (grid scaling)

---

### Pattern Games

#### 10. Pattern Recognition
**Concept**: Identify the pattern and find what comes next.

**Progression**:
| Level | Pattern Length | Questions | Time per Question | Shapes | Colors |
|-------|---------------|-----------|--------------------|--------|--------|
| 1 | 3 | 5 | 30s | 3 | 3 |
| 2 | 3 | 5 | 28s | 3 | 4 |
| 3 | 3 | 5 | 26s | 4 | 4 |
| 4 | 4 | 6 | 24s | 4 | 4 |
| 5 | 4 | 6 | 22s | 4 | 5 |
| 6 | 4 | 7 | 20s | 4 | 5 |
| 7 | 5 | 7 | 18s | 4 | 6 |
| 8 | 5 | 8 | 16s | 4 | 6 |
| 9 | 5 | 9 | 15s | 4 | 6 |
| 10 | 5 | 10 | 14s | 4 | 6 |

**Pattern Types**:
- Color progression
- Shape progression
- Size progression
- Position progression

**Scoring**:
- Correct: +10 points
- Incorrect: 0 points
- Pass level: 50% of total points

**Status**: ✅ Implemented (10 levels)

---

## ⏳ Games Needing Progression System

### Memory
- Pattern Matching
- Location Memory

### Pattern
- Sequence Completion
- Maze Navigation
- Jigsaw Puzzle

### Spatial
- Distance Judgment (partial)

### Reaction
- Target Detection (partial difficulty adjustment)

---

## 🎨 UI/UX Guidelines

### Color Scheme
- **Primary**: Blue-500 to Purple-500 gradient
- **Success**: Green-500
- **Warning**: Orange-500
- **Error**: Red-500
- **Neutral**: Gray-500 to Gray-900

### Typography
- **Headers**: text-3xl to text-4xl, font-bold
- **Subheaders**: text-xl to text-2xl, font-semibold
- **Body**: text-lg, font-medium
- **Small**: text-sm, font-normal

### Spacing
- **Padding**: p-4 to p-8 for containers
- **Gaps**: gap-3 to gap-6 for grids
- **Margins**: mb-4 to mb-8 for sections

### Animations
- **Entrance**: Opacity 0 → 1, Y 20 → 0 (0.3s)
- **Hover**: Scale 1.0 → 1.05 (0.2s)
- **Click**: Scale 1.0 → 0.95 (0.1s)
- **Progress**: Width 0 → 100% (0.5s)

---

## 📱 Accessibility

### Mobile Optimization
- Minimum touch target: 44×44px
- Responsive grids: 2 columns on mobile, 4 on desktop
- Large fonts: text-lg minimum for game elements

### Keyboard Support
- Tab navigation
- Enter/Space for buttons
- Arrow keys for grid navigation

### Color Contrast
- Text on backgrounds: 4.5:1 minimum (WCAG AA)
- Interactive elements: 3:1 minimum (WCAG AA)

---

**Last Updated**: 2026-03-08
**Version**: 1.0.0
