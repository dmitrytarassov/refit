export interface OrderedMesg {
  mesgNum: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- decoded SDK mesg is untyped
  mesg: Record<string, any>;
}

export interface FitFile {
  /** Every known message in original file order — what gets written back. */
  ordered: OrderedMesg[];
  /** Messages grouped by type, as returned by the decoder (recordMesgs etc.). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- decoder output is untyped
  messages: Record<string, any>;
  errors: unknown[];
}
