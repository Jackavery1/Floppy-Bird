import { ensureBirdTextures } from './textures/index.js';

/** Charge les textures oiseau par lots pour ne pas bloquer l'ouverture du panneau. */
export function scheduleRemainingBirdTextures(scene, skinIds) {
    const queue = skinIds.filter((id) => !scene.textures.exists(`bird-sheet-${id}`));
    if (!queue.length) return;

    const batchSize = 4;
    const step = () => {
        const batch = queue.splice(0, batchSize);
        if (batch.length) ensureBirdTextures(scene, batch);
        if (queue.length) scene.time.delayedCall(16, step);
    };
    step();
}
