export const HELP_EN = {
  title: "How the numbers are made",
  intro:
    "Everything on the dashboard is computed locally in your browser from the raw .fit records — nothing is sent anywhere. Below are the exact models and formulas: how the GPS track is cleaned, how power is estimated, and how the summary metrics are derived.",
  trackCleaning: (
    <>
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
    </>
  ),
  powerModel: (
    <>
      <h3>Power estimation</h3>
      <p>
        Pedal power is the sum of resistive forces times speed, corrected for
        drivetrain efficiency:
      </p>
      <pre className="help-formula">{`P = (F_gravity + F_rolling + F_aero + F_inertia) · v / η

F_gravity = m · g · sin(θ)          θ = atan(grade / 100)
F_rolling = Crr · m · g · cos(θ)
F_aero    = ½ · ρ · CdA · v²
F_inertia = m · a
η         = 0.975                   (chain + bearings)`}</pre>
      <p>
        A negative result (descending, braking) is clamped to 0 — you cannot
        push negative watts into pedals. Power is also zero at cadence 0
        (coasting) and below 0.5 m/s (standing). Air density ρ comes from the
        barometric formula using the record&rsquo;s temperature and altitude (a
        ±3–5% effect on the aero term). The device speed series is cleaned first
        with a two-sided Hampel filter (±5-record window, 5σ, σ = max(1.4826 ·
        MAD, 0.5 m/s); outliers replaced with the window median), then a 3-point
        rolling median that flattens one-second speed dips too small for the
        sigma threshold but big enough to fake a power spike through the
        acceleration term — monotonic runs (real sprints) pass through
        unchanged. A single glitched sample would otherwise spike both the aero
        term and the derivative. Acceleration a is a central difference of the
        filtered speed, capped at 3 m/s², and not computed across pauses or data
        gaps (Δt &gt; 10 s). Mass m is rider + bike + gear + bottles — set yours
        in Settings; without it the defaults (82 kg rider, 8 kg bike, 2 kg gear
        — everything the rider carries: helmet, shoes, phone, bike computer) are
        used. Bottles are listed separately by volume and counted full for the
        whole ride (1 L ≈ 1 kg).
      </p>

      <h4>CdA — riding position</h4>
      <table className="help-table">
        <thead>
          <tr>
            <th>Position</th>
            <th>CdA, m²</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>tops</td>
            <td>0.40</td>
          </tr>
          <tr>
            <td>hoods</td>
            <td>0.32</td>
          </tr>
          <tr>
            <td>drops</td>
            <td>0.28</td>
          </tr>
          <tr>
            <td>aero</td>
            <td>0.23</td>
          </tr>
        </tbody>
      </table>
      <p>
        In auto mode the position is picked per record: above 33 km/h — drops,
        below — hoods (&laquo;at speed you hide from the wind&raquo;).
      </p>

      <h4>Crr — rolling resistance</h4>
      <p>
        The coefficient is a base value for the surface times tire and pressure
        multipliers:
      </p>
      <pre className="help-formula">{`Crr = base(surface) · k(tires) · k(pressure)`}</pre>
      <table className="help-table">
        <thead>
          <tr>
            <th>Surface (base)</th>
            <th>Crr</th>
            <th>Tires (×)</th>
            <th>k</th>
            <th>Pressure (×)</th>
            <th>k</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>good asphalt</td>
            <td>0.0045</td>
            <td>road</td>
            <td>1.0</td>
            <td>high</td>
            <td>0.9</td>
          </tr>
          <tr>
            <td>rough asphalt</td>
            <td>0.006</td>
            <td>endurance</td>
            <td>1.1</td>
            <td>medium</td>
            <td>1.0</td>
          </tr>
          <tr>
            <td>gravel</td>
            <td>0.010</td>
            <td>gravel</td>
            <td>1.25</td>
            <td>low</td>
            <td>1.2</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>mtb</td>
            <td>1.5</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <p className="help-note">
        Accuracy: wind is the main unavoidable error source (we know ground
        speed, aero depends on air speed), and drafting in a group cuts the aero
        term by 30–40% invisibly to the model. On a solo ride in calm weather
        expect ±10–15% — the level of Strava&rsquo;s estimated power.
      </p>
    </>
  ),
  metrics: (
    <>
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
    </>
  ),
};
