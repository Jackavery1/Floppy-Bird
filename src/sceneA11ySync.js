import {
    announceAccessibility,
    hideAllAccessibilityControls,
    setAccessibilityControlVisible,
} from './ui/a11y/uiDomAccessibilityControls.js';
import {
    setupGameOverAccessibility,
    setupMenuAccessibility,
} from './ui/a11y/uiDomAccessibilityFlows.js';
import { setOptionsPanelAccessibility } from './ui/a11y/uiDomAccessibilityPanelFlows.js';
import {
    syncAccessibilityLayer,
    syncAndFocusAccessibilityLayer,
} from './ui/a11y/uiDomAccessibilityLayer.js';
import {
    PLAYING_CONTROL_KEYS,
    PAUSE_OVERLAY_CONTROL_KEYS,
} from './ui/a11y/uiDomAccessibilityDefs.js';
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

/**
 * Réactive les contrôles de jeu après pause.
 * `playTutorialSkip` seulement si le hit Phaser skip est encore monté.
 * @param {SceneContext} scene
 */
function syncPlayingControls(scene) {
    setAccessibilityControlVisible('pause', true);
    setAccessibilityControlVisible('playJump', true);
    setAccessibilityControlVisible('playTutorialSkip', Boolean(scene.ui?._tutorialSkipHit));
    syncAccessibilityLayer(scene.game);
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
    syncAndFocusAccessibilityLayer(game);
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
    syncPlayingControls(scene);
    announceAccessibility('Partie reprise');
}

/** @param {SceneContext} scene @param {{ score: number, isDaily?: boolean }} opts */
export function openGameOverAccessibility(scene, opts) {
    setupGameOverAccessibility(scene, opts);
}
