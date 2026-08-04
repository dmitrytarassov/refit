import { writeFileSync } from "fs";

import { encodeFit } from "./encode-fit";
import type { OrderedMesg } from "./ordered-mesg";

export function writeFit(path: string, ordered: OrderedMesg[]): void {
  writeFileSync(path, encodeFit(ordered));
}
