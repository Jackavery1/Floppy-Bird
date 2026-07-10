import { GAME_CONFIG } from '../config.js';
import { requestJump } from '../sceneJumpBuffer.js';
import { triggerDeath } from '../sceneDeath.js';
import { checkScorePipes } from '../sceneRound.js';

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
                jumpBufferMax: GAME_CONFIG.bird.jumpBufferFrames,
                coyoteMax: GAME_CONFIG.bird.coyoteTimeFrames,
                spawnInvincibilityMs: GAME_CONFIG.round.spawnInvincibilityMs,
                pipeSpawnDelayMs: GAME_CONFIG.round.pipeSpawnDelayMs,
                hasCoyoteGrace: scene.round.coyoteFrames > 0,
            };
        },
        requestJump: () => {
            const scene = getScene();
            if (!scene) return;
            requestJump(scene);
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
            scene.bird.x = pipe.x + scene.pipes.pipeWidth / 2 + 2;
            checkScorePipes(scene);
            return scene.round.score;
        },
    };
}
