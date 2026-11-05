# Guía de interfaz: consecuencias visibles

## Orden de lectura

1. **Mascota y etapa**: identidad visual, fase educativa, expresión de ánimo, escena con borde neutro/ámbar/rojo según problemas.
2. **Estado vital**: cinco barras que se pueden interpretar por texto y color, sin depender solo del color.
3. **Qué ocurre**: tarjeta de condición con consecuencias y cuidados sugeridos. Si hay crisis combinada, mostrar tiempo acumulado.
4. **Qué puedes hacer**: botones de cuidado disponibles sin PA, y actividades de etapa desactivadas explícitamente cuando exista bloqueo.
5. **Progreso**: PA con previsión aproximada del siguiente punto, UPE y expediente.

## Textos claros

El texto debe describir al protagonista. El usuario **guía y cuida**; la mascota **aprende y trabaja**. No utilizar «enfermedad», «diagnóstico» ni culpabilizar a estudiantes reales. «Deserción» solo nombra un desenlace satírico de esta partida. No asumir que las reglas coinciden con las del SNII oficial.

## Accesibilidad

Mantener contraste suficiente, controles de 40 px o más cuando sea posible, focos visibles, estados críticos con texto y no solo color. Respetar `prefers-reduced-motion`. No bloquear la posibilidad de exportar un respaldo después del final de la generación.

## Deuda técnica

- Animaciones especiales por necesidad, más allá del filtro CSS y el texto de estado.
- Comparaciones visuales entre dificultades durante la creación.
- Modo de alto contraste, escalado tipográfico y pruebas con VoiceOver/TalkBack.
- Pruebas E2E de navegación PWA y flujo de deserción/importación.
