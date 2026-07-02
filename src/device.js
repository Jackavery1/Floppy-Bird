export function isCoarsePointer() {
    if (typeof matchMedia === 'undefined') return false;
    if (matchMedia('(hover: none) and (pointer: coarse)').matches) return true;
    return matchMedia('(any-pointer: coarse)').matches
        && !matchMedia('(pointer: fine)').matches;
}

export function jumpHint() {
    return isCoarsePointer() ? 'TAP : sauter' : 'ESPACE : sauter';
}

export function restartHint() {
    return isCoarsePointer() ? 'TAP : rejouer' : 'ESPACE : rejouer';
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
    return isCoarsePointer()
        ? '⬜ ENTR. OFF · tap'
        : '⬜ ENTRAÎNEMENT : OFF (T pour activer)';
}

export function hardcoreHint() {
    return isCoarsePointer() ? 'Tap : hardcore' : 'H : hardcore';
}

export function hardcoreToggleLabel(enabled, unlocked = true) {
    if (!unlocked) {
        return isCoarsePointer()
            ? '🔒 HARD · score ≥ 10'
            : '🔒 HARDCORE : score ≥ 10 requis';
    }
    if (enabled) {
        return isCoarsePointer()
            ? '🟥 HARD ON'
            : '🟥 HARDCORE : ON (grace 700→550 ms sur 3 tuyaux)';
    }
    return isCoarsePointer()
        ? '⬜ HARD OFF · tap'
        : '⬜ HARDCORE : OFF (H pour activer)';
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

export function optionsHint() {
    return isCoarsePointer() ? 'Scores · Options · Skins' : 'S scores · O options · K skins';
}

export function jumpTutorialText() {
    return isCoarsePointer() ? '↑  TAP pour sauter' : '↑  ESPACE pour sauter';
}

export function classicModeHint() {
    return isCoarsePointer()
        ? 'Classique : aléatoire selon difficulté'
        : 'Classique : gaps aléatoires';
}
