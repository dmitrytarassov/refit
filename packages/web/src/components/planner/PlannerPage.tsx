import type { ReactElement } from "react";

import { PlannerEditor } from "./PlannerEditor";

import { useSavedWorkout } from "../../hooks/use-saved-workout";
import { useT } from "../../hooks/use-translation";

/** Loads the workout behind `?workout=id` (if any) and hands it to the editor. */
export function PlannerPage(): ReactElement {
  const { t } = useT();
  const { loaded, loading, missing, status, persist } = useSavedWorkout();

  if (loading) {
    return <p className="planner-status">{t.common.loading}</p>;
  }
  if (missing) {
    return <p className="planner-status">{t.planner.notFound}</p>;
  }
  return (
    <PlannerEditor loaded={loaded} saveStatus={status} onPersist={persist} />
  );
}
