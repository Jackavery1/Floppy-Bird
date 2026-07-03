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

vi.mock('../src/uiIndex.js', () => ({
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

vi.mock('../src/metaStorage.js', () => ({
    loadSelectedSkin: vi.fn(() => 'classic'),
}));

vi.mock('../src/textures/index.js', () => ({
    createBirdAnimations: vi.fn(),
    ensurePipeTextures: vi.fn(),
}));

import { setupSceneWorld } from '../src/sceneSetup.js';
import { Bird } from '../src/bird.js';
import { Pipes } from '../src/pipes.js';
import { UI } from '../src/uiIndex.js';
import { showMenu } from '../src/sceneFlow.js';
import { setupSceneInput } from '../src/sceneInput.js';
import { createBirdAnimations, ensurePipeTextures } from '../src/textures/index.js';

describe('setupSceneWorld', () => {
    let scene;

    beforeEach(() => {
        scene = createBaseScene();
        scene.events = { once: vi.fn() };
        scene.shutdown = vi.fn();
        scene.trainingMode = false;
        scene.state = GAME_STATE.MENU;
        scene.anims = { create: vi.fn(), exists: vi.fn(() => false) };
    });

    it('compose bird, pipes, ui et affiche le menu', () => {
        setupSceneWorld(scene);

        expect(setupSceneInput).toHaveBeenCalledWith(scene);
        expect(Bird).toHaveBeenCalledWith(
            scene,
            GAME_CONFIG.bird.startX,
            GAME_CONFIG.centerY,
            'classic'
        );
        expect(Pipes).toHaveBeenCalledWith(scene);
        expect(UI).toHaveBeenCalledWith(scene);
        expect(scene.bird).toBeDefined();
        expect(scene.pipes).toBeDefined();
        expect(scene.ui).toBeDefined();
        expect(showMenu).toHaveBeenCalledWith(scene);
        expect(ensurePipeTextures).toHaveBeenCalledWith(scene);
        expect(createBirdAnimations).toHaveBeenCalledWith(scene);
    });
});
