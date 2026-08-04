import type { ReactElement } from "react";

export function TrackCleaningHelp(): ReactElement {
  return (
    <article className="help-card">
      <h3>GPS track cleaning</h3>
      <p>
        GPS receivers occasionally &laquo;teleport&raquo; points (multipath in
        cities, cold starts, lost satellites). Every GPS point goes through
        three filters, cheapest to smartest; each stage only sees points that
        survived the previous one. All geometry is computed in a local metric
        projection around the first point of the track. Rejected points are kept
        in the file &mdash; only their coordinates are erased.
      </p>
      <pre className="help-formula">{`GPS points → speed gate → Hampel → Kalman + RTS → verdicts`}</pre>

      <h4>1. Speed gate — physical plausibility</h4>
      <p>
        A point is rejected when it sits farther from the <em>last accepted</em>{" "}
        point than the device speed allows:
      </p>
      <pre className="help-formula">{`reject if D > max(k · v · Δt, D_min)`}</pre>
      <p>
        with tolerance k = 2, floor D_min = 10 m (so honest GPS noise at stops
        survives), device speed v trusted only up to 30 m/s and defaulting to 10
        m/s when missing. Comparing against the last <em>accepted</em> point
        means a run of consecutive outliers cannot drag the threshold along with
        itself.
      </p>

      <h4>2. Hampel filter — robust statistics</h4>
      <p>
        No trust in device speed: the track judges itself. For each point the
        implied speed (distance to last accepted / Δt) is compared to the
        rolling median over a ±5-point window, in robust sigmas:
      </p>
      <pre className="help-formula">{`σ = 1.4826 · MAD          (median absolute deviation, σ ≥ 1 m/s)
reject if v_implied − median > 6σ`}</pre>
      <p>
        The test is one-sided — only &laquo;too fast&raquo; is an outlier;
        riding slower than the median is normal. MAD-based sigma tolerates up to
        50% garbage inside the window.
      </p>

      <h4>3. Kalman filter + RTS smoothing — motion model</h4>
      <p>
        State [x, y, vx, vy], constant-velocity model with white acceleration
        noise (σ_a = 1 m/s²), GPS position noise σ_gps = 6 m. A measurement is
        rejected when its Mahalanobis distance from the prediction exceeds the
        gate:
      </p>
      <pre className="help-formula">{`reject if d² > 13.82          (χ² for 2 DoF ≈ 99.9%)`}</pre>
      <p>
        Prediction uncertainty grows with Δt, so the gate widens on its own
        until the honest track re-enters it. After 5 consecutive rejects or a
        gap over 60 s the filter assumes the track genuinely moved (tunnel, cold
        start) and re-initializes a new segment. Each finished segment then gets
        a backward Rauch–Tung–Striebel pass — processing is offline, so every
        estimate uses the whole track, not just the past. The smoothed
        coordinates are what the optional &laquo;smooth&raquo; mode writes to
        the file.
      </p>
    </article>
  );
}
