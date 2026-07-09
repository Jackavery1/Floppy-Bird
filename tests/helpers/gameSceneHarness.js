import { vi } from 'vitest';
import { GAME_STATE } from '../../src/gameState.js';
import { GAME_CONFIG } from '../../src/config.js';
import { createRoundState } from '../../src/roundState.js';

export const NORMAL_GAME_SPEED = GAME_CONFIG.getDifficulty('normal').speed;

/** Scène GameScene minimale en état PLAYING pour tester update(). */
export function createPlayingGameScene(GameScene, overrides = {}) {
    const scene = new GameScene();
    scene.state = GAME_STATE.PLAYING;
    scene.game = { loop: { delta: 16.67, actualFps: 60 } };
    scene.round = createRoundState();
    scene.bird = {
        update: vi.fn(),
        x: 50,
        y: 256,
        isOutOfBounds: vi.fn(() => false),
        isHittingGround: vi.fn(() => false),
    };
    scene.pipes = {
        update: vi.fn(),
        pipeSpeed: NORMAL_GAME_SPEED,
        isBirdInGap: vi.fn(() => false),
    };
    scene.ghost = { update: vi.fn() };
    scene._clouds = [];
    return Object.assign(scene, overrides);
}
