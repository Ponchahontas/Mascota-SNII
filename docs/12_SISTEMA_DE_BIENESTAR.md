# Diseño y balance provisional: bienestar académico v0.5

> **Advertencia:** Es una representación lúdica, NO un diagnóstico médico, regla escolar ni normativa del Sistema Nacional de Investigadoras e Investigadores. La deserción del juego no presupone ni describe la experiencia de las personas reales.

## Objetivo

Las cinco barras vitales deben producir decisiones comprensibles: cuidar, planificar actividades, arriesgar recursos o posponer tareas. Los indicadores se deterioran de modo gradual con el tiempo, se ven afectados por actividades y se recuperan mediante **acciones de cuidado que no consumen puntos de acción (PA)**. La mascota no necesita estar en el juego constantemente y una única ausencia larga no debe liquidar inmediatamente la partida.

## Medidores y consecuencias

| Medidor | Precaución | Crítico | Bloqueo si extremo | Cuidados sugeridos |
| --- | --- | --- | --- | --- |
| Energía | ≤35 | ≤15 | ≤5: agotamiento para estudiar | Dormir (+25), descansar (+8) |
| Motivación | ≤35 | ≤15 | ≤5: desmotivación impide trabajar | Socializar (+6), recreación (+2) |
| Concentración | ≤35 | ≤15 | ≤5: bloqueo de atención | Dormir (+10), descansar (+3) |
| Bienestar | ≤35 | ≤15 | ≤5: malestar impide trabajar | Recreación (+6), socializar (+4) |
| Estrés (escala inversa) | ≥70 | ≥90 | ≥95: saturación impide trabajar | Dormir (−10), recreación (−6) |

El rendimiento por actividad se multiplica por factores según los medidores. Precaución suele aplicar 0.75–0.8 al rendimiento de cada indicador, crítico 0.48–0.55. Varias condiciones suman penalizaciones **multiplicativamente**, con un límite inferior de 12 % para evitar cálculos negativos; la penalización se suma al rendimiento general previo del motor. Cuando el bienestar cae a 25 o menos, **el coste de PA por tarea aumenta 20 %** (redondeo hacia arriba). Los costes mostrados en interfaz son los del motor.

## Desgaste temporal y efectos cruzados

Los valores son tasas **base** por hora, antes del multiplicador de etapa y dificultad:

| Variable | Tasa base |
| --- | ---: |
| Energía | −4/h |
| Motivación | −2/h |
| Concentración | −3/h |
| Bienestar | −1.7/h |
| Estrés | +3.4/h |

Se multiplican por `0.65 + etapa * 0.045`, desde Kínder (0.65) hasta Emérito (1.235), y por la dificultad: Tranquilo 0.65, Equilibrado 1, Exigente 1.3. Efectos combinados durante el tiempo: energía ≤25 sube más el estrés, estrés ≥80 disminuye adicionalmente la concentración y bienestar ≤25 disminuye motivación. Todo se limita a [0,100].

**Importante:** la aplicación procesa el tiempo al abrirla, volver a enfocarla o cada minuto mientras está visible. No se ejecuta actividad en el servidor. En una comprobación solo se calculan **hasta 8 horas de ausencia**, sin importar si el usuario se alejó días. Los cálculos se dividen en pasos de máximo 1 hora para no atribuir todo el tiempo previo a una crisis que apenas se desencadenó. PA se sigue regenerando de manera independiente.

## Riesgo de deserción

- Solo se acumulan horas críticas cuando **dos o más** medidores coinciden en estado crítico (energía/motivación/concentración/bienestar ≤15 o estrés ≥90).
- El contador aumenta con el paso de esas horas. El riesgo se reduce en 2 unidades por hora estable. Cuando un cuidado rompe una combinación crítica, disminuye **1 hora adicional**.
- Alertas graduadas: a partir de 4 h (atención) y 9 h (crisis sostenida).
- **Tranquilo:** hay penalizaciones y bloqueos de tareas, pero no final permanente.
- **Equilibrado:** la deserción se activa después de **18 horas críticas acumuladas**.
- **Exigente:** se activa después de **12 horas críticas acumuladas**.
- La deserción bloquea nuevas actividades y permite un **nuevo comienzo explícito** con récord conservado. No hay muerte, castigo humillante ni pérdida silenciosa del historial. Al iniciar otra generación se restablecen necesidades y recursos iniciales.
- El modo legado voluntario desde Candidato sigue funcionando. La deserción es un desenlace diferente y no elimina el historial previo.

## Retroalimentación en la interfaz

Cada medidor indica porcentaje, estado, consecuencia y cuidado recomendado. Una tarjeta de condición muestra advertencia, dificultad activa y horas acumuladas hacia el límite si lo hay. La escena de la mascota cambia de tono en estado de advertencia/crisis. El panel de actividades comunica si la mascota no puede trabajar por agotamiento, desmotivación o estrés; **el jugador nunca pierde acceso a los cuidados**. Al llegar al desenlace hay un panel accesible para respaldar el expediente y reiniciar.

## Compatibilidad y seguridad

El guardado usa `schemaVersion=2`. El nuevo campo `risk?` es opcional: partidas de versiones anteriores se importan sin borrarse y el campo se inicializa cuando se procesa un comando. La validación de importación rechaza riesgos corruptos. `IndexedDB` mantiene la actualización de estado y registro idempotente de un comando en la misma transacción. El `service worker` cambia a la caché `v5` para incluir el nuevo módulo. No hay funciones de red nuevas.

## Pendiente de balance

Este diseño es una **primera hipótesis de equilibrio**, no un resultado de playtesting. Hace falta simular distintas frecuencias de juego (5 min/día, 30 min/día, varias visitas), etapas, áreas y dificultades. Revisar accesibilidad con lectores de pantalla, rendimiento móvil e interacción sin conexión. Ajustar tasas, tiempos de recuperación y advertencias según pruebas con personas reales.
