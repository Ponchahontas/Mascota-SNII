# Guía pedagógica interactiva · Mascota-SNII v0.7

## 1. La experiencia buscada

La persona jugadora **acompaña**, no realiza las actividades por la mascota. La mascota habla en primera persona, propone una situación, recibe ayuda en forma de elección y retroalimentación, y después *realiza* la actividad.

La anterior descripción administrativa (“La mascota realiza estas actividades con acompañamiento escolar...”) se reemplazó por un pequeño capítulo narrativo y una misión. El objetivo no es solo aumentar UPE, sino comprender una idea apropiada al nivel de desarrollo.

**Ejemplo en Kínder**: “Mi torre se cae. ¿Qué hago?” → tres opciones → si la respuesta es incorrecta, una pista sin castigo → si es correcta, breve explicación de equilibrio → la mascota puede practicar con bloques (gasta recursos y gana UPE solo al confirmar).

## 2. Contratos y archivos

- `src/data/learning-path.ts`: 14 historias educativas (`LEARNING_STAGES`) y 84 escenarios de pregunta-respuesta (`LEARNING_CHALLENGES`).
- `src/ui/app.ts`: capítulo, reto guiado y acciones. Estado efímero `guidedActivityId` + `guidedAnswer`, no forma parte del guardado.
- `src/styles.css`: tarjetas, burbujas, respuestas, mensajes y móvil; texto accesible sin depender solo de color.
- `src/core/engine-game.ts`: **sin cambios de balance**. Única fuente de progreso, UPE, PA, créditos y consecuencias.
- `public/sw.js`: nuevo módulo precargado para jugar sin conexión después de la primera visita.
- `tests/learning-path.test.mjs`: cobertura de contenido, edad, unicidad y ausencia de efectos económicos.

## 3. Secuencia de una misión

1. La mascota cuenta una situación diferente para cada una de las **84 actividades**.
2. La persona elige A/B/C. Una respuesta errónea recibe pista y puede volver a intentar sin coste.
3. Al acertar se explica el *porqué*. No se premia memorizar respuestas con recursos gratuitos.
4. Con “Vamos a practicar” se ejecuta `activity.execute` normalmente; el motor comprueba PA, CR, etapa, salud y eventos.
5. Si no tiene recursos, puede cerrar el reto y atender a la mascota. El aprendizaje exploratorio nunca queda bloqueado por falta de PA.
6. “Repetir” es una ruta rápida opcional para que la repetición del clicker no obligue a contestar la misma pregunta cada vez.

## 4. Objetivos por etapa (resumen)

| Etapa | Enfoque principal |
| --- | --- |
| Kínder | Juego, formas, narración, turnos, curiosidad y observación |
| Primaria | Lectura, cálculo, registro y representación del entorno |
| Secundaria | Argumentación, fuentes, experimentos escolares y reporte |
| Preparatoria técnica | Seguridad, prototipos, bitácora y demostración |
| Universidad | Fuentes, prácticas, proyectos y comunicación académica |
| Especialidad | Casos simulados, supervisión y límites profesionales |
| Maestría | Pregunta de tesis, métodos y análisis de evidencia |
| Doctorado | Originalidad, controles, reproducibilidad y defensa |
| Posdoctorado | Autonomía, colaboración y ciencia abierta responsable |
| Candidato SNII ficticio | Evidencias verificables y divulgación responsable |
| Nivel I ficticio | Mentoría, evaluación y vínculo comunitario |
| Nivel II ficticio | Redes, formación y evaluación contextual |
| Nivel III ficticio | Consorcios, integridad y gobernanza del conocimiento |
| Emérito ficticio | Memoria, mentoría y continuidad generacional |

## 5. Guía para autoría y revisión

- Escribir en **español claro**, sin infantilizar a adolescentes ni atribuirles tareas de posgrado.
- Una pregunta = un aprendizaje identificable; distractores razonables, no bromas humillantes.
- Tras una respuesta correcta explicar **por qué**. Tras un error, dar una **pista**, no castigar.
- Mantener las opciones accesibles por teclado, contraste suficiente, texto alternativo y avisos perceptibles.
- Evitar afirmaciones médicas, profesionales o legales sin advertir las limitaciones de una simulación.
- Evitar presentar los requisitos reales de SNII: el contenido es una **metáfora lúdica**. Cuando se incorporen referencias oficiales, registrar fuente primaria, fecha y vigencia separada del sistema de juego.
- Evitar incentivar jugar sin descansos o penalizar la curiosidad: cuidar a la mascota sigue siendo parte del aprendizaje.
- Al añadir una nueva actividad, incorporar su pregunta en `learning-path.ts`, actualizar el total esperado y ejecutar `npm run typecheck && npm test`.

## 6. Límites y próximos pasos

- Los retos actuales son elecciones de tres opciones con explicaciones escritas. **Todavía no son** minijuegos gráficos animados, problemas de respuesta abierta ni un sistema de evaluación educativa validado.
- No se registra cuál pregunta se respondió ni se genera historial de desempeño educativo. Se evita hacerlo sin decidir primero privacidad, opciones de borrado y migración de schema.
- Faltan pruebas visuales y de accesibilidad en múltiples dispositivos y una revisión pedagógica con docentes de niveles educativos correspondientes.
- Se propone evolucionar hacia actividades manipulativas (arrastrar bloques, ordenar secuencias, juegos de observación), sin exigir datos personales.
