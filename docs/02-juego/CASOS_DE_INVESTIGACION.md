# Casos aplicados de investigación · v0.12.0

## Objetivo

Evitar preguntas genéricas en la trayectoria avanzada y practicar decisiones basadas en evidencia y ética. A partir de Universidad, las **nueve áreas** presentan **diez casos escritos para su campo**: Universidad, Especialidad, Maestría, Doctorado, Posdoctorado, Candidato, Niveles I–III y Emérito. Son **90 casos** con una decisión preferible, dos opciones que resultan plausibles pero no responden adecuadamente al problema, una pista y la explicación del razonamiento.

Las 36 misiones escolares conservan contenidos exploratorios y la mecánica anterior. Las 84 aventuras de cinco preguntas continúan intactas: la misión de campo es una actividad **adicional** en Carrera.

## Dónde editar

- `src/data/research-cases.ts` — texto de los 90 casos (10 registros ordenados por área; primera posición = Universidad).
- `src/data/area-routes.ts` — conecta el caso al área y etapa; muestra título, escenario, opciones y explicación; no almacena nuevas claves.
- `src/ui/app.ts` — panel Carrera, explicación tras completar el caso y pistas en respuestas erradas.
- `src/core/engine-game.ts` — valida respuesta y concede UPE una sola vez; **no modificar si solo se corrigen textos**.
- `tests/research-cases.test.mjs` — valida las combinaciones y que el motor conserve premios/guardados.

## Reglas editoriales

1. Cada caso requiere un conflicto realista, una pregunta que exija razonar y tres opciones de extensión semejante.
2. La solución no debe ser una frase moral vacía; debe responder al escenario y justificar un método.
3. Las dos alternativas deben ser comprensibles y plausibles, pero presentar límites concretos (sesgos, falta de controles, mala atribución, riesgos o permisos).
4. Las pistas ayudan a razonar **sin repetir la respuesta**. La explicación debe agregar información que el usuario pueda recordar.
5. Reconocer incertidumbre, consentimiento, privacidad y límites de generalización cuando corresponda.
6. Evitar declarar requisitos, puntajes, acreditaciones o procesos del SNII como oficiales. El juego es ficción educativa.
7. Cambiar la redacción es compatible con partidas anteriores porque el guardado registra la misión por etapa y no el texto de la respuesta.

## Validación pendiente

Las pruebas automáticas verifican cobertura y consistencia, **no** son una evaluación docente de rigor disciplinar. Antes de una presentación educativa formal, cada área requiere revisión por especialista y pruebas de comprensión y disfrute con jugadores reales. Comprobar también lector de pantalla, dispositivos móviles, modo offline y versiones antiguas de IndexedDB.