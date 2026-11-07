# Historial de cambios

## v0.12.0 — Casos aplicados para las nueve áreas

- Se incorporan 90 casos con escenario, decisión, distractores plausibles, pista y retroalimentación; abarcan Universidad a Emérito en las nueve áreas.
- El aprendizaje queda visible después de registrar el reto de campo. Se preservan preguntas escolares, seis estaciones por etapa, 420 descubrimientos, recompensas y guardados existentes.
- Se amplían pruebas de cobertura y compatibilidad, actualizando la caché PWA y la documentación.
- Pendiente: revisión pedagógica de especialistas y pruebas visuales con jugadores.


## v0.11.1 — Corrección editorial de redundancias (6 de noviembre de 2026)

- Se elimina la introducción duplicada en la sección de Carrera de las nueve áreas y catorce etapas.
- Las 126 misiones reciben escenas, preguntas, pistas y explicaciones diferenciadas por etapa.
- Se diversifica el lenguaje de las cuatro preguntas complementarias de 78 actividades y se distribuye la posición correcta.
- Ayuda sobre especializaciones desplegable antes de Universidad; leyenda de mascota condensada.
- Pruebas de calidad textual, documentación y versión nueva de caché PWA. No cambian aciertos, guardados, recursos ni recompensas.


## Auditoría documental y de calidad — 6 de noviembre de 2026 (sin cambios a reglas del juego)

- Matriz de solicitudes históricas: implementado, parcial y pendiente. Se señala que **no existe el mínimo de 24 horas por etapa**.
- Guía para nuevos revisores con mapa de módulos, contratos persistentes y decisiones delicadas.
- Comentarios sincronizados con nueve mascotas y preguntas de opción múltiple (no minijuegos manipulativos).
- Prueba nueva de integridad de recursos precargados, documentación y nueve áreas.
- No cambia esquema IndexedDB, recompensas, dificultad ni identidad visible. · Academic Pet (Mascota-SNII)

## v0.11.0 — Identidad original Academic Pet

- Nombre visible unificado en pantalla, título de navegador, metadatos, PWA, README e instrucciones técnicas.
- Se elimina el uso promocional y descriptivo de denominaciones de productos de terceros; la propuesta se presenta como mascota virtual educativa original.
- Nuevos respaldos JSON con identificador `academic-pet` y nombre de archivo `academic-pet-generacion-N.json`.
- Se mantienen la base IndexedDB y el identificador PWA existente para conservar partidas e instalaciones; se aceptan respaldos históricos.
- Nuevo prefijo de caché `academic-pet-shell-`, limpieza acotada de las cachés propias anteriores y incremento de versión.
- Guía de identidad, pruebas de regresión y auditoría de textos. No cambia la progresión, las nueve áreas ni el balance.
- **Pendiente legal:** comprobar disponibilidad del nombre en el IMPI y otras jurisdicciones antes de registrarlo o explotarlo comercialmente.

## v0.10.0 — Nueve áreas, 126 evoluciones y rutas académicas

- Nuevos personajes: **Colibrí pedagogo** (IV. Conducta y Educación) y **Quimera interdisciplinaria** (IX).
- Mantiene los siete identificadores anteriores y añade nueve recorridos temáticos de 14 etapas.
- **126 misiones de campo**, dos especializaciones por área desde Universidad y **18 cierres narrativos**.
- Motor con una recompensa por etapa, registro de hitos y decisiones persistentes opcionales.
- Regeneración documentada de SVG y corrección del rostro de Quimera.
- Caché PWA v10 con nuevos sprites y módulo de rutas; borrado acotado por prefijo.
- README, índice de documentación, guía de áreas, arquitectura y convenciones de comentarios actualizados.
- **71 pruebas locales** aprobadas, incluidas validaciones de documentación. Pendiente prueba visual en navegador y revisión pedagógica profesional.

## Documentación — 4 de noviembre de 2026

- Reorganización temática de las guías técnicas y pedagógicas.
- Conservación de 18 documentos antiguos en `docs/historico/` y enlaces de compatibilidad.
- Actualización de las instrucciones de continuidad para Codex/Work y convenciones de contribución.


## v0.9.0 — Una estación, una actividad y sus cinco preguntas

- Identidad visible de la estación elegida: icono, nombre, etapa, posición 1–6.
- Fuente de selección por `activity.id` compartida entre escenario, tarjetas,
  movimiento de la mascota y preguntas. Destacado visual en ambos paneles.
- 78 perfiles específicos de Primaria a Emérito, cuatro momentos por actividad
  además del desafío inicial; se eliminaron bancos transversales repetidos.
- 420 textos de pregunta únicos; Kínder conserva sus preguntas infantiles.
- Repaso gratuito de las preguntas para partidas ya completadas, sin borrar
  aciertos y sin modificar la economía del juego.
- Validaciones nuevas: cobertura de 84 estaciones, texto vinculado, bloqueo
  entre etapas, independencia de progreso, ausencia de efectos de lectura.
- `sw.js` actualizado para incluir `activity-extras.js` y caché v9.
- 61 pruebas locales aprobadas; pendiente verificación visual real en navegador.


## v0.8.0 — Exploración por estaciones y rutas de cinco pasos

- Cinco retos en cada una de las 84 actividades (420 posiciones jugables).
- Cuatro preguntas adicionales específicas para cada actividad de Kínder.
- Para otras etapas, cuatro retos transversales de cada etapa, compartidos entre
  actividades de ese mismo nivel. Pendiente: ampliar el catálogo individual.
- Progreso por respuesta guardado localmente y validado con el comando
  transaccional `learning.answer`; sin gastar PA ni UPE al acertar o fallar.
- «Repetir» se desbloquea tras cinco aciertos por aventura.
- Bono único del 25 % a la primera práctica guiada; la repetición mantiene
  costes, rendimiento y desgaste habituales.
- Álbum de progreso opcional de la etapa con 30 aciertos distribuidos en seis
  aventuras; NO se exige completarlo para avanzar de nivel académico.
- 14 paisajes ilustrados con CSS y seis estaciones interactivas por etapa;
  desplazamiento visual hacia la estación; respeto al movimiento reducido.
- Compatibilidad con partidas anteriores (nuevos campos opcionales en JSON).
- Nueve pruebas del motor y contenido nuevas (55 pruebas totales).
- Limitación: falta prueba visual real porque el navegador automatizado del
  entorno bloquea la navegación a localhost y file://.
