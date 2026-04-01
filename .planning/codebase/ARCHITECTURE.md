# Architecture

## System Pattern

**Hybrid Microservices Architecture** with:
- Node.js backend API server
- Python orchestration layer
- Next.js frontend dashboard
- Telegram bot interface
- Local AI provider (Ollama)

## Layers

### 1. Presentation Layer
- **Web Dashboard** (`frontend/`) — Next.js SPA with 3D graphics
- **Telegram Bot** (`telegram/`) — Interactive command interface
- **REST API** (`server.js`) — JSON API endpoints

### 2. Business Logic Layer
- **Agent Brain** (`core/agent_brain.js`) — Autonomous decision engine
- **Agent Registry** (`core/agent_registry.js`) — Agent lifecycle management
- **Skill Loader** (`core/skill_loader.js`) — Dynamic plugin system
- **Bags API Client** (`bags/bags_api.js`) — External API wrapper
- **Solana Core** (`solana/solana_api.js`) — Blockchain interaction

### 3. AI Provider Layer
- **Provider Manager** (`providers/providers.py`) — Ollama integration
- **Model Router** — Supports multiple AI models via configuration

### 4. Data Layer
- **File-based Storage** — JSON configs in `agents/` directory
- **Environment Config** — `.env` for secrets
- **Documentation Index** — `docs_index/` for crawled research

## Data Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │───▶│   Backend   │───▶│  Bags API   │
│  (Next.js)  │    │  (Express)  │    │ (External)  │
└─────────────┘    └──────┬──────┘    └─────────────┘
                          │
                   ┌──────▼──────┐
                   │ Agent Brain │
                   │  (AI Loop)  │
                   └──────┬──────┘
                          │
                   ┌──────▼──────┐
                   │   Ollama    │
                   │ (Local AI)  │
                   └─────────────┘
```

## Entry Points

- **`server.js`** — Main Express server (port 3001)
- **`start.py`** — Master protocol launcher
- **`frontend/pages/index.js`** — Next.js homepage
- **`telegram/launcher_bot.js`** — Telegram bot entry

## Key Abstractions

- **AgentBrain Class** — Encapsulates autonomous agent behavior
- **ProviderManager Class** — Abstracts AI provider communication
- **SolanaCore Class** — Wraps blockchain operations
- **BagsApi Class** — Manages external API communication

## Communication Patterns

- **Synchronous** — REST API calls between frontend and backend
- **Asynchronous** — Agent loops run on timers (60s cycles)
- **Event-driven** — Signal bot emits events for user notifications
- **Polling** — Frontend refreshes data every 5 seconds

---
*Last updated: 2026-04-02 after codebase mapping*