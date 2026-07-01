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
        return isCoarsePointer()
            ? 'HARD ON'
            : 'HARDCORE : ON (grace 700→550 ms sur 3 tuyaux)';
    }
    return isCoarsePointer()
        ? 'HARD OFF · tap'
        : 'HARDCORE : OFF (H pour activer)';
}

export function dailyToggleLabel(enabled) {
    if (enabled) {
        return isCoarsePointer()
            ? 'DÉFI ON · tap'
            : 'DÉFI DU JOUR : ON (D pour aléatoire libre)';
    }
    return isCoarsePointer()
        ? 'DÉFI OFF · tap'
        : 'DÉFI DU JOUR : OFF (D pour séquence partagée)';
}

export function modesHintLine() {
    if (isCoarsePointer()) return `${difficultyHint()} · tap OPTIONS`;
    return `${trainingHint()} · ${hardcoreHint()} · D : défi · O : options`;
}

export function optionsButtonLabel(open, trainingMode, hardcoreMode, dailyChallengeMode = true) {
    const chevron = open ? '▾' : '▸';
    const ent = trainingMode ? 'Entr.ON' : 'Entr.OFF';
    const hard = hardcoreMode ? 'Hard.ON' : 'Hard.OFF';
    const daily = dailyChallengeMode ? 'Défi.ON' : 'Défi.OFF';
    return `${chevron} OPTIONS · ${ent} · ${hard} · ${daily}`;
}

export function optionsHint() {
    return isCoarsePointer() ? 'Tap OPTIONS' : 'O : options';
}

export function jumpTutorialText() {
    return isCoarsePointer() ? '↑  TAP pour sauter' : '↑  ESPACE pour sauter';
}
