# Pruebas y criterios de aceptación

## Automatizadas

`npm run typecheck`, `npm test`, `npm run build`. `npm test` compila y ejecuta los archivos Node de `tests/`. En v0.10.0 se comprobó localmente una batería de **71 pruebas** (recontar en GitHub Actions tras cada cambio).

`tests/area-routes.test.mjs` cubre la nueva extensión: nueve especies/14 cuadros, 126 misiones, dos especializaciones por área, 18 finales de relato, una recompensa por etapa y compatibilidad con las siete áreas existentes. `tests/documentation.test.mjs` verifica enlaces de las guías actuales. Otras suites cubren motor, cuidado, salud, preguntas, escenas y animación.

## Pendiente de validación humana

1. Seleccionar nueve especies desde una partida nueva y verificar que ninguna se muestre como otra.
2. Abrir seis estaciones por nivel, responder cinco preguntas y comprobar los aciertos tras recargar.
3. Desde Universidad, elegir ambas rutas en partidas independientes y comprobar textos hasta Emérito.
4. Cambiar área conservando la economía y descartando una ruta incompatible.
5. Exportar/importar una partida de siete áreas, con una nueva de nueve y probar sesiones offline.
6. Probar iOS/Android, escritorio, teclado, `prefers-reduced-motion` y lector de pantalla.
7. Comprobar que Netlify sirva los dos SVG nuevos y que el service worker actualice cachés.

**Una compilación correcta no equivale a aprobar las pruebas visuales, el balance ni una evaluación pedagógica externa.**
