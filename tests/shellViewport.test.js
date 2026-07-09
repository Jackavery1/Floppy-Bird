import { describe, it, expect } from 'vitest';
import { GAME_STATE } from '../src/gameState.js';
import { syncShellViewport } from '../src/shellViewport.js';

function mockDoc(initialContent) {
    const meta = { content: initialContent, setAttribute(_name, value) { this.content = value; } };
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

    it('bloque le zoom en partie active', () => {
        const doc = mockDoc('');
        syncShellViewport(GAME_STATE.PLAYING, doc);
        expect(doc.meta.content).toContain('user-scalable=no');
        expect(doc.meta.content).toContain('maximum-scale=1.0');
    });
});
