# Power estimation

## Model

Power at the pedals is the sum of resistive forces times speed, corrected for drivetrain efficiency (`packages/refit-core/src/power/point-power.ts`):

```
P = (F_gravity + F_rolling + F_aero + F_inertia) · v / η

F_gravity  = m · g · sin(θ)                 θ = atan(grade / 100)
F_rolling  = Crr · m · g · cos(θ)
F_aero     = ½ · ρ · CdA · v²
F_inertia  = m · a
η          = 0.975                          (chain + bearings)
```

A negative total (descending, braking) is clamped to 0 — you can't push negative watts into the pedals. Zero is also written at cadence 0 (coasting) and speed < 0.5 m/s (standing still).

## Inputs from the recording

| Quantity | record field | Note |
| --- | --- | --- |
| Speed v | `enhancedSpeed` → `speed` | m/s |
| Grade | `grade` → derived from altitude over distance (±5 records) → 0 % | %, from the bike computer; virtual trainers write none |
| Altitude | `enhancedAltitude` → `altitude` → interpolated from the neighbouring records → 0 m | for air density |
| Temperature | `temperature` → interpolated from the neighbouring records → 15 °C | for air density |
| Cadence | `cadence` | coasting detector |

**Air density** ρ (`air-density.ts`) — barometric formula from the point's temperature and altitude; gives a noticeable ±3–5% on the aero component compared to a constant.

Both inputs drop out for seconds at a time (barometer glitch, lost GPS fix). Holes are filled from the neighbouring records instead of falling back to a constant (`fill-series.ts`): linear interpolation in time inside the track, the nearest known value at the edges. A constant would model those records at sea level, which at 2000 m overstates their power by about a quarter — inside one ride, on scattered points. The constants (0 m, 15 °C) are used only when the whole series is missing.

**Grade** — virtual trainers (MyWhoosh, Zwift) write altitude but no `grade` field. With a flat 0 % the model attributes every speed change of the virtual course to the rider: its climbs read as braking (0 W) and its descents as 700–1000 W inertia spikes, on a ride the trainer held at a constant 156 W. A record without a grade gets one derived from altitude over cumulative distance across a ±5-record window (`derive-grades.ts`, `GRADE_WINDOW_HALF`), from the already interpolated altitude series; the window is needed because FIT altitude is quantised to 0.2 m, so a per-record difference is mostly noise. A window covering less than 5 m of travel (standstill) yields no grade, and the final fallback is 0 %. The device's own grade is always preferred when present, so a bike-computer recording is not affected. On the MyWhoosh reference ride (ERG at 156 W, course with ±6 % ramps) this takes the per-record error against the trainer's power meter from MAE 47 W / max 1016 W to MAE 15 W / max 337 W; the remainder is the simulator's own mass, CdA and Crr versus the model's.

**Speed cleaning** — device speed is not touched by the GPS cleaning pipeline, and a single glitched sample spikes both the aero term (~v³) and the acceleration derivative (a 2000 W artifact from one bad second). Before any use, the speed series goes through a two-sided Hampel filter (`packages/refit-core/src/filters/hampel-speed.ts`): a sample deviating from the ±5-record window median by more than 5 robust sigmas (σ = max(1.4826 · MAD, 0.5 m/s)) is replaced with that median. A real 1-s sprint surge survives; recording glitches do not. On a clean series the filter is a no-op (verified on the reference file: avg/NP/max unchanged). The Hampel output then goes through a 3-point rolling median (`packages/refit-core/src/filters/median3.ts`): one-sample V-dips small enough to stay under the sigma threshold (e.g. a 2 m/s single-second dip at 30 km/h ≈ a fake +700 W inertia spike on recovery) are flattened, while monotonic runs — real accelerations and sprints — pass through unchanged by construction (the median of an ordered triple is its middle element).

**Acceleration** a — central difference of (filtered) speed over neighboring records, with safeguards: not computed across data gaps and pauses (Δt > 10 s), magnitude capped at 3 m/s².

## Parameters (function arguments)

Config — `PowerConfig` (`packages/refit-core/src/power/power-config.ts`): `estimatePower(records, config)`.

### Mass — two arguments

`MassConfig { bikeKg, riderKg, gearKg?, bottlesMl? }` — bike, rider, gear (everything the rider carries: helmet, shoes, phone, bike computer…; defaults to 2 kg when unset — `DEFAULT_GEAR_KG` in `gear-defaults.ts`), and bottle volumes in ml (counted full for the whole ride, 1 L ≈ 1 kg; default none). The formulas use the sum (`total-mass.ts`).

### CdA — position selector

`CdaSelector` = a fixed riding position, a measured CdA in m² (`cda: 0.245` — wind tunnel or aero pod), `"auto"`, or a speed ladder of your own (`AutoCdaConfig`); resolved in `resolve-cda.ts`.

| Position | CdA, m² |
| --- | --- |
| `tops` (bar tops) | 0.40 |
| `hoods` (brake hoods) | 0.32 |
| `drops` (drops) | 0.28 |
| `aero` (time-trial) | 0.23 |

`"auto"` mode is a ladder of positions keyed by speed — the "hide from the wind at speed" heuristic. The default (`DEFAULT_AUTO_CDA`) is a road bike: `hoods` up to 33 km/h, `drops` above.

Around every boundary the two CdA values are blended linearly over `blendBandMps` (`DEFAULT_AUTO_BLEND_MPS` = 4 km/h), so the default ladder runs 0.32 at 31 km/h → 0.30 at 33 → 0.28 at 35. Without the band a rider oscillating around the threshold gets a 17–20 W step in the per-second series on every crossing, and the step propagates into NP, the power curve and the zones: 32.9 km/h cost 185 W while 33.1 km/h cost 168 W. Set `blendBandMps: 0` to get exactly that pre-0.2.0 hard switch back.

**The band has a lower bound.** Blending always makes power continuous, but monotonic only if the band is wide enough: inside it the aero term is CdA(v)·v³ with CdA falling, so power grows only while `CdA'(v)·v + 3·CdA(v) > 0`, which gives

```
blendBandMps > ΔCdA · boundary / (3 · cdaNext − ΔCdA/2)
```

`minBlendBandMps()` computes it, and `assertAutoCdaConfig()` rejects a ladder that violates it — a 4 km/h band is plenty for the default `hoods → drops` at 33 km/h (0.45 m/s needed) but far too narrow for, say, `hoods → aero` at 45 km/h (1.74 m/s needed), where power would start falling as speed rises. `estimatePower` runs that validation once per ride; `resolveCda` itself never does, it runs per record.

### Crr — three typed parameters

`RollingResistance { surface, tires, pressure }`; the result is the base value times the multipliers (`resolve-crr.ts`):

| `surface` (base) | Crr | | `tires` (×) | | `pressure` (×) | |
| --- | --- | --- | --- | --- | --- | --- |
| `good-asphalt` | 0.0045 | | `road` | 1.0 | `high` | 0.9 |
| `rough-asphalt` | 0.006 | | `endurance` | 1.1 | `medium` | 1.0 |
| `gravel` | 0.010 | | `gravel` | 1.25 | `low` | 1.2 |
| | | | `mtb` | 1.5 | | |

Example: good asphalt + road tires + high pressure = 0.0045 × 1.0 × 0.9 ≈ 0.004.

All four tables (`CDA_BY_POSITION`, `CRR_BY_SURFACE`, `TIRE_FACTOR`, `PRESSURE_FACTOR`) and both resolvers (`resolveCda`, `resolveCrr`) are part of the public entry since 0.1.3, so a consumer can show "you are being modelled in hoods, CdA 0.32" without a second implementation of the same rules.

## What gets written to the file

- `record.power` — watts in every record that has speed (a standard FIT profile field, Strava/Garmin Connect understand it).
- `session.avgPower`, `session.maxPower` — average (including coasting zeros) and maximum.
- `session.normalizedPower` — Normalized Power per Coggan (`normalized.ts`): rolling 30-second average of power, raised to the 4th power, averaged, 4th root. Weights surges the way physiology "feels" them.

## Accuracy and limitations

- **Wind** is the main irreducible error source: we know speed relative to the ground, aero depends on speed relative to the air.
- **Drafting** — riding in a group cuts the aero component by 30–40%; the model can't see it.
- On a solo ride in calm weather, expected accuracy is ±10–15% — the level of Strava's "estimated power".
- Reference: a ride of 43 km / 28 km/h average / 90 kg total mass → avg 140 W, NP 180 W, max 735 W — plausible values for flat terrain.

## Ideas for later

- A wind sensor from weather data by the track's time and coordinates.
- User's FTP in settings → TSS and Intensity Factor in session (for now FTP is estimated from the recording, see [ftp-estimation.md](ftp-estimation.md)).
- Fusion with hub speed sensor data (if present) instead of GPS speed.
