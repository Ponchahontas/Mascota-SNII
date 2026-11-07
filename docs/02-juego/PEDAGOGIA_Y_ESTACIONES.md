# Pedagogía, aventuras y rutas por área

## Dos experiencias educativas complementarias

**Aventuras de etapa:** 14 etapas × seis estaciones = **84 actividades**; cada una tiene cinco preguntas y progreso persistido. Se identifican por `activity.id`, no por el título ni la posición del botón. Consultar `stage-activities.ts`, `learning-sequences.ts`, `scene-world.ts`.

**Misión de campo por área:** nueve recorridos × 14 etapas = **126 retos contextuales**. Cada reto utiliza una plantilla de habilidad apropiada a la etapa y un tema único del área. **No son 126 minijuegos visuales diferentes**. Consultar `area-routes.ts`.

## Acompañamiento educativo

El jugador elige actividades y brinda cuidados; la mascota realiza las tareas. Kínder emplea juego/observación, niveles escolares usan actividades apropiadas; de Universidad a Emérito hay especializaciones y desenlaces ficticios.

Los aciertos de aventuras no consumen PA y las respuestas incorrectas permiten reintentar. Las misiones de campo también permiten corregir errores sin PA; solo el acierto inicial concede bono de campo por etapa. Las recompensas de la actividad se confirman por un comando separado.

## Puntos de revisión

- Validar con docentes la adecuación del lenguaje y los distractores.
- Hacer más interactivas las preguntas (bloques, clasificación, secuencias, experimentos).
- Mantener pistas y explicaciones honestas, sin afirmar que los puntos de juego representan méritos de la evaluación oficial.
- Comprobar que la elección de área no mezcle preguntas ni recompensas entre estaciones.

Ver [Áreas y rutas](AREAS_Y_RUTAS.md) y [Estado](../01-proyecto/ESTADO_ACTUAL.md).

## Textos y variedad narrativa (v0.11.1)

Ver [calidad de los textos](CALIDAD_DE_TEXTOS.md): se eliminaron introducciones duplicadas, se redactaron catorce guiones de etapa y se variaron preguntas y posición correcta en las aventuras avanzadas. Se conservan los IDs y el progreso guardado.
