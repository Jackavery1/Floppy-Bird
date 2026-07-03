import { describe, it, expect, vi } from 'vitest';
import { GAME_CONFIG } from '../src/config.js';
import { createRoundState } from '../src/roundState.js';

vi.mock('../src/tutorialProgress.js', () => ({
    onTutorialJump: vi.fn(),
    onHardcoreTutorialJump: vi.fn(),
}));

vi.mock('../src/sceneFeedback.js', () => ({
    playJumpFeedback: vi.fn(),
}));

describe('sceneJumpBuffer', () => {
    it('requestJump remplit le buffer', async () => {
        const { requestJump } = await import('../src/sceneJumpBuffer.js');
        const scene = { round: createRoundState(), bird: { bufferJump: () => {} } };
        requestJump(scene);
        expect(scene.round.jumpBufferFrames).toBe(GAME_CONFIG.bird.jumpBufferFrames);
    });

    it('requestJump déclenche la progression tutoriel', async () => {
        const { onTutorialJump } = await import('../src/tutorialProgress.js');
        const { requestJump } = await import('../src/sceneJumpBuffer.js');
        const scene = {
            round: createRoundState(),
            bird: { bufferJump: () => {} },
            ui: {},
        };
        requestJump(scene);
        expect(onTutorialJump).toHaveBeenCalledWith(scene);
    });

    it('processJumpBuffer consomme le buffer', async () => {
        const { processJumpBuffer } = await import('../src/sceneJumpBuffer.js');
        const { playJumpFeedback } = await import('../src/sceneFeedback.js');
        let buffered = false;
        const round = createRoundState();
        round.jumpBufferFrames = 4;
        const scene = {
            round,
            bird: {
                bufferJump: () => {
                    buffered = true;
                },
            },
        };
        processJumpBuffer(scene);
        expect(buffered).toBe(true);
        expect(playJumpFeedback).toHaveBeenCalled();
        expect(scene.round.jumpBufferFrames).toBe(0);
    });

    it('tickJumpBuffer décrémente le buffer', async () => {
        const { tickJumpBuffer } = await import('../src/sceneJumpBuffer.js');
        const round = createRoundState();
        round.jumpBufferFrames = 3;
        const scene = { round };
        tickJumpBuffer(scene);
        expect(scene.round.jumpBufferFrames).toBe(2);
    });
});
