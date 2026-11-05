# Hoja de ruta y prioridades

Priorización propuesta tras v0.9. No son promesas ni tareas ya terminadas.

| Orden | Trabajo | Criterio de aceptación |
| --- | --- | --- |
| P0 | Verificación manual de estaciones, preguntas y sprites | Las seis estaciones de cada etapa abren su actividad y mantienen el progreso al recargar |
| P0 | Accesibilidad y móviles | Teclado, foco, lector de pantalla, movimiento reducido y 320–375 px utilizables |
| P0 | Respaldos, migraciones y offline | Import/export sin duplicación ni corrupción; sesiones fuera de línea verificadas |
| P1 | Revisión educativa | Validación de 420 preguntas por especialistas y corrección de ambigüedades |
| P1 | Balance y dificultad | Simular distintas frecuencias de uso, evitar bloqueos sin salida, revisar deserción |
| P1 | Minijuegos manipulativos | Primero prototipos de Kínder (bloques, colores, semillas) con alternativa accesible |
| P1 | Publicación | Construir desde GitHub y comprobar URL pública, actualización de SW y versiones |
| P2 | Normativa oficial | Documentar fuentes primarias, vigencia y distinción respecto de la sátira |
| P2 | Extensión visual | Fondos y animaciones de acciones específicas por área y etapa |

## Política de iteración

1. Una funcionalidad entra con documentación, comentarios, pruebas y notas de cambio.
2. Mantener identidad de actividad por `activity.id` y posiciones de los cinco pasos sin romper partidas.
3. Priorizar usabilidad y aprendizaje antes que añadir más preguntas repetitivas.
4. Actualizar [Estado actual](ESTADO_ACTUAL.md), [Pruebas](../04-calidad/PRUEBAS_Y_ACEPTACION.md) y [CHANGELOG](../../CHANGELOG.md) cuando se cumplan criterios.

Histórico de decisiones: [archivo](../historico/README.md).
