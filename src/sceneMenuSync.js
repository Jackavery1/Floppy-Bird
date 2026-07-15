/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

import { GAME_STATE } from './gameState.js';
import { openMenuAccessibility } from './sceneA11ySync.js';
import { syncShellGameState } from './shellGameState.js';

/** Nettoie menu / pause / game over avant reconstruction du menu principal. */
export function prepareMenuForDisplay(scene) {
    scene.ui.prepareMenuRebuild();
}

/** Ferme les panneaux menu avant une nouvelle manche. */
export function closeMenuPanelsForRoundStart(scene) {
    scene.ui.closeAllMenuPanels({ force: true });
}

/** @param {SceneContext} scene */
export function openMainMenu(scene) {
    prepareMenuForDisplay(scene);
    scene.state = GAME_STATE.MENU;
    syncShellGameState(GAME_STATE.MENU);
    scene.playMode = 'classic';
    scene.dailyChallengeMode = false;
    scene.round.score = 0;

    const elements = scene.ui.showMenu(scene.difficulty, scene.trainingMode, scene.hardcoreMode);
    scene.ui.setOverlay('menu', elements);
    openMenuAccessibility(scene);
}
