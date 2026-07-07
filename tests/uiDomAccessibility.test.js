import { describe, it, expect, vi, afterEach } from 'vitest';
import { GAME_CONFIG } from '../src/config.js';
import { CONTROL_DEFS } from '../src/uiDomAccessibilityDefs.js';
import {
    initAccessibilityLayer,
    setAccessibilityControlDisabled,
    setAccessibilityControlVisible,
    setOptionsPanelAccessibility,
    setScoresPanelAccessibility,
    setSkinsPanelAccessibility,
    setupGameOverAccessibility,
    setupMenuAccessibility,
    syncAccessibilityLayer,
} from '../src/uiDomAccessibility.js';

const CONTROL_COUNT = Object.keys(CONTROL_DEFS).length;

describe('uiDomAccessibility', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('setAccessibilityControlVisible est no-op sans DOM', () => {
        expect(() => setAccessibilityControlVisible('pause', true)).not.toThrow();
    });

    it('syncAccessibilityLayer ignore un canvas sans getBoundingClientRect', () => {
        expect(() => syncAccessibilityLayer({ canvas: {} })).not.toThrow();
    });

    it('syncAccessibilityLayer positionne un bouton visible', () => {
        const btn = { hidden: true, style: {} };
        vi.stubGlobal('document', {
            getElementById: vi.fn((id) => (id === 'a11y-pause' ? btn : null)),
        });

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

    it('initAccessibilityLayer crée la couche et l’announcer', () => {
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

        initAccessibilityLayer(document);

        expect(stored['a11y-controls']?.children.length).toBe(CONTROL_COUNT);
        expect(stored['ui-announcer']).toBeTruthy();
    });

    it('setupMenuAccessibility active les contrôles menu et difficulté', () => {
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

    it('setOptionsPanelAccessibility bascule menu et options', () => {
        const ids = [
            'a11y-start',
            'a11y-daily',
            'a11y-scores',
            'a11y-options',
            'a11y-skins',
            'a11y-diff-easy',
            'a11y-diff-normal',
            'a11y-diff-hard',
            'a11y-options-tab-controls',
            'a11y-options-tab-settings',
            'a11y-options-tab-modes',
            'a11y-training',
            'a11y-hardcore',
            'a11y-mute',
            'a11y-options-close',
        ];
        const buttons = Object.fromEntries(ids.map((id) => [id, { hidden: true, style: {} }]));
        vi.stubGlobal('document', {
            getElementById: vi.fn((id) => buttons[id] ?? null),
        });

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

    it('setScoresPanelAccessibility masque toute la rangée menu et affiche le retour dédié', () => {
        const ids = [
            'a11y-start',
            'a11y-scores',
            'a11y-options',
            'a11y-skin-prev',
            'a11y-scores-close',
        ];
        const buttons = Object.fromEntries(ids.map((id) => [id, { hidden: true, style: {} }]));
        vi.stubGlobal('document', {
            getElementById: vi.fn((id) => buttons[id] ?? null),
        });

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
        expect(buttons['a11y-scores'].hidden).toBe(true);
        expect(buttons['a11y-skin-prev'].hidden).toBe(true);
        expect(buttons['a11y-scores-close'].hidden).toBe(false);
    });

    it('setSkinsPanelAccessibility affiche prev/next skins et masque la rangée menu', () => {
        const ids = [
            'a11y-start',
            'a11y-skins',
            'a11y-skin-prev',
            'a11y-skin-next',
            'a11y-skins-close',
        ];
        const buttons = Object.fromEntries(ids.map((id) => [id, { hidden: true, style: {} }]));
        vi.stubGlobal('document', {
            getElementById: vi.fn((id) => buttons[id] ?? null),
        });

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
        expect(buttons['a11y-skins'].hidden).toBe(true);
        expect(buttons['a11y-skin-prev'].hidden).toBe(false);
        expect(buttons['a11y-skin-next'].hidden).toBe(false);
        expect(buttons['a11y-skins-close'].hidden).toBe(false);
    });

    it('setupGameOverAccessibility active rejouer et menu', () => {
        const buttons = Object.fromEntries(
            ['a11y-gameover-restart', 'a11y-gameover-menu'].map((id) => [
                id,
                { hidden: true, style: {} },
            ])
        );
        const announcer = { textContent: '' };
        vi.stubGlobal('document', {
            getElementById: vi.fn((id) => {
                if (id === 'ui-announcer') return announcer;
                return buttons[id] ?? null;
            }),
        });

        const scene = {
            handlePrimaryAction: vi.fn(),
            returnToMenu: vi.fn(),
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

        setupGameOverAccessibility(scene, { score: 12, isDaily: false });
        expect(buttons['a11y-gameover-restart'].hidden).toBe(false);
        expect(buttons['a11y-gameover-menu'].hidden).toBe(false);
        expect(announcer.textContent).toContain('12');
    });

    it('setAccessibilityControlDisabled marque le bouton hardcore verrouillé', () => {
        const btn = {
            hidden: false,
            disabled: false,
            tabIndex: 0,
            setAttribute: vi.fn(function (name, value) {
                if (name === 'aria-disabled') this._ariaDisabled = value;
                if (name === 'aria-label') this._ariaLabel = value;
            }),
            removeAttribute: vi.fn(function (name) {
                if (name === 'aria-disabled') delete this._ariaDisabled;
            }),
        };
        vi.stubGlobal('document', {
            getElementById: vi.fn((id) => (id === 'a11y-hardcore' ? btn : null)),
        });

        setAccessibilityControlDisabled('menuHardcore', true);
        expect(btn.disabled).toBe(true);
        expect(btn.tabIndex).toBe(-1);
        expect(btn._ariaDisabled).toBe('true');

        setAccessibilityControlDisabled('menuHardcore', false);
        expect(btn.disabled).toBe(false);
        expect(btn._ariaDisabled).toBeUndefined();
    });
});
