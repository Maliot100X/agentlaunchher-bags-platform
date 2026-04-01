# Conventions

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

---
*Last updated: 2026-04-02 after codebase mapping*