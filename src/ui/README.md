# Interfaz y animaciones — guía actual

La interfaz **está implementada** en `app.ts` y los estados de expresión se gestionan en `pet-animation.ts`. Los estilos y escenarios visuales se encuentran en `../styles.css`. La capa de UI representa los datos y despacha comandos; no modifica directamente la economía de la partida.

## Contratos esenciales

- Vincular botones del entorno, aventura abierta y lista lateral **por `activity.id`**.
- Mostrar el título, icono, etapa y progreso de los cinco pasos de la actividad correcta.
- Guardar los aciertos por el motor/transacción; el estado transitorio del panel no equivale a un guardado.
- Mantener señales de emoción accesibles: texto, contraste, foco, teclado y movimiento reducido.
- No guardar animaciones pasajeras ni duplicar recompensas al renderizar.
- Revisar el comportamiento móvil y PWA en navegador real: las pruebas unitarias no sustituyen la evaluación visual.

Consulta [arte, escenas y accesibilidad](../../docs/02-juego/AVATARES_Y_ESCENARIOS.md), [arquitectura](../../docs/03-tecnica/ARQUITECTURA.md) y [pruebas](../../docs/04-calidad/PRUEBAS_Y_ACEPTACION.md).
