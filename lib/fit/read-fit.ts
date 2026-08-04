import { readFileSync } from "fs";

import { decodeFit } from "./decode-fit";
import type { FitFile } from "./ordered-mesg";

export function readFit(path: string): FitFile {
  return decodeFit(new Uint8Array(readFileSync(path)));
}
