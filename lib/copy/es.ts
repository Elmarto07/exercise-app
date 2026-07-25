export const copy = {
  appName: "Marca Fit",
  pwaInstall: {
    title: "Añadir a inicio",
    dismiss: "Cerrar banner de instalación",
  },
  offline: {
    title: "Sin conexión",
    message: "Marca Fit necesita haberse abierto al menos una vez en línea. Vuelve cuando tengas red.",
    retry: "Reintentar",
  },
  home: {
    headline: "¿Entrenaste hoy?",
    markToday: "Marcar entreno de hoy",
    alreadyMarked: "Ya registrado — toca para desmarcar",
    categoryPrompt: "¿Qué entrenaste?",
    omitCategory: "Omitir",
    confirmCategories: "Listo",
    categories: {
      piernas: "Piernas",
      torso: "Torso",
      cardio: "Cardio",
      "cuerpo-completo": "Cuerpo completo",
    },
    dailyStretchTitle: "Rutina diaria",
    stretchNow: "Estirar ahora",
    dismissPostWorkout: "Ahora no",
    historyLink: "Historial · últimos 30 días",
  },
  dialogs: {
    unmarkWorkout: {
      title: "¿Quitar el registro de hoy?",
      cancel: "Cancelar",
      confirm: "Quitar",
    },
    exitStretch: {
      title: "¿Salir de la rutina?",
      cancel: "Cancelar",
      confirm: "Salir",
    },
  },
  stretch: {
    progressTemplate: (current: number, total: number) =>
      `${current} de ${total}`,
    pause: "Pausa",
    resume: "Reanudar",
    next: "Siguiente",
    exit: "Salir",
    paused: "Pausado",
    completedTitle: "Listo. Buen trabajo.",
    backHome: "Volver al inicio",
    notFoundTitle: "Rutina no encontrada",
    notFoundBody: "Vuelve al inicio e intenta otra rutina.",
  },
  history: {
    title: "Historial",
    backToHome: "Volver al inicio",
    summaryTemplate: (count: number) => `${count} de 30 días`,
    summaryMeta: "Últimos 30 días incluyendo hoy",
    calendarLabel: "Calendario de los últimos 30 días",
    listLabel: "Lista de los últimos 30 días",
    viewCalendar: "Calendario",
    viewList: "Lista",
    viewToggleLabel: "Tipo de vista del historial",
    noWorkout: "Sin registro",
    categoryUnspecified: "no especificado",
    stretchCompleted: "Estiramientos ✓",
    stretchCompletedAria: "Estiramientos completados",
    weekdays: ["L", "M", "X", "J", "V", "S", "D"] as const,
  },
} as const;

export type Copy = typeof copy;
