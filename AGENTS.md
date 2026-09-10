<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# KOA frontend

Shop/admin storefront against a .NET API. App Router, Next.js 16 (see block above — APIs differ from older Next), React 19, strict TS, Tailwind v4 (CSS-first config in `app/globals.css`, no `tailwind.config` file).

## Commands

- `npm run dev` — dev server. Also generates the in-repo Next docs/agent files referenced above.
- `npm run lint` / `npm run lint:fix` — ESLint (flat config, `eslint.config.mjs`).
- `npm run build` — production build (includes lint + typecheck).
- No test framework or CI in this repo. Verify with `npm run lint` + `npx tsc --noEmit` (or `npm run build`).

## Gotchas

- Next 16 renamed `middleware.ts` → `proxy.ts`. Clerk middleware lives in `proxy.ts` — do not create or edit `middleware.ts`.
- API base URL is `NEXT_PUBLIC_API_URL` in `.env.local` — a Visual Studio dev tunnel (`https://*.asse.devtunnels.ms`) that expires and changes. On API failures, the tunnel likely needs refreshing. Never log or commit `.env.local` (contains Clerk keys + tunnel token).
- All server endpoints go through the backend's `ApiResponse` envelope — `{ isSuccess, error, errorCode }`. Prefer envelope-provided messages via `getErrorMessage`/`getSuccessMessage` in `lib/api/errors.ts`.

## Architecture conventions

- Path alias `@/*` maps to repo root. Route groups: `(shop)`, `(account)`, `(admin)`, `(auth)` (sign-in/up are `[[...rest]]` catch-alls under `(auth)`).
- API calls: axios via `useAxiosClient` (`hooks/use-api-client.ts`) — injects the Clerk bearer token.
- Endpoint paths in `configs/api-routes.ts`, not inline. TanStack Query keys in `lib/api/query-keys.ts`, not inline.
- New mutations should use `useAppMutation` (`lib/api/use-app-mutation.ts`): it invalidates keys, toasts success (server message when present) and errors. Supply `invalidateKeys` + `successMessage`.
- Feature modules (feature-scoped hooks/components) under `features/`; shared UI under `components/` (shadcn-style, lucide icons); `hooks/` for cross-cutting hooks.
- Admin area is server-gated in `app/(admin)/layout.tsx` via `auth.protect()` + `sessionClaims.metadata.role === "admin"`; keep that gating, don't trust client-side checks.
- File uploads are direct-to-presigned-URL (`lib/storage/direct-upload.ts`) — no auth header on the PUT, the signed URL is self-contained.

