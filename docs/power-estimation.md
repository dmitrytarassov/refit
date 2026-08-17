# Power estimation

## Model

Power at the pedals is the sum of resistive forces times speed, corrected for drivetrain efficiency (`lib/power/point-power.ts`):

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
| Grade | `grade` | %, from the bike computer |
| Altitude | `enhancedAltitude` → `altitude` | for air density |
| Temperature | `temperature` | for air density |
| Cadence | `cadence` | coasting detector |

**Air density** ρ (`air-density.ts`) — barometric formula from the point's temperature and altitude; gives a noticeable ±3–5% on the aero component compared to a constant.

**Speed cleaning** — device speed is not touched by the GPS cleaning pipeline, and a single glitched sample spikes both the aero term (~v³) and the acceleration derivative (a 2000 W artifact from one bad second). Before any use, the speed series goes through a two-sided Hampel filter (`lib/filters/hampel-speed.ts`): a sample deviating from the ±5-record window median by more than 5 robust sigmas (σ = max(1.4826 · MAD, 0.5 m/s)) is replaced with that median. A real 1-s sprint surge survives; recording glitches do not. On a clean series the filter is a no-op (verified on the reference file: avg/NP/max unchanged).

**Acceleration** a — central difference of (filtered) speed over neighboring records, with safeguards: not computed across data gaps and pauses (Δt > 10 s), magnitude capped at 3 m/s².

## Parameters (function arguments)

Config — `PowerConfig` (`lib/power/power-config.ts`): `estimatePower(records, config)`.

### Mass — two arguments

`MassConfig { bikeKg, riderKg, gearKg?, bottlesMl? }` — bike, rider, gear (everything the rider carries: helmet, shoes, phone, bike computer…; defaults to 2 kg when unset — `DEFAULT_GEAR_KG` in `gear-defaults.ts`), and bottle volumes in ml (counted full for the whole ride, 1 L ≈ 1 kg; default none). The formulas use the sum (`total-mass.ts`).

### CdA — position selector

`CdaSelector` = a fixed riding position or `"auto"` (`resolve-cda.ts`).

| Position | CdA, m² |
| --- | --- |
| `tops` (bar tops) | 0.40 |
| `hoods` (brake hoods) | 0.32 |
| `drops` (drops) | 0.28 |
| `aero` (time-trial) | 0.23 |

`"auto"` mode: speed above 33 km/h → `drops`, below → `hoods` (the "hide from the wind at speed" heuristic).

### Crr — three typed parameters

`RollingResistance { surface, tires, pressure }`; the result is the base value times the multipliers (`resolve-crr.ts`):

| `surface` (base) | Crr | | `tires` (×) | | `pressure` (×) | |
| --- | --- | --- | --- | --- | --- | --- |
| `good-asphalt` | 0.0045 | | `road` | 1.0 | `high` | 0.9 |
| `rough-asphalt` | 0.006 | | `endurance` | 1.1 | `medium` | 1.0 |
| `gravel` | 0.010 | | `gravel` | 1.25 | `low` | 1.2 |
| | | | `mtb` | 1.5 | | |

Example: good asphalt + road tires + high pressure = 0.0045 × 1.0 × 0.9 ≈ 0.004.

## What gets written to the file

- `record.power` — watts in every record that has speed (a standard FIT profile field, Strava/Garmin Connect understand it).
- `session.avgPower`, `session.maxPower` — average (including coasting zeros) and maximum.
- `session.normalizedPower` — Normalized Power per Coggan (`normalized.ts`): rolling 30-second average of power, raised to the 4th power, averaged, 4th root. Weights surges the way physiology "feels" them.

## Accuracy and limitations

- **Wind** is the main irreducible error source: we know speed relative to the ground, aero depends on speed relative to the air.
- **Drafting** — riding in a group cuts the aero component by 30–40%; the model can't see it.
- On a solo ride in calm weather, expected accuracy is ±10–15% — the level of Strava's "estimated power".
- Reference: a ride of 43 km / 28 km/h average / 90 kg total mass → avg 140 W, NP 178 W, max 720 W — plausible values for flat terrain.

## Ideas for later

- A wind sensor from weather data by the track's time and coordinates.
- User's FTP in settings → TSS and Intensity Factor in session (for now FTP is estimated from the recording, see [ftp-estimation.md](ftp-estimation.md)).
- Fusion with hub speed sensor data (if present) instead of GPS speed.
