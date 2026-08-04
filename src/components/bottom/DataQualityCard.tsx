import type { ReactElement } from "react";

import { QualityRing } from "./ui/QualityRing";

import type { Activity } from "../../types/activity";
import "./DataQualityCard.css";

interface DataQualityCardProps {
  activity: Activity;
}

export function DataQualityCard({
  activity,
}: DataQualityCardProps): ReactElement {
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
        <h3>Data Quality</h3>
        <span
          className={`data-quality-chip ${isGood ? "is-good" : "is-cleaned"}`}
        >
          {isGood ? "Good" : "Cleaned"}
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
                  ? `${decodeErrors} decode issues`
                  : "No decode errors"}
              </strong>
              <p>
                {decodeErrors > 0
                  ? "Some messages could not be decoded."
                  : "Your file structure looks clean."}
              </p>
            </div>
          </li>
          <li>
            <span className="data-quality-icon is-brass" />
            <div>
              <strong>Power data added</strong>
              <p>Estimated from speed, elevation and rider profile.</p>
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
                  ? `${rejected} GPS outliers removed`
                  : "GPS track clean"}
              </strong>
              <p>
                {rejected > 0
                  ? `Speed gate ${speedGate} · Hampel ${hampel} · Kalman ${kalman}.`
                  : "No outliers detected."}
              </p>
            </div>
          </li>
        </ul>
        <div className="data-quality-score">
          <QualityRing percent={percent} />
          <span>Quality Score</span>
        </div>
      </div>
    </section>
  );
}
