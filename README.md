# dsh-maestro-devkit

General development toolkit for DeepSeek Harness — visual review, HMR, style inspector, Cordis/Govard/Skills dev (tunnel-aware).

Part of the `dsh-maestro-*` granular suite. See `<workspace-root>/docs/specs/2026-08-28-dsh-devkit-design.md` for the full design (8 sections).

## What you get

| Area | Tools |
|---|---|
| **Visual review** | `frontend_capture` — 3 viewports + DOM + geometry, tunnel-aware (`local` / `https://tunnel.example.com`) |
| **Live iteration** | `frontend_hmr` — chokidar watcher → classify (dist hot-patch / build:client / host restart via dsh-safe-web-update) + verify local+tunnel |
| **Style debug** | `frontend_inspect` — computedStyle + Theme tokens + slot occupants + source file, inline overlay |
| **Isolation** | `frontend_isolate` — sandbox single slot with mock props, viewport switcher |
| **Host dev** | `devkit_cordis_inspect`, `devkit_session`, `devkit_plugin` (dynamic Cordis) |
| **Govard/Skills** | `devkit_govard`, `devkit_skills` |

## Install

```sh
dsh plugin --profile web add @ddtcorex/dsh-maestro-devkit
# local dev
dsh plugin --profile web add link:/path/to/dsh-maestro-devkit
```

Restart `dsh web` after install.

## Development

```sh
pnpm verify
pnpm build
pnpm test
```

## Design

See `<workspace-root>/docs/specs/2026-08-28-dsh-devkit-design.md` (8 sections, tunnel-aware, 5 Hard Rules).
