import { describe, expect, it } from "vitest";
import { copy } from "@/lib/copy/es";

describe("lib/copy/es", () => {
  it("exports Spanish Home placeholder strings", () => {
    expect(copy.appName).toBe("Marca Fit");
    expect(copy.home.headline).toBe("¿Entrenaste hoy?");
    expect(copy.home.markToday).toBe("Marcar entreno de hoy");
    expect(copy.home.alreadyMarked).toBe(
      "Ya registrado — toca para desmarcar",
    );
    expect(copy.home.dailyStretchTitle).toBe("Rutina diaria");
    expect(copy.home.stretchNow).toBe("Estirar ahora");
    expect(copy.home.historyLink).toContain("Historial");
  });

  it("exports unmark workout dialog strings", () => {
    expect(copy.dialogs.unmarkWorkout.title).toBe(
      "¿Quitar el registro de hoy?",
    );
    expect(copy.dialogs.unmarkWorkout.cancel).toBe("Cancelar");
    expect(copy.dialogs.unmarkWorkout.confirm).toBe("Quitar");
  });

  it("exports stretch player strings", () => {
    expect(copy.dialogs.exitStretch.title).toBe("¿Salir de la rutina?");
    expect(copy.stretch.completedTitle).toBe("Listo. Buen trabajo.");
    expect(copy.stretch.pause).toBe("Pausa");
    expect(copy.stretch.next).toBe("Siguiente");
    expect(copy.stretch.progressTemplate(2, 5)).toBe("2 de 5");
  });

  it("exports workout category chip strings", () => {
    expect(copy.home.categoryPrompt).toBe("¿Qué entrenaste?");
    expect(copy.home.omitCategory).toBe("Omitir");
    expect(copy.home.categories.piernas).toBe("Piernas");
    expect(copy.home.categories.torso).toBe("Torso");
    expect(copy.home.categories.cardio).toBe("Cardio");
    expect(copy.home.categories["cuerpo-completo"]).toBe("Cuerpo completo");
  });

  it("exports post-workout dismiss string", () => {
    expect(copy.home.dismissPostWorkout).toBe("Ahora no");
  });

  it("exports PWA install and offline strings", () => {
    expect(copy.pwaInstall.title).toBe("Añadir a inicio");
    expect(copy.offline.title).toBe("Sin conexión");
  });

  it("exports history view strings", () => {
    expect(copy.history.title).toBe("Historial");
    expect(copy.history.summaryTemplate(5)).toBe("5 de 30 días");
    expect(copy.history.viewCalendar).toBe("Calendario");
    expect(copy.history.viewList).toBe("Lista");
    expect(copy.history.noWorkout).toBe("Sin registro");
    expect(copy.history.stretchCompleted).toBe("Estiramientos ✓");
    expect(copy.history.stretchCompletedAria).toBe(
      "Estiramientos completados",
    );
    expect(copy.history.weekdays).toHaveLength(7);
  });
});
