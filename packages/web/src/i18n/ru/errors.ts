export const ERRORS_RU = {
  httpLoad: (fileName: string, status: number): string =>
    `Не удалось загрузить ${fileName}: HTTP ${status}`,
  rideNotFound: (id: string): string => `Заезд #${id} не найден в истории`,
};
