# Plan de pruebas y aceptación

## Pruebas unitarias
- Costes de PA, mínimo de coste productivo y redondeo.
- Clamps de necesidades y efectos.
- Cálculo de PE y rendimientos decrecientes.
- Cálculo de automatización y límites.
- Elegibilidad de transición y competencias.
- Validación de evidencias y deduplicación.
- Validación de configuración y referencias.

## Pruebas de integración
- Actividad: PA, CR, necesidades, proyecto e historial se actualizan juntos.
- Compra: saldo e inventario cambian en una transacción.
- Evento: decisión, consecuencias e historial se guardan juntos.
- Transición: requisitos se revalidan al confirmar.
- Legado: archivar generación y empezar siguiente sin perder récords.
- Guardado: carga, exportación, importación y restauración.

## Pruebas de idempotencia
- Repetir comando confirmado devuelve el resultado original.
- Misma clave con payload diferente es rechazada.
- Fallo de persistencia no deja cambios parciales.
- Intervalo offline repetido no duplica progreso.
- Recompensa y evidencia no se duplican.

## Pruebas de tiempo
- Límite offline de 8 horas.
- Cambio de reloj hacia atrás y adelante.
- Intervalos solapados.
- Ausencia procesada dos veces.
- Tareas no elegibles no avanzan offline.
- Eventos importantes quedan pendientes de decisión.

## Pruebas PWA
- Instalable en navegador compatible.
- Arranque offline tras primera carga.
- Actualización del service worker sin borrar partidas.
- Fallback para recursos ausentes.
- Rutas estáticas y refresco de páginas no producen 404.

## Pruebas de seguridad
- Importaciones corruptas, grandes o con estructura inesperada.
- Eventos no pueden ejecutar código arbitrario.
- La UI no puede inyectar recompensas.
- Comandos administrativos no accesibles desde UI normal.
- XSS y contenido textual no confiable tratados como texto.

## Pruebas de balance
Simular múltiples partidas para comprobar que:
- No hay espirales negativas irreversibles.
- Cuidado siempre es accesible.
- No existe estrategia infinita de una sola acción.
- Las automatizaciones no sustituyen todo el juego.
- Los objetivos de duración por etapa son razonables.
- La dificultad aumenta sin bloquear injustamente el progreso.

## Criterios de publicación
- Build reproducible y sin errores.
- Pruebas automáticas pasan.
- Sin secretos en el repositorio.
- PWA revisada en producción.
- Guardado local probado.
- README y licencia decididos.
- Deploy preview revisado antes de producción.
