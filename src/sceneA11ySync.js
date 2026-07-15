import {
    announceAccessibility,
    hideAllAccessibilityControls,
    setAccessibilityControlVisible,
} from './uiDomAccessibilityControls.js';
import { setupGameOverAccessibility, setupMenuAccessibility } from './uiDomAccessibilityFlows.js';
import { setOptionsPanelAccessibility } from './uiDomAccessibilityPanelFlows.js';
import { syncAccessibilityLayer } from './uiDomAccessibilityLayer.js';
import { PLAYING_CONTROL_KEYS, PAUSE_OVERLAY_CONTROL_KEYS } from './uiDomAccessibilityDefs.js';
import { deathCauseLabel, firstRunMenuHintText } from './device.js';
import { loadRoundsStarted, loadTutorialComplete } from './tutorialStorage.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** @param {SceneContext} scene */
export function openMenuAccessibility(scene) {
    hideAllAccessibilityControls();
    setOptionsPanelAccessibility(scene, false);
    setupMenuAccessibility(scene);
    const firstRun = !loadTutorialComplete() && loadRoundsStarted() === 0;
    announceAccessibility(
        firstRun ? `Menu principal. ${firstRunMenuHintText()}` : 'Menu principal'
    );
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

/** @param {'pipe' | 'ground' | 'ceiling'} [cause] @param {number} [score] */
export function announceDeathStarted(cause = 'pipe', score = 0) {
    const label = deathCauseLabel(cause);
    const causePart = label ? `Mort : ${label}.` : 'Mort.';
    if (score > 0) {
        announceAccessibility(`${causePart} Score ${score}.`);
        return;
    }
    announceAccessibility(causePart);
}

/** @param {number} score */
export function announceScoreReached(score) {
    if (score <= 0) return;
    announceAccessibility(`Score ${score}`);
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
    hideAllAccessibilityControls();
    syncPausedControls(scene.game);
    announceAccessibility('Partie en pause');
}

/** @param {SceneContext} scene */
export function exitPauseAccessibility(scene) {
    hideAllAccessibilityControls();
    syncPlayingControls(scene.game);
    announceAccessibility('Partie reprise');
}

/** @param {SceneContext} scene @param {{ score: number, isDaily?: boolean }} opts */
export function openGameOverAccessibility(scene, opts) {
    setupGameOverAccessibility(scene, opts);
}
