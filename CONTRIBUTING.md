# Cómo colaborar en Mascota-SNII

Este documento es la convención de mantenimiento para personas y asistentes de programación (Codex, Work u otros). Se aplica **también a cambios generados con IA**. Idioma preferido para explicaciones, comentarios y documentación: **español**. Identificadores técnicos, nombres de API y palabras clave conservan su formato en inglés si mejora interoperabilidad.

## 1. Antes de modificar una función

1. Lee [`README.md`](README.md), [`docs/11_GUIA_DE_CODIGO.md`](docs/11_GUIA_DE_CODIGO.md) y el archivo afectado.
2. Determina si el cambio pertenece a **contenido** (`src/data`), **reglas puras** (`src/core/engine-game.ts`), **persistencia** (`src/core/persistence.ts`) o **presentación** (`src/ui`).
3. Identifica qué invariantes deben permanecer verdaderas: no duplicar premios, no saltar etapas, no permitir actividades de edades indebidas, no perder partidas.
4. Añade o actualiza pruebas cuando el comportamiento cambie. Para cambios *solo de comentarios*, verifica que el código siga compilando y las pruebas existentes continúen pasando.
5. Actualiza README y documentación técnica si cambian el contrato, el balance, el almacenamiento o los requisitos para ejecutar el proyecto.

## 2. Comentarios útiles, no ruido

- Escribe **qué hace** el módulo en un encabezado `/** ... */` y cuál es su límite de responsabilidad.
- Documenta **por qué** existe una restricción, fórmula, precondición o decisión de diseño.
- Agrega JSDoc/TSDoc a funciones públicas y funciones importantes con `@param`, `@returns` y `@throws` cuando corresponda.
- Usa comentarios breves sobre bloques delicados: idempotencia, revisiones, fechas, recuperación de PA, migraciones, sanitización y balance.
- Evita comentarios obvios como `// sumar uno` junto a `i++`; pueden ocultar decisiones importantes.
- No inventes soporte normativo: distingue explícitamente **reglas de juego**, **datos provisionales** y **criterios oficiales verificados**.
- No desactives código mediante comentarios para «arreglarlo». El comentario debe estar aislado del comportamiento ejecutable.
- Corrige cualquier comentario obsoleto junto al cambio de implementación: los comentarios desactualizados son deuda técnica.

**Ejemplo recomendado:**

```ts
/**
 * Calcula el costo en PA aplicando el multiplicador lúdico de la etapa.
 *
 * @param paBase Costo diseñado para la actividad antes del multiplicador.
 * @param factor Etapa actual; no procede de la normativa SNII.
 * @returns Costo entero, de al menos un punto.
 */
function costoDeActividad(paBase: number, factor: number): number {
  // El redondeo hacia arriba impide actividades productivas sin costo de PA.
  return Math.max(1, Math.ceil(paBase * factor));
}
```

Este fragmento es **un ejemplo de documentación**, no una función adicional del motor.

## 3. Separación de responsabilidades

| Archivo / módulo | Se permite | Evitar |
| --- | --- | --- |
| `src/data/*` | Catálogos, valores de balance, etiquetas, descripciones de actividades y metadatos visuales | Acceso al DOM/IndexedDB o cálculos que muten el guardado |
| `src/core/engine-game.ts` | Decidir consecuencias de comandos desde un snapshot clonado | Guardar directamente, crear notificaciones UI o llamar a la red |
| `src/core/persistence.ts` | Validar, serializar y confirmar operaciones atómicas | Inventar recompensas, saltar revisiones o modificar reglas de progresión |
| `src/core/game-coordinator.ts` | Crear comandos, coordinar escrituras y volver a leer guardados | Mutar directamente el estado de juego |
| `src/ui/app.ts` | Renderizar, escapar texto, recoger interacción, mostrar resultados | Otorgar PA/CR/UPE o aplicar reglas de etapa por sí solo |
| `public/sw.js` | Recursos estáticos de PWA y lectura offline | Guardar partidas, información privada o secretos |
| `tests/*` | Verificar invariantes y regresiones reproducibles | Hacer depender pruebas de una cuenta externa |

## 4. Reglas que requieren especial cuidado

- **Actividades:** son seis por etapa en el MVP; Kínder/Primaria nunca deben impartir tutorías a terceros ni participar en publicaciones académicas. Usa la propiedad `performer:'mascota'` y la descripción contextual para aclarar el rol del jugador.
- **Balance:** `target`, costes, multiplicadores, evidencias y UPE son **parámetros de juego**. Registrar motivos de cambios y aumentar `balanceVersion` si se modifica su interpretación.
- **Especies:** IDs de `AREAS`, `PET_KINDS`, sprites SVG y guardados están vinculados. No renombrarlos sin estrategia de compatibilidad.
- **Tiempo:** `apRegenRemainder` conserva fracciones de recuperación; `time.processOffline` tiene tope de ocho horas por procesamiento.
- **Persistencia:** nunca separar las dos escrituras de `commitCommand()` en transacciones independientes. Una solicitud repetida debe devolver `replayed` sin volver a recompensar.
- **Seguridad:** cualquier texto interpolado en HTML debe pasar por `esc()`; archivos importados se validan antes de reemplazar el guardado.
- **Versionado:** una evolución incompatible del esquema necesita migración explícita. No subir `schemaVersion` sin prueba de migración.

## 5. Verificación mínima

```bash
npm install
npm run typecheck
npm test
npm run dev
```

`npm test` compila y ejecuta pruebas del motor. **No sustituye** pruebas de interfaz, IndexedDB, instalación PWA ni verificación del despliegue real en Netlify. Señala claramente cuáles de estas comprobaciones sí se ejecutaron.

## 6. Describir cada cambio

En pull requests o commits, registra: *problema*, *solución*, *impacto en partidas existentes*, *pruebas ejecutadas* y *pendientes*. Prefiere mensajes como `docs: documenta invariantes e idempotencia del motor` o `feat: actividades propias para etapa secundaria`.

**Licencia:** el código permanece sin licencia abierta definida hasta que la persona propietaria del proyecto elija una. No añadir licencias ni dependencias de pago sin autorización.
