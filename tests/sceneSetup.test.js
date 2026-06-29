import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GAME_STATE } from '../src/gameState.js';
import { GAME_CONFIG } from '../src/config.js';
import { createBaseScene } from './helpers/phaserMock.js';

vi.mock('../src/sceneBackground.js', () => ({
    initClouds: vi.fn(() => []),
    createGround: vi.fn(() => ({ setDepth: vi.fn() })),
}));

vi.mock('../src/sceneInput.js', () => ({
    setupSceneInput: vi.fn(),
}));

vi.mock('../src/bird.js', () => ({
    Bird: vi.fn(function Bird() {
        this.destroy = vi.fn();
    }),
}));

vi.mock('../src/pipes.js', () => ({
    Pipes: vi.fn(function Pipes() {
        this.destroy = vi.fn();
    }),
}));

vi.mock('../src/ui.js', () => ({
    UI: vi.fn(function UI() {
        this.destroy = vi.fn();
    }),
}));

vi.mock('../src/scoreEffects.js', () => ({
    ScoreEffects: vi.fn(function ScoreEffects() {
        this.destroy = vi.fn();
    }),
}));

vi.mock('../src/training.js', () => ({
    GhostReplay: vi.fn(function GhostReplay() {
        this.destroy = vi.fn();
    }),
}));

vi.mock('../src/sceneBootstrap.js', () => ({
    warnFileProtocol: vi.fn(),
    primeAudio: vi.fn(),
    applyTrainingTimeScale: vi.fn(),
}));

vi.mock('../src/sceneFlow.js', () => ({
    showMenu: vi.fn(),
}));

vi.mock('../src/audio.js', () => ({
    resumeAudio: vi.fn(),
}));

describe('setupSceneWorld', () => {
    let scene;

    beforeEach(() => {
        scene = createBaseScene();
        scene.events = { once: vi.fn() };
        scene.shutdown = vi.fn();
        scene.trainingMode = false;
        scene.state = GAME_STATE.MENU;
        scene.anims = { create: vi.fn() };
    });

    it('compose bird, pipes, ui et affiche le menu', async () => {
        const { setupSceneWorld } = await import('../src/sceneSetup.js');
        const { Bird } = await import('../src/bird.js');
        const { Pipes } = await import('../src/pipes.js');
        const { UI } = await import('../src/ui.js');
        const { showMenu } = await import('../src/sceneFlow.js');
        const { setupSceneInput } = await import('../src/sceneInput.js');

        setupSceneWorld(scene);

        expect(setupSceneInput).toHaveBeenCalledWith(scene);
        expect(Bird).toHaveBeenCalledWith(scene, GAME_CONFIG.bird.startX, GAME_CONFIG.centerY);
        expect(Pipes).toHaveBeenCalledWith(scene);
        expect(UI).toHaveBeenCalledWith(scene);
        expect(scene.bird).toBeDefined();
        expect(scene.pipes).toBeDefined();
        expect(scene.ui).toBeDefined();
        expect(showMenu).toHaveBeenCalledWith(scene);
        expect(scene.anims.create).toHaveBeenCalledWith(expect.objectContaining({ key: 'bird-bat' }));
    });
});
