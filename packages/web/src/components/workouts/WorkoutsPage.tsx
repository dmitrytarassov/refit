import type { ReactElement } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { WorkoutsTable } from "./WorkoutsTable";
import "./WorkoutsPage.css";

import { useT } from "../../hooks/use-translation";
import { useWorkoutList } from "../../hooks/use-workout-list";

export function WorkoutsPage(): ReactElement {
  const { workouts, loading, remove } = useWorkoutList();
  const { t } = useT();
  const [armedId, setArmedId] = useState<number | null>(null);

  const handleDelete = (id: number): void => {
    if (armedId === id) {
      setArmedId(null);
      remove(id);
    } else {
      setArmedId(id);
    }
  };

  let body: ReactElement;
  if (loading) {
    body = <p className="workouts-empty">{t.common.loading}</p>;
  } else if (workouts.length === 0) {
    body = <p className="workouts-empty">{t.workouts.empty}</p>;
  } else {
    body = (
      <WorkoutsTable
        workouts={workouts}
        armedId={armedId}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <section className="workouts-page">
      <header className="workouts-header">
        <h2>{t.workouts.title}</h2>
        <Link to="/?view=planner" className="workouts-new">
          {t.workouts.newWorkout}
        </Link>
      </header>
      {body}
    </section>
  );
}
