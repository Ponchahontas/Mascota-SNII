/**
 * @module ui/pet-animation
 * Traductor puro de necesidades -> expresión visual y respuesta transitoria.
 *
 * RESPONSABILIDAD: elegir una animación comprensible para el jugador.
 * NO altera energía, PA, recompensas, etapa, guardados ni probabilidades.
 * Cada especie mantiene su sprite de catorce evoluciones: el efecto se aplica
 * mediante clases CSS sobre el cuadro visible, nunca editando el SVG original.
 *
 * Todas las advertencias se obtienen de engine-health.ts para que la escena
 * nunca maneje umbrales contradictorios con las reglas de dificultad.
 */
import type { NeedsState, GameSave } from '../core/state.js';
import type { ActionType } from '../core/engine-game.js';
import { vitalAlerts } from '../core/engine-health.js';

/** Nombre estable que CSS utiliza para seleccionar la animación cíclica. */
export type PetMood = 'atento' | 'feliz' | 'cansado' | 'agotado' | 'tenso' | 'saturado' | 'desanimado' | 'distraido' | 'abatido';
/** Efímero: se muestra tras confirmar una orden sin persistirlo en IndexedDB. */
export type PetReaction = 'alivio' | 'aprendizaje' | 'celebracion' | 'evolucion';
export interface MoodVisual {
  mood: PetMood;
  label: string;
  symbol: string;
  /** Describe la animación mediante texto; no depende solo de color o movimiento. */
  hint: string;
  /** Lista completa de advertencias en orden de gravedad; evita ocultar una crisis combinada. */
  signals: readonly { key: string; icon: string; label: string; severe: boolean }[];
}

const LOOK: Record<PetMood, { label: string; symbol: string; hint: string }> = {
  atento:      {label:'Atento',         symbol:'👀', hint:'Observa y respira con tranquilidad.'},
  feliz:       {label:'Contento',       symbol:'✨', hint:'Se mueve con alegría y curiosidad.'},
  cansado:     {label:'Con sueño',      symbol:'🥱', hint:'Se balancea lentamente y necesita reponer energía.'},
  agotado:     {label:'Agotado',        symbol:'💤', hint:'Está encorvado y le cuesta mantenerse despierto.'},
  tenso:       {label:'Bajo presión',  symbol:'🌡️', hint:'Tiembla ligeramente por la carga académica.'},
  saturado:    {label:'Saturado',       symbol:'💢', hint:'El estrés causa temblores y señales de sobrecarga.'},
  desanimado:  {label:'Desanimado',     symbol:'💔', hint:'Su postura decae; necesita apoyo y compañía.'},
  distraido:   {label:'Distraído',     symbol:'❔', hint:'Mira a los lados y pierde el hilo de sus tareas.'},
  abatido:     {label:'Decaído',       symbol:'🌧️', hint:'Su movimiento se vuelve lento y apagado.'},
};

const SIGNALS: Record<string, { icon: string; label: string }> = {
  energy: { icon: '💤', label: 'Energía' },
  motivation: { icon: '💗', label: 'Motivación' },
  concentration: { icon: '❔', label: 'Concentración' },
  wellbeing: { icon: '🌧️', label: 'Bienestar' },
  stress: { icon: '💢', label: 'Estrés' },
};

/**
 * Prioriza estados críticos antes que los de precaución. Si coexisten varios,
 * el avatar representa el más urgente y el resto queda visible como señales.
 * Este orden es solo de presentación, no modifica la prioridad clínica/jugable.
 */
export function moodForNeeds(needs: NeedsState): MoodVisual {
  const alerts = vitalAlerts(needs);
  const ordered = [...alerts].sort((a,b) => Number(b.severity==='critico')-Number(a.severity==='critico'));
  const urgent = ordered[0];
  let mood: PetMood = 'atento';
  if (urgent) {
    switch (urgent.key) {
      case 'energy': mood = urgent.severity==='critico'?'agotado':'cansado'; break;
      case 'motivation': mood = 'desanimado'; break;
      case 'concentration': mood = 'distraido'; break;
      case 'wellbeing': mood = 'abatido'; break;
      case 'stress': mood = urgent.severity==='critico'?'saturado':'tenso'; break;
    }
  } else if (needs.wellbeing>=75 && needs.motivation>=60 && needs.energy>=60 && needs.stress<=35) {
    mood = 'feliz';
  }
  return {
    mood, ...LOOK[mood],
    signals: ordered.map(a=>({key:a.key,icon:SIGNALS[a.key].icon,label:SIGNALS[a.key].label,severe:a.severity==='critico'})),
  };
}

export const REACTION_LOOK: Record<PetReaction, { symbol: string; description: string }> = {
  alivio: {symbol:'💚',description:'El cuidado le hace sentirse mejor.'},
  aprendizaje: {symbol:'📚',description:'¡Una actividad de aprendizaje completada!'},
  celebracion: {symbol:'🎉',description:'¡Logro conseguido!'},
  evolucion: {symbol:'🌟',description:'¡Una nueva etapa de desarrollo!'},
};

/**
 * Solo órdenes CONFIRMADAS producen reacciones. La UI debe verificar el
 * resultado del coordinador antes de llamar esta función (no en errores ni
 * reintentos rechazados). El éxito visual nunca otorga premios por sí solo.
 *
 * @param command Tipo de acción confirmada por el almacenamiento.
 * @param before Snapshot previo a la operación.
 * @param after Snapshot confirmado después de la operación.
 * @returns Una reacción de 2 segundos o null si no procede.
 */
export function reactionForCommand(command: ActionType, before: GameSave, after: GameSave): PetReaction | null {
  if (command==='career.confirmTransition' && after.stageIndex>before.stageIndex) return 'evolucion';
  if (command==='career.restartAfterDropout' || command==='legacy.startGeneration') return 'evolucion';
  if (command==='care.perform') return 'alivio';
  if (command==='project.submit' || command==='event.resolve') return 'celebracion';
  if (command==='activity.execute') return 'aprendizaje';
  return null;
}
