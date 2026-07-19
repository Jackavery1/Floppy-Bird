import { describe, it, expect, vi } from 'vitest';
import { buildGameOverUI } from '../src/ui/gameOver/uiGameOver.js';
import { createBaseScene } from './helpers/phaserMock.js';

vi.mock('../src/motion.js', () => ({
    sceneTween: vi.fn((scene, config) => {
        config.onUpdate?.();
        config.onComplete?.();
    }),
    prefersReducedMotion: vi.fn(() => false),
}));

function makeUi(overrides = {}) {
    return {
        hideInGameScore: vi.fn(),
        createOverlay: vi.fn(() => ({ setAlpha: vi.fn(), destroy: vi.fn() })),
        highScore: 20,
        _currentDifficulty: 'normal',
        drawGameOverMenuButton: vi.fn(),
        drawGameOverRestartButton: vi.fn(),
        _menuBtnGraphics: { destroy: vi.fn() },
        _restartBtnGraphics: { destroy: vi.fn() },
        ...overrides,
    };
}

function goOpts(partial = {}) {
    return {
        finalScore: 10,
        leaderboardData: { entries: [], highlightId: null },
        fadeIn: false,
        isNewRecord: false,
        hardcoreMode: false,
        dailyGoal: 0,
        activeSkinId: 'classic',
        deathCause: null,
        ...partial,
    };
}

describe('uiGameOver', () => {
    it('buildGameOverUI construit le panneau game over', () => {
        const scene = createBaseScene();
        const ui = makeUi();
        const { elements } = buildGameOverUI(
            scene,
            ui,
            goOpts({
                finalScore: 10,
                leaderboardData: {
                    entries: [{ score: 10, id: 'a', skinId: 'classic' }],
                    highlightId: 'a',
                },
            })
        );
        expect(elements.length).toBeGreaterThan(5);
        expect(ui.drawGameOverRestartButton).toHaveBeenCalled();
        expect(ui.drawGameOverMenuButton).toHaveBeenCalled();
    });

    it('buildGameOverUI affiche le récap daily sans TOP 5', () => {
        const scene = createBaseScene();
        const ui = makeUi();
        const { elements } = buildGameOverUI(scene, ui, goOpts({ finalScore: 8, dailyGoal: 10 }));
        expect(elements.length).toBeGreaterThan(5);
    });

    it('classement commun (skin classique) : affiche une icône par entrée', () => {
        const scene = createBaseScene();
        const ui = makeUi();
        const rectCallsBefore = scene.add.rectangle.mock.calls.length;
        buildGameOverUI(
            scene,
            ui,
            goOpts({
                finalScore: 10,
                leaderboardData: {
                    entries: [
                        { score: 48, id: 'a', skinId: 'ruby' },
                        { score: 34, id: 'b', skinId: 'ocean' },
                    ],
                    highlightId: null,
                },
            })
        );
        expect(scene.add.rectangle.mock.calls.length).toBeGreaterThan(rectCallsBefore + 1);
    });

    it('buildGameOverUI affiche la cause de mort', () => {
        const scene = createBaseScene();
        const ui = makeUi();
        buildGameOverUI(scene, ui, goOpts({ finalScore: 5, deathCause: 'pipe' }));
        const texts = scene.add.text.mock.calls.map((call) => call[2]);
        expect(texts).toContain('Collision tuyau');
    });

    it('skin spécial : classement dédié titré avec le nom du skin, sans icône par entrée', () => {
        const scene = createBaseScene();
        const ui = makeUi();
        buildGameOverUI(
            scene,
            ui,
            goOpts({
                finalScore: 40,
                leaderboardData: {
                    entries: [{ score: 40, id: 'a', skinId: 'cosmos' }],
                    highlightId: null,
                },
                activeSkinId: 'cosmos',
            })
        );
        const titles = scene.add.text.mock.calls.map((call) => call[2]);
        expect(titles.some((t) => t.includes('COSMOS'))).toBe(true);
    });

    it('fadeIn anime le score depuis zéro', async () => {
        const { sceneTween } = await import('../src/motion.js');
        const scene = createBaseScene();
        const ui = makeUi();
        buildGameOverUI(scene, ui, goOpts({ finalScore: 7, fadeIn: true }));
        expect(sceneTween).toHaveBeenCalled();
        const scoreTween = sceneTween.mock.calls.find(([, cfg]) => cfg.targets?.v != null);
        expect(scoreTween).toBeTruthy();
    });

    it('nouveau record sans fadeIn déclenche les confettis', () => {
        const scene = createBaseScene();
        const ui = makeUi();
        const rectBefore = scene.add.rectangle.mock.calls.length;
        buildGameOverUI(scene, ui, goOpts({ finalScore: 25, isNewRecord: true }));
        expect(scene.add.rectangle.mock.calls.length).toBeGreaterThan(rectBefore);
    });

    it('hardcore affiche HC dans le libellé record spécial', () => {
        const scene = createBaseScene();
        const ui = makeUi();
        buildGameOverUI(
            scene,
            ui,
            goOpts({ finalScore: 15, hardcoreMode: true, activeSkinId: 'cosmos' })
        );
        const texts = scene.add.text.mock.calls.map((call) => call[2]);
        expect(texts.some((t) => String(t).includes('HC'))).toBe(true);
    });
});
