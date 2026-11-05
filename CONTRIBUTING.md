# Guía de contribución — Mascota-SNII

Esta guía rige cambios humanos o hechos con Codex/Work/IA. **Idioma preferido de documentación y comentarios: español.** Mantener identificadores técnicos y nombres de API con su grafía original.

## Antes de cambiar algo

1. Leer [README](README.md), [índice documental](docs/README.md), [estado](docs/01-proyecto/ESTADO_ACTUAL.md) y [arquitectura](docs/03-tecnica/ARQUITECTURA.md).
2. Verificar el comportamiento **en el código actual**, no en una especificación histórica.
3. Identificar si afecta a `src/core` (reglas), `src/data` (contenido), `src/ui` (interfaz) o `public` (PWA/assets).
4. Revisar compatibilidad con partidas anteriores, datos persistentes y el vínculo `activity.id`.

## Estilo de documentación y comentarios

- En cada módulo importante, explicar su **responsabilidad**, entradas, salidas e invariantes.
- Preferir JSDoc/TSDoc para funciones públicas o complejas: parámetros, retorno, efectos, errores, límites y ejemplos cuando aclaren.
- Comentar el **porqué** de fórmulas, umbrales, validación, riesgos de cambio, datos versionados y decisiones de accesibilidad. No comentar mecánicamente cada asignación evidente.
- Señalar qué es criterio pedagógico, decisión de juego, valor provisional o requisito normativo **verificado**.
- Si cambia una regla, actualizar comentario, tests y documento en el **mismo commit**.
- No mezclar instrucciones para asistentes o texto de documentación dentro de los cálculos ejecutables.

## Invariantes fundamentales

- El motor calcula UPE/PA/CR; la interfaz no los adjudica directamente.
- Comandos con revisión e idempotencia: un reintento no duplica recompensas.
- Guardado IndexedDB, exportación JSON, progreso de preguntas y tiempo offline conservan compatibilidad.
- Estación, pregunta y progreso siempre se asocian por **`activity.id`**, nunca por el título o posición.
- Cada actividad presenta **cinco** pasos con índices estables. No alterar preguntas ya publicadas sin revisar su progreso migrado.
- Animaciones y reacciones visuales no deciden economía ni requieren movimiento obligatorio.
- Reglas SNII del juego son ficción, no disposiciones oficiales.

## Validación obligatoria

~~~bash
npm install
npm run typecheck
npm test
npm run build
~~~

Para cambios de UI, añadir **prueba manual** en móvil y escritorio, teclado, preferencia de movimiento reducido, persistencia tras recarga y funcionamiento offline. Documentar explícitamente si la prueba manual no se pudo completar.

## Pull requests y documentación

Explicar: problema, modificación, invariantes afectadas, nuevas pruebas, compatibilidad, capturas si hay interfaz y pendientes. Actualizar [CHANGELOG](CHANGELOG.md) cuando cambien funcionalidades; [Estado actual](docs/01-proyecto/ESTADO_ACTUAL.md) y [Hoja de ruta](docs/01-proyecto/HOJA_DE_RUTA.md) cuando cambie el alcance.

Guías temáticas: [pedagogía y estaciones](docs/02-juego/PEDAGOGIA_Y_ESTACIONES.md), [persistencia](docs/03-tecnica/PERSISTENCIA_Y_COMANDOS.md), [pruebas](docs/04-calidad/PRUEBAS_Y_ACEPTACION.md).

**Antes de aportar recursos externos**, verificar permisos/licencias. No se presupone licencia general de reutilización para este repositorio.
