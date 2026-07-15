/** Annonces SR : 1er point et multiples de 5 immédiats ; autres scores debounced. */
import { announceScoreReached } from './sceneA11ySync.js';

/** @param {number} score */
export function shouldAnnounceScore(score) {
    return score > 0 && (score === 1 || score % 5 === 0);
}

let debounceTimer = null;
let pendingScore = 0;

export function resetScoreAnnounceState() {
    clearTimeout(debounceTimer);
    debounceTimer = null;
    pendingScore = 0;
}

/** @param {number} score */
export function announceScoreLive(score) {
    if (score <= 0) return;
    if (shouldAnnounceScore(score)) {
        resetScoreAnnounceState();
        announceScoreReached(score);
        return;
    }
    pendingScore = score;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        announceScoreReached(pendingScore);
        debounceTimer = null;
    }, 700);
}
