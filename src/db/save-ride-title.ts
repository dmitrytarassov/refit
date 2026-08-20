import { getRide } from "./get-ride";
import { updateRide } from "./update-ride";

/** Stores the custom ride name shown on the share image; an empty string removes it. */
export async function saveRideTitle(id: number, title: string): Promise<void> {
  const row = await getRide(id);
  if (row == null) {
    return;
  }
  const trimmed = title.trim();
  await updateRide(
    trimmed === "" ? { ...row, title: undefined } : { ...row, title: trimmed },
  );
}
