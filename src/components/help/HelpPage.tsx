import "./HelpPage.css";
import type { ReactElement } from "react";

import { MetricsHelp } from "./MetricsHelp";
import { PowerModelHelp } from "./PowerModelHelp";
import { TrackCleaningHelp } from "./TrackCleaningHelp";

export function HelpPage(): ReactElement {
  return (
    <section className="help-page">
      <h2>How the numbers are made</h2>
      <p className="help-intro">
        Everything on the dashboard is computed locally in your browser from the
        raw .fit records — nothing is sent anywhere. Below are the exact models
        and formulas: how the GPS track is cleaned, how power is estimated, and
        how the summary metrics are derived.
      </p>
      <TrackCleaningHelp />
      <PowerModelHelp />
      <MetricsHelp />
    </section>
  );
}
