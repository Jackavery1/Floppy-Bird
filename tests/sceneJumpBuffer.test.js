import { describe, it, expect } from 'vitest';
import { GAME_CONFIG } from '../src/config.js';
import { requestJump, processJumpBuffer, tickJumpBuffer } from '../src/sceneJumpBuffer.js';

describe('sceneJumpBuffer', () => {
    it('requestJump remplit le buffer', () => {
        const scene = { _jumpBufferFrames: 0, bird: { bufferJump: () => {} } };
        requestJump(scene);
        expect(scene._jumpBufferFrames).toBe(GAME_CONFIG.bird.jumpBufferFrames);
    });

    it('processJumpBuffer consomme le buffer', () => {
        let buffered = false;
        const scene = {
            _jumpBufferFrames: 4,
            bird: { bufferJump: () => { buffered = true; } },
        };
        processJumpBuffer(scene);
        expect(buffered).toBe(true);
        expect(scene._jumpBufferFrames).toBe(0);
    });

    it('tickJumpBuffer décrémente le buffer', () => {
        const scene = { _jumpBufferFrames: 3 };
        tickJumpBuffer(scene);
        expect(scene._jumpBufferFrames).toBe(2);
    });
});
