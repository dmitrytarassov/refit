# Architecture

## What the project does

ReFit (formerly dot-fit) takes a .fit file from a bike computer, cleans GPS outliers from the track, optionally smooths it and enriches it with estimated power, then saves a valid .fit file (`<name>.out.fit`) that Strava and Garmin Connect understand.

## Directory layout

A bun workspaces monorepo; the root `package.json` is private and only holds shared tooling (TypeScript, ESLint, `@types/*`).

```
packages/
  refit-core/   — the computation core, published to npm as `refit-core`; see library.md
    src/
      index.ts    — entry `refit-core`: pipeline, power model, metrics (pure, no SDK)
      fit.ts      — entry `refit-core/fit`: decode/encode via @garmin/fitsdk, applyEnhancements
      node.ts     — entry `refit-core/node`: readFit/writeFit on top of node:fs
      fit/        — FIT reading/writing via @garmin/fitsdk
      geo/        — coordinates: semicircles ↔ degrees, local projection, distance
      mat/        — matrix algebra for the Kalman filter (2x2..4x4)
      track/      — track point model and GPS point extraction from records
      filters/    — three outlier filters: speed gate, Hampel, Kalman + RTS
      pipeline/   — cleaning pipeline: filter orchestration, verdicts, report
      power/      — power estimation: physical model and parameters
    test/         — bun test suite (synthetic rides + the demo ride round-trip)
  refit-cli/    — argument parsing and orchestration (private workspace, not published yet); see cli.md
  web/          — web app (Vite + React) on top of refit-core; see web-app.md
docs/           — documentation (this directory)
scripts/        — build helpers (llms-full.txt generation)
```

Dependency direction is one-way: `refit-cli` and `web` depend on `refit-core` **through its package entries only** (`refit-core`, `refit-core/fit`, `refit-core/node`), never through relative paths into `packages/refit-core/src`; `refit-core` depends on nothing in the repository. In-repo consumers resolve the core from source via the custom `source` export condition (see [library.md](library.md#in-repo-development)), so no build step is needed for `bun run dev`, lint or type-check.

Inside `refit-core`, relative imports carry an explicit `.js` suffix (`import { x } from "./x.js"` for `./x.ts`). The package is emitted file-by-file by `tsc` with no bundler, so the specifiers in `dist/` must be what Node resolves; TypeScript, Vite and bun map `./x.js` back to `./x.ts` during development.

## Code organization rules

Two hard rules, applied across the entire repository:

1. **No more than 2 declarations per file.** Functions, constants, classes, types — anything. A file with three functions must be split.
2. **Export kinds are never mixed.** A file exports only types, only constants, or only functions. A type next to a constant in the same file is an error.

These rules dictate the module naming scheme:

| Suffix/pattern | Contents | Example |
| --- | --- | --- |
| `*-config.ts` | configuration interface | `kalman-config.ts` |
| `*-defaults.ts` | constant with default values | `kalman-defaults.ts` |
| verb name | function | `resolve-cda.ts`, `clean-track.ts` |
| noun | data type | `gps-point.ts`, `verdict.ts` |

The three package entry files (`packages/refit-core/src/{index,fit,node}.ts`) are the one exception to the no-barrel rule: they contain zero declarations, only explicit named re-exports (no `export *`), and may mix re-exported functions, constants and `export type`s so that consumers import everything from one specifier.

## Naming

The abbreviation `mesg` (not `message`) is intentional: it's what Garmin itself calls messages throughout the FIT SDK (`Mesg`, `MesgNum`, `recordMesgs`, `onMesg()`). We keep their term so that names in the code match the SDK API one-to-one.

## Documentation

| File | What it covers |
| --- | --- |
| [library.md](library.md) | `refit-core` as an npm package: entries, API, examples, in-repo development |
| [publishing.md](publishing.md) | releasing `refit-core` to npm: versioning, tags, the publish workflow |
| [fit-format.md](fit-format.md) | the FIT format and how we read/write it |
| [track-cleaning.md](track-cleaning.md) | the track cleaning pipeline: three algorithms and their settings |
| [power-estimation.md](power-estimation.md) | the physical power model and its parameters |
| [ftp-estimation.md](ftp-estimation.md) | FTP estimation as a lower bound from the power curve |
| [web-app.md](web-app.md) | the web app: `packages/web/` structure, processing flow, navigation, hooks |
| [i18n.md](i18n.md) | UI localization (en/ru): dictionaries, language storage, picker modal |
| [history-storage.md](history-storage.md) | local ride history in IndexedDB, the History page, `?record=id` |
| [cli.md](cli.md) | CLI commands and flags |
| [theme.md](theme.md) | the "Ink and brass" palette for the web UI |
