export const METRIC_HELP = {
  avgPower:
    "Physics-based estimate from speed, grade, mass and air drag — no power meter needed. Coasting zeros included. Expect ±10–15% on a calm solo ride; see Help for the full model.",
  normalizedPower:
    "Coggan NP: 30-second rolling average of power, raised to the 4th power, averaged, 4th root. Weighs surges the way physiology feels them.",
  maxPower:
    "Highest single-record estimated power, after the speed series has been cleaned of recording glitches.",
  ftp: "Lower-bound estimate from this ride's power curve: the max of 0.95 × best 20 min, Critical Power (Monod, 5/20-min points) and best hour. Needs at least a 20-minute interval.",
  tss: "Timer time × (NP / FTP)² / 36. Our FTP is a lower bound, so treat TSS as an upper estimate.",
  intensityFactor:
    "NP / estimated FTP. Our FTP is a lower bound, so IF is an upper estimate.",
} as const;
