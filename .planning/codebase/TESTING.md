# Testing

## Current Test Status

**No formal test framework detected.**

The codebase currently lacks:
- Test directories (`test/`, `tests/`, `__tests__/`, `spec/`)
- Test configuration files (jest.config.js, vitest.config.js, etc.)
- Test scripts in package.json
- Test-related dependencies

## Manual Testing Approach

Current testing appears to be manual through:
1. **Health Endpoint**: `GET /api/health` checks system status
2. **Telegram Commands**: Interactive bot testing
3. **Dashboard UI**: Visual verification of frontend
4. **Start.py Pre-flight**: Infrastructure verification on launch

## Start.py Verification

The `start.py` MasterProtocol class includes basic infrastructure checks:
- Ollama connectivity verification
- Bags API availability check
- Telegram bot token validation
- Port conflict detection and cleanup

## Recommended Test Strategy

### Unit Tests Needed
- AgentBrain decision logic
- BagsApi client methods
- SolanaCore payment verification
- ProviderManager AI routing
- SkillLoader plugin management

### Integration Tests Needed
- End-to-end agent lifecycle
- Bags API communication
- Telegram bot command handling
- Frontend API connectivity

### Test Framework Suggestions
- **Jest** for Node.js backend
- **Pytest** for Python providers
- **React Testing Library** for frontend
- **Supertest** for API endpoints

## Coverage Targets

| Component | Recommended Coverage |
|-----------|---------------------|
| Core modules | 80%+ |
| API clients | 90%+ |
| UI components | 70%+ |
| Bot commands | 85%+ |

---
*Last updated: 2026-04-02 after codebase mapping*