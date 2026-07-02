import { describe, it, expect, vi } from 'vitest';
import { GAME_CONFIG } from '../src/config.js';
import { createRoundState } from '../src/roundState.js';

vi.mock('../src/tutorialStorage.js', () => ({
    markTutorialSeen: vi.fn(),
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

    it('requestJump marque le tutoriel vu quand affiché', async () => {
        const { markTutorialSeen } = await import('../src/tutorialStorage.js');
        const { requestJump } = await import('../src/sceneJumpBuffer.js');
        const scene = {
            round: createRoundState(),
            bird: { bufferJump: () => {} },
            ui: { dismissJumpTutorial: vi.fn(() => true) },
        };
        requestJump(scene);
        expect(markTutorialSeen).toHaveBeenCalled();
    });

    it('processJumpBuffer consomme le buffer', async () => {
        const { processJumpBuffer } = await import('../src/sceneJumpBuffer.js');
        const { playJumpFeedback } = await import('../src/sceneFeedback.js');
        let buffered = false;
        const round = createRoundState();
        round.jumpBufferFrames = 4;
        const scene = {
            round,
            bird: { bufferJump: () => { buffered = true; } },
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
