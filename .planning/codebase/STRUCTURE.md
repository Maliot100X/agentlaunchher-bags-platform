# Structure

## Directory Layout

```
bags-agent-platform/
├── .env                          # Environment configuration (secrets)
├── .gitignore                    # Git ignore rules
├── package.json                  # Backend dependencies
├── server.js                     # Main Express server entry point
├── start.py                      # Python master protocol launcher
├── crawler.js                    # Documentation crawler
│
├── agents/                       # Agent configuration files (JSON)
├── ai/                           # AI-related components
├── analytics/                    # Analytics and monitoring
├── automation/                   # Automation workflows
├── bags/                         # Bags.fm API integration
│   └── bags_api.js
├── config/                       # Configuration files
├── core/                         # Core system modules
│   ├── agent_brain.js            # Autonomous agent decision engine
│   ├── agent_registry.js         # Agent lifecycle management
│   └── skill_loader.js           # Dynamic skill/plugin loader
├── dashboard/                    # Dashboard components
├── docs_index/                   # Crawled documentation archive
├── env/                          # Environment-specific configs
├── execution/                    # Task execution logic
├── frontend/                     # Next.js web dashboard
│   ├── package.json              # Frontend dependencies
│   └── pages/
│       └── index.js              # Main dashboard page
├── providers/                    # AI provider integrations
│   └── providers.py              # Ollama provider manager
├── signals/                      # Signal processing
├── skills/                       # Skill plugins
├── solana/                       # Solana blockchain integration
│   └── solana_api.js             # Solana RPC client
├── strategies/                   # Trading strategies
├── telegram/                     # Telegram bot integration
│   ├── launcher_bot.js           # Main bot implementation
│   └── signal_bot.js             # Signal notification system
├── wallet/                       # Wallet management
└── web/                          # Web server routes
```

## Key Locations

| Path | Purpose |
|------|---------|
| `core/agent_brain.js` | Autonomous agent loop (collect → analyze → recommend) |
| `core/agent_registry.js` | Agent registration and persistence |
| `bags/bags_api.js` | Bags.fm API client with launch workflow |
| `solana/solana_api.js` | Solana payment verification |
| `providers/providers.py` | Ollama AI provider manager |
| `telegram/launcher_bot.js` | Telegram command interface |
| `frontend/pages/index.js` | Main dashboard UI with 3D graphics |
| `docs_index/` | Crawled documentation from multiple sources |

## Naming Conventions

- **Files**: `snake_case.js` for modules
- **Classes**: `PascalCase` (AgentBrain, SolanaCore, ProviderManager)
- **Directories**: `lowercase` (bags, solana, telegram)
- **Environment Variables**: `UPPER_SNAKE_CASE` (BAGS_API_KEY, OLLAMA_URL)
- **API Endpoints**: `/api/resource` format

## Configuration Files

- `.env` — All secrets and runtime config
- `package.json` — Node.js dependencies
- `frontend/package.json` — Frontend dependencies

---
*Last updated: 2026-04-02 after codebase mapping*