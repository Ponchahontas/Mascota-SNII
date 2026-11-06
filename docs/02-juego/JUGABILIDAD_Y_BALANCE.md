# Jugabilidad y balance (MVP v0.10.0)

El usuario acompaña a una mascota ficticia por 14 etapas. En cada etapa puede visitar seis estaciones educativas (cinco preguntas por actividad), cumplir una misión de campo propia de su área, realizar prácticas con PA y cuidados sin PA, completar proyectos y solicitar avance cuando el motor valide los requisitos del juego.

**PA** se recupera a una tasa por etapa, con fracciones acumuladas y límites; **CR** es dinero ficticio; **UPE** es progreso lúdico, no un criterio SNII; evidencia, proyectos y logros son también ficticios. El motor es `src/core/engine-game.ts`, y la tabla de tasas está en `src/data/catalog.ts`.

## Cuidado y dificultad

Energía, motivación, concentración y bienestar bajos reducen rendimiento. Estrés alto también perjudica. Crisis combinadas mantenidas durante tiempo simulado pueden terminar la generación en Equilibrado o Exigente; Tranquilo no impone deserción definitiva. Las simulaciones de ausencia se limitan a ocho horas por procesamiento. La actividad «Acompañar» permite recuperar un poco de motivación sin pagar créditos.

## Premio de misión de campo

Cada una de las nueve áreas tiene un reto temático por etapa. Resolverlo por primera vez concede un bono modesto y `fieldMilestones` registra la etapa; la misma etapa no se puede recompensar otra vez cambiando de especie. No consume PA ni añade evidencia administrativa.

## Validez

Las reglas de balance aún necesitan pruebas longitudinales; las referencias al SNII son contexto narrativo y no equivalen a parámetros de evaluación oficiales. Para las nueve áreas ver [Áreas y rutas](AREAS_Y_RUTAS.md).
