# Instalar, desarrollar y publicar

## Requisitos

Node.js **20 o posterior** y npm. Para contribuir, usar un clon del repositorio `Ponchahontas/Mascota-SNII`.

## Comandos

~~~bash
git clone https://github.com/Ponchahontas/Mascota-SNII.git
cd Mascota-SNII
npm install
npm run typecheck
npm test
npm run build
npm run dev
~~~

- `npm run build` genera `dist/` mediante `scripts/build.mjs`.
- `npm run dev` compila y arranca el servidor local de `scripts/serve.mjs`.
- `npm test` compila y ejecuta pruebas de Node.
- No subir `dist/`, cachés o `node_modules/` como código fuente cuando se use despliegue desde repositorio.

## Netlify desde GitHub

1. En Netlify, crear un proyecto desde el repositorio de GitHub.
2. Rama de producción: `main`.
3. Build command: `npm run build`.
4. Publish directory: `dist`.
5. Node compatible con `>=20`, según `package.json`.
6. Revisar los logs de build y abrir el enlace público.
7. Probar manualmente las seis estaciones, recarga y funcionalidad offline antes de compartirlo.

El repositorio ya incluye `netlify.toml`. Para Netlify Drop, subir **el contenido compilado de `dist/`**, no la carpeta de fuentes que necesita instalación y build.

## PWA

`public/sw.js` gestiona caché del shell; actualizar la versión de caché cuando cambien recursos y comprobar refresco en dispositivos que conservaron versiones antiguas. Una PWA declarada instalable no garantiza que haya sido probada en iOS/Android.

**Estado al 4 de noviembre de 2026:** existe configuración de despliegue, pero este documento no certifica un sitio Netlify v0.9 publicado y verificado.

Volver al [índice](../README.md).
