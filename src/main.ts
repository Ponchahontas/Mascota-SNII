/**
 * @module main
 * Entrada estática: monta UI y registra PWA solo en navegadores compatibles.
 * Un error de instalación del service worker no debe impedir jugar en línea.
 * La gestión del caché pertenece a public/sw.js; el guardado permanece en IDB.
 */
import './ui/app.js';
if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('./sw.js').catch(()=>{/* El juego puede funcionar sin instalación. */});});}
