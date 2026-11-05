# Continuidad en Codex / ChatGPT Work — Mascota-SNII

**Punto de partida actual: MVP v0.9.** No empezar desde cero ni tratar la documentación histórica como estado vigente.

## Lectura obligatoria

1. [README](README.md) y [índice de documentación](docs/README.md).
2. [Estado actual](docs/01-proyecto/ESTADO_ACTUAL.md) y [hoja de ruta](docs/01-proyecto/HOJA_DE_RUTA.md).
3. [Arquitectura](docs/03-tecnica/ARQUITECTURA.md), [contratos de guardado](docs/03-tecnica/PERSISTENCIA_Y_COMANDOS.md) y [pedagogía](docs/02-juego/PEDAGOGIA_Y_ESTACIONES.md).
4. [CONTRIBUTING](CONTRIBUTING.md), [pruebas](docs/04-calidad/PRUEBAS_Y_ACEPTACION.md) y [CHANGELOG](CHANGELOG.md).
5. El código TypeScript y los tests determinan lo que realmente existe.

## Primera ejecución

~~~bash
npm install
npm run typecheck
npm test
npm run build
~~~

No proclamar pruebas visuales, compatibilidad móvil u operación Netlify sin verificarlas.

## Prioridades de trabajo

- Comprobar que las seis estaciones de cada etapa abren sus cinco retos **propios** y conservan sus aciertos al recargar.
- Pruebas reales de accesibilidad, móvil, PWA, guardado y actualización.
- Revisión educativa del contenido y ampliación mediante minijuegos manipulativos.
- Pruebas longitudinales de balance y recuperaciones para los tres modos.
- Publicación y verificación real de Netlify, sin alterar otros sitios existentes sin autorización.

## Reglas al modificar

- Conservar `activity.id`, índices `0..4`, compatibilidad de partidas e idempotencia.
- Documentar cada módulo y regla en español; comentarios útiles, no repetición obvia.
- Añadir pruebas de regresión y registrar qué quedó pendiente.
- Cambios incrementales, evitando reescrituras destructivas.
- Abrir PR y trabajar en rama si existen otras contribuciones activas; no forzar `main`.

**Importante:** el prompt maestro conserva aspiraciones de largo plazo. Estas instrucciones y las guías vigentes tienen prioridad sobre frases obsoletas del material antiguo.
