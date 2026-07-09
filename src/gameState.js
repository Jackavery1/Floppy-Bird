/** Constantes d'état de la scène et du traitement des entrées */
export const GAME_STATE = Object.freeze({
    MENU: 'menu', // Écran menu principal
    PLAYING: 'playing', // Partie en cours
    DYING: 'dying', // Animation de mort
    PAUSED: 'paused', // Pause joueur
    GAME_OVER: 'gameover', // Écran game over
});

/** Le joueur peut-il agir (espace/tap) dans cet état ? */
export function canHandlePrimaryAction(state) {
    return state !== GAME_STATE.PAUSED && state !== GAME_STATE.DYING;
}

/** Un panneau secondaire du menu bloque le lancement par tap/espace. */
export function isMenuPanelOpen(ui) {
    return Boolean(ui?._optionsOpen || ui?._scoresOpen || ui?._skinsOpen);
}

/** Faut-il démarrer une partie sur l'action primaire ? */
export function shouldStartGameOnPrimary(state, ui = null) {
    if (state === GAME_STATE.MENU && isMenuPanelOpen(ui)) return false;
    return state === GAME_STATE.MENU || state === GAME_STATE.GAME_OVER;
}

export function canChangeDifficulty(state) {
    return state === GAME_STATE.MENU;
}

export function canTogglePause(state) {
    return state === GAME_STATE.PLAYING || state === GAME_STATE.PAUSED;
}

export function canReturnToMenu(state) {
    return state === GAME_STATE.GAME_OVER || state === GAME_STATE.PAUSED;
}

export function shouldUpdateGameplay(state) {
    return state === GAME_STATE.PLAYING;
}

export function shouldUpdateDying(state) {
    return state === GAME_STATE.DYING;
}

export function canTriggerDeath(state) {
    return state !== GAME_STATE.GAME_OVER && state !== GAME_STATE.DYING;
}

export function shouldScrollGround(state) {
    return state === GAME_STATE.PLAYING;
}

export function shouldAnimateBackground(state) {
    return state === GAME_STATE.MENU || state === GAME_STATE.PLAYING;
}
