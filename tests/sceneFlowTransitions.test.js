import { describe, it, expect } from 'vitest';
import { GAME_STATE } from '../src/gameState.js';
import {
    applyPausedState,
    applyPlayingState,
    resumeClock,
} from '../src/sceneFlowTransitions.js';
import { createRoundState } from '../src/roundState.js';

describe('sceneFlowTransitions', () => {
    function makeScene() {
        return {
            state: GAME_STATE.PLAYING,
            time: { paused: false },
            round: createRoundState(),
        };
    }

    it('applyPausedState met en pause', () => {
        const scene = makeScene();
        applyPausedState(scene);
        expect(scene.state).toBe(GAME_STATE.PAUSED);
        expect(scene.time.paused).toBe(true);
    });

    it('applyPlayingState reprend', () => {
        const scene = makeScene();
        applyPausedState(scene);
        applyPlayingState(scene);
        expect(scene.state).toBe(GAME_STATE.PLAYING);
        expect(scene.time.paused).toBe(false);
    });

    it('resumeClock débloque le timer sans changer l’état', () => {
        const scene = makeScene();
        scene.time.paused = true;
        resumeClock(scene);
        expect(scene.time.paused).toBe(false);
        expect(scene.state).toBe(GAME_STATE.PLAYING);
    });
});
