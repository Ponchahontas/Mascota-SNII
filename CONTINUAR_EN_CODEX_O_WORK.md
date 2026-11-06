# Instrucciones de continuidad para Codex / ChatGPT Work — v0.10.0

No empezar de cero. El repositorio tiene nueve mascotas, 14 etapas, 84 actividades con cinco retos, y nueve rutas temáticas de campo con dos especializaciones cada una.

1. Leer [README.md](README.md), [docs/README.md](docs/README.md), [Estado actual](docs/01-proyecto/ESTADO_ACTUAL.md), [Rutas](docs/02-juego/AREAS_Y_RUTAS.md), [Arquitectura](docs/03-tecnica/ARQUITECTURA.md) y [CONTRIBUTING.md](CONTRIBUTING.md).
2. Ejecutar `npm install`, `npm run typecheck`, `npm test`, `npm run build` y consultar GitHub Actions del commit actual.
3. Mantener `schemaVersion: 2`, conservar los siete IDs previos de área y los nuevos `conducta`, `interdisciplinaria`. No alterar IDs de ramas/actividades/pasos sin migraciones.
4. Tratar las áreas oficiales como categorías de referencia, no los puntos/rutas ficticios como criterios legales del SNII.
5. Trabajar en cambios acotados, **bien comentados en español**, con pruebas de regresión y documentación del propósito y consecuencias de cada cambio.
6. Priorizar experiencia visual en navegador, accesibilidad, balance de dificultad, revisión pedagógica y minijuegos táctiles. Revisar la [Hoja de ruta](docs/01-proyecto/HOJA_DE_RUTA.md).
7. Para publicar en Netlify, usar rama `main`, `npm run build`, `dist`. Verificar de verdad la URL pública, la caché y los SVG nuevos; no asumir éxito por compilar.

**Estado de salida:** edición de nueve áreas con historias educativas, 18 cierres narrativos, progreso compatible. Los seis juegos de preguntas por etapa son comunes a las áreas y pueden especializarse después sin romper el guardado.
