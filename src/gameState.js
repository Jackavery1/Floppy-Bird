export const GAME_STATE = Object.freeze({
    MENU: 'menu',
    PLAYING: 'playing',
    DYING: 'dying',
    PAUSED: 'paused',
    GAME_OVER: 'gameover',
});

export function canHandlePrimaryAction(state) {
    return state !== GAME_STATE.PAUSED && state !== GAME_STATE.DYING;
}

export function shouldStartGameOnPrimary(state) {
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
