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

export function menuHint() {
    return isCoarsePointer() ? 'Bouton MENU ci-dessous' : 'M : menu';
}

export function firstRunMenuHintText() {
    return isCoarsePointer()
        ? 'Première partie : TAP pour démarrer et sauter'
        : 'Première partie : ESPACE pour démarrer et sauter';
}

/** @param {'easy' | 'normal' | 'hard'} level */
export function difficultyA11yLabel(level) {
    const names = { easy: 'facile', normal: 'normale', hard: 'difficile' };
    const keys = { easy: '1', normal: '2', hard: '3' };
    const base = `Difficulté ${names[level]}`;
    if (isCoarsePointer()) return base;
    return `${base} — touche ${keys[level]}`;
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
        return isCoarsePointer() ? '🟥 HARD ON' : '🟥 HARDCORE : ON';
    }
    return isCoarsePointer() ? '⬜ HARD OFF' : '⬜ HARDCORE : OFF';
}

export function dailyChallengeHint() {
    return isCoarsePointer() ? 'Tap Défi du jour' : 'D : défi du jour';
}

export function skipTutorialHint() {
    return isCoarsePointer() ? 'TAP : passer' : 'P : passer';
}

/** Commandes structurées pour le panneau OPTIONS (onglet Contrôles). */
export function optionsControlRows() {
    if (isCoarsePointer()) {
        return [
            { key: 'TAP', action: 'sauter' },
            { key: 'DÉFI', action: 'défi du jour' },
            { key: '1·2·3', action: 'difficulté' },
            { key: 'ENTR.', action: 'entraînement' },
            { key: 'VIT.', action: 'vitesse entraînement' },
            { key: 'HARD', action: 'hardcore' },
            { key: '···', action: 'scores · skins · options' },
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

export function optionsButtonLabel(_open) {
    return 'OPTS';
}

export function optionsAccessibilityLabel() {
    return isCoarsePointer() ? 'Options' : 'Options — touche S ou O';
}

export function scoresButtonLabel(_open) {
    return 'SCORE';
}

export function skinsButtonLabel(_open) {
    return 'SKINS';
}

export function gameOverRestartLabel(_isDaily) {
    return 'REJOUER';
}

export function skinsCycleHint() {
    return isCoarsePointer() ? 'Tap une case pour choisir' : '← → : skin précédent / suivant';
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

export function trainingSpeedLabel(scale) {
    const pct = Math.round(scale * 100);
    return isCoarsePointer()
        ? `Vitesse entraîn. : ${pct} %`
        : `VITESSE ENTRAÎNEMENT : ${pct} % (tap)`;
}

export function trainingTutorialText(scale = GAME_CONFIG.training.timeScale) {
    const pct = Math.round(scale * 100);
    return isCoarsePointer()
        ? `Entraînement : ${pct} % vitesse,\nfantôme de ton meilleur run`
        : `Entraînement : chronomètre ×${scale},\nfantôme de ton meilleur run`;
}

export function hardcoreTutorialText() {
    return isCoarsePointer()
        ? 'Hardcore : plus difficile,\nTOP hardcore séparé'
        : 'Hardcore : gravité et vitesse renforcées,\nTOP hardcore séparé';
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
