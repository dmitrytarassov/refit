# CLI

## Running

From the repository root:

```bash
bun run cli <file.fit> [flags]
```

The output is written next to the input file as `<name>.out.fit`. The CLI is the `packages/refit-cli` workspace (private, not on npm yet — see [publishing.md](publishing.md)): argument parsing lives in `src/parse-args.ts`, orchestration in `src/run.ts`, which calls `refit-core` through its package entries (`refit-core`, `refit-core/fit`, `refit-core/node`; see [library.md](library.md)). `bun run cli` passes `--conditions=source` so the core is read from source without a build.

## Flags

| Flag | Values | Default | Effect |
| --- | --- | --- | --- |
| `--smooth` | — | off | replace accepted points' coordinates with smoothed ones (Kalman/RTS) |
| `--power` | — | off | compute power and write it into the file |
| `--bike-mass` | kg | 8 | bike mass |
| `--rider-mass` | kg | 82 | rider mass |
| `--gear-mass` | kg | 2 | gear mass — everything the rider carries (helmet, shoes, phone, bike computer…) |
| `--bottles` | ml,ml,… | none | bottle volumes, counted full for the whole ride (1 L ≈ 1 kg) |
| `--cda` | `auto` \| `tops` \| `hoods` \| `drops` \| `aero` | `auto` | riding position; `auto`: > 33 km/h → `drops`, otherwise `hoods` |
| `--surface` | `good-asphalt` \| `rough-asphalt` \| `gravel` | `good-asphalt` | surface (base Crr) |
| `--tires` | `road` \| `endurance` \| `gravel` \| `mtb` | `road` | tire type (Crr multiplier) |
| `--pressure` | `high` \| `medium` \| `low` | `high` | pressure (Crr multiplier) |

The mass/CdA/Crr flags only make sense together with `--power`.

## Examples

```bash
# track cleaning only
bun run cli ride.fit

# cleaning + coordinate smoothing
bun run cli ride.fit --smooth

# cleaning + power with default parameters (8 + 82 kg, auto, asphalt/road/high)
bun run cli ride.fit --power

# everything at once, custom parameters
bun run cli ride.fit --smooth --power --bike-mass 9.5 --rider-mass 75 --cda hoods --surface rough-asphalt --pressure medium
```

## What it prints

```
ride.fit -> ride.out.fit
Records: 5548, with GPS: 3670
Rejected: 384 (speed-gate: 267, hampel: 117, kalman: 0)
Accepted: 3286
Power: avg 140 W, NP 180 W, max 735 W
```

- `Records` — total records / of them, with GPS coordinates;
- `Rejected` — rejected per pipeline stage (see [track-cleaning.md](track-cleaning.md));
- `Accepted` — points left with coordinates;
- `Power` — power summary, if `--power` was requested (see [power-estimation.md](power-estimation.md)).
