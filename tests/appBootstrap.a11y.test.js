import { describe, it, expect, vi, afterEach } from 'vitest';
import { GAME_CONFIG } from '../src/config.js';

describe('appBootstrap a11y', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('onGameReady initialise la couche a11y DOM réelle', async () => {
        vi.stubEnv('DEV', false);
        vi.stubEnv('VITE_ENABLE_TEST_SEAM', '');

        const stored = {};
        const addListener = vi.fn();
        vi.stubGlobal('window', {
            innerWidth: 390,
            innerHeight: 844,
            addEventListener: addListener,
            visualViewport: { addEventListener: addListener },
        });

        const loading = { classList: { add: vi.fn() } };
        const rootStyle = { setProperty: vi.fn() };
        vi.stubGlobal('document', {
            getElementById: vi.fn((id) => stored[id] ?? (id === 'loading' ? loading : null)),
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
            documentElement: { style: rootStyle, classList: { add: vi.fn() } },
            body: {
                clientWidth: 390,
                clientHeight: 844,
                style: {},
                appendChild: vi.fn((el) => {
                    if (el.id) stored[el.id] = el;
                }),
            },
            querySelector: vi.fn(() => ({ setAttribute: vi.fn() })),
        });
        vi.stubGlobal('getComputedStyle', () => ({
            paddingTop: '0',
            paddingRight: '0',
            paddingBottom: '0',
            paddingLeft: '0',
        }));

        const game = { canvas: { width: 0, height: 0, style: {}, parentElement: { style: {} } } };
        const { onGameReady } = await import('../src/appBootstrap.js');
        onGameReady(game);

        expect(stored['a11y-controls']?.children.length).toBe(18);
        expect(stored['ui-announcer']).toBeTruthy();
        expect(game.canvas.width).toBe(GAME_CONFIG.width);
    });
});
