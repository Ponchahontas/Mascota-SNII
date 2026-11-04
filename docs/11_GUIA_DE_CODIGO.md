# Guía técnica anotada — Mascota-SNII v0.3

> **Alcance:** descripción del código implementado, no de funciones todavía planificadas. Consulta también `CONTRIBUTING.md`. Los criterios, puntos, evidencias y premios de este juego son ficticios. La referencia a SNII no implica afiliación ni evaluación oficial.

## 1. Mapa de ejecución

```text
src/main.ts
 └─ src/ui/app.ts               [interfaz y delegación de botones]
     └─ src/core/game-coordinator.ts
         └─ src/core/persistence.ts  [IndexedDB: partida + bitácora]
             └─ src/core/engine-game.ts [motor puro]
                 ├─ src/data/catalog.ts
                 ├─ src/data/stage-activities.ts
                 ├─ src/core/engine-needs.ts
                 └─ src/core/state.ts

public/sw.js                       [caché del shell, nunca de partidas]
public/pets/*.svg                  [7 especies, 14 cuadros por especie]
scripts/build.mjs                  [TypeScript -> dist + archivos estáticos]
tests/engine.test.mjs              [19 pruebas automatizadas locales]
```

**Regla central:** el render de UI no entrega recompensas. El motor calcula consecuencias; IndexedDB confirma la operación; la interfaz vuelve a leer el snapshot confirmado.

## 2. Guardado, revisiones e idempotencia

**`GameSave`** es el estado completo de la partida, serializable en JSON. Sus campos importantes:

| Campo | Significado técnico | Advertencia |
| --- | --- | --- |
| `gameId` | Identificador estable de la partida | No confundir con `pet.id` |
| `schemaVersion` | Versión del contrato de guardado | Cambios incompatibles requieren migración |
| `contentVersion` | Referencia del catálogo de contenido | No implica validez normativa |
| `balanceVersion` | Referencia de reglas numéricas | Documentar cada ajuste de balance |
| `normativeVersionId` | Estado de respaldo oficial | En MVP es `unverified` |
| `revision` | Número de versión del snapshot | Previene escrituras entre pestañas con estado viejo |
| `stageIndex` | Índice de etapa de 0 a 13 | Se relaciona con sprites y actividades |
| `stageXp` / `totalXp` | UPE actual / UPE históricos | No son méritos académicos oficiales |
| `evidence` | Evidencias lúdicas disponibles | No son documentos acreditados |
| `ap` | PA enteros disponibles | Nunca superar máximo de etapa |
| `apRegenRemainder` | Fracción de PA acumulada (0 a <1) | Impide perder recuperación al procesar minutos |
| `lastProcessedSimTime` | Marca temporal ISO del último proceso | Se compara con `time.processOffline` |
| `areaId` | Identidad visual de especie | No cambia balance en el MVP |
| `careTimes` | Último uso de cuidados por tipo | Permite enfriamientos en milisegundos |

### Secuencia de una escritura

1. `issueCommand()` prepara `commandId`, `gameId`, `type`, `payload` y `expectedRevision`.
2. `commitCommand()` abre **una** transacción `readwrite` para `saves` y `commands`.
3. Si el `commandId` existe con la misma huella, responde `replayed` sin rehacer la acción. Si el ID existe con otra huella, responde `IDEMPOTENCY_KEY_REUSE`.
4. Si la partida/revisión no coincide, responde `STATE_CONFLICT` para que la UI vuelva a cargar el estado.
5. Aplica el motor a una copia del snapshot; escribe estado y resultado del comando en la transacción.
6. Solo en `tx.oncomplete` se considera que el guardado fue confirmado.

**Qué no hacer:** separar las escrituras, cambiar `expectedRevision` sin recuperar el estado, o insertar un `await` arbitrario en callbacks que sostienen transacciones IndexedDB. El coordinador crea un ID por acción; reintentos de red con el mismo ID todavía no están implementados en esta UI.

## 3. Mecánicas y cálculos provisionales

### Actividades por etapa

El archivo `src/data/stage-activities.ts` contiene **84 filas** (seis para cada una de las 14 etapas). Las filas explican quién actúa y el contexto educativo. La función `activitiesForStage(stageIndex)` selecciona las válidas. El motor vuelve a comprobar `minStage/maxStage`, por lo que ocultar un botón **no constituye validación suficiente**.

Cada fila contiene: `stage`, `id`, `label`, `icon`, `pa`, `pe`, `credits`, `energy`, `stress`, `focus`, `type` y `flavor`.

- `pa` son puntos de acción **base**; el costo final es `max(1, ceil(pa * stage.cost))`.
- `pe` son UPE **base**; el rendimiento se ajusta por `stage.reward`, necesidades actuales, repetición y variedad.
- `credits` es una variación de créditos ficticios; números positivos en edades escolares representan apoyos o intercambios simbólicos, **nunca empleo infantil**.
- `energy`, `stress` y `focus` son cambios relativos en atributos de la mascota.
- `flavor` describe el contexto de la acción y aclara cuándo la mascota recibe acompañamiento.

### Rendimiento de una actividad

Se calcula un factor de condición a partir de energía, motivación, concentración y el complemento de estrés, limitado entre `0.45` y `1.15`. Repetir una misma actividad reduce el rendimiento hasta `0.55`. Alternar actividades diferentes puede multiplicarlo por `1.12`. El motor redondea UPE a entero no negativo. **Ninguno de estos números proviene de criterios oficiales SNII.**

### Evidencias y transición

- Se concede una evidencia lúdica tras cada cinco actividades y dos al entregar un proyecto completo.
- El requisito mínimo de evidencias para avanzar se calcula con `STAGE_GATE()` y no supera cuatro.
- Un avance exige UPE de la etapa, evidencias y competencia >= 50, y descuenta los umbrales.
- El nombre del proyecto cambia según la nueva etapa; la especie visual se conserva.

### PA y tiempo offline

La regeneración usa `stage.apPerHour * horas` y añade el residuo `apRegenRemainder`. El motor suma únicamente la parte entera, conserva el decimal para el próximo proceso y no supera `stage.maxAP`. Cuando se alcanza el máximo, desecha la fracción sobrante. El procesamiento limita el tiempo elegible a **8 horas** por intervalo, y verifica el marcador temporal anterior para impedir reprocesarlo. La producción del asistente tiene costo de mantenimiento y no produce evidencias ni títulos automáticamente.

### Cuidado y eventos

Los cuidados no gastan PA, pero algunos consumen créditos; descansos repetidos respetan un breve enfriamiento. Eventos escolares se usan hasta Preparatoria y eventos académicos avanzados posteriormente. Un evento pendiente bloquea nuevas actividades hasta que se resuelva; sus opciones son de elección única.

## 4. Identidad visual y evolución

`PET_KINDS` mapea cada `areaId` a especie, color y descripción. Cada archivo `public/pets/<area>.svg` contiene 14 cuadros; `spriteFrame(stageIndex)` selecciona el índice 0–13. **No** se necesita una especie distinta para cada edad, sino un cuadro distinto dentro de la especie escogida.

Si se agrega o cambia un área, revisar en conjunto `AREAS`, `PET_KINDS`, archivos SVG, prueba de sprites, `public/sw.js` y guardados anteriores. `pet.changeArea` es cosmético: no debe cambiar PA, UPE, etapa, proyecto o créditos.

## 5. Interfaz y seguridad básica

Los botones de `src/ui/app.ts` usan `data-action` y un listener delegado. `execute()` envía comandos y muestra el mensaje desde el resultado confirmado. La función `esc()` protege texto interpolado en HTML; no interpolar texto importado sin escapar. La importación requiere archivo JSON de hasta 2 MB, validación de esquema y confirmación del usuario antes de sobrescribir la partida activa.

## 6. PWA, compilación y límites de pruebas

- `npm run typecheck`: comprueba TypeScript.
- `npm test`: compila el proyecto y ejecuta las pruebas Node del motor.
- `npm run build`: genera `dist/`; Netlify publica esa carpeta.
- `public/sw.js`: cachea archivos públicos; cambiar código crítico también puede exigir actualizar el nombre de caché.
- IndexedDB es **local al navegador**, no respaldo remoto. Nunca prometer sincronización multi-dispositivo.

**Pruebas pendientes / no cubiertas por las 19 pruebas Node:** flujos completos de IndexedDB en navegador, múltiples pestañas reales, instalación PWA móvil, accesibilidad WCAG, todos los límites de `validateSave`, pruebas visuales de sprites, publicación real en Netlify y balance estadístico de 14 etapas.

## 7. Guía de revisión ante cambios

| Cambio propuesto | Archivos a revisar | Pruebas imprescindibles |
| --- | --- | --- |
| Nueva actividad o ajuste de puntuación | `stage-activities.ts`, `engine-game.ts`, `catalog.ts` | Exclusividad por etapa, coste PA, UPE y créditos |
| Nuevo campo de partida | `state.ts`, `persistence.ts`, `engine-game.ts` | Importación, validación y migración |
| Otro tipo de especie | `pet-visuals.ts`, `catalog.ts`, `public/pets` | Cuadros SVG, conservación de área y caché |
| Cambio de recuperación PA | `engine-game.ts`, `state.ts` | Fracciones, máximo, 8 h e idempotencia |
| Cambios de botones o formulario | `ui/app.ts` | Accesibilidad, escape HTML y comandos correctos |
| Cambio en caché PWA | `public/sw.js` y `scripts/build.mjs` | Offline después del primer acceso, actualización segura |

## 8. Principio para futuros colaboradores

**Un comentario correcto es tan importante como el comportamiento descrito.** El código puede cambiar; el comentario que deja de ser verdad debe corregirse en el mismo commit. Los documentos históricos (`docs/08_ESTADO_MVP_V2.md`, por ejemplo) describen cómo estaba el proyecto en una fecha y no sustituyen esta guía del estado actual.
