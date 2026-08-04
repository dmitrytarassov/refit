/** Air density from temperature and altitude (barometric formula, dry air). */
export function airDensityKgM3(tempC: number, altitudeM: number): number {
  const pressurePa = 101325 * Math.pow(1 - 2.25577e-5 * altitudeM, 5.25588);
  return pressurePa / (287.05 * (tempC + 273.15));
}
