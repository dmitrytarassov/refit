# Architecture

## What the project does

ReFit (formerly dot-fit) takes a .fit file from a bike computer, cleans GPS outliers from the track, optionally smooths it and enriches it with estimated power, then saves a valid .fit file (`<name>.out.fit`) that Strava and Garmin Connect understand.

## Directory layout

```
lib/        — all computation logic, no user I/O (the product core)
  fit/      — FIT reading/writing via @garmin/fitsdk
  geo/      — coordinates: semicircles ↔ degrees, local projection, distance
  mat/      — matrix algebra for the Kalman filter (2x2..4x4)
  track/    — track point model and GPS point extraction from records
  filters/  — three outlier filters: speed gate, Hampel, Kalman + RTS
  pipeline/ — cleaning pipeline: filter orchestration, verdicts, report
  power/    — power estimation: physical model and parameters
  index.ts  — CLI entry point (bun lib/index.ts <file.fit>)
cli/        — argument parsing and pipeline orchestration
src/        — web app (Vite + React), UI on top of lib; see web-app.md
docs/       — documentation (this directory)
```

Dependency direction is one-way: `cli` and `src` use `lib`; `lib` knows about nothing.

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

## Naming

The abbreviation `mesg` (not `message`) is intentional: it's what Garmin itself calls messages throughout the FIT SDK (`Mesg`, `MesgNum`, `recordMesgs`, `onMesg()`). We keep their term so that names in the code match the SDK API one-to-one.

## Documentation

| File | What it covers |
| --- | --- |
| [fit-format.md](fit-format.md) | the FIT format and how we read/write it |
| [track-cleaning.md](track-cleaning.md) | the track cleaning pipeline: three algorithms and their settings |
| [power-estimation.md](power-estimation.md) | the physical power model and its parameters |
| [ftp-estimation.md](ftp-estimation.md) | FTP estimation as a lower bound from the power curve |
| [web-app.md](web-app.md) | the web app: `src/` structure, processing flow, navigation, hooks |
| [history-storage.md](history-storage.md) | local ride history in IndexedDB, the History page, `?record=id` |
| [cli.md](cli.md) | CLI commands and flags |
| [theme.md](theme.md) | the "Ink and brass" palette for the web UI |
