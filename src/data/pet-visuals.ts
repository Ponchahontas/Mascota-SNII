/** Identidad visual original, fija por área a través de las 14 etapas.
 * Cada SVG contiene 14 cuadros pixel art. La identidad de la mascota no se
 * decide a partir de una imagen arbitraria: se conserva el areaId de la partida.
 */
export const PET_KINDS = {
 fisico:{name:'Ajolote astral',accent:'#79d9e5',traits:'Branquias luminosas, curiosidad cósmica',icon:'🌌'},
 biologia:{name:'Zorro de laboratorio',accent:'#f0af66',traits:'Orejas de zorro y cola exploradora',icon:'🧬'},
 medicina:{name:'Búho sanador',accent:'#c7b1ed',traits:'Alas y ojos atentos al bienestar',icon:'🩺'},
 humanidades:{name:'Gato cronista',accent:'#b4a3f5',traits:'Bigotes, libros y memoria narrativa',icon:'📜'},
 sociales:{name:'Capibara comunitaria',accent:'#dda57a',traits:'Hocico amable y espíritu colaborativo',icon:'🌎'},
 agro:{name:'Tortuga botánica',accent:'#9bd1ae',traits:'Caparazón y un pequeño brote',icon:'🌱'},
 ingenieria:{name:'Robot ingenioso',accent:'#a9c5ef',traits:'Antena, visor y piezas mecánicas',icon:'⚙️'},
} as const;
export type PetAreaId = keyof typeof PET_KINDS;
export const petArea=(areaId:string):PetAreaId=>Object.prototype.hasOwnProperty.call(PET_KINDS,areaId)?areaId as PetAreaId:'biologia';
/** Retorna URL local propia del sitio: evita inyectar rutas externas en el estilo. */
export const petSprite=(areaId:string)=>`./pets/${petArea(areaId)}.svg`;
/** 14 cuadros numerados de 0 a 13; CSS maneja background-position. */
export const spriteFrame=(stageIndex:number)=>Number.isFinite(stageIndex)?Math.max(0,Math.min(13,Math.trunc(stageIndex))):0;
