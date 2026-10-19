import { describe, expect, test } from "bun:test";

import { deriveGrades } from "../src/power/derive-grades.js";

describe("deriveGrades", () => {
  test("constant climb gives the exact slope, edges use the shrunken window", () => {
    const n = 30;
    const altitudes = Array.from({ length: n }, (_, i) => 100 + i * 0.5);
    const distances = Array.from({ length: n }, (_, i) => i * 10);
    const grades = deriveGrades(altitudes, distances);
    for (const g of grades) {
      expect(g).toBeCloseTo(5, 9);
    }
  });

  test("undefined where an input is missing or the window covers under 5 m", () => {
    const altitudes = Array.from({ length: 20 }, () => 100);
    const stopped = Array.from({ length: 20 }, () => 42);
    expect(deriveGrades(altitudes, stopped).every((g) => g === undefined)).toBe(
      true,
    );

    const distances = Array.from({ length: 20 }, (_, i) => i * 10);
    const holes = [...altitudes];
    holes[15] = undefined as unknown as number;
    const grades = deriveGrades(holes, distances);
    expect(grades[10]).toBeUndefined();
    expect(grades[9]).toBe(0);
  });
});
