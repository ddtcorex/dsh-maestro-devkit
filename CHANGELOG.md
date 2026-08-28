# Changelog

All notable changes to this project are documented in this file. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
