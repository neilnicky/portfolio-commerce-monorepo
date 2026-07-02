# Frontend Architecture (Clean Architecture on Next.js + OpenNext/Cloudflare)

> Canonical, **domain-agnostic** reference for structuring a Next.js (App Router) frontend with clean architecture, deployed on Cloudflare via **OpenNext** (`@opennextjs/cloudflare`). Names below (`Resource`, `IResourceRepository`, `GetResourcesQuery`, `ResourceCard`, …) are placeholders — substitute your own domain nouns. The patterns are stack-fixed (Next.js App Router + OpenNext + TanStack Query + Zod) but business-logic-free, so this file can be dropped into any new frontend repo as the structural spec. Code blocks are **skeletons** (shapes/signatures), not full implementations.
>
> Companion to the Worker backend spec. This frontend talks to that backend over HTTP. **No Server Actions are used** in this architecture (mutations go through typed repositories → the backend API). §17 documents Server Actions anyway, for the cases where you might reach for them.

---

## 1. Stack & Principles

- **Framework**: Next.js **App Router** (RSC-first). Node.js runtime only — never `export const runtime = "edge"` (OpenNext does not support the Edge runtime; it runs your app on the Workers Node-compat runtime).
- **Deploy target**: Cloudflare Workers via **OpenNext** (`@opennextjs/cloudflare`). Bindings (KV/R2/DO/secrets) reached through `getCloudflareContext()` in server code only.
- **Server state / data fetching**: TanStack Query (React Query) on the client; native `fetch` + `cache`/`revalidate` in Server Components.
- **Client state**: Zustand for shared client state; `useState`/`useReducer` for local; React Context only for genuinely cross-cutting, low-frequency values (theme, current user).
- **Forms**: React Hook Form + Zod resolver.
- **Validation**: Zod, at every trust boundary (form input, API response parsing, route-handler input).
- **Language**: TypeScript, `strict: true`, ESM.
- **Styling**: utility-first (Tailwind) + a small set of design-system primitives. Tokens, not ad-hoc values.
- **Tests**: Vitest + Testing Library; use-cases/hooks tested against **mocked repository interfaces**; network mocked with MSW.

### The two axes (read this before anything else)

A frontend has **two orthogonal boundaries** that beginners constantly conflate. Keep them separate in your head and in the tree.

**Axis A — the clean-architecture axis (dependencies point inward):**

```
app + presentation ──▶ application ──▶ domain ◀── infrastructure
   (routing + UI)       (use-cases)     (core)      (implements domain ports)
```

- `domain` depends on **nothing** (pure types + rules; framework-agnostic, React-free).
- `application` depends on `domain` only (codes against repository **interfaces**, never concrete classes).
- `infrastructure` depends on `domain` (it **implements** the interfaces, calls the backend HTTP API) — never the reverse.
- `presentation` + `app` wire everything and render it. A component never imports a concrete repository class — only a hook or a use-case.

**Axis B — the Next.js runtime axis (where code executes):**

```
Server Components / Route Handlers   ◀── the "use client" directive ──▶   Client Components
        (run on the Worker)                  (a leafward boundary)            (run in the browser)
```

These axes are **independent**. A domain entity is server-and-client neutral. A repository implementation that uses `getCloudflareContext()` is server-only. A Zustand store is client-only. Most architectural mistakes come from collapsing Axis A into Axis B ("data layer = server, UI = client") — that is wrong. Data fetching happens on **both** sides; business rules belong to neither runtime exclusively.

**The one rule for each axis:** _never import outward (Axis A); never import a server-only module from a client component (Axis B)._

---

## 2. Layer Map (`src/`)

Primary structure: **shared layered core** (`core/`, `infrastructure/`) + **feature-sliced presentation** (`presentation/features/`). The core and data layers are small and cross-cutting; the UI is where volume and churn live, so it gets sliced by feature. (Scaling variant — promoting a feature to a full vertical slice — in §2.1.)

```
src/
├── app/                              # Next.js App Router — ROUTING + COMPOSITION ONLY
│   ├── layout.tsx                    # root layout: html/body, providers, fonts
│   ├── page.tsx                      # a route = a server component that composes a feature
│   ├── (marketing)/  (dashboard)/    # route groups (no URL segment) for layout/auth scoping
│   ├── resources/
│   │   ├── page.tsx                  # RSC: run a query use-case, render a feature view
│   │   ├── loading.tsx               # suspense fallback for the segment
│   │   ├── error.tsx                 # "use client" error boundary for the segment
│   │   └── [id]/page.tsx             # dynamic segment
│   └── api/                          # Route Handlers (BFF) — OPTIONAL, see §16
│       └── resources/route.ts        # GET/POST → proxy/aggregate the backend; hide secrets
│
├── core/                             # framework-agnostic — the clean core (NO React, NO next/*)
│   ├── domain/
│   │   ├── entities/        *.entity.ts                  # state + behavior (Resource)
│   │   ├── value-objects/   *.vo.ts                      # immutable typed primitives (Money)
│   │   ├── repositories/    *.repository.interface.ts    # persistence PORTS (IResourceRepository)
│   │   └── errors/          *.error.ts                   # error hierarchy (BaseError → …)
│   └── application/
│       ├── queries/         *.query.ts                   # READ use-cases (one workflow each)
│       ├── commands/        *.command.ts                 # WRITE use-cases (one workflow each)
│       ├── dtos/            *.dto.ts                      # wire shapes from the backend API
│       ├── view-models/     *.vm.ts                      # render-ready shapes the UI consumes
│       ├── validators/      *.validator.ts               # Zod schemas (forms, responses)
│       └── services/        *.ts                          # pure cross-use-case logic (no I/O)
│
├── infrastructure/                   # ADAPTERS — implement domain ports, talk to the outside
│   ├── api/             client.ts                         # typed fetch wrapper (createApiClient)
│   ├── repositories/    *.repository.ts                   # HttpResourceRepository implements I…
│   ├── mappers/         *.mapper.ts                       # DTO ↔ entity ↔ view-model
│   ├── storage/         *.ts                              # localStorage / cookie / KV adapters
│   └── cloudflare/      context.ts                        # getCloudflareContext() wrappers (server-only)
│
├── presentation/                     # REACT — components + hooks + client state
│   ├── features/                     # feature-sliced UI (the bulk of the app)
│   │   └── resource/
│   │       ├── components/  *.tsx                          # feature components (server + client)
│   │       ├── containers/  *.container.tsx                # connected client wrappers (data → view)
│   │       ├── hooks/       use-*.ts                       # query/mutation hooks wrapping use-cases
│   │       └── state/       *.store.ts                     # Zustand store scoped to the feature (client)
│   ├── components/      ui/*.tsx                           # shared design-system primitives (Button, Input)
│   ├── hooks/           *.ts                               # shared cross-feature hooks
│   ├── providers/       *-provider.tsx                     # client providers (QueryClient, Theme, …)
│   └── layouts/         *.tsx                              # reusable layout shells (not route layouts)
│
├── config/             env.ts, constants.ts, query-keys.ts, permissions.ts
├── types/              api.ts, common.ts, cloudflare-env.d.ts (generated)
└── lib/                cn.ts, fetcher.ts, format.ts, result.ts    # tiny pure utilities
```

> `cloudflare-env.d.ts` is **generated** by `wrangler types` (§18) — never hand-edit it.

### 2.1 Scaling variant — full vertical slices

When a feature grows its own non-trivial domain rules, promote it from a UI-only slice to a **vertical slice** that owns all four layers:

```
src/features/billing/
├── domain/         entities/ value-objects/ repositories/ errors/
├── application/    queries/ commands/ dtos/ view-models/ validators/ services/
├── infrastructure/ repositories/ mappers/
└── presentation/   components/ containers/ hooks/ state/
```

Cross-feature shared kernel (truly common entities, the API client, design-system primitives) stays in top-level `core/`, `infrastructure/api/`, `presentation/components/ui/`. **Rule:** features may depend on the shared kernel and on `app/`; they must **not** import each other's internals — cross-feature reuse is promoted up into the kernel.

---

## 3. Naming Conventions

| Layer / kind | File pattern | Export pattern | Example |
|---|---|---|---|
| Domain entity | `*.entity.ts` | `class Resource` | `resource.entity.ts` → `Resource` |
| Value object | `*.vo.ts` | `class Money` | `money.vo.ts` → `Money` |
| Repository port | `*.repository.interface.ts` | `interface IResourceRepository` | → `IResourceRepository` |
| Domain error | `*.error.ts` | `class XError extends DomainError` | `not-found.error.ts` → `NotFoundError` |
| Query (read use-case) | `*.query.ts` | `class GetResourcesQuery { execute() }` | `get-resources.query.ts` |
| Command (write use-case) | `*.command.ts` | `class CreateResourceCommand { execute() }` | `create-resource.command.ts` |
| DTO (wire shape) | `*.dto.ts` | `interface ResourceDto` | `resource.dto.ts` |
| ViewModel (render shape) | `*.vm.ts` | `interface ResourceVm` | `resource.vm.ts` |
| Validator | `*.validator.ts` | `const XSchema = z.object(...)` | `resource.validator.ts` |
| Mapper | `*.mapper.ts` | `const resourceMapper = { … }` | `resource.mapper.ts` |
| Repository impl | `*.repository.ts` | `class HttpXRepository implements IXRepository` | `resource.repository.ts` |
| API client | `client.ts` | `createApiClient(opts)` | `api/client.ts` |
| **Component** (server) | `*.tsx` **PascalCase** | `function ResourceList()` | `ResourceList.tsx` |
| **Component** (client) | `*.tsx` **PascalCase** + `"use client"` | `function ResourceFilters()` | `ResourceFilters.tsx` |
| Container (connected) | `*.container.tsx` | `function ResourceListContainer()` | `ResourceList.container.tsx` |
| Hook | `use-*.ts` | `function useResources()` | `use-resources.ts` |
| Client store | `*.store.ts` | `const useResourceStore = create(...)` | `resource.store.ts` |
| Provider | `*-provider.tsx` | `function QueryProvider()` | `query-provider.tsx` |
| Route segment file | `page/layout/loading/error/not-found.tsx` | default export | `page.tsx` |
| Route handler | `route.ts` | `export async function GET()/POST()` | `route.ts` |
| Query-key factory | `query-keys.ts` | `const resourceKeys = { … }` | `query-keys.ts` |

**Pattern:** `PascalCase symbol ↔ kebab-case.suffix.ts file`, exactly as the backend — **with one deliberate exception**: React **component files are PascalCase** to match the exported component (`ResourceCard.tsx` ↔ `ResourceCard`). This is the single concession to React convention; everything non-component (hooks, mappers, queries, stores) stays kebab-case with a type suffix. Interfaces for ports are `I`-prefixed.

---

## 4. Where does each concern live? (the four questions, answered)

| Concern | Home | Notes |
|---|---|---|
| **Data layer** | `infrastructure/api` + `infrastructure/repositories` | The API client + repository implementations. The *contracts* (ports) live in `core/domain/repositories`. |
| **Data transformation** | `infrastructure/mappers` (DTO↔entity) and `application/queries` (entity→ViewModel) | Components **never** transform. See §8 for the full pipeline. |
| **UI layer** | `presentation/` (+ `app/` for routing/composition) | Components consume **ViewModels**, never DTOs or entities. |
| **Server state** | TanStack Query (client) / RSC `fetch` (server) | The *source of truth is the server*; the cache is a projection. |
| **Client/UI state** | `presentation/.../state/*.store.ts` (Zustand) or local `useState` | Never store fetched server data here. |
| **URL state** | `searchParams` + `usePathname`/`useRouter` | Filters, tabs, pagination, sort — anything shareable/bookmarkable. |
| **Form state** | React Hook Form + Zod, colocated with the form component | Ephemeral until submit. |

Internalize the **state taxonomy** in §11; getting it wrong is the most common frontend architecture failure.

---

## 5. The Server/Client Boundary (Axis B)

Server Components (the default) run on the Worker, can be `async`, can touch secrets and bindings, and **never ship to the browser**. Client Components start where you write `"use client"` and ship JS to the browser; they own interactivity, effects, and browser-only APIs.

**Push `"use client"` as far down (leafward) as possible.** The directive marks a boundary: that file and everything it imports become client code. A page should stay a Server Component and drop into small client islands (a filter bar, a dropdown), not flip the whole tree to client.

```
app/resources/page.tsx          ← Server Component (async; runs the query use-case)
  └─ <ResourceList vm={…} />     ← Server Component (pure render of a ViewModel)
       └─ <ResourceRow vm={…} /> ← Server Component
            └─ <FavoriteButton/> ← "use client" island (onClick, optimistic state)
```

**Serialization rule (this constrains Axis A!).** Only plain, serializable data crosses the server→client boundary. You **cannot** pass a class instance — a `Resource` entity or a `Money` value object — into a client component; its methods and prototype are lost. Therefore: **map entities → plain ViewModels on the server, then pass the ViewModel down.** This is *why* ViewModels exist (§8), not bureaucracy.

| Allowed across the boundary | Not allowed |
|---|---|
| ViewModels (plain objects, primitives, arrays) | Class instances (entities, VOs) |
| Serializable props | Functions* / Dates-as-objects (serialize to ISO strings) |
| Server→Client `children` (composition, §10) | Repository instances, `getCloudflareContext()` results |

\* Server Actions are the one mechanism for passing a callable across the boundary — and we don't use them here (§17).

**Quick decision:** needs `onClick`/`onChange`/`useState`/`useEffect`/`window`/a browser API/a React context consumer → Client. Otherwise → leave it a Server Component.

---

## 6. The App Router is composition, not logic (`app/`)

Treat `app/` like the backend's routing layer: **it wires, it does not implement.** A `page.tsx` resolves params, kicks off a query use-case, and hands a ViewModel to a feature component. No business logic, no fetch plumbing, no mappers.

```tsx
// app/resources/page.tsx — Server Component
export default async function ResourcesPage({ searchParams }: PageProps) {
  const filters = parseResourceFilters(await searchParams);     // URL state → typed filters
  const vm = await getResourcesQuery().execute(filters);        // run the use-case (server)
  return <ResourceListView vm={vm} />;                          // hand a ViewModel to the feature
}
```

**Segment files** (per route folder): `layout.tsx` (shared shell + providers), `page.tsx` (the view), `loading.tsx` (Suspense fallback), `error.tsx` (`"use client"` boundary, §15), `not-found.tsx`. **Route groups** `(name)/` scope layouts/auth without adding a URL segment. **Dynamic** `[id]`, **catch-all** `[...slug]`, **parallel** `@slot`, and **intercepting** `(.)` routes are composition tools — keep their handlers thin.

**Metadata** (`generateMetadata`) and **route segment config** (`export const revalidate = 60`, `dynamic = "force-static"`, `fetchCache`) live in the segment file — they're routing concerns, not app logic.

---

## 7. The Data Layer — ports, the API client, repositories

The frontend "persistence" is the **backend HTTP API**. We still hide it behind the same port/adapter shape as the backend, so the application layer never knows whether data came from `fetch`, a route handler, or a cache.

**Port** in `core/domain/repositories/` (the application codes against this):

```ts
export interface IResourceRepository {
  findById(id: string): Promise<Resource | null>;
  list(filters: ResourceFilters): Promise<PaginatedResult<Resource>>;
  create(input: CreateResourceInput): Promise<Resource>;
  update(id: string, patch: UpdateResourceInput): Promise<Resource>;
}
```

**The API client** — one typed `fetch` wrapper, the single place that knows base URL, auth header injection, error→`InfrastructureError` translation, and response validation. Everything else goes through it.

```ts
// infrastructure/api/client.ts
export function createApiClient(opts: { baseUrl: string; getToken?: () => string | undefined }) {
  async function request<T>(path: string, init?: RequestInit & { schema?: ZodType<T> }): Promise<T> {
    const res = await fetch(`${opts.baseUrl}${path}`, withAuth(init, opts.getToken));
    if (!res.ok) throw toInfrastructureError(res);        // 4xx/5xx → typed error (§15)
    const json = await res.json();
    return init?.schema ? init.schema.parse(json) : (json as T);   // validate the boundary
  }
  return { get, post, patch, del }; // thin verbs over request()
}
export type ApiClient = ReturnType<typeof createApiClient>;
```

**Adapter** in `infrastructure/repositories/` — implements the port over the client, maps rows ↔ entities via a mapper (§8). It never leaks DTO shapes upward.

```ts
export class HttpResourceRepository implements IResourceRepository {
  constructor(private readonly api: ApiClient) {}

  async findById(id: string): Promise<Resource | null> {
    const dto = await this.api.get<ResourceDto | null>(`/v1/resources/${id}`, { schema: ResourceDtoSchema.nullable() });
    return dto ? resourceMapper.toEntity(dto) : null;
  }

  async list(filters: ResourceFilters): Promise<PaginatedResult<Resource>> {
    const dto = await this.api.get<PaginatedDto<ResourceDto>>(`/v1/resources?${toQuery(filters)}`);
    return { ...dto, items: dto.items.map(resourceMapper.toEntity) };
  }
}
```

**Storage adapters** (`infrastructure/storage/`) follow the same shape for `localStorage`, cookies, or (server-side) a Cloudflare KV/R2 binding reached through `getCloudflareContext()` (§18). Browser-storage adapters are client-only; binding adapters are server-only — keep them in separate files so a client bundle never imports a server module.

---

## 8. Data Transformation — the DTO → Entity → ViewModel pipeline

Three shapes, three jobs. Mixing them is the frontend equivalent of leaking SQL rows into your handlers.

| Shape | Owns | Lives in | Looks like |
|---|---|---|---|
| **DTO** | the wire contract from the backend | `application/dtos` | server field names, nullable, `created_at: string` |
| **Entity / VO** | internal model + behavior/invariants | `core/domain` | `status: ResourceStatus`, methods, `createdAt: Date` |
| **ViewModel (VM)** | exactly what a component renders | `application/view-models` | `statusLabel: string`, `createdAtText: "2 days ago"`, `canEdit: boolean` |

**Flow (one direction for reads):**

```
backend JSON ──Zod parse──▶ DTO ──mapper.toEntity──▶ Entity ──query maps──▶ ViewModel ──props──▶ Component
              (api client)        (infrastructure)            (application)          (presentation)
```

```ts
// infrastructure/mappers/resource.mapper.ts — DTO ↔ Entity only
export const resourceMapper = {
  toEntity(d: ResourceDto): Resource {
    return new Resource(d.id, ResourceStatus.fromString(d.status), new Date(d.created_at));
  },
  toDto(e: Resource): CreateResourceDto {       // for writes
    return { status: e.status.toString() };
  },
};

// application/view-models/resource.vm.ts + the query that builds it (§9)
export interface ResourceVm {
  id: string;
  statusLabel: string;      // already localized/formatted
  createdAtText: string;    // already humanized
  canEdit: boolean;         // derived permission flag, computed here not in the component
}
```

**Rules:**
- **Components receive ViewModels.** They do not see DTOs or entities, and they do **not** format, derive, or branch on raw status codes. If a component computes a display string, that logic belongs in the VM mapping.
- **Entities are optional for thin read-only screens.** If a screen has no behavior/invariants, map DTO→VM directly and skip the entity. Use entities where real rules live (state transitions, validation, money math).
- **Entities never cross to client components** (§5) — they're a server/application-side detail; the VM is the serializable hand-off.
- **One transformation per boundary.** DTO→entity in the repository; entity→VM in the query/command. Never two hops in one place, never a hop inside a component or hook.

---

## 9. Application Layer — Queries & Commands (the use-cases)

One class (or factory function) = one workflow, one `execute()`. Constructor takes **interfaces** (ports), never concrete repositories. Reads are **Queries**, writes are **Commands** (light CQRS — it keeps read-shaping and write-rules from tangling).

```ts
// application/queries/get-resources.query.ts  — READ: returns ViewModels
export class GetResourcesQuery {
  constructor(private readonly resources: IResourceRepository) {}     // domain port

  async execute(filters: ResourceFilters): Promise<PaginatedResult<ResourceVm>> {
    const page = await this.resources.list(filters);
    return { ...page, items: page.items.map(toResourceVm) };          // entity → VM here
  }
}

// application/commands/create-resource.command.ts  — WRITE: enforces rules, returns VM
export class CreateResourceCommand {
  constructor(private readonly resources: IResourceRepository) {}

  async execute(input: CreateResourceInput, actor: Actor | null): Promise<ResourceVm> {
    if (!actor) throw new UnauthorizedError();                        // guard (throws typed error)
    const entity = Resource.create(input /* … */);                   // build via factory (§13)
    const saved = await this.resources.create(entity.toCreateInput());
    return toResourceVm(saved);
  }
}
```

- **DTOs** (`application/dtos`) are the request/response shapes at the app boundary.
- **Validators** (`application/validators`) are Zod schemas reused by forms (client) and route handlers (server) — one schema, both ends.
- **Pure cross-use-case logic** (no I/O) goes in `application/services/*.ts` as plain functions — e.g. `computeTotals(items)`, `resolveTier(a, b)` — and is unit-tested in isolation.

> **Where use-cases run.** A query can execute in a Server Component (`page.tsx`, §6) *or* be wrapped by a client hook (§14). The use-case itself is runtime-neutral — it only touches a port. This is the payoff of keeping Axis A independent of Axis B.

---

## 10. How things are passed (props, composition, context)

A strict hierarchy — reach for the lightest that works, in this order:

**1. Props (default).** Pass typed **ViewModels** down. Props are explicit, testable, and serializable across the server/client boundary. One-directional, top-down.

```tsx
function ResourceCard({ vm }: { vm: ResourceVm }) { /* pure render */ }
```

**2. Composition / slots (to avoid prop drilling).** When an intermediate component doesn't use a prop but only forwards it, pass the rendered node as `children` (or a named slot prop) instead of threading data through. This is also how a **Server Component renders inside a Client Component** without the child becoming client code:

```tsx
// ClientShell is "use client"; ServerContent stays a Server Component:
<ClientShell>
  <ServerContent vm={vm} />   {/* passed as children — rendered on the server, slotted in */}
</ClientShell>
```

**3. Context (sparingly, client-only).** For genuinely cross-cutting, low-frequency values that many distant components read — theme, current user, a feature-flag set. Context is **not** for server data (that's TanStack Query) and not for high-churn state (it re-renders all consumers). One provider per concern, in `presentation/providers/`.

**4. Client store / URL state (shared mutable state).** Cross-component mutable client state → a feature-scoped Zustand store (§11). Shareable/bookmarkable state → the URL. Never lift transient state into a global store "just in case."

**Anti-patterns:** prop-drilling more than ~2 levels (use composition or a store); a "god context" holding unrelated values; passing entities/VOs across the client boundary (pass VMs); putting fetched data into Context or Zustand (it belongs in the query cache).

---

## 11. State Taxonomy (the most important frontend decision)

Four kinds of state, four homes. Classify **before** you reach for a tool.

| Kind | Source of truth | Tool | Examples |
|---|---|---|---|
| **Server state** | the backend | TanStack Query (client) / RSC `fetch` (server) | resource lists, the current user's profile, anything fetched |
| **URL state** | the URL | `searchParams` + `useRouter`/`usePathname` | filters, sort, page number, active tab, search query |
| **Client (UI) state** | the browser | Zustand (shared) / `useState`,`useReducer` (local) | modal open, sidebar collapsed, multi-step wizard step, optimistic toggles |
| **Form state** | the form, until submit | React Hook Form + Zod | field values, touched/dirty, validation errors |

**The cardinal rule: do not store server state in client state.** Fetched data is *cached server state*, not client state — it has freshness, refetch, and invalidation semantics that Zustand/Context cannot give you. Copying a query result into a store creates two sources of truth that drift.

**Server state — TanStack Query.** Centralize keys in a factory so invalidation is precise and refactors are safe:

```ts
// config/query-keys.ts
export const resourceKeys = {
  all: ["resources"] as const,
  list: (f: ResourceFilters) => [...resourceKeys.all, "list", f] as const,
  detail: (id: string) => [...resourceKeys.all, "detail", id] as const,
};
```

**URL state** is first-class: it survives refresh, is shareable, and needs no client store. Prefer it for anything a user might bookmark or share.

**Client state — Zustand**, feature-scoped, in `presentation/.../state/*.store.ts`. Keep stores small and about *UI*, not data:

```ts
// presentation/features/resource/state/resource-ui.store.ts
export const useResourceUiStore = create<ResourceUiState>((set) => ({
  selectedIds: new Set<string>(),
  toggle: (id) => set((s) => ({ selectedIds: toggleIn(s.selectedIds, id) })),
}));
```

---

## 12. Component Structure & Taxonomy

Every component is exactly one of these. Label it (by folder/suffix) and keep its job pure.

| Kind | Runtime | Job | Knows about |
|---|---|---|---|
| **Page / segment** (`page.tsx`) | Server | resolve params, run a query, hand off a VM | use-cases, ViewModels |
| **Presentational** (`*.tsx`) | Server or Client | render a ViewModel; zero data logic | props only |
| **Container** (`*.container.tsx`) | Client | wire a hook → feed a presentational child | hooks, ViewModels |
| **Client island** (`"use client"`) | Client | interactivity (handlers, effects, browser APIs) | local/store/URL state |
| **UI primitive** (`components/ui/*`) | usually Client | design-system atom (Button, Input, Dialog) | nothing domain-specific |
| **Layout shell** (`layouts/*`, `layout.tsx`) | Server | structural composition, slots | children |

**Container ↔ presentational split (the RSC-era version).** A **container** is the only place a hook is allowed; it owns the data wiring and renders a **presentational** child that takes a ViewModel and nothing else. This keeps rendering pure and testable, and keeps `"use client"` confined to containers/islands.

```tsx
// presentation/features/resource/containers/ResourceList.container.tsx
"use client";
export function ResourceListContainer({ filters }: { filters: ResourceFilters }) {
  const { data, isLoading, error } = useResources(filters);     // hook (§13)
  if (isLoading) return <ResourceListSkeleton />;
  if (error) return <ResourceListError error={error} />;
  return <ResourceList vm={data!} />;                            // presentational, props-only
}
```

**Feature components** live under `presentation/features/<feature>/components/` and may reference that feature's hooks/VMs. **Shared primitives** live under `presentation/components/ui/` and must stay domain-agnostic and reusable. A feature component importing another feature's internals is a smell — promote the shared part to the kernel (§2.1).

---

## 13. Hook Pattern (the seam between UI and use-cases)

Hooks are the **only** place components touch use-cases. They wrap a query/command in TanStack Query and expose server state + actions. Components stay free of fetching, caching, and invalidation logic.

```ts
// presentation/features/resource/hooks/use-resources.ts
"use client";
export function useResources(filters: ResourceFilters) {
  const query = useResourcesQuery();                              // resolved use-case (§14 DI)
  return useQuery({
    queryKey: resourceKeys.list(filters),
    queryFn: () => query.execute(filters),                        // VM out
  });
}

// mutation hook — write path
export function useCreateResource() {
  const command = useCreateResourceCommand();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateResourceInput) => command.execute(input, /* actor */ null),
    onSuccess: () => qc.invalidateQueries({ queryKey: resourceKeys.all }),   // precise invalidation
  });
}
```

**Naming:** `use<Noun>` for reads (`useResources`, `useResource`), `use<Verb><Noun>` for writes (`useCreateResource`, `useUpdateResource`). One hook = one query or one mutation. Cross-cutting non-data hooks (`useDebounce`, `useMediaQuery`) live in `presentation/hooks/`.

---

## 14. Composition / Dependency Injection on the frontend

No global service locator. Wire ports → repositories → use-cases in one **composition root**, then expose them. There are two runtimes, so there are two thin entry points sharing the same factory.

```ts
// infrastructure/container.ts — the composition root (runtime-neutral factory)
export function buildContainer(deps: { api: ApiClient }) {
  const resources = new HttpResourceRepository(deps.api);          // repositories
  return {
    queries:  { getResources: new GetResourcesQuery(resources) },  // use-cases wired from ports
    commands: { createResource: new CreateResourceCommand(resources) },
  };
}
export type Container = ReturnType<typeof buildContainer>;
```

**Server side** (RSC, route handlers): build per request from `getCloudflareContext()` env — secrets and the backend URL come from bindings, never from `NEXT_PUBLIC_*`.

```ts
// infrastructure/cloudflare/context.ts (server-only)
export function getServerContainer(): Container {
  const { env } = getCloudflareContext();
  return buildContainer({ api: createApiClient({ baseUrl: env.API_BASE_URL, getToken: readServerToken }) });
}
```

**Client side**: build once and provide via Context (the one legitimate Context use for "services").

```ts
// presentation/providers/container-provider.tsx
"use client";
const ContainerContext = createContext<Container | null>(null);
export function ContainerProvider({ children }: PropsWithChildren) {
  const container = useMemo(() => buildContainer({ api: createApiClient({ baseUrl: env.NEXT_PUBLIC_API_URL }) }), []);
  return <ContainerContext.Provider value={container}>{children}</ContainerContext.Provider>;
}
export const useResourcesQuery = () => useContainer().queries.getResources;     // hooks read from here
```

Constructor injection everywhere → use-cases are trivially testable with mocked ports (§19). Keep construction cheap and stateless so both runtimes can rebuild it freely.

---

## 15. Error Handling

Mirror the backend's typed hierarchy so an error keeps its meaning from the API all the way to the toast.

```ts
// core/domain/errors/base.error.ts
export abstract class BaseError extends Error {
  abstract readonly kind: "validation" | "unauthorized" | "forbidden" | "not_found" | "conflict" | "infrastructure";
  constructor(message: string, public readonly details?: unknown) { super(message); this.name = this.constructor.name; }
}
export class ValidationError    extends BaseError { readonly kind = "validation"; }
export class UnauthorizedError  extends BaseError { readonly kind = "unauthorized"; }
export class NotFoundError      extends BaseError { readonly kind = "not_found"; }
export class InfrastructureError extends BaseError { readonly kind = "infrastructure"; }
```

- **The API client** translates HTTP status → a typed error (`toInfrastructureError`, §7). Downstream code branches on `error.kind`, never on raw status codes.
- **Route-segment boundaries**: `error.tsx` (`"use client"`) catches render/data errors per segment; `not-found.tsx` handles `notFound()`; `global-error.tsx` is the root fallback.
- **Query/mutation errors** surface through TanStack Query's `error` (container components render the right state — inline, skeleton, or toast — by `kind`).
- **One mapping helper** turns a `kind` into UI treatment (`toUserMessage(error)`); components never hand-build error copy from status codes.

```tsx
// app/resources/error.tsx
"use client";
export default function ResourcesError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorState message={toUserMessage(error)} onRetry={reset} />;
}
```

---

## 16. Route Handlers as a BFF (`app/api/.../route.ts`) — optional

Use a Route Handler (a backend-for-frontend) only when the browser **shouldn't** call the API directly: to hide a secret/token, to aggregate several backend calls into one, to set httpOnly cookies, or to reach a Cloudflare binding. Otherwise the client calls the backend through the repository directly — don't add a hop you don't need.

```ts
// app/api/resources/route.ts — server-only; has access to bindings
export async function GET(request: Request) {
  const { env } = getCloudflareContext();                          // OpenNext: bindings here
  const container = buildContainer({ api: createApiClient({ baseUrl: env.API_BASE_URL, getToken: () => readCookieToken(request) }) });
  const vm = await container.queries.getResources.execute(parseFilters(request));
  return Response.json(vm);                                         // never leak DTOs/secrets
}
```

Validate input with the **same Zod schema** the form uses (§9). The handler is thin: parse → run use-case → respond — exactly like a backend handler.

---

## 17. Server Actions — documented, **not used here**

This architecture routes mutations through typed repositories → the backend API (§9, §13), so it does **not** use Server Actions. Documented for completeness and for the rare case you adopt one.

A Server Action is an `async` function marked `"use server"` that the client can invoke directly (it's the one callable that legitimately crosses the boundary, §5). Shape:

```ts
// (only if you choose to use one) — colocated or in app/_actions/
"use server";
export async function createResourceAction(input: CreateResourceInput) {
  const container = getServerContainer();                          // server DI (§14)
  const vm = await container.commands.createResource.execute(input, await getActor());
  revalidatePath("/resources");                                    // or revalidateTag(...)
  return vm;
}
```

**When you'd reach for one:** progressive-enhancement forms that must work without JS, or eliminating a route handler for a simple mutation. **Why we default away from it:** it couples the mutation to Next's server runtime (harder to share with non-Next clients), muddies the clean port boundary, and the explicit repository path is easier to test and reason about.

**OpenNext/Cloudflare note:** Server Actions **do** work under `@opennextjs/cloudflare` (Node runtime). On-demand revalidation (`revalidatePath`/`revalidateTag`) relies on OpenNext's Durable Object queue + sharded tag cache being configured (§18) — if those bindings are absent, revalidation silently no-ops. Validate that wiring before depending on it.

---

## 18. OpenNext / Cloudflare specifics

**Runtime constraints (non-negotiable):**
- Node.js runtime only. **Remove every `export const runtime = "edge"`** — the Edge runtime is unsupported by `@opennextjs/cloudflare`.
- Reach bindings/secrets **only** in server code via `getCloudflareContext()`. In SSG/`async` contexts use `await getCloudflareContext({ async: true })` (note: it then uses local/`.dev.vars` values at build time).
- Browser code uses `NEXT_PUBLIC_*` env only; secrets never get a `NEXT_PUBLIC_` prefix.
- Add `.open-next` to `.gitignore`.

**`next.config.ts`** — enable dev binding emulation:

```ts
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();                    // local dev can see bindings
const nextConfig: NextConfig = { /* … */ };
export default nextConfig;
```

**`open-next.config.ts`** — caching overrides:

```ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";
export default defineCloudflareConfig({ incrementalCache: r2IncrementalCache, queue: doQueue /* + tag cache for on-demand revalidation */ });
```

**`wrangler.jsonc`** (essentials):

```jsonc
{
  "main": ".open-next/worker.js",
  "name": "my-app",
  "compatibility_date": "2024-12-30",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": { "binding": "ASSETS", "directory": ".open-next/assets" },
  "images": { "binding": "IMAGES" },                                  // Next image optimization
  "services": [{ "binding": "WORKER_SELF_REFERENCE", "service": "my-app" }],   // must match name
  "r2_buckets": [{ "binding": "NEXT_INC_CACHE_R2_BUCKET", "bucket_name": "my-app-cache" }],
  "durable_objects": { "bindings": [
    { "name": "NEXT_CACHE_DO_QUEUE",       "class_name": "DOQueueHandler" },
    { "name": "NEXT_TAG_CACHE_DO_SHARDED", "class_name": "DOShardedTagCache" },   // on-demand revalidation
    { "name": "NEXT_CACHE_DO_PURGE",       "class_name": "BucketCachePurge" }
  ]},
  "migrations": [{ "tag": "v1", "new_sqlite_classes": ["DOQueueHandler", "DOShardedTagCache", "BucketCachePurge"] }]
}
```

- **Static-only site?** Drop the Queue + Tag Cache and use the Workers-Static-Assets incremental cache (read-only, no revalidation).
- KV is available for the incremental cache but is eventually consistent — prefer R2 for correctness.

**`package.json` scripts:**

```jsonc
"dev":        "next dev",
"preview":    "opennextjs-cloudflare build && opennextjs-cloudflare preview",   // run in the Workers runtime
"deploy":     "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
"cf-typegen": "wrangler types --env-interface CloudflareEnv"                    // → cloudflare-env.d.ts
```

**Typed env** — extend the generated bindings with hand-declared vars:

```ts
// config/env.ts
interface AppEnv extends CloudflareEnv { API_BASE_URL: string; INTERNAL_SERVICE_SECRET?: string; }
```

Re-run `cf-typegen` after any binding change. Secrets per environment are uploaded out-of-band (`wrangler secret:bulk`), never committed.

---

## 19. Testing Convention

- **Vitest + Testing Library**; `__tests__/` mirrors `src/`.
- **Use-cases (queries/commands)** tested in isolation with **mocked repository ports** (`vi.fn()` per method) — no network, no React.
- **Hooks** tested with a `QueryClientProvider` wrapper and a mocked container; assert cache/invalidation behavior.
- **Presentational components** tested by passing ViewModels as props and asserting output — pure, fast, no mocking.
- **Mappers & pure services** tested directly with input/output cases (these are where subtle bugs hide).
- **Network** mocked with **MSW** at the `fetch` layer for integration tests of the API client/repositories.
- **Entities/VOs**: test behavior methods and invariants (illegal transitions throw).

```ts
const repo = { list: vi.fn().mockResolvedValue(emptyPage), create: vi.fn() } as unknown as IResourceRepository;
const query = new GetResourcesQuery(repo);
await query.execute(filters);
expect(repo.list).toHaveBeenCalledWith(filters);
```

---

## 20. Apply-to-New-Repo Checklist

1. Scaffold the tree from §2; `strict: true`, ESM, path aliases (`@core/*`, `@infrastructure/*`, `@presentation/*`, `@config/*`).
2. **OpenNext wiring** (§18): `wrangler.jsonc` (assets/images/self-ref/R2/DO + migrations), `open-next.config.ts`, `initOpenNextCloudflareForDev()` in `next.config.ts`, scripts, `cf-typegen`, `.open-next` in `.gitignore`. Remove any `runtime = "edge"`.
3. `config/`: `AppEnv extends CloudflareEnv`, `constants.ts`, `query-keys.ts`, `permissions.ts`.
4. `core/domain/`: entities (`create`/factories), value objects, repository **interfaces**, error hierarchy with `kind` (§15).
5. `core/application/`: queries + commands (constructor-injected ports, single `execute`), DTOs, **ViewModels**, Zod validators, pure services (§9).
6. `infrastructure/`: `createApiClient` (auth + error translation + Zod validation), repository **implementations**, mappers (DTO↔entity), storage adapters, `getCloudflareContext` wrappers, `buildContainer` composition root (§7, §14).
7. `presentation/providers/`: `QueryProvider`, `ContainerProvider`, theme; mount in root `layout.tsx`.
8. `presentation/components/ui/`: design-system primitives (domain-agnostic).
9. `presentation/features/<feature>/`: presentational components (VM-only), containers (`"use client"`, hooks→view), `use-*` hooks (query/mutation), feature Zustand store (§11–13).
10. `app/`: routes as **composition only** — `page.tsx` runs a query and hands off a VM; `loading/error/not-found.tsx` per segment; route groups for layout/auth scoping (§6).
11. (Optional) `app/api/*/route.ts` BFF handlers where secrets/aggregation/bindings demand it (§16).
12. Enforce the boundaries: domain imports nothing; application imports domain only; components consume ViewModels (never DTOs/entities); `"use client"` confined to containers/islands; entities never cross to client components.
13. `__tests__/` mirroring `src/`; use-cases against mocked ports, components against VM props, network via MSW (§19).
