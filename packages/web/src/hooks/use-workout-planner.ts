import { useEffect, useState } from "react";

import { useHistoryState } from "./use-history-state";

import type { WorkoutRow } from "../db/workout-row";
import { addStepTo } from "../planner/add-step-to";
import { updateRepeatAt, updateStepAt } from "../planner/edit-blocks";
import { removeBlockAt } from "../planner/remove-block";
import { EMPTY_REPEAT } from "../planner/repeat-defaults";
import { workoutSeconds, workoutTss } from "../planner/workout-totals";
import type { RepeatBlock, WorkoutBlock } from "../types/repeat-block";
import type { StepRef } from "../types/step-ref";
import type { Workout } from "../types/workout";
import type { WorkoutStep } from "../types/workout-step";

const EMPTY_WORKOUT: Workout = { name: "", blocks: [] };

/** Planner editing state; `loaded` (a saved row, or null for a new workout) resets it whenever it changes. */
export function useWorkoutPlanner(loaded: WorkoutRow | null): {
  workout: Workout;
  ftp: number;
  weightKg: number;
  totalSeconds: number;
  tss: number;
  selected: StepRef | null;
  canUndo: boolean;
  canRedo: boolean;
  select: (ref: StepRef | null) => void;
  toggleRepeat: (index: number) => void;
  rename: (name: string) => void;
  addStep: (step: WorkoutStep) => void;
  addRepeat: () => void;
  updateStep: (ref: StepRef, patch: Partial<WorkoutStep>) => void;
  updateRepeat: (
    index: number,
    patch: Partial<Pick<RepeatBlock, "times" | "skipLast">>,
  ) => void;
  removeSelected: () => void;
  replaceBlocks: (blocks: WorkoutBlock[]) => void;
  appendBlocks: (blocks: WorkoutBlock[]) => void;
  undo: () => void;
  redo: () => void;
  setFtp: (value: number) => void;
  setWeightKg: (value: number) => void;
} {
  const {
    state: workout,
    set: setWorkout,
    reset,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistoryState<Workout>(EMPTY_WORKOUT);
  const [ftp, setFtp] = useState(200);
  const [weightKg, setWeightKg] = useState(82);
  const [selected, setSelected] = useState<StepRef | null>(null);

  useEffect(() => {
    reset(
      loaded == null
        ? EMPTY_WORKOUT
        : { name: loaded.name, blocks: loaded.blocks },
    );
    if (loaded != null) {
      setFtp(loaded.ftp);
    }
    setSelected(null);
  }, [loaded, reset]);

  const toggleRepeat = (index: number): void => {
    setSelected((current) =>
      current != null && current.index === index && current.child == null
        ? null
        : { index },
    );
  };

  const rename = (name: string): void => {
    setWorkout((current) =>
      current.name === name ? current : { ...current, name },
    );
  };

  const addStep = (step: WorkoutStep): void => {
    setWorkout((current) => ({
      ...current,
      blocks: addStepTo(current.blocks, selected, step),
    }));
  };

  const addRepeat = (): void => {
    setWorkout((current) => ({
      ...current,
      blocks: [...current.blocks, { ...EMPTY_REPEAT, steps: [] }],
    }));
  };

  const updateStep = (ref: StepRef, patch: Partial<WorkoutStep>): void => {
    setWorkout((current) => ({
      ...current,
      blocks: updateStepAt(current.blocks, ref, patch),
    }));
  };

  const updateRepeat = (
    index: number,
    patch: Partial<Pick<RepeatBlock, "times" | "skipLast">>,
  ): void => {
    setWorkout((current) => ({
      ...current,
      blocks: updateRepeatAt(current.blocks, index, patch),
    }));
  };

  const removeSelected = (): void => {
    if (selected == null) {
      return;
    }
    setWorkout((current) => ({
      ...current,
      blocks: removeBlockAt(current.blocks, selected),
    }));
    setSelected(null);
  };

  const replaceBlocks = (blocks: WorkoutBlock[]): void => {
    setWorkout((current) => ({ ...current, blocks }));
    setSelected(null);
  };

  const appendBlocks = (blocks: WorkoutBlock[]): void => {
    setWorkout((current) => ({
      ...current,
      blocks: [...current.blocks, ...blocks],
    }));
  };

  // The selection addresses blocks by position; a different past or future
  // may not have that position, so it is dropped on every jump.
  const jump = (step: () => void): void => {
    step();
    setSelected(null);
  };

  return {
    workout,
    ftp,
    weightKg,
    totalSeconds: workoutSeconds(workout.blocks),
    tss: workoutTss(workout.blocks),
    selected,
    canUndo,
    canRedo,
    select: setSelected,
    toggleRepeat,
    rename,
    addStep,
    addRepeat,
    updateStep,
    updateRepeat,
    removeSelected,
    replaceBlocks,
    appendBlocks,
    undo: () => jump(undo),
    redo: () => jump(redo),
    setFtp,
    setWeightKg,
  };
}
