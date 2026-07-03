import { GAME_CONFIG } from './config.js';
import { Utils } from './utils.js';

export function pipeCollider(pipe, type, pipeBodyWidth) {
    const colW = pipeBodyWidth;
    if (type === 'top') {
        return { x: pipe.x - colW / 2, y: 0, width: colW, height: pipe.y };
    }
    return {
        x: pipe.x - colW / 2,
        y: pipe.y,
        width: colW,
        height: GAME_CONFIG.height - pipe.y,
    };
}

export function collidesWithPipeGroup(pipes, type, birdBounds, pipeBodyWidth) {
    for (const pipe of pipes) {
        if (Utils.checkCollision(birdBounds, pipeCollider(pipe, type, pipeBodyWidth))) {
            return true;
        }
    }
    return false;
}

/** @param {{ x: number, y: number, width: number, height: number }} birdBounds @param {number} topY @param {number} bottomY */
export function birdVerticallyInGap(birdBounds, topY, bottomY) {
    const birdCy = birdBounds.y + birdBounds.height / 2;
    const centerInGap = birdCy >= topY && birdCy <= bottomY;
    const boundsInGap = birdBounds.y >= topY && birdBounds.y + birdBounds.height <= bottomY;
    return centerInGap || boundsInGap;
}

export function isBirdInPipeGap(birdBounds, topPipes, bottomPipes, pipeBodyWidth) {
    const birdCx = birdBounds.x + birdBounds.width / 2;
    const halfW = pipeBodyWidth / 2;
    for (let i = 0; i < topPipes.length; i++) {
        const top = topPipes[i];
        const bottom = bottomPipes[i];
        if (!bottom) continue;
        if (birdCx < top.x - halfW || birdCx > top.x + halfW) continue;
        if (birdVerticallyInGap(birdBounds, top.y, bottom.y)) return true;
    }
    return false;
}
