import { GAME_CONFIG } from './config.js';
import {
    GAME_STATE,
    canChangeDifficulty,
    canHandlePrimaryAction,
    canReturnToMenu,
    shouldStartGameOnPrimary,
} from './gameState.js';
import { Utils } from './utils.js';
import { saveTrainingEnabled } from './trainingStorage.js';
import {
    cancelPipeSpawnTimer,
    scheduleFirstPipe,
    clearSpawnInvincibility,
    startSpawnInvincibility,
} from './sceneRound.js';
import { applyTrainingTimeScale } from './sceneBootstrap.js';
import { requestJump } from './sceneJumpBuffer.js';

export function clearPauseElements(scene) {
    if (scene._pauseElements?.length) {
        scene._pauseElements.forEach(e => e?.destroy());
        scene._pauseElements = [];
    }
}

export function showMenu(scene) {
    clearPauseElements(scene);
    scene.state = GAME_STATE.MENU;
    scene.score = 0;
    Utils.clearElements(scene.menuElements);

    const elements = scene.ui.showMenu(scene.difficulty, scene.trainingMode);
    scene.menuElements.push(...elements);
}

export function beginRound(scene, { resetBird = false } = {}) {
    clearPauseElements(scene);
    cancelPipeSpawnTimer(scene);
    clearSpawnInvincibility(scene);
    scene._jumpBufferFrames = 0;
    scene._recordNotified = false;
    scene._isNewRecord = false;
    scene.state = GAME_STATE.PLAYING;
    scene.score = 0;

    if (resetBird) {
        scene.bird.reset(GAME_CONFIG.bird.startX, GAME_CONFIG.centerY);
    }

    scene.pipes.reset();
    scene.pipes.setDifficulty(scene.difficulty);
    scene.bird.applyDifficulty(GAME_CONFIG.getDifficulty(scene.difficulty));
    scene.ui.refreshHighScore(scene.difficulty);
    scene._roundHighScore = scene.ui.highScore;
    scene.ui.createScoreDisplay();
    scene.ui.createInGameControls({
        trainingMode: scene.trainingMode,
        onPause: () => scene.togglePause(),
    });
    startSpawnInvincibility(scene);
    scheduleFirstPipe(scene);
    applyTrainingTimeScale(scene);
    if (scene.trainingMode) {
        scene.ghost.beginRound();
    }
}

export function startGame(scene) {
    if (scene.state === GAME_STATE.MENU) {
        Utils.clearElements(scene.menuElements);
        beginRound(scene, { resetBird: true });
    } else if (scene.state === GAME_STATE.GAME_OVER) {
        Utils.clearElements(scene.gameOverElements);
        beginRound(scene, { resetBird: true });
    }
}

export function returnToMenu(scene) {
    if (!canReturnToMenu(scene.state)) return;
    cancelPipeSpawnTimer(scene);
    clearSpawnInvincibility(scene);
    scene._jumpBufferFrames = 0;
    clearPauseElements(scene);
    scene.ghost.finishRound(scene.score);
    if (scene.state === GAME_STATE.GAME_OVER) {
        Utils.clearElements(scene.gameOverElements);
    }
    scene.bird.reset(GAME_CONFIG.bird.startX, GAME_CONFIG.centerY);
    scene.pipes.reset();
    showMenu(scene);
}

export function togglePause(scene) {
    if (scene.state === GAME_STATE.PLAYING) {
        scene.state = GAME_STATE.PAUSED;
        const pauseUI = scene.ui.showPause({
            onResume: () => {
                if (scene.state === GAME_STATE.PAUSED) togglePause(scene);
            },
            onMenu: () => returnToMenu(scene),
        });
        scene._pauseElements = pauseUI.elements;
    } else if (scene.state === GAME_STATE.PAUSED) {
        scene.state = GAME_STATE.PLAYING;
        clearPauseElements(scene);
    }
}

export function handlePrimaryAction(scene) {
    if (scene.state === GAME_STATE.PAUSED) {
        togglePause(scene);
        requestJump(scene);
        return;
    }
    if (!canHandlePrimaryAction(scene.state)) return;

    if (shouldStartGameOnPrimary(scene.state)) {
        startGame(scene);
        requestJump(scene);
    } else if (scene.state === GAME_STATE.PLAYING) {
        requestJump(scene);
    }
}

export function changeDifficulty(scene, difficulty) {
    if (!canChangeDifficulty(scene.state)) return;
    scene.difficulty = difficulty;
    scene.ui.updateDifficultyButtons(difficulty);
}

export function toggleTraining(scene) {
    if (scene.state !== GAME_STATE.MENU) return;
    scene.trainingMode = !scene.trainingMode;
    saveTrainingEnabled(scene.trainingMode);
    applyTrainingTimeScale(scene);
    scene.ui.updateTrainingLabel(scene.trainingMode);
}
