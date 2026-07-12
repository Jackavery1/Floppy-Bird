import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GAME_STATE } from '../src/gameState.js';

vi.mock('../src/config.js', () => ({
    GAME_CONFIG: { debug: true, height: 512 },
}));

const { updateDebugHitboxes, ensureDebugHitboxLayer, destroyDebugHitboxLayer } =
    await import('../src/debugHitboxes.js');

function mockGraphics() {
    const g = {
        clear: vi.fn(),
        lineStyle: vi.fn(),
        strokeRect: vi.fn(),
        setDepth: vi.fn().mockReturnThis(),
        destroy: vi.fn(),
    };
    return g;
}

describe('debugHitboxes', () => {
    /** @type {ReturnType<typeof mockGraphics>} */
    let graphics;
    /** @type {{ add: ReturnType<typeof vi.fn>, state: string, bird: object, pipes: object, _debugHitboxes?: object }} */
    let scene;

    beforeEach(() => {
        graphics = mockGraphics();
        scene = {
            state: GAME_STATE.PLAYING,
            add: { graphics: vi.fn(() => graphics) },
            bird: {
                getBounds: () => ({ x: 10, y: 20, width: 18, height: 14 }),
            },
            pipes: {
                pipeBodyWidth: 24,
                topPipes: [{ x: 200, y: 100 }],
                bottomPipes: [{ x: 200, y: 300 }],
            },
        };
    });

    it('trace les hitboxes oiseau et tuyaux en mode debug', () => {
        updateDebugHitboxes(scene);
        expect(scene.add.graphics).toHaveBeenCalled();
        expect(graphics.strokeRect).toHaveBeenCalledWith(10, 20, 18, 14);
        expect(graphics.strokeRect.mock.calls.length).toBeGreaterThan(1);
    });

    it('ne trace rien hors état PLAYING', () => {
        scene.state = GAME_STATE.MENU;
        updateDebugHitboxes(scene);
        expect(graphics.strokeRect).not.toHaveBeenCalled();
    });

    it('ensureDebugHitboxLayer réutilise le graphics existant', () => {
        ensureDebugHitboxLayer(scene);
        ensureDebugHitboxLayer(scene);
        expect(scene.add.graphics).toHaveBeenCalledTimes(1);
    });

    it('destroyDebugHitboxLayer nettoie la couche', () => {
        ensureDebugHitboxLayer(scene);
        destroyDebugHitboxLayer(scene);
        expect(graphics.destroy).toHaveBeenCalled();
        expect(scene._debugHitboxes).toBeNull();
    });
});
