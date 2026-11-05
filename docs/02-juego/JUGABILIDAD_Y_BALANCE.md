# Jugabilidad, cuidado y balance

## Bucle básico

**Elegir etapa/área → explorar una estación → resolver cinco descubrimientos → confirmar práctica → obtener avance → cuidar a la mascota → cumplir requisitos de transición.** Las seis aventuras de cada etapa pueden alternarse; el progreso se identifica por actividad.

## Recursos

- **PA**: puntos de acción para prácticas; se recuperan con el tiempo hasta el máximo de la etapa. La tasa y máximo están en `STAGES` de `src/data/catalog.ts`. El paso del tiempo incluye acumulación compatible con fracciones.
- **CR**: créditos ficticios para ciertas acciones y cuidados; prever rutas de recuperación gratuitas para evitar partidas bloqueadas.
- **UPE**: unidades ficticias de progreso de etapa. La progresión requiere también las condiciones que valida el motor; alcanzar el objetivo numérico no garantiza por sí solo la transición.
- **Proyectos/evidencias**: operaciones específicas del motor; el avance pasivo no crea automáticamente publicaciones ni reconocimientos.

## Necesidades y riesgo

Cinco indicadores principales de 0 a 100: energía, motivación, concentración, bienestar y estrés (a diferencia de los demás, el estrés **perjudica cuando aumenta**). Valores extremos reducen el rendimiento o bloquean temporalmente el estudio. La deserción lúdica no surge por un clic aislado: depende de crisis combinadas sostenidas y de la dificultad.

Dificultades: `tranquilo`, `normal` (Equilibrado) y `exigente`. Los cálculos y umbrales actuales tienen su fuente única en `src/core/engine-health.ts`; no copiar números aislados a la interfaz ni asumir que ya están equilibrados.

## Filosofía educativa

- Respuestas incorrectas: explicación y posibilidad de reintentar, sin castigar con PA.
- Cinco descubrimientos correctos: abren la práctica y el modo de repetición según el flujo vigente.
- Repeticiones: no deben generar recompensas de primera vez otra vez.
- Cuidados: no consumen PA; algunas acciones cuestan CR, y existe acompañamiento gratuito de recuperación.
- El usuario elige y acompaña; no hace pasar el trabajo de la mascota por el suyo.

## Para revisar reglas reales

Consultar `src/core/engine-game.ts`, `src/core/engine-health.ts`, `src/core/engine-needs.ts` y `src/data/stage-activities.ts`. La [tabla antigua](../historico/01_TABLA_ETAPAS.md) y la [matriz antigua](../historico/02_ACTIVIDADES_Y_NEcesidades.md) son propuestas históricas, **no** parametrizaciones vigentes.

Volver al [índice](../README.md).
