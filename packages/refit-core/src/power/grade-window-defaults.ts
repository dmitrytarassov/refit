/**
 * Half-window, in records, for the slope derived from altitude and distance
 * when the recording carries no `grade` field. FIT altitude is quantised to
 * 0.2 m, so a per-record difference is mostly noise; over ±5 records (≈10 s,
 * 50–100 m at riding speed) the quantisation step is under 0.5 % of grade.
 */
export const GRADE_WINDOW_HALF = 5;
