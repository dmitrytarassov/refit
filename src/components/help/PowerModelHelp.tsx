import type { ReactElement } from "react";

export function PowerModelHelp(): ReactElement {
  return (
    <article className="help-card">
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
        MAD, 0.5 m/s); outliers replaced with the window median), then a
        3-point rolling median that flattens one-second speed dips too small
        for the sigma threshold but big enough to fake a power spike through
        the acceleration term — monotonic runs (real sprints) pass through
        unchanged. A single glitched sample would otherwise spike both the
        aero term and the derivative. Acceleration a is a central difference of the filtered
        speed, capped at 3 m/s², and not computed across pauses or data gaps (Δt
        &gt; 10 s). Mass m is rider + bike + gear + bottles — set yours in
        Settings; without it the defaults (82 kg rider, 8 kg bike, 2 kg gear —
        everything the rider carries: helmet, shoes, phone, bike computer) are
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
    </article>
  );
}
