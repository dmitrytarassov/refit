import { parseArgs } from "./parse-args";

import { readFit } from "../lib/fit/read-fit";
import { writeFit } from "../lib/fit/write-fit";
import { applyEnhancements } from "../lib/pipeline/apply-enhancements";
import { cleanTrack } from "../lib/pipeline/clean-track";
import { estimatePower } from "../lib/power/estimate-power";
import { sessionPowerStats } from "../lib/power/session-stats";

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
