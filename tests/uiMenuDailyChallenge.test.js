import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    buildMenuDailyChallenge,
    refreshDailyChallengeButton,
} from '../src/uiMenuDailyChallenge.js';
import { UI } from '../src/ui.js';
import { DIFFICULTY } from '../src/config.js';
import { DEPTH, MIN_TOUCH, UI_LAYOUT } from '../src/uiLayout.js';
import { createBaseScene } from './helpers/phaserMock.js';
import { createRoundState } from '../src/roundState.js';

describe('uiMenuDailyChallenge', () => {
    let scene;
    let ui;
    let elements;
    let layout;

    beforeEach(() => {
        scene = createBaseScene({
            round: createRoundState(),
            launchDailyChallenge: vi.fn(),
        });
        ui = new UI(scene);
        elements = [];
        layout = { ...UI_LAYOUT.menu };
    });

    it('buildMenuDailyChallenge crée le bouton défi du jour', () => {
        buildMenuDailyChallenge(ui, elements, layout, DIFFICULTY.NORMAL);
        expect(ui._dailyBtnBg).toBeTruthy();
        expect(ui._dailyBtnLabel).toBeTruthy();
        expect(ui._dailyBtnHit).toBeTruthy();
        expect(ui._dailyBtnHit.setDepth).toHaveBeenCalledWith(DEPTH.MENU_HIT);
        expect(scene.add.rectangle).toHaveBeenCalledWith(
            expect.any(Number),
            layout.dailyBtn,
            228,
            MIN_TOUCH,
            expect.any(Number),
            expect.any(Number)
        );
    });

    it('le tap lance le défi quotidien', () => {
        buildMenuDailyChallenge(ui, elements, layout, DIFFICULTY.NORMAL);
        const handler = ui._dailyBtnHit.on.mock.calls.find(([evt]) => evt === 'pointerdown')?.[1];
        handler?.(null, null, null, { stopPropagation: vi.fn() });
        expect(scene.launchDailyChallenge).toHaveBeenCalled();
    });

    it('refreshDailyChallengeButton met à jour le libellé', () => {
        buildMenuDailyChallenge(ui, elements, layout, DIFFICULTY.EASY);
        refreshDailyChallengeButton(ui, DIFFICULTY.HARD);
        expect(ui._dailyBtnLabel.setText).toHaveBeenCalled();
    });
});
