# ReFit

ReFit takes a `.fit` cycling activity from a bike computer, cleans GPS outliers from the track, optionally smooths it, enriches it with physics-based estimated power, and writes a valid `.fit` back — one that Strava and Garmin Connect understand. It ships as a web app and a CLI on top of the same computation core (`lib/`).

Runtime and package manager: [bun](https://bun.sh). No backend anywhere: the web app runs the whole pipeline in the browser.

## Web app

```bash
bun install
bun run dev
```

Drop a `.fit` file onto the upload zone and get a dashboard: power / heart rate / cadence / elevation charts, a full-width route map (Leaflet + OSM), power curve, Coggan power zones, estimated FTP, TSS, and a data-quality report of the cleaning pipeline. **Download enhanced** writes the cleaned and power-enriched file back as `<name>.enhanced.fit`.

- **History** — every processed ride is saved locally to IndexedDB (file + precomputed metrics); no accounts, no server.
- **Ride settings** — riding position (CdA) and rolling-resistance parameters (surface / tires / pressure) are editable per ride under the file card; metrics recompute and persist on the fly. The last used values become defaults for the next ride (also editable on the **Settings** page).
- **Help** — the same formulas as below, rendered in-app.

Details: [docs/web-app.md](docs/web-app.md), [docs/history-storage.md](docs/history-storage.md), [docs/theme.md](docs/theme.md).

## CLI

```bash
bun lib/index.ts <file.fit> [flags]
```

Writes `<name>.out.fit` next to the input and prints a cleaning/power report.

| Flag | Values | Default | Effect |
| --- | --- | --- | --- |
| `--smooth` | — | off | replace accepted coordinates with smoothed ones (Kalman/RTS) |
| `--power` | — | off | estimate power and write it into the file |
| `--bike-mass` | kg | 8 | bike mass |
| `--rider-mass` | kg | 81 | rider mass |
| `--cda` | `auto` \| `tops` \| `hoods` \| `drops` \| `aero` | `auto` | riding position; `auto`: > 33 km/h → `drops`, else `hoods` |
| `--surface` | `good-asphalt` \| `rough-asphalt` \| `gravel` | `good-asphalt` | surface (Crr base) |
| `--tires` | `road` \| `endurance` \| `gravel` \| `mtb` | `road` | tire type (Crr multiplier) |
| `--pressure` | `high` \| `medium` \| `low` | `high` | pressure (Crr multiplier) |

Details: [docs/cli.md](docs/cli.md).

## The formulas

Everything below is computed from the raw records; nothing needs a power meter.

### GPS track cleaning

Three filters, cheapest to smartest; each stage only sees points that survived the previous one. All geometry runs in a local metric projection around the first track point. Rejected points stay in the file with coordinates erased.

```
GPS points → speed gate → Hampel → Kalman + RTS → verdicts
```

**1. Speed gate** — physical plausibility against the last *accepted* point:

```
reject if  D > max(k · v · Δt, D_min)        k = 2, D_min = 10 m
```

Device speed is trusted only up to 30 m/s (fallback 10 m/s when missing). Comparing against the last accepted point means consecutive outliers cannot drag the threshold along.

**2. Hampel filter** — robust statistics, no trust in device speed. Implied speed (distance to last accepted / Δt) vs the rolling median over a ±5-point window:

```
σ = 1.4826 · MAD                             (σ ≥ 1 m/s)
reject if  v_implied − median > 6σ           (one-sided: only "too fast")
```

**3. Kalman filter + RTS** — state `[x, y, vx, vy]`, constant-velocity model with acceleration noise σ_a = 1 m/s², GPS noise σ_gps = 6 m. Gating by Mahalanobis distance:

```
reject if  d² > 13.82                        (χ², 2 DoF ≈ 99.9%)
```

The gate widens with Δt on its own; after 5 consecutive rejects or a 60 s gap the filter re-initializes a new segment (tunnel, cold start). Each finished segment gets a backward Rauch–Tung–Striebel pass; the smoothed coordinates are what `--smooth` writes.

Details: [docs/track-cleaning.md](docs/track-cleaning.md).

### Power model

```
P = (F_gravity + F_rolling + F_aero + F_inertia) · v / η

F_gravity = m · g · sin(θ)          θ = atan(grade / 100)
F_rolling = Crr · m · g · cos(θ)
F_aero    = ½ · ρ · CdA · v²
F_inertia = m · a
η         = 0.975                   (chain + bearings)
```

Negative results are clamped to 0; power is zero at cadence 0 (coasting) and below 0.5 m/s. Air density ρ comes from the barometric formula over the record's temperature and altitude. The device speed series is first cleaned with a two-sided Hampel filter (±5-record window, 5σ, σ = max(1.4826 · MAD, 0.5 m/s); outliers replaced with the window median) — one glitched sample would otherwise spike both the aero term and the derivative. Acceleration is a central difference of the filtered speed, capped at 3 m/s², not computed across gaps (Δt > 10 s).

CdA by position: tops 0.40, hoods 0.32, drops 0.28, aero 0.23 m². Rolling resistance:

```
Crr = base(surface) · k(tires) · k(pressure)
base: good asphalt 0.0045 · rough asphalt 0.006 · gravel 0.010
tires: road 1.0 · endurance 1.1 · gravel 1.25 · mtb 1.5
pressure: high 0.9 · medium 1.0 · low 1.2
```

Expected accuracy on a solo ride in calm weather: ±10–15% (wind and drafting are invisible to the model). Details: [docs/power-estimation.md](docs/power-estimation.md).

### Metrics

```
NP  = ⁴√( mean( P̄₃₀ₛ⁴ ) )            30-s rolling average → 4th power → mean → 4th root

FTP ≥ max( 0.95 · P₂₀,
           (1200 · P₂₀ − 300 · P₅) / 900,    Critical Power (Monod, 5/20-min points)
           P₆₀ )

TSS = t · (NP / FTP)² / 36            t — timer time, seconds
```

FTP is estimated as a **lower bound** (a normal ride is not an all-out test), so TSS is an upper bound; rides without a 20-minute interval get no estimate. Power zones are Coggan's, with boundaries at 55 / 75 / 90 / 105 / 120 / 150% of estimated FTP; pauses (Δt > 10 s) are excluded from zone time. The Data Quality score is `accepted GPS points / all GPS points · 100%`.

Details: [docs/ftp-estimation.md](docs/ftp-estimation.md).

## Project layout

```
lib/   — all computation (FIT I/O, geo, filters, pipeline, power); CLI entry: lib/index.ts
cli/   — argument parsing and orchestration on top of lib
src/   — Vite + React web app on top of lib
docs/  — documentation, start with docs/architecture.md
```

### Example files

The empty dashboard offers two sample rides (opened without saving to History):

- **Demo ride — Magene C406** (`public/examples/`) — the author's own real outdoor recording, shipped with the app for demo purposes.
- **Garmin example** — `WithGearChangeData.fit` from Garmin's [fit-javascript-sdk](https://github.com/garmin/fit-javascript-sdk/tree/main/test/data) (© Garmin International, Inc., [FIT Protocol License](https://github.com/garmin/fit-javascript-sdk/blob/main/LICENSE.txt)). It is **not** redistributed in this repository — the app fetches it from Garmin's GitHub at click time.

Dependency direction is one-way: `cli` and `src` depend on `lib`; `lib` depends on nothing above it.

## Development

```bash
bun install
bun run dev       # web app with HMR
bun run build     # type-check + production build
bun run lint      # eslint
```
