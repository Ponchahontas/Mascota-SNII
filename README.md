# Mascota-SNII — Tamagotchi Académico (MVP v0.7)

Juego satírico en español y **local-first** sobre una trayectoria académica ficticia de **14 etapas**, desde Kínder hasta Emérito. Tiene **84 actividades exclusivas por etapa** y **siete mascotas visualmente diferentes por área**, cada una con 14 cuadros de evolución. El jugador acompaña y cuida; la mascota realiza las actividades educativas apropiadas a su etapa.

> **Aviso:** las puntuaciones, requisitos, evidencias y representaciones son **ficticios**. No equivalen a evaluaciones, dictámenes, niveles ni criterios oficiales del SNII. El proyecto no declara afiliación institucional.

## v0.7 · Aprender jugando y acompañar con preguntas

- **14 capítulos de aprendizaje**: cada etapa explica qué se aprende, por qué importa, cómo acompañar a la mascota y una aplicación cotidiana.
- **84 microdesafíos contextualizados**: uno por actividad con tres opciones, pista al equivocarse y explicación tras acertar.
- **Sin penalización por explorar**: responder no consume PA ni CR ni afecta a la mascota. Los recursos se aplican al confirmar la actividad en el motor; sigue disponible «⚡ Repetir» para sesiones rápidas.
- **Conservar partidas**: no se modificó el esquema IndexedDB (v2). El minireto es temporal y no se guarda.
- El contenido pedagógico es general y el SNII del juego es una simulación satírica, no un criterio oficial. Ver `docs/15_GUIA_PEDAGOGICA_INTERACTIVA.md`.

## Estado verificable

- Aplicación estática PWA programada en TypeScript, CSS y SVG.
- Compilación local con `npm run build`, comprobación `npm run typecheck` y **pruebas automatizadas Node** del motor ejecutadas correctamente en la versión documentada.
- Guardado en IndexedDB, exportación/importación JSON, eventos, cuidado, proyectos, tiempo offline limitado, logros, asistentes básicos y legado voluntario.
- La validación automatizada **no cubre todavía** el juego completo en navegadores reales, accesibilidad exhaustiva ni instalación PWA móvil. No afirmar que Netlify está desplegado o verificado solo por la existencia de `netlify.toml`.

**Animaciones v0.6:** cansancio, estrés, distracción, desmotivación, bajo bienestar y celebración/reacción al cuidado; control para pausar movimientos y respeto a `prefers-reduced-motion`. Las reacciones son solo visuales y no modifican las partidas. Ver [docs/14_ANIMACIONES_DE_ESTADO.md](docs/14_ANIMACIONES_DE_ESTADO.md).

**Repositorio de desarrollo:** https://github.com/Ponchahontas/Mascota-SNII

## Ejecutar

Requisitos: Node.js 20 o posterior y npm.

```bash
npm install
npm run typecheck
npm test
npm run dev
```

Abre `http://localhost:4173`. Para crear la distribución estática usa `npm run build`: publica **el contenido** de `dist/`. Netlify puede construir desde GitHub usando `npm run build` y el directorio `dist`, o recibir la carpeta compilada mediante Netlify Drop.

## Mecánicas implementadas

- **Desarrollo por etapa:** seis actividades educativas propias de cada nivel; no hay tutorías impartidas por menores en Kínder.
- **Rol del jugador:** selecciona actividades, brinda cuidados, toma decisiones y controla el expediente. La mascota actúa, con apoyo escolar cuando procede.
- **Economía ficticia:** PA se regeneran con el tiempo; CR son recursos de juego; UPE son progreso lúdico; proyectos conceden evidencias ficticias.
- **Área/especie:** siete tipos originales con identidad persistente y evolución a través de los catorce niveles.
- **Guardado y seguridad:** IndexedDB con transacciones para resultado y snapshot, revisión de partida, importación JSON validada, exportación manual.
- **Consecuencias académicas:** cinco medidores se deterioran con el tiempo, reducen rendimiento, pueden bloquear actividades temporalmente y desencadenar deserción ficticia tras crisis combinadas prolongadas.
- **Tres dificultades:** Tranquilo (sin deserción), Equilibrado (deserción tras 18 h de crisis combinada) y Exigente (12 h). Una sola ausencia procesa como máximo ocho horas y hay formas de recuperación con cuidados.
- **Finales y reinicio:** el legado sigue siendo voluntario, pero una deserción en dificultades superiores termina la generación; se conserva su récord y puede comenzar otra oportunidad.

## Mapa de carpetas

| Carpeta o archivo | Responsabilidad |
| --- | --- |
| `src/data/` | Actividades por etapa, balance ficticio, nombres y metadatos de especie |
| `src/core/engine-game.ts` | Reglas puras de actividades, recursos, carrera, offline y legado |
| `src/core/state.ts` | Esquema de guardado y contratos de estado |
| `src/core/persistence.ts` | IndexedDB, validaciones, idempotencia y conflictos de versión |
| `src/core/game-coordinator.ts` | Canal de órdenes entre UI y persistencia |
| `src/ui/app.ts` | Presentación y eventos de usuario; no entrega recompensas directamente |
| `public/pets/` | Siete sprites SVG de 14 evoluciones |
| `public/sw.js` | Caché de la aplicación PWA, separado de partidas privadas |
| `tests/` | Pruebas de regresión del motor |
| `docs/` | Diseño, decisiones, glosario y guías de mantenimiento |

## Documentación para quien revise el código

- **[CONTRIBUTING.md](CONTRIBUTING.md):** convención obligatoria de comentarios en español, JSDoc/TSDoc, revisión de cambios y pruebas.
- **[docs/11_GUIA_DE_CODIGO.md](docs/11_GUIA_DE_CODIGO.md):** ruta de comandos, invariantes, campos del guardado, recuperación de PA, balances, sprites y puntos de extensión.
- **[PROMPT_MAESTRO_ASTRA.md](PROMPT_MAESTRO_ASTRA.md):** visión de producto a largo plazo; distinguir planes futuros de funciones existentes.

La documentación en el código explica restricciones, fórmulas y decisiones; no se agregan comentarios a cada línea trivial. **Cuando una regla cambia, su explicación y sus pruebas deben actualizarse en el mismo cambio.**

## Pendientes

Pruebas end-to-end en navegador y móvil; ajustes de balance con simulación; auditoría WCAG; migración robusta de partidas antiguas; sistema avanzado de inventarios, proyectos, eventos y automatizaciones; verificación oficial de normas y áreas vigentes; validación de publicación y actualización PWA.

## Licencia

**Pendiente de elección expresa por la persona propietaria.** No se ha asignado licencia abierta por defecto.

## Balance de salud y consecuencias (v0.5)

Ver [docs/12_SISTEMA_DE_BIENESTAR.md](docs/12_SISTEMA_DE_BIENESTAR.md). Las horas se procesan solo al abrir/activar la app o durante su uso, con límite de ocho horas por visita. No hay procesos ejecutándose en segundo plano. Las tasas y umbrales son provisionales, no parámetros clínicos ni requisitos oficiales. Los guardados v2 permanecen compatibles: el campo `risk` es opcional.

## Novedades v0.8 — aventuras de cinco descubrimientos

Cada una de las 84 actividades incluye **cinco retos con pistas y explicaciones**.
Una barra de progreso guarda las respuestas correctas, incluso si se recarga la
página; acertar es gratis. Al completar los cinco, se desbloquea **Repetir** y
la primera práctica guiada concede un bono moderado de +25 % UPE, una sola vez.
Los cinco aciertos no conceden puntos por sí solos: para ganar UPE hay que
confirmar una práctica y disponer de PA y bienestar suficientes.

En Kínder, los retos adicionales son diferentes para cada actividad. En las
etapas posteriores, cuatro preguntas transversales se comparten por nivel,
además del reto original propio de cada actividad; es un primer banco que se
ampliará progresivamente. No hay 420 preguntas distintas todavía.

El entorno de la mascota muestra un paisaje por etapa —patio, aula, taller,
vestíbulo universitario, biblioteca o laboratorio— y **seis estaciones
interactivas**. Pulsar una estación provoca un desplazamiento de la mascota
hasta la actividad; el movimiento es meramente visual y se puede desactivar.

Consulta [la guía técnica y pedagógica v0.8](docs/16_MISIONES_Y_ESCENARIOS_V08.md).
