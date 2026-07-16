import { GAME_CONFIG } from '../config.js';
import { GAME_STATE } from '../gameState.js';
import { checkScorePipes } from '../sceneRound.js';

/** @param {() => import('../sceneTypes.js').SceneContext | undefined} getScene */
export function createSurvivalSeamMethods(getScene) {
    return {
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
