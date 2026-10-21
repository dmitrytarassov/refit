import { describe, expect, test } from "bun:test";

import { parseWorkoutText } from "../src/planner/parse-workout-text";
import { workoutSeconds } from "../src/planner/workout-totals";
import type { WorkoutBlock } from "../src/types/repeat-block";
import type { WorkoutStep } from "../src/types/workout-step";

/** FTP 100 keeps the fractions readable: 146 W → 1.46. */
const FTP = 100;

const steady = (seconds: number, watts: number): WorkoutStep => ({
  kind: "steady",
  seconds,
  from: watts / FTP,
  to: watts / FTP,
});

const repeat = (times: number, steps: WorkoutStep[]): WorkoutBlock => ({
  kind: "repeat",
  times,
  skipLast: false,
  steps,
});

const SIMPLE = `Каденс по умолчанию · 80–95 об/мин
Разминка
5:00
ВРЕМЯ
МОЩНОСТЬ
КАДЕНС · ОБ/МИН
5 мин

141–151Вт
Основная работа
1:05:00
ВРЕМЯ
МОЩНОСТЬ
КАДЕНС · ОБ/МИН
1 ч 5 мин

151–163Вт
Заминка
5:00
ВРЕМЯ
МОЩНОСТЬ
КАДЕНС · ОБ/МИН
5 мин

141–151Вт
`;

const INTERVALS = `Каденс по умолчанию · 80–95 об/мин
Разминка
16:00
ВРЕМЯ
МОЩНОСТЬ
КАДЕНС · ОБ/МИН
5 мин

140–151Вт
5 мин

151–162Вт
3×
30 сек

209–220Вт
30 сек

151–162Вт
3 мин

151–162Вт
Основная работа
1:07:00
ВРЕМЯ
МОЩНОСТЬ
КАДЕНС · ОБ/МИН
8×
5 мин

209–220Вт
75–85
2 мин

140–151Вт
75–85
11 мин

151–162Вт
Заминка
5:00
ВРЕМЯ
МОЩНОСТЬ
КАДЕНС · ОБ/МИН
5 мин

151–162Вт
`;

const SPRINTS = `Каденс по умолчанию · 80–95 об/мин
Разминка
15:00
ВРЕМЯ
МОЩНОСТЬ
КАДЕНС · ОБ/МИН
5 мин

140–151Вт
5 мин

151–162Вт
2×
20 сек

246–257Вт
40 сек

151–162Вт
3 мин

151–162Вт
Основная работа
16:48
ВРЕМЯ
МОЩНОСТЬ
КАДЕНС · ОБ/МИН
3×
16 сек

—
110–140
ускорение сидя в седле
2 мин

151–162Вт
10 мин

151–162Вт
Заминка
5:00
ВРЕМЯ
МОЩНОСТЬ
КАДЕНС · ОБ/МИН
5 мин

151–162Вт
`;

describe("parseWorkoutText", () => {
  test("one steady step per section; the power band's midpoint becomes the target", () => {
    expect(parseWorkoutText(SIMPLE, FTP)).toEqual([
      steady(300, 146),
      steady(3900, 157),
      steady(300, 146),
    ]);
  });

  test("a multiplier repeats the steps after it except the section's last one", () => {
    expect(parseWorkoutText(INTERVALS, FTP)).toEqual([
      // Warm-up 16:00
      steady(300, 146),
      steady(300, 157),
      repeat(3, [steady(30, 215), steady(30, 157)]),
      steady(180, 157),
      // Main 1:07:00
      repeat(8, [steady(300, 215), steady(120, 146)]),
      steady(660, 157),
      // Cool-down 5:00
      steady(300, 157),
    ]);
  });

  test("parsed length matches the declared section durations", () => {
    const blocks = parseWorkoutText(INTERVALS, FTP) ?? [];
    expect(workoutSeconds(blocks)).toBe(16 * 60 + 67 * 60 + 5 * 60);

    const sprints = parseWorkoutText(SPRINTS, FTP) ?? [];
    expect(workoutSeconds(sprints)).toBe(15 * 60 + (16 * 60 + 48) + 5 * 60);
  });

  test("a step without a power target is a free ride; its description becomes the note, cadence is dropped", () => {
    const blocks = parseWorkoutText(SPRINTS, FTP) ?? [];
    expect(blocks[4]).toEqual(
      repeat(3, [
        {
          kind: "free",
          seconds: 16,
          from: 0.5,
          to: 0.5,
          note: "ускорение сидя в седле",
        },
        steady(120, 157),
      ]),
    );
    expect(blocks).toHaveLength(7);
    expect(blocks[2]).toEqual(repeat(2, [steady(20, 252), steady(40, 157)]));
  });

  test("the FTP sets the scale of the fractions", () => {
    const [warmUp] = parseWorkoutText(SIMPLE, 200) ?? [];
    expect(warmUp).toEqual({
      kind: "steady",
      seconds: 300,
      from: 0.73,
      to: 0.73,
    });
  });

  test("a multiplier followed by a single step repeats that step", () => {
    const text = `Основная работа
15:00
ВРЕМЯ
МОЩНОСТЬ
КАДЕНС · ОБ/МИН
3×
5 мин

200Вт
`;
    expect(parseWorkoutText(text, FTP)).toEqual([
      repeat(3, [steady(300, 200)]),
    ]);
  });

  test("a second multiplier closes the previous repeat", () => {
    const text = `Основная работа
20:00
ВРЕМЯ
МОЩНОСТЬ
КАДЕНС · ОБ/МИН
2×
1 мин

200Вт
1 мин

100Вт
4×
2 мин

300Вт
2 мин

100Вт
2 мин

120Вт
`;
    expect(parseWorkoutText(text, FTP)).toEqual([
      repeat(2, [steady(60, 200), steady(60, 100)]),
      repeat(4, [steady(120, 300), steady(120, 100)]),
      steady(120, 120),
    ]);
  });

  test("text without a section header is rejected", () => {
    expect(parseWorkoutText("5 мин\n\n141–151Вт\n", FTP)).toBeNull();
    expect(parseWorkoutText("", FTP)).toBeNull();
  });
});
