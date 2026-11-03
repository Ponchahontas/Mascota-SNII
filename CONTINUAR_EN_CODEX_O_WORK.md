# INSTRUCCIONES DE CONTINUIDAD — CODEX / CHATGPT WORK

## Contexto
Tienes un repositorio de un MVP jugable denominado "Tamagotchi Académico" versión 0.2, construido a partir de un paquete de especificaciones en español. No empieces desde cero. Lee `README.md`, `docs/08_ESTADO_MVP_V2.md`, `PROMPT_MAESTRO_ASTRA.md` y los siete documentos `docs/00`–`docs/07`.

## Encargo
Actúa como equipo de programación, diseño pixel art, UX, QA, accesibilidad, investigación normativa y DevOps. Continúa implementando por fases, preservando los archivos y evitando acciones destructivas. Prioriza:

1. Ejecutar `npm install`, `npm test`, `npm run dev` y probar de verdad en Chromium, Safari móvil y Android cuando estén disponibles. Corregir todos los defectos de flujo y PWA.
2. Implementar pruebas IndexedDB integradas, validación profunda de archivos, simulaciones de balance, actualización del service worker y pruebas de concurrencia.
3. Completar el catálogo `docs/04_CATALOGO_COMANDOS.md` con errores específicos, modelos extensibles, proyectos múltiples, inventarios, compras, competencias por etapa, expediente, recompensas y versiones.
4. Diseñar y probar pixel art y animaciones más ricas para las 14 fases, con evolución por área del conocimiento y preferencias de accesibilidad.
5. Completar eventos repetibles, mecánicas clicker/idle, cadenas, automatizaciones limitadas, legado y equilibrio sin bloqueos.
6. Verificar en DOF/SECIHTI la normativa actual y sus anexos, con fecha de consulta y citas precisas. Nunca tratar números ficticios como criterios oficiales.
7. Crear GitHub Actions reproducibles y auditar seguridad, privacidad, accesibilidad y funcionamiento sin conexión.
8. Comprobar acceso a GitHub y Netlify. Antes de crear un repositorio, preguntar nombre, visibilidad y licencia si no están decididos; no sobrescribir uno existente. Crear rama y PR cuando proceda. No publicar en producción sin autorización explícita y validación E2E.
9. Actualizar `README.md`, documentación de arquitectura, changelog, pruebas y lista de limitaciones con cada incremento.

## Hechos ya comprobados
- `npm run build` completó compilación TypeScript con éxito en el entorno de generación.
- `npm test` pasó 12 pruebas unitarias del motor.
- `dist/` contiene el sitio estático listo para servir con un proveedor de hosting estático.
- El navegador de pruebas del entorno de generación bloqueó localhost y `file://`, por lo que la interfaz no fue inspeccionada vía E2E. Esta prueba es **obligatoria** antes de llamar al MVP validado.
- No hubo subida a GitHub ni despliegue Netlify en el entorno de generación. El conector GitHub identificó una cuenta, pero devolvió cero repositorios accesibles.

## Reglas de ingeniería
- Mantén TypeScript estricto, modularidad, código y documentación comentados (comentarios reales que no alteren ejecución).
- El estado debe cambiar solo mediante comandos, preservando atomicidad, idempotencia, control de revisiones y el límite de 8 horas offline.
- No almacenes claves, secretos, mediciones personales ni información del usuario en el repo.
- Las cifras de balance, áreas lúdicas y etapas son ficción, no criterios oficiales.
- Mantén la partida indefinida: el legado es voluntario.

## Entregables
Producto jugable y probado, build verificable, ZIP de fuente y ZIP listo para hospedaje estático, documentación y —si el usuario autoriza/publica— enlaces remotos comprobados.
