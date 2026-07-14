import { describe, it, expect, vi, beforeEach } from 'vitest';

const prefersReducedMotion = vi.fn(() => false);
const sceneCameraShake = vi.fn();
const sceneTween = vi.fn((_scene, config) => {
    config.onComplete?.();
});

vi.mock('../src/motion.js', () => ({
    prefersReducedMotion,
    sceneCameraShake,
    sceneTween,
}));

describe('sceneJuice', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        prefersReducedMotion.mockReturnValue(false);
    });

    function sceneStub() {
        return {
            cameras: { main: {} },
            add: {
                rectangle: vi.fn(() => ({ setDepth: vi.fn(), destroy: vi.fn() })),
            },
        };
    }

    it('spawnBurstParticles crée des particules', async () => {
        const { spawnBurstParticles } = await import('../src/sceneJuice.js');
        const scene = sceneStub();
        spawnBurstParticles(scene, 100, 200, { count: 4, colors: [0xff0000] });
        expect(scene.add.rectangle).toHaveBeenCalledTimes(4);
    });

    it('spawnScoreJuice secoue la caméra aux paliers ×10', async () => {
        const { spawnScoreJuice } = await import('../src/sceneJuice.js');
        const scene = sceneStub();
        spawnScoreJuice(scene, 80, 180, 10);
        expect(sceneCameraShake).toHaveBeenCalledWith(scene.cameras.main, 90, 0.004);
    });

    it('spawnDeathJuice ignore reduced motion', async () => {
        prefersReducedMotion.mockReturnValue(true);
        const { spawnDeathJuice } = await import('../src/sceneJuice.js');
        const scene = sceneStub();
        spawnDeathJuice(scene, 50, 50, 'pipe');
        expect(scene.add.rectangle).not.toHaveBeenCalled();
    });
});
