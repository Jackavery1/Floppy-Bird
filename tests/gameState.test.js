import { describe, it, expect, afterEach } from 'vitest';
import { setE2eBackgroundFrozen } from '../src/e2eVisualFreeze.js';
import {
    GAME_STATE,
    canChangeDifficulty,
    canHandlePrimaryAction,
    canReturnToMenu,
    canTogglePause,
    canTriggerDeath,
    shouldStartGameOnPrimary,
    shouldUpdateDying,
    shouldUpdateGameplay,
    shouldScrollGround,
    shouldAnimateBackground,
} from '../src/gameState.js';

describe('gameState', () => {
    afterEach(() => {
        setE2eBackgroundFrozen(false);
    });

    it('bloque l’action primaire en pause et en mort', () => {
        expect(canHandlePrimaryAction(GAME_STATE.PAUSED)).toBe(false);
        expect(canHandlePrimaryAction(GAME_STATE.DYING)).toBe(false);
        expect(canHandlePrimaryAction(GAME_STATE.PLAYING)).toBe(true);
    });

    it('autorise le démarrage depuis menu et game over', () => {
        expect(shouldStartGameOnPrimary(GAME_STATE.MENU)).toBe(true);
        expect(shouldStartGameOnPrimary(GAME_STATE.GAME_OVER)).toBe(true);
        expect(shouldStartGameOnPrimary(GAME_STATE.PLAYING)).toBe(false);
    });

    it('bloque le démarrage si un panneau menu est ouvert', () => {
        const ui = { _optionsOpen: true, _scoresOpen: false, _skinsOpen: false };
        expect(shouldStartGameOnPrimary(GAME_STATE.MENU, ui)).toBe(false);
        expect(
            shouldStartGameOnPrimary(GAME_STATE.MENU, { _optionsOpen: false, _scoresOpen: true })
        ).toBe(false);
    });

    it('limite le changement de difficulté au menu', () => {
        expect(canChangeDifficulty(GAME_STATE.MENU)).toBe(true);
        expect(canChangeDifficulty(GAME_STATE.PLAYING)).toBe(false);
    });

    it('gère pause et retour menu', () => {
        expect(canTogglePause(GAME_STATE.PLAYING)).toBe(true);
        expect(canTogglePause(GAME_STATE.PAUSED)).toBe(true);
        expect(canTogglePause(GAME_STATE.MENU)).toBe(false);
        expect(canReturnToMenu(GAME_STATE.PAUSED)).toBe(true);
        expect(canReturnToMenu(GAME_STATE.GAME_OVER)).toBe(true);
        expect(canReturnToMenu(GAME_STATE.PLAYING)).toBe(false);
    });

    it('sépare gameplay, mort et défilement du sol', () => {
        expect(shouldUpdateGameplay(GAME_STATE.PLAYING)).toBe(true);
        expect(shouldUpdateGameplay(GAME_STATE.PAUSED)).toBe(false);
        expect(shouldUpdateDying(GAME_STATE.DYING)).toBe(true);
        expect(shouldScrollGround(GAME_STATE.PLAYING)).toBe(true);
        expect(shouldScrollGround(GAME_STATE.PAUSED)).toBe(false);
    });

    it('anime le fond en menu et en jeu seulement', () => {
        expect(shouldAnimateBackground(GAME_STATE.MENU)).toBe(true);
        expect(shouldAnimateBackground(GAME_STATE.PLAYING)).toBe(true);
        expect(shouldAnimateBackground(GAME_STATE.PAUSED)).toBe(false);
        expect(shouldAnimateBackground(GAME_STATE.DYING)).toBe(false);
    });

    it('fige le fond quand le flag e2e est actif', () => {
        setE2eBackgroundFrozen(true);
        expect(shouldAnimateBackground(GAME_STATE.MENU)).toBe(false);
        expect(shouldAnimateBackground(GAME_STATE.PLAYING)).toBe(false);
    });

    it('empêche un double déclenchement de mort', () => {
        expect(canTriggerDeath(GAME_STATE.PLAYING)).toBe(true);
        expect(canTriggerDeath(GAME_STATE.DYING)).toBe(false);
        expect(canTriggerDeath(GAME_STATE.GAME_OVER)).toBe(false);
    });
});
