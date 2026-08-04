/**
 * Hampel filter over the implied-speed series (distance between consecutive
 * fixes divided by dt). A point is an outlier if reaching it required moving
 * much faster than the local rolling median suggests, measured in robust
 * sigmas (1.4826 * MAD). Unlike the speed gate, this needs no trusted device
 * speed — the track is judged against its own local statistics.
 *
 * One-sided on purpose: GPS glitches teleport points away (implied speed too
 * high); implied speed below the median is normal riding, not an error.
 */
export interface HampelConfig {
  /** Half-window: statistics use `windowHalf` implied speeds on each side. */
  windowHalf: number;
  /** Rejection threshold in robust sigmas. */
  nSigmas: number;
  /** Floor for the robust sigma, m/s — keeps near-constant segments (MAD ~ 0) from over-flagging. */
  minSigmaMps: number;
}
