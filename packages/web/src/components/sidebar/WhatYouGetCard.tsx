import type { ReactElement } from "react";

import "./WhatYouGetCard.css";

import { useT } from "../../hooks/use-translation";

export function WhatYouGetCard(): ReactElement {
  const { t } = useT();
  const items = [
    {
      title: t.sidebar.whatYouGet.items[0].title,
      text: t.sidebar.whatYouGet.items[0].text,
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
      title: t.sidebar.whatYouGet.items[1].title,
      text: t.sidebar.whatYouGet.items[1].text,
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
      title: t.sidebar.whatYouGet.items[2].title,
      text: t.sidebar.whatYouGet.items[2].text,
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
      title: t.sidebar.whatYouGet.items[3].title,
      text: t.sidebar.whatYouGet.items[3].text,
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
      <h2 className="what-you-get-title">{t.sidebar.whatYouGet.title}</h2>
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
