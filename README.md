# Mascota-SNII · Tamagotchi Académico

**MVP v0.9** · Juego web educativo y satírico en español, centrado en acompañar a una mascota a través de una trayectoria ficticia desde Kínder hasta SNII Emérito. La persona jugadora cuida y toma decisiones; la mascota aprende, experimenta y realiza las actividades apropiadas para su etapa.

> **Aviso:** juego independiente. Las etapas, las recompensas y los requisitos del juego **no son criterios oficiales** del Sistema Nacional de Investigadoras e Investigadores.

## Qué incluye hoy

- 14 etapas de crecimiento académico; 84 actividades (seis por etapa).
- Cinco descubrimientos por actividad: 420 textos de pregunta, aciertos guardados y práctica repetible.
- Un escenario por etapa con seis estaciones; estación, actividad y preguntas vinculadas por un identificador estable.
- Siete mascotas visuales por área de conocimiento y 14 cuadros de evolución por especie.
- Energía, motivación, concentración, bienestar y estrés; cuidados, tres dificultades y consecuencias lúdicas.
- Progreso, proyectos, eventos, legado, respaldo JSON, guardado local mediante IndexedDB y PWA estática.
- Interfaz y código documentados en español; pruebas automatizadas con GitHub Actions.

**Estado de calidad:** las pruebas automáticas de la iteración v0.9 se registraron en el historial. Siguen pendientes la validación visual en navegadores/móviles, la revisión educativa experta y el balance longitudinal. No afirmar que el despliegue Netlify está verificado sin comprobar una URL pública.

## Para ejecutar localmente

Requiere Node.js 20 o superior y npm.

~~~bash
npm install
npm run typecheck
npm test
npm run dev
~~~

`npm run build` genera una distribución estática en `dist/`. Configuración para Netlify: comando `npm run build`, publicación `dist`.

## Documentación organizada

| Tema | Ir a |
| --- | --- |
| **Índice general** | [docs/README.md](docs/README.md) |
| Estado actual y limitaciones | [Estado](docs/01-proyecto/ESTADO_ACTUAL.md) |
| Próximos desarrollos | [Hoja de ruta](docs/01-proyecto/HOJA_DE_RUTA.md) |
| Mecánicas y dificultad | [Balance](docs/02-juego/JUGABILIDAD_Y_BALANCE.md) |
| Preguntas y estaciones educativas | [Pedagogía](docs/02-juego/PEDAGOGIA_Y_ESTACIONES.md) |
| Mascotas, escenarios y animaciones | [Arte](docs/02-juego/AVATARES_Y_ESCENARIOS.md) |
| Arquitectura y guardado | [Arquitectura](docs/03-tecnica/ARQUITECTURA.md) |
| Pruebas y accesibilidad | [Calidad](docs/04-calidad/PRUEBAS_Y_ACEPTACION.md) |
| Instalación y Netlify | [Publicación](docs/05-publicacion/INSTALACION_Y_NETLIFY.md) |
| Instrucciones para colaborar | [CONTRIBUTING.md](CONTRIBUTING.md) |
| Continuidad con Codex/Work | [CONTINUAR_EN_CODEX_O_WORK.md](CONTINUAR_EN_CODEX_O_WORK.md) |
| Documentos de versiones anteriores | [Archivo histórico](docs/historico/README.md) |

## Orientación del código

`src/core/` contiene reglas, estado, comandos y persistencia. `src/data/` define etapas, preguntas, escenarios y especies. `src/ui/` contiene la interfaz y las animaciones. `tests/` cubre el motor y las asociaciones entre actividades y estaciones. Las funcionalidades deben mantenerse desacopladas y el código debe incluir **comentarios útiles en español**.

## Licencia y contribuciones

En el estado revisado no existe un archivo `LICENSE` en el repositorio: por ello **no se presume una licencia de código abierto**. Antes de reutilizar o distribuir el código fuera de los permisos explícitos del titular, aclarar la licencia y procedencia de los recursos. Consulta [CONTRIBUTING.md](CONTRIBUTING.md).
