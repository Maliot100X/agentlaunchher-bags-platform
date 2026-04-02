# Phase 1 Discussion: Foundation & Security

**Phase:** 1 — Foundation & Security
**Goal:** Users can register agents that perform real AI analysis of Bags tokens with secure, validated infrastructure
**Requirements:** BAGS-01, BAGS-02, BAGS-05, AGNT-01, AGNT-02, AGNT-03, AIPR-01, SOLN-01, SOLN-02, SECU-01, SECU-04, SECU-05, ANLY-03

## Codebase State Analysis

### What Exists
- **server.js** (62 lines) — Basic Express server with /api/health, /api/tokens, /api/agents, /api/chat
- **core/agent_brain.js** (103 lines) — Autonomous loop with placeholder momentum calculation
- **core/agent_registry.js** (36 lines) — JSON file-based agent storage
- **core/skill_loader.js** (46 lines) — Git clone-based skill sync (dependency install commented out)
- **bags/bags_api.js** (69 lines) — Basic Bags API client (wrong endpoints, uses /tokens instead of /token-launch/feed)
- **telegram/launcher_bot.js** (56 lines) — Admin-only bot with /start, /help, /scan commands
- **telegram/signal_bot.js** — Referenced but not read yet
- **providers/providers.py** (44 lines) — Basic Ollama wrapper with typos
- **frontend/** — Next.js app exists (not fully explored)
- **solana/**, **wallet/**, **ai/**, **analytics/**, **automation/**, **execution/**, **signals/**, **strategies/** — Empty directories
- **skills/** — Empty directory
- **agents/** — JSON file storage for agent configs

### Critical Bugs & Issues

#### 1. Bags API Integration (BAGS-01, BAGS-02, BAGS-05) — BROKEN
- **Wrong endpoints**: Uses `/tokens` instead of `/token-launch/feed`
- **Wrong launch endpoint**: Uses `/launch` instead of the multi-step flow (create-token-info → create-config → create-launch-transaction → send-transaction)
- **Missing authentication**: No agent auth flow (auth-init → auth-login)
- **Missing fee share config**: No fee share configuration creation
- **Missing partner config**: No partner key creation flow
- **Wrong response handling**: Assumes simple response format, doesn't handle Bags API v2 structure
- **Launch fee hardcoded**: 0.07 SOL should come from Bags API

#### 2. Agent Brain (AGNT-02) — PARTIALLY WORKING
- **Placeholder momentum**: `Math.random()` instead of real calculation
- **No structured outputs**: Ollama call doesn't use proper JSON format schema
- **No tool calling**: Doesn't use Ollama's tool calling capability
- **No fallback**: If Ollama fails, returns empty array with no retry
- **No model routing**: Single model for all tasks
- **60s hardcoded loop**: No configurable interval
- **No error recovery**: Single error stops the loop

#### 3. Agent Registry (AGNT-01, AGNT-05) — MINIMAL
- **JSON file storage only**: No database, no persistence guarantees
- **No external agent registration**: No API for external agents to connect
- **No agent metadata**: Only stores name and model
- **Missing fields**: No description, skills, strategies, wallet, API keys
- **No validation**: No input validation on registration

#### 4. Security (SECU-01, SECU-04, SECU-05) — MISSING
- **API keys exposed**: .env file has real production keys (should be in .gitignore)
- **No rate limiting**: No rate limiting middleware
- **No input validation**: No validation on any API endpoints
- **No API authentication**: Backend endpoints have no auth
- **No transaction validation**: Payment verification exists but uses wrong flow
- **Error handling**: Silent failures in multiple places (catch blocks return empty)

#### 5. Ollama Provider (AIPR-01) — BASIC
- **Typo in log**: "Processnig" instead of "Processing"
- **Wrong model name handling**: Strips `:cloud` suffix but doesn't handle remote models
- **No model listing**: Can't list available models
- **No streaming support**: Only non-streaming generation
- **No chat API**: Uses /api/generate instead of /api/chat
- **No structured outputs**: No JSON format support
- **No tool calling**: No tool definition support

#### 6. Solana Integration (SOLN-01, SOLN-02) — INCOMPLETE
- **solana/ directory empty**: No implementation
- **wallet/ directory empty**: No wallet management
- **Payment verification**: Referenced in bags_api.js but solana_api.js doesn't exist yet

#### 7. Telegram Bot (TLMG-*) — INCOMPLETE
- **Missing commands**: No /createagent, /startagent, /stopagent, /portfolio, /positions, /status
- **Admin-only**: No multi-user support
- **No agent control**: Can't start/stop agents from Telegram
- **No error handling**: Generic "Scan Failed" messages

#### 8. Frontend — UNEXPLORED
- **frontend/ exists**: Need to explore pages and components

#### 9. Skill System — EMPTY
- **skills/ directory empty**: No skills implemented
- **Skill loader incomplete**: Dependency install commented out
- **No skill metadata**: No SKILL.md files

#### 10. Health Monitoring (ANLY-03) — BASIC
- **Basic health endpoint**: Only checks Bags API and Ollama
- **No Telegram bot health**: Just checks if module exists
- **No detailed metrics**: No response times, error rates, etc.

## Assumptions for Phase 1

1. **Bags API v2 is the source of truth** — All token data, launches, and trading flow through Bags API
2. **Ollama runs locally** — Must work offline with local models
3. **JSON file storage is acceptable for Phase 1** — Database migration is Phase 2+
4. **Admin-only Telegram is acceptable for Phase 1** — Multi-user comes later
5. **All financial actions require user confirmation** — Non-negotiable security principle
6. **Existing .env values are valid** — API keys and wallet addresses are correct
7. **Frontend connects to backend on port 3001** — Standard API proxy setup

## Questions Before Planning

1. **Bags API endpoints**: Should we use the Bags SDK (@bagsfm/bags-sdk) or raw API calls?
2. **Model strategy**: Which Ollama models should we use for which tasks? (analysis, chat, reasoning)
3. **Agent configuration**: What fields should an agent config have? (name, description, model, skills, strategies, wallet, API keys?)
4. **Skill format**: Should skills follow OpenClaw SKILL.md format or custom format?
5. **Frontend scope**: For Phase 1, do we need a full dashboard or just API endpoints?
6. **Testing approach**: Should we write tests as we build, or add tests after implementation?
7. **Deployment target**: Vercel for frontend — what about backend? (Vercel serverless or separate host?)

## Recommended Fix Priority

### P0 — Critical (Must Fix First)
1. Fix Bags API integration with correct v2 endpoints
2. Implement proper agent registration with full metadata
3. Add input validation and rate limiting
4. Fix Ollama provider to use /api/chat with structured outputs
5. Implement Solana wallet connection and transaction verification

### P1 — Important
6. Complete Telegram bot with all 7 commands
7. Implement agent brain with real indicators (not Math.random())
8. Add comprehensive error handling and logging
9. Create health monitoring with detailed metrics
10. Implement skill loading with proper dependency management

### P2 — Nice to Have
11. Frontend dashboard panels
12. Agent marketplace feed
13. Portfolio visualization
14. Floating AI assistant

## Phase 1 Success Criteria Validation

1. ✅ User can create an agent with name, description, and see it listed in registry — **NEEDS: Full agent config, validation, registry API**
2. ✅ Agent runs autonomous loop and produces recommendations requiring confirmation — **NEEDS: Real indicators, proper Ollama integration, confirmation queue**
3. ✅ All financial actions blocked until user explicitly confirms — **NEEDS: Confirmation gate, no auto-execution**
4. ✅ API endpoints protected with authentication and rate limiting — **NEEDS: Auth middleware, rate limiter, input validation**
5. ✅ System health dashboard shows real-time status of all components — **NEEDS: Detailed health checks, metrics, status page**
