import "./HelpPage.css";
import type { ReactElement } from "react";

import { MetricsHelp } from "./MetricsHelp";
import { PowerModelHelp } from "./PowerModelHelp";
import { TrackCleaningHelp } from "./TrackCleaningHelp";

import { useT } from "../../hooks/use-translation";

export function HelpPage(): ReactElement {
  const { t } = useT();
  return (
    <section className="help-page">
      <h2>{t.help.title}</h2>
      <p className="help-intro">{t.help.intro}</p>
      <TrackCleaningHelp />
      <PowerModelHelp />
      <MetricsHelp />
    </section>
  );
}
