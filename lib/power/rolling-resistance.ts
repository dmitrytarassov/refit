import type { Surface } from "./surface";
import type { TirePressure } from "./tire-pressure";
import type { TireType } from "./tire-type";

export interface RollingResistance {
  surface: Surface;
  tires: TireType;
  pressure: TirePressure;
}
