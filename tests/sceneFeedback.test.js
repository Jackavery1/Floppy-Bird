import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SOUND, GAME_CONFIG } from '../src/config.js';
import { GAME_STATE } from '../src/gameState.js';

vi.mock('../src/audio.js', () => ({ playSound: vi.fn() }));
vi.mock('../src/haptics.js', () => ({
    hapticLight: vi.fn(),
    hapticMedium: vi.fn(),
    hapticHeavy: vi.fn(),
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

const spawnDeathJuice = vi.fn();
const spawnScoreJuice = vi.fn();

vi.mock('../src/sceneJuice.js', () => ({
    spawnDeathJuice,
    spawnScoreJuice,
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

    it('playScoreFeedback déclenche audio, haptique, popup et juice palier ×10', async () => {
        const { playScoreFeedback } = await import('../src/sceneFeedback.js');
        const { playSound } = await import('../src/audio.js');
        const { hapticLight, hapticHeavy } = await import('../src/haptics.js');
        const scene = createScene({ scoreEffects: { show: vi.fn() } });
        playScoreFeedback(10, scene);
        expect(playSound).toHaveBeenCalledWith(SOUND.SCORE, 10);
        expect(hapticHeavy).toHaveBeenCalled();
        expect(hapticLight).not.toHaveBeenCalled();
        expect(scene.scoreEffects.show).toHaveBeenCalledWith(80, 200);
        expect(spawnScoreJuice).toHaveBeenCalledWith(scene, 80, 200, 10);
    });

    it('playScoreFeedback utilise haptique léger et popup hors palier ×10', async () => {
        const { playScoreFeedback } = await import('../src/sceneFeedback.js');
        const { hapticLight, hapticHeavy } = await import('../src/haptics.js');
        const scene = createScene({ scoreEffects: { show: vi.fn() } });
        playScoreFeedback(3, scene);
        expect(hapticLight).toHaveBeenCalled();
        expect(hapticHeavy).not.toHaveBeenCalled();
        expect(scene.scoreEffects.show).toHaveBeenCalledWith(80, 200);
        expect(spawnScoreJuice).not.toHaveBeenCalled();
    });

    it('playGroundImpactFeedback déclenche son sol et haptique léger', async () => {
        const { playGroundImpactFeedback } = await import('../src/sceneFeedback.js');
        const { playSound } = await import('../src/audio.js');
        const { hapticLight } = await import('../src/haptics.js');
        playGroundImpactFeedback();
        expect(playSound).toHaveBeenCalledWith(SOUND.GROUND);
        expect(hapticLight).toHaveBeenCalled();
    });

    it('playDeathImpactFeedback pipe shake, flash et juice', async () => {
        const { playDeathImpactFeedback } = await import('../src/sceneFeedback.js');
        const { hapticHeavy } = await import('../src/haptics.js');
        const scene = createScene();
        playDeathImpactFeedback(scene, 'pipe');
        expect(hapticHeavy).toHaveBeenCalled();
        expect(scene.ui.hideInGameScore).toHaveBeenCalled();
        expect(sceneCameraShake).toHaveBeenCalledWith(scene.cameras.main, 260, 0.022);
        expect(scene.ui.showFlash).toHaveBeenCalled();
        expect(spawnDeathJuice).toHaveBeenCalledWith(scene, 80, 200, 'pipe');
        expect(scene.time.timeScale).toBe(GAME_CONFIG.round.deathSlowMoScale);
    });

    it('playDeathImpactFeedback ground utilise intensité renforcée', async () => {
        const { playDeathImpactFeedback } = await import('../src/sceneFeedback.js');
        const scene = createScene();
        playDeathImpactFeedback(scene, 'ground');
        expect(sceneCameraShake).toHaveBeenCalledWith(scene.cameras.main, 180, 0.018);
        expect(spawnDeathJuice).toHaveBeenCalledWith(scene, 80, GAME_CONFIG.groundY - 20, 'ground');
    });

    it('playDeathImpactFeedback ceiling utilise flash plafond', async () => {
        const { playDeathImpactFeedback } = await import('../src/sceneFeedback.js');
        const scene = createScene();
        playDeathImpactFeedback(scene, 'ceiling');
        expect(sceneCameraShake).toHaveBeenCalledWith(scene.cameras.main, 150, 0.014);
        expect(spawnDeathJuice).toHaveBeenCalledWith(scene, 80, 30, 'ceiling');
    });

    it('slow-mo mort respecte prefers-reduced-motion', async () => {
        prefersReducedMotion.mockReturnValue(true);
        const { playDeathImpactFeedback } = await import('../src/sceneFeedback.js');
        const scene = createScene();
        playDeathImpactFeedback(scene, 'pipe');
        expect(applyTrainingTimeScale).toHaveBeenCalledWith(scene);
        expect(scene.time.timeScale).toBe(1);
        expect(spawnDeathJuice).not.toHaveBeenCalled();
    });
});
