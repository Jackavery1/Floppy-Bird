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

export function isBirdInPipeGap(birdBounds, topPipes, bottomPipes, pipeBodyWidth) {
    const birdCx = birdBounds.x + birdBounds.width / 2;
    const topEdge = birdBounds.y;
    const bottomEdge = birdBounds.y + birdBounds.height;
    const halfW = pipeBodyWidth / 2;
    for (let i = 0; i < topPipes.length; i++) {
        const top = topPipes[i];
        const bottom = bottomPipes[i];
        if (!bottom) continue;
        if (birdCx < top.x - halfW || birdCx > top.x + halfW) continue;
        if (topEdge >= top.y && bottomEdge <= bottom.y) return true;
    }
    return false;
}
