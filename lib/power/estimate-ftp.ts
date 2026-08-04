import type { CurvePoint } from "./curve-point";
import type { FtpEstimate, FtpMethod } from "./ftp-estimate";

export function estimateFtp(curve: CurvePoint[]): FtpEstimate | null {
  const at = (sec: number): number | undefined =>
    curve.find((p) => p.durationSec === sec)?.watts;
  const p20 = at(1200);
  if (p20 == null) {
    return null;
  }

  const candidates: Array<[FtpMethod, number]> = [["twenty-min", p20 * 0.95]];
  const p5 = at(300);
  if (p5 != null) {
    candidates.push(["critical-power", (1200 * p20 - 300 * p5) / 900]);
  }
  const p60 = at(3600);
  if (p60 != null) {
    candidates.push(["best-hour", p60]);
  }

  let best = candidates[0];
  for (const c of candidates) {
    if (c[1] > best[1]) {
      best = c;
    }
  }
  return { watts: Math.round(best[1]), method: best[0] };
}
