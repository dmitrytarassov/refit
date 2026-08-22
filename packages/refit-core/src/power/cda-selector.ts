import type { RiderPosition } from "./rider-position.js";

/** Either a fixed position, or "auto": drops above 33 km/h, hoods below. */
export type CdaSelector = RiderPosition | "auto";
