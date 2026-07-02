import { DIFFICULTY } from './config.js';
import { GAME_STATE, canReturnToMenu, canTogglePause } from './gameState.js';
import { resumeAudio } from './audio.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** @param {SceneContext} scene */
export function setupSceneInput(scene) {
    scene.input.keyboard.on('keydown-SPACE', () => scene.handlePrimaryAction());

    scene.input.on('pointerdown', (pointer) => {
        resumeAudio();
        const hits = scene.input.hitTestPointer(pointer);
        if (hits.some(obj => obj.input?.enabled)) return;
        scene.handlePrimaryAction();
    });

    scene.input.keyboard.on('keydown-ESC', () => {
        if (canTogglePause(scene.state)) scene.togglePause();
    });

    scene.input.keyboard.on('keydown-M', () => {
        if (canReturnToMenu(scene.state)) scene.returnToMenu();
    });

    scene.input.keyboard.on('keydown-ONE',   () => scene.changeDifficulty(DIFFICULTY.EASY));
    scene.input.keyboard.on('keydown-TWO',   () => scene.changeDifficulty(DIFFICULTY.NORMAL));
    scene.input.keyboard.on('keydown-THREE', () => scene.changeDifficulty(DIFFICULTY.HARD));
    scene.input.keyboard.on('keydown-T', () => scene.toggleTraining());
    scene.input.keyboard.on('keydown-H', () => scene.toggleHardcore());
    scene.input.keyboard.on('keydown-D', () => {
        if (scene.state === GAME_STATE.MENU || scene.state === GAME_STATE.GAME_OVER) {
            scene.launchDailyChallenge();
        }
    });
    scene.input.keyboard.on('keydown-O', () => {
        if (scene.state === GAME_STATE.MENU) scene.ui.toggleMenuOptionsPanel();
    });
    scene.input.keyboard.on('keydown-S', () => {
        if (scene.state === GAME_STATE.MENU) scene.ui.toggleMenuScoresPanel();
    });
    scene.input.keyboard.on('keydown-K', () => {
        if (scene.state === GAME_STATE.MENU) scene.ui.toggleMenuSkinsPanel();
    });
}
