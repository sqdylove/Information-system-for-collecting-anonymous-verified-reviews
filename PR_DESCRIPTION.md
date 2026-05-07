# Pull Request: Telegram Bot Integration & Code Quality Improvements

## Title
Add Telegram Bot Integration for Anonymous Feedback Collection System

## Description

### Overview
This PR introduces a fully functional Telegram bot that integrates with the anonymous verified reviews backend API. The system allows users to anonymously submit feedback through the bot, while feedback owners can manage responses through unique tokens.

### Key Features Implemented

#### 1. **Telegram Bot Core (`bot/main.py`)**
- Complete FSM (Finite State Machine) implementation for stateful conversations
- Support for anonymous feedback submission via deep links
- Owner-only access to feedback management with token-based authentication
- Built-in rate limiting to prevent spam (5 requests per minute per action)
- Graceful error handling with automatic Telegram network error recovery

#### 2. **Bot Commands**
- `/start` - Contextual greeting based on deep link presence
- `/help` - Comprehensive command reference
- `/newbox` - Create new feedback collection box with auto-generated UUID and owner token
- `/reviews <uuid> <owner_token>` - View all feedbacks in a box with replies
- `/reply <feedback_id> <owner_token>` - Respond to specific feedback
- `/cancel` - Clear current state

#### 3. **API Client (`bot/api_client.py`)**
- Async HTTP client using httpx with keep-alive optimization
- Unified error handling with detailed status codes and messages
- Methods for all backend operations: box creation, feedback submission, replies

#### 4. **State Management (`bot/states.py`)**
- FSM states for sender feedback input
- FSM states for owner reply input
- Clear state transitions for user flows

#### 5. **Rate Limiting (`bot/rate_limit.py`)**
- In-memory rate limiter with configurable limits
- Per-user per-action tracking
- Sliding window implementation for accurate throttling

### Backend Improvements

#### 1. **Pydantic V2 Migration**
- Updated all schema classes from `class Config: orm_mode = True` to `ConfigDict(from_attributes=True)`
- Removed deprecation warnings across schema files:
  - `src/schemas/box.py`
  - `src/schemas/feedback.py`
  - `src/schemas/reply.py`

#### 2. **DateTime Fixes**
- Replaced deprecated `datetime.utcnow()` with timezone-aware `datetime.now(timezone.utc)`
- Added `DateTime(timezone=True)` to all timestamp columns in:
  - `src/models/box.py`
  - `src/models/feedback.py`
  - `src/models/reply.py`
- Eliminates SQLAlchemy deprecation warnings

#### 3. **Database Configuration**
- Added fallback to SQLite for local development when `DATABASE_URL` env var is not set
- Prevents container-specific database connection errors during local testing
- Maintains full Docker Compose PostgreSQL compatibility

#### 4. **Bot Startup Safety**
- Moved `TELEGRAM_BOT_TOKEN` validation from module import to `main()` function
- Allows safe module imports without environment variables for testing
- Better error messages when token is missing at runtime

### User Experience Enhancements

#### Bot `/newbox` Response
When creating a feedback box, the bot now displays:
```
Бокс создан!

UUID бокса: `<uuid>`
Ссылка для отзывов: https://t.me/bot?start=<uuid>
Токен владельца: `<token>`

Сохраните UUID и токен — они нужны для управления отзывами.
```

This formatting makes it easy to copy-paste UUID and tokens without manual formatting.

### Testing & Validation
- All existing tests continue to pass (4/4)
- Zero deprecation warnings in pytest output
- Syntax validation completed for all modified files
- Docker images successfully build with all changes

### Technical Debt Addressed
- Removed 12+ Pydantic v1 deprecation warnings
- Eliminated SQLAlchemy datetime deprecation warnings
- Improved development environment compatibility
- Better error handling in environment variable setup

### Docker Configuration
- Updated docker-compose.yml with bot service configuration
- Bot automatically retries on Telegram network failures
- Proper environment variable passing from .env file
- All three services (db, api, bot) orchestrated and running

## Breaking Changes
None - all changes are backward compatible with existing API clients.

## Files Modified
- `bot/main.py` - New bot implementation
- `bot/api_client.py` - New API client
- `bot/states.py` - New FSM states
- `bot/rate_limit.py` - New rate limiter
- `src/schemas/box.py` - Pydantic v2 migration
- `src/schemas/feedback.py` - Pydantic v2 migration
- `src/schemas/reply.py` - Pydantic v2 migration
- `src/models/box.py` - DateTime & import fixes
- `src/models/feedback.py` - DateTime & import fixes
- `src/models/reply.py` - DateTime & import fixes
- `src/db/database.py` - Database fallback configuration
- `docker-compose.yml` - Bot service configuration

## How to Test
1. Run `docker-compose up --build`
2. Open Telegram and find bot `@anonymous_verified_reviews_bot`
3. Send `/newbox` to get a feedback collection link
4. Share the link and collect anonymous feedback
5. Use `/reviews <uuid> <token>` to manage feedback

## Related Issues
Closes #N/A (initial release)

---
**Author**: Team  
**Created**: 2026-05-07
