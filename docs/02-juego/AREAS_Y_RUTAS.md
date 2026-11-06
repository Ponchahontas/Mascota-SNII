# Nueve áreas, especies y rutas educativas — MVP v0.10.0

## Fuente y alcance

Las denominaciones de las **nueve áreas** provienen del anexo técnico de los **Lineamientos SNII del DOF del 6 de febrero de 2026**: https://www.dof.gob.mx/nota_detalle.php?codigo=5779537&fecha=06/02/2026

Las historias y ramas de las mascotas **no equivalen a los criterios, actividades reconocidas o resultados de la evaluación oficial**. El modelo de juego usa un solo sistema de UPE, PA y evidencias ficticias. Ver [Advertencias normativas](../06-normativa/FUENTES_Y_ADVERTENCIAS.md).

## Contrato de identidad

- Fuente única de áreas: `AREAS` en `src/data/catalog.ts`, nueve IDs.
- Identidad gráfica y nombre de mascota: `PET_KINDS` y `petSprite()` en `src/data/pet-visuals.ts`.
- Sprites: `public/pets/{id}.svg`, cada uno mide **448×32** y contiene 14 cuadros de **32×32 píxeles** (etapas 0–13).
- Temas por etapa, personajes mentores y ramas: `AREA_ROUTES` en `src/data/area-routes.ts`.
- `areaId` es persistente. **No cambiar claves anteriores** `fisico`, `biologia`, `medicina`, `humanidades`, `sociales`, `agro`, `ingenieria`. Los IDs nuevos son `conducta` e `interdisciplinaria`.
- La función `petArea` usa biología como fallback gráfico para un valor desconocido, pero la validación de partidas rechaza áreas que no están en el catálogo.

## Flujo de una ruta

1. Al crear partida se elige una de las **nueve áreas**, que determina mascota y narrativa.
2. De **Kínder a Preparatoria**, cada etapa tiene un tema de campo de esa área y una pregunta contextual sin gasto de PA.
3. Desde **Universidad** (etapa índice 4), se elige **una de dos especializaciones**. No puede elegirse una rama de otra área.
4. Hay una misión temática por etapa y área (`fieldChallenge`). La respuesta equivocada ofrece otra oportunidad sin costo.
5. La primera respuesta correcta de la etapa registra su índice en `fieldMilestones` y concede un **bono único de UPE** y motivación.
6. En **Emérito**, completar el reto con una especialización concede un logro y un cierre de relato propio de esa combinación: **9 × 2 = 18 variantes**.

El desafío de campo es **adicional** a las seis aventuras base de cada nivel, cada una con cinco preguntas. No se debe describir la ruta de campo como si fuera otra colección de 420 × 9 preguntas. Los temas cambian por área; los procedimientos didácticos de los retos de campo comparten una plantilla de habilidad por etapa.

## Compatibilidad y protección del progreso

- La partida sigue usando `schemaVersion: 2` y la base IndexedDB original.
- Nuevos campos opcionales: `areaPath` (rama seleccionada) y `fieldMilestones` (etapas ya premiadas).
- Cambiar de área conserva etapa, UPE, PA, créditos y premios ganados; **invalida una rama incompatible**.
- `fieldMilestones` se conserva al cambiar de área: una etapa premiada no se puede cobrar otra vez con otra mascota.
- Los reintentos de comandos se deduplican en la capa de persistencia. La UI nunca suma premios por su cuenta.
- Los IDs de ramas (`branch.id`) son persistentes: si se cambian hay que migrar guardados y actualizar pruebas.

## Puntos de extensión

- **Agregar o revisar un área:** actualizar `AREAS`, `PET_KINDS`, `KINDS` del generador, el SVG, `AREA_ROUTES`, el precaché del service worker y pruebas.
- **Ampliar una rama:** modificar su objetivo y desenlace con criterios educativos y no oficialistas; no alterar silenciosamente su ID.
- **Mejorar actividades por área:** hoy el catálogo de seis actividades y cinco preguntas es por etapa (compartido). Para personalizarlo, planificar IDs estables y migración de `learningProgress`.

## Verificación

`npm run typecheck && npm test && npm run build`. La prueba `tests/area-routes.test.mjs` verifica nueve áreas, 126 misiones, compatibilidad con partidas anteriores, ramas y 18 cierres narrativos. Validar además las imágenes, teclado y cambios de área en un navegador real.
