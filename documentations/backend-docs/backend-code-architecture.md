# Worker Backend Architecture (Clean Architecture on Cloudflare Workers)

> Canonical, **domain-agnostic** reference for structuring a Hono.js + Cloudflare Workers backend with clean architecture. Names below (`Resource`, `IResourceRepository`, `createXService`, …) are placeholders — substitute your own domain nouns. The patterns are stack-fixed (Hono + CF Workers + Drizzle + Zod) but business-logic-free, so this file can be dropped into any new Worker repo as the structural spec. Code blocks are **skeletons** (shapes/signatures), not full implementations.

---

## 1. Stack & Principles

- **Runtime**: Cloudflare Workers — `fetch` (HTTP) + `queue` (consumers) + Durable Objects (stateful/WebSocket) + R2 (objects) + KV (key-value).
- **HTTP framework**: Hono.js (`Hono<AppContext>`).
- **Persistence**: Drizzle ORM over an HTTP-capable Postgres driver (e.g. Neon serverless).
- **Validation**: Zod, applied at the HTTP boundary via `@hono/zod-validator`.
- **Language**: TypeScript, `strict: true`, ESM (`"type": "module"`).
- **Tests**: Vitest with mocked repository interfaces.

**The one rule — dependencies point inward:**

```
presentation ──▶ application ──▶ domain ◀── infrastructure
   (HTTP)         (use-cases)     (core)      (implements domain ports)
```

- `domain` depends on **nothing** (pure types + business rules).
- `application` depends on `domain` only (uses repository **interfaces**, never concrete classes).
- `infrastructure` depends on `domain` (it **implements** the interfaces) — never the reverse.
- `presentation` wires everything together per-request and exposes it over HTTP.

A layer never imports "outward". A use-case must not `import` a Drizzle repo class — only its domain interface.

---

## 2. Layer Map (`src/`)

```
src/
├── index.ts                         # Entry point: Hono app + ExportedHandler (fetch + queue)
│
├── domain/                          # Pure core — no external deps
│   ├── entities/        *.entity.ts            # State + behavior (e.g. Resource)
│   ├── value-objects/   *.vo.ts                # Immutable typed primitives (e.g. ResourceStatus)
│   ├── repositories/    *.repository.interface.ts  # Persistence PORTS (IResourceRepository)
│   └── errors/          *.error.ts             # Error hierarchy (BaseError → …)
│
├── application/                     # Orchestration — depends on domain only
│   ├── use-cases/       *.use-case.ts          # One workflow per class, single execute()
│   ├── dtos/            *.dto.ts               # Request/response shapes at the app boundary
│   ├── validators/      *.validator.ts         # Zod schemas
│   └── services/        *.ts                   # Pure, reusable cross-use-case logic
│
├── infrastructure/                  # Adapters — implement domain ports, call the outside world
│   ├── database/
│   │   ├── drizzle/     client.ts, schema.ts   # createDbClient(env), table defs
│   │   ├── repositories/ *.repository.ts       # implements IResourceRepository
│   │   └── migrations/                         # generated SQL
│   ├── services/        *.service.ts           # external HTTP API wrappers
│   ├── storage/         *.service.ts           # R2 wrappers
│   ├── queue/           *.service.ts, *.worker.ts  # producer + consumer
│   ├── websocket/                              # Durable Object + broadcaster
│   ├── webhooks/                               # outbound event emission
│   └── analytics/, email/, …                   # other integrations
│
├── presentation/                    # HTTP boundary
│   ├── routes/          index.ts, v1/*.route.ts   # router composition
│   ├── handlers/        *.handler.ts           # parse → call use-case → respond
│   ├── middleware/      *.ts                    # DI, auth, validation, errors
│   ├── websocket/       *.handler.ts           # upgrade handler
│   └── docs/                                    # OpenAPI/Scalar
│
├── config/              env.ts, constants.ts, permissions.ts
├── types/               common.ts, auth.ts, api.ts, …   # shared types, HttpStatusCode enum
└── utils/               id-generator.ts, pagination.ts, date.ts, validation.ts
```

---

## 3. Naming Conventions

| Layer | File pattern | Export pattern | Example |
|---|---|---|---|
| Domain entity | `*.entity.ts` | `class Resource` | `resource.entity.ts` → `Resource` |
| Domain value object | `*.vo.ts` | `class ResourceStatus` | `resource-status.vo.ts` → `ResourceStatus` |
| Repository port | `*.repository.interface.ts` | `interface IResourceRepository` | → `IResourceRepository` |
| Domain error | `*.error.ts` | `class XError extends DomainError` | `validation.error.ts` → `ValidationError` |
| Use-case | `*.use-case.ts` | `class XUseCase { execute() }` | `do-thing.use-case.ts` → `DoThingUseCase` |
| DTO | `*.dto.ts` | `interface XRequestDto` / `XResponseDto` | `do-thing.dto.ts` |
| Validator | `*.validator.ts` | `const XSchema = z.object(...)` | `resource.validator.ts` |
| Repository impl | `*.repository.ts` | `class XRepository implements IXRepository` | `resource.repository.ts` |
| Infra service | `*.service.ts` | `class XService` + `createXService(env)` | `r2.service.ts` |
| Queue consumer | `*.worker.ts` | `async function processX(batch, env)` | `resource-processor.worker.ts` |
| Route | `*.route.ts` | `const route = new Hono<Ctx>()` (default export) | `do-thing.route.ts` |
| Handler | `*.handler.ts` | `async function xHandler(c)` | `do-thing.handler.ts` |
| Middleware | `*.ts` | `async function x(c, next)` or factory | `validator.ts` |

Pattern: **`PascalCase` symbol ↔ `kebab-case.suffix.ts` file**. Interfaces for ports are `I`-prefixed.

---

## 4. Entry Point (`src/index.ts`)

```ts
const app = new Hono<AppContext>();

// Global middleware — ORDER MATTERS
app.use(contextStorage());          // 1. enables getEnv() anywhere via async context
app.use("*", cors({ /* origins, methods, headers, credentials */ }));  // 2.
app.use(contextInjector);           // 3. builds per-request DI container

app.get("/", (c) => c.json({ /* service metadata */ }));
app.get("/ws", websocketHandler);   // Durable Object upgrade

app.route("/", routes);             // mount all API routes

app.onError(onErrorHandler);        // any thrown error → JSON
app.notFound(notFoundHandler);      // 404 → JSON

// Cloudflare Worker handler: HTTP + Queue in one module
const handler: ExportedHandler<Env> = {
  fetch: (req, env, ctx) => app.fetch(req, env, ctx),
  queue: (batch, env) => processResource(batch as MessageBatch<QueueMessage>, env),
};

export default handler;
export { ResourceDurableObject };   // any Durable Object class must be re-exported here
```

The single Worker module serves HTTP **and** consumes queues. Durable Object classes are exported from the entry module so the runtime can bind them.

---

## 5. Dependency Injection (per-request container via middleware)

No global container, no service locator. Each request builds a fresh, fully-wired graph from `env`. Constructor injection everywhere → trivially testable.

```ts
// presentation/middleware/context-injector.ts
export interface AppContext {
  Bindings: Env;                                  // CF bindings (typed)
  Variables: {
    dependencies: Dependencies;                   // the container
    actor?: ActorVariable;                        // set later by auth middleware
  };
}

export interface Dependencies {
  // repositories (concrete, but typed by their interface at use-case boundary)
  resourceRepository: ResourceRepository;
  // infra services (factory return types)
  queueService: ReturnType<typeof createQueueService>;
  storageService: ReturnType<typeof createStorageService>;
  // use-cases grouped by audience
  useCases: {
    doThing: DoThingUseCase;
    getResource: GetResourceUseCase;
  };
  adminUseCases: { /* privileged-only workflows */ };
}

export async function contextInjector(c: Context<AppContext>, next: Next) {
  const env = c.env;
  const db = createDbClient(env);                 // 1. infra clients/factories
  const queueService = createQueueService(env);

  const resourceRepository = new ResourceRepository(db);   // 2. repositories

  const useCases = {                              // 3. wire use-cases from the above
    doThing: new DoThingUseCase(resourceRepository, queueService),
    getResource: new GetResourceUseCase(resourceRepository),
  };

  c.set("dependencies", { resourceRepository, queueService, useCases /* … */ });
  await next();
}
```

Handlers read the container: `const { useCases } = c.get("dependencies")`.

> Queue consumers run **without** a request context, so they build their own deps inline (see §10). Keep dependency construction cheap and stateless so both paths can do it.

---

## 6. Routing Structure (recursive composition)

```ts
// presentation/routes/index.ts        — root
routes.route("/v1", v1Routes);
routes.get("/health", healthHandler);

// presentation/routes/v1/index.ts     — version aggregator
v1Routes.route("/resources", resourceRoute);
v1Routes.route("/admin",     adminRoutes);

// presentation/routes/v1/resource.route.ts — feature router
const resourceRoute = new Hono<ActorAppContext>();
resourceRoute.post("/",        requireAuth, validateJson(CreateSchema), createHandler);
resourceRoute.get("/mine",     requireAuth, validateQuery(ListSchema),  listMineHandler);
resourceRoute.get("/:id",      optionalAuth, getHandler);
export default resourceRoute;
```

**Per-route middleware chaining**: `method(path, ...middleware, handler)`. Middleware runs left-to-right; the handler is last.

**Scoped-group guards** (for admin / role-gated trees) — apply auth + permission to a path prefix with `.use()`, and register **specific paths before parametric ones** to avoid `:id` swallowing literals:

```ts
adminRoutes.use("/resources/*", internalUserAuth);                       // authn for the whole tree
adminRoutes.use("/resources/*", requirePermission(PERMISSIONS.X_VIEW));  // authz for the whole tree
adminRoutes.get("/resources/stats", statsHandler);                       // literal — register first
adminRoutes.get("/resources/:id",   getOneHandler);                      // parametric — after
```

---

## 7. Middleware Catalog

All middleware lives in `presentation/middleware/`. Order in a chain: **auth → validation → handler**; errors are caught globally.

**Auth — the actor model.** Three actor classes resolved from a JWT (or absence of one):

| Class | Token | Context var | Typical guard |
|---|---|---|---|
| Anonymous | none | `actor` unset | `optionalAuth` |
| Authenticated | standard JWT | `actor: { actorType, id, … }` | `requireAuth` |
| Privileged | role JWT | `internalUser: { roleName, permissions[] }` | `internalUserAuth` + `requirePermission(...)` |

```ts
// Two entry styles for the same verification:
optionalAuth  // no token → continue as anonymous; invalid token → 401; valid → set actor
requireAuth   // no token → 401; otherwise as above
```

Auth middleware verifies the JWT, maps claims to a typed context variable, and `c.set(...)` it. Downstream code reads `c.get("actor")` / `c.get("internalUser")`. Support multiple secrets (e.g. primary + legacy) by trying each verifier in turn.

**Permission guard** (claim-based RBAC; must run *after* the role auth that populates `internalUser`):

```ts
export function requirePermission(...codes: PermissionCode[]) {
  return async (c: Context<InternalUserAppContext>, next: Next) => {
    const user = c.get("internalUser");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    if (user.roleName === "admin") return void (await next());   // admin short-circuit FIRST
    const missing = codes.filter((code) => !user.permissions.includes(code));
    if (missing.length) return c.json({ error: "Forbidden" }, 403);
    await next();
  };
}
```

> Convention: admin tokens carry an **empty** `permissions` array by design — so the `roleName === "admin"` short-circuit must come *before* the code check, or admins fail every gate. The same `hasPermission(user, code)` helper is reused inside handlers for response shaping (e.g. stripping PII a viewer isn't entitled to).

**Validation** (Zod via `@hono/zod-validator`, throws into the global error handler):

```ts
const makeHook = (target: "json" | "query" | "param") => (result) => {
  if (!result.success) throw new ValidationError(`Invalid ${target} payload`, { target, issues: result.error?.issues });
};
export const validateJson  = (s) => zValidator("json",  s, makeHook("json"));
export const validateQuery = (s) => zValidator("query", s, makeHook("query"));
export const validateParam = (s) => zValidator("param", s, makeHook("param"));
```

**Error handler** — see §11.

---

## 8. Request Flow

```
HTTP request
  │
  ├─ contextStorage()            global: async-context for getEnv()
  ├─ cors()                      global
  ├─ contextInjector             global: c.set("dependencies", …)
  │
  ├─ [route] auth middleware     c.set("actor" | "internalUser")        ──┐ throw → 401/403
  ├─ [route] requirePermission   gate on claims                          │
  ├─ [route] validateJson/Query  Zod parse                              ──┤ throw → ValidationError(400)
  │                                                                       │
  ├─ handler                     read deps + actor + validated input     │
  │     └─ use-case.execute()    orchestrate                             │
  │           ├─ entity methods  business rules                        ──┤ throw → DomainError
  │           ├─ repository      persistence (via interface)            │  throw → InfrastructureError
  │           └─ services/queue  side effects                            │
  │     └─ c.json(dto, status)   typed response                         │
  │                                                                       │
  └─ app.onError(onErrorHandler) ◀────────── any thrown error ───────────┘
        formatError(err) + getStatusCode(err) → JSON { error, message, details, timestamp }
```

---

## 9. Handler Pattern

Thin adapter: extract → delegate → respond. No business logic.

```ts
export async function doThingHandler(c: Context<ActorAppContext>): Promise<Response> {
  const { useCases } = c.get("dependencies");
  const actor = c.get("actor") ?? null;
  const body  = await c.req.json<DoThingRequestDto>();   // already Zod-validated by middleware

  const result = await useCases.doThing.execute(body, actor);

  // fire-and-forget side effects (analytics, logging) must not block the response:
  c.executionCtx.waitUntil(emitTelemetry(result));

  return c.json<DoThingResponseDto>(result, 201);
}
```

Read query/params via `c.req.query("k")` / `c.req.param("id")`. Return typed `c.json<Dto>(payload, status)`.

---

## 10. Use-Case Pattern

One class = one workflow. Constructor takes **interfaces**; one `execute()`.

```ts
export class DoThingUseCase {
  constructor(
    private readonly resourceRepository: IResourceRepository,   // domain port, not the Drizzle class
    private readonly queueService: { enqueue(r: Resource): Promise<void> },
  ) {}

  async execute(req: DoThingRequestDto, actor: ActorVariable | null): Promise<DoThingResponseDto> {
    // 1. guard / business rules (throw domain errors)
    if (!actor) throw new UnauthorizedError();
    // 2. build entity via factory
    const resource = Resource.create(generateId("res"), /* … */);
    // 3. persist
    await this.resourceRepository.save(resource);
    // 4. async side effects
    await this.queueService.enqueue(resource);
    // 5. map entity → response DTO
    return { id: resource.id, status: resource.status.toString(), createdAt: resource.createdAt.toISOString() };
  }
}
```

Cross-use-case pure logic (no I/O) goes in `application/services/*.ts` as plain functions, e.g. `computeAvailability(params)`, `resolveTier(repoA, repoB, …)` — unit-tested in isolation.

---

## 11. Domain — Entities & Value Objects

**Value object** — immutable, private constructor, static factories, query methods, `equals`:

```ts
export class ResourceStatus {
  private constructor(private readonly value: ResourceStatusType) {}

  static pending()   { return new ResourceStatus(RESOURCE_STATUS.PENDING); }
  static completed() { return new ResourceStatus(RESOURCE_STATUS.COMPLETED); }
  static fromString(v: string) { /* validate ∈ RESOURCE_STATUS */ return new ResourceStatus(v as ResourceStatusType); }

  toString() { return this.value; }
  isFinished() { return this.isCompleted() || this.isFailed(); }
  equals(o: ResourceStatus) { return this.value === o.value; }
}
```

**Entity** — state + behavior + persistence mappers (`create` / `toObject` / `fromObject`):

```ts
export class Resource {
  constructor(
    public readonly id: string,
    public status: ResourceStatus,        // value object, not a raw string
    public progress?: number,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  // behavior mutates state + enforces invariants (throws on violation)
  complete(): void { this.status = ResourceStatus.completed(); this.updatedAt = new Date(); }
  updateProgress(p: number): void {
    if (p < 0 || p > 100) throw new ValidationError("Progress must be 0–100", { p });
    this.progress = p;
  }

  static create(id: string /* … */): Resource { return new Resource(id, ResourceStatus.pending()); }
  toObject(): Record<string, unknown> { return { id: this.id, status: this.status.toString(), createdAt: this.createdAt.toISOString() }; }
  static fromObject(d: Record<string, any>): Resource { return new Resource(d.id, ResourceStatus.fromString(d.status), d.progress, new Date(d.createdAt), new Date(d.updatedAt)); }
}
```

Entities never import infrastructure. `toObject`/`fromObject` are the only place row-shape leaks in, keeping the entity DB-agnostic.

---

## 12. Repository Pattern

**Port** in `domain/repositories/` (the application codes against this):

```ts
export interface IResourceRepository {
  save(resource: Resource): Promise<void>;
  findById(id: string): Promise<Resource | null>;
  list(filters: ListFilters): Promise<PaginatedResult<Resource>>;
  countSince(scopeId: string, since: Date): Promise<number>;
}
```

**Adapter** in `infrastructure/database/repositories/` (Drizzle), constructor-injected `DbClient`, maps rows ↔ entities:

```ts
export class ResourceRepository implements IResourceRepository {
  constructor(private readonly db: DbClient) {}

  async save(resource: Resource): Promise<void> {
    const row = resource.toObject();
    await this.db.insert(resources).values(row)
      .onConflictDoUpdate({ target: resources.id, set: { /* mutable cols */ } });   // upsert
  }

  async findById(id: string): Promise<Resource | null> {
    const row = await this.db.query.resources.findFirst({ where: eq(resources.id, id) });
    return row ? Resource.fromObject(row) : null;
  }
}
```

**Client + schema:**

```ts
// infrastructure/database/drizzle/client.ts
export type DbClient = ReturnType<typeof createDbClient>;
export function createDbClient(env: Env) {
  const sql = neon(env.DATABASE_URL);      // HTTP driver — Workers-compatible
  return drizzle(sql, { schema });
}
```

- `schema.ts` holds table defs + indexes. If the worker owns a subset of a shared DB, scope migrations to its own schema (`schemaFilter`) and treat foreign tables as read-only stubs.
- Migrations generated by drizzle-kit into `infrastructure/database/migrations/`.

---

## 13. External Service Pattern

Wrapper class + `createXService(env)` factory. Inject config (URLs, secrets) via constructor. **Degrade, don't crash** on non-critical failures.

```ts
export class ExternalApiService {
  constructor(private readonly baseUrl: string | undefined, private readonly secret: string | undefined) {}

  async lookup(id: string): Promise<Info | null> {
    try {
      const res = await fetch(`${this.baseUrl}/…`, { headers: { authorization: `Bearer ${this.secret}` } });
      return res.ok ? await res.json() : null;
    } catch (err) {
      console.error("[ExternalApiService] lookup failed", err);
      return null;                          // caller falls back to a default
    }
  }
}
export function createExternalApiService(env: Env) {
  return new ExternalApiService(env.EXTERNAL_API_URL, env.INTERNAL_SERVICE_SECRET);
}
```

Same shape for storage (`createStorageService(env)` wrapping an R2 bucket: `uploadObject`, `getObjectUrl`, `getSignedUrl`, `exists`) and analytics. Critical services may throw `InfrastructureError`; best-effort ones log-and-return-null.

---

## 14. Async / Queue Pattern

**Producer** (called from a use-case):

```ts
export class QueueService {
  constructor(private readonly queue: Queue) {}
  async enqueue(r: Resource): Promise<void> {
    await this.queue.send({ resourceId: r.id, timestamp: Date.now() } satisfies QueueMessage);
  }
  async enqueueBatch(rs: Resource[]): Promise<void> {
    await this.queue.sendBatch(rs.map((r) => ({ body: { resourceId: r.id, timestamp: Date.now() } })));
  }
}
export const createQueueService = (env: Env) => new QueueService(env.RESOURCE_QUEUE);
```

**Consumer** (`*.worker.ts`, invoked from the `queue` export). No request context → **build its own deps**. Ack on success; leave unacked to retry:

```ts
export async function processResource(batch: MessageBatch<QueueMessage>, env: Env): Promise<void> {
  const db = createDbClient(env);
  const repo = new ResourceRepository(db);

  for (const msg of batch.messages) {
    try {
      const resource = await repo.findById(msg.body.resourceId);
      if (!resource) { msg.ack(); continue; }     // unrecoverable → ack to drop
      // … do work, persist, emit progress …
      msg.ack();                                   // success
    } catch (err) {
      console.error("process failed", msg.body.resourceId, err);
      // do NOT ack → Workers redelivers up to max_retries, then DLQ
    }
  }
}
```

**Outbound webhook emission** — idempotent insert + queue nudge, best-effort (never breaks the business path):

```ts
async emit(input: EmitInput): Promise<void> {
  try {
    const idempotencyKey = [input.eventType, input.resourceId, input.discriminator].filter(Boolean).join(":");
    const inserted = await this.db.insert(events)
      .values({ id: generateId("evt"), ...input, idempotencyKey })
      .onConflictDoNothing({ target: [events.scopeId, events.idempotencyKey] })   // dedupe
      .returning({ id: events.id });
    const row = inserted[0];
    if (row && this.env.EVENTS_QUEUE) {
      const nudge = this.env.EVENTS_QUEUE.send({ eventId: row.id });
      this.ctx ? this.ctx.waitUntil(nudge) : await nudge;   // request ctx → waitUntil; queue ctx → await
    }
  } catch (err) {
    console.error("[EMIT_FAILED]", err);                     // swallow — caller must not fail
  }
}
```

**`wrangler.toml` bindings** (per environment block `[env.<name>]`):

```toml
[[env.production.queues.producers]]   # send side
binding = "RESOURCE_QUEUE"
queue   = "resource-queue-production"

[[env.production.queues.consumers]]   # receive side
queue = "resource-queue-production"
max_batch_size = 15
max_batch_timeout = 3
max_retries = 3
dead_letter_queue = "resource-dlq-production"

[[env.production.durable_objects.bindings]]
name = "RESOURCE_DO"
class_name = "ResourceDurableObject"

[[env.production.r2_buckets]]
binding = "OBJECTS_BUCKET"
bucket_name = "objects-production"

[[env.production.kv_namespaces]]
binding = "MAPPING_KV"
id = "<namespace-id>"

[[migrations]]
tag = "v1"
new_classes = ["ResourceDurableObject"]
```

---

## 15. Error Hierarchy

```ts
// domain/errors/base.error.ts
export abstract class BaseError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly timestamp: string;
  public readonly details?: unknown;
  constructor(message: string, statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR, details?: unknown) {
    super(message);
    this.name = this.constructor.name;        // subclass name surfaces in the response
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
  toJSON() { return { error: this.name, message: this.message, statusCode: this.statusCode, timestamp: this.timestamp, details: this.details }; }
}

export abstract class DomainError         extends BaseError {}   // business-rule violations
export abstract class ApplicationError    extends BaseError {}   // use-case failures
export abstract class InfrastructureError extends BaseError {}   // external/DB failures
```

Concrete subclasses fix their status code, e.g.:

| Class | Base | Status |
|---|---|---|
| `ValidationError`, `MissingFieldError`, `InvalidFieldError` | `DomainError` | 400 |
| `UnauthorizedError` | `ApplicationError` | 401 |
| `ForbiddenError` | `ApplicationError` | 403 |
| `NotFoundError`, `ResourceNotFoundError` | `DomainError` | 404 |
| `QuotaExceededError` | `ApplicationError` | 429 |
| `DatabaseError`, `ExternalServiceError`, `QueueError` | `InfrastructureError` | 5xx |

**Global handler** turns any thrown value into a stable JSON envelope:

```ts
export const onErrorHandler: ErrorHandler<AppContext> = (err, c) => {
  console.error("Error:", err);
  return c.json(formatError(err), getStatusCode(err));     // BaseError → its status; else 500
};
// formatError(err) → { error, message, details?, timestamp }
```

Throw typed errors anywhere (entities, use-cases, middleware) — never hand-build error responses in handlers.

---

## 16. Config & Conventions

**Typed env** — extend the generated CF bindings with hand-declared vars/secrets:

```ts
// config/env.ts
export interface Env extends CloudflareBindings {
  EXTERNAL_API_URL?: string;
  INTERNAL_SERVICE_SECRET?: string;
}
export function getEnv(): Env {                      // anywhere, thanks to contextStorage()
  const ctx = getContext<{ Bindings: Env }>();
  if (!ctx) throw new Error("Context unavailable — is contextStorage() applied?");
  return ctx.env;
}
```

**Constants** — single source for enums, limits, messages (`config/constants.ts`):

```ts
export const RESOURCE_STATUS = { PENDING: "pending", COMPLETED: "completed", FAILED: "failed" } as const;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const ERROR_MESSAGES = { QUEUE_ERROR: "Failed to enqueue", NOT_FOUND: "Not found" } as const;
```

**tsconfig path aliases** (mirror the layers; kills `../../../`):

```jsonc
"baseUrl": ".",
"paths": {
  "@/*":               ["./src/*"],
  "@config/*":         ["./src/config/*"],
  "@domain/*":         ["./src/domain/*"],
  "@application/*":    ["./src/application/*"],
  "@infrastructure/*": ["./src/infrastructure/*"],
  "@presentation/*":   ["./src/presentation/*"]
}
```

**package.json scripts** (representative):

```jsonc
"dev":         "wrangler dev --env dev",
"deploy":      "wrangler deploy --minify -e production",
"cf-typegen":  "wrangler types --env-interface CloudflareBindings",
"db:generate": "drizzle-kit generate",
"db:migrate":  "drizzle-kit migrate",
"test":        "vitest run"
```

**Environment/branch mapping** convention: `dev → dev`, `staging → staging`, `main → production`. Secrets per env are uploaded out-of-band (CI `wrangler secret:bulk`), never committed.

---

## 17. Testing Convention

- **Vitest**; `__tests__/` mirrors `src/`.
- Use-cases are tested in isolation by passing **mocked repository interfaces** (`vi.fn()` per port method) — no DB, no network.
- Pure `application/services/*` functions are tested directly with input/output cases.
- Entities/value-objects: test behavior methods and invariants (e.g. illegal transitions throw).

```ts
const repo = { findById: vi.fn().mockResolvedValue(null), save: vi.fn() } as unknown as IResourceRepository;
const useCase = new DoThingUseCase(repo, { enqueue: vi.fn() });
await useCase.execute(req, actor);
expect(repo.save).toHaveBeenCalled();
```

---

## 18. Apply-to-New-Repo Checklist

1. Scaffold the layer tree from §2; add tsconfig aliases (§16) and `"type": "module"`, `strict: true`.
2. `wrangler.toml`: per-env blocks with vars + bindings (queues, DO, R2, KV) (§14).
3. `config/`: `Env extends CloudflareBindings`, `getEnv()`, `constants.ts`, `types/` (incl. `HttpStatusCode`).
4. `domain/errors/`: `BaseError` + three abstract subclasses + concrete errors with fixed status codes (§15).
5. `domain/`: entities (`create`/`toObject`/`fromObject`) + value objects + repository **interfaces** (§11–12).
6. `infrastructure/database/`: `createDbClient`, `schema.ts`, repository **implementations** (§12).
7. `infrastructure/`: external-service wrappers + factories, queue producer, storage (§13–14).
8. `application/`: use-cases (constructor-injected ports, single `execute`), DTOs, Zod validators, pure services (§10).
9. `presentation/middleware/`: `contextInjector` (DI), auth (actor model), `requirePermission`, `validator`, `error-handler` (§5,7,15).
10. `presentation/`: handlers (thin) + routes (recursive composition, per-route middleware) (§6,9).
11. `index.ts`: Hono app, global middleware order, route mount, `onError`/`notFound`, `ExportedHandler { fetch, queue }`, DO re-exports (§4).
12. `infrastructure/queue/*.worker.ts`: consumer that builds its own deps, acks on success, retries on throw (§14).
13. `__tests__/` mirroring `src/`, use-cases tested against mocked ports (§17).
