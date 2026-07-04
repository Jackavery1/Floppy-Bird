import { describe, it, expect, vi, afterEach } from 'vitest';
import { GAME_CONFIG } from '../src/config.js';

describe('uiDomAccessibility', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('setAccessibilityControlVisible est no-op sans DOM', async () => {
        const { setAccessibilityControlVisible } = await import('../src/uiDomAccessibility.js');
        expect(() => setAccessibilityControlVisible('pause', true)).not.toThrow();
    });

    it('syncAccessibilityLayer ignore un canvas sans getBoundingClientRect', async () => {
        const { syncAccessibilityLayer } = await import('../src/uiDomAccessibility.js');
        expect(() => syncAccessibilityLayer({ canvas: {} })).not.toThrow();
    });

    it('syncAccessibilityLayer positionne un bouton visible', async () => {
        const btn = { hidden: true, style: {} };
        vi.stubGlobal('document', {
            getElementById: vi.fn((id) => (id === 'a11y-pause' ? btn : null)),
        });

        const { setAccessibilityControlVisible, syncAccessibilityLayer } = await import(
            '../src/uiDomAccessibility.js'
        );
        setAccessibilityControlVisible('pause', true);
        syncAccessibilityLayer({
            canvas: {
                getBoundingClientRect: () => ({
                    left: 0,
                    top: 0,
                    width: GAME_CONFIG.width,
                    height: GAME_CONFIG.height,
                }),
            },
        });

        expect(btn.hidden).toBe(false);
        expect(btn.style.width).toBeTruthy();
    });

    it('initAccessibilityLayer crée la couche et l’announcer', async () => {
        const stored = {};
        vi.stubGlobal('document', {
            getElementById: vi.fn((id) => stored[id] ?? null),
            createElement: vi.fn((tag) => ({
                tagName: tag.toUpperCase(),
                id: '',
                className: '',
                hidden: false,
                style: {},
                children: [],
                setAttribute: vi.fn(function (name, value) {
                    if (name === 'id') this.id = value;
                }),
                addEventListener: vi.fn(),
                appendChild: vi.fn(function (child) {
                    this.children.push(child);
                }),
            })),
            body: {
                appendChild: vi.fn((el) => {
                    if (el.id) stored[el.id] = el;
                }),
            },
        });

        const { initAccessibilityLayer } = await import('../src/uiDomAccessibility.js');
        initAccessibilityLayer(document);

        expect(stored['a11y-controls']?.children.length).toBe(16);
        expect(stored['ui-announcer']).toBeTruthy();
    });

    it('setupMenuAccessibility active les contrôles menu et difficulté', async () => {
        const buttons = Object.fromEntries(
            [
                'a11y-start',
                'a11y-daily',
                'a11y-scores',
                'a11y-options',
                'a11y-skins',
                'a11y-diff-easy',
                'a11y-diff-normal',
                'a11y-diff-hard',
            ].map((id) => [id, { hidden: true, style: {} }])
        );
        vi.stubGlobal('document', {
            getElementById: vi.fn((id) => buttons[id] ?? null),
        });

        const { setupMenuAccessibility } = await import('../src/uiDomAccessibility.js');
        const scene = {
            handlePrimaryAction: vi.fn(),
            launchDailyChallenge: vi.fn(),
            changeDifficulty: vi.fn(),
            game: {
                canvas: {
                    getBoundingClientRect: () => ({
                        left: 10,
                        top: 20,
                        width: GAME_CONFIG.width,
                        height: GAME_CONFIG.height,
                    }),
                },
            },
            ui: {
                toggleMenuScoresPanel: vi.fn(),
                toggleMenuOptionsPanel: vi.fn(),
                toggleMenuSkinsPanel: vi.fn(),
            },
        };

        setupMenuAccessibility(scene);
        expect(buttons['a11y-start'].hidden).toBe(false);
        expect(buttons['a11y-diff-hard'].hidden).toBe(false);
        expect(buttons['a11y-start'].style.width).toBeTruthy();
    });

    it('setOptionsPanelAccessibility bascule menu et options', async () => {
        const ids = [
            'a11y-start',
            'a11y-daily',
            'a11y-scores',
            'a11y-options',
            'a11y-skins',
            'a11y-diff-easy',
            'a11y-diff-normal',
            'a11y-diff-hard',
            'a11y-training',
            'a11y-hardcore',
            'a11y-mute',
        ];
        const buttons = Object.fromEntries(ids.map((id) => [id, { hidden: true, style: {} }]));
        vi.stubGlobal('document', {
            getElementById: vi.fn((id) => buttons[id] ?? null),
        });

        const { setOptionsPanelAccessibility } = await import('../src/uiDomAccessibility.js');
        const scene = {
            game: {
                canvas: {
                    getBoundingClientRect: () => ({
                        left: 0,
                        top: 0,
                        width: GAME_CONFIG.width,
                        height: GAME_CONFIG.height,
                    }),
                },
            },
        };

        setOptionsPanelAccessibility(scene, true);
        expect(buttons['a11y-start'].hidden).toBe(true);
        expect(buttons['a11y-training'].hidden).toBe(false);

        setOptionsPanelAccessibility(scene, false);
        expect(buttons['a11y-start'].hidden).toBe(false);
        expect(buttons['a11y-training'].hidden).toBe(true);
    });

    it('setScoresPanelAccessibility ne garde que le bouton scores', async () => {
        const ids = [
            'a11y-start',
            'a11y-scores',
            'a11y-options',
            'a11y-skin-prev',
        ];
        const buttons = Object.fromEntries(ids.map((id) => [id, { hidden: true, style: {} }]));
        vi.stubGlobal('document', {
            getElementById: vi.fn((id) => buttons[id] ?? null),
        });

        const { setScoresPanelAccessibility } = await import('../src/uiDomAccessibility.js');
        const scene = {
            game: {
                canvas: {
                    getBoundingClientRect: () => ({
                        left: 0,
                        top: 0,
                        width: GAME_CONFIG.width,
                        height: GAME_CONFIG.height,
                    }),
                },
            },
        };

        setScoresPanelAccessibility(scene, true);
        expect(buttons['a11y-start'].hidden).toBe(true);
        expect(buttons['a11y-scores'].hidden).toBe(false);
        expect(buttons['a11y-skin-prev'].hidden).toBe(true);
    });

    it('setSkinsPanelAccessibility affiche prev/next skins', async () => {
        const ids = ['a11y-start', 'a11y-skins', 'a11y-skin-prev', 'a11y-skin-next'];
        const buttons = Object.fromEntries(ids.map((id) => [id, { hidden: true, style: {} }]));
        vi.stubGlobal('document', {
            getElementById: vi.fn((id) => buttons[id] ?? null),
        });

        const { setSkinsPanelAccessibility } = await import('../src/uiDomAccessibility.js');
        const scene = {
            game: {
                canvas: {
                    getBoundingClientRect: () => ({
                        left: 0,
                        top: 0,
                        width: GAME_CONFIG.width,
                        height: GAME_CONFIG.height,
                    }),
                },
            },
        };

        setSkinsPanelAccessibility(scene, true);
        expect(buttons['a11y-start'].hidden).toBe(true);
        expect(buttons['a11y-skins'].hidden).toBe(false);
        expect(buttons['a11y-skin-prev'].hidden).toBe(false);
        expect(buttons['a11y-skin-next'].hidden).toBe(false);
    });
});
