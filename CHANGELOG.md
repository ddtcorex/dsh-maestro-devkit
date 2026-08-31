# Changelog

All notable changes to this project are documented in this file. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.1] - 2026-09-01

### Changed

- Host-restart classification re-pointed to the supervisor-owned `dsh-safe-restart` skill / `dsh_web_restart` tool (`hmr.ts` now explicitly a consumer — never instructs or executes its own restart). The `dsh-safe-web-update` skill was removed from maestro-skills.

## [0.3.0] - 2026-08-30

### Changed

- **Floating bar redesign — right-anchored, draggable + foldable**: bar defaults to middle-right (`right:0, top:50%`), folded by default, unfolds left with `Fold` (3 vertical lines, no border, `28×28` hit area) on the far right. `Brand` leftmost, `Actions` middle, `Fold` rightmost so `Actions` push left and `Fold` stays stationary. Right-anchored `pos.right` keeps Fold at same viewport X when toggling and survives reloads regardless of folded width. Drag via `Fold` (pointer capture, `didDrag` guard, arrow keys + Home, double-click reset, `clampToViewportRight`). Mobile compact (`32×28` Fold, `30px` buttons), `z100` overlay above `fIyUMG_sidebarCol z40`, `prefers-reduced-motion` support.
- `src/client/index.tsx` host call now prefers `connection.rpc.call` with fallback and always shows Inspector drawer even on empty `inspect` result.
- `src/client/overlay.tsx` no longer uses separate drag handle (`IconGrip` removed); `Fold` is both drag handle and toggle with wider hit area and no border.

### Fixed

- First-click buttons being pushed into right sidebar and disappearing (overlay `z-index` below sidebar). Overlay layer now `z-index:100` and bar `10000`.
- Fold button jumping during expand/collapse and not staying still when bar at custom position. Right-anchored positioning and synchronous `newLeft = oldRight - expectedWidth` keeps Fold stationary without flash.
- Dragged position not remembered after reload when folded state differed. Pos now stored as `right` distance (`maestro-devkit:bar-pos:right`) instead of `left`.

## [0.2.0] - 2026-08-29

### Removed

- `devkit_cordis_inspect` and `devkit_plugin` — both duplicated the core
  `@deepseek-ai/dsh-tool-cordis` extension already loaded in every `dsh web`
  session. Use `cordis_inspect_list`/`cordis_inspect_query`/`cordis_inspect_self`
  and `cordis_define`/`cordis_run`/`cordis_stop`/`cordis_undefine` instead.

### Fixed

- `frontend_inspect` now reaches the live browser tab. It previously called
  the host's own RPC handler channel (`/dsh-maestro-devkit`) — a
  self-referential call that never left the process. The client now
  registers its own channel (`/dsh-maestro-devkit-client`) exposing real
  `getComputedStyle`; host `frontend_inspect` calls that instead.

### Changed

- `frontend_hmr` now runs a real `chokidar` watcher (the dependency was
  declared since `0.1.0` but unused) that classifies each change and
  curl-verifies the target URL, instead of only exposing the `classify()`
  string-matcher with no watcher behind it.
- `frontend_isolate` now serves its sandbox view via a query param on the
  existing `/` (`/?__devkit_sandbox=<slot>&props=<json>`) instead of an
  unregistered `/__frontend_sandbox` route that 404'd. Sandbox's props view
  is now an editable JSON textarea (was read-only).
- `devkit_session` now reads real session data from `ctx.sessions` instead
  of returning a placeholder string.
- `devkit_govard` now actually spawns the requested command — restricted to
  a fixed allowlist (`make test`, `make build`, `govard env up`/`down`/`sh`)
  to close the command-injection surface a freeform string would open on an
  LLM-driven tool.
- `devkit_skills` now reads and writes real files under `skills/` instead of
  returning a hardcoded list and a fake scaffold path.
- Overlay toolbar gains an "Isolate" button and renders real `Inspector`
  results inline instead of `window.alert(...)`.

### Added

- `tests/inject-consistency.test.ts` and `tests/safe-access.test.ts` —
  regression tests for the `inject`-mismatch bug class that crashed
  `dsh web` boot twice (2026-08-28 slots-fix, 2026-08-29 harness/host
  incidents), without requiring a real Cordis loader boot.

## [0.1.2] - 2026-08-28

### Fixed

- Fix CHANGELOG itself to not list private hostnames literally (follow-up to 0.1.1). Ensures `npm view` and tarball are fully anonymized; deprecate 0.1.0 and 0.1.1.

## [0.1.1] - 2026-08-28

### Fixed

- Anonymize private tunnel hostnames (private `*.ddtcorex.com` hostnames → `tunnel.example.com`) in README, AGENTS, cordis.patch.yml, tests, and docs. Previous `0.1.0` tarball leaked private hostnames; `0.1.0` is deprecated — use `0.1.1`.

## [0.1.0] - 2026-08-28

Initial release of `@ddtcorex/dsh-maestro-devkit` — general development toolkit for DeepSeek Harness (tunnel-aware).

### Added

- **Visual review** — `frontend_capture` (3 viewports + DOM + geometry, tunnel-aware `local` / `https://tunnel.example.com`).
- **Live iteration** — `frontend_hmr` (chokidar watcher → classify dist hot-patch / build:client / host restart via dsh-safe-web-update + verify local+tunnel).
- **Style debug** — `frontend_inspect` (computedStyle + Theme tokens + slot occupants + source file, inline overlay).
- **Isolation** — `frontend_isolate` (sandbox single slot with mock props, viewport switcher).
- **Host dev** — `devkit_cordis_inspect`, `devkit_session`, `devkit_plugin` (dynamic Cordis helpers).
- **Govard/Skills** — `devkit_govard`, `devkit_skills` dev helpers.
- Cordis plugin wiring (`cordis.patch.yml` isolate `devkit`), host/client split, `lib/` committed build output, `pnpm verify` / `pnpm test` / `pnpm build` via `dsh-maestro-ci` reusable workflow.
