/**
 * 3-point rolling median over a series with gaps. Monotonic runs pass through
 * unchanged (the median of an ordered triple is its middle element), so real
 * accelerations and sprints survive; only single-sample V/Λ outliers — the
 * ones a sigma-based filter can miss — are flattened. A sample missing either
 * neighbor (edges, next to gaps) is returned as is.
 */
export function median3(
  values: Array<number | undefined>,
): Array<number | undefined> {
  return values.map((value, i) => {
    if (value == null) {
      return value;
    }
    const prev = i > 0 ? values[i - 1] : undefined;
    const next = i < values.length - 1 ? values[i + 1] : undefined;
    if (prev == null || next == null) {
      return value;
    }
    return Math.max(
      Math.min(prev, value),
      Math.min(Math.max(prev, value), next),
    );
  });
}
