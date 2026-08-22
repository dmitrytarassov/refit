import { cleanTrack, estimatePower, sessionPowerStats } from "refit-core";
import { applyEnhancements } from "refit-core/fit";
import { readFit, writeFit } from "refit-core/node";

import { parseArgs } from "./parse-args";

export function run(argv: string[]): void {
  const opts = parseArgs(argv);
  const { ordered, messages, errors } = readFit(opts.input);
  if (errors.length) {
    console.warn("Decoder warnings:", errors);
  }

  const records = messages.recordMesgs ?? [];
  const { verdicts, report } = cleanTrack(records);
  const powers = opts.power ? estimatePower(records, opts.power) : null;
  const powerStats = powers ? sessionPowerStats(records, powers) : null;

  applyEnhancements(ordered, {
    verdicts,
    smooth: opts.smooth,
    powers,
    powerStats,
  });

  writeFit(opts.output, ordered);

  const r = report.rejectedBy;
  console.log(`${opts.input} -> ${opts.output}`);
  console.log(`Records: ${report.totalRecords}, with GPS: ${report.withGps}`);
  console.log(
    `Rejected: ${r["speed-gate"] + r.hampel + r.kalman} (speed-gate: ${r["speed-gate"]}, hampel: ${r.hampel}, kalman: ${r.kalman})`,
  );
  console.log(
    `Accepted: ${report.accepted}${opts.smooth ? " (positions RTS-smoothed)" : ""}`,
  );
  if (powerStats) {
    console.log(
      `Power: avg ${powerStats.avgPower} W, NP ${powerStats.normalizedPower ?? "-"} W, max ${powerStats.maxPower} W`,
    );
  }
}
