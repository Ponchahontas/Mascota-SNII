# Calidad editorial de los textos · v0.11.1

## Problema observado

En Kínder, «hábitos de higiene cotidianos» aparecía junto a un párrafo sobre salud y a una «Experiencia de Kínder» que **repetía el mismo párrafo**. La duplicación se producía por la composición del escenario y afectaba a las nueve áreas y las catorce etapas, no solo a Medicina.

También había enunciados casi idénticos en los 126 retos de campo y cuatro estructuras de pregunta previsibles entre las 78 actividades posteriores a Kínder.

## Qué se corrigió

1. **Contexto sin copiarse:** la introducción de cada área se presenta una vez en Carrera. El escenario ahora informa dónde está la mascota y qué sucede en la etapa, sin repetir la introducción ni el título.
2. **Interfaz más clara:** la leyenda de la mascota muestra solo el tema actual. La explicación de cuándo elegir especialización está en una ayuda desplegable durante las etapas previas a Universidad.
3. **Catorce momentos narrativos:** los retos de campo tienen escenas, pistas, preguntas y explicaciones diferenciadas según la etapa. Cada área conserva su tema propio.
4. **Aventuras menos mecánicas:** cada actividad continúa con cinco pasos; los cuatro adicionales usan variaciones de redacción y una rotación determinista de respuestas. No se añade aleatoriedad que rompa un guardado.
5. **Regresión automatizada:** `tests/text-quality.test.mjs` revisa las 126 escenas, las 14 etapas por área, los 312 desafíos complementarios y los textos estructurales de la interfaz.

## Ejemplo: Medicina en Kínder

**Tema:** hábitos de higiene cotidianos.

**Introducción (una sola vez):** «Cuidar implica escuchar, razonar con evidencia y respetar a las personas; el juego nunca sustituye consejos de salud.»

**Escenario:** «🩺 Centro de salud y ciencia. La mesa de juegos está preparada para descubrir detalles del entorno.»

**Pregunta:** «La mascota juega a descubrir “hábitos de higiene cotidianos”. ¿Qué acción le ayudaría a aprender?»

La especialización se explica solo cuando se abre la ayuda de Carrera; deja de ocupar una línea repetitiva en cada etapa infantil.

## Compatibilidad y límites

Las nueve mascotas, las catorce etapas, las 84 aventuras (420 preguntas) y las 126 misiones de campo se conservan. **No se alteran** IDs de actividad o área, pasos 0–4, aciertos, fórmulas, recompensas ni guardados. La caché de la PWA cambia de versión para distribuir los textos nuevos.

La prueba automatizada detecta repeticiones literales y patrones claros de presentación, **no garantiza que los 420 contenidos sean pedagógicamente perfectos**. La revisión didáctica, ortográfica y de pertinencia de los distractores por docentes sigue siendo necesaria.

Para comprobar: `npm run typecheck && npm test && npm run build`. También verificar en navegador real la ficha de campo desde Kínder hasta Emérito y los cambios entre áreas.

## Continuación v0.12.0

Desde Universidad hasta Emérito, las misiones de campo utilizan 90 casos específicos por área en lugar de aplicar un mismo enunciado con otro tema. Consultar [Casos de investigación](CASOS_DE_INVESTIGACION.md). Las 84 aventuras principales de cinco pasos permanecen sin alterar y siguen pendientes de revisión pedagógica.
