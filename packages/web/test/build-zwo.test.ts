import { describe, expect, test } from "bun:test";

import { buildZwo } from "../src/planner/export/build-zwo";
import type { WorkoutBlock } from "../src/types/repeat-block";

describe("buildZwo", () => {
  test("unrolls repeats, maps step kinds to ZWO elements and escapes text", () => {
    const blocks: WorkoutBlock[] = [
      { kind: "ramp", seconds: 300, from: 0.25, to: 0.75 },
      {
        kind: "repeat",
        times: 2,
        skipLast: true,
        steps: [
          {
            kind: "steady",
            seconds: 60,
            from: 1.21,
            to: 1.21,
            note: "Go <hard> & smooth",
          },
          { kind: "steady", seconds: 120, from: 0.5, to: 0.5 },
        ],
      },
      { kind: "free", seconds: 90, from: 0.5, to: 0.5 },
      { kind: "ramp", seconds: 300, from: 0.75, to: 0.25 },
    ];

    expect(buildZwo('Test "A" & B', blocks)).toBe(`<workout_file>
  <author>ReFit</author>
  <name>Test &quot;A&quot; &amp; B</name>
  <description></description>
  <sportType>bike</sportType>
  <tags></tags>
  <workout>
    <Warmup Duration="300" PowerLow="0.25" PowerHigh="0.75"/>
    <SteadyState Duration="60" Power="1.21">
      <textevent timeoffset="0" message="Go &lt;hard&gt; &amp; smooth"/>
    </SteadyState>
    <SteadyState Duration="120" Power="0.5"/>
    <SteadyState Duration="60" Power="1.21">
      <textevent timeoffset="0" message="Go &lt;hard&gt; &amp; smooth"/>
    </SteadyState>
    <FreeRide Duration="90"/>
    <Cooldown Duration="300" PowerLow="0.75" PowerHigh="0.25"/>
  </workout>
</workout_file>
`);
  });

  test("rounds targets to three decimals and skips blank notes", () => {
    const zwo = buildZwo("x", [
      {
        kind: "steady",
        seconds: 30,
        from: 146 / 220,
        to: 146 / 220,
        note: "  ",
      },
    ]);
    expect(zwo).toContain('<SteadyState Duration="30" Power="0.664"/>');
    expect(zwo).not.toContain("textevent");
  });
});
