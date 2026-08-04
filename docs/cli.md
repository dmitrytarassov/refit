# CLI

## Running

```bash
bun lib/index.ts <file.fit> [flags]
```

The output is written next to the input file as `<name>.out.fit`. Argument parsing lives in `cli/parse-args.ts`, orchestration in `cli/run.ts`.

## Flags

| Flag | Values | Default | Effect |
| --- | --- | --- | --- |
| `--smooth` | — | off | replace accepted points' coordinates with smoothed ones (Kalman/RTS) |
| `--power` | — | off | compute power and write it into the file |
| `--bike-mass` | kg | 8 | bike mass |
| `--rider-mass` | kg | 81 | rider mass |
| `--cda` | `auto` \| `tops` \| `hoods` \| `drops` \| `aero` | `auto` | riding position; `auto`: > 33 km/h → `drops`, otherwise `hoods` |
| `--surface` | `good-asphalt` \| `rough-asphalt` \| `gravel` | `good-asphalt` | surface (base Crr) |
| `--tires` | `road` \| `endurance` \| `gravel` \| `mtb` | `road` | tire type (Crr multiplier) |
| `--pressure` | `high` \| `medium` \| `low` | `high` | pressure (Crr multiplier) |

The mass/CdA/Crr flags only make sense together with `--power`.

## Examples

```bash
# track cleaning only
bun lib/index.ts ride.fit

# cleaning + coordinate smoothing
bun lib/index.ts ride.fit --smooth

# cleaning + power with default parameters (8 + 81 kg, auto, asphalt/road/high)
bun lib/index.ts ride.fit --power

# everything at once, custom parameters
bun lib/index.ts ride.fit --smooth --power --bike-mass 9.5 --rider-mass 75 --cda hoods --surface rough-asphalt --pressure medium
```

## What it prints

```
ride.fit -> ride.out.fit
Records: 5548, with GPS: 3670
Rejected: 384 (speed-gate: 267, hampel: 117, kalman: 0)
Accepted: 3286
Power: avg 139 W, NP 178 W, max 712 W
```

- `Records` — total records / of them, with GPS coordinates;
- `Rejected` — rejected per pipeline stage (see [track-cleaning.md](track-cleaning.md));
- `Accepted` — points left with coordinates;
- `Power` — power summary, if `--power` was requested (see [power-estimation.md](power-estimation.md)).
