import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { cleanTrack } from "../../lib/pipeline/clean-track";
import { estimatePower } from "../../lib/power/estimate-power";
import { sessionPowerStats } from "../../lib/power/session-stats";
import type { FitRecord } from "../../lib/track/fit-record";
import { buildRideRow } from "../db/build-ride-row";
import { findRideByFileName } from "../db/find-ride-by-file-name";
import { getLastSettings } from "../db/get-last-settings";
import { getRide } from "../db/get-ride";
import { saveLastSettings } from "../db/save-last-settings";
import { saveRide } from "../db/save-ride";
import { updateRide } from "../db/update-ride";
import { POWER_DEFAULTS } from "../fit/power-defaults";
import type { Activity } from "../types/activity";
import type { ProcessingState } from "../types/processing-state";
import type { RideSettings } from "../types/ride-settings";

async function decodeActivity(
  buffer: ArrayBuffer,
  fileName: string,
  settings: RideSettings,
): Promise<Activity> {
  const { decodeFit } = await import("../../lib/fit/decode-fit");
  const fit = decodeFit(new Uint8Array(buffer));
  const records: FitRecord[] = fit.messages.recordMesgs ?? [];
  const { verdicts, report } = cleanTrack(records);
  const powers = estimatePower(records, {
    ...POWER_DEFAULTS,
    cda: settings.cda,
    crr: settings.crr,
  });
  const powerStats = sessionPowerStats(records, powers);
  return {
    fileName,
    fit,
    records,
    verdicts,
    report,
    powers,
    powerStats,
    settings,
  };
}

export function useFitProcessing(): {
  state: ProcessingState;
  processFile: (file: File) => void;
  updateSettings: (settings: RideSettings) => void;
} {
  const [searchParams, setSearchParams] = useSearchParams();
  const recordParam = searchParams.get("record");
  const loadedRecordRef = useRef<string | null>(null);
  const [state, setState] = useState<ProcessingState>(() =>
    recordParam != null
      ? { status: "processing", fileName: `#${recordParam}` }
      : { status: "idle" },
  );

  const processFile = (file: File): void => {
    setState({ status: "processing", fileName: file.name });
    file
      .arrayBuffer()
      .then(async (buffer) => {
        const settings = await getLastSettings();
        const activity = await decodeActivity(buffer, file.name, settings);
        const existing = await findRideByFileName(file.name);
        const id =
          existing?.id ?? (await saveRide(buildRideRow(activity, buffer)));
        loadedRecordRef.current = String(id);
        setSearchParams({ record: String(id) }, { replace: true });
        setState({ status: "ready", activity });
      })
      .catch((error: unknown) => {
        setState({
          status: "error",
          message: error instanceof Error ? error.message : String(error),
        });
      });
  };

  const updateSettings = (settings: RideSettings): void => {
    if (state.status !== "ready") {
      return;
    }
    const { activity } = state;
    const powers = estimatePower(activity.records, {
      ...POWER_DEFAULTS,
      cda: settings.cda,
      crr: settings.crr,
    });
    const powerStats = sessionPowerStats(activity.records, powers);
    const next: Activity = { ...activity, powers, powerStats, settings };
    setState({ status: "ready", activity: next });
    void saveLastSettings(settings);
    const id = loadedRecordRef.current;
    if (id == null) {
      return;
    }
    void getRide(Number(id)).then((row) => {
      if (row == null) {
        return;
      }
      return updateRide({ ...buildRideRow(next, row.file), id: Number(id) });
    });
  };

  useEffect(() => {
    if (recordParam == null) {
      if (loadedRecordRef.current != null) {
        loadedRecordRef.current = null;
        setState({ status: "idle" });
      }
      return;
    }
    if (recordParam === loadedRecordRef.current) {
      return;
    }
    loadedRecordRef.current = recordParam;
    setState({ status: "processing", fileName: `#${recordParam}` });
    getRide(Number(recordParam))
      .then(async (row) => {
        if (row == null) {
          setState({
            status: "error",
            message: `Ride #${recordParam} not found in history`,
          });
          return;
        }
        const settings = row.settings ?? (await getLastSettings());
        setState({
          status: "ready",
          activity: await decodeActivity(row.file, row.fileName, settings),
        });
      })
      .catch((error: unknown) => {
        setState({
          status: "error",
          message: error instanceof Error ? error.message : String(error),
        });
      });
  }, [recordParam]);

  return { state, processFile, updateSettings };
}
