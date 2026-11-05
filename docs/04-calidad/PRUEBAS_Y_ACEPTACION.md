# Pruebas, revisión y criterios de aceptación

## Automatización disponible

Comandos: `npm run typecheck`, `npm test` y `npm run build`. `npm test` construye el proyecto y ejecuta `node --test tests/*.test.mjs`. El workflow `.github/workflows/check.yml` realiza verificaciones en GitHub.

Archivos de pruebas existentes:
- `tests/engine.test.mjs`: economía, cuidado y progresión.
- `tests/health.test.mjs`: necesidades, deserción y dificultad.
- `tests/pet-animation.test.mjs`: estados y reacciones.
- `tests/learning-path.test.mjs`: contenidos iniciales.
- `tests/learning-sequences.test.mjs`: cinco pasos, registro de aciertos y bonificaciones.
- `tests/station-links.test.mjs`: vinculación entre 14 etapas, sus seis estaciones y aventuras.

La documentación v0.9 informa **61 pruebas** pasadas en esa iteración. Recontarlas cada vez que cambien los tests. **No se realizaron aquí pruebas visuales completas**.

## Revisión manual obligatoria antes de afirmar que está listo

1. Comenzar partida nueva en varias áreas; comprobar especie y cuadro de evolución.
2. En cada una de las 14 etapas, pulsar las seis estaciones, alternarlas y verificar encabezado, icono, pregunta y progreso.
3. Responder mal y bien; confirmar que solo aciertos se guardan, sin pérdida de PA por intentar.
4. Completar 5/5; comprobar primera recompensa y repetición sin premio duplicado.
5. Recargar, cerrar y volver; validar progreso y backup JSON.
6. Simular pérdida de energía/estrés y probar tres dificultades y recuperación gratis.
7. Revisar movimiento reducido, teclado, foco, lectores de pantalla, 320–375 px.
8. Instalar la PWA, desconectar red y comprobar caché/guardado y actualización.
9. Confirmar que la URL pública sirve correctamente `index.html` y no devuelve fallos 404.

## Regla de aceptación

Un cambio solo es **verificado automáticamente** cuando las pruebas corren con éxito para ese commit. Solo es **validado visualmente** tras probarse realmente en navegador. Conservar evidencia en PR/issue y señalar lo que queda pendiente.

Volver al [índice](../README.md).
