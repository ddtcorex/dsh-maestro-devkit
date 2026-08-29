# dsh-maestro-devkit

General development toolkit for DeepSeek Harness — visual review, HMR, style inspector, Cordis/Govard/Skills dev (tunnel-aware).

Part of the `dsh-maestro-*` granular suite.

## What you get

| Area | Tools |
|---|---|
| **Visual review** | `frontend_capture` — 3 viewports + DOM + geometry, tunnel-aware (`local` / `https://tunnel.example.com`) |
| **Live iteration** | `frontend_hmr` — chokidar watcher, classifies each change (dist hot-patch / build:client / host-restart), curl-verifies the target URL |
| **Style debug** | `frontend_inspect` — real `getComputedStyle` from the live browser tab via a client-registered RPC channel, inline overlay panel |
| **Isolation** | `frontend_isolate` — sandbox a single slot via `/?__devkit_sandbox=<slot>&props=<json>`, editable JSON props, viewport switcher |
| **Session dev** | `devkit_session` — real session list/inspect via `ctx.sessions` |
| **Govard/Skills** | `devkit_govard` (allowlisted commands only) — `devkit_skills` (real filesystem list/scaffold) |

> `devkit_cordis_inspect` and `devkit_plugin` were removed in `0.2.0` — both
> duplicated the core `@deepseek-ai/dsh-tool-cordis` extension already loaded
> in every `dsh web` session (`cordis_inspect_list`/`query`/`self`,
> `cordis_define`/`run`/`stop`/`undefine`). Use those instead.

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
