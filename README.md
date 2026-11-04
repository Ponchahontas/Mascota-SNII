# Mascota-SNII — Tamagotchi Académico (MVP v0.3)

Juego satírico en español y **local-first** sobre una trayectoria académica ficticia de **14 etapas**, desde Kínder hasta Emérito. Tiene **84 actividades exclusivas por etapa** y **siete mascotas visualmente diferentes por área**, cada una con 14 cuadros de evolución. El jugador acompaña y cuida; la mascota realiza las actividades educativas apropiadas a su etapa.

> **Aviso:** las puntuaciones, requisitos, evidencias y representaciones son **ficticios**. No equivalen a evaluaciones, dictámenes, niveles ni criterios oficiales del SNII. El proyecto no declara afiliación institucional.

## Estado verificable

- Aplicación estática PWA programada en TypeScript, CSS y SVG.
- Compilación local con `npm run build`, comprobación `npm run typecheck` y **19 pruebas automatizadas Node** del motor ejecutadas correctamente en la versión documentada.
- Guardado en IndexedDB, exportación/importación JSON, eventos, cuidado, proyectos, tiempo offline limitado, logros, asistentes básicos y legado voluntario.
- La validación automatizada **no cubre todavía** el juego completo en navegadores reales, accesibilidad exhaustiva ni instalación PWA móvil. No afirmar que Netlify está desplegado o verificado solo por la existencia de `netlify.toml`.

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
- **Sin final obligatorio:** al alcanzar suficiente trayectoria se puede comenzar una nueva generación y mantener récords.

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


## Sistema de bienestar v0.5

Los cinco medidores ahora se deterioran gradualmente en el tiempo y producen efectos jugables: menor rendimiento, bloqueos temporales y una posible **deserción ficticia por crisis combinada prolongada**. Se elige entre Tranquilo (sin pérdida definitiva), Equilibrado (18 h críticas acumuladas) y Exigente (12 h). Una sola ausencia procesa un máximo de ocho horas; el cuidado siempre está disponible sin consumir puntos de acción. Un desenlace conserva los récords y permite iniciar otra generación. Las partidas v2 siguen siendo compatibles mediante el campo opcional `risk`.

Consulta [la guía completa de bienestar](docs/12_SISTEMA_DE_BIENESTAR.md) y [los criterios de interfaz](docs/13_INTERFAZ_Y_ALERTAS.md). **El balance es ficticio y provisional, no oficial ni clínico.**
