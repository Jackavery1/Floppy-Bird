import { test, expect } from '@playwright/test';
import { DEPTH } from '../src/uiDepth.js';
import { UI_LAYOUT } from '../src/uiLayout.js';
import {
    expectGameState,
    startPlayingFromMenu,
    waitForGameReady,
} from './helpers/gameCoords.mjs';

test.describe('score HUD', () => {
    test('affiche 0 visible au démarrage de partie', async ({ page }) => {
        await waitForGameReady(page);
        await page.keyboard.press('Space');
        await expectGameState(page, 'playing');

        await expect.poll(() => page.evaluate(() => window.__FLOPPY_TEST__.getScoreHud())).toMatchObject({
            visible: true,
            alpha: 1,
            text: '0',
            depth: DEPTH.SCORE_HUD,
        });
        const hud = await page.evaluate(() => window.__FLOPPY_TEST__.getScoreHud());
        expect(hud.y).toBeGreaterThanOrEqual(UI_LAYOUT.scoreHud - 2);
    });

    test('met à jour le score via test seam', async ({ page }) => {
        await waitForGameReady(page);
        await startPlayingFromMenu(page, false);

        await page.evaluate(() => window.__FLOPPY_TEST__.bumpScore(3));
        await expect.poll(() => page.evaluate(() => window.__FLOPPY_TEST__.getScoreHud()?.text)).toBe('3');
    });
});
