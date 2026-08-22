import { readFileSync } from "node:fs";

import { decodeFit } from "./decode-fit.js";
import type { FitFile } from "./ordered-mesg.js";

export function readFit(path: string): FitFile {
  return decodeFit(new Uint8Array(readFileSync(path)));
}
