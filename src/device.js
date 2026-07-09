import { HARDCORE_UNLOCK_SCORE } from './hardcoreUnlock.js';
import { GAME_CONFIG } from './config.js';

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
    return isCoarsePointer() ? '⬜ ENTR. OFF' : '⬜ ENTRAÎNEMENT : OFF';
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
    return isCoarsePointer() ? '⬜ HARD OFF' : '⬜ HARDCORE : OFF';
}

export function dailyChallengeHint() {
    return isCoarsePointer() ? 'Tap Défi du jour' : 'D : défi du jour';
}

export function menuControlsHint() {
    return optionsControlsHint();
}

/** Commandes structurées pour le panneau OPTIONS (onglet Contrôles). */
export function optionsControlRows() {
    if (isCoarsePointer()) {
        return [
            { key: 'TAP', action: 'sauter' },
            { key: 'DÉFI', action: 'défi du jour' },
            { key: '1·2·3', action: 'difficulté' },
            { key: '···', action: 'scores · skins' },
        ];
    }
    return [
        { key: 'ESPACE', action: 'sauter' },
        { key: 'D', action: 'défi du jour' },
        { key: '1·2·3', action: 'difficulté' },
        { key: 'T', action: 'entraînement' },
        { key: 'H', action: 'hardcore' },
        { key: 'ESC', action: 'pause / retour' },
        { key: 'M', action: 'menu' },
        { key: 'S·K', action: 'scores · skins' },
    ];
}

/** Commandes complètes affichées dans le panneau OPTIONS. */
export function optionsControlsHint() {
    return optionsControlRows()
        .map(({ key, action }) => `${key} : ${action}`)
        .join(' · ');
}

export function optionsButtonLabel(_open) {
    return 'OPTS';
}

export function scoresButtonLabel(_open) {
    return 'SCORE';
}

export function skinsButtonLabel(_open) {
    return 'SKINS';
}

export function gameOverRestartLabel(isDaily) {
    return isDaily ? 'DÉFI' : 'ENCORE';
}

export function skinsCycleHint() {
    return isCoarsePointer() ? 'Tap une case pour choisir' : '← → : skin précédent / suivant';
}

export function skinsPanelHint() {
    return isCoarsePointer()
        ? 'Scores · hardcore · défi · entraînement · néon = collection'
        : 'Débloqués via scores, modes et collection';
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

/** @param {number} ms @param {number} [pipeIndex] */
export function hardcoreInvincibilityHintText(ms, pipeIndex = 1) {
    const suffix = pipeIndex > 0 ? ` · tuyau ${pipeIndex}` : ' · tuyau';
    return `Invincible ${ms} ms${suffix}`;
}

export function trainingTutorialText() {
    const scale = GAME_CONFIG.training.timeScale;
    const pct = Math.round(scale * 100);
    return isCoarsePointer()
        ? `Entraînement : ${pct} % vitesse,\nfantôme de ton meilleur run`
        : `Entraînement : chronomètre ×${scale},\nfantôme de ton meilleur run`;
}

export function hardcoreTutorialText() {
    return isCoarsePointer()
        ? 'Hardcore : invincible au 1er tuyau,\npuis moins longtemps à chaque tuyau'
        : 'Hardcore : invincible 700 ms au 1er tuyau,\npuis 625→375→325 ms (7 tuyaux)';
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
