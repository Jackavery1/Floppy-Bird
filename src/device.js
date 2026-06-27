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
