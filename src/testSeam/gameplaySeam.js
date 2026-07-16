import { GAME_CONFIG } from '../config.js';
import { GAME_STATE } from '../gameState.js';
import { requestJump } from '../sceneJumpBuffer.js';
import { triggerDeath } from '../sceneDeath.js';
import { checkScorePipes } from '../sceneRound.js';
import { beginRound } from '../sceneBeginRound.js';
import { hideAccessibilityForRoundStart } from '../sceneA11ySync.js';
import { closeMenuPanelsForRoundStart } from '../sceneMenuSync.js';
import { createCoyoteSeamMethods } from './gameplaySeamCoyote.js';
import { createSurvivalSeamMethods } from './gameplaySeamSurvival.js';

/** @param {() => import('../sceneTypes.js').SceneContext | undefined} getScene */
export function createGameplaySeam(getScene) {
    return {
        getGameplayEquity: () => {
            const scene = getScene();
            if (!scene?.round) return null;
            return {
                jumpBufferFrames: scene.round.jumpBufferFrames,
                coyoteFrames: scene.round.coyoteFrames,
                spawnInvincible: scene.round.spawnInvincible,
                hardcoreMode: Boolean(scene.hardcoreMode),
                jumpBufferMax: GAME_CONFIG.bird.jumpBufferFrames,
                coyoteMax: GAME_CONFIG.bird.coyoteTimeFrames,
                spawnInvincibilityMs: scene.hardcoreMode
                    ? GAME_CONFIG.round.hardcoreSpawnInvincibilityMs
                    : GAME_CONFIG.round.spawnInvincibilityMs,
                pipeSpawnDelayMs: GAME_CONFIG.round.pipeSpawnDelayMs,
                hasCoyoteGrace: scene.round.coyoteFrames > 0,
            };
        },
        requestJump: () => {
            const scene = getScene();
            if (!scene) return;
            requestJump(scene);
        },
        holdBirdAtCenter: () => {
            const scene = getScene();
            if (!scene?.bird) return false;
            scene.bird.y = GAME_CONFIG.centerY;
            scene.bird.velocityY = 0;
            scene.bird.sprite?.setPosition?.(scene.bird.x, GAME_CONFIG.centerY);
            return true;
        },
        grantCoyoteGrace: (frames = GAME_CONFIG.bird.coyoteTimeFrames) => {
            const scene = getScene();
            if (!scene?.round) return;
            scene.round.coyoteFrames = frames;
        },
        getRoundScore: () => getScene()?.round?.score ?? null,
        triggerDeath: (cause = 'pipe') => {
            const scene = getScene();
            if (!scene) return;
            triggerDeath(scene, cause);
        },
        getPipeState: () => {
            const scene = getScene();
            if (!scene?.pipes) return null;
            const pipe = scene.pipes.topPipes?.[0];
            return {
                pipeCount: scene.pipes.topPipes?.length ?? 0,
                score: scene.round?.score ?? 0,
                birdX: scene.bird?.x ?? 0,
                firstPipeX: pipe?.x ?? null,
                pipeWidth: scene.pipes.pipeWidth,
            };
        },
        advancePipeForScore: () => {
            const scene = getScene();
            if (!scene?.pipes || !scene.bird || !scene.round) return null;
            let pipe = scene.pipes.topPipes.find((p) => !p.scored);
            if (!pipe) {
                scene.pipes.spawn();
                pipe = scene.pipes.topPipes.find((p) => !p.scored);
            }
            if (!pipe) return scene.round.score;
            const clearOffset =
                scene.bird.width / 2 - (scene.bird.getBounds().x - scene.bird.x) + 2;
            scene.bird.x = pipe.x + scene.pipes.pipeWidth / 2 + clearOffset;
            checkScorePipes(scene);
            return scene.round.score;
        },
        restartRoundWithModes: ({ hardcore = false, training = false } = {}) => {
            const scene = getScene();
            if (!scene) return null;
            scene.hardcoreMode = hardcore;
            scene.trainingMode = training;
            if (training && scene.trainingTimeScale == null) {
                scene.trainingTimeScale = GAME_CONFIG.training.timeScale;
            }
            scene.playMode = 'classic';
            scene.dailyChallengeMode = false;
            if (scene.state === GAME_STATE.MENU || scene.state === GAME_STATE.GAME_OVER) {
                hideAccessibilityForRoundStart();
                closeMenuPanelsForRoundStart(scene);
                scene.ui.clearOverlay('menu');
                scene.ui.clearOverlay('gameOver');
            }
            beginRound(scene, { resetBird: true });
            return {
                hardcoreMode: Boolean(scene.hardcoreMode),
                trainingMode: Boolean(scene.trainingMode),
                spawnInvincible: scene.round.spawnInvincible,
                spawnInvincibilityMs: scene.hardcoreMode
                    ? GAME_CONFIG.round.hardcoreSpawnInvincibilityMs
                    : GAME_CONFIG.round.spawnInvincibilityMs,
            };
        },
        ...createCoyoteSeamMethods(getScene),
        ...createSurvivalSeamMethods(getScene),
    };
}
