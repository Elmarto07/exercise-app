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
  },
} as const;

export type Copy = typeof copy;
