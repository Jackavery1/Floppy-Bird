import { GAME_CONFIG } from './config.js';

export function requestJump(scene) {
    scene._jumpBufferFrames = Math.max(
        scene._jumpBufferFrames,
        GAME_CONFIG.bird.jumpBufferFrames,
    );
}

export function processJumpBuffer(scene) {
    if (scene._jumpBufferFrames <= 0) return;
    scene.bird.bufferJump();
    scene._jumpBufferFrames = 0;
}

export function tickJumpBuffer(scene) {
    if (scene._jumpBufferFrames > 0) {
        scene._jumpBufferFrames--;
    }
}
