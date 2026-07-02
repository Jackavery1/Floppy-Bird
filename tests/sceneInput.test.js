import { describe, it, expect, vi } from 'vitest';
import { setupSceneInput } from '../src/sceneInput.js';
import { DIFFICULTY } from '../src/config.js';
import { GAME_STATE } from '../src/gameState.js';

vi.mock('../src/audio.js', () => ({ resumeAudio: vi.fn() }));

describe('sceneInput', () => {
    function makeScene(state = GAME_STATE.MENU) {
        const handlers = {};
        const pointerHandlers = [];
        return {
            state,
            handlePrimaryAction: vi.fn(),
            changeDifficulty: vi.fn(),
            toggleTraining: vi.fn(),
            toggleHardcore: vi.fn(),
            launchDailyChallenge: vi.fn(),
            togglePause: vi.fn(),
            returnToMenu: vi.fn(),
            input: {
                keyboard: {
                    on: vi.fn((key, fn) => { handlers[key] = fn; }),
                },
                on: vi.fn((_event, fn) => { pointerHandlers.push(fn); }),
                hitTestPointer: vi.fn(() => []),
            },
            _handlers: handlers,
            _pointerHandlers: pointerHandlers,
        };
    }

    it('branche clavier et pointer', () => {
        const scene = makeScene();
        setupSceneInput(scene);
        expect(scene.input.keyboard.on).toHaveBeenCalledWith('keydown-SPACE', expect.any(Function));
        scene._handlers['keydown-SPACE']({ repeat: true });
        expect(scene.handlePrimaryAction).not.toHaveBeenCalled();
        scene._handlers['keydown-SPACE']({ repeat: false });
        expect(scene.handlePrimaryAction).toHaveBeenCalled();
        scene._handlers['keydown-TWO']();
        expect(scene.changeDifficulty).toHaveBeenCalledWith(DIFFICULTY.NORMAL);
        scene._handlers['keydown-T']();
        expect(scene.toggleTraining).toHaveBeenCalled();
    });

    it('ESC bascule la pause en jeu', () => {
        const scene = makeScene(GAME_STATE.PLAYING);
        setupSceneInput(scene);
        scene._handlers['keydown-ESC']();
        expect(scene.togglePause).toHaveBeenCalled();
    });

    it('M retourne au menu depuis la pause', () => {
        const scene = makeScene(GAME_STATE.PAUSED);
        setupSceneInput(scene);
        scene._handlers['keydown-M']();
        expect(scene.returnToMenu).toHaveBeenCalled();
    });

    it('pointerdown ignore les clics UI et déclenche sinon', async () => {
        const { resumeAudio } = await import('../src/audio.js');
        const scene = makeScene(GAME_STATE.PLAYING);
        setupSceneInput(scene);
        const pointer = {};
        scene._pointerHandlers[0](pointer);
        expect(resumeAudio).toHaveBeenCalled();
        expect(scene.handlePrimaryAction).toHaveBeenCalled();

        scene.handlePrimaryAction.mockClear();
        scene.input.hitTestPointer.mockReturnValue([{ input: { enabled: true } }]);
        scene._pointerHandlers[0](pointer);
        expect(scene.handlePrimaryAction).not.toHaveBeenCalled();
    });

    it('H bascule le hardcore', () => {
        const scene = makeScene();
        setupSceneInput(scene);
        scene._handlers['keydown-H']();
        expect(scene.toggleHardcore).toHaveBeenCalled();
    });

    it('D lance le défi du jour au menu', () => {
        const scene = makeScene(GAME_STATE.MENU);
        setupSceneInput(scene);
        scene._handlers['keydown-D']();
        expect(scene.launchDailyChallenge).toHaveBeenCalled();
    });

    it('O ouvre les options au menu', () => {
        const scene = makeScene(GAME_STATE.MENU);
        scene.ui = { toggleMenuOptionsPanel: vi.fn() };
        setupSceneInput(scene);
        scene._handlers['keydown-O']();
        expect(scene.ui.toggleMenuOptionsPanel).toHaveBeenCalled();
    });

    it('S ouvre les scores au menu', () => {
        const scene = makeScene(GAME_STATE.MENU);
        scene.ui = { toggleMenuScoresPanel: vi.fn() };
        setupSceneInput(scene);
        scene._handlers['keydown-S']();
        expect(scene.ui.toggleMenuScoresPanel).toHaveBeenCalled();
    });

    it('K ouvre les skins au menu', () => {
        const scene = makeScene(GAME_STATE.MENU);
        scene.ui = { toggleMenuSkinsPanel: vi.fn() };
        setupSceneInput(scene);
        scene._handlers['keydown-K']();
        expect(scene.ui.toggleMenuSkinsPanel).toHaveBeenCalled();
    });
});
