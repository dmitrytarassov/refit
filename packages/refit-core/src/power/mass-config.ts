export interface MassConfig {
  bikeKg: number;
  riderKg: number;
  /** Everything the rider carries: helmet, shoes, phone, bike computer… Defaults to DEFAULT_GEAR_KG. */
  gearKg?: number;
  /** Bottle volumes in ml; counted full for the whole ride (1 L ≈ 1 kg). */
  bottlesMl?: number[];
}
