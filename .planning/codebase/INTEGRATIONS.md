# Integrations

## External APIs

### Bags.fm API
- **Base URL**: `https://public-api-v2.bags.fm/api/v1`
- **Authentication**: `x-api-key` header
- **Endpoints Used**:
  - `GET /tokens` — Fetch token list
  - `GET /tokens` (health check) — Verify API status
  - `POST /launch` — Launch new tokens
  - `GET /fees/earnings?agentId=` — Get agent earnings
- **File**: `bags/bags_api.js`
- **Key Features**: Token validation, launch workflow, fee verification (0.07 SOL)

### Solana RPC
- **Default URL**: `https://api.mainnet-beta.solana.com`
- **Authentication**: None (public endpoint)
- **Methods Used**:
  - `getTransaction` — Verify payment signatures
  - `getBalance` — Check wallet balances
- **File**: `solana/solana_api.js`
- **Key Features**: Payment verification for launch fees

### Ollama AI Provider
- **Default URL**: `http://localhost:11434`
- **Authentication**: Bearer token (`OLLAMA_API_KEY`)
- **Endpoints Used**:
  - `GET /api/tags` — Check available models
  - `POST /api/generate` — Generate AI responses
- **Files**: `server.js`, `core/agent_brain.js`, `providers/providers.py`
- **Active Model**: `deepseek-v3.2:cloud` (configurable)

### Telegram Bot API
- **Authentication**: Bot token (`TELEGRAM_LAUNCHER_BOT_TOKEN`)
- **Admin Verification**: Hardcoded admin ID check
- **Features**:
  - Interactive keyboard menu
  - Market scanning
  - Agent management
  - Portfolio viewing
- **File**: `telegram/launcher_bot.js`

## Data Flow

```
User → Telegram Bot → Agent Registry → Bags API → Solana Network
User → Web Dashboard → Backend API → Bags API → Solana Network
Agent Brain → Ollama → Bags API → Market Data → Recommendations
```

## Security Considerations

- API keys stored in `.env` file (not committed to git)
- Telegram bot verifies admin ID before executing commands
- Solana payment verification required before token launches
- No database — state stored in memory and JSON files

---
*Last updated: 2026-04-02 after codebase mapping*