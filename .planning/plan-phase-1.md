# Phase 1 Plan: Foundation & Security

**Phase:** 1 — Foundation & Security
**Goal:** Users can register agents that perform real AI analysis of Bags tokens with secure, validated infrastructure
**Requirements:** BAGS-01, BAGS-02, BAGS-05, AGNT-01, AGNT-02, AGNT-03, AIPR-01, SOLN-01, SOLN-02, SECU-01, SECU-04, SECU-05, ANLY-03

## Plans

### Plan 1: Fix Bags API v2 Integration (BAGS-01, BAGS-02, BAGS-05)
**Priority:** P0 — Critical
**Status:** ✅ COMPLETE

**Tasks:**
1. Rewrite bags/bags_api.js with correct Bags API v2 endpoints
2. Implement token launch feed endpoint (GET /token-launch/feed)
3. Implement token launch workflow (create-token-info → create-config → create-launch-transaction → send-transaction)
4. Implement fee share configuration creation
5. Implement agent authentication flow (auth-init → auth-login)
6. Implement partner configuration
7. Add proper error handling with Bags API error format
8. Add rate limit tracking from response headers
9. Implement trade quote and swap endpoints
10. Implement claimable positions and fee claiming

**Files to modify:**
- bags/bags_api.js (complete rewrite)

**Success criteria:**
- All Bags API v2 endpoints work correctly
- Token launch flow follows official documentation
- Error handling matches Bags API format
- Rate limit headers are tracked

---

### Plan 2: Implement Solana Integration (SOLN-01, SOLN-02)
**Priority:** P0 — Critical
**Status:** ✅ COMPLETE

**Tasks:**
1. Create solana/solana_api.js with wallet connection
2. Implement balance checking
3. Implement transaction signature verification
4. Implement payment verification for launch fees
5. Create wallet management utilities
6. Add Solana RPC error handling

**Files to create:**
- solana/solana_api.js
- wallet/wallet_manager.js

**Success criteria:**
- Wallet connection works
- Transaction verification is accurate
- Payment verification blocks unauthorized launches

---

### Plan 3: Fix Ollama Provider (AIPR-01)
**Priority:** P0 — Critical
**Status:** Ready to execute

**Tasks:**
1. Rewrite providers/providers.py with correct Ollama API usage
2. Use /api/chat instead of /api/generate
3. Add structured output support (JSON format)
4. Add tool calling support
5. Add model listing and management
6. Add streaming support
7. Add model routing based on task type
8. Add fallback handling when Ollama is unavailable
9. Fix typos and improve error messages

**Files to modify:**
- providers/providers.py (complete rewrite)

**Success criteria:**
- Chat API works with structured outputs
- Tool calling is functional
- Model routing works correctly
- Fallback handling prevents crashes

---

### Plan 4: Fix Agent Brain & Registry (AGNT-01, AGNT-02, AGNT-03)
**Priority:** P0 — Critical
**Status:** Ready to execute

**Tasks:**
1. Fix agent_brain.js with real indicator calculations
2. Remove Math.random() placeholder
3. Implement proper Ollama integration with structured outputs
4. Add configurable loop interval
5. Add error recovery and retry logic
6. Expand agent_registry.js with full metadata
7. Add agent config validation
8. Add external agent registration API
9. Implement confirmation queue for user approval
10. Block all financial actions until user confirms

**Files to modify:**
- core/agent_brain.js (major rewrite)
- core/agent_registry.js (expand)

**Success criteria:**
- Agent brain uses real market indicators
- Recommendations require user confirmation
- Agent registry stores full metadata
- External agents can register

---

### Plan 5: Add Security Layer (SECU-01, SECU-04, SECU-05)
**Priority:** P0 — Critical
**Status:** Ready to execute

**Tasks:**
1. Add rate limiting middleware to all API endpoints
2. Add input validation middleware
3. Add API authentication for backend endpoints
4. Implement transaction validation before financial actions
5. Add comprehensive error handling and logging
6. Move secrets to environment variables (already done, but verify)
7. Add .env to .gitignore
8. Add request logging middleware
9. Add security headers middleware

**Files to create:**
- middleware/rate_limiter.js
- middleware/validation.js
- middleware/auth.js
- middleware/logger.js

**Files to modify:**
- server.js (add middleware)

**Success criteria:**
- All endpoints have rate limiting
- Input validation prevents bad data
- API authentication protects endpoints
- Comprehensive logging is in place

---

### Plan 6: Implement Health Monitoring (ANLY-03)
**Priority:** P1 — Important
**Status:** Ready to execute

**Tasks:**
1. Expand /api/health endpoint with detailed metrics
2. Add Bags API health check with response time
3. Add Ollama health check with model info
4. Add Telegram bot health check
5. Add Solana RPC health check
6. Add system metrics (uptime, memory, etc.)
7. Add health check endpoint for monitoring tools

**Files to modify:**
- server.js (expand health endpoint)

**Success criteria:**
- Health endpoint shows all component status
- Response times are tracked
- System metrics are included

---

## Execution Order

1. **Plan 5** (Security Layer) — Foundation must be secure first
2. **Plan 1** (Bags API) — Core data source must work
3. **Plan 2** (Solana) — Blockchain integration required for launches
4. **Plan 3** (Ollama) — AI provider must work for agent brain
5. **Plan 4** (Agent Brain & Registry) — Core functionality depends on above
6. **Plan 6** (Health Monitoring) — Monitoring after everything works

## Dependencies

- Plan 1 depends on: None (can start immediately)
- Plan 2 depends on: None (can start immediately)
- Plan 3 depends on: None (can start immediately)
- Plan 4 depends on: Plan 1, Plan 2, Plan 3
- Plan 5 depends on: None (can start immediately)
- Plan 6 depends on: Plan 1, Plan 2, Plan 3, Plan 4

## Parallel Execution

Plans 1, 2, 3, and 5 can run in parallel since they don't depend on each other.
Plan 4 must wait for Plans 1, 2, 3 to complete.
Plan 6 must wait for Plan 4 to complete.
