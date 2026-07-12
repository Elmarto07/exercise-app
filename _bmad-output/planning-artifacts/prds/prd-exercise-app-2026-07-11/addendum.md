# Addendum: Marca Fit — decisiones técnicas y contexto

*Complemento del PRD. No duplica requisitos funcionales.*

## Marca e identidad

| Elemento | Decisión |
|----------|----------|
| Nombre | **Marca Fit** |
| Icono PWA | Círculo verde `#22c55e` con check blanco centrado — lectura instantánea de “día hecho” |
| Theme color | `#22c55e` (verde hábito) |
| Background | `#fafafa` (claro, calmado) |
| Copy | Español informal, segunda persona (“¿Entrenaste hoy?”) |

## Stack provisional (Fase 1)

| Capa | Decisión |
|------|----------|
| Forma | PWA mobile-first (instalable en home) |
| Frontend | Next.js 15 (App Router) + TypeScript |
| Persistencia | **localStorage** (ver § Persistencia) |
| Deploy | Vercel Hobby (gratis, uso personal) |
| Offline | Serwist precache + rutinas embebidas en bundle |

## Persistencia: ¿localStorage o IndexedDB?

**Decisión: localStorage para MVP.**

| Criterio | localStorage | IndexedDB |
|----------|--------------|-----------|
| Volumen de datos | ~30 bytes/día × 3650 días ≈ 110 KB en 10 años | Overkill para este volumen |
| API | Síncrona, trivial (`getItem`/`setItem`) | Asíncrona; más boilerplate y edge cases |
| Offline PWA | Funciona sin red desde el primer día | Igual, pero más complejidad sin beneficio |
| Tipos de dato | JSON serializado en una clave (`marcafit:log`) | Objetos nativos, consultas |
| Migración futura | Fácil exportar JSON → importar en IndexedDB/Postgres v2 | — |

**Qué guardamos en localStorage:**

```json
{
  "v": 1,
  "workoutDays": [
    { "date": "2026-07-11", "category": "piernas" },
    { "date": "2026-07-10", "category": "no-especificado" }
  ],
  "stretchSessions": [
    { "date": "2026-07-11", "routineType": "daily", "routineId": "daily" }
  ],
  "prefs": {
    "historyView": "calendar",
    "lastCategory": "piernas",
    "pwaInstallDismissed": false
  }
}
```

- **`workoutDays`** — días con entreno marcado (máx. uno por fecha).
- **`stretchSessions`** — rutinas de estiramiento completadas (independiente de entreno).
- **`category`** — `piernas | torso | cardio | cuerpo-completo | no-especificado`.

**Cuándo migrar a IndexedDB (v2):** si añadimos caché grande de rutinas IA generadas, historial masivo de **Stretch Session**, o export/import masivo. No bloquea MVP.

## Estiramientos adaptados al entreno

### MVP — rutinas estáticas por categoría (sin IA)

5 rutinas embebidas en JSON estático (`/data/stretch-routines.json`):

| Rutina | Categoría | Enfoque muscular |
|--------|-----------|------------------|
| Diaria | — (siempre disponible) | Cuello, hombros, cadera — movilidad general |
| Post-entreno | `piernas` | Isquios, cuádriceps, glúteos, gemelos |
| Post-entreno | `torso` | Pecho, hombros, dorsales, brazos |
| Post-entreno | `cardio` | Cadera, pantorrillas, respiración, espalda baja |
| Post-entreno | `cuerpo-completo` | Full-body cooldown equilibrado |

Contenido inspirado en estiramientos estándar de cooldown (fuentes públicas: ACSM, rutinas de fisioterapia básica), **redactado en español propio** para evitar copyright y mantener tono consistente.

Campos por ejercicio: `id`, `name`, `durationSeconds`, `instruction` (1–2 frases en español).

### v1.1 — API IA opcional (DeepSeek u similar)

**Por qué no en MVP:** añade latencia, coste, dependencia de red y una API route en Vercel. Las 4 categorías cubren el 90% del caso con 0 fricción offline.

**Cuándo sí tiene sentido:** si tras usar el MVP sientes que “piernas” es demasiado genérico y quieres rutinas más específicas (“sentadillas + peso muerto” → estiramientos concretos).

**Arquitectura propuesta v1.1:**

```
Usuario marca + categoría
       ↓
[Opcional] Campo texto corto: "hice pierna y espalda"
       ↓
API Route Vercel (/api/stretch-suggest)
       ↓
DeepSeek API (~$0.001/request)
       ↓
JSON Stretch Routine → cache localStorage (TTL 7 días)
       ↓
Stretch Player (mismo reproductor)
```

- **Fallback:** si offline o API falla → rutina estática de la categoría.
- **Coste estimado:** ~30 requests/mes × $0.001 ≈ $0.03/mes (despreciable).
- **Privacidad:** no persistir texto libre en servidor; solo forward a IA y devolver JSON.

## Fase 2 (opcional, fuera MVP)

- VPS Hetzner CX23 (~5,49 €/mes) + Coolify + PostgreSQL
- Motivación: sync entre dispositivos si el uso diario lo exige
- Migración: export JSON desde localStorage → import en Postgres

## Information Architecture (actualizada)

```
Home
├── Estado hoy + CTA registrar/desmarcar
├── [Tras marcar] Selector Workout Category (chips, omisible → no-especificado)
├── CTA estiramiento diario (siempre)
├── Post-Workout Suggestion (solo si categoría concreta elegida)
└── Link → History View

History View
├── Calendario 30 días ↔ Lista
├── Resumen X/30 días (Workout Day)
└── Indicador Stretch Session por día

Stretch Player (full-screen)
├── Temporizador
├── Instrucción ejercicio actual (español)
├── Controles: pausa, siguiente, salir (confirmación siempre)
└── Al completar → persiste Stretch Session (no Workout Day)
```

## Riesgos técnicos PWA

| Riesgo | Mitigación |
|--------|------------|
| iOS limita push | No depender de notificaciones en MVP |
| Pérdida de datos al limpiar navegador | Export JSON en v1.1; aviso sutil en ajustes |
| localStorage ~5 MB | Con este esquema, <1% del límite en décadas |
| IA añade latencia en v1.1 | Skeleton + fallback instantáneo a rutina estática |

## Aesthetic and Tone

- Minimal, calmado, sin gamificación agresiva.
- Verde suave para día registrado; neutros para el resto.
- Anti-referencia: apps de gym con leaderboard y notificaciones culpabilizadoras.
