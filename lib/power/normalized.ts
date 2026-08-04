/**
 * Normalized Power (Coggan): 30-second rolling average of power, raised to the
 * 4th power, averaged, then the 4th root. Weighs surges the way physiology
 * does — a spiky ride "costs" more than its plain average suggests.
 */
export function normalizedPowerW(
  samples: Array<{ t: number; p: number }>,
): number | null {
  if (samples.length < 2) {
    return null;
  }

  const windowS = 30;
  let sum = 0;
  let count = 0;
  let fourthPowerSum = 0;
  let windows = 0;
  let lo = 0;

  for (let i = 0; i < samples.length; i++) {
    sum += samples[i].p;
    count++;
    while (samples[lo].t < samples[i].t - windowS) {
      sum -= samples[lo].p;
      count--;
      lo++;
    }
    if (samples[i].t - samples[0].t >= windowS) {
      fourthPowerSum += (sum / count) ** 4;
      windows++;
    }
  }
  return windows > 0 ? (fourthPowerSum / windows) ** 0.25 : null;
}
