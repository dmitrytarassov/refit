import type { Activity } from "../types/activity";

export function useEnhanceDownload(activity: Activity): () => void {
  return async () => {
    const [{ applyEnhancements }, { encodeFit }] = await Promise.all([
      import("../../lib/pipeline/apply-enhancements"),
      import("../../lib/fit/encode-fit"),
    ]);
    applyEnhancements(activity.fit.ordered, {
      verdicts: activity.verdicts,
      smooth: false,
      powers: activity.powers,
      powerStats: activity.powerStats,
    });
    const bytes = new Uint8Array(encodeFit(activity.fit.ordered));
    const blob = new Blob([bytes], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${activity.fileName.replace(/\.fit$/i, "")}.enhanced.fit`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
}
