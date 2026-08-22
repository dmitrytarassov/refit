import type { Surface } from "./surface.js";
import type { TirePressure } from "./tire-pressure.js";
import type { TireType } from "./tire-type.js";

export interface RollingResistance {
  surface: Surface;
  tires: TireType;
  pressure: TirePressure;
}
