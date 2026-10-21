import { buildZwo } from "../planner/export/build-zwo";
import { downloadDataUrl } from "../share/download-data-url";
import type { WorkoutBlock } from "../types/repeat-block";

/** `download(name, blocks)` saves `<name>.zwo` through a temporary object URL. */
export function useZwoDownload(): {
  download: (name: string, blocks: WorkoutBlock[]) => void;
} {
  const download = (name: string, blocks: WorkoutBlock[]): void => {
    const xml = buildZwo(name, blocks);
    const url = URL.createObjectURL(
      new Blob([xml], { type: "application/xml" }),
    );
    const base = name.trim().replace(/[\\/:*?"<>|]+/gu, "_") || "workout";
    downloadDataUrl(url, `${base}.zwo`);
    URL.revokeObjectURL(url);
  };
  return { download };
}
