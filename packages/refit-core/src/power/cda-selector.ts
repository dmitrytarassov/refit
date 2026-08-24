import type { AutoCdaConfig } from "./auto-cda-config.js";
import type { RiderPosition } from "./rider-position.js";

/**
 * How CdA is picked for each track point: a fixed position, a measured value
 * in m² (wind tunnel or aero pod), `"auto"` (DEFAULT_AUTO_CDA, a road bike),
 * or a speed ladder of your own.
 */
export type CdaSelector = RiderPosition | number | "auto" | AutoCdaConfig;
