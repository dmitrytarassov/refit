/** TSS = sec · NP · IF / (FTP · 3600) · 100, with IF = NP / FTP. */
export function computeTss(
  durationSec: number,
  normalizedPower: number,
  ftp: number,
): number {
  if (ftp <= 0 || durationSec <= 0) {
    return 0;
  }
  return Math.round((durationSec * (normalizedPower / ftp) ** 2) / 36);
}
