# `refit-core` — the core as a library

`packages/refit-core` is published to npm as **`refit-core`**: the whole computation core — FIT decode/encode, the GPS cleaning pipeline, the physics power model, NP / FTP / TSS / zones — with no UI, no CLI and no I/O beyond one optional Node entry. ESM only, TypeScript declarations included, works in Node ≥ 20, Bun and the browser.

```bash
bun add refit-core      # or: npm install refit-core
```

## Entries

The package has three entry points so that consumers pull in only what they use:

| Specifier | Extra dependency | Exports |
| --- | --- | --- |
| `refit-core` | none (pure math on `FitRecord[]`) | `cleanTrack`, `DEFAULT_PIPELINE`, `DEFAULT_SPEED_GATE`, `DEFAULT_HAMPEL`, `DEFAULT_KALMAN`, `extractTrack`, `semicirclesToDeg`, `degToSemicircles`, `estimatePower`, `sessionPowerStats`, `normalizedPowerW`, `powerCurve`, `CURVE_DURATIONS_SEC`, `estimateFtp`, `computeTss`, `computePowerZones`, `COGGAN_ZONE_UPPER_FRACTIONS`, `DEFAULT_GEAR_KG`, `DEFAULT_DRIVETRAIN_EFFICIENCY`, `CDA_BY_POSITION`, `CRR_BY_SURFACE`; types `FitRecord`, `GpsPoint`, `Track`, `LocalProjection`, `PipelineConfig`, `SpeedGateConfig`, `HampelConfig`, `KalmanConfig`, `CleanResult`, `Verdict`, `PowerConfig`, `MassConfig`, `CdaSelector`, `RiderPosition`, `RollingResistance`, `Surface`, `TireType`, `TirePressure`, `SessionPowerStats`, `CurvePoint`, `FtpEstimate`, `FtpMethod`, `ZoneTime` |
| `refit-core/fit` | `@garmin/fitsdk` (~400 KB minified) | `decodeFit(bytes: Uint8Array): FitFile`, `encodeFit(ordered): Uint8Array`, `applyEnhancements(ordered, options)`, `RECORD_MESG_NUM`, `SESSION_MESG_NUM`; types `FitFile`, `OrderedMesg`, `EnhancementOptions` |
| `refit-core/node` | `node:fs` | `readFit(path): FitFile`, `writeFit(path, ordered)` |

The root entry never imports the Garmin SDK, so a bundler can keep it in a lazy chunk (the web app does exactly that), and code that builds `FitRecord[]` from another source (e.g. Strava streams) needs no SDK at all.

## Examples

Node / Bun — the same flow the CLI runs:

```ts
import { cleanTrack, estimatePower, sessionPowerStats } from "refit-core";
import { applyEnhancements } from "refit-core/fit";
import { readFit, writeFit } from "refit-core/node";

const { ordered, messages } = readFit("ride.fit");
const records = messages.recordMesgs ?? [];

const { verdicts, report } = cleanTrack(records); // DEFAULT_PIPELINE
const powers = estimatePower(records, {
  mass: { bikeKg: 8, riderKg: 82 }, // gearKg defaults to DEFAULT_GEAR_KG, bottlesMl optional
  cda: "auto", // or a fixed position: "tops" | "hoods" | "drops" | "aero"
  crr: { surface: "good-asphalt", tires: "road", pressure: "high" },
});
const powerStats = sessionPowerStats(records, powers);

applyEnhancements(ordered, { verdicts, smooth: true, powers, powerStats });
writeFit("ride.out.fit", ordered);
console.log(report, powerStats);
```

Browser — decode from a `File`, never touch the filesystem:

```ts
import { cleanTrack, estimatePower } from "refit-core";
import { decodeFit } from "refit-core/fit";

const bytes = new Uint8Array(await file.arrayBuffer());
const { messages } = decodeFit(bytes);
const { report } = cleanTrack(messages.recordMesgs ?? []);
```

Metrics on top of the per-record powers:

```ts
import { computePowerZones, computeTss, estimateFtp, powerCurve } from "refit-core";

const curve = powerCurve(records, powers); // best average per CURVE_DURATIONS_SEC
const ftp = estimateFtp(curve); // { watts, method } | null — a lower bound, see ftp-estimation.md
if (ftp) {
  const tss = computeTss(messages.sessionMesgs[0].totalTimerTime, powerStats.normalizedPower, ftp.watts);
  const zones = computePowerZones(records, powers, ftp.watts); // Coggan Z1..Z7
}
```

What each function computes is documented in [track-cleaning.md](track-cleaning.md), [power-estimation.md](power-estimation.md) and [ftp-estimation.md](ftp-estimation.md); the file model in [fit-format.md](fit-format.md).

## Licensing

The core is MIT, but its FIT I/O relies on [`@garmin/fitsdk`](https://www.npmjs.com/package/@garmin/fitsdk), which Garmin ships under the proprietary, royalty-free [FIT Protocol License](https://github.com/garmin/fit-javascript-sdk/blob/main/LICENSE.txt). How `refit-core` stays on the right side of it:

- the published tarball contains no Garmin code — only our `src/` and `dist/`; the SDK is a plain `dependencies` entry that consumers install from Garmin's own npm package, accepting its license themselves (the license forbids redistributing or sublicensing the SDK, so it must never be bundled into `dist/`);
- only `refit-core/fit` (directly) and `refit-core/node` (through `decodeFit`/`encodeFit`) import the SDK; the root `refit-core` entry — pipeline, power model, metrics — has no dependencies at all;
- our MIT license imposes no source-disclosure requirement on dependencies, which the Garmin license explicitly rules out for copyleft licenses — do not relicense the project under GPL-style terms;
- the web app bundles the SDK into a lazy chunk served from GitHub Pages, the ordinary way a browser app uses Garmin's JavaScript SDK.

This is a reading of the license text, not legal advice.

## Package layout and build

- `package.json`: `"type": "module"`, `exports` with three subpaths, `sideEffects: false`, `files: ["dist", "src"]` (sources ship so `declarationMap` points at real files), `engines.node >= 20`. The only runtime dependency is `@garmin/fitsdk`.
- `tsconfig.json` type-checks `src` + `test` (`moduleResolution: bundler` — the Garmin SDK's `.d.ts` uses extensionless re-exports that `nodenext` resolution rejects); `tsconfig.build.json` emits `dist/` with JS, `.d.ts`, source maps and declaration maps. Build: `bun run --filter refit-core build` (plain `tsc`, no bundler).
- Relative imports inside `src/` carry a `.js` suffix — see [architecture.md](architecture.md#directory-layout).
- Each `exports` entry lists a `source` condition (`./src/*.ts`) before `types`/`import`. Node, bun and consumers' bundlers ignore it; only tools that opt in resolve the TypeScript sources directly.

## In-repo development

The web app and the CLI consume `refit-core` as a workspace dependency and opt into the `source` condition, so they always see the live sources — no `dist/` and no rebuild while editing the core:

- `packages/web/vite.config.ts`: `resolve.conditions: ["source", ...defaultClientConditions]`;
- `packages/web/tsconfig.app.json` and `packages/refit-cli/tsconfig.json`: `customConditions: ["source"]`;
- the CLI runs with `bun --conditions=source` (`bun run cli <file.fit>` from the root).

`dist/` is only produced for publishing ([publishing.md](publishing.md)).

## Tests

`bun test` from the root (or `packages/refit-core`) runs `packages/refit-core/test/`:

- `clean-track.test.ts` — a synthetic 1 Hz straight ride (`test/helpers/make-ride.ts`): a clean track is fully accepted and smoothed within 3 m; a 500 m teleport is caught by the speed gate; a 100 m jump with the gate off is caught by Hampel.
- `estimate-power.test.ts` — flat constant speed equals the `(Crr·m·g + ½·ρ·CdA·v²)·v / η` formula; coasting, stops, missing speed, descents, mass/position ordering, the 2000 W cap.
- `metrics.test.ts` — TSS, Coggan zones, FTP method selection, NP, session stats, power curve.
- `fit-roundtrip.test.ts` — the demo ride from `packages/web/public/examples/` decoded, cleaned and power-estimated with the CLI defaults must match the numbers shown in [cli.md](cli.md#what-it-prints), then survives `applyEnhancements → encodeFit → decodeFit` with the same record count and the session's `avgPower` written.
