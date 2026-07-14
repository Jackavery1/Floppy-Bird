import {
    announceAccessibility,
    hideAllAccessibilityControls,
    setAccessibilityControlVisible,
    setupMenuAccessibility,
    syncAccessibilityLayer,
} from './uiDomAccessibility.js';
import { setOptionsPanelAccessibility } from './uiDomAccessibilityFlows.js';
import { PLAYING_CONTROL_KEYS, PAUSE_OVERLAY_CONTROL_KEYS } from './uiDomAccessibilityDefs.js';
import { deathCauseLabel } from './device.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** @param {SceneContext} scene */
export function openMenuAccessibility(scene) {
    hideAllAccessibilityControls();
    setOptionsPanelAccessibility(scene, false);
    setupMenuAccessibility(scene);
    announceAccessibility('Menu principal');
}

export function hideAccessibilityForRoundStart() {
    hideAllAccessibilityControls();
}

/** @param {SceneContext} scene */
export function announceRoundStarted(scene) {
    let mode = 'classique';
    if (scene.trainingMode) mode = 'entraînement';
    else if (scene.dailyChallengeMode) mode = 'défi du jour';
    else if (scene.hardcoreMode) mode = 'hardcore';
    announceAccessibility(`Partie démarrée. Mode ${mode}.`);
}

/** @param {'pipe' | 'ground' | 'ceiling'} [cause] */
export function announceDeathStarted(cause = 'pipe') {
    const label = deathCauseLabel(cause);
    announceAccessibility(label ? `Mort : ${label}.` : 'Mort.');
}

/** @param {import('phaser').Game | null | undefined} game */
function syncPlayingControls(game) {
    setAccessibilityControlVisible('pause', true);
    for (const key of PLAYING_CONTROL_KEYS) {
        if (key !== 'pause') setAccessibilityControlVisible(key, true);
    }
    syncAccessibilityLayer(game);
}

/** @param {import('phaser').Game | null | undefined} game */
function syncPausedControls(game) {
    setAccessibilityControlVisible('pause', false);
    for (const key of PLAYING_CONTROL_KEYS) {
        if (key !== 'pause') setAccessibilityControlVisible(key, false);
    }
    for (const key of PAUSE_OVERLAY_CONTROL_KEYS) {
        setAccessibilityControlVisible(key, true);
    }
    syncAccessibilityLayer(game);
}

/** @param {SceneContext} scene */
export function enterPauseAccessibility(scene) {
    syncPausedControls(scene.game);
    announceAccessibility('Partie en pause');
}

/** @param {SceneContext} scene */
export function exitPauseAccessibility(scene) {
    syncPlayingControls(scene.game);
    announceAccessibility('Partie reprise');
}
