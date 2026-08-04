import { Encoder } from "@garmin/fitsdk";

import type { OrderedMesg } from "./ordered-mesg";

export function encodeFit(ordered: OrderedMesg[]): Uint8Array {
  const encoder = new Encoder();
  for (const { mesgNum, mesg } of ordered) {
    encoder.onMesg(mesgNum, mesg);
  }
  return encoder.close();
}
