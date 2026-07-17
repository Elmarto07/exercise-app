---
name: Marca Fit
status: final
sources:
  - {planning_artifacts}/prds/prd-exercise-app-2026-07-11/prd.md
  - {planning_artifacts}/prds/prd-exercise-app-2026-07-11/addendum.md
updated: 2026-07-11
---

# Marca Fit — Experience Spine

> Contrato de experiencia para la PWA de hábito de ejercicio. Identidad visual en `DESIGN.md`. En conflicto, los spines ganan sobre mocks o wireframes.

## Foundation

**Form-factor:** PWA mobile-first, instalable en pantalla de inicio, modo `standalone`. Viewport objetivo 320–428 px; usable offline tras primera carga. Responsive hasta tablet/desktop con contenido centrado (max ~428 px).

**UI system:** Next.js + TypeScript; sin design system corporativo nombrado. Convenciones web móvil + tokens de `DESIGN.md`. `[ASSUMPTION]` shadcn/ui como base de primitivos accesibles en implementación — EXPERIENCE especifica solo deltas comportamentales.

**Idioma:** Español exclusivo en UI e instrucciones de estiramientos. Tono informal, segunda persona.

**Persistencia:** localStorage (`marcafit:log`). Sin cuenta, sin sync v1.

**Modelo de datos (UX):**

- **Workout Day** — el usuario marcó que entrenó hoy (fecha + categoría opcional).
- **Stretch Session** — el usuario completó una rutina en Stretch Player (fecha + tipo de rutina + id). **Independiente** de Workout Day: estirar no implica entrenar, ni viceversa.

**Fuera de MVP:** tema oscuro, push notifications, edición de días pasados, logging detallado de series/pesos.

## Information Architecture


| Superficie             | Acceso                                 | Propósito                                                                              |
| ---------------------- | -------------------------------------- | -------------------------------------------------------------------------------------- |
| **Home**               | Apertura de app / icono PWA            | Estado de hoy, registro 1-toque, categoría opcional, estiramientos, enlace a historial |
| **History View**       | Home → “Historial” / “Últimos 30 días” | Calendario o lista de 30 días, resumen X/30, categoría por Workout Day, indicador de Stretch Session |
| **Stretch Player**     | Home (rutina diaria / post-entreno)    | Reproductor fullscreen con temporizador e instrucciones                                |
| **Diálogo desmarcar**  | Home → tap en “Ya registrado”          | Confirmación destructiva inline/modal                                                  |
| **Diálogo salir Player** | Stretch Player → “Salir”             | Confirmación siempre antes de abandonar la sesión                                      |
| **Banner PWA install** | Primera visita (navegador)             | Guía “Añadir a inicio”                                                                 |


**Navegación:** Sin tab bar. Home es hub. History es push desde Home; Stretch Player es overlay fullscreen. Profundidad máxima: 2 niveles (Home → History o Home → Player). Volver con botón atrás del sistema o control “Salir” en Player.

**Cierre de superficies:** Todo requisito del PRD mapea a una superficie; toda superficie tiene al menos un journey.

→ Composición: `mockups/home-today-unmarked.html`, `mockups/history-calendar.html`, `mockups/stretch-player.html`. Spine gana en conflicto.

## Voice and Tone

Microcopy. Postura de marca en `DESIGN.md` § Brand & Style.


| Hacer                                          | Evitar                                      |
| ---------------------------------------------- | ------------------------------------------- |
| “¿Entrenaste hoy?”                             | “¡Hora de entrenar!”                        |
| “Marcar entreno de hoy”                        | “Log workout” / anglicismos                 |
| “12 de 30 días”                                | “¡Solo te faltan 18!” / tono culpabilizador |
| “Estirar ahora”                                | “Completa tu rutina obligatoria”            |
| “Listo. Buen trabajo.” (fin de Stretch Player) | Confeti, badges, exclamaciones múltiples    |
| “¿Quitar el registro de hoy?”                  | “¿Seguro que no entrenaste?”                |
| “¿Salir de la rutina?”                         | “¿Seguro?” / copy genérico                  |


Instrucciones de estiramientos: 1–2 frases, imperativo suave (“Mantén la posición…”, “Respira profundo…”).

## Component Patterns

Comportamiento. Specs visuales en `DESIGN.md` § Components.


| Componente                  | Superficie        | Reglas comportamentales                                                                                                                                                                  |
| --------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Today status + CTA**      | Home              | Refleja Exercise Log al abrir. Un toque marca Workout Day. Segundo toque en estado registrado abre diálogo desmarcar. Feedback <500 ms percibidos.                                       |
| **Category chips**          | Home (post-marca) | 4 opciones fijas. Un toque selecciona y persiste. Omitir (tap fuera o “Omitir”) guarda categoría `no especificado`. Recuerda `lastCategory` en prefs. Flujo completo ≤7 s mediana. |
| **Post-Workout Suggestion** | Home              | Aparece <1 s tras marcar **solo si** el usuario eligió categoría concreta (piernas, torso, cardio, cuerpo-completo). Si categoría es `no especificado` (omitió chips), **no se muestra**. Rutina distinta por cada categoría elegida. Descartable cuando visible. No bloquea navegación. |
| **Daily stretch card**      | Home              | Visible siempre que hoy no registrado (FR-10). También accesible cuando ya registrado, debajo de post-workout.                                                                           |
| **History summary**         | History           | “X de 30 días” — conteo exacto del rango visible. Actualiza al volver de Home sin recarga manual.                                                                                        |
| **View toggle**             | History           | Calendario ↔ Lista; misma data; preferencia en localStorage.                                                                                                                             |
| **Calendar grid**           | History           | 30 días incluyendo hoy hacia atrás. Workout Day muestra categoría (`no especificado` si omitida). Stretch Session completada ese día muestra indicador secundario (punto/meta). Pasados no editables. |
| **Stretch Player**          | Fullscreen        | Cuenta atrás por ejercicio; auto-avance al llegar a 0. Pausa, saltar. “Salir” siempre abre diálogo de confirmación. Completar rutina persiste **Stretch Session**; no crea Workout Day. |
| **Stretch Session log**     | Player → storage  | Al terminar la última instrucción (o completar manualmente), guarda `{ date, routineType, routineId }` en localStorage. Visible en History ese día. |
| **PWA install banner**      | Global (browser)  | No repetir tras dismiss o instalación detectada.                                                                                                                                         |




## State Patterns


| Estado                              | Superficie | Tratamiento                                                                                                                             |
| ----------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Cold open — hoy sin registrar**   | Home       | CTA primario “Marcar…”, tarjeta rutina diaria visible, banner PWA si aplica.                                                            |
| **Cold open — hoy registrado**      | Home       | CTA “Ya registrado”, categoría mostrada si existe (`no especificado` si omitió), post-workout solo si categoría concreta y no se inició. |
| **Post-marca — selector categoría** | Home       | Chips inline; no bloquea desmarcar ni historial.                                                                                        |
| **Post-marca — categoría elegida**  | Home       | Post-Workout Suggestion visible según categoría (piernas/torso/cardio/cuerpo-completo). |
| **Post-marca — categoría omitida**  | Home       | Categoría persistida como `no especificado`. **Sin** Post-Workout Suggestion. Rutina diaria sigue accesible. |
| **Desmarcar pendiente**             | Diálogo    | Bloquea solo la acción de desmarcar; fondo inerte.                                                                                      |
| **History vacío**                   | History    | Imposible con datos locales por defecto; si log vacío: “0 de 30 días” + grid vacío neutro.                                              |
| **Offline**                         | Todas      | Sin banner de error; operaciones locales instantáneas.                                                                                  |
| **Stretch — pausado**               | Player     | Timer congelado; label “Pausado”.                                                                                                       |
| **Stretch — completado**            | Player     | Pantalla fin: “Listo. Buen trabajo.” + CTA “Volver al inicio”. Persiste **Stretch Session** del día; no crea Workout Day. |
| **Stretch — salir confirmado**      | Diálogo    | Copy: “¿Salir de la rutina?” Cancelar / Salir. Abandonar sin completar no crea Stretch Session. |
| **Primera instalación**             | PWA        | Segunda apertura standalone; sin onboarding multi-paso.                                                                                 |




## Interaction Primitives

- **Tap** — acción primaria en toda la app.
- **Tap en chip** — selección exclusiva de categoría (radio behavior).
- **Tap en “Ya registrado”** — abre confirmación, no desmarca directo.
- **Swipe back / botón atrás** — History → Home; Player “Salir” → **siempre** diálogo de confirmación antes de abandonar.
- **Long-press** — sin acciones custom en MVP.
- **Pull-to-refresh** — no en MVP (datos locales).
- **Prohibido:** gamificación de rachas, haptic de “error” en días vacíos, auto-play de vídeo, notificaciones push.



## Accessibility Floor

Comportamiento. Contraste visual objetivo WCAG AA en `DESIGN.md` (no bloqueante MVP pero aspiracional).

- **Targets táctiles** ≥ 44×44 px en CTA principal, chips y controles del Player.
- **Labels:** CTA anuncia estado (“Marcar entreno de hoy, botón” / “Ya registrado, toca para desmarcar”).
- **Timer:** anuncia cambios de ejercicio vía live region (`aria-live="polite"`).
- **Diálogo desmarcar:** foco atrapado; Esc = Cancelar.
- **Motion:** respetar `prefers-reduced-motion` — transiciones ≤150 ms o instantáneas.
- **Color:** estado registrado no depende solo del verde (check + texto acompañan).
- **Orden de foco:** lectura top-down en Home; Player: título → timer → instrucción → controles.



## Inspiration & Anti-patterns

- **Referencia positiva — apps de hábito minimalistas:** un gesto por día, sin formularios.
- **Referencia positiva — temporizadores de estiramiento (Stretchly, etc.):** cuenta atrás clara, avance automático.
- **Anti-patrón — Strong / MyFitnessPal:** logging detallado, series, pesos — fuera de alcance permanente.
- **Anti-patrón — Duolingo streaks:** presión por racha rota — Marca Fit muestra conteo, no castigo.
- **Anti-patrón — YouTube para estiramientos:** fricción de búsqueda — rutinas embebidas offline.



## Responsive & Platform


| Contexto            | Comportamiento                                                                      |
| ------------------- | ----------------------------------------------------------------------------------- |
| **320 px**          | CTA full-width; calendario celdas mínimas 36 px con tap en fila lista como fallback |
| **428 px**          | Layout cómodo; mismo IA                                                             |
| **>428 px**         | Columna centrada; no sidebar                                                        |
| **iOS Safari PWA**  | `viewport-fit=cover`; safe areas en Player y Home bottom                            |
| **Android Chrome**  | `manifest` + `beforeinstallprompt` cuando disponible                                |
| **Desktop browser** | Funcional pero secundario; banner install adaptado                                  |




## Key Flows



### UJ-1 — Martin marca entreno en el ascensor

1. Abre PWA desde icono home.
2. Home muestra “¿Entrenaste hoy?” + CTA “Marcar entreno de hoy”.
3. Un toque → estado “Registrado” + check inmediato.
4. Aparecen chips: Piernas / Torso / Cardio / Cuerpo completo (+ Omitir).
5. Toca “Piernas” → persiste categoría.
6. Post-Workout Suggestion “Estiramiento post-piernas (~4 min)” visible **solo porque eligió categoría**.

**Variante omitir:** Tras marcar, toca “Omitir” → categoría `no especificado` → **no** aparece tarjeta post-entreno; rutina diaria sigue en Home.
7. **Clímax:** Mini-calendario o indicador visual confirma hoy en verde `{colors.accent-success}`.
8. Inicia estiramientos o cierra app; dato persiste offline.

**Edge:** Si ya registrado, CTA muestra “Ya registrado” → tap → diálogo → confirmar desmarca.

### UJ-2 — Martin revisa constancia en el sofá

1. Home → “Historial” / “Últimos 30 días”.
2. History abre en vista preferida (calendario por defecto).
3. Lee resumen “12 de 30 días”.
4. Escanea grid: verde = registrado, neutro = no, anillo = hoy.
5. **Clímax:** Identifica constancia en ≤10 s sin editar nada.
6. Toggle a lista → mismas fechas con categoría por fila.
7. Atrás → Home.



### UJ-3 — Martin estira al despertar

1. Home; hoy sin registrar.
2. Tarjeta “Rutina diaria · ~5 min” + “Estirar ahora”.
3. Tap → Stretch Player fullscreen.
4. Ejercicio 1: nombre, timer 45 s, instrucción breve.
5. Timer llega a 0 → auto-avance a ejercicio 2.
6. Pausa si necesita; Siguiente salta; Salir → diálogo “¿Salir de la rutina?” (siempre).
7. **Clímax:** Último ejercicio completa → “Listo. Buen trabajo.” → se guarda **Stretch Session** de hoy.
8. Volver al inicio. Workout Day sigue sin registrar; History muestra indicador de estiramientos completados hoy.



### UJ-4 — Primera instalación PWA

1. Primera visita en Chrome móvil.
2. App carga Home vacía (0 días).
3. Banner “Añadir a inicio para acceso rápido”.
4. Usuario instala → icono verde con check.
5. **Clímax:** Segunda apertura en standalone, sin barra de URL.
6. Listo para UJ-1.



## Resolved Decisions (2026-07-11)

| # | Decisión | Implicación UX |
|---|---|---|
| RD-1 | **Stretch Session ≠ Workout Day.** Completar estiramientos registra que se hicieron los ejercicios propuestos; no marca entreno. | Player persiste Stretch Session al completar; History muestra indicador separado del verde de Workout Day. |
| RD-2 | Categoría omitida → valor persistido **`no especificado`**. **Sin** Post-Workout Suggestion en ese caso. | History/lista muestra “no especificado”; chips pueden omitirse; solo rutina diaria disponible para estiramientos. |
| RD-2b | *(2026-07-11 update)* Revoca fallback `cuerpo-completo` para post-entreno cuando categoría es `no especificado`. | Post-Workout Suggestion condicionada a categoría concreta. |
| RD-3 | **Salir del Stretch Player siempre pide confirmación.** | Diálogo en cada tap de “Salir”; abandono no crea Stretch Session. |

## PWA & Offline Experience

- Service worker cachea shell + rutinas JSON embebidas.
- Marcar/desmarcar/historial/player funcionan en modo avión tras primera visita.
- Sin indicador “offline” en flujos core — la app asume local-first.
- Pérdida de datos si usuario limpia sitio: aviso sutil diferido a v1.1 (export JSON).

