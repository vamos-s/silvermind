# SilverMind - Game Design Document

## 🎮 Game Design Philosophy

### Core Principles
1. **Progressive Difficulty**: Each game should start easy and gradually increase in difficulty
2. **Clear Feedback**: Users should always know how they performed
3. **Motivation**: Progress bars, scores, and achievements encourage continued play
4. **Accessibility**: Games should be playable on both desktop and mobile devices

---

## 📊 Scoring System

### Score Tiers
- **Perfect**: 100% of max score + bonus
- **Excellent**: 90-99% of max score
- **Good**: 75-89% of max score
- **Average**: 50-74% of max score
- **Poor**: < 50% of max score

---

# MEMORY GAMES (6 games)

## 1. Number Recall

### Concept
Users see a sequence of numbers and must recall them in order.

### Level Progression (10 Levels)
| Level | Sequence Length | Display Time | Input Time | Points per Digit |
|-------|----------------|--------------|------------|------------------|
| 1 | 3 | 3000ms | 30s | 10 |
| 2 | 4 | 2500ms | 30s | 10 |
| 3 | 5 | 2000ms | 35s | 10 |
| 4 | 6 | 1800ms | 35s | 10 |
| 5 | 7 | 1600ms | 40s | 12 |
| 6 | 8 | 1400ms | 40s | 12 |
| 7 | 9 | 1200ms | 45s | 12 |
| 8 | 10 | 1100ms | 45s | 15 |
| 9 | 11 | 1000ms | 50s | 15 |
| 10 | 12 | 800ms | 50s | 20 |

### Status: Implemented

---

## 2. Sequence Memory

### Concept
Watch cells light up and repeat the pattern.

### Level Progression (10 Levels)
| Level | Grid Size | Sequence Length | Display Speed |
|-------|-----------|----------------|---------------|
| 1 | 3x3 | 3 | 800ms |
| 2 | 3x3 | 4 | 770ms |
| 3 | 4x4 | 4 | 740ms |
| 4 | 4x4 | 5 | 710ms |
| 5 | 5x5 | 5 | 680ms |
| 6 | 5x5 | 6 | 650ms |
| 7 | 6x6 | 6 | 620ms |
| 8 | 6x6 | 7 | 590ms |
| 9 | 6x6 | 8 | 560ms |
| 10 | 6x6 | 9 | 530ms |

### Status: Implemented

---

## 3. Word Recall

### Concept
Remember and type words in order.

### Level Progression (10 Levels)
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

### Status: Implemented

---

## 4. Card Flip

### Concept
Classic memory card matching game.

### Level Progression (5 Levels)
| Level | Grid Size | Card Count | Time Limit |
|-------|-----------|------------|------------|
| 1 | 4x4 | 16 | 2 min |
| 2 | 4x4 | 16 | 2 min |
| 3 | 4x5 | 20 | 3 min |
| 4 | 5x4 | 20 | 4 min |
| 5 | 6x5 | 30 | 5 min |

### Features: 2-second preview, hint system, no clicking same card twice
### Status: Implemented

---

## 5. Pattern Matching
### Status: Needs progression system

## 6. Location Memory
### Status: Needs progression system

---

# LOGIC GAMES (2 games)

## 7. Logic Puzzle

### Concept
Arrange boxes based on logical clues.

### Level Progression (10 Levels)
| Level | Box Count | Clue Count | Max Attempts | Base Points |
|-------|-----------|------------|--------------|-------------|
| 1 | 3 | 2 | 5 | 100 |
| 2 | 3 | 2 | 5 | 100 |
| 3 | 3 | 2 | 5 | 100 |
| 4 | 4 | 3 | 5 | 150 |
| 5 | 4 | 3 | 5 | 150 |
| 6 | 4 | 3 | 5 | 150 |
| 7 | 5 | 4 | 5 | 200 |
| 8 | 5 | 4 | 5 | 200 |
| 9 | 5 | 4 | 5 | 200 |
| 10 | 5 | 4 | 5 | 200 |

### Status: Implemented

---

## 8. Sudoku

### Concept
Classic number puzzle.

### Level Progression (10 Levels)
| Level | Grid Size | Number Range | Empty Cells | Time Limit |
|-------|-----------|--------------|-------------|------------|
| 1 | 4x4 | 1-4 | 4 | 5 min |
| 2 | 4x4 | 1-4 | 5 | 5 min |
| 3 | 6x6 | 1-6 | 12 | 10 min |
| 4 | 6x6 | 1-6 | 15 | 10 min |
| 5 | 9x9 | 1-9 | 30 | 20 min |
| 6 | 9x9 | 1-9 | 40 | 20 min |
| 7 | 9x9 | 1-9 | 45 | 25 min |
| 8 | 9x9 | 1-9 | 50 | 25 min |
| 9 | 9x9 | 1-9 | 55 | 30 min |
| 10 | 9x9 | 1-9 | 60 | 30 min |

### Status: Implemented

---

# PATTERN GAMES (4 games)

## 9. Pattern Recognition

### Concept
Identify the pattern and find what comes next.

### Level Progression (10 Levels)
| Level | Pattern Length | Questions | Time per Question |
|-------|---------------|-----------|-------------------|
| 1 | 3 | 5 | 30s |
| 2 | 3 | 5 | 28s |
| 3 | 3 | 5 | 26s |
| 4 | 4 | 6 | 24s |
| 5 | 4 | 6 | 22s |
| 6 | 4 | 7 | 20s |
| 7 | 5 | 7 | 18s |
| 8 | 5 | 8 | 16s |
| 9 | 5 | 9 | 15s |
| 10 | 5 | 10 | 14s |

### Status: Implemented

---

## 10. Sequence Completion
### Status: Needs progression system

## 11. Maze Navigation
### Status: Needs progression system

## 12. Jigsaw Puzzle
### Status: Needs progression system

---

# REACTION GAMES (4 games)

## 13. Color Match (Stroop Test)

### Concept
Match either the text or the color.

### Level Progression (10 Levels)
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

### Status: Implemented

---

## 14. Timing Game

### Concept
Click when the color changes from red to green.

### Level Progression (10 Levels)
| Level | Rounds | Min Delay | Max Delay | Target Time |
|-------|--------|-----------|-----------|-------------|
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

### Status: Implemented

---

## 15. Quick Reaction

### Concept
Click when the screen turns green.

### Level Progression (10 Levels)
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

### Status: Implemented

---

## 16. Target Detection

### Concept
Find and click all target items.

### Level Progression (10 Levels)
| Level | Grid Size | Targets | Distractors | Time Limit |
|-------|-----------|---------|--------------|------------|
| 1 | 6x6 | 5 | 10 | 30s |
| 2 | 7x7 | 6 | 12 | 35s |
| 3 | 8x8 | 7 | 15 | 40s |
| 4 | 8x8 | 8 | 18 | 45s |
| 5 | 9x9 | 9 | 20 | 50s |
| 6 | 9x9 | 10 | 22 | 55s |
| 7 | 10x10 | 10 | 25 | 60s |
| 8 | 10x10 | 12 | 28 | 65s |
| 9 | 10x10 | 15 | 30 | 70s |
| 10 | 10x10 | 20 | 35 | 80s |

### Status: Implemented with shuffle feature

---

# SPATIAL GAMES (2 games)

## 17. Rotated Shapes

### Concept
Identify the rotated version of a shape.

### Feature: 3-second timer for difficulty
### Status: Partial implementation

---

## 18. Distance Judgment

### Concept
Estimate distances between points.

### Feature: Points constrained to grid bounds
### Status: Implemented

---

# GAMES NEEDING PROGRESSION (9)

1. Pattern Matching (Memory)
2. Location Memory (Memory)
3. Sequence Completion (Pattern)
4. Maze Navigation (Pattern)
5. Jigsaw Puzzle (Pattern)
6. Distance Judgment (Spatial) - partial
7. Rotated Shapes (Spatial) - needs full progression

---

**Last Updated**: 2026-03-08
**Version**: 1.0.0
