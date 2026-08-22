import { Decoder, Stream } from "@garmin/fitsdk";

import type { FitFile, OrderedMesg } from "./ordered-mesg.js";

export function decodeFit(data: Uint8Array): FitFile {
  const stream = Stream.fromByteArray(data);
  const decoder = new Decoder(stream);
  if (!decoder.isFIT()) {
    throw new Error("Not a FIT file");
  }
  if (!decoder.checkIntegrity()) {
    throw new Error("FIT file failed the CRC integrity check");
  }

  const ordered: OrderedMesg[] = [];
  const { messages, errors } = decoder.read({
    mesgListener: (mesgNum: number, mesg: OrderedMesg["mesg"]) => {
      ordered.push({ mesgNum, mesg });
    },
  });
  return { ordered, messages, errors };
}
