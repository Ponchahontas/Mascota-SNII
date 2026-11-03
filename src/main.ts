/** Punto de entrada: conecta interfaz, coordinador, IndexedDB y ciclo de vida PWA. */
import './ui/app.js';
if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('./sw.js').catch(()=>{/* El juego puede funcionar sin instalación. */});});}
