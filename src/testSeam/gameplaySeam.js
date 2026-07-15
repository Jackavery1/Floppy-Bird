import { GAME_CONFIG } from '../config.js';
import { GAME_STATE } from '../gameState.js';
import { requestJump } from '../sceneJumpBuffer.js';
import { triggerDeath } from '../sceneDeath.js';
import { checkScorePipes, tickPipeSpawnFallback } from '../sceneRound.js';
import { checkCollisions } from '../sceneBootstrap.js';
import { beginRound } from '../sceneBeginRound.js';
import { hasCoyoteGrace, updateCoyoteTime } from '../sceneCoyote.js';
import { hideAccessibilityForRoundStart } from '../sceneA11ySync.js';
import { closeMenuPanelsForRoundStart } from '../sceneMenuSync.js';

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
                spawnInvincible: scene.round.spawnInvincible,
                spawnInvincibilityMs: scene.hardcoreMode
                    ? GAME_CONFIG.round.hardcoreSpawnInvincibilityMs
                    : GAME_CONFIG.round.spawnInvincibilityMs,
            };
        },
        runCoyoteGapExitScenario: () => {
            const scene = getScene();
            if (!scene?.pipes || !scene.bird || !scene.round) return null;

            scene.round.spawnInvincible = false;

            if (!scene.pipes.topPipes.length) {
                scene.pipes.spawn();
            }

            const top = scene.pipes.topPipes[0];
            const bottom = scene.pipes.bottomPipes[0];
            const pipeX = scene.bird.x + 24;
            top.x = pipeX;
            bottom.x = pipeX;

            const gapMidY = (top.y + bottom.y) / 2;
            scene.bird.x = pipeX;
            scene.bird.y = gapMidY;
            scene.bird.sprite?.setPosition?.(pipeX, gapMidY);

            updateCoyoteTime(scene, 1);
            const coyoteInGap = scene.round.coyoteFrames;

            scene.bird.y = top.y - 2;
            scene.bird.sprite?.setPosition?.(pipeX, top.y - 2);
            updateCoyoteTime(scene, 1);

            const collidesAfterExit = scene.pipes.checkCollisionWithBird(scene.bird.getBounds());
            const hasCoyoteAfterExit = hasCoyoteGrace(scene);

            let deathDuringCoyote = false;
            const originalDeath = scene.triggerDeath;
            scene.triggerDeath = () => {
                deathDuringCoyote = true;
            };
            checkCollisions(scene);
            scene.triggerDeath = originalDeath;

            while (scene.round.coyoteFrames > 0) {
                updateCoyoteTime(scene, 1);
            }

            let deathAfterCoyote = false;
            scene.triggerDeath = () => {
                deathAfterCoyote = true;
            };
            checkCollisions(scene);
            scene.triggerDeath = originalDeath;

            return {
                coyoteInGap,
                collidesAfterExit,
                hasCoyoteAfterExit,
                noDeathDuringCoyote: !deathDuringCoyote,
                coyoteExpired: scene.round.coyoteFrames === 0,
                deathAfterCoyoteExpired: deathAfterCoyote,
            };
        },
        advancePipeSpawnWait: (deltaMs = GAME_CONFIG.round.pipeSpawnDelayMs) => {
            const scene = getScene();
            if (!scene?.pipes) return null;
            tickPipeSpawnFallback(scene, deltaMs);
            if (scene.pipes.topPipes.length === 0 && scene.state === GAME_STATE.PLAYING) {
                scene.pipes.spawn();
            }
            return {
                pipeCount: scene.pipes.topPipes?.length ?? 0,
                waitMs: scene.round._pipeSpawnWaitMs ?? 0,
            };
        },
        alignBirdInFirstGap: () => {
            const scene = getScene();
            if (!scene?.pipes?.topPipes?.length || !scene.bird) return null;
            const top = scene.pipes.topPipes[0];
            const bottom = scene.pipes.bottomPipes[0];
            if (!bottom) return null;
            const gapMidY = (top.y + bottom.y) / 2;
            scene.bird.y = gapMidY;
            scene.bird.velocityY = 0;
            scene.bird.sprite?.setPosition?.(scene.bird.x, gapMidY);
            return {
                gapMidY,
                pipeX: top.x,
                score: scene.round?.score ?? 0,
            };
        },
        tickSurvivalAssist: () => {
            const scene = getScene();
            if (!scene?.bird || scene.state !== GAME_STATE.PLAYING) return null;

            scene.bird.velocityY = 0;
            scene.round.coyoteFrames = GAME_CONFIG.bird.coyoteTimeFrames;

            const halfH = GAME_CONFIG.bird.height / 2;
            const minY = halfH + 2;
            const maxY = GAME_CONFIG.groundY - halfH - 2;

            if (scene.round.spawnInvincible) {
                scene.bird.y = GAME_CONFIG.centerY;
            } else {
                const topPipes = scene.pipes?.topPipes ?? [];
                const bottomPipes = scene.pipes?.bottomPipes ?? [];
                let aligned = false;

                for (let i = 0; i < topPipes.length; i++) {
                    const top = topPipes[i];
                    const bottom = bottomPipes[i];
                    if (!top || !bottom) continue;
                    if (top.x + scene.pipes.pipeWidth < scene.bird.x - scene.bird.width) continue;
                    scene.bird.y = (top.y + bottom.y) / 2;
                    const targetX = top.x + scene.pipes.pipeWidth / 2 + scene.bird.width * 0.5;
                    if (scene.bird.x < targetX) {
                        scene.bird.x = targetX;
                    }
                    aligned = true;
                    break;
                }

                if (!aligned) {
                    scene.bird.y = GAME_CONFIG.centerY;
                }
            }

            scene.bird.y = Math.max(minY, Math.min(maxY, scene.bird.y));
            scene.bird.sprite?.setPosition?.(scene.bird.x, scene.bird.y);
            checkScorePipes(scene);
            return { score: scene.round.score };
        },
        runSurvivalScenario: (durationMs = 30_000) => {
            const scene = getScene();
            if (!scene?.bird) return Promise.resolve(null);

            const assist = () => {
                if (!scene.bird || scene.state !== GAME_STATE.PLAYING) return;

                scene.bird.velocityY = 0;
                scene.round.coyoteFrames = GAME_CONFIG.bird.coyoteTimeFrames;

                const halfH = GAME_CONFIG.bird.height / 2;
                const minY = halfH + 2;
                const maxY = GAME_CONFIG.groundY - halfH - 2;

                if (scene.round.spawnInvincible) {
                    scene.bird.y = GAME_CONFIG.centerY;
                } else {
                    const topPipes = scene.pipes?.topPipes ?? [];
                    const bottomPipes = scene.pipes?.bottomPipes ?? [];
                    let aligned = false;

                    for (let i = 0; i < topPipes.length; i++) {
                        const top = topPipes[i];
                        const bottom = bottomPipes[i];
                        if (!top || !bottom) continue;
                        if (top.x + scene.pipes.pipeWidth < scene.bird.x - scene.bird.width) {
                            continue;
                        }
                        scene.bird.y = (top.y + bottom.y) / 2;
                        const targetX = top.x + scene.pipes.pipeWidth / 2 + scene.bird.width * 0.5;
                        if (scene.bird.x < targetX) {
                            scene.bird.x = targetX;
                        }
                        aligned = true;
                        break;
                    }

                    if (!aligned) {
                        scene.bird.y = GAME_CONFIG.centerY;
                    }
                }

                scene.bird.y = Math.max(minY, Math.min(maxY, scene.bird.y));
                scene.bird.sprite?.setPosition?.(scene.bird.x, scene.bird.y);
                checkScorePipes(scene);
            };

            return new Promise((resolve) => {
                const started = scene.time.now;
                const tick = () => {
                    if (
                        scene.state !== GAME_STATE.PLAYING ||
                        scene.time.now - started >= durationMs
                    ) {
                        resolve({ score: scene.round?.score ?? 0, state: scene.state });
                        return;
                    }
                    assist();
                    scene.time.delayedCall(50, tick);
                };
                tick();
            });
        },
    };
}
