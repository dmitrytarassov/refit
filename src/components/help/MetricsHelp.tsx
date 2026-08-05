import type { ReactElement } from "react";

export function MetricsHelp(): ReactElement {
  return (
    <article className="help-card">
      <h3>Summary metrics</h3>

      <h4>Average &amp; Normalized Power</h4>
      <p>
        Average power is the plain mean over all records with speed, coasting
        zeros included. Normalized Power (Coggan) weighs surges the way
        physiology feels them:
      </p>
      <pre className="help-formula">{`NP = ⁴√( mean( P̄₃₀ₛ⁴ ) )
     — 30-second rolling average, raised to the 4th power, averaged, 4th root`}</pre>

      <h4>Estimated FTP</h4>
      <p>
        If you set your FTP on the Settings page, it is used as-is everywhere
        (zones, TSS, Intensity Factor) — the FTP tile and the zones caption show
        which source is in use. Otherwise FTP is estimated from the ride itself
        as a <strong>lower bound</strong>: a normal ride is not an all-out test,
        so the honest claim is &laquo;FTP is not below X&raquo;. Three
        candidates are computed from the power curve (best average power per
        duration) and the maximum wins:
      </p>
      <pre className="help-formula">{`FTP ≥ max( 0.95 · P₂₀,
           (1200 · P₂₀ − 300 · P₅) / 900,   — Critical Power (Monod, 5- and 20-min points)
           P₆₀ )`}</pre>
      <p>
        Each candidate underestimates on a submaximal ride, so the largest one
        is the tightest bound the data supports. Rides shorter than 20 minutes
        get no estimate — sprints cannot predict FTP.
      </p>

      <h4>TSS</h4>
      <pre className="help-formula">{`TSS = t · (NP / FTP)² / 36            t — timer time, seconds`}</pre>
      <p>
        Because our FTP is a lower bound, the intensity ratio is overestimated —
        treat TSS as an <strong>upper bound</strong>.
      </p>

      <h4>Power zones</h4>
      <p>
        Coggan zones with boundaries at 55 / 75 / 90 / 105 / 120 / 150% of the
        estimated FTP. Time in zone is summed over Δt between records; pauses
        (Δt &gt; 10 s) are excluded.
      </p>

      <h4>Data Quality score</h4>
      <pre className="help-formula">{`score = accepted GPS points / all GPS points · 100%`}</pre>
      <p>
        The badge reads &laquo;Good&raquo; when the file decoded without errors
        and less than 2% of GPS points were rejected; otherwise
        &laquo;Cleaned&raquo;. Charts are downsampled to at most 2000 points for
        display — all computations run on the full data.
      </p>
    </article>
  );
}
