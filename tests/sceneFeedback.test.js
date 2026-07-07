import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SOUND, GAME_CONFIG } from '../src/config.js';
import { GAME_STATE } from '../src/gameState.js';

vi.mock('../src/audio.js', () => ({ playSound: vi.fn() }));
vi.mock('../src/haptics.js', () => ({
    hapticLight: vi.fn(),
    hapticMedium: vi.fn(),
}));

const prefersReducedMotion = vi.fn(() => false);
const sceneCameraShake = vi.fn();
const sceneTween = vi.fn((_scene, config) => {
    config.onComplete?.();
    return {};
});

vi.mock('../src/motion.js', () => ({
    prefersReducedMotion,
    sceneCameraShake,
    sceneTween,
}));

const applyTrainingTimeScale = vi.fn();
vi.mock('../src/sceneBootstrap.js', () => ({
    applyTrainingTimeScale,
}));

function createScene(overrides = {}) {
    const particles = [];
    return {
        state: GAME_STATE.PLAYING,
        bird: { x: 80, y: 200 },
        cameras: { main: { shake: vi.fn() } },
        time: {
            timeScale: 1,
            delayedCall: vi.fn((_ms, cb) => {
                cb();
                return { remove: vi.fn() };
            }),
        },
        ui: {
            hideInGameScore: vi.fn(),
            showFlash: vi.fn(),
        },
        add: {
            rectangle: vi.fn((x, y, w, h, color, alpha) => {
                const p = { x, y, setDepth: vi.fn(), destroy: vi.fn(), color, alpha };
                particles.push(p);
                return p;
            }),
        },
        _particles: particles,
        ...overrides,
    };
}

describe('sceneFeedback', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        prefersReducedMotion.mockReturnValue(false);
    });

    it('playJumpFeedback déclenche audio et haptique', async () => {
        const { playJumpFeedback } = await import('../src/sceneFeedback.js');
        const { playSound } = await import('../src/audio.js');
        const { hapticLight } = await import('../src/haptics.js');
        playJumpFeedback();
        expect(playSound).toHaveBeenCalledWith(SOUND.JUMP);
        expect(hapticLight).toHaveBeenCalled();
    });

    it('playScoreFeedback déclenche audio et haptique', async () => {
        const { playScoreFeedback } = await import('../src/sceneFeedback.js');
        const { playSound } = await import('../src/audio.js');
        const { hapticLight } = await import('../src/haptics.js');
        playScoreFeedback(3);
        expect(playSound).toHaveBeenCalledWith(SOUND.SCORE, 3);
        expect(hapticLight).toHaveBeenCalled();
    });

    it('playGroundImpactFeedback déclenche son sol et haptique léger', async () => {
        const { playGroundImpactFeedback } = await import('../src/sceneFeedback.js');
        const { playSound } = await import('../src/audio.js');
        const { hapticLight } = await import('../src/haptics.js');
        playGroundImpactFeedback();
        expect(playSound).toHaveBeenCalledWith(SOUND.GROUND);
        expect(hapticLight).toHaveBeenCalled();
    });

    it('playDeathImpactFeedback pipe shake, flash et particules', async () => {
        const { playDeathImpactFeedback } = await import('../src/sceneFeedback.js');
        const { hapticMedium } = await import('../src/haptics.js');
        const scene = createScene();
        playDeathImpactFeedback(scene, 'pipe');
        expect(hapticMedium).toHaveBeenCalled();
        expect(scene.ui.hideInGameScore).toHaveBeenCalled();
        expect(sceneCameraShake).toHaveBeenCalledWith(scene.cameras.main, 200, 0.015);
        expect(scene.ui.showFlash).toHaveBeenCalled();
        expect(scene.add.rectangle).toHaveBeenCalledTimes(8);
        expect(scene.time.timeScale).toBe(GAME_CONFIG.round.deathSlowMoScale);
    });

    it('playDeathImpactFeedback ground utilise intensité réduite', async () => {
        const { playDeathImpactFeedback } = await import('../src/sceneFeedback.js');
        const scene = createScene();
        playDeathImpactFeedback(scene, 'ground');
        expect(sceneCameraShake).toHaveBeenCalledWith(scene.cameras.main, 140, 0.012);
        expect(scene.add.rectangle).toHaveBeenCalledTimes(8);
    });

    it('playDeathImpactFeedback ceiling utilise flash plafond', async () => {
        const { playDeathImpactFeedback } = await import('../src/sceneFeedback.js');
        const scene = createScene();
        playDeathImpactFeedback(scene, 'ceiling');
        expect(sceneCameraShake).toHaveBeenCalledWith(scene.cameras.main, 120, 0.01);
        expect(scene.add.rectangle).toHaveBeenCalledTimes(8);
    });

    it('slow-mo mort respecte prefers-reduced-motion', async () => {
        prefersReducedMotion.mockReturnValue(true);
        const { playDeathImpactFeedback } = await import('../src/sceneFeedback.js');
        const scene = createScene();
        playDeathImpactFeedback(scene, 'pipe');
        expect(applyTrainingTimeScale).toHaveBeenCalledWith(scene);
        expect(scene.time.timeScale).toBe(1);
        expect(scene.add.rectangle).not.toHaveBeenCalled();
    });

    it('particules ignorées si prefers-reduced-motion', async () => {
        prefersReducedMotion.mockReturnValue(true);
        const { playDeathImpactFeedback } = await import('../src/sceneFeedback.js');
        const scene = createScene();
        playDeathImpactFeedback(scene, 'ground');
        expect(scene.add.rectangle).not.toHaveBeenCalled();
    });
});
