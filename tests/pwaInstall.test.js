import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    initPwaInstall,
    syncPwaInstallVisibility,
    resetPwaInstallStateForTests,
} from '../src/pwaInstall.js';

describe('pwaInstall', () => {
    let btn;
    let doc;
    let win;
    let listeners;

    beforeEach(() => {
        resetPwaInstallStateForTests();
        listeners = {};
        doc = {
            getElementById: (id) => (id === 'pwa-install' ? btn : null),
        };
        btn = {
            hidden: true,
            setAttribute: vi.fn(),
            addEventListener: vi.fn((type, fn) => {
                listeners[`btn:${type}`] = fn;
            }),
            removeEventListener: vi.fn(),
        };
        win = {
            matchMedia: () => ({ matches: false }),
            navigator: { standalone: false },
            addEventListener: vi.fn((type, fn) => {
                listeners[type] = fn;
            }),
            removeEventListener: vi.fn(),
        };
    });

    afterEach(() => {
        resetPwaInstallStateForTests();
        vi.restoreAllMocks();
    });

    it('reste masqué sans beforeinstallprompt', () => {
        initPwaInstall(win, doc);
        expect(btn.hidden).toBe(true);
    });

    it('affiche le bouton après beforeinstallprompt et lance prompt au clic', async () => {
        initPwaInstall(win, doc);
        const prompt = vi.fn(async () => {});
        const event = {
            preventDefault: vi.fn(),
            prompt,
            userChoice: Promise.resolve({ outcome: 'accepted' }),
        };
        listeners.beforeinstallprompt(event);
        expect(btn.hidden).toBe(false);

        await listeners['btn:click']();
        expect(prompt).toHaveBeenCalled();
        expect(btn.hidden).toBe(true);
    });

    it('masque le bouton après appinstalled', () => {
        initPwaInstall(win, doc);
        listeners.beforeinstallprompt({
            preventDefault: vi.fn(),
            prompt: vi.fn(),
            userChoice: Promise.resolve({ outcome: 'dismissed' }),
        });
        expect(btn.hidden).toBe(false);
        listeners.appinstalled();
        expect(btn.hidden).toBe(true);
    });

    it('syncPwaInstallVisibility masque en standalone', () => {
        win.matchMedia = () => ({ matches: true });
        syncPwaInstallVisibility(doc, win);
        expect(btn.hidden).toBe(true);
    });
});
