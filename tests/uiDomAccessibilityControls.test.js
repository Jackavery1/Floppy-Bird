import { describe, it, expect, vi, afterEach } from 'vitest';
import { initAccessibilityLayer } from '../src/uiDomAccessibility.js';

describe('uiDomAccessibility contrôles', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('setAccessibilityControlDisabled marque le bouton hardcore verrouillé', async () => {
        const { setAccessibilityControlDisabled } = await import(
            '../src/uiDomAccessibilityControls.js'
        );
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

    it('initAccessibilityLayer crée la couche a11y une seule fois', () => {
        const store = new Map();
        const doc = {
            getElementById: (id) => store.get(id) ?? null,
            createElement: vi.fn(() => ({
                id: '',
                className: '',
                type: '',
                hidden: false,
                style: {},
                setAttribute: vi.fn(),
                addEventListener: vi.fn(),
                appendChild: vi.fn(),
            })),
            body: {
                appendChild: vi.fn((el) => {
                    if (el.id) store.set(el.id, el);
                }),
            },
        };
        initAccessibilityLayer(doc);
        const callsAfterFirst = doc.createElement.mock.calls.length;
        initAccessibilityLayer(doc);
        expect(doc.createElement.mock.calls.length).toBe(callsAfterFirst);
        expect(store.has('a11y-controls')).toBe(true);
        expect(store.has('ui-announcer')).toBe(true);
    });

    it('setAccessibilityControlPressed met à jour aria-pressed', async () => {
        const { setAccessibilityControlPressed } = await import(
            '../src/uiDomAccessibilityControls.js'
        );
        const btn = { setAttribute: vi.fn() };
        vi.stubGlobal('document', {
            getElementById: vi.fn((id) => (id === 'a11y-training' ? btn : null)),
        });
        setAccessibilityControlPressed('menuTraining', true);
        expect(btn.setAttribute).toHaveBeenCalledWith('aria-pressed', 'true');
        setAccessibilityControlPressed('menuTraining', false);
        expect(btn.setAttribute).toHaveBeenCalledWith('aria-pressed', 'false');
    });

    it('syncMenuToggleAccessibility reflète difficulté et modes', async () => {
        const { syncMenuToggleAccessibility } = await import(
            '../src/uiDomAccessibilityFlows.js'
        );
        const buttons = new Map();
        vi.stubGlobal('document', {
            getElementById: vi.fn((id) => {
                if (!buttons.has(id)) {
                    buttons.set(id, { setAttribute: vi.fn() });
                }
                return buttons.get(id);
            }),
        });
        syncMenuToggleAccessibility({
            difficulty: 'hard',
            trainingMode: true,
            hardcoreMode: false,
        });
        expect(buttons.get('a11y-diff-hard')?.setAttribute).toHaveBeenCalledWith(
            'aria-pressed',
            'true'
        );
        expect(buttons.get('a11y-training')?.setAttribute).toHaveBeenCalledWith(
            'aria-pressed',
            'true'
        );
    });
});
