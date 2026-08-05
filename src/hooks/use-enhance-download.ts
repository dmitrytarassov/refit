import type { Activity } from "../types/activity";
import type { DownloadOptions } from "../types/download-options";

export function useEnhanceDownload(activity: Activity): {
  hasDevicePower: boolean;
  download: (options: DownloadOptions) => void;
} {
  const hasDevicePower = activity.records.some(
    (record) => typeof record.power === "number",
  );

  const download = async ({
    coordinates,
    power,
  }: DownloadOptions): Promise<void> => {
    const [{ applyEnhancements }, { encodeFit }] = await Promise.all([
      import("../../lib/pipeline/apply-enhancements"),
      import("../../lib/fit/encode-fit"),
    ]);
    const ordered = structuredClone(activity.fit.ordered);
    applyEnhancements(ordered, {
      verdicts: coordinates ? activity.verdicts : new Map(),
      smooth: false,
      powers: power ? activity.powers : null,
      powerStats: power ? activity.powerStats : null,
    });
    const bytes = new Uint8Array(encodeFit(ordered));
    const blob = new Blob([bytes], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${activity.fileName.replace(/\.fit$/i, "")}.enhanced.fit`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return { hasDevicePower, download };
}
