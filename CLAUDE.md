# CLAUDE.md — Booking API

Source of truth for Claude Code sessions on this project. Read this before any task.

---

## Project Overview

REST API for a booking/reservation system built with NestJS. Exposes endpoints under `/api/v1` and serves interactive documentation at `/docs`.

Modules: **auth**, **users**, **spaces**, **scheduling**, **moving** (equipment movement log).

---

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js LTS |
| Framework | NestJS 10 |
| ORM | Drizzle ORM 0.45+ (PostgreSQL dialect) |
| Validation | Zod (ZodValidationPipe global + ZodSerializerInterceptor) |
| Auth | Passport JWT (`@nestjs/passport`, `passport-jwt`) + bcrypt (10 rounds) |
| Migrations | Drizzle Kit (`npm run db:generate` / `db:migrate` / `db:seed`) |
| Test runner | Vitest 4 with globals enabled |
| Docs | @nestjs/swagger 8 + swagger-ui-express |
| Containerization | Docker + Docker Compose |

---

## Strict Code Style

These rules are non-negotiable. Every file must comply.

- **No semicolons** — `semi: false`
- **Single quotes** — `singleQuote: true`
- **2-space indentation**
- **Strong TypeScript typing** — no `any`, no implicit `any`, explicit return types on all public methods

---

## Infrastructure

### Database — PostgreSQL 15

```
Host:     localhost:5432
User:     booking
Password: booking
Database: booking (dev) / booking_test (test)
```

Connection strings:
- Dev:  `postgresql://booking:booking@localhost:5432/booking`
- Test: `postgresql://booking:booking@localhost:5432/booking_test`

Managed via Docker Compose (`services.db`). The `api` service waits for the DB healthcheck before starting.

### Environment Variables

| Variable | Dev | Test |
|---|---|---|
| `DATABASE_URL` | `postgresql://booking:booking@localhost:5432/booking` | `postgresql://booking:booking@localhost:5432/booking_test` |
| `PORT` | `3000` | — |
| `NODE_ENV` | — | `test` |
| `JWT_SECRET` | (from env) | `test-jwt-secret` |

### API

- Global prefix: `/api/v1`
- Swagger UI: `http://localhost:3000/api/v1/docs` (Bearer auth enabled)
- Port: `3000` (overridable via `PORT` env var)
- CORS: enabled for all origins, methods GET/HEAD/PUT/PATCH/POST/DELETE

### Seed

- Script: `src/database/seed.ts` — run with `npm run db:seed`
- Creates ADMIN user `admin@booking.com` / `admin123` if it doesn't exist (idempotent via `onConflictDoNothing`)

### Tests

- Unit specs: `src/**/*.spec.ts` — run with `npm test`
- E2E specs: `src/**/*.e2e-spec.ts` — run with `npm run test:e2e`
- SWC transformer active for decorator metadata support
- E2E runs sequentially (no file parallelism); global setup in `test/global-setup-e2e.ts`

---

## Directory Structure

```
booking/
├── src/
│   ├── common/
│   │   ├── dto/base.dto.ts          # Base DTO (UUID, timestamps)
│   │   └── pipes/zod-validation.pipe.ts
│   ├── database/
│   │   ├── database.module.ts
│   │   ├── drizzle.provider.ts
│   │   ├── seed.ts                  # Admin user seed (npm run db:seed)
│   │   └── schema/
│   │       ├── index.ts             # Re-exports all schemas
│   │       ├── users.schema.ts
│   │       ├── spaces.schema.ts
│   │       ├── equipments.schema.ts
│   │       ├── moving-equipment.schema.ts
│   │       ├── scheduling.schema.ts
│   │       └── refresh-tokens.schema.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── dto/
│   │   │   ├── validators/
│   │   │   ├── strategies/jwt.strategy.ts
│   │   │   ├── guards/             # JwtAuthGuard, RolesGuard
│   │   │   └── decorators/        # @CurrentUser(), @Roles()
│   │   ├── users/
│   │   ├── spaces/
│   │   ├── scheduling/
│   │   └── moving/
│   ├── app.module.ts
│   └── main.ts
├── drizzle/                        # Generated migration files + snapshots
├── test/                           # E2E global setup
├── prompts/                        # Claude Code prompt templates
├── drizzle.config.ts               # Schema: src/database/schema/index.ts
├── nest-cli.json                   # Swagger compiler plugin enabled
├── vitest.config.ts
├── vitest.config.e2e.ts
├── docker-compose.yml
└── CLAUDE.md
```

Each feature module follows the pattern:
```
<feature>/
├── <feature>.module.ts
├── controllers/<feature>.controller.ts
├── services/<feature>.service.ts
├── repositories/<feature>.repository.ts
├── dto/<feature>.dto.ts
├── validators/<feature>.validator.ts
├── specs/<feature>.service.spec.ts
└── tests/<feature>.e2e-spec.ts
```

---

## Database Schema

### `users`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK, default random |
| `name` | text | required |
| `email` | text | unique, required |
| `passwordHash` | text | required |
| `role` | enum | `ADMIN` \| `USER` — default `USER` |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

### `spaces`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `name` | varchar(255) | required |
| `description` | text | nullable |
| `status` | enum | `active` \| `maintenance` \| `inactive` — default `active` |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

### `equipments`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `name` | varchar(255) | required |
| `description` | text | nullable |
| `manufacturer` | varchar(100) | nullable |
| `model` | varchar(100) | nullable |
| `serialNumber` | varchar(100) | unique, required |
| `category` | varchar(100) | nullable |
| `conservationStatus` | enum | `new` \| `good` \| `regular` \| `maintenance` \| `downloaded` — default `new` |
| `spaceId` | uuid | FK → spaces, nullable |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

### `scheduling`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `userId` | uuid | FK → users, required |
| `spaceId` | uuid | FK → spaces, required |
| `activityDescription` | text | required |
| `schedulingDate` | date | required |
| `startTime` | time | required |
| `endTime` | time | required |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

### `moving_equipment`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `equipmentId` | uuid | FK → equipments, required |
| `userId` | uuid | FK → users, required |
| `originSpaceId` | uuid | FK → spaces, nullable |
| `destinationSpaceId` | uuid | FK → spaces, nullable |
| `movementType` | enum | `transfer` \| `maintenance` \| `loan` \| `write-off`, required |
| `description` | text | nullable |
| `movementDate` | timestamp | default now |
| `createdAt` | timestamp | default now |

### `refresh_tokens`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `userId` | uuid | FK → users (cascade delete), required |
| `tokenHash` | text | unique, required |
| `expiresAt` | timestamp | required |
| `createdAt` | timestamp | |

---

## API Endpoints

### Auth — `/api/v1/auth`

| Method | Path | Guard | Body | Response | Notes |
|---|---|---|---|---|---|
| POST | `/register` | — | `RegisterDto` | `AuthTokensDto` | role defaults to USER |
| POST | `/login` | — | `LoginDto` | `AuthTokensDto` | |
| POST | `/refresh` | — | `RefreshDto` | `AuthTokensDto` | rotates refresh token |
| POST | `/logout` | — | `RefreshDto` | 204 | invalidates refresh token |
| GET | `/me` | JWT | — | `MeResponseDto` | returns current user |

**Auth flow:**
- JWT expiry: 15 minutes
- Refresh token expiry: 7 days, stored as SHA256 hash in DB
- JWT payload: `{ sub: userId, email, role }`

### Users — `/api/v1/users`

| Method | Path | Guard | Body | Response |
|---|---|---|---|---|
| GET | `/` | — | — | `UserResponseDto[]` |
| GET | `/:id` | — | — | `UserResponseDto` |
| PATCH | `/:id` | — | `UpdateUserDto` | `UserResponseDto` |
| DELETE | `/:id` | — | — | 204 |

### Spaces — `/api/v1/spaces`

All routes require JWT. Write routes require `ADMIN` role.

| Method | Path | Roles | Body | Response |
|---|---|---|---|---|
| POST | `/` | ADMIN | `CreateSpaceDto` | `SpaceResponseDto` |
| GET | `/` | any | — | `SpaceResponseDto[]` |
| GET | `/:id` | any | — | `SpaceResponseDto` |
| PATCH | `/:id` | ADMIN | `UpdateSpaceDto` | `SpaceResponseDto` |
| DELETE | `/:id` | ADMIN | — | 204 |

### Scheduling — `/api/v1/scheduling`

All routes require JWT.

| Method | Path | Body | Response | Notes |
|---|---|---|---|---|
| POST | `/` | `CreateSchedulingDto` | `SchedulingResponseDto` | conflict detection; userId from JWT |
| GET | `/` | — | `SchedulingResponseDto[]` | includes `spaceName`, `userName` (via joins) |
| GET | `/:id` | — | `SchedulingResponseDto` | |
| DELETE | `/:id` | — | 204 | |

**Conflict detection:** rejects if another scheduling exists for the same space/date with overlapping time range.

**CreateSchedulingDto fields:**
- `spaceId` — uuid
- `activityDescription` — string (min 1)
- `schedulingDate` — string `YYYY-MM-DD`
- `startTime` — string `HH:mm`
- `endTime` — string `HH:mm` (must be after `startTime`)

### Moving (Equipment Movement) — `/api/v1/moving`

All routes require JWT. Write/delete require `ADMIN` role.

| Method | Path | Roles | Body | Response | Notes |
|---|---|---|---|---|---|
| POST | `/` | any (JWT) | `CreateMovementDto` | `MovementResponseDto` | userId from JWT; transfer type requires destinationSpaceId |
| GET | `/` | any | — | `MovementResponseDto[]` | includes `equipmentName`, `originSpaceName`, `destinationSpaceName` |
| GET | `/:id` | any | — | `MovementResponseDto` | |
| PATCH | `/:id` | ADMIN | `UpdateMovementDto` | `MovementResponseDto` | |
| DELETE | `/:id` | ADMIN | — | 204 | |

**Movement types:** `transfer` | `maintenance` | `loan` | `write-off`

---

## Authentication & Authorization

- **`JwtAuthGuard`** — validates Bearer token; applied per-route or per-controller
- **`RolesGuard`** — checks `@Roles()` metadata against `user.role` from JWT payload
- **`@CurrentUser()`** — parameter decorator that injects `JwtPayload` into handlers
- **`@Roles(...roles)`** — sets role metadata consumed by RolesGuard

JWT strategy extracts token from `Authorization: Bearer <token>` header.

---

## Validation Pattern

Every module uses Zod schemas in `validators/<feature>.validator.ts`:
- Input schemas: applied via `ZodValidationPipe` (global)
- Output schemas: applied via `ZodSerializerInterceptor` (global, registered in AppModule)
- DTOs import from validators; no manual `@ApiProperty()` — Swagger plugin infers from schemas

---

## Golden Rules

1. **Never use semicolons.** If you generate code with semicolons, rewrite it immediately.
2. **Never use `any`.** Use `unknown` and narrow with type guards, or define a proper interface.
3. **Drizzle ORM only.** Do not introduce Prisma, TypeORM, or raw `pg` queries outside the repository layer.
4. **Repository pattern.** Services never import or call Drizzle directly — always go through a repository class.
5. **Vitest only.** Do not import from `jest` — use `vitest` globals (`describe`, `it`, `expect`, `vi`).
6. **Single quotes everywhere** — imports, strings, template literals where possible.
7. **Swagger plugin is active** — do not add `@ApiProperty()` manually to DTOs; the `nest-cli.json` compiler plugin infers them automatically.
8. **Multi-table writes must be transactional** — propagate the Drizzle transaction handle as an optional parameter.
9. **Type safety with Drizzle** — use `$inferSelect` / `$inferInsert` for entity types; never hand-write DB row interfaces.
10. **Zod for all I/O** — every controller input and every serialized response must pass through a Zod schema.
