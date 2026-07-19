import { describe, it, expect, vi, afterEach } from 'vitest';

describe('shellTheme', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.resetModules();
    });

    it('syncShellTheme pose data-theme et theme-color sans CSSOM', async () => {
        vi.stubGlobal(
            'matchMedia',
            vi.fn(() => ({ matches: false }))
        );
        const meta = { setAttribute: vi.fn() };
        const doc = {
            documentElement: { dataset: {} },
            body: {},
            querySelector: vi.fn(() => meta),
            querySelectorAll: vi.fn(() => [meta]),
        };
        const { syncShellTheme } = await import('../src/shellTheme.js');
        syncShellTheme(doc);

        expect(doc.documentElement.dataset.theme).toMatch(/^(day|night)$/);
        expect(meta.setAttribute).toHaveBeenCalledWith('content', expect.any(String));
        expect(doc.documentElement.style).toBeUndefined();
    }, 10_000);

    it('syncShellTheme pose data-contrast-high si prefers-contrast', async () => {
        vi.stubGlobal(
            'matchMedia',
            vi.fn((query) => ({
                matches: query.includes('prefers-contrast: more'),
                media: query,
            }))
        );
        const doc = {
            documentElement: { dataset: {} },
            body: {},
            querySelector: vi.fn(() => ({ setAttribute: vi.fn() })),
            querySelectorAll: vi.fn(() => []),
        };
        const { syncShellTheme } = await import('../src/shellTheme.js');
        syncShellTheme(doc);

        expect(doc.documentElement.dataset.contrastHigh).toBe('true');
    });
});
