/**
 * Regresión documental: protege la navegación y el mapa de mantenimiento.
 * El repositorio se comparte con colaboradores; enlaces locales rotos o guías
 * obsoletas provocan cambios sobre APIs inexistentes. No valida URLs externas.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const documents = [
  'README.md', 'CONTRIBUTING.md', 'CONTINUAR_EN_CODEX_O_WORK.md',
  'docs/README.md', 'docs/01-proyecto/ESTADO_ACTUAL.md',
  'docs/01-proyecto/HOJA_DE_RUTA.md', 'docs/02-juego/AREAS_Y_RUTAS.md',
  'docs/02-juego/AVATARES_Y_ESCENARIOS.md',
  'docs/02-juego/JUGABILIDAD_Y_BALANCE.md',
  'docs/02-juego/PEDAGOGIA_Y_ESTACIONES.md',
  'docs/03-tecnica/ARQUITECTURA.md',
  'docs/03-tecnica/PERSISTENCIA_Y_COMANDOS.md',
  'docs/04-calidad/PRUEBAS_Y_ACEPTACION.md',
  'docs/05-publicacion/INSTALACION_Y_NETLIFY.md',
  'docs/06-normativa/FUENTES_Y_ADVERTENCIAS.md',
  'src/data/README.md', 'src/ui/README.md', 'tests/PLAN.md',
];

test('el índice vigente y las guías técnicas no contienen enlaces locales rotos', () => {
  let links = 0;
  for (const filename of documents) {
    assert.ok(existsSync(filename), `Falta ${filename}`);
    const body = readFileSync(filename, 'utf8');
    // Sólo enlaces Markdown [etiqueta](archivo). Los enlaces absolutos a sitios
    // remotos no se pueden validar sin red y no deben bloquear la compilación.
    for (const match of body.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const target = match[1].split('#')[0];
      if (!target || /^(?:https?:|mailto:|\/\/)/.test(target)) continue;
      links++;
      const full = resolve(dirname(filename), decodeURIComponent(target));
      assert.ok(existsSync(full), `${filename} enlaza a ${target}, que no existe`);
    }
  }
  assert.ok(links >= 30, 'El índice de documentación perdió enlaces');
});

test('la documentación vigente señala las nueve áreas sin presentar el juego como evaluación oficial', () => {
  const readme = readFileSync('README.md', 'utf8');
  const guide = readFileSync('docs/02-juego/AREAS_Y_RUTAS.md', 'utf8');
  assert.match(readme, /9 áreas y 9 mascotas/i);
  assert.match(guide, /126 misiones/);
  assert.match(guide, /no equivalen/i);
  assert.match(readme, /partidas antiguas/i);
});
