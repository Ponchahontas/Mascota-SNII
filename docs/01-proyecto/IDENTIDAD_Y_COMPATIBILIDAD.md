# Identidad y compatibilidad de Academic Pet

**Nombre visible:** **Academic Pet**.  
**Subtítulo:** **Una aventura de aprendizaje**.  
**Nombre técnico del repositorio:** `Ponchahontas/Mascota-SNII` (no se renombra para evitar romper URL, automatizaciones y Netlify).

## Principios de diseño y comunicación

Academic Pet se presenta como una **mascota virtual educativa original**: se aprende con preguntas, estaciones ilustradas, exploración, cuidado, bienestar y rutas temáticas académicas. Los personajes, animaciones y escenarios deben ser propios; evitar mencionar, reproducir o imitar identidades distintivas de productos comerciales ajenos. En español usar «mascota virtual» o «juego educativo de mascotas» como descripciones genéricas.

El cambio afecta a la **cabecera del juego**, el título y la descripción de HTML, el manifiesto de instalación PWA, las etiquetas de exportación, el README y las guías. Las nueve áreas, las 14 etapas y las rutas pedagógicas no cambian.

## Compatibilidad de partidas: no borrar el progreso

- `src/core/persistence.ts` conserva por ahora la **clave histórica de IndexedDB**. Es un identificador interno que no aparece en la interfaz; cambiarlo directamente crearía una base nueva aparentemente vacía. **No eliminar** la base anterior ni renombrarla sin migración y pruebas de recuperación.
- Los respaldos **nuevos** usan `application: "academic-pet"`. `parseImport` también acepta el identificador **anterior** para que personas usuarias con respaldos antiguos puedan restaurarlos.
- El archivo de descarga se llama `academic-pet-generacion-N.json`.
- `public/manifest.webmanifest` conserva `id`, `scope` y `start_url`; solo cambian el nombre y la descripción. Así no se fuerza a instalar una segunda PWA.
- El service worker crea su propia familia de cachés con prefijo `academic-pet-shell-` y limpia únicamente las cachés antiguas de **esta** aplicación. No tocar almacenamiento de otros proyectos.
- La versión del juego pasa a `0.11.0`, pero el **esquema persistente sigue siendo 2**. Los datos de las nueve áreas y las especializaciones continúan intactos.

## Comprobación

```bash
npm install
npm run typecheck
npm test
npm run build
```

Revisar en un navegador real que el título, la PWA instalada y las descargas muestren **Academic Pet**, y que una partida anterior y su JSON se puedan abrir sin pérdidas. La prueba de interfaz real es independiente de la suite de Node.

## Antes de comercializar

La denominación propuesta no tiene exclusividad jurídica acreditada. Consultar coincidencias idénticas y parecidas en **MARCia del IMPI**: https://marcia.impi.gob.mx/marcas/search. Una búsqueda preliminar no sustituye un estudio de viabilidad registral ni garantiza derechos para usar o registrar el nombre en México u otros países.
