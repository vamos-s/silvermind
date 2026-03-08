# SilverMind - API Documentation

## 🔗 API Overview

SilverMind uses Supabase for backend services. All API interactions go through Supabase's REST API and real-time features.

---

## 📚 Base URL

```
https://your-project.supabase.co
```

---

## 🔐 Authentication

### Sign Up

Create a new user account.

```typescript
POST /auth/v1/signup

{
  "email": "user@example.com",
  "password": "securepassword123",
  "data": {
    "username": "optional_username"
  }
}

Response: 201 Created
{
  "access_token": "jwt_token",
  "user": {
    "id": "user_uuid",
    "email": "user@example.com",
    ...
  }
}
```

### Sign In

Authenticate existing user.

```typescript
POST /auth/v1/token?grant_type=password

{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response: 200 OK
{
  "access_token": "jwt_token",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": { ... }
}
```

### Sign Out

End user session.

```typescript
POST /auth/v1/logout

Headers:
  Authorization: Bearer <access_token>

Response: 200 OK
{
  "message": "OK"
}
```

### Get Current User

Retrieve authenticated user information.

```typescript
GET /auth/v1/user

Headers:
  Authorization: Bearer <access_token>

Response: 200 OK
{
  "id": "user_uuid",
  "email": "user@example.com",
  ...
}
```

---

## 👤 Users

### Get User Profile

```typescript
GET /rest/v1/users?id=eq.{user_id}

Headers:
  Authorization: Bearer <access_token>
  apikey: <your_anon_key>

Response: 200 OK
{
  "id": "user_uuid",
  "email": "user@example.com",
  "username": "player123",
  "created_at": "2024-01-01T00:00:00Z",
  "preferences": {
    "language": "en",
    "difficulty": "medium"
  }
}
```

### Update User Profile

```typescript
PATCH /rest/v1/users?id=eq.{user_id}

Headers:
  Authorization: Bearer <access_token>
  apikey: <your_anon_key>
  Content-Type: application/json

Body:
{
  "username": "new_username",
  "preferences": {
    "language": "ko",
    "difficulty": "hard"
  }
}

Response: 200 OK
{
  "id": "user_uuid",
  "username": "new_username",
  ...
}
```

---

## 🎮 Game Sessions

### Create Game Session

```typescript
POST /rest/v1/game_sessions

Headers:
  Authorization: Bearer <access_token>
  apikey: <your_anon_key>
  Content-Type: application/json

Body:
{
  "user_id": "user_uuid",
  "game_id": "number-recall",
  "difficulty": "medium",
  "score": 150,
  "duration_seconds": 60,
  "level": 5,
  "metadata": {
    "sequence_length": 8,
    "correct_answers": 7,
    "incorrect_answers": 1
  }
}

Response: 201 Created
{
  "id": "session_uuid",
  "user_id": "user_uuid",
  "game_id": "number-recall",
  "score": 150,
  "completed_at": "2024-01-01T00:01:00Z"
}
```

### Get User's Sessions

```typescript
GET /rest/v1/game_sessions?user_id=eq.{user_id}&order=completed_at.desc&limit=20

Headers:
  Authorization: Bearer <access_token>
  apikey: <your_anon_key>

Response: 200 OK
[
  {
    "id": "session_uuid",
    "game_id": "number-recall",
    "score": 150,
    "difficulty": "medium",
    "completed_at": "2024-01-01T00:01:00Z"
  },
  ...
]
```

### Get Sessions by Game

```typescript
GET /rest/v1/game_sessions?user_id=eq.{user_id}&game_id=eq.{game_id}&order=completed_at.desc

Headers:
  Authorization: Bearer <access_token>
  apikey: <your_anon_key>

Response: 200 OK
[
  {
    "id": "session_uuid",
    "game_id": "number-recall",
    "score": 150,
    ...
  }
]
```

### Get Best Score

```typescript
GET /rest/v1/game_sessions?user_id=eq.{user_id}&game_id=eq.{game_id}&order=score.desc&limit=1

Headers:
  Authorization: Bearer <access_token>
  apikey: <your_anon_key>

Response: 200 OK
[
  {
    "id": "session_uuid",
    "game_id": "number-recall",
    "score": 200, // Best score
    ...
  }
]
```

---

## 🏆 Scores

### Submit Score

```typescript
POST /rest/v1/scores

Headers:
  Authorization: Bearer <access_token>
  apikey: <your_anon_key>
  Content-Type: application/json

Body:
{
  "user_id": "user_uuid",
  "game_id": "number-recall",
  "level": 5,
  "score": 200
}

Response: 201 Created
{
  "id": "score_uuid",
  "user_id": "user_uuid",
  "game_id": "number-recall",
  "level": 5,
  "score": 200,
  "completed_at": "2024-01-01T00:01:00Z"
}
```

### Get Leaderboard

```typescript
GET /rest/v1/scores?game_id=eq.{game_id}&order=score.desc&limit=10

Headers:
  apikey: <your_anon_key>

Response: 200 OK
[
  {
    "id": "score_uuid",
    "user_id": "user_uuid",
    "game_id": "number-recall",
    "score": 500,
    "completed_at": "2024-01-01T00:00:00Z",
    "user": {
      "username": "top_player"
    }
  },
  ...
]
```

### Get User's Scores

```typescript
GET /rest/v1/scores?user_id=eq.{user_id}&game_id=eq.{game_id}&order=completed_at.desc

Headers:
  Authorization: Bearer <access_token>
  apikey: <your_anon_key>

Response: 200 OK
[
  {
    "id": "score_uuid",
    "score": 200,
    ...
  }
]
```

---

## 🎖️ Achievements

### Get User's Achievements

```typescript
GET /rest/v1/achievements?user_id=eq.{user_id}&order=earned_at.desc

Headers:
  Authorization: Bearer <access_token>
  apikey: <your_anon_key>

Response: 200 OK
[
  {
    "id": "achievement_uuid",
    "user_id": "user_uuid",
    "achievement_id": "first_win",
    "earned_at": "2024-01-01T00:01:00Z"
  },
  ...
]
```

### Unlock Achievement

```typescript
POST /rest/v1/achievements

Headers:
  Authorization: Bearer <access_token>
  apikey: <your_anon_key>
  Content-Type: application/json

Body:
{
  "user_id": "user_uuid",
  "achievement_id": "perfect_score"
}

Response: 201 Created
{
  "id": "achievement_uuid",
  "achievement_id": "perfect_score",
  "earned_at": "2024-01-01T00:01:00Z"
}
```

### Available Achievements

```typescript
GET /rest/v1/achievements_definitions

Headers:
  apikey: <your_anon_key>

Response: 200 OK
[
  {
    "id": "perfect_score",
    "name": "Perfect Score",
    "description": "Complete a game with 100% accuracy",
    "icon": "🏆"
  },
  ...
]
```

---

## 📊 Statistics

### Get User Statistics

```typescript
GET /rest/v1/user_statistics?user_id=eq.{user_id}

Headers:
  Authorization: Bearer <access_token>
  apikey: <your_anon_key>

Response: 200 OK
{
  "user_id": "user_uuid",
  "total_sessions": 150,
  "total_play_time": 9000,
  "average_score": 175.5,
  "best_game_id": "number-recall",
  "best_score": 500,
  "games_played": ["number-recall", "color-match", ...],
  "last_played": "2024-01-01T00:01:00Z"
}
```

### Get Game Statistics

```typescript
GET /rest/v1/game_statistics?game_id=eq.{game_id}

Headers:
  apikey: <your_anon_key>

Response: 200 OK
{
  "game_id": "number-recall",
  "total_plays": 10000,
  "average_score": 180,
  "highest_level_completed": 8,
  "completion_rate": 0.75
}
```

---

## 🔍 Query Parameters

Supabase API uses standard query parameters:

| Parameter | Description | Example |
|-----------|-------------|----------|
| `eq` | Equal to | `game_id=eq.number-recall` |
| `neq` | Not equal to | `difficulty=neq.hard` |
| `gt` | Greater than | `score=gt.100` |
| `gte` | Greater than or equal | `level=gte.5` |
| `lt` | Less than | `score=lt.200` |
| `lte` | Less than or equal | `level=lte.10` |
| `like` | Pattern match | `username=like.john%` |
| `ilike` | Case-insensitive pattern | `title=ilike.%memory%` |
| `in` | In list | `game_id=in.(number-recall,sequence-memory)` |
| `order` | Sort order | `order=completed_at.desc` |
| `limit` | Limit results | `limit=20` |
| `offset` | Skip results | `offset=20` |
| `select` | Select columns | `select=game_id,score,completed_at` |

---

## 📨 Real-time Subscriptions

### Subscribe to User Sessions

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const channel = supabase
  .channel('user_sessions')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'game_sessions',
      filter: `user_id=eq.{user_id}`
    },
    (payload) => {
      console.log('New session:', payload.new)
    }
  )
  .subscribe()
```

### Subscribe to Leaderboard Updates

```typescript
const channel = supabase
  .channel('leaderboard')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'scores',
      filter: `game_id=eq.{game_id}`
    },
    (payload) => {
      console.log('Leaderboard updated:', payload)
    }
  )
  .subscribe()
```

---

## 🔒 Rate Limiting

| Endpoint | Limit | Period |
|----------|-------|--------|
| Auth endpoints | 100 | hour |
| REST API | 1000 | hour |
| Real-time | 100 | minute |

---

## 📝 Error Responses

### Authentication Errors

```json
{
  "code": "auth_invalid_credentials",
  "message": "Invalid login credentials"
}
```

### Validation Errors

```json
{
  "code": "42501",
  "message": "new row violates check constraint",
  "details": {
    "constraint": "scores_score_check"
  }
}
```

### Rate Limit Errors

```json
{
  "code": "rate_limit_exceeded",
  "message": "Too many requests"
}
```

---

## 🔌 Client Libraries

### JavaScript/TypeScript

```bash
npm install @supabase/supabase-js
```

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Example: Create session
const { data, error } = await supabase
  .from('game_sessions')
  .insert({
    user_id: userId,
    game_id: 'number-recall',
    score: 150
  })
  .select()
```

### React Hook

```bash
npm install @supabase/supabase-js
```

```typescript
import { useSupabaseClient } from '@/hooks/useSupabase'

function GameComponent() {
  const supabase = useSupabaseClient()

  const handleSubmit = async () => {
    const { data, error } = await supabase
      .from('scores')
      .insert({ score: 100 })
  }
}
```

---

## 🧪 Testing

### cURL Examples

#### Sign Up
```bash
curl -X POST 'https://your-project.supabase.co/auth/v1/signup' \
  -H 'Content-Type: application/json' \
  -H 'apikey: your-anon-key' \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Create Session
```bash
curl -X POST 'https://your-project.supabase.co/rest/v1/game_sessions' \
  -H 'Authorization: Bearer your-jwt-token' \
  -H 'apikey: your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_id": "user-uuid",
    "game_id": "number-recall",
    "score": 150
  }'
```

#### Get Leaderboard
```bash
curl 'https://your-project.supabase.co/rest/v1/scores?game_id=eq.number-recall&order=score.desc&limit=10' \
  -H 'apikey: your-anon-key'
```

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase API Reference](https://supabase.com/docs/reference/javascript)
- [PostgREST Documentation](https://postgrest.org/en/stable/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Last Updated**: 2026-03-08
**Version**: 1.0.0
