# Bags Agent Platform

## What This Is

A production-grade AI Agent Platform for the Bags ecosystem on Solana. It enables users to deploy autonomous AI agents that analyze token markets, execute trading strategies, and manage portfolios — all controlled via Telegram and a modern web dashboard with 3D graphics.

## Core Value

AI agents that autonomously analyze Bags ecosystem tokens and provide actionable trading recommendations — requiring explicit user confirmation before any financial action.

## Requirements

### Validated

- ✓ Express.js backend API server with health and token endpoints — existing
- ✓ Next.js frontend dashboard with 3D graphics and live market data — existing
- ✓ Telegram bot with admin verification and fleet commands — existing
- ✓ Bags.fm API v2 integration for token data and launches — existing
- ✓ Solana blockchain payment verification — existing
- ✓ Ollama local AI provider integration — existing
- ✓ Agent registry with JSON file persistence — existing
- ✓ Autonomous agent brain loop (collect → analyze → recommend) — existing
- ✓ Python master protocol launcher with auto-restart — existing
- ✓ Skill loader with git-based plugin synchronization — existing

### Active

- [ ] Complete modular skill system with dynamic loading from GitHub/skills.sh/cryptoskill.org
- [ ] Token launch analysis tools with real-time market scanning
- [ ] Full Bags API integrations (all endpoints, launch workflows, trading flows)
- [ ] Complete Telegram control interface with all specified commands
- [ ] Web dashboard with all panels (agent creation, skills, launch monitoring, analytics, portfolio, registry, marketplace)
- [ ] Agent registry where external agents can connect and register
- [ ] Marketplace where agents can post actions and comments
- [ ] Analytics and monitoring system
- [ ] Floating AI assistant on website connected to Ollama
- [ ] Secure secret storage and rate limiting
- [ ] Comprehensive error handling and logging
- [ ] Transaction validation for all financial actions
- [ ] Database persistence (replace JSON file storage)
- [ ] API authentication and authorization
- [ ] Input validation middleware
- [ ] Test suite with unit and integration tests
- [ ] Installation walkthrough documentation
- [ ] Vercel deployment compatibility

### Out of Scope

- Copying Clawpump implementation — recreate equivalent architecture using Bags APIs only
- Auto-execution of financial transactions — all require explicit user confirmation
- Mobile app — web-first approach

## Context

### Current State
- Backend: Node.js/Express server running on port 3001
- Frontend: Next.js dashboard running on port 3000 with Three.js 3D graphics
- AI: Ollama integration with deepseek-v3.2:cloud model
- Blockchain: Solana mainnet-beta RPC connection
- Bot: Telegram bot with admin-only access
- Storage: JSON files for agent configs, no database

### Architecture Gaps
- No formal test framework
- No input validation on API endpoints
- No rate limiting or API authentication
- Placeholder momentum calculation in agent brain
- Hardcoded secrets in .env file
- Silent error handling in multiple places

### Documentation Sources
- Bags.fm API docs: https://docs.bags.fm/
- Solana AI ecosystem: https://github.com/solana-foundation/awesome-solana-ai
- Architecture reference: https://clawpump.tech/docs
- OpenClaw agent ecosystem: Multiple GitHub repos for skill patterns
- Ollama provider: https://docs.ollama.com/
- Skill registries: skills.sh, cryptoskill.org

## Constraints

- **Tech Stack**: Node.js backend, Next.js frontend, Python orchestration, Ollama AI — existing investments to preserve
- **Blockchain**: Solana only — Bags ecosystem is Solana-native
- **AI Provider**: Ollama local models — must support offline operation
- **Security**: All financial actions require explicit user confirmation — non-negotiable
- **Deployment**: Must be deployable to Vercel without errors

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Modular agent architecture | Enables extensible skill system and external agent registration | ✓ Good — existing foundation |
| Ollama for AI | Local control, no API costs, privacy | ✓ Good — implemented |
| Telegram + Web dual interface | Meet users where they are | ✓ Good — both implemented |
| JSON file storage | Simple for prototype | ⚠️ Revisit — needs database for production |
| No auto-trading | Security and user control | ✓ Good — core principle |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-02 after initialization with codebase mapping*