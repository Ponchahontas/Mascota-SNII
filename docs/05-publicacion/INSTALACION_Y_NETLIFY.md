# Instalación, CI y Netlify

## Desarrollo

Se requiere **Node.js 20 o posterior** y npm.

```bash
npm install
npm run typecheck
npm test
npm run build
npm run dev
```

`npm run build` escribe `dist/`. El servidor local inicia en `http://localhost:4173`. `node_modules/` y `dist/` están excluidos del repositorio mediante `.gitignore`.

## Publicación desde GitHub

Conectar `Ponchahontas/Mascota-SNII` con Netlify, rama `main`, comando `npm run build`, directorio de publicación `dist`. El archivo `netlify.toml` contiene el contrato. Verificar el *commit SHA* asociado al despliegue; un despliegue en estado `ready` no confirma la usabilidad del juego.

## Caché PWA

`public/sw.js` mantiene la lista de recursos del shell, incluidos `src/data/area-routes.js` y **nueve SVG** en `public/pets/`. Con cada modificación incompatible, subir el sufijo de caché. La base IndexedDB conserva temporalmente su **identificador técnico heredado** para no perder partidas. No cambiar la constante `DB` de `src/core/persistence.ts` sin una migración probada. El identificador de exportación JSON nuevo es `academic-pet`; los respaldos anteriores siguen admitidos. El `id` del manifiesto PWA tampoco cambia para conservar la instalación existente.

## Verificaciones manuales

- Probar nueve personajes y sus 14 cuadros en sitio público.
- Tras actualizar, comprobar que se recargan todos los módulos y nuevas imágenes, incluso sin conexión.
- Probar importar partida antigua, exportar JSON, responder misiones, elegir rama desde Universidad y ver cierre en Emérito.
- Confirmar funcionamiento móvil, teclado y preferencias de movimiento reducido.

Para un lanzamiento manual usando Netlify Drop, subir **el contenido compilado de `dist/`**, no la carpeta de código fuente. Ver [Pruebas](../04-calidad/PRUEBAS_Y_ACEPTACION.md).
