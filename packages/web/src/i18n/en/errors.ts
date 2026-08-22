export const ERRORS_EN = {
  httpLoad: (fileName: string, status: number): string =>
    `Failed to load ${fileName}: HTTP ${status}`,
  rideNotFound: (id: string): string => `Ride #${id} not found in history`,
};
