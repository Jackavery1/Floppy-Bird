import { test, expect } from '@playwright/test';
import {
    expectGameState,
    isMobilePortraitProject,
    projectUsesTouch,
    replayFromGameOver,
    waitForGameReady,
} from './helpers/gameCoords.mjs';
import { forceGameOver, getGameOverRestartLabel } from './helpers/testSeam.mjs';

test.describe('touch game over', () => {
    test('rejoue via tap sur le bouton REJOUER', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await forceGameOver(page);
        await expectGameState(page, 'gameover');
        await expect.poll(() => getGameOverRestartLabel(page)).toBe('REJOUER');
        await replayFromGameOver(page, usesTouch);
    });

    test('game over défi quotidien affiche REJOUER', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        await waitForGameReady(page);
        await forceGameOver(page, { isDaily: true });
        await expectGameState(page, 'gameover');
        await expect.poll(() => getGameOverRestartLabel(page)).toBe('REJOUER');
    });

    test('rejoue via bouton a11y DOM game over', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        await waitForGameReady(page);
        await forceGameOver(page);
        await expectGameState(page, 'gameover');
        await expect(page.locator('#a11y-gameover-restart')).toBeVisible();
        await page.locator('#a11y-gameover-restart').tap({ force: true });
        await expectGameState(page, 'playing');
    });
});
