# ADR 001: Monorepo with npm Workspaces

## Status
Accepted

## Context
OnboardAI has 5 backend services, 2 frontends, and 2 shared packages.
As a solo developer, cross-service refactoring must be fast and type-safe.

## Decision
Use a monorepo managed with npm workspaces.
Shared types in @onboardai/types, shared utilities in @onboardai/utils.

## Consequences
- Single git repo, single PR, atomic commits across services
- Shared TypeScript types prevent API contract drift between services
- All services visible in one IDE window — faster context switching
- Trade-off: npm install at root installs everything (acceptable for dev)
