import { describe, it, expect } from 'vitest';
import { GAME_STATE } from '../src/gameState.js';
import { syncShellGameState } from '../src/shellGameState.js';

function mockDoc() {
    const root = {
        classList: {
            toggled: /** @type {Record<string, boolean>} */ ({}),
            toggle(cls, on) {
                this.toggled[cls] = on;
            },
        },
        dataset: /** @type {Record<string, string>} */ ({}),
        removeAttribute() {},
    };
    return { documentElement: root };
}

describe('shellGameState', () => {
    it('active partie-active en jeu, pause ou mort', () => {
        const doc = mockDoc();
        syncShellGameState(GAME_STATE.PLAYING, doc);
        expect(doc.documentElement.classList.toggled['partie-active']).toBe(true);
        syncShellGameState(GAME_STATE.PAUSED, doc);
        expect(doc.documentElement.classList.toggled['partie-active']).toBe(true);
        syncShellGameState(GAME_STATE.DYING, doc);
        expect(doc.documentElement.classList.toggled['partie-active']).toBe(true);
    });

    it('désactive partie-active au menu et game over', () => {
        const doc = mockDoc();
        syncShellGameState(GAME_STATE.MENU, doc);
        expect(doc.documentElement.classList.toggled['partie-active']).toBe(false);
        syncShellGameState(GAME_STATE.GAME_OVER, doc);
        expect(doc.documentElement.classList.toggled['partie-active']).toBe(false);
    });

    it('expose data-game-state sur html', () => {
        const doc = mockDoc();
        syncShellGameState(GAME_STATE.PLAYING, doc);
        expect(doc.documentElement.dataset.gameState).toBe('playing');
    });
});
