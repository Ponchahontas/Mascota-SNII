# Sistema de animaciones reactivas — v0.6

## Propósito

La interfaz debe expresar el estado académico de la mascota **con movimiento, icono y texto**. El jugador distingue entre cansancio, estrés, desánimo, distracción, bienestar bajo y estado saludable, sin tener que consultar todos los números. Los gráficos son **cosméticos**: no alteran progresión, recursos ni el reglamento ficticio.

## Arquitectura

- `src/core/engine-health.ts`: fuente de verdad de umbrales de advertencia y estados críticos. No duplicar fórmulas en CSS.
- `src/ui/pet-animation.ts`: función pura `moodForNeeds`, que traduce las alertas a estado, expresión y lista de señales; `reactionForCommand` determina una reacción tras una operación confirmada.
- `src/ui/app.ts`: dibuja la especie de la partida, la evolución actual, un emoticono, una descripción y todas las señales en riesgo. Mantiene la reacción temporal **solo en memoria**, aproximadamente dos segundos, retirándola sin repintar el panel.
- `src/styles.css`: fotogramas CSS con rotación/traslación/escala/opacidad. No modifica `background-position` de los sprites; esa propiedad selecciona una de 14 evoluciones.
- `public/sw.js`: `shell-v6` incluye `src/ui/pet-animation.js` para conservar funcionalidad sin conexión.

## Estados representados

| Necesidad | Precaución | Crítica | Forma de expresarlo |
| --- | --- | --- | --- |
| Energía | Con sueño | Agotado | Cabeceo, inclinación, 💤 |
| Estrés | Bajo presión | Saturado | Temblor suave / rápido, 💢 |
| Motivación | Desanimado | Desanimado | Postura caída, 💔 |
| Concentración | Distraído | Distraído | Balanceo lateral, ❔ |
| Bienestar | Decaído | Decaído | Movimiento lento, 🌧️ |
| Estado favorable | Contento | — | Saltitos, ✨ |
| Estado estable intermedio | Atento | — | Respiración pausada, 👀 |

**Concurrencia de señales:** las alertas críticas tienen prioridad en el sprite; el resto se muestra como etiquetas separadas. Una sola postura nunca oculta que existen dos o más problemas.

## Reacciones temporales

- Cuidado confirmado: alivio 💚.
- Actividad académica completada: aprendizaje 📚.
- Entrega de proyecto o resolución de evento: celebración 🎉.
- Avance educativo o nueva generación: evolución 🌟.

No se activan al pulsar un botón, sino **después de la confirmación del guardado**. Rechazos y errores no dan premios visuales positivos. El ciclo dura cerca de 2,1 segundos, sin tocar el almacenamiento.

## Accesibilidad y pruebas

1. No confiar solo en movimiento/color: símbolo y texto accesible siempre presentes.
2. La preferencia del sistema `prefers-reduced-motion: reduce` suprime animaciones.
3. El botón **Pausar movimiento** permite desactivar animaciones manualmente; solo almacena esta preferencia en `localStorage`, separada de la partida.
4. Los cambios de especie o etapa usan los mismos siete sprites SVG originales de 14 cuadros.
5. Probar `npm run typecheck` y `npm test`. El archivo `tests/pet-animation.test.mjs` cubre estados, señales múltiples, pureza y distintas especies.
6. Pruebas visuales restantes: comportamiento real en Safari móvil y PWA instalada, contrastes de pantalla, y sesiones con energía/estrés críticos prolongados.

## Para futuras colaboraciones

Modificar primero las reglas en `engine-health.ts` si cambia la dificultad; luego actualizar `pet-animation.ts`, CSS, documentación y pruebas. **No** introducir alteraciones de PA/UPE desde el módulo de animaciones. Si se incorporan sprites por expresión, conservar la compatibilidad con partidas antiguas y respetar la preferencia de movimiento reducido.
