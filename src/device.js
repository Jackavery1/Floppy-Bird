export function isCoarsePointer() {
    if (typeof matchMedia === 'undefined') return false;
    return matchMedia('(pointer: coarse)').matches;
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
        return isCoarsePointer() ? 'ENTR. ON' : 'ENTRAÎNEMENT : ON (ralenti + fantôme)';
    }
    return isCoarsePointer()
        ? 'ENTR. OFF · tap'
        : 'ENTRAÎNEMENT : OFF (T pour activer)';
}

export function hardcoreHint() {
    return isCoarsePointer() ? 'Tap : hardcore' : 'H : hardcore';
}

export function hardcoreToggleLabel(enabled) {
    if (enabled) {
        return isCoarsePointer() ? 'HARD ON' : 'HARDCORE : ON (sans invincibilité)';
    }
    return isCoarsePointer()
        ? 'HARD OFF · tap'
        : 'HARDCORE : OFF (H pour activer)';
}

export function modesHintLine() {
    if (isCoarsePointer()) return `${difficultyHint()} · tap MODES (exclusifs)`;
    return `${difficultyHint()} · ${trainingHint()} · ${hardcoreHint()} (exclusifs)`;
}

export function jumpTutorialText() {
    return isCoarsePointer() ? '↑  TAP pour sauter' : '↑  ESPACE pour sauter';
}
