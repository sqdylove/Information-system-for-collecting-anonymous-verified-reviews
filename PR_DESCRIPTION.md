# PR Title
Enhance Telegram bot integration and Docker deployment for anonymous verified feedback service

# PR Description
What was done:
- Implemented a full Telegram bot in `bot/main.py` with interactive command flows.
- Added support for commands: `/start`, `/help`, `/newbox`, `/feedback`, `/owner`, `/reply`, `/cancel`.
- Added emoji-rich bot responses for better UX.
- Implemented a newbox flow that returns both a Telegram deep link and a public feedback API URL.
- Added basic spam protection and text moderation for anonymous feedback submissions.
- Integrated bot with existing API client and backend routes.
- Updated `docker-compose.yml` and `.env` to support Docker deployment of API, bot, and PostgreSQL.
- Added `PUBLIC_API_BASE_URL` and `TELEGRAM_BOT_USERNAME` configuration for link generation.
- Fully rebuilt and restarted the Docker project to verify the setup.

Why:
- To provide an end-to-end anonymous feedback collection experience through Telegram.
- To ensure the bot works correctly in Docker alongside the backend and database.
- To simplify feedback submission with clickable links and better owner workflow.

Notes:
- The bot now generates Telegram deep links in `/newbox`.
- The public feedback URL is also provided for direct API usage.
- The project was rebuilt and restarted using Docker Compose to validate the integration.
