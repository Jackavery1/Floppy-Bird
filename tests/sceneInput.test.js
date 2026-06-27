import { describe, it, expect, vi } from 'vitest';
import { setupSceneInput } from '../src/sceneInput.js';
import { DIFFICULTY } from '../src/config.js';

vi.mock('../src/audio.js', () => ({ resumeAudio: vi.fn() }));

describe('sceneInput', () => {
    it('branche clavier et pointer', () => {
        const handlers = {};
        const scene = {
            handlePrimaryAction: vi.fn(),
            changeDifficulty: vi.fn(),
            toggleTraining: vi.fn(),
            togglePause: vi.fn(),
            returnToMenu: vi.fn(),
            input: {
                keyboard: {
                    on: vi.fn((key, fn) => { handlers[key] = fn; }),
                },
                on: vi.fn(),
            },
        };
        setupSceneInput(scene);
        expect(scene.input.keyboard.on).toHaveBeenCalledWith('keydown-SPACE', expect.any(Function));
        handlers['keydown-SPACE']();
        expect(scene.handlePrimaryAction).toHaveBeenCalled();
        handlers['keydown-TWO']();
        expect(scene.changeDifficulty).toHaveBeenCalledWith(DIFFICULTY.NORMAL);
        handlers['keydown-T']();
        expect(scene.toggleTraining).toHaveBeenCalled();
    });
});
