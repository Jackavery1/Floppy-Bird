import { HARDCORE_UNLOCK_SCORE } from './hardcoreUnlock.js';

export function isCoarsePointer() {
    if (typeof matchMedia === 'undefined') return false;
    if (matchMedia('(hover: none) and (pointer: coarse)').matches) return true;
    return matchMedia('(any-pointer: coarse)').matches && !matchMedia('(pointer: fine)').matches;
}

export function jumpHint() {
    return isCoarsePointer() ? 'TAP : sauter' : 'ESPACE : sauter';
}

export function restartHint() {
    return isCoarsePointer() ? 'TAP : rejouer' : 'ESPACE : rejouer';
}

export function dailyReplayHint() {
    return isCoarsePointer() ? 'TAP : rejouer le défi' : 'ESPACE : rejouer le défi';
}

/** @param {boolean} isDaily */
export function restartHintForMode(isDaily) {
    return isDaily ? dailyReplayHint() : restartHint();
}

export function pauseResumeHint() {
    return isCoarsePointer() ? 'TAP : reprendre' : 'ESC : reprendre';
}

export function difficultyHint() {
    return isCoarsePointer() ? 'Boutons : difficulté' : '1  2  3 : difficulté';
}

export function menuHint() {
    return isCoarsePointer() ? 'Bouton MENU ci-dessous' : 'M : menu';
}

export function trainingHint() {
    return isCoarsePointer() ? 'Tap : entraînement' : 'T : entraînement';
}

export function trainingToggleLabel(enabled) {
    if (enabled) {
        return isCoarsePointer() ? '🟦 ENTR. ON' : '🟦 ENTRAÎNEMENT : ON (ralenti + fantôme)';
    }
    return isCoarsePointer() ? '⬜ ENTR. OFF · tap' : '⬜ ENTRAÎNEMENT : OFF (T pour activer)';
}

export function hardcoreHint() {
    return isCoarsePointer() ? 'Tap : hardcore' : 'H : hardcore';
}

export function hardcoreToggleLabel(enabled, unlocked = true) {
    if (!unlocked) {
        return isCoarsePointer()
            ? `🔒 HARD · score ≥ ${HARDCORE_UNLOCK_SCORE}`
            : `🔒 HARDCORE : score ≥ ${HARDCORE_UNLOCK_SCORE} requis`;
    }
    if (enabled) {
        return isCoarsePointer()
            ? '🟥 HARD ON · inv. / tuyau'
            : '🟥 HARDCORE : ON (invinc. / tuyau, 700→325 ms)';
    }
    return isCoarsePointer() ? '⬜ HARD OFF · tap' : '⬜ HARDCORE : OFF (H pour activer)';
}

export function dailyChallengeHint() {
    return isCoarsePointer() ? 'Tap DÉFI DU JOUR' : 'D : défi du jour';
}

export function menuControlsHint() {
    if (isCoarsePointer()) return 'Scores · Options · Skins';
    return `${jumpHint()} · ${dailyChallengeHint()}\n${optionsHint()}`;
}

export function modesHintLine() {
    if (isCoarsePointer()) return `${difficultyHint()}\ntap OPTIONS`;
    return `${trainingHint()} · ${hardcoreHint()}\n${dailyChallengeHint()} · O : options`;
}

export function optionsButtonLabel(open) {
    return open ? '▾ OPTIONS' : '▸ OPTIONS';
}

export function scoresButtonLabel(open) {
    return open ? '▾ SCORES' : '▸ SCORES';
}

export function skinsButtonLabel(open) {
    return open ? '▾ SKINS' : '▸ SKINS';
}

export function skinsCycleHint() {
    return isCoarsePointer() ? 'Tap une case pour choisir' : '← → : skin précédent / suivant';
}

export function skinsPanelHint() {
    return isCoarsePointer()
        ? 'Scores · hardcore · défi · entraînement · néon = collection'
        : `${skinsCycleHint()} · débloqués via scores et modes`;
}

export function optionsHint() {
    return isCoarsePointer() ? 'Scores · Options · Skins' : 'S scores · O options · K skins';
}

export function jumpTutorialText() {
    return isCoarsePointer() ? '↑  TAP pour sauter' : '↑  ESPACE pour sauter';
}

export function gapTutorialText() {
    return isCoarsePointer() ? 'Vise le corridor entre les tuyaux' : 'Passe entre les tuyaux';
}

export function scoreTutorialText() {
    return '+1 point par tuyau passé !';
}

export function coyoteHintText() {
    return isCoarsePointer()
        ? 'Grâce dans le gap : ~0,08 s après sortie'
        : 'Grâce dans le gap : ~5 frames après sortie du corridor';
}

/** @param {number} ms */
export function hardcoreInvincibilityHintText(ms) {
    return isCoarsePointer() ? `Invincible ${ms} ms` : `Invincible ${ms} ms · tuyau`;
}

export function hardcoreTutorialText() {
    return isCoarsePointer()
        ? 'Hardcore : invincible au 1er tuyau,\npuis moins longtemps à chaque tuyau'
        : 'Hardcore : invincible 700 ms au 1er tuyau,\npuis 625→325 ms à chaque tuyau passé';
}

export function classicModeHint() {
    return isCoarsePointer()
        ? 'Classique : aléatoire selon difficulté'
        : 'Classique : gaps aléatoires';
}

/** @param {'pipe' | 'ground' | 'ceiling' | null | undefined} cause */
export function deathCauseLabel(cause) {
    switch (cause) {
        case 'pipe':
            return 'Collision tuyau';
        case 'ground':
            return 'Touché le sol';
        case 'ceiling':
            return 'Touché le plafond';
        default:
            return '';
    }
}
