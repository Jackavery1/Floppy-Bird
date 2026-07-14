import { GAME_CONFIG } from './config.js';
import { pipeCollider } from './pipeCollision.js';
import { shouldUpdateGameplay } from './gameState.js';
import { DEBUG_HITBOX_COLORS } from './uiPhaserComponents.js';
import { DEPTH } from './uiDepth.js';

/** @param {import('./sceneTypes.js').SceneContext} scene */
function isDebugHitboxesEnabled(scene) {
    return GAME_CONFIG.debug || Boolean(scene.trainingMode);
}

/** @param {import('./sceneTypes.js').SceneContext} scene */
export function ensureDebugHitboxLayer(scene) {
    if (!isDebugHitboxesEnabled(scene)) return;
    if (!scene._debugHitboxes) {
        scene._debugHitboxes = scene.add.graphics().setDepth(DEPTH.FPS - 1);
    }
}

/** @param {import('./sceneTypes.js').SceneContext} scene */
export function updateDebugHitboxes(scene) {
    if (!isDebugHitboxesEnabled(scene)) return;
    ensureDebugHitboxLayer(scene);
    const g = scene._debugHitboxes;
    if (!g) return;
    g.clear();
    if (!shouldUpdateGameplay(scene.state) || !scene.bird) return;

    const birdBounds = scene.bird.getBounds();
    const spriteBounds = scene.bird.getSpriteBounds?.() ?? birdBounds;

    g.lineStyle(2, DEBUG_HITBOX_COLORS.sprite, 0.55);
    g.strokeRect(spriteBounds.x, spriteBounds.y, spriteBounds.width, spriteBounds.height);

    g.lineStyle(2, DEBUG_HITBOX_COLORS.collision, 0.95);
    g.strokeRect(birdBounds.x, birdBounds.y, birdBounds.width, birdBounds.height);

    if (!scene.pipes) return;
    const bodyW = scene.pipes.pipeBodyWidth;
    g.lineStyle(2, DEBUG_HITBOX_COLORS.pipe, 0.85);
    for (const pipe of scene.pipes.topPipes ?? []) {
        const col = pipeCollider(pipe, 'top', bodyW);
        g.strokeRect(col.x, col.y, col.width, col.height);
    }
    for (const pipe of scene.pipes.bottomPipes ?? []) {
        const col = pipeCollider(pipe, 'bottom', bodyW);
        g.strokeRect(col.x, col.y, col.width, col.height);
    }
}

/** @param {import('./sceneTypes.js').SceneContext} scene */
export function destroyDebugHitboxLayer(scene) {
    scene._debugHitboxes?.destroy();
    scene._debugHitboxes = null;
}
