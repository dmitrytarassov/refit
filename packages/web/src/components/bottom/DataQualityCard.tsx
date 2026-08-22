import type { ReactElement } from "react";

import { QualityRing } from "./ui/QualityRing";

import { useT } from "../../hooks/use-translation";
import type { Activity } from "../../types/activity";
import "./DataQualityCard.css";

interface DataQualityCardProps {
  activity: Activity;
}

export function DataQualityCard({
  activity,
}: DataQualityCardProps): ReactElement {
  const { t } = useT();
  const { report } = activity;
  const decodeErrors = activity.fit.errors.length;
  const speedGate = report.rejectedBy["speed-gate"];
  const hampel = report.rejectedBy.hampel;
  const kalman = report.rejectedBy.kalman;
  const rejected = speedGate + hampel + kalman;
  const isGood =
    decodeErrors === 0 &&
    (report.withGps === 0 || rejected / report.withGps < 0.02);
  const percent =
    report.withGps > 0
      ? Math.round((report.accepted / report.withGps) * 100)
      : 100;

  return (
    <section className="data-quality-card">
      <header>
        <h3>{t.charts.quality.title}</h3>
        <span
          className={`data-quality-chip ${isGood ? "is-good" : "is-cleaned"}`}
        >
          {isGood ? t.charts.quality.good : t.charts.quality.cleaned}
        </span>
      </header>
      <div className="data-quality-body">
        <ul className="data-quality-checklist">
          <li>
            <span
              className={`data-quality-icon ${decodeErrors > 0 ? "is-danger" : "is-success"}`}
            >
              {decodeErrors > 0 ? (
                <svg
                  viewBox="0 0 12 12"
                  width="12"
                  height="12"
                  aria-hidden="true"
                >
                  <path
                    d="M6 2.5v4.2M6 9.4v.1"
                    fill="none"
                    stroke="var(--danger)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 12 12"
                  width="12"
                  height="12"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 6.5 5 9l4.5-5"
                    fill="none"
                    stroke="var(--success)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <div>
              <strong>
                {decodeErrors > 0
                  ? t.charts.quality.decodeIssues(decodeErrors)
                  : t.charts.quality.noDecodeErrors}
              </strong>
              <p>
                {decodeErrors > 0
                  ? t.charts.quality.decodeBad
                  : t.charts.quality.decodeGood}
              </p>
            </div>
          </li>
          <li>
            <span className="data-quality-icon is-brass" />
            <div>
              <strong>{t.charts.quality.powerAdded}</strong>
              <p>{t.charts.quality.powerAddedText}</p>
            </div>
          </li>
          <li>
            {rejected > 0 ? (
              <span className="data-quality-icon is-brass" />
            ) : (
              <span className="data-quality-icon is-success">
                <svg
                  viewBox="0 0 12 12"
                  width="12"
                  height="12"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 6.5 5 9l4.5-5"
                    fill="none"
                    stroke="var(--success)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
            <div>
              <strong>
                {rejected > 0
                  ? t.charts.quality.outliersRemoved(rejected)
                  : t.charts.quality.trackClean}
              </strong>
              <p>
                {rejected > 0
                  ? t.charts.quality.outliersDetail(speedGate, hampel, kalman)
                  : t.charts.quality.noOutliers}
              </p>
            </div>
          </li>
        </ul>
        <div className="data-quality-score">
          <QualityRing percent={percent} />
          <span>{t.charts.quality.score}</span>
        </div>
      </div>
    </section>
  );
}
