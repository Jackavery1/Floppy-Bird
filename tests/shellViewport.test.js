import { describe, it, expect, vi } from 'vitest';
import { GAME_STATE } from '../src/gameState.js';
import { syncShellViewport, viewportContentForState } from '../src/shellViewport.js';

function mockDoc(initialContent) {
    const meta = {
        content: initialContent,
        setAttribute(_name, value) {
            this.content = value;
        },
    };
    return {
        querySelector: (sel) => (sel === 'meta[name="viewport"]' ? meta : null),
        meta,
    };
}

describe('shellViewport', () => {
    it('autorise le zoom au menu', () => {
        const doc = mockDoc('');
        syncShellViewport(GAME_STATE.MENU, doc);
        expect(doc.meta.content).toContain('user-scalable=yes');
        expect(doc.meta.content).toContain('maximum-scale=3.0');
    });

    it('bloque le pinch en partie sur tactile', () => {
        vi.stubGlobal('matchMedia', () => ({ matches: true }));
        const doc = mockDoc('');
        syncShellViewport(GAME_STATE.PLAYING, doc);
        expect(doc.meta.content).toContain('user-scalable=no');
        expect(doc.meta.content).toContain('maximum-scale=1.0');
        vi.unstubAllGlobals();
    });

    it('autorise le zoom navigateur en partie sur desktop', () => {
        vi.stubGlobal('matchMedia', () => ({ matches: false }));
        const doc = mockDoc('');
        syncShellViewport(GAME_STATE.PLAYING, doc);
        expect(doc.meta.content).toContain('user-scalable=yes');
        expect(doc.meta.content).toContain('maximum-scale=3.0');
        vi.unstubAllGlobals();
    });

    it('viewportContentForState reflète menu vs partie tactile', () => {
        vi.stubGlobal('matchMedia', () => ({ matches: true }));
        expect(viewportContentForState(GAME_STATE.MENU)).toContain('user-scalable=yes');
        expect(viewportContentForState(GAME_STATE.PLAYING)).toContain('user-scalable=no');
        vi.unstubAllGlobals();
    });
});
