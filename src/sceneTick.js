import { GAME_CONFIG } from './config.js';
import { shouldAnimateBackground, shouldUpdateDying, shouldUpdateGameplay } from './gameState.js';
import { updateClouds, updateGround, updateHills } from './sceneBackground.js';
import { frameStep, splitPhysicsSteps, checkCollisions } from './sceneBootstrap.js';
import { updateCoyoteTime, updateCoyoteVisual, hasCoyoteGrace } from './sceneCoyote.js';
import { updateDying } from './sceneDeath.js';
import { processJumpBuffer, tickJumpBuffer } from './sceneJumpBuffer.js';
import { checkScorePipes, tickPipeSpawnFallback } from './sceneRound.js';
import { updateSpawnInvincibilityVisual } from './sceneSpawnFeedback.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** @type {null | ((scene: SceneContext) => void)} */
let updateDebugHitboxesFn = null;
/** @type {Promise<void> | null} */
let debugHitboxesLoad = null;

function ensureDebugHitboxesLoaded(scene) {
    if (!(GAME_CONFIG.debug || scene.trainingMode)) return;
    if (updateDebugHitboxesFn) {
        updateDebugHitboxesFn(scene);
        return;
    }
    if (!debugHitboxesLoad) {
        debugHitboxesLoad = import('./debugHitboxes.js').then((m) => {
            updateDebugHitboxesFn = m.updateDebugHitboxes;
        });
    }
}

/** Réinitialise le lazy-load debug (tests). */
export function resetDebugHitboxesLoaderForTests() {
    updateDebugHitboxesFn = null;
    debugHitboxesLoad = null;
}

/** @param {SceneContext} scene */
export function updateSceneFrame(scene) {
    if (GAME_CONFIG.debug && scene.fps) {
        scene.fps.setText(`FPS: ${Math.round(scene.game.loop.actualFps)}`);
    }

    const step = frameStep(scene);

    if (shouldAnimateBackground(scene.state)) {
        updateClouds(scene._clouds);
        updateHills(scene.state, scene._hills, scene.pipes?.pipeSpeed ?? 0, step);
    }
    updateGround(scene.state, scene._groundSprite, scene.pipes?.pipeSpeed ?? 0, step);

    if (shouldUpdateGameplay(scene.state)) {
        processJumpBuffer(scene);
        tickPipeSpawnFallback(scene, scene.game.loop.delta);
        const physicsSteps = splitPhysicsSteps(step);
        for (const subStep of physicsSteps) {
            scene.bird.update(subStep);
            scene.pipes.update(subStep);
            scene.ghost.update(subStep);
            updateCoyoteTime(scene, subStep);
            updateCoyoteVisual(scene);
            checkCollisions(scene);
            checkScorePipes(scene);

            const spawnProtectsBounds = scene.round.spawnInvincible;
            if (!spawnProtectsBounds) {
                if (scene.bird.isHittingGround()) {
                    scene.triggerDeath('ground');
                } else if (scene.bird.isOutOfBounds() && !hasCoyoteGrace(scene)) {
                    scene.triggerDeath('ceiling');
                }
                break;
            }
        }
        updateSpawnInvincibilityVisual(scene);
        tickJumpBuffer(scene);
        ensureDebugHitboxesLoaded(scene);
    } else if (shouldUpdateDying(scene.state)) {
        updateDying(scene);
    }
}
