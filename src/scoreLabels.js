import { GAME_CONFIG } from './config.js';

/** Libellé « meilleur score » partagé menu / game over (évite import GO → menu). */
export function bestScoreLabel(difficulty, hardcoreMode) {
    const diff = GAME_CONFIG.difficultyLabels[difficulty] ?? '';
    return hardcoreMode ? `MEILLEUR HC (${diff})` : `MEILLEUR (${diff})`;
}
