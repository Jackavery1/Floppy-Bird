import { GAME_CONFIG } from './config.js';
import {
    GAME_STATE,
    canChangeDifficulty,
    canHandlePrimaryAction,
    canReturnToMenu,
    shouldStartGameOnPrimary,
} from './gameState.js';
import { toggleTrainingMode, toggleHardcoreMode } from './sceneModeSettings.js';
import { saveTrainingEnabled } from './trainingStorage.js';
import { saveHardcoreEnabled } from './hardcoreStorage.js';
import { cancelPipeSpawnTimer, clearSpawnInvincibility } from './sceneRound.js';
import { resetCoyoteTime } from './sceneCoyote.js';
import { requestJump } from './sceneJumpBuffer.js';
import { beginRound } from './sceneBeginRound.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** @param {SceneContext} scene */
function clearPauseOverlay(scene) {
    scene.ui.clearOverlay('pause');
}

/** @param {SceneContext} scene */
export function showMenu(scene) {
    clearPauseOverlay(scene);
    scene.state = GAME_STATE.MENU;
    scene.playMode = 'classic';
    scene.dailyChallengeMode = false;
    scene.round.score = 0;
    scene.ui.clearOverlay('menu');

    const elements = scene.ui.showMenu(scene.difficulty, scene.trainingMode, scene.hardcoreMode);
    scene.ui.setOverlay('menu', elements);
}

/** @param {SceneContext} scene */
export function startGame(scene) {
    scene.playMode = 'classic';
    scene.dailyChallengeMode = false;
    if (scene.state === GAME_STATE.MENU) {
        scene.ui.clearOverlay('menu');
        beginRound(scene, { resetBird: true });
    } else if (scene.state === GAME_STATE.GAME_OVER) {
        scene.ui.clearOverlay('gameOver');
        beginRound(scene, { resetBird: true });
    }
}

/** @param {SceneContext} scene */
export function startDailyChallenge(scene) {
    if (scene.state !== GAME_STATE.MENU && scene.state !== GAME_STATE.GAME_OVER) return;
    scene.playMode = 'daily';
    scene.dailyChallengeMode = true;
    scene.trainingMode = false;
    saveTrainingEnabled(false);
    scene.hardcoreMode = false;
    saveHardcoreEnabled(false);
    if (scene.state === GAME_STATE.MENU) {
        scene.ui.clearOverlay('menu');
    } else {
        scene.ui.clearOverlay('gameOver');
    }
    beginRound(scene, { resetBird: true });
}

/** @param {SceneContext} scene */
export function returnToMenu(scene) {
    if (!canReturnToMenu(scene.state)) return;
    scene.time.paused = false;
    cancelPipeSpawnTimer(scene);
    clearSpawnInvincibility(scene);
    scene.round.jumpBufferFrames = 0;
    resetCoyoteTime(scene);
    clearPauseOverlay(scene);
    scene.ghost.finishRound(scene.round.score);
    if (scene.state === GAME_STATE.GAME_OVER) {
        scene.ui.clearOverlay('gameOver');
    }
    scene.bird.reset(GAME_CONFIG.bird.startX, GAME_CONFIG.centerY);
    scene.pipes.reset();
    showMenu(scene);
}

/** @param {SceneContext} scene */
export function togglePause(scene) {
    if (scene.state === GAME_STATE.PLAYING) {
        scene.state = GAME_STATE.PAUSED;
        scene.time.paused = true;
        const pauseUI = scene.ui.showPause({
            onResume: () => {
                if (scene.state === GAME_STATE.PAUSED) togglePause(scene);
            },
            onMenu: () => returnToMenu(scene),
        });
        scene.ui.setOverlay('pause', pauseUI.elements);
    } else if (scene.state === GAME_STATE.PAUSED) {
        scene.state = GAME_STATE.PLAYING;
        scene.time.paused = false;
        clearPauseOverlay(scene);
    }
}

/** @param {SceneContext} scene */
function restartFromPrimary(scene) {
    if (scene.state === GAME_STATE.GAME_OVER && scene.playMode === 'daily') {
        startDailyChallenge(scene);
        return;
    }
    startGame(scene);
}

/** @param {SceneContext} scene */
export function handlePrimaryAction(scene) {
    if (scene.state === GAME_STATE.PAUSED) {
        togglePause(scene);
        return;
    }
    if (!canHandlePrimaryAction(scene.state)) return;

    if (shouldStartGameOnPrimary(scene.state)) {
        restartFromPrimary(scene);
        requestJump(scene);
    } else if (scene.state === GAME_STATE.PLAYING) {
        requestJump(scene);
    }
}

/** @param {SceneContext} scene */
export function changeDifficulty(scene, difficulty) {
    if (!canChangeDifficulty(scene.state)) return;
    scene.difficulty = difficulty;
    scene.ui.updateDifficultyButtons(difficulty);
}

/** @param {SceneContext} scene */
export function toggleTraining(scene) {
    if (scene.state !== GAME_STATE.MENU) return;
    toggleTrainingMode(scene);
}

/** @param {SceneContext} scene */
export function toggleHardcore(scene) {
    if (scene.state !== GAME_STATE.MENU) return;
    toggleHardcoreMode(scene);
}

/** @param {SceneContext} scene */
export function launchDailyChallenge(scene) {
    if (scene.state !== GAME_STATE.MENU && scene.state !== GAME_STATE.GAME_OVER) return;
    startDailyChallenge(scene);
}
