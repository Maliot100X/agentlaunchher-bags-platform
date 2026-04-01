# Concerns

## Technical Debt

### 1. Hardcoded Secrets
- **Severity**: HIGH
- **Issue**: `.env` file contains what appear to be real API keys and tokens
- **Location**: `.env` (lines 2-3, 12, 16)
- **Risk**: Credentials exposed if committed to version control
- **Recommendation**: Use environment variable injection, never store real keys in repo

### 2. No Input Validation
- **Severity**: HIGH
- **Issue**: API endpoints accept arbitrary request bodies without validation
- **Location**: `server.js` POST routes
- **Risk**: Malformed data could crash services or cause unexpected behavior
- **Recommendation**: Add request validation middleware (e.g., Joi, Zod)

### 3. Silent Error Handling
- **Severity**: MEDIUM
- **Issue**: Multiple catch blocks swallow errors without logging or recovery
- **Location**: `server.js`, `frontend/pages/index.js`
- **Risk**: Failures go unnoticed, debugging becomes difficult
- **Recommendation**: Implement structured error logging and alerting

### 4. No Database
- **Severity**: MEDIUM
- **Issue**: Agent state stored in JSON files, no persistent data layer
- **Location**: `core/agent_registry.js`
- **Risk**: Data loss on restart, no concurrent access safety
- **Recommendation**: Add SQLite/PostgreSQL for production use

### 5. Placeholder Logic
- **Severity**: MEDIUM
- **Issue**: `calculateIndicators()` uses `Math.random()` for momentum
- **Location**: `core/agent_brain.js:67`
- **Risk**: Recommendations not based on real analysis
- **Recommendation**: Implement actual technical indicators

### 6. No Rate Limiting
- **Severity**: MEDIUM
- **Issue**: API endpoints have no rate limiting
- **Location**: `server.js`
- **Risk**: Service abuse, API quota exhaustion
- **Recommendation**: Add express-rate-limit middleware

### 7. Hardcoded Admin ID
- **Severity**: LOW
- **Issue**: Telegram bot admin ID hardcoded in source
- **Location**: `telegram/launcher_bot.js:9`
- **Risk**: Requires code change to modify admin
- **Recommendation**: Move to environment variable

### 8. No Authentication for API
- **Severity**: HIGH
- **Issue**: REST API endpoints have no authentication
- **Location**: `server.js`
- **Risk**: Unauthorized access to agent management
- **Recommendation**: Add API key or JWT authentication

### 9. Frontend Title Mismatch
- **Severity**: LOW
- **Issue**: Dashboard title says "CLAWPUMP x BAGS" but project is "BAGS Agent Platform"
- **Location**: `frontend/pages/index.js:59`
- **Risk**: Brand confusion
- **Recommendation**: Update to consistent branding

### 10. No CORS Configuration
- **Severity**: LOW
- **Issue**: CORS enabled for all origins
- **Location**: `server.js:14`
- **Risk**: Potential cross-origin attacks
- **Recommendation**: Restrict to known frontend origins

## Performance Concerns

- **Polling Interval**: Frontend polls every 5 seconds — may cause unnecessary load
- **No Caching**: API responses not cached, repeated identical requests
- **Single-threaded**: Node.js event loop could block on long-running operations

## Security Summary

| Concern | Severity | Status |
|---------|----------|--------|
| Exposed secrets | HIGH | Needs immediate attention |
| No API auth | HIGH | Needs implementation |
| No input validation | HIGH | Needs implementation |
| Silent errors | MEDIUM | Should fix |
| No database | MEDIUM | Plan for migration |
| Placeholder logic | MEDIUM | Replace with real analysis |
| No rate limiting | MEDIUM | Add middleware |
| Hardcoded admin | LOW | Move to env |
| Brand mismatch | LOW | Update title |
| Open CORS | LOW | Restrict origins |

---
*Last updated: 2026-04-02 after codebase mapping*