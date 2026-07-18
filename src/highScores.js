/**
 * API domaine des records — couche entre l’UI / la scène et le stockage local.
 * Les modules UI importent ici, pas `storage.js` directement.
 */
import { DIFFICULTY_ORDER } from './config.js';
import { loadHighScore as loadHighScoreFromStorage, saveHighScore } from './storage.js';

export { loadHighScoreFromStorage as loadHighScore, saveHighScore };

/** Meilleur score classique toutes difficultés confondues. */
export function loadBestScoreAny() {
    let best = 0;
    for (const diff of DIFFICULTY_ORDER) {
        best = Math.max(best, loadHighScoreFromStorage(diff, false));
    }
    return best;
}

/** Meilleur score hardcore toutes difficultés confondues. */
export function loadBestHardcoreScore() {
    let best = 0;
    for (const diff of DIFFICULTY_ORDER) {
        best = Math.max(best, loadHighScoreFromStorage(diff, true));
    }
    return best;
}
