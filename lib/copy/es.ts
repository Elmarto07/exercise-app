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
    categories: {
      piernas: "Piernas",
      torso: "Torso",
      cardio: "Cardio",
      "cuerpo-completo": "Cuerpo completo",
    },
    dailyStretchTitle: "Rutina diaria",
    dailyStretchMeta: "~5 min · cuello, hombros, cadera",
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
    weekdays: ["L", "M", "X", "J", "V", "S", "D"] as const,
  },
} as const;

export type Copy = typeof copy;
