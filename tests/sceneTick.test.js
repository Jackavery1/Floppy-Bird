import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GAME_STATE } from '../src/gameState.js';
import { updateSceneFrame, resetDebugHitboxesLoaderForTests } from '../src/sceneTick.js';
import { createRoundState } from '../src/roundState.js';

vi.mock('../src/sceneBackground.js', () => ({
    updateClouds: vi.fn(),
    updateHills: vi.fn(),
    updateGround: vi.fn(),
}));

vi.mock('../src/sceneBootstrap.js', () => ({
    frameStep: vi.fn(() => 1),
    splitPhysicsSteps: vi.fn((step) => [step]),
    checkCollisions: vi.fn(),
}));

vi.mock('../src/sceneDeath.js', () => ({
    updateDying: vi.fn(),
}));

vi.mock('../src/sceneJumpBuffer.js', () => ({
    processJumpBuffer: vi.fn(),
    tickJumpBuffer: vi.fn(),
}));

vi.mock('../src/sceneRound.js', () => ({
    checkScorePipes: vi.fn(),
    tickPipeSpawnFallback: vi.fn(),
}));

vi.mock('../src/sceneCoyote.js', () => ({
    updateCoyoteTime: vi.fn(),
    updateCoyoteVisual: vi.fn(),
    hasCoyoteGrace: vi.fn(() => false),
}));

vi.mock('../src/sceneSpawnFeedback.js', () => ({
    updateSpawnInvincibilityVisual: vi.fn(),
}));

vi.mock('../src/debugHitboxes.js', () => ({
    updateDebugHitboxes: vi.fn(),
}));

describe('sceneTick', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        resetDebugHitboxesLoaderForTests();
    });

    function baseScene(state, overrides = {}) {
        return {
            state,
            game: { loop: { delta: 16.67, actualFps: 60 } },
            round: createRoundState(),
            bird: {
                update: vi.fn(),
                isHittingGround: vi.fn(() => false),
                isOutOfBounds: vi.fn(() => false),
            },
            pipes: { update: vi.fn(), pipeSpeed: 2 },
            ghost: { update: vi.fn() },
            _clouds: [],
            _hills: [],
            _groundSprite: {},
            triggerDeath: vi.fn(),
            trainingMode: false,
            ...overrides,
        };
    }

    it('met à jour bird/pipes en PLAYING', async () => {
        const { processJumpBuffer } = await import('../src/sceneJumpBuffer.js');
        const scene = baseScene(GAME_STATE.PLAYING);
        updateSceneFrame(scene);
        expect(processJumpBuffer).toHaveBeenCalledWith(scene);
        expect(scene.bird.update).toHaveBeenCalled();
        expect(scene.pipes.update).toHaveBeenCalled();
    });

    it('délègue à updateDying en DYING', async () => {
        const { updateDying } = await import('../src/sceneDeath.js');
        const scene = baseScene(GAME_STATE.DYING);
        updateSceneFrame(scene);
        expect(updateDying).toHaveBeenCalledWith(scene);
        expect(scene.bird.update).not.toHaveBeenCalled();
    });

    it('n’avance pas le gameplay en MENU', async () => {
        const scene = baseScene(GAME_STATE.MENU);
        updateSceneFrame(scene);
        expect(scene.bird.update).not.toHaveBeenCalled();
        expect(scene.pipes.update).not.toHaveBeenCalled();
    });

    it('charge les hitboxes debug en lazy si entraînement', async () => {
        const { updateDebugHitboxes } = await import('../src/debugHitboxes.js');
        const scene = baseScene(GAME_STATE.PLAYING, { trainingMode: true });
        updateSceneFrame(scene);
        expect(updateDebugHitboxes).not.toHaveBeenCalled();
        await vi.waitFor(() => {
            updateSceneFrame(scene);
            expect(updateDebugHitboxes).toHaveBeenCalledWith(scene);
        });
    });

    it('ne charge pas les hitboxes debug hors debug/entraînement', async () => {
        const { updateDebugHitboxes } = await import('../src/debugHitboxes.js');
        const scene = baseScene(GAME_STATE.PLAYING);
        updateSceneFrame(scene);
        await Promise.resolve();
        updateSceneFrame(scene);
        expect(updateDebugHitboxes).not.toHaveBeenCalled();
    });
});
