import type { ReactElement } from "react";

import { FileDataCard } from "./FileDataCard";

import type { Activity } from "../../types/activity";
import { DataQualityCard } from "../bottom/DataQualityCard";

export function DataQualityTab({
  activity,
}: {
  activity: Activity;
}): ReactElement {
  return (
    <>
      <DataQualityCard activity={activity} />
      <FileDataCard activity={activity} />
    </>
  );
}
