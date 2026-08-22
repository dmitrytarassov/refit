import type { SpeedGateConfig } from "./speed-gate-config.js";

import { distance } from "../geo/distance.js";
import type { GpsPoint } from "../track/gps-point.js";

export function speedGate(
  points: GpsPoint[],
  cfg: SpeedGateConfig,
): Set<number> {
  const rejected = new Set<number>();
  if (points.length === 0) {
    return rejected;
  }

  let lastAccepted = points[0];
  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    const dt = p.t - lastAccepted.t;
    if (dt <= 0) {
      rejected.add(p.recordIndex);
      continue;
    }
    const speed = Math.min(
      p.speed ?? lastAccepted.speed ?? cfg.fallbackSpeedMps,
      cfg.maxPlausibleSpeedMps,
    );
    const threshold = Math.max(
      cfg.toleranceFactor * speed * dt,
      cfg.minThresholdM,
    );
    if (distance(lastAccepted, p) > threshold) {
      rejected.add(p.recordIndex);
    } else {
      lastAccepted = p;
    }
  }
  return rejected;
}
