# Mascota-SNII · Tamagotchi Académico

**MVP v0.10.0** · Videojuego web educativo y satírico en español, instalable como PWA, con almacenamiento local. La mascota crece desde **Kínder hasta SNII Emérito** en un recorrido *ficticio* de catorce etapas. La persona jugadora acompaña y cuida; la mascota realiza actividades propias de su edad o etapa.

> **Independencia y alcance.** Las nueve denominaciones de áreas se corresponden con los *Lineamientos para el funcionamiento del SNII* publicados por la Secihti en el DOF el **6 de febrero de 2026**. Las mascotas, puntajes, rutas, preguntas, recompensas y desenlaces son **creaciones del videojuego**, no criterios oficiales, equivalencias de evaluación ni afiliación institucional.

## Estado actual

- **9 áreas y 9 mascotas originales**: se añaden el *Colibrí pedagogo* (IV. Conducta y Educación) y la *Quimera interdisciplinaria* (IX). Las siete anteriores conservan sus IDs.
- **126 cuadros de evolución**: 14 edades por mascota, generadas como nueve sprites SVG de catorce cuadros.
- **9 recorridos educativos** con un tema de campo distinto por etapa (**126 misiones**), una por área y nivel.
- **18 variantes narrativas de cierre**, dos especializaciones por área elegibles desde Universidad. No constituyen categorías ni títulos oficiales.
- **84 aventuras educativas** de cinco retos cada una (420 preguntas), vinculadas a seis estaciones por etapa mediante `activity.id`.
- Cinco medidores de bienestar, recursos, cuidado, dificultades, riesgos, logros, proyectos, guardado IndexedDB, exportación/importación JSON y limitación de progreso offline.
- Las 9 áreas incluyen su mascota, un escenario temático de carrera y una ruta de aprendizaje. **El catálogo de seis actividades de cada etapa sigue siendo común entre áreas**: los nueve recorridos agregan misiones temáticas, no nueve juegos educativos totalmente independientes.

### Áreas y mascotas

| Área de conocimiento SNII 2026 | Mascota | ID compatible |
|---|---|---|
| I. Físico-Matemáticas y Ciencias de la Tierra | Ajolote astral | `fisico` |
| II. Biología y Química | Zorro de laboratorio | `biologia` |
| III. Medicina y Ciencias de la Salud | Búho sanador | `medicina` |
| IV. Ciencias de la Conducta y la Educación | **Colibrí pedagogo** | `conducta` |
| V. Humanidades | Gato cronista | `humanidades` |
| VI. Ciencias Sociales | Capibara comunitaria | `sociales` |
| VII. Ciencias de Agricultura, Agropecuarias, Forestales y de Ecosistemas | Tortuga botánica | `agro` |
| VIII. Ingenierías y Desarrollo Tecnológico | Robot ingenioso | `ingenieria` |
| IX. Interdisciplinaria | **Quimera interdisciplinaria** | `interdisciplinaria` |

**[Ver las 126 evoluciones de mascotas](docs/assets/preview-126-evoluciones.png)** (vista previa de las nueve especies).

## Jugar o ejecutar localmente

**Web:** https://sniipet2026.netlify.app/ (la versión disponible depende del último despliegue de Netlify; comprobarlo antes de dar por publicada v0.10.0).

Requisitos: Node.js 20 o superior y npm. El proyecto utiliza TypeScript sin Vite ni servidor de aplicaciones.

```bash
git clone https://github.com/Ponchahontas/Mascota-SNII.git
cd Mascota-SNII
npm install
npm run typecheck
npm test
npm run dev
```

Servidor de desarrollo: `http://localhost:4173`. Compilación de publicación: `npm run build`, salida `dist/`. En Netlify: comando `npm run build` y carpeta `dist` (configurado en `netlify.toml`).

## Guía para revisar el repositorio

| Componente | Responsabilidad |
|---|---|
| `src/data/catalog.ts` y `stage-activities.ts` | Áreas, etapas, actividades, cuidados y balance ficticio |
| `src/data/area-routes.ts` | **9 rutas**, 126 desafíos de campo, 18 especializaciones/desenlaces |
| `src/data/learning-path.ts`, `learning-sequences.ts`, `activity-extras.ts` | 420 preguntas estructuradas por actividad |
| `src/data/pet-visuals.ts`, `public/pets/` | Nueve especies y sus catorce evoluciones |
| `src/data/scene-world.ts` | Escenarios y estaciones por nivel |
| `src/core/engine-game.ts`, `engine-health.ts` | Reglas, bienestar, premios y final de generación |
| `src/core/persistence.ts`, `state.ts`, `game-coordinator.ts` | Partidas locales, compatibilidad, comandos e idempotencia |
| `src/ui/app.ts`, `pet-animation.ts`, `src/styles.css` | Interfaz, reacciones, movimiento y paneles de ruta |
| `scripts/generate-pets.py` | Generación reproducible de los sprites con Pillow (solo para regenerar) |
| `tests/` | Pruebas del motor, rutas, persistencia, actividades y assets |

Documentación: **[Índice general](docs/README.md)** · [Áreas y especializaciones](docs/02-juego/AREAS_Y_RUTAS.md) · [Estado real](docs/01-proyecto/ESTADO_ACTUAL.md) · [Pruebas](docs/04-calidad/PRUEBAS_Y_ACEPTACION.md) · [Colaborar](CONTRIBUTING.md) · [Historial](CHANGELOG.md) · [Instrucciones Codex/Work](CONTINUAR_EN_CODEX_O_WORK.md).

## Verificaciones y límites

- El banco automático tiene **71 pruebas locales** en v0.10.0, incluidas dos comprobaciones documentales. Verificar resultados del *commit* correspondiente en GitHub Actions.
- Hay compatibilidad con partidas antiguas de las **siete áreas**: no se renombra ninguno de sus identificadores, el esquema permanece en v2 y los campos de ruta son opcionales.
- Pendiente: revisión pedagógica experta, pruebas visuales completas en navegador/móvil, balance longitudinal, minijuegos manipulativos y comprobación de PWA/offline en dispositivos reales.
- Una especialización cambia la misión de campo y el final narrativo; **no reemplaza automáticamente las seis actividades base de cada etapa**.

## Licencia

No se ha publicado un archivo `LICENSE`. **No se presume licencia de código abierto**: definirla expresamente antes de autorizar reutilización por terceros.
