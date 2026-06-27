import { Utils } from '../utils.js';

export function createStarTexture(scene) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xFFD700, 1);
    g.fillPoints(Utils.makeStarPoints(8, 8, 6, 2.5), true);
    g.generateTexture('star', 16, 16);
    g.destroy();
}
