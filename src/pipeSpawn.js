import { GAME_CONFIG } from './config.js';
import { ensurePipeTextures } from './textures/pipeTextures.js';
import { DEPTH } from './ui/shared/uiDepth.js';

/**
 * Crée un sprite tuyau positionné hors-écran à droite.
 * @param {import('phaser').Scene} scene
 * @param {{ texture: string, originY: number, y: number, pipeWidth: number, pipeHeight: number }} opts
 */
export function createPipeSprite(scene, { texture, originY, y, pipeWidth, pipeHeight }) {
    ensurePipeTextures(scene);
    const pipe = scene.add.sprite(GAME_CONFIG.width + pipeWidth, y, texture);
    pipe.setDisplaySize(pipeWidth, pipeHeight);
    pipe.setOrigin(0.5, originY);
    pipe.setDepth(DEPTH.PIPES);
    pipe.setVisible(true);
    pipe.setActive(true);
    return pipe;
}

/**
 * @param {import('phaser').Scene} scene
 * @param {{ pipeGap: number, pipeWidth: number, pipeHeight: number, topPipes: import('phaser').GameObjects.Sprite[], bottomPipes: import('phaser').GameObjects.Sprite[] }} state
 * @param {number} gapY
 */
export function spawnPipePairAtGap(scene, state, gapY) {
    const { pipeGap, pipeWidth, pipeHeight, topPipes, bottomPipes } = state;
    const topPipe = createPipeSprite(scene, {
        texture: 'pipe-top',
        originY: 1,
        y: gapY - pipeGap / 2,
        pipeWidth,
        pipeHeight,
    });
    topPipe.scored = false;
    topPipes.push(topPipe);

    const bottomPipe = createPipeSprite(scene, {
        texture: 'pipe-bottom',
        originY: 0,
        y: gapY + pipeGap / 2,
        pipeWidth,
        pipeHeight,
    });
    bottomPipes.push(bottomPipe);
}
