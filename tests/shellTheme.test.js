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
            documentElement: { style },
            body: { style: {} },
            querySelector: vi.fn(() => meta),
        };
        const { syncShellTheme } = await import('../src/shellTheme.js');
        syncShellTheme(doc);

        expect(style.setProperty).toHaveBeenCalledWith('--couleur-fond', expect.any(String));
        expect(meta.setAttribute).toHaveBeenCalledWith('content', expect.any(String));
        expect(doc.body.style.background).toBeTruthy();
    });
});
