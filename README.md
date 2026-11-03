# Tamagotchi Académico — MVP jugable 0.2

**Estado verificable:** compilación TypeScript correcta y pruebas del motor ejecutadas. Interfaz visual responsiva implementada, pero **no se ha validado en un navegador real** en esta sesión porque el navegador de pruebas bloqueó el acceso al servidor local. No se ha realizado despliegue remoto. No es una versión final.

Un Tamagotchi satírico en español para vivir una carrera académica imaginaria a lo largo de 14 etapas, de Kínder a Emérito. Pixel art dibujado con CSS, sin imágenes propietarias. Todos los puntos, premios, requisitos y clasificaciones en pantalla **son ficticios**. No existe afiliación institucional ni equivalencia con normas oficiales.

**Repositorio oficial de desarrollo:** https://github.com/Ponchahontas/Mascota-SNII

## Inicio rápido

Requiere Node.js 20 o posterior.

```bash
npm install
npm test
npm run dev
```

Abre `http://localhost:4173`. El servidor sirve el directorio `dist/` construido por `npm run build`. También puedes desplegar los archivos **dentro de `dist`** directamente en Netlify Drop, sin ninguna fase de compilación.

## Funcionalidad del MVP

- Crear una mascota con nombre y un campo temático de conocimiento. Animación y expresiones del personaje.
- Acciones de estudio y tutoría (la tutoría da créditos desde Kínder), actividades específicas desbloqueadas por etapa.
- Cuidado sin coste de PA, necesidades y enfriamiento breve para acciones de recuperación.
- 14 etapas, UPE, evidencias lúdicas y barreras mínimas para progresar.
- Proyectos completables, eventos de decisiones, recompensas y bitácora.
- Asistente bibliográfico básico desde Universidad, con mantenimiento y límites de producción.
- Guardado local en IndexedDB con transacciones de estado y comandos idempotentes; control de revisión para pestañas concurrentes.
- Regeneración limitada a 8 h offline, importación y exportación JSON, modo legado voluntario.
- PWA preparada para instalación en navegador compatible, cache estática, controles de teclado y diseño responsive.

## Despliegue en Netlify

**Método A: Netlify Drop sin build.** Compila con `npm run build`. Descomprime `Tamagotchi_Academico_NETLIFY_DROP_v2.zip` si lo recibiste y arrastra la carpeta descomprimida con `index.html` en la raíz. En Netlify no debes ejecutar un comando de compilación para este método.

**Método B: repositorio GitHub.** Publica la carpeta fuente, conecta el repo a Netlify y usa `npm run build` como comando y `dist` como carpeta de publicación. El proyecto incorpora `netlify.toml` con estos valores. Si falla la instalación, verifica la versión de Node y la disponibilidad de `typescript` en npm.

No pegues claves ni secretos dentro del repositorio. No se requiere backend ni API key para jugar.

## Arquitectura

- `src/data/catalog.ts`: tablas ficticias de 14 etapas, actividades, cuidado, eventos y temáticas.
- `src/core/engine-game.ts`: reglas puras de acciones, proyectos, carrera, tiempo y legado.
- `src/core/persistence.ts`: IndexedDB transaccional, idempotencia y validación de importaciones.
- `src/core/game-coordinator.ts`: mediación de comandos con UUID y revisión esperada.
- `src/ui/app.ts`: vista y eventos del DOM, delegación hacia el coordinador.
- `public/sw.js`: caché del shell. Los archivos de datos del usuario no se cachean.
- `scripts/build.mjs`: distribución estática sin empaquetador externo (TypeScript local o instalado).
- `docs/`: decisiones originales y documento de estado de MVP.
- `PROMPT_MAESTRO_ASTRA.md`: especificación de producto mayor para continuar por fases.

## Riesgos y pendientes

Este MVP **no implementa aún el catálogo íntegro** de `docs/04_CATALOGO_COMANDOS.md`. Falta implementar a profundidad inventarios y compras, múltiples proyectos, subrutas especializadas, competencias específicas, sistemas de eventos extensos, revisiones normativas oficiales, balance a gran escala, accesibilidad auditada, migraciones de esquemas anteriores y pruebas reales de navegadores/PWA. La economía y el equilibrio del juego son provisionales. IndexedDB almacena partidas solamente en el navegador actual; exporta respaldos para proteger tu progreso. Las importaciones reemplazan la partida activa (con confirmación) y no admiten versiones antiguas.

## Licencia

**Pendiente de decisión del autor.** No se ha asignado una licencia abierta por cuenta del usuario. Antes de hacerlo público, selecciona expresamente una licencia adecuada.
