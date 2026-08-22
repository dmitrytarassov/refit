export const HISTORY_RU = {
  title: "История",
  empty: "Сохранённых заездов пока нет — обработайте .fit-файл на Дашборде.",
  headers: {
    date: "Дата",
    file: "Файл",
    duration: "Время",
    distance: "Дистанция",
    avgPower: "Ср. мощность",
    normalizedPower: "Normalized Power",
    estFtp: "Оценка FTP",
    tss: "TSS",
  },
  deleteConfirm: "Удалить?",
  deleteAria: (fileName: string): string => `Удалить ${fileName}`,
  confirmDeleteAria: (fileName: string): string =>
    `Подтвердить удаление ${fileName}`,
};
