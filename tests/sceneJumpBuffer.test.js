import { describe, it, expect, vi } from 'vitest';
import { GAME_CONFIG } from '../src/config.js';

vi.mock('../src/tutorialStorage.js', () => ({
    markTutorialSeen: vi.fn(),
}));

describe('sceneJumpBuffer', () => {
    it('requestJump remplit le buffer', async () => {
        const { requestJump } = await import('../src/sceneJumpBuffer.js');
        const scene = { _jumpBufferFrames: 0, bird: { bufferJump: () => {} } };
        requestJump(scene);
        expect(scene._jumpBufferFrames).toBe(GAME_CONFIG.bird.jumpBufferFrames);
    });

    it('requestJump marque le tutoriel vu quand affiché', async () => {
        const { markTutorialSeen } = await import('../src/tutorialStorage.js');
        const { requestJump } = await import('../src/sceneJumpBuffer.js');
        const scene = {
            _jumpBufferFrames: 0,
            bird: { bufferJump: () => {} },
            ui: { dismissJumpTutorial: vi.fn(() => true) },
        };
        requestJump(scene);
        expect(markTutorialSeen).toHaveBeenCalled();
    });

    it('processJumpBuffer consomme le buffer', async () => {
        const { processJumpBuffer } = await import('../src/sceneJumpBuffer.js');
        let buffered = false;
        const scene = {
            _jumpBufferFrames: 4,
            bird: { bufferJump: () => { buffered = true; } },
        };
        processJumpBuffer(scene);
        expect(buffered).toBe(true);
        expect(scene._jumpBufferFrames).toBe(0);
    });

    it('tickJumpBuffer décrémente le buffer', async () => {
        const { tickJumpBuffer } = await import('../src/sceneJumpBuffer.js');
        const scene = { _jumpBufferFrames: 3 };
        tickJumpBuffer(scene);
        expect(scene._jumpBufferFrames).toBe(2);
    });
});
