import { GAME_CONFIG } from '../config.js';
import { GAME_STATE } from '../gameState.js';
import { tickPipeSpawnFallback } from '../sceneRound.js';
import { checkCollisions } from '../sceneBootstrap.js';
import { hasCoyoteGrace, updateCoyoteTime } from '../sceneCoyote.js';

/** @param {() => import('../sceneTypes.js').SceneContext | undefined} getScene */
export function createCoyoteSeamMethods(getScene) {
    return {
        runCoyoteBoundsScenario: () => {
            const scene = getScene();
            if (!scene?.bird || !scene.round) return null;

            scene.round.spawnInvincible = false;
            scene.round.coyoteFrames = GAME_CONFIG.bird.coyoteTimeFrames;

            let groundDeath = false;
            let ceilingDeath = false;
            const originalDeath = scene.triggerDeath;
            scene.triggerDeath = (cause) => {
                if (cause === 'ground') groundDeath = true;
                if (cause === 'ceiling') ceilingDeath = true;
            };

            scene.bird.isHittingGround = () => true;
            scene.bird.isOutOfBounds = () => false;
            if (scene.bird.isHittingGround()) {
                scene.triggerDeath('ground');
            } else if (scene.bird.isOutOfBounds() && hasCoyoteGrace(scene)) {
                /* coyote */
            }

            const diedOnGroundWithCoyote = groundDeath;
            groundDeath = false;
            ceilingDeath = false;

            scene.round.coyoteFrames = GAME_CONFIG.bird.coyoteTimeFrames;
            scene.bird.isHittingGround = () => false;
            scene.bird.isOutOfBounds = () => true;
            if (scene.bird.isHittingGround()) {
                scene.triggerDeath('ground');
            } else if (scene.bird.isOutOfBounds() && !hasCoyoteGrace(scene)) {
                scene.triggerDeath('ceiling');
            }
            const diedOnCeilingWithCoyote = ceilingDeath;

            scene.round.coyoteFrames = 0;
            ceilingDeath = false;
            if (scene.bird.isOutOfBounds() && !hasCoyoteGrace(scene)) {
                scene.triggerDeath('ceiling');
            }
            const diedOnCeilingWithoutCoyote = ceilingDeath;

            scene.triggerDeath = originalDeath;

            return {
                diedOnGroundWithCoyote,
                survivedCeilingWithCoyote: !diedOnCeilingWithCoyote,
                diedOnCeilingWithoutCoyote,
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
    };
}
