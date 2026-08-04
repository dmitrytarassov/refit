# GPS track cleaning

## The problem

A bike computer's GPS receiver periodically "teleports" points: multipath in the city, cold start, satellite loss. On a real file (Magene C406, 43 km), 187 of 3670 GPS points were more than twice as far from the previous point as the speed at that moment allowed; the worst was 47 times farther.

## Pipeline

Orchestration — `lib/pipeline/clean-track.ts`. Three filters, from cheap to smart; each sees only the points that survived the previous ones, and each can be disabled independently (`PipelineConfig`, field = `false`):

```
GPS points → speed gate → Hampel → Kalman + RTS → verdicts
```

All filters work in a local metric projection (`lib/geo/create-projection.ts` — an equidistant projection around the track's first point; at distances up to ~100 km the error is under a meter, the inverse transform is exact).

The result is a `Verdict` per GPS point: `accepted` (plus smoothed coordinates, if Kalman is enabled) or `rejected` with the filter's name, plus a report with rejection counts per stage.

## Stage 1: speed gate (`lib/filters/speed-gate.ts`)

The classic physical-reachability filter. A point is rejected if it is farther from the **last accepted** point than the device-reported speed allows:

```
distance > max(k · v · Δt, minimum)
```

Three deliberate decisions:

- Comparison against the last *accepted* point, not the previous one: the threshold grows with accumulated Δt, so a run of consecutive outliers can't "drag" each other through.
- Speed is capped from above (`maxPlausibleSpeedMps`): if a GPS glitch corrupted the speed too, an inflated threshold won't let the outlier through.
- A floor on the threshold in meters — so that at stops (v ≈ 0) honest GPS noise isn't rejected.

| Parameter | Default | Meaning |
| --- | --- | --- |
| `toleranceFactor` | 2 | multiplier on v·Δt (GPS noise, speed quantization) |
| `minThresholdM` | 10 | threshold floor, m |
| `fallbackSpeedMps` | 10 | speed to use if the device didn't record it |
| `maxPlausibleSpeedMps` | 30 | ceiling of trust in the device speed, m/s |

## Stage 2: Hampel filter (`lib/filters/hampel.ts`)

Robust statistics with no trust in the device speed: the track judges itself. For each point, an "implied speed" is computed (distance to the last accepted point / Δt) and compared against the rolling median of implied speeds in a window. Deviation is measured in robust sigmas (σ = 1.4826 · MAD — median absolute deviation; tolerates up to 50% garbage in the window).

The filter is one-sided: only "too fast" is rejected — an outlier teleports a point away; riding slower than the median is fine.

| Parameter | Default | Meaning |
| --- | --- | --- |
| `windowHalf` | 5 | statistics half-window |
| `nSigmas` | 6 | threshold in robust sigmas |
| `minSigmaMps` | 1 | sigma floor — protection against MAD ≈ 0 on uniform stretches |

## Stage 3: Kalman filter + RTS (`lib/filters/kalman-rts.ts`)

Model-based filtering. State `[x, y, vx, vy]`, constant-velocity model with white acceleration noise; measurements are GPS position only.

- **Rejection**: a measurement with a Mahalanobis distance from the prediction greater than `gateChi2` (χ² for 2 degrees of freedom; 13.82 ≈ 99.9%) doesn't update the state. Prediction uncertainty grows with Δt, so the "gate" widens on its own until the honest track comes back inside it.
- **Reinitialization**: after `maxConsecutiveRejects` rejections in a row (or a gap longer than `gapResetS`), the filter decides the track has genuinely moved (tunnel, cold start) and starts a new segment from the current measurement.
- **Smoothing**: for each completed segment — a Rauch–Tung–Striebel backward pass (`kalman-smooth.ts`). Processing is offline, so every estimate uses the whole track, not just the past. Smoothed coordinates go into the verdict and are applied with the `--smooth` flag.

| Parameter | Default | Meaning |
| --- | --- | --- |
| `accelSigmaMps2` | 1.0 | acceleration noise; higher — more trust in measurements |
| `gpsSigmaM` | 6 | GPS position noise, m |
| `gateChi2` | 13.82 | χ² rejection threshold (2 DoF, 99.9%) |
| `maxConsecutiveRejects` | 5 | consecutive rejections before reinitialization |
| `gapResetS` | 60 | gap, s, after which a new segment starts |
| `initVelocitySigmaMps` | 15 | initial velocity uncertainty |

Matrix algebra is homegrown (`lib/mat/`): multiplication, transposition, Gauss–Jordan inversion with pivoting; the matrices are small (up to 4×4), no external dependency needed.

## Results on the reference file

| Metric | Before | After | After `--smooth` |
| --- | --- | --- | --- |
| Jumps "> 2× expected distance" | 187 | 2 | 0 |
| Worst distance/expected ratio | 47.0 | 2.1 | 1.48 |

384 of 3670 points rejected (speed gate — 267, Hampel — 117, Kalman — 0: gross outliers never reach it, it acts as a gate for the subtle cases and provides smoothing). All 5548 records preserved — bad points only have their coordinates erased.

## Why not other algorithms

- **Douglas–Peucker** is track simplification (thinning), not cleaning; it would actually keep an outlier as a "significant" point.
- **Moving average over coordinates** smears an outlier onto its neighbors instead of removing it.
- Hampel and Kalman here *are* the standard "serious" tools for this problem (that's how the cleaners in navigation devices and Strava work).
