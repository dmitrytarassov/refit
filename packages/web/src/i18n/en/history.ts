export const HISTORY_EN = {
  title: "History",
  empty: "No saved rides yet — process a .fit file on the Dashboard.",
  headers: {
    date: "Date",
    file: "File",
    duration: "Duration",
    distance: "Distance",
    avgPower: "Avg Power",
    normalizedPower: "Normalized Power",
    estFtp: "Est. FTP",
    tss: "TSS",
  },
  deleteConfirm: "Delete?",
  deleteAria: (fileName: string): string => `Delete ${fileName}`,
  confirmDeleteAria: (fileName: string): string =>
    `Confirm deleting ${fileName}`,
};
