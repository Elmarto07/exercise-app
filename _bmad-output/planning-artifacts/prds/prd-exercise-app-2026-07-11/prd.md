---
title: Marca Fit (PWA de hábito de ejercicio)
status: final
created: 2026-07-11
updated: 2026-07-11
---

# PRD: Marca Fit

*App personal para registrar ejercicio y estiramientos adaptados al entreno.*

## 0. Document Purpose

Este PRD define el MVP de una PWA personal para registrar días de ejercicio en 1–2 toques y consultar un historial simple, con sugerencias de estiramientos integradas. Está dirigido al desarrollador-usuario (Martin) como único stakeholder y a flujos downstream (`bmad-ux`, `bmad-architecture`, `bmad-create-epics-and-stories`). Las decisiones técnicas de stack viven en `addendum.md`; aquí solo capacidades y comportamiento observable.

Vocabulario anclado en §3 Glossary. Requisitos numerados globalmente (FR-1…FR-15). Supuestos inferidos marcados con `[ASSUMPTION]` e indexados en §9.

## 1. Vision

Marca Fit responde a una pregunta diaria con mínima fricción: **¿entrené hoy?** En lugar de apps de gimnasio con series, pesos y cuentas, prioriza un registro rápido por día — visible de un vistazo en los últimos 30 días.

Tras marcar ejercicio (o al abrir la app en un día sin registro), ofrece **estiramientos guiados cortos** adaptados al tipo de entreno, sin buscar en internet: rutina diaria fija y sugerencias post-entreno según **Workout Category**. El objetivo no es optimizar el rendimiento atlético, sino **mantener el hábito** y cuidar la movilidad con cero fricción.

Es un proyecto hobby de uso personal: sin monetización, sin comunidad, sin backend obligatorio en v1. Debe instalarse como PWA en la pantalla de inicio y funcionar offline con datos locales.

## 2. Target User



### 2.1 Jobs To Be Done

- **Funcional:** Registrar en segundos que hice ejercicio hoy y ver si mantuve constancia en las últimas semanas.
- **Emocional:** Sentir progreso sin culpa por un día perdido; ver el historial como refuerzo positivo, no como castigo por rachas rotas.
- **Contextual:** Usar la app justo después de entrenar o al llegar a casa, con el móvil en una mano y sin tiempo para formularios.
- **Preventivo:** Hacer estiramientos breves sin abrir YouTube ni pagar suscripciones a apps de stretching.



### 2.2 Non-Users (v1)

- Atletas que necesitan logging detallado (series, pesos, RPE, periodización).
- Usuarios que buscan planes de entrenamiento, comunidad, rankings o wearables.
- Cualquier persona que requiera sincronización multi-dispositivo en v1 (fuera de MVP).



### 2.3 Key User Journeys

- **UJ-1. Martin marca que entrenó hoy en el ascensor.**
  - **Persona + contexto:** Martin, 30s, acaba de salir del gimnasio; quiere cerrar el día sin olvidar el registro.
  - **Entry state:** PWA instalada en home; sesión previa; hoy aún sin **Workout Day**.
  - **Path:** Abre la app → ve el botón principal “Hoy: sin registrar” → un toque → elige **Workout Category** (piernas, torso, cardio, cuerpo completo; 1 toque, omisible) → confirma visual (check + fecha) → si eligió categoría, aparece **Post-Workout Suggestion** adaptada; si omitió, no aparece post-entreno (solo rutina diaria disponible).
  - **Climax:** El día queda marcado y ve el calendario actualizado con hoy en verde.
  - **Resolución:** Puede iniciar estiramientos o cerrar la app; el registro persiste offline.
  - **Edge case:** Si ya marcó hoy, el botón muestra “Ya registrado” y permite desmarcar con confirmación.
- **UJ-2. Martin revisa constancia del último mes en el sofá.**
  - **Persona + contexto:** Domingo por la tarde; quiere saber si va bien el hábito.
  - **Entry state:** App abierta; datos locales cargados.
  - **Path:** Navega a **History View** → ve calendario/lista de últimos 30 días → cuenta días marcados vs. total → distingue **Workout Day** y días con **Stretch Session** completada.
  - **Climax:** De un vistazo distingue días con ejercicio, sin ejercicio y hoy.
  - **Resolución:** Vuelve a Home sin haber editado nada.
- **UJ-3. Martin hace la rutina diaria de estiramientos al despertar.**
  - **Persona + contexto:** Mañana; no ha entrenado aún; quiere movilidad de 3–5 min.
  - **Entry state:** Home; sugerencia “Rutina diaria” visible.
  - **Path:** Toca “Estirar ahora” → **Stretch Player** a pantalla completa con temporizador, nombre del ejercicio actual y “siguiente” → completa o sale (salir siempre pide confirmación).
  - **Climax:** Temporizador avanza automáticamente entre ejercicios; al terminar, mensaje de cierre breve y queda registrada una **Stretch Session** del día.
  - **Resolución:** No crea **Workout Day**; el registro de estiramientos es independiente y visible en **History View**.
- **UJ-4. Martin instala la PWA la primera vez.**
  - **Persona + contexto:** Primera visita desde Chrome móvil.
  - **Entry state:** Sin datos locales; sin instalación previa.
  - **Path:** Carga la app → prompt nativo o banner “Añadir a inicio” → acepta → icono en home.
  - **Climax:** Segunda apertura desde icono en modo standalone (sin barra del navegador).
  - **Resolución:** Listo para UJ-1 con latencia mínima.



## 3. Glossary

- **Workout Day** — Día calendario (fecha local del dispositivo) en el que el usuario marcó que hizo ejercicio. Máximo uno por fecha. Opcionalmente incluye una **Workout Category**. Almacenado localmente.
- **Workout Category** — Tipo de entreno del día: `piernas`, `torso`, `cardio`, `cuerpo-completo` o `no-especificado` (cuando el usuario omite el selector). Determina qué **Post-Workout Suggestion** se ofrece **solo** si la categoría es concreta (no `no-especificado`).
- **Exercise Log** — Conjunto persistido de **Workout Day**, **Stretch Session** y preferencias del usuario.
- **Stretch Session** — Registro de que el usuario completó una **Stretch Routine** en una fecha (fecha local + tipo de rutina + id). Independiente de **Workout Day**: completar estiramientos no implica entrenar, ni viceversa.
- **History View** — Superficie que muestra **Exercise Log** como calendario o lista, centrada en los últimos 30 días.
- **Stretch Routine** — Secuencia ordenada de **Stretch Exercise** con duración por ejercicio.
- **Stretch Exercise** — Un estiramiento con nombre, duración en segundos e instrucción breve (texto). `[ASSUMPTION: sin vídeo en MVP]`
- **Stretch Player** — UI a pantalla completa que guía una **Stretch Routine** con temporizador y avance automático/manual.
- **Daily Stretch Routine** — **Stretch Routine** fija mostrada cada día en Home.
- **Post-Workout Suggestion** — **Stretch Routine** corta ofrecida tras marcar un **Workout Day** **solo cuando** la **Workout Category** es concreta (`piernas`, `torso`, `cardio`, `cuerpo-completo`). No se muestra si la categoría es `no-especificado`.
- **Home** — Pantalla principal: estado de hoy, acción de registro y acceso a estiramientos/historial.
- **PWA Shell** — Instancia instalada de la app con service worker y assets cacheados para uso offline.



## 4. Features



### 4.1 Registro rápido de ejercicio (Today)

**Description:** El corazón del producto. Home muestra el estado de hoy y permite marcar/desmarcar ejercicio con un toque principal. Tras marcar, un selector rápido de **Workout Category** (omisible; recuerda la última usada) habilita **Post-Workout Suggestion** solo si se elige categoría concreta. Feedback inmediato (color, icono, texto). Realiza UJ-1, UJ-4.

**Functional Requirements:**

#### FR-1: Marcar Workout Day de hoy

El usuario puede marcar el día actual como **Workout Day** con un solo toque desde **Home**. Realiza UJ-1.

**Consequences (testable):**

- Tras el toque, Home muestra estado “Registrado” para la fecha local de hoy en menos de 500 ms percibidos.
- El **Workout Day** persiste en almacenamiento local y sobrevive recarga y cierre de pestaña.
- No se crean duplicados para la misma fecha.



#### FR-2: Desmarcar Workout Day de hoy

El usuario puede desmarcar el **Workout Day** de hoy desde **Home**, con diálogo de confirmación. Realiza UJ-1 (edge case).

**Consequences (testable):**

- Tras confirmar, hoy vuelve a estado “Sin registrar”.
- El registro se elimina del **Exercise Log** para esa fecha.



#### FR-3: Estado visible de hoy sin navegación

El usuario ve en **Home** si hoy está registrado o no sin cambiar de pantalla. Realiza UJ-1.

**Consequences (testable):**

- El estado refleja el **Exercise Log** al abrir la app.
- La fecha evaluada es la fecha local del dispositivo (no UTC fijo).



#### FR-14: Seleccionar Workout Category al marcar

Tras marcar un **Workout Day** (FR-1), el usuario puede indicar la **Workout Category** con un solo toque adicional. Realiza UJ-1.

**Consequences (testable):**

- Se muestran exactamente 4 opciones: piernas, torso, cardio, cuerpo completo.
- Si el usuario omite el selector, se persiste `no-especificado` y el registro queda guardado igualmente.
- La categoría se persiste junto al **Workout Day** en almacenamiento local.
- El flujo completo (marcar + categoría u omitir) permanece ≤ 7 s mediana en móvil.

**Out of Scope:**

- Texto libre o logging detallado de ejercicios en MVP.



### 4.2 Historial de constancia (History View)

**Description:** Vista de los últimos 30 días como calendario mensual compacto o lista alternativa. Muestra conteo simple (días registrados / 30) e indicador de **Stretch Session** por día cuando aplica. Realiza UJ-2.

**Functional Requirements:**

#### FR-4: Ver últimos 30 días

El usuario puede abrir **History View** y ver qué días son **Workout Day** en los últimos 30 días calendario junto con el ejercicio realizado ese dia. Realiza UJ-2.

**Consequences (testable):**

- Cada día se distingue visualmente: registrado (Workout Day), no registrado, hoy, y si hubo **Stretch Session** completada ese día (indicador secundario).
- El rango cubre exactamente 30 días incluyendo hoy hacia atrás.



#### FR-5: Resumen de constancia

El usuario ve un resumen numérico de días registrados en el período de 30 días. Realiza UJ-2.

**Consequences (testable):**

- El conteo coincide con el número de **Workout Day** en el rango visible.
- Se actualiza al marcar/desmarcar desde **Home** sin recargar manualmente.



#### FR-6: Alternar calendario y lista

El usuario puede cambiar entre vista calendario y vista lista en **History View**. Realiza UJ-2.

**Consequences (testable):**

- Ambas vistas muestran el mismo conjunto de datos.
- La preferencia de vista persiste entre sesiones `[ASSUMPTION: guardada en localStorage]`.



### 4.3 Estiramientos guiados (Stretch Player)

**Description:** Biblioteca embebida de **Stretch Routine** precargadas, con una rutina post-entreno por cada **Workout Category**. **Daily Stretch Routine** accesible desde Home; **Post-Workout Suggestion** tras FR-1 + FR-14. Instrucciones solo en español. Reproductor con temporizador, instrucción breve y navegación siguiente/anterior/pausa. Realiza UJ-1, UJ-3.

**Functional Requirements:**

#### FR-7: Rutina diaria de estiramientos

El usuario puede iniciar la **Daily Stretch Routine** desde **Home** en cualquier momento. Realiza UJ-3.

**Consequences (testable):**

- La rutina contiene entre 4 y 8 **Stretch Exercise**.
- Duración total de la rutina diaria entre 3 y 7 minutos `[ASSUMPTION]`.
- El **Stretch Player** muestra nombre, duración restante e instrucción del ejercicio actual.



#### FR-8: Sugerencia post-entreno adaptada

Tras marcar un **Workout Day** (FR-1) y elegir una **Workout Category** concreta (FR-14), el sistema ofrece una **Post-Workout Suggestion** acorde al tipo de entreno. Realiza UJ-1.

**Consequences (testable):**

- La sugerencia aparece en menos de 1 s tras el registro con categoría concreta (sin llamada de red en MVP).
- **No** se muestra si la categoría persistida es `no-especificado` (usuario omitió chips).
- Existe una rutina post-entreno distinta por cada **Workout Category** concreta (4 rutinas embebidas).
- Cada rutina post-entreno es distinta de la diaria, orientada a cooldown (≤ 5 min), con ejercicios que cubren los grupos musculares relevantes (p. ej. piernas → isquios, cuádriceps, glúteos).
- El usuario puede descartarla o iniciar el **Stretch Player**.
- Todas las instrucciones están en español.



#### FR-9: Reproducir Stretch Routine

El usuario puede completar una **Stretch Routine** en el **Stretch Player** con avance automático por temporizador. Realiza UJ-3.

**Consequences (testable):**

- El temporizador cuenta regresivamente por **Stretch Exercise**.
- Al llegar a 0, avanza al siguiente ejercicio o muestra pantalla de fin.
- El usuario puede pausar, saltar ejercicio y salir; **Salir** siempre abre diálogo de confirmación antes de abandonar.
- Abandonar sin completar no crea **Stretch Session** ni afecta **Workout Day**.
- Completar la rutina persiste una **Stretch Session** para la fecha local de hoy (FR-15).



#### FR-15: Registrar Stretch Session al completar rutina

Al terminar una **Stretch Routine** en el **Stretch Player**, el sistema registra que el usuario completó los ejercicios propuestos. Realiza UJ-3.

**Consequences (testable):**

- Se persiste `{ date, routineType, routineId }` en almacenamiento local.
- **No** crea ni modifica un **Workout Day**.
- **History View** muestra indicador de estiramientos completados ese día (FR-4).
- Múltiples sesiones el mismo día pueden coexistir con cero o un **Workout Day**.



#### FR-10: Al menos una sugerencia al abrir la app

Si el usuario abre la app y hoy no tiene **Workout Day**, Home muestra al menos una entrada a estiramientos (rutina diaria o mensaje equivalente). Realiza UJ-3.

**Consequences (testable):**

- En carga de Home, siempre hay un CTA visible hacia estiramientos.
- No bloquea el registro de ejercicio (FR-1 sigue siendo el CTA primario).

**Out of Scope:**

- Vídeo demostrativo, audio guiado, personalización manual de rutinas por el usuario en MVP.
- Generación de rutinas vía IA en MVP (diferido a v1.1; ver addendum).



### 4.4 PWA e instalación

**Description:** La app es instalable, mobile-first y usable offline para registro e historial. Realiza UJ-4.

**Functional Requirements:**

#### FR-11: Instalación PWA

El usuario puede instalar la app en la pantalla de inicio del móvil como **PWA Shell**. Realiza UJ-4.

**Consequences (testable):**

- Existe `manifest.webmanifest` con iconos, `display: standalone` y theme color.
- En navegadores compatibles, se muestra guía o prompt de instalación.
- Abierta desde icono, corre en modo standalone.



#### FR-12: Funcionamiento offline (core)

El usuario puede marcar/desmarcar **Workout Day** y ver **History View** sin conexión. Realiza UJ-1, UJ-2, UJ-4.

**Consequences (testable):**

- Service worker cachea shell y assets estáticos.
- Lectura/escritura del **Exercise Log** funciona offline.
- **Stretch Routine** precargadas disponibles offline (datos embebidos).



#### FR-13: Diseño mobile-first

La UI está optimizada para viewport móvil (320–428 px ancho) Debe ser Responsive. Realiza todos los UJ.

**Consequences (testable):**

- Área táctil del CTA principal ≥ 44×44 px.
- Sin scroll horizontal en Home y **History View** en viewports objetivo.
- Contraste y tipografía legibles en exterior (WCAG AA como objetivo, no bloqueante MVP).



## 5. Non-Goals (Explicit)

- Publicación en App Store / Google Play (nativa).
- Cuentas de usuario, login o sync en la nube (v1).
- Redes sociales, rankings, comunidad, retos compartidos.
- Integración con wearables (Apple Watch, Garmin, etc.).
- Planes de entrenamiento con periodización, series y pesos.
- Monetización: pagos, suscripciones, publicidad.
- Integración con gimnasios o entrenadores.
- Notificaciones push fiables en iOS `[NON-GOAL for MVP: limitación PWA; recordatorios diferidos a v2]`.
- Rachas gamificadas con presión/culpa como métrica principal `[ASSUMPTION: se muestra conteo, no racha punitiva]`.
- Editar o corregir **Workout Day** de fechas pasadas (decisión explícita: no se implementará).



## 6. MVP Scope



### 6.1 In Scope

- PWA Next.js + TypeScript, deploy Vercel Hobby.
- Almacenamiento local (`localStorage`) del **Exercise Log** (**Workout Day**, **Stretch Session**, preferencias).
- Home con registro 1-toque de hoy + selector de **Workout Category** (post-entreno condicionado a categoría concreta).
- **History View** (30 días, calendario + lista, resumen).
- **Stretch Player** con rutina diaria + 4 rutinas post-entreno (una por categoría).
- Copy e instrucciones de estiramientos solo en español.
- Offline para flujos core.
- Instalación PWA.



### 6.2 Out of Scope for MVP


| Ítem                              | Motivo / destino                                   |
| --------------------------------- | -------------------------------------------------- |
| Backend propio + PostgreSQL       | Fase 2; solo si se necesita sync multi-dispositivo |
| VPS Hetzner + Coolify             | Fase 2 opcional                                    |
| Export/import JSON                | v1.1 — bajo esfuerzo, no bloqueante                |
| Editar días pasados               | Rechazado — decisión de producto                   |
| Logging detallado (series, pesos) | Fuera de alcance permanente para este producto     |
| Rutinas IA personalizadas         | v1.1 — API IA opcional (ver addendum)              |
| Personalización manual de rutinas | Contenido curado + categorías suficiente en MVP    |
| Recordatorios programados         | Limitación PWA iOS; v2                             |
| Tema oscuro                       | Nice-to-have post-MVP                              |




## 7. Success Metrics

**Primary**

- **SM-1: Tiempo de registro** — Desde abrir la app hasta **Workout Day** marcado (incl. categoría u omitir): mediana ≤ 7 s en móvil. Valida FR-1, FR-3, FR-14, FR-11.
- **SM-2: Visibilidad de constancia** — El usuario puede identificar cuántos de los últimos 30 días entrenó en ≤ 10 s en **History View**. Valida FR-4, FR-5.
- **SM-3: Sugerencia de estiramiento** — En ≥ 90% de sesiones (marcar ejercicio o abrir sin registro), hay CTA de estiramiento visible. Valida FR-8, FR-10.

**Secondary**

- **SM-4: Adopción personal** — Uso activo ≥ 4 días/semana durante 4 semanas consecutivas (autoevaluación). Valida visión general.
- **SM-5: Offline reliability** — 100% de operaciones FR-1/FR-2/FR-4 exitosas en modo avión tras primera carga. Valida FR-12.

**Counter-metrics (do not optimize)**

- **SM-C1: Tiempo en app por sesión** — No optimizar duración de sesión; sesiones largas pueden indicar fricción, no engagement.
- **SM-C2: Días marcados sin ejercicio real** — No incentivar “marcar por marcar”; la app es herramienta personal, no juego de rachas.



## 8. Resolved Decisions


| #   | Pregunta                | Decisión                                                                                                                                                                     |
| --- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Nombre e icono          | **Marca Fit** — icono PWA: círculo verde (`#22c55e`) con check blanco centrado (símbolo de “hecho” / hábito cumplido).                                                       |
| 2   | Persistencia            | **localStorage** — ver razonamiento en `addendum.md` § Persistencia.                                                                                                         |
| 3   | Editar días pasados     | **No** — fuera de alcance actual.                                                                                                                                            |
| 4   | Idioma                  | **Solo español** en toda la UI y en instrucciones de estiramientos.                                                                                                          |
| 5   | Estiramientos adaptados | **MVP:** 4 rutinas embebidas mapeadas a **Workout Category** concreta; sin post-entreno si `no-especificado`. **v1.1:** API IA opcional (p. ej. DeepSeek); fallback offline a rutinas estáticas. |
| 6   | Stretch Session         | **Registro separado** de rutinas completadas; no equivale a **Workout Day**.                                                                                                                      |
| 7   | Post-workout omitido    | Si categoría `no-especificado`, **no** se muestra **Post-Workout Suggestion**; rutina diaria sigue disponible.                                                                                    |
| 8   | Salir del Player        | **Siempre** diálogo de confirmación; abandonar no registra sesión.                                                                                                                                |




## 9. Assumptions Index

- Estirar ≠ entrenar; **Stretch Session** y **Workout Day** son flujos y registros independientes (§2.3 UJ-3, FR-15).
- **Workout Category** omisible → `no-especificado`; sin post-entreno en ese caso (§4.1 FR-14, FR-8).
- Rutina diaria: 4 ejercicios de estiramiento, 3–7 min total (§4.3 FR-7).
- Rutina post-entreno por categoría: cooldown ≤ 5 min (§4.3 FR-8).
- Sin vídeo en **Stretch Exercise**; solo texto en español (§3 Glossary).
- Preferencia calendario/lista persistida en localStorage (§4.2 FR-6).
- Conteo de constancia, no racha punitiva gamificada (§5).
- Usuario único, dispositivo principal móvil; sin sync v1 (§2.2, §6).
- Contenido de estiramientos curado y embebido en build; inspirado en rutinas públicas estándar, redactado en español propio (§4.3).
- IA para estiramientos diferida a v1.1; MVP no depende de red para sugerencias (§8 #5).

