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

Full API and the algorithms: [docs/library.md](https://github.com/dmitrytarassov/refit/blob/main/docs/library.md), [docs/track-cleaning.md](https://github.com/dmitrytarassov/refit/blob/main/docs/track-cleaning.md), [docs/power-estimation.md](https://github.com/dmitrytarassov/refit/blob/main/docs/power-estimation.md). MIT.
