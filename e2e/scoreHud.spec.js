import { test, expect } from '@playwright/test';
import { DEPTH } from '../src/uiDepth.js';
import { TOUCH_TARGETS, UI_LAYOUT } from '../src/uiLayout.js';
import {
    isMobileLandscapeProject,
    projectUsesTouch,
    startPlayingFromMenu,
    waitForGameReady,
} from './helpers/gameCoords.mjs';
import { bumpScore, getScoreHud } from './helpers/testSeam.mjs';

test.describe('score HUD', () => {
    test('affiche 0 visible au démarrage de partie', async ({ page }, testInfo) => {
        test.skip(isMobileLandscapeProject(testInfo.project.name), 'hint paysage bloque le jeu');
        await waitForGameReady(page);
        await startPlayingFromMenu(page, projectUsesTouch(testInfo));

        await expect
            .poll(() => getScoreHud(page))
            .toMatchObject({
                visible: true,
                alpha: 1,
                text: '0',
                depth: DEPTH.SCORE_HUD,
            });
        const hud = await getScoreHud(page);
        expect(hud.y).toBeGreaterThanOrEqual(TOUCH_TARGETS.scoreHud.y - 2);
        expect(hud.y).toBeGreaterThanOrEqual(UI_LAYOUT.scoreHud - 2);
    });

    test('met à jour le score via test seam', async ({ page }, testInfo) => {
        test.skip(isMobileLandscapeProject(testInfo.project.name), 'hint paysage bloque le jeu');
        await waitForGameReady(page);
        await startPlayingFromMenu(page, projectUsesTouch(testInfo));

        await bumpScore(page, 3);
        await expect.poll(async () => (await getScoreHud(page))?.text).toBe('3');
    });
});
