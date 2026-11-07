# Contribuir a Academic Pet (repositorio Mascota-SNII)

## Antes de cambiar código

Leer [README](README.md), [índice](docs/README.md), [arquitectura](docs/03-tecnica/ARQUITECTURA.md), [rutas](docs/02-juego/AREAS_Y_RUTAS.md) y revisar el código actual. Las especificaciones en `docs/historico/` **no** son fuente del comportamiento vigente.

## Identidad, nombres y partidas antiguas

- Usar **Academic Pet** como nombre visible, y «Una aventura de aprendizaje» como subtítulo; mantener buena ortografía española.
- `Mascota-SNII` es el nombre técnico del repositorio, no el nombre comercial visible.
- Las cadenas históricas conservadas en `src/core/persistence.ts` y el prefijo de limpieza de caché en `public/sw.js` son **identificadores técnicos para compatibilidad**. No volver a usarlas en textos visibles.
- No renombrar la IndexedDB o el `id` de la PWA sin migraciones y pruebas de restauración.
- Ver [Identidad y compatibilidad](docs/01-proyecto/IDENTIDAD_Y_COMPATIBILIDAD.md).

## Documentación y comentarios

- Escribir en **español** los comentarios y la explicación de las reglas. Conservar nombres técnicos en su forma original.
- Usar **JSDoc/TSDoc** en funciones o contratos públicos: propósito, parámetros, devoluciones, efectos y límites cuando sea relevante.
- Explicar especialmente el **porqué** de validaciones, fórmulas, compatibilidad, idempotencia, accesibilidad y decisiones educativas. No comentar cada variable trivial.
- Al tocar una regla, actualizar comentario, prueba y documento **en el mismo cambio**. No escribir comentarios que contradigan lo que el código hace.
- Los datos de economía son invenciones; documentar aparte el nombre oficial de las áreas y su fuente.
- Documentar las rutas y claves persistentes: `areaId`, `branch.id`, `fieldMilestones`, `activity.id`, índices de preguntas `0..4`.

## Invariantes que no deben romperse

1. La UI nunca adjudica UPE, CR o PA por su cuenta; lo valida el motor y se confirma en IndexedDB.
2. Una misma orden persistida o una misión de campo ya premiada no debe duplicar recompensas.
3. Los siete IDs de área anteriores permanecen intactos. Las nueve áreas deben tener registro en `AREAS`, `PET_KINDS`, `AREA_ROUTES`, sprite, PWA y tests.
4. Elegir una rama es posible desde Universidad. Cambiar área invalida rama incompatible, sin borrar méritos.
5. Las etapas y los cinco pasos de las aventuras se guardan por ID/índice; modificar claves exige migración explícita.
6. Respetar movimiento reducido y contar siempre con texto de apoyo además del color/animación.

## Verificar

```bash
npm install
npm run typecheck
npm test
npm run build
```

Para cambios de UI son obligatorias comprobaciones manuales de móvil, escritorio, teclado, pantalla pequeña y PWA; si no se hicieron, **dejarlo registrado como pendiente**. En el PR describir el motivo, archivos, casos comprobados, compatibilidad y riesgos.

**Licencia:** no hay LICENSE publicado. No reutilizar recursos externos sin confirmar sus derechos.

## Calidad de textos al contribuir

Los títulos, explicaciones, escenas y preguntas se muestran juntos en la UI: evitar copiar el mismo párrafo en campos diferentes. Verificar los enunciados de las nueve áreas a lo largo de las catorce etapas y ejecutar `tests/text-quality.test.mjs`. La rotación de opciones es determinista; no cambiar IDs ni índices de pasos sin revisar la persistencia. Consultar [guía editorial](docs/02-juego/CALIDAD_DE_TEXTOS.md).
