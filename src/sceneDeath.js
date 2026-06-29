import { GAME_CONFIG, SOUND } from './config.js';
import { GAME_STATE, canTriggerDeath } from './gameState.js';
import { playSound } from './audio.js';
import { hapticMedium } from './haptics.js';
import { frameStep } from './sceneBootstrap.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** @param {SceneContext} scene */
export function triggerDeath(scene) {
    if (!canTriggerDeath(scene.state)) return;
    scene.state = GAME_STATE.DYING;
    scene._dyingFalling = false;
    scene._dyingGrounded = false;

    playSound(SOUND.GAME_OVER);
    hapticMedium();
    scene.ui.hideInGameScore();
    scene.cameras.main.shake(200, 0.015);
    scene.ui.showFlash();
    scene.ghost.finishRound(scene.score);

    if (!scene.trainingMode) {
        scene._isNewRecord = scene.score > 0 && scene.score > scene._roundHighScore;
        scene.ui.saveHighScore(scene.score, scene.difficulty);
        scene._leaderboardData = scene.ui.saveToLeaderboard(scene.score, scene.difficulty);
    } else {
        scene._isNewRecord = false;
        scene._leaderboardData = { entries: [], highlightId: null };
    }

    scene.time.delayedCall(166, () => {
        if (scene.state === GAME_STATE.DYING) {
            scene._dyingFalling = true;
        }
    });
}

/** @param {SceneContext} scene */
export function updateDying(scene) {
    if (!scene._dyingFalling || scene._dyingGrounded) return;

    const step = frameStep(scene);
    scene.bird.applyFall(step, 'death');

    if (scene.bird.y + GAME_CONFIG.bird.height / 2 >= GAME_CONFIG.groundY) {
        scene.bird.y = GAME_CONFIG.groundY - GAME_CONFIG.bird.height / 2;
        scene.bird.sprite.setPosition(scene.bird.x, scene.bird.y);
        scene._dyingGrounded = true;
        finishDying(scene);
    }
}

function finishDying(scene) {
    playSound(SOUND.GROUND);
    scene.state = GAME_STATE.GAME_OVER;
    const { elements } = scene.ui.showGameOver(
        scene.score,
        scene._leaderboardData,
        true,
        scene._isNewRecord,
    );
    scene.gameOverElements.push(...elements);
}
