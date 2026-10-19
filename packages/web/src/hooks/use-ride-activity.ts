import { useEffect, useState } from "react";

import { useT } from "./use-translation";

import { getRide } from "../db/get-ride";
import { resolveRideSettings } from "../db/resolve-ride-settings";
import { decodeActivity } from "../fit/decode-activity";
import type { ProcessingState } from "../types/processing-state";

/** A saved ride by id, run through the same pipeline as the dashboard. */
export function useRideActivity(id: number): ProcessingState {
  const { t } = useT();
  const [state, setState] = useState<ProcessingState>({
    status: "processing",
    fileName: `#${id}`,
  });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "processing", fileName: `#${id}` });
    getRide(id)
      .then(async (row) => {
        if (row == null) {
          throw new Error(t.errors.rideNotFound(String(id)));
        }
        const settings = await resolveRideSettings(row.settings);
        const decoded = await decodeActivity(row.file, row.fileName, settings);
        if (!cancelled) {
          setState({
            status: "ready",
            activity: { ...decoded, title: row.title },
          });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            message: error instanceof Error ? error.message : String(error),
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return state;
}
