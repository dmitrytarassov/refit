import { type PowerConfig } from "refit-core";

import { basename, dirname, join } from "path";

import { type CliOptions } from "./options";

export function parseArgs(argv: string[]): CliOptions {
  const flags = new Map<string, string | true>();
  const positional: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) {
      positional.push(a);
    } else if (i + 1 < argv.length && !argv[i + 1].startsWith("--")) {
      flags.set(a.slice(2), argv[++i]);
    } else {
      flags.set(a.slice(2), true);
    }
  }

  const input = positional[0];
  if (!input) {
    console.error(
      "Usage: refit <file.fit> [--smooth] [--power]\n" +
        "  --smooth                       replace accepted positions with Kalman/RTS-smoothed ones\n" +
        "  --power                        estimate and embed cycling power\n" +
        "  --bike-mass <kg>               (default 8)\n" +
        "  --rider-mass <kg>              (default 82)\n" +
        "  --gear-mass <kg>               (default 2)\n" +
        "  --bottles <ml,ml,...>          bottle volumes, counted full (default none)\n" +
        "  --cda auto|tops|hoods|drops|aero   (default auto: drops above 33 km/h, else hoods)\n" +
        "  --surface good-asphalt|rough-asphalt|gravel  (default good-asphalt)\n" +
        "  --tires road|endurance|gravel|mtb            (default road)\n" +
        "  --pressure high|medium|low                   (default high)",
    );
    process.exit(1);
  }

  const num = (name: string, def: number): number => {
    const v = flags.get(name);
    if (v === undefined) {
      return def;
    }
    const n = Number(v);
    if (!Number.isFinite(n) || n <= 0) {
      throw new Error(`--${name}: expected a positive number, got "${v}"`);
    }
    return n;
  };
  const numList = (name: string): number[] | undefined => {
    const v = flags.get(name);
    if (v === undefined) {
      return undefined;
    }
    const values = String(v).split(",").map(Number);
    if (values.some((n) => !Number.isFinite(n) || n <= 0)) {
      throw new Error(
        `--${name}: expected comma-separated positive numbers, got "${v}"`,
      );
    }
    return values;
  };
  const oneOf = <T extends string>(
    name: string,
    allowed: readonly T[],
    def: T,
  ): T => {
    const v = flags.get(name);
    if (v === undefined) {
      return def;
    }
    if (typeof v !== "string" || !allowed.includes(v as T)) {
      throw new Error(
        `--${name}: expected one of ${allowed.join("|")}, got "${v}"`,
      );
    }
    return v as T;
  };

  const power: PowerConfig | null = flags.has("power")
    ? {
        mass: {
          bikeKg: num("bike-mass", 8),
          riderKg: num("rider-mass", 82),
          gearKg: num("gear-mass", 2),
          bottlesMl: numList("bottles"),
        },
        cda: oneOf(
          "cda",
          ["auto", "tops", "hoods", "drops", "aero"] as const,
          "auto",
        ),
        crr: {
          surface: oneOf(
            "surface",
            ["good-asphalt", "rough-asphalt", "gravel"] as const,
            "good-asphalt",
          ),
          tires: oneOf(
            "tires",
            ["road", "endurance", "gravel", "mtb"] as const,
            "road",
          ),
          pressure: oneOf(
            "pressure",
            ["high", "medium", "low"] as const,
            "high",
          ),
        },
      }
    : null;

  return {
    input,
    output: join(
      dirname(input),
      `${basename(input).replace(/\.fit$/i, "")}.out.fit`,
    ),
    smooth: flags.has("smooth"),
    power,
  };
}
