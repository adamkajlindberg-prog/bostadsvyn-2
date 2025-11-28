# AGENTS.md

This document provides essential information for AI agents working on the Bostadsvyn project.

## Project Overview

Bostadsvyn is a Swedish real estate platform built as a monorepo. The project consists of a production Next.js application (`apps/site`) and a proof-of-concept prototype (`lovable/`) that serves as the design reference.

## Tech Stack

### Main Application (`apps/site`)

- **Framework**: Next.js 16 with App Router
- **React**: Version 19.2.0
- **TypeScript**: Version 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (New York style) with Radix UI primitives
- **Authentication**: better-auth with BankID integration
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Image Storage**: Cloudflare R2 (S3-compatible) via `@bostadsvyn/images`
- **Caching**: Upstash Redis via `@bostadsvyn/cache`
- **AI SDK**: Vercel AI SDK with OpenAI and Google (Gemini) providers
- **Form Handling**: react-hook-form with zod validation
- **State Management**: Zustand
- **Package Manager**: Bun
- **Monorepo**: Turborepo
- **Linting/Formatting**: Biome
- **Environment Variables**: @t3-oss/env-nextjs

### Additional Libraries

- **Maps**: @vis.gl/react-google-maps
- **Payments**: Stripe via @better-auth/stripe
- **Email**: Resend
- **Notifications**: Sonner (toast notifications)
- **Icons**: Lucide React

## Package Organization

### Workspace Structure

```
bostadsvyn/
├── apps/
│   └── site/              # Main Next.js production application
├── packages/
│   ├── db/                # Database package with Drizzle ORM
│   ├── images/            # Image client for Cloudflare R2
│   ├── cache/             # Cache client for Upstash Redis
│   └── common/            # Shared utilities
└── lovable/               # POC/prototype - DESIGN REFERENCE ONLY
```

### Package Details

#### `apps/site`
The main production application. This is where all production code lives.

**Key Directories:**
- `src/app/`: Next.js App Router pages and API routes
- `src/components/`: React components organized by feature
- `src/lib/`: Utility functions, business logic, and AI helpers
- `src/auth/`: Authentication configuration and utilities
- `src/hooks/`: Custom React hooks
- `src/stores/`: Zustand state stores

#### `packages/db`
Database package using Drizzle ORM with PostgreSQL.

**Key Files:**
- `pg/schema/`: Database schema definitions
- `pg/.drizzle/`: Generated migration files
- `pg/connections/postgres.ts`: Database connection setup

**Usage:**
```typescript
import { db } from "db";
```

#### `packages/images`
Image client for Cloudflare R2 (S3-compatible storage).

**Exports:**
- `@bostadsvyn/images/image-client`: ImageClient class for upload/download
- `@bostadsvyn/images/mime-types`: MIME type utilities

**Usage:**
```typescript
import { ImageClient } from "@bostadsvyn/images/image-client";
```

#### `packages/cache`
Cache client abstraction for Upstash Redis.

**Exports:**
- `@bostadsvyn/cache`: Main cache client interface
- `@bostadsvyn/cache/upstash`: Upstash-specific implementation
- `@bostadsvyn/cache/ioredis`: ioredis implementation (alternative)

**Usage:**
```typescript
import { cache } from "@bostadsvyn/cache";
```

#### `lovable/`
**CRITICAL**: This is a proof-of-concept/prototype built with Vite + React. It serves **ONLY** as a design reference. The design, UI, and look-and-feel must match this POC exactly, but you must **NEVER** copy code from it directly.

**Tech Stack Differences:**
- Uses Vite instead of Next.js
- Uses Supabase instead of better-auth + PostgreSQL
- Uses shadcn "default" style instead of "new-york"
- Different routing (react-router-dom vs Next.js App Router)

## Critical Guidelines

### Design System

1. **Design Reference**: The design, UI, and look-and-feel must match `lovable/` POC exactly
2. **Component Style**: Use shadcn/ui "new-york" style (configured in `apps/site/components.json`)
3. **UI Components**: Always use shadcn/ui components from `apps/site/src/components/ui/`
4. **Never Copy Code**: Do not copy code from `lovable/` - only use it as a visual/design reference

### Tech Stack Rules

1. **Always use the production tech stack** from `apps/site`, NOT from `lovable/`
2. **Framework**: Next.js 16 with App Router (not Vite)
3. **Authentication**: better-auth (not Supabase Auth)
4. **Database**: Drizzle ORM + PostgreSQL (not Supabase)
5. **Styling**: Tailwind CSS 4 (not Tailwind CSS 3)

### Path Aliases

As defined in `apps/site/components.json`:

- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/hooks` → `src/hooks`
- `@/ui` → `src/components/ui`

### Package Imports

Use workspace protocol for internal packages:

```typescript
import { db } from "db";
import { ImageClient } from "@bostadsvyn/images/image-client";
import { cache } from "@bostadsvyn/cache";
```

## Development Practices

### Environment Variables

Environment variables are managed via `@t3-oss/env-nextjs` with validation:

- Client variables: `NEXT_PUBLIC_*`
- Server variables: All others
- Validation happens at build time and runtime

Key environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Upstash Redis connection URL
- `R2_*`: Cloudflare R2 credentials
- `AUTH_SECRET`: Authentication secret
- `OPENAI_API_KEY` / `GEMINI_API_KEY`: AI provider keys
- `STRIPE_*`: Stripe payment configuration

### Code Quality

- **Linting**: Biome (`bun run lint`)
- **Formatting**: Biome (`bun run format`)
- **Type Checking**: TypeScript strict mode
- **Package Management**: Bun workspaces

### Build System

- **Monorepo**: Turborepo for build orchestration
- **Build Command**: `bun run build` (runs turbo build)
- **Dev Command**: `bun run dev` (runs turbo dev)
- **Database Migrations**: `bun run db:push` (from root)

### Component Patterns

1. **Component Organization**: Components are organized by feature in `src/components/`
2. **UI Components**: Base shadcn/ui components live in `src/components/ui/`
3. **Server Components**: Default to Server Components in Next.js App Router
4. **Client Components**: Use `"use client"` directive when needed
5. **Form Handling**: Use react-hook-form with zod schemas

### Database

- **ORM**: Drizzle ORM
- **Schema Location**: `packages/db/pg/schema/`
- **Migrations**: Generated in `packages/db/pg/.drizzle/`
- **Studio**: `bun run db studio` (from packages/db)

### Authentication

- **Provider**: better-auth
- **Config**: `apps/site/src/auth/config.ts`
- **BankID**: Integrated for Swedish authentication
- **Session Management**: Server-side sessions with Redis cache adapter

### Image Handling

- **Storage**: Cloudflare R2 (S3-compatible)
- **Client**: `@bostadsvyn/images/image-client`
- **MIME Types**: Validated via `@bostadsvyn/images/mime-types`

### Caching

- **Provider**: Upstash Redis
- **Client**: `@bostadsvyn/cache`
- **Prefix**: All keys are prefixed (configured via `REDIS_PREFIX`)
- **TTL**: Support for time-based expiration

## Key Directories Reference

### `apps/site/src/app/`
Next.js App Router structure:
- `(pages)/`: Page routes
- `api/`: API route handlers
- `globals.css`: Global styles

### `apps/site/src/components/`
Feature-based component organization:
- `ui/`: shadcn/ui base components
- Feature folders: `property/`, `search/`, `auth/`, etc.

### `apps/site/src/lib/`
Business logic and utilities:
- `actions/`: Server actions
- `ai/`: AI-related utilities (embeddings, chunk generation)
- `utils.ts`: General utilities

### `packages/db/pg/schema/`
Database schema definitions (Drizzle schemas)

### `packages/db/pg/.drizzle/`
Generated migration files (do not edit manually)

## Important Notes

1. **Never use code from `lovable/` directly** - only use it as a design reference
2. **Always use the production tech stack** from `apps/site`
3. **Maintain consistency** with existing component patterns
4. **Follow shadcn/ui component structure** and patterns
5. **Use TypeScript strictly** - avoid `any` types
6. **Server Components by default** - only use Client Components when necessary
7. **Environment validation** - all env vars are validated at build time
8. **Workspace packages** - use `workspace:*` for internal package dependencies

## Common Commands

```bash
# Development
bun run dev              # Start dev server
bun run dev-site         # Start only site app

# Building
bun run build            # Build all packages

# Database
bun run db:push          # Push schema changes to database
bun -F db studio         # Open Drizzle Studio

# Code Quality
bun run lint             # Lint all packages
bun run format           # Format all packages
bun run type-check       # Type check all packages

# Authentication
bun run auth:generate    # Generate auth schema
```

## Design Reference Workflow

When implementing features that exist in `lovable/`:

1. **Examine** the design and UI in `lovable/`
2. **Identify** the visual patterns, layouts, and interactions
3. **Implement** using the production tech stack from `apps/site`
4. **Use** shadcn/ui components with "new-york" style
5. **Match** the look-and-feel exactly, but with production code

Remember: `lovable/` is a design reference, not a code reference.

