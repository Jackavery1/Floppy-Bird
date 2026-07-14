import { describe, it, expect, vi, afterEach } from 'vitest';
import { syncMenuToggleAccessibility } from '../src/uiDomAccessibilityMenuToggles.js';

describe('uiDomAccessibilityMenuToggles', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('syncMenuToggleAccessibility reflète difficulté et modes', () => {
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
        expect(buttons.get('a11y-hardcore')?.setAttribute).toHaveBeenCalledWith(
            'aria-pressed',
            'false'
        );
    });

    it('syncMenuToggleAccessibility ignore une scène absente', () => {
        expect(() => syncMenuToggleAccessibility(undefined)).not.toThrow();
    });
});
