---
name: Marca Fit
description: Sistema visual para PWA personal de hábito de ejercicio — registro rápido, constancia sin culpa, estiramientos guiados.
status: final
updated: 2026-07-11
colors:
  surface-base: '#FAFAFA'
  surface-raised: '#FFFFFF'
  ink-primary: '#171717'
  ink-secondary: '#737373'
  ink-disabled: '#A3A3A3'
  accent-success: '#22C55E'
  accent-success-muted: '#DCFCE7'
  accent-success-deep: '#16A34A'
  accent-stretch: '#737373'
  accent-stretch-muted: '#F5F5F5'
  border-hairline: '#E5E5E5'
  border-strong: '#D4D4D4'
  state-today-ring: '#22C55E'
  state-empty: '#F5F5F5'
  state-danger: '#EF4444'
  overlay-scrim: '#00000080'
typography:
  display:
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: '-0.02em'
  title:
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.3'
  body:
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  meta:
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.4'
  timer:
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: '-0.03em'
rounded:
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  full: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 24px
  '6': 32px
  '7': 48px
  gutter-mobile: 16px
  safe-bottom: 24px
components:
  button-primary:
    background: '{colors.accent-success}'
    color: '#FFFFFF'
    minHeight: 56px
    borderRadius: '{rounded.lg}'
    fontSize: '{typography.body.fontSize}'
    fontWeight: '600'
  button-secondary:
    background: '{colors.surface-raised}'
    color: '{colors.ink-primary}'
    border: '1px solid {colors.border-hairline}'
    minHeight: 48px
    borderRadius: '{rounded.md}'
  chip-category:
    background: '{colors.surface-raised}'
    border: '1px solid {colors.border-hairline}'
    selectedBackground: '{colors.accent-success-muted}'
    selectedBorder: '{colors.accent-success}'
    borderRadius: '{rounded.full}'
    minHeight: 44px
    paddingX: '{spacing.4}'
  day-cell-registered:
    background: '{colors.accent-success-muted}'
    border: '2px solid {colors.accent-success}'
    color: '{colors.accent-success-deep}'
  day-cell-empty:
    background: '{colors.state-empty}'
    border: '1px solid {colors.border-hairline}'
    color: '{colors.ink-secondary}'
  day-cell-today:
    ring: '2px solid {colors.state-today-ring}'
  day-cell-stretch:
    dot: '{colors.accent-stretch}'
  stretch-player-surface:
    background: '{colors.surface-raised}'
    progressTrack: '{colors.border-hairline}'
    progressFill: '{colors.accent-success}'
  pwa-icon:
    background: '{colors.accent-success}'
    glyph: '#FFFFFF'
---

## Brand & Style

Marca Fit es una PWA personal de hábito, no una app de gimnasio. Responde una pregunta al día — *¿entrené hoy?* — con un gesto mínimo y refuerzo visual calmado. La estética rechaza gamificación agresiva, leaderboards y notificaciones culpabilizadoras.

Superficies claras sobre `{colors.surface-base}`. Un solo acento cromático — verde hábito `{colors.accent-success}` — reservado para “hecho”, progreso positivo y acciones primarias de registro. Neutros cálidos para todo lo demás. Texto legible al aire libre; densidad baja; el CTA principal domina Home sin competir con banners secundarios.

El icono PWA es un círculo `{colors.accent-success}` con check blanco centrado: lectura instantánea de “día cumplido”.

## Colors

- **`{colors.surface-base}`** — lienzo principal. Calmado, no clínico. Evita blanco puro para reducir fatiga en uso post-entreno.
- **`{colors.surface-raised}`** — tarjetas, chips, modales y Stretch Player. Separa contenido del fondo sin sombras pesadas.
- **`{colors.accent-success}`** — único acento cromático activo. Día registrado, botón principal “Marcar hoy”, progreso del temporizador, icono PWA. No usar para decoración ni badges de racha.
- **`{colors.accent-success-muted}`** — fill suave de días registrados en calendario y chips seleccionados. Señal positiva sin saturación.
- **`{colors.ink-primary}` / `{colors.ink-secondary}`** — jerarquía tipográfica. Secundario para fechas, conteos y metadatos.
- **`{colors.state-danger}`** — solo confirmaciones destructivas (desmarcar hoy). Nunca para días perdidos ni “constancia baja”.
- **`{colors.overlay-scrim}`** — diálogos de confirmación y overlays del selector de categoría.

Evitar: rojo en días sin registrar, gradientes decorativos, múltiples acentos, iconografía de fuego/medalla para rachas.

## Typography

System stack sans-serif para rendimiento PWA y legibilidad móvil. `{typography.display}` solo en el estado hero de Home (“¿Entrenaste hoy?”). `{typography.title}` en encabezados de History y Stretch Player. `{typography.body}` en instrucciones y CTAs. `{typography.meta}` en conteos X/30 y etiquetas de categoría. `{typography.timer}` exclusivo del Stretch Player — monospace para estabilidad visual durante la cuenta atrás.

Sin mayúsculas sostenidas en labels. Español informal, segunda persona, alineado con el PRD.

## Layout & Spacing

Mobile-first 320–428 px. Márgenes laterales `{spacing.gutter-mobile}`. Ritmo vertical 4/8/12/16/24/32/48 px. Home: columna única, CTA principal fijo en zona thumb-friendly (parte inferior media), accesos secundarios (estiramientos, historial) debajo con `{spacing.5}` de separación.

History View: calendario compacto de 30 días en grid 7 columnas; lista alternativa de filas de fecha + categoría. Stretch Player: pantalla completa, temporizador centrado, controles en barra inferior con `{spacing.safe-bottom}` para gestos del sistema.

Sin scroll horizontal en Home e History en viewports objetivo. Responsive: en viewports >428 px el contenido se centra con max-width ~428 px.

## Elevation & Depth

Jerarquía por tono y borde, no por sombra. `{colors.surface-raised}` sobre `{colors.surface-base}`; `{colors.border-hairline}` para separadores. Sombra suave solo en modales/bottom sheets (`0 8px 24px #00000014`). Stretch Player sin sombra — superficie plana inmersiva.

## Shapes

`{rounded.lg}` en botón primario (CTA de registro). `{rounded.md}` en tarjetas y sugerencias post-entreno. `{rounded.full}` en chips de Workout Category. `{rounded.sm}` en celdas de calendario. Círculo `{rounded.full}` reservado al icono PWA y al indicador de progreso circular opcional en Stretch Player.

## Components

### Botón primario — Marcar / Ya registrado

Anatomía: altura mínima 56 px, ancho completo menos gutter, `{components.button-primary}`. Estado “Sin registrar”: fondo `{colors.accent-success}`, texto blanco, label “Marcar entreno de hoy”. Estado “Registrado”: fondo `{colors.surface-raised}`, borde `{colors.accent-success}`, texto `{colors.accent-success-deep}`, check + “Ya registrado — toca para desmarcar”. Tap target ≥ 44×44 px.

→ Referencia: `mockups/home-today-unmarked.html`, `mockups/home-today-marked.html`

### Chips de Workout Category

Cuatro opciones fijas: Piernas, Torso, Cardio, Cuerpo completo. `{components.chip-category}`. Aparecen inline tras marcar (no modal bloqueante). Selección con un toque; omitir cierra el bloque y persiste categoría `no especificado`. Última categoría pre-resaltada como sugerencia.

### Tarjeta Post-Workout Suggestion

`{colors.surface-raised}`, `{rounded.md}`, borde `{colors.border-hairline}`. Título según categoría elegida; duración estimada; CTA “Estirar ahora” secundario + enlace “Ahora no”. **Solo visible** cuando Workout Day tiene categoría concreta (piernas, torso, cardio, cuerpo-completo). **Oculta** si categoría es `no especificado`. No ocupa más del 40% del viewport en Home.

### Tarjeta Rutina diaria

Misma anatomía que post-entreno pero siempre visible cuando hoy no está registrado (FR-10). CTA “Estirar ahora”. Jerarquía visual por debajo del botón primario de registro.

### History — celda de día

`{components.day-cell-registered}` / `{components.day-cell-empty}`. Hoy: anillo `{components.day-cell-today}`. **Stretch Session** completada ese día: punto secundario `{components.day-cell-stretch}` bajo la fecha (no compite con verde de Workout Day). Sin iconos de fuego ni números de racha. En vista lista: fecha + categoría (`no especificado` si omitida) + “Estiramientos ✓” si aplica.

→ Referencia: `mockups/history-calendar.html`

### Toggle calendario / lista

Segmented control en header de History. Preferencia persistida localmente.

### Resumen de constancia

Texto `{typography.meta}`: “12 de 30 días” — conteo neutro, no juicio.

### Stretch Player

Fullscreen `{components.stretch-player-surface}`. Barra de progreso segmentada por ejercicio. `{typography.timer}` para cuenta atrás. Instrucción en `{typography.body}`, máx. 2 frases. Controles: Pausa/Reanudar, Siguiente, Salir (ghost, esquina superior — **siempre** abre diálogo de confirmación).

→ Referencia: `mockups/stretch-player.html`

### Diálogo de confirmación — salir del Player

Scrim `{colors.overlay-scrim}`. Copy: “¿Salir de la rutina?” Acciones: Cancelar (secundario) / Salir (ghost o outline neutro — no destructivo; abandonar no borra datos).

### Diálogo de confirmación — desmarcar

Scrim `{colors.overlay-scrim}`. Copy: “¿Quitar el registro de hoy?” Acciones: Cancelar (secundario) / Quitar (destructivo `{colors.state-danger}` outline, no fill rojo agresivo).

### Banner instalación PWA

Discreto, dismissible, solo primera visita o hasta instalación. No bloquea el CTA de registro.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Verde `{colors.accent-success}` solo para hecho y progreso positivo | Rojo o naranja en días sin entrenar |
| Conteo “X de 30 días” como dato neutro | Rachas punitivas, badges de fuego, “¡No pierdas tu racha!” |
| CTA de registro como acción más prominente en Home | Estiramientos compitiendo visualmente con el registro |
| Confirmación antes de desmarcar hoy o salir del Player | Salir del Player sin preguntar |
| Indicador secundario neutro para Stretch Session | Usar verde de Workout Day para estiramientos |
| Instrucciones de estiramiento en español claro | Edición de fechas pasadas |
| Offline-first — sin spinners de red en flujos core | Vídeo, audio o copy técnico de fisioterapia en MVP |
| Áreas táctiles ≥ 44 px | Controles diminutos en Stretch Player |
