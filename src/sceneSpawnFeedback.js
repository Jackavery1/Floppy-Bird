/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

import { prefersReducedMotion } from './motion.js';

/** @param {SceneContext} scene */
export function updateSpawnInvincibilityVisual(scene) {
    const sprite = scene.bird?.sprite;
    if (!sprite) return;

    if (!scene.round.spawnInvincible) {
        if (sprite.alpha !== 1) sprite.setAlpha(1);
        return;
    }

    if (prefersReducedMotion()) {
        sprite.setAlpha(0.75);
        return;
    }

    const pulse = 0.55 + 0.45 * Math.abs(Math.sin(scene.time.now / 90));
    sprite.setAlpha(pulse);
}
