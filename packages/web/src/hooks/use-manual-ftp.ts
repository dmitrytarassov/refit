import { useEffect, useState } from "react";

import { getManualFtp } from "../db/get-manual-ftp";
import { saveManualFtp } from "../db/save-manual-ftp";

export function useManualFtp(): {
  ftp: number | null;
  save: (value: number | null) => void;
} {
  const [ftp, setFtp] = useState<number | null>(null);

  useEffect(() => {
    getManualFtp().then(setFtp);
  }, []);

  const save = (value: number | null): void => {
    setFtp(value);
    void saveManualFtp(value);
  };

  return { ftp, save };
}
