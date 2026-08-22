# refit-core

The computation core of [ReFit](https://github.com/dmitrytarassov/refit): reads a cycling `.fit` activity, cleans GPS outliers (speed gate → Hampel → Kalman/RTS), estimates power from physics, derives Normalized Power, FTP, TSS and Coggan zones, and writes a valid `.fit` back. Pure TypeScript, ESM, runs in Node, Bun and the browser.

```bash
bun add refit-core   # or: npm install refit-core
```

```ts
import { cleanTrack, estimatePower, sessionPowerStats } from "refit-core";
import { applyEnhancements } from "refit-core/fit";
import { readFit, writeFit } from "refit-core/node";

const { ordered, messages } = readFit("ride.fit");
const records = messages.recordMesgs ?? [];

const { verdicts } = cleanTrack(records);
const powers = estimatePower(records, {
  mass: { bikeKg: 8, riderKg: 82 },
  cda: "auto",
  crr: { surface: "good-asphalt", tires: "road", pressure: "high" },
});
const powerStats = sessionPowerStats(records, powers);

applyEnhancements(ordered, { verdicts, smooth: true, powers, powerStats });
writeFit("ride.out.fit", ordered);
```

Three entry points:

| Entry | Pulls in | Contents |
| --- | --- | --- |
| `refit-core` | nothing | cleaning pipeline, power model, NP / FTP / TSS / zones, configs and defaults |
| `refit-core/fit` | `@garmin/fitsdk` | `decodeFit`, `encodeFit`, `applyEnhancements` |
| `refit-core/node` | `node:fs` | `readFit`, `writeFit` |

Full API and the algorithms: [docs/library.md](https://github.com/dmitrytarassov/refit/blob/main/docs/library.md), [docs/track-cleaning.md](https://github.com/dmitrytarassov/refit/blob/main/docs/track-cleaning.md), [docs/power-estimation.md](https://github.com/dmitrytarassov/refit/blob/main/docs/power-estimation.md).

## Licensing

`refit-core` itself is MIT. The FIT decoder/encoder comes from [`@garmin/fitsdk`](https://www.npmjs.com/package/@garmin/fitsdk), which Garmin distributes under its own [FIT Protocol License](https://github.com/garmin/fit-javascript-sdk/blob/main/LICENSE.txt) (proprietary, royalty-free, not open source). This package does not bundle or redistribute any Garmin code: the SDK is a regular npm dependency that your package manager fetches from Garmin's package, and by installing it you accept Garmin's license. Only the `refit-core/fit` entry imports the SDK; the root `refit-core` entry (cleaning pipeline, power model, metrics) has no dependencies and is MIT through and through.
