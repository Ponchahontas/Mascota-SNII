# Avatares, escenas, animación y accesibilidad

## Identidad visual

Siete especies originales asociadas a áreas de conocimiento. Cada especie se representa mediante un SVG en `public/pets/` con catorce cuadros de evolución. El área define la especie y la etapa define el cuadro mostrado; ninguna especie debe otorgar ventaja económica por ser de un área determinada.

Archivos principales: `src/data/pet-visuals.ts`, `scripts/generate-pets.py`, `src/ui/app.ts`.

## Ambientes educativos

`src/data/scene-world.ts` define el paisaje de las catorce etapas y seis estaciones. El movimiento del avatar hacia una estación es una **animación de interfaz**, no desplazamiento físico con colisiones o pathfinding. El panel y el escenario deben reflejar la misma actividad seleccionada.

## Emociones y reacciones

`src/ui/pet-animation.ts` mapea necesidades a estados visuales como alegría, agotamiento, distracción o saturación. Las celebraciones y reacciones tras acciones son efímeras, no modifican la partida. `src/styles.css` define los movimientos; revisar texto alternativo y señales no basadas solo en colores.

## Accesibilidad obligatoria

- Respetar `prefers-reduced-motion` y la opción de pausar animaciones.
- Poder elegir estación, responder, revisar y cerrar el reto solo con teclado.
- Mantener foco visible y mensajes claros para lectores de pantalla.
- Evitar parpadeos intensos, movimiento obligatorio y cambios de estado exclusivamente cromáticos.
- Verificar pantallas pequeñas y tamaños de fuente aumentados.

**Pendiente:** revisión visual y de usabilidad en navegadores y móviles reales. Un build exitoso no certifica accesibilidad.

Volver al [índice](../README.md).
