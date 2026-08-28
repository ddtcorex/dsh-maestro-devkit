# AGENTS.md — dsh-maestro-devkit

> `CLAUDE.md` at the repo root is a symlink to `AGENTS.md`. Claude Code follows the same rule set as Codex CLI. Only edit `AGENTS.md` — never edit `CLAUDE.md` directly or replace the symlink with a copy.

## Purpose

General development toolkit for DeepSeek Harness — visual review, HMR, style inspector, Cordis/Govard/Skills dev (tunnel-aware). One Cordis row (`id: maestro-devkit`, `isolate: devkit`) with host half (Node) and client half (browser overlay / sandbox).

Names by boundary: npm package = `@ddtcorex/dsh-maestro-devkit`; Cordis patch row id = `maestro-devkit`.

Part of the Maestro Harness suite (installed as a DSH plugin). Maintained at `ddtcorex/dsh-maestro-devkit`.

## Layout

- `src/host/index.ts` — host `apply()`: registers 9 tools via reversible effects (`frontend_capture`, `frontend_hmr`, `frontend_inspect`, `frontend_isolate`, `devkit_cordis_inspect`, `devkit_session`, `devkit_plugin`, `devkit_govard`, `devkit_skills`), isolate realm `devkit`, inject `['tools','connection']`.
- `src/host/capture.ts` — `capture` — 3 viewports + DOM + geometry, tunnel-aware (`local` / `https://tunnel.example.com`).
- `src/host/hmr.ts` — `classify` / `hmrClassify` — chokidar watcher → dist hot-patch / build:client / host restart via dsh-safe-web-update.
- `src/host/inspect.ts` — `inspect` — computedStyle + Theme tokens + slot occupants + source file.
- `src/host/isolate.ts` — `isolate` — sandbox single slot with mock props, viewport switcher.
- `src/host/cordis.ts` — `cordisInspect` / `sessionInspect` — Cordis / session introspection.
- `src/host/govard.ts` — `govardRun` — Govard dev helpers.
- `src/host/skills.ts` — `skillsAction` — Skills browser / dev.
- `src/host/plugin.ts` — `pluginAction` — dynamic Cordis plugin helpers.
- `src/host/config.ts` — `resolveTargetUrl` — `auto` / `local` / `tunnel` / explicit URL resolution.
- `src/client/index.tsx` — browser half: overlay toolbar via `slots.inject('shell:overlay')`, safe `ctx.get('slots')` pattern.
- `src/client/overlay.tsx` / `inspector.tsx` / `sandbox.tsx` — overlay, style inspector, slot sandbox UI.
- `lib/` — committed build output. Generated; do not hand-edit.
- `scripts/build-client.mjs` — client bundle builder (esbuild, DSH ModuleLoader wrapper).
- `tests/*.spec.ts` — vitest suites.

## Development

Run from the repository root:

```sh
pnpm verify   # tsc --noEmit host + client
pnpm test     # vitest run
pnpm build    # tsc host + client && node scripts/build-client.mjs  -> lib/
```

`pnpm build` is the required gate after any source change; `lib/` is committed, so a change is incomplete until the build refreshes it.

## Git workflow

- Default branch `master`. No direct commits to `master` — use `feat/<topic>` / `fix/<topic>` and a PR against `ddtcorex/dsh-maestro-devkit`.
- Conventional commits, imperative mood (`feat:`, `fix:`, `docs:`, `chore:`).
- One TDD task = one commit; never commit while `pnpm verify` is red.
- When the base moves, rebase the feature branch onto `origin/master` (single-origin workflow; there is no upstream remote).

## Conventions

- **Cordis best practices**: every capability is a reversible effect `ctx.effect(() => ctx.tools.register(...))`, `ctx.on(event)`, `ctx.slots.inject`, `ctx.connection.rpc.handle`. Declare `inject: ['tools','connection']`, use `isolate: devkit` for session-local services, keep strict Host (Node) / Client (browser) split. No global singletons. Use `ctx.get('tools')` / `ctx.get('slots')` safe pattern.
- **Tunnel-aware**: `targetUrl: auto` resolves to local `:3080` or `https://tunnel.example.com` via config; capture/HMR/inspect verify both.
- **HMR classification**: `dist` → hot-patch + curl, `build:client` → rebuild + refresh, host → `dsh-safe-web-update` detached restart with ephemeral dry-boot.
- **Tool calls > LLM**: every deterministic operation is a `ctx.tools.register` tool; LLM is reasoning-only.
- Keep the host/client split; client bundle injects `['@deepseek-ai/dsh-client-runtime','@deepseek-ai/dsh-client-ui-slots']`.
- Strict TDD with vitest; `pnpm verify` must be green before commit.

## Validation

- `pnpm verify` + `pnpm test` green before any success claim.
- After touching the client bundle: `pnpm build` then verify on live DSH Web (`:3080`), not just curl/grep.
- Tunnel verification for capture/HMR when `verifyTunnel: true`.

## See Also

- Workspace architecture: `docs/architecture.md` in the Maestro Harness coordination workspace.

- **Always request approval before merge or release:** never merge a PR/MR or publish a release (`git tag`/`pnpm publish`/`gh release`) without an explicit human approval — request review (`gh pr ready` / `gh pr request-review` / ask in chat) and wait for `APPROVED`.
