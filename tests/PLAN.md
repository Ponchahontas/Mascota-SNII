# Estado de pruebas y plan de validación

El MVP v0.9 **sí incluye una suite automatizada** en `tests/*.test.mjs`; no debe confundirse este documento con el plan inicial antes de implementar el juego.

## Automatizadas disponibles

- `engine.test.mjs`: comandos, progresión, economía y cuidados.
- `health.test.mjs`: desgaste, crisis, recuperaciones y dificultad.
- `pet-animation.test.mjs`: expresiones y reacciones visuales como estados calculados.
- `learning-path.test.mjs`: contenido de desafíos.
- `learning-sequences.test.mjs`: cinco respuestas, persistencia y recompensas.
- `station-links.test.mjs`: correspondencia de seis estaciones por 14 etapas con la actividad elegida.

Comandos: `npm run typecheck`, `npm test`, `npm run build`. Consultar **GitHub Actions** para el resultado del commit actual. El informe v0.9 consignó 61 pruebas; la cifra puede cambiar con nuevas pruebas.

## Pendientes de validación manual e integración

1. Navegación por las seis estaciones en todas las etapas, incluyendo cambio de pregunta sin mezclas.
2. Guardados, importación de JSON antiguo, revisiones y doble ejecución tras recargar.
3. Interacción en dispositivos móviles, lector de pantalla, teclado y `prefers-reduced-motion`.
4. Instalación PWA, caché, actualización y funcionamiento real fuera de línea.
5. Balance de sesiones cortas/largas, riesgos y ausencia de estados imposibles de recuperar.
6. Validación pedagógica de preguntas con docentes y especialistas.

Guía canónica de aceptación: [docs/04-calidad/PRUEBAS_Y_ACEPTACION.md](../docs/04-calidad/PRUEBAS_Y_ACEPTACION.md).
