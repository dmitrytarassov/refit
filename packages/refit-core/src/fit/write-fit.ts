import { writeFileSync } from "node:fs";

import { encodeFit } from "./encode-fit.js";
import type { OrderedMesg } from "./ordered-mesg.js";

export function writeFit(path: string, ordered: OrderedMesg[]): void {
  writeFileSync(path, encodeFit(ordered));
}
