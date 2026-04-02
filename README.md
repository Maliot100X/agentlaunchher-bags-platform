# AgentLaunchHer (Bags Agent Platform)

Fresh rebuild foundation for a Bags-native autonomous agent platform with:

- FastAPI backend (`api.py`)
- Agent runtime manager (`agents.py`)
- Registry + verification store (`registry.py`, `verifier.py`)
- Ollama provider manager (`providers/providers.py`)
- Telegram control bot (`telegram/bot.py`)
- Next.js command dashboard (`frontend/`)

## Quick Start

1. Ensure `.env` is configured.
2. Start all services:

```bash
./start_all.sh
```

3. Open:

- API: `http://localhost:3001/health`
- Dashboard: `http://localhost:3000`

4. Stop all services:

```bash
./stop_all.sh
```

## API Endpoints

- `GET /health`
- `POST /registry/request-code`
- `POST /registry/verify`
- `POST /agents/register`
- `GET /agents`
- `POST /agents/{agent_id}/start`
- `POST /agents/{agent_id}/stop`
- `POST /ask`

## Telegram Commands

- `/help`
- `/new <name>`
- `/agents`
- `/startagent <agent_id>`
- `/stopagent <agent_id>`
- `/scan`
- `/status`
- `/ask <message>`

## Notes

- Health endpoint validates Bags and Ollama connectivity.
- Financial auto-execution is not implemented; recommendations remain user-mediated.
- Legacy imported files were preserved in `_legacy_snapshot/` for reference.
