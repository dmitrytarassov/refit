import type { PipelineConfig } from "./pipeline-config";
import { DEFAULT_PIPELINE } from "./pipeline-defaults";
import type { CleanResult, Verdict } from "./verdict";

import { hampel } from "../filters/hampel";
import { kalmanRts } from "../filters/kalman-rts";
import { speedGate } from "../filters/speed-gate";
import { extractTrack } from "../track/extract-track";
import type { FitRecord } from "../track/fit-record";

export function cleanTrack(
  records: FitRecord[],
  cfg: PipelineConfig = DEFAULT_PIPELINE,
): CleanResult {
  const verdicts = new Map<number, Verdict>();
  const report = {
    totalRecords: records.length,
    withGps: 0,
    rejectedBy: {
      "speed-gate": 0 as number,
      hampel: 0 as number,
      kalman: 0 as number,
    },
    accepted: 0,
  };

  const track = extractTrack(records);
  if (!track) {
    return { verdicts, report };
  }
  report.withGps = track.points.length;

  let active = track.points;
  const reject = (
    indexes: Set<number>,
    stage: "speed-gate" | "hampel" | "kalman",
  ): void => {
    for (const recordIndex of indexes) {
      verdicts.set(recordIndex, { status: "rejected", rejectedBy: stage });
    }
    report.rejectedBy[stage] = indexes.size;
    active = active.filter((p) => !indexes.has(p.recordIndex));
  };

  if (cfg.speedGate) {
    reject(speedGate(active, cfg.speedGate), "speed-gate");
  }
  if (cfg.hampel) {
    reject(hampel(active, cfg.hampel), "hampel");
  }

  if (cfg.kalman) {
    const { rejected, smoothed } = kalmanRts(active, cfg.kalman);
    reject(rejected, "kalman");
    for (const p of active) {
      const s = smoothed.get(p.recordIndex);
      verdicts.set(p.recordIndex, {
        status: "accepted",
        smoothed: s ? track.projection.toGeo(s.x, s.y) : undefined,
      });
    }
  } else {
    for (const p of active) {
      verdicts.set(p.recordIndex, { status: "accepted" });
    }
  }

  report.accepted = active.length;
  return { verdicts, report };
}
