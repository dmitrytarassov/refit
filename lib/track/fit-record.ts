/** A record message with the fields the pipeline cares about. */
export interface FitRecord {
  timestamp?: Date;
  positionLat?: number; // semicircles
  positionLong?: number; // semicircles
  speed?: number; // m/s
  enhancedSpeed?: number; // m/s
  altitude?: number; // m
  enhancedAltitude?: number; // m
  grade?: number; // percent
  temperature?: number; // Celsius
  cadence?: number; // rpm
  power?: number; // watts
  [key: string]: unknown;
}
