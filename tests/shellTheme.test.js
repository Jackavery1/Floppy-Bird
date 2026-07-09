import { describe, it, expect, vi, afterEach } from 'vitest';

describe('shellTheme', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('syncShellTheme applique les variables CSS et theme-color', async () => {
        vi.stubGlobal(
            'matchMedia',
            vi.fn(() => ({ matches: false }))
        );
        const style = { setProperty: vi.fn() };
        const meta = { setAttribute: vi.fn() };
        const doc = {
            documentElement: { style, dataset: {} },
            body: { style: {} },
            querySelector: vi.fn(() => meta),
        };
        const { syncShellTheme } = await import('../src/shellTheme.js');
        syncShellTheme(doc);

        expect(style.setProperty).toHaveBeenCalledWith('--couleur-fond', expect.any(String));
        expect(style.setProperty).toHaveBeenCalledWith('--spacing-md', '12px');
        expect(meta.setAttribute).toHaveBeenCalledWith('content', expect.any(String));
        expect(doc.body.style.background).toBeTruthy();
    }, 10_000);

    it('syncShellTheme renforce le contraste et data-contrast-high', async () => {
        vi.stubGlobal(
            'matchMedia',
            vi.fn((query) => ({
                matches: query.includes('prefers-contrast: more'),
                media: query,
            }))
        );
        const style = { setProperty: vi.fn() };
        const doc = {
            documentElement: { style, dataset: {} },
            body: { style: {} },
            querySelector: vi.fn(() => ({ setAttribute: vi.fn() })),
        };
        const { syncShellTheme } = await import('../src/shellTheme.js');
        syncShellTheme(doc);

        expect(style.setProperty).toHaveBeenCalledWith('--couleur-accent', '#ffeb3b');
        expect(doc.documentElement.dataset.contrastHigh).toBe('true');
    });
});
