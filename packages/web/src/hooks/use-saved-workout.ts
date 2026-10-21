import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getWorkout } from "../db/get-workout";
import { saveWorkout } from "../db/save-workout";
import type { WorkoutRow } from "../db/workout-row";
import type { SaveStatus } from "../types/save-status";

const SAVED_BADGE_MS = 2000;

/**
 * The saved workout behind `?workout=id`: `loaded` is the row fetched for
 * that id (null for a new workout), `loading` is true while it is being
 * fetched, `missing` when the id is not in the store. `persist` writes the
 * current content to the same row — or adds one and puts its id into the
 * URL (replace, no navigation visible). A row the page itself just saved is
 * not fetched back, so the undo history survives a save. `status` turns
 * "saved" for two seconds after a write.
 */
export function useSavedWorkout(): {
  loaded: WorkoutRow | null;
  loading: boolean;
  missing: boolean;
  status: SaveStatus;
  persist: (
    data: Pick<WorkoutRow, "name" | "blocks" | "ftp" | "durationSec" | "tss">,
  ) => Promise<void>;
} {
  const [params, setParams] = useSearchParams();
  const idParam = params.get("workout");
  const id =
    idParam == null || Number.isNaN(Number(idParam)) ? null : Number(idParam);
  const [loaded, setLoaded] = useState<WorkoutRow | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [createdAt, setCreatedAt] = useState<number | null>(null);
  const [missing, setMissing] = useState(false);
  const [status, setStatus] = useState<SaveStatus>("idle");

  useEffect(() => {
    if (id == null) {
      setLoaded(null);
      setSavedId(null);
      setCreatedAt(null);
      setMissing(false);
      return undefined;
    }
    if (id === savedId) {
      return undefined;
    }
    let cancelled = false;
    getWorkout(id).then((row) => {
      if (cancelled) {
        return;
      }
      if (row == null) {
        setMissing(true);
        return;
      }
      setLoaded(row);
      setSavedId(id);
      setCreatedAt(row.createdAt);
      setMissing(false);
    });
    return () => {
      cancelled = true;
    };
  }, [id, savedId]);

  useEffect(() => {
    if (status !== "saved") {
      return undefined;
    }
    const timer = window.setTimeout(() => setStatus("idle"), SAVED_BADGE_MS);
    return () => window.clearTimeout(timer);
  }, [status]);

  const persist = async (
    data: Pick<WorkoutRow, "name" | "blocks" | "ftp" | "durationSec" | "tss">,
  ): Promise<void> => {
    setStatus("saving");
    const now = Date.now();
    // An `id` key holding undefined is not a valid IndexedDB key — the
    // property has to be absent for autoIncrement to assign one.
    const row: WorkoutRow = {
      ...data,
      ...(savedId == null ? {} : { id: savedId }),
      createdAt: createdAt ?? now,
      updatedAt: now,
    };
    const key = await saveWorkout(row);
    setCreatedAt(row.createdAt);
    setSavedId(key);
    setStatus("saved");
    if (key !== id) {
      setParams(
        (current) => {
          const next = new URLSearchParams(current);
          next.set("workout", String(key));
          return next;
        },
        { replace: true },
      );
    }
  };

  return {
    loaded,
    loading: id != null && id !== savedId && !missing,
    missing,
    status,
    persist,
  };
}
