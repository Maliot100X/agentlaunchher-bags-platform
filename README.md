# AgentLaunchHer (Bags Agent Platform)

![AgentLaunchHer Banner](docs/agentlaunchher-banner.svg)

Production-focused Bags-native autonomous agent platform foundation with:

- FastAPI backend API (`api.py`)
- Agent runtime manager (`agents.py`)
- Registry + verification (`registry.py`, `verifier.py`)
- Ollama provider manager (`providers/providers.py`)
- Telegram bot control surface (`telegram/bot.py`)
- Next.js dashboard (`frontend/`) with animated 3D-styled background and 9 tabs

## Directory Layout

- `api.py` - API gateway and orchestration
- `agents.py` - agent lifecycle and autonomous loop
- `registry.py` - sqlite-backed registry and verification storage
- `verifier.py` - random code generation and proof matching
- `bags/client.py` - Bags API integration
- `providers/providers.py` - Ollama provider routing
- `telegram/bot.py` - bot command handlers
- `frontend/` - Next.js dashboard UI

## Environment Variables

Required values are loaded from `.env`:

- `BAGS_API_KEY`
- `BAGS_PARTNER_WALLET`
- `SOLANA_RPC_URL`
- `OLLAMA_URL`
- `ACTIVE_AI_MODEL`
- `TELEGRAM_LAUNCHER_BOT_TOKEN`
- `PORT` (default `3001`)
- `WEB_PORT` (default `3000`)

## Run Locally

Start everything:

```bash
./start_all.sh
```

Stop everything:

```bash
./stop_all.sh
```

## Verification Checklist

1. API health

```bash
curl -s http://127.0.0.1:3001/health
```

2. Dashboard

- Open `http://127.0.0.1:3000`
- Ensure all 9 tabs are clickable

3. Telegram bot process

```bash
tail -f logs/telegram.log
```

## API Reference

- `GET /health`
- `POST /registry/request-code`
- `POST /registry/verify`
- `POST /agents/register`
- `GET /agents`
- `POST /agents/{agent_id}/start`
- `POST /agents/{agent_id}/stop`
- `GET /scan`
- `POST /portfolio`
- `POST /positions`
- `POST /ask`

## Telegram Commands

- `/help`
- `/createagent <name>`
- `/new <name>`
- `/agents`
- `/startagent <agent_id>`
- `/stopagent <agent_id>`
- `/scan`
- `/portfolio <wallet>`
- `/positions <wallet>`
- `/status`
- `/ask <message>`

## Notes

- Financial actions are user-mediated; no forced auto-execution path is enabled.
- `_legacy_snapshot/` keeps previous imported files for reference.
