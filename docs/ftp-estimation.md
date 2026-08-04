# FTP estimation

FTP (Functional Threshold Power) is the power a rider can hold for about an hour. We don't have a user profile yet, so instead of asking for FTP we **estimate it from the recording itself as a lower bound**: a regular ride is not an all-out test, so the only honest claim is "FTP is at least X".

## Method

The input is the power curve (`powerCurve`: best average power over standard intervals, built on top of the estimated watts from [power-estimation.md](power-estimation.md)). We compute three candidates and take the **maximum**:

| Candidate | Formula | `method` key |
| --- | --- | --- |
| 95% of best 20 minutes | 0.95 · P₂₀ | `twenty-min` |
| Critical Power (Monod model over the 5- and 20-min points) | (1200 · P₂₀ − 300 · P₅) / 900 | `critical-power` |
| Best hour | P₆₀ | `best-hour` |

Why the maximum and not the average: each candidate is a sound lower bound on its own (efforts in the recording are submaximal, so every formula underestimates), which makes the maximum the tightest bound the data allows us to claim.

If the recording has no 20-minute interval (a short ride) — no estimate (`null`): you can't predict FTP from sprints.

## Code

- `lib/power/estimate-ftp.ts` — `estimateFtp(curve): FtpEstimate | null`, a pure function over the curve.
- `lib/power/ftp-estimate.ts` — the `FtpEstimate { watts, method }` and `FtpMethod` types.
- `src/hooks/use-ftp.ts` — the `useFTP(activity)` hook for the web app; the single point of FTP access in the UI.

## Limitations

- This is a **lower bound**, not FTP: if the rider took it easy, real FTP may be noticeably higher. The closer the recorded efforts were to the limit, the more accurate the estimate.
- The input watts are themselves estimated (±10–15%, see [power-estimation.md](power-estimation.md)) — the FTP estimate inherits that error.
- Once a user profile appears, a manual FTP must take priority over the estimate; the `useFTP` hook will remain the single place where that decision is made.

## Consumers

Everyone takes FTP only through `useFTP`, never from constants:

- **The Est. FTP tile** (`MetricTilesRow`) — shows the estimate; took the spot of Intensity Factor (IF removed, see TODO).
- **TSS** — `src/hooks/use-tss.ts` on top of `lib/power/compute-tss.ts`: TSS = sec · (NP/FTP)² / 36, duration is `session.totalTimerTime` (moving time). Since FTP is a lower bound, IF is overestimated, and TSS is an **upper-bound estimate**.
- **Power Zones** — `src/hooks/use-power-zones.ts` on top of `lib/power/compute-power-zones.ts`: Coggan zones (bounds as fractions of FTP in `zone-bounds.ts`: 55 / 75 / 90 / 105 / 120 / 150% and above), time in zone is summed over Δt between records, pauses (Δt > 10 s) are not counted.
