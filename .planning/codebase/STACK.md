# Stack

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

---
*Last updated: 2026-04-02 after codebase mapping*