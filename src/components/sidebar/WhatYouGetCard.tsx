import type { ReactElement } from "react";

import "./WhatYouGetCard.css";

export function WhatYouGetCard(): ReactElement {
  const items = [
    {
      title: "Clean Data",
      text: "Fix errors and inconsistencies",
      icon: (
        <path
          d="M20 6 9 17l-5-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
    },
    {
      title: "Power Data",
      text: "Estimated or measured power",
      icon: (
        <path
          d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
    },
    {
      title: "More Metrics",
      text: "NP, IF, TSS, VI and more",
      icon: (
        <path
          d="M5 20V12M12 20V4M19 20v-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ),
    },
    {
      title: "Better Insights",
      text: "Train with confidence",
      icon: (
        <path
          d="m3 17 6-6 4 4 8-8M15 7h6v6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
    },
  ];

  return (
    <section className="what-you-get-card">
      <h2 className="what-you-get-title">What you get</h2>
      <ul className="what-you-get-items">
        {items.map((item) => (
          <li key={item.title} className="what-you-get-item">
            <span className="what-you-get-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                {item.icon}
              </svg>
            </span>
            <div>
              <p className="what-you-get-item-title">{item.title}</p>
              <p className="what-you-get-item-text">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
