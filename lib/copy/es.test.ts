import { describe, expect, it } from "vitest";
import { copy } from "@/lib/copy/es";

describe("lib/copy/es", () => {
  it("exports Spanish app name and home headline", () => {
    expect(copy.appName).toBe("Marca Fit");
    expect(copy.home.headline).toBe("¿Entrenaste hoy?");
  });

  it("exports PWA install and offline strings", () => {
    expect(copy.pwaInstall.title).toBe("Añadir a inicio");
    expect(copy.offline.title).toBe("Sin conexión");
  });
});
