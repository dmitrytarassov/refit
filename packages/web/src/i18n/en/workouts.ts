export const WORKOUTS_EN = {
  title: "Workouts",
  empty: "No saved workouts yet — build one in the planner and press Save.",
  newWorkout: "New workout",
  headers: {
    date: "Date",
    name: "Name",
    duration: "Duration",
    tss: "TSS",
  },
  deleteConfirm: "Delete?",
  deleteAria: (name: string): string => `Delete ${name}`,
  confirmDeleteAria: (name: string): string => `Confirm deleting ${name}`,
};
