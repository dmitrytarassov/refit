export const WORKOUTS_RU = {
  title: "Тренировки",
  empty:
    "Сохранённых тренировок пока нет — соберите её в планировщике и нажмите «Сохранить».",
  newWorkout: "Новая тренировка",
  headers: {
    date: "Дата",
    name: "Название",
    duration: "Длительность",
    tss: "TSS",
  },
  deleteConfirm: "Удалить?",
  deleteAria: (name: string): string => `Удалить ${name}`,
  confirmDeleteAria: (name: string): string => `Подтвердить удаление ${name}`,
};
