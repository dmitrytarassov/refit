import { lazy } from "react";

/** Carries recharts through the power curve card — kept out of the main chunk like the dashboard. */
export const ComparePage = lazy(() =>
  import("./compare/ComparePage").then((m) => ({ default: m.ComparePage })),
);

/** Its own chunk: the chart, toolbar, parser and modals are not needed on the dashboard. */
export const PlannerPage = lazy(() =>
  import("./planner/PlannerPage").then((m) => ({ default: m.PlannerPage })),
);
