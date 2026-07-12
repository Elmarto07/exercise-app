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
} as const;

export type Copy = typeof copy;
