import type { ReactElement } from "react";

import "./HowItWorksCard.css";

import { useT } from "../../hooks/use-translation";

export function HowItWorksCard(): ReactElement {
  const { t } = useT();
  const steps = t.sidebar.howItWorks.steps;

  return (
    <section className="how-it-works-card">
      <h2 className="how-it-works-title">{t.sidebar.howItWorks.title}</h2>
      <ol className="how-it-works-steps">
        {steps.map((step, index) => (
          <li key={step.title} className="how-it-works-step">
            <span className="how-it-works-number" aria-hidden="true">
              {index + 1}
            </span>
            <div>
              <p className="how-it-works-step-title">{step.title}</p>
              <p className="how-it-works-step-text">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
