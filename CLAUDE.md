<!-- GSD:project-start source:PROJECT.md -->
## Project

**Bags Agent Platform**

A production-grade AI Agent Platform for the Bags ecosystem on Solana. It enables users to deploy autonomous AI agents that analyze token markets, execute trading strategies, and manage portfolios — all controlled via Telegram and a modern web dashboard with 3D graphics.

**Core Value:** AI agents that autonomously analyze Bags ecosystem tokens and provide actionable trading recommendations — requiring explicit user confirmation before any financial action.

### Constraints

- **Tech Stack**: Node.js backend, Next.js frontend, Python orchestration, Ollama AI — existing investments to preserve
- **Blockchain**: Solana only — Bags ecosystem is Solana-native
- **AI Provider**: Ollama local models — must support offline operation
- **Security**: All financial actions require explicit user confirmation — non-negotiable
- **Deployment**: Must be deployable to Vercel without errors
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages & Runtime
- **Node.js** — Backend runtime (server.js, core modules, API integrations)
- **Python 3** — Provider management and orchestration (providers/providers.py, start.py)
- **JavaScript (ES6+)** — All frontend and backend logic
## Frameworks & Libraries
### Backend (Node.js)
- **Express.js** (`express@^4.18.2`) — HTTP server and API routing
- **CORS** (`cors@^2.8.5`) — Cross-origin request handling
- **Axios** (`axios@^1.6.7`) — HTTP client for external API calls
- **dotenv** (`dotenv@^16.4.5`) — Environment variable management
- **node-telegram-bot-api** (`node-telegram-bot-api@^0.64.0`) — Telegram bot integration
### Frontend (Next.js)
- **Next.js** (`next@14.1.0`) — React framework with SSR/SSG
- **React** (`react@^18.2.0`) — UI component library
- **Three.js** (`three@^0.161.0`) — 3D graphics rendering
- **@react-three/fiber** (`^8.15.16`) — React renderer for Three.js
- **@react-three/drei** (`^9.97.0`) — Useful helpers for react-three-fiber
- **Framer Motion** (`framer-motion@^11.0.3`) — Animation library
- **Tailwind CSS** (`tailwindcss@^3.4.1`) — Utility-first CSS framework
- **Lucide React** (`lucide-react@^0.331.0`) — Icon library
- **clsx** + **tailwind-merge** — Conditional class name utilities
### Blockchain
- **@solana/web3.js** (`^1.89.1`) — Solana blockchain interaction
- **bs58** (`^5.0.0`) — Base58 encoding/decoding
- **tweetnacl** (`^1.0.3`) — Cryptographic functions
## Key Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.2 | Backend HTTP server |
| @solana/web3.js | ^1.89.1 | Solana RPC client |
| node-telegram-bot-api | ^0.64.0 | Telegram bot framework |
| next | 14.1.0 | Frontend framework |
| three | ^0.161.0 | 3D graphics engine |
| framer-motion | ^11.0.3 | UI animations |
| tailwindcss | ^3.4.1 | CSS utility framework |
## Configuration
- **Environment Variables** — `.env` file with all secrets
- **Python dotenv** — `load_dotenv()` in providers.py and start.py
- **Node dotenv** — `require('dotenv').config()` in all JS modules
## Build & Run
- **Backend**: `node server.js` (port 3001)
- **Frontend**: `npm run dev` in `frontend/` (port 3000)
- **Master Protocol**: `python start.py` (launches both with auto-restart)
- **No build step** for backend (plain Node.js)
- **Next.js build**: `npm run build` in frontend/
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Code Style
### JavaScript/Node.js
- **Module System**: CommonJS (`require`/`module.exports`)
- **Async/Await**: Promises with async/await pattern
- **Error Handling**: Try/catch blocks with console.error logging
- **Logging Format**: `[MODULE] Message` pattern (e.g., `[BRAIN]`, `[BAGS]`, `[SOLANA]`)
- **String Formatting**: Template literals (backticks)
- **Variable Declaration**: `const` by default, `let` when reassignment needed
### Python
- **Module System**: Standard imports (`import`, `from...import`)
- **Class-based Design**: OOP pattern for main components
- **Error Handling**: Try/except with exception message logging
- **Environment Loading**: `dotenv.load_dotenv()` at module start
### Frontend (React/Next.js)
- **Component Style**: Functional components with hooks
- **Styling**: Tailwind CSS utility classes
- **State Management**: React `useState` and `useEffect`
- **Animation**: Framer Motion for transitions
- **3D Graphics**: React Three Fiber declarative syntax
## Naming Patterns
| Type | Convention | Example |
|------|------------|---------|
| Classes | PascalCase | `AgentBrain`, `SolanaCore` |
| Functions | camelCase | `verifyPayment`, `getTokens` |
| Constants | UPPER_SNAKE_CASE | `BASE_URL`, `LAUNCH_FEE` |
| Files | snake_case | `agent_brain.js`, `solana_api.js` |
| Directories | lowercase | `bags/`, `telegram/` |
| API Routes | kebab-case | `/api/health`, `/api/tokens` |
## Error Handling
- **Backend**: Try/catch with console.error, returns empty arrays/null on failure
- **Frontend**: Silent error handling (empty catch blocks in some places)
- **API Client**: Axios error interception with user-friendly messages
- **Blockchain**: Graceful degradation (returns false/0 on verification failure)
## Security Patterns
- **Environment Variables**: All secrets loaded via dotenv
- **Admin Verification**: Telegram bot checks user ID against hardcoded admin
- **Payment Verification**: Solana transaction verification before launches
- **API Key Headers**: `x-api-key` for Bags API authentication
## Code Organization
- **Single Responsibility**: Each module handles one domain
- **Singleton Exports**: Most modules export instantiated singletons
- **Dependency Injection**: Configuration passed through constructors
- **Event-driven**: Signal bot uses EventEmitter pattern
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## System Pattern
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
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
