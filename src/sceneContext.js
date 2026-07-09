import { GAME_STATE } from './gameState.js';
import { createRoundState } from './roundState.js';
import { createSceneModesState } from './sceneModes.js';
import { syncShellGameState } from './shellGameState.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/**
 * Initialise tous les champs {@link SceneContext} sur une instance GameScene.
 * Point unique pour l'état de la scène avant `create()`.
 * @param {SceneContext} scene
 */
export function initSceneCore(scene) {
    scene.bird = null;
    scene.pipes = null;
    scene.ui = null;
    scene.scoreEffects = null;
    scene.ghost = null;

    scene.round = createRoundState();
    scene.state = GAME_STATE.MENU;
    syncShellGameState(GAME_STATE.MENU);
    Object.assign(scene, createSceneModesState());

    scene._clouds = [];
    scene._groundSprite = null;
    scene.fps = null;
    scene.achievementNotifier = undefined;
}
