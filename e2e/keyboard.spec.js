import { test, expect } from '@playwright/test';
import {
    enterPausedFromPlaying,
    expectGameState,
    openPauseFromPlaying,
    projectUsesTouch,
    startPlayingFromMenu,
    waitForGameReady,
} from './helpers/gameCoords.mjs';
import { forceGameOver, getDailyChallengeMode } from './helpers/testSeam.mjs';

test.describe('clavier desktop', () => {
    test('ESPACE démarre puis ESC ouvre la pause', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await page.keyboard.press('Space');
        await expectGameState(page, 'playing');

        await page.keyboard.press('Escape');
        await expectGameState(page, 'paused', 10_000);

        await page.waitForTimeout(300);
        await page.keyboard.press('Escape');
        await expectGameState(page, 'playing', 10_000);
    });

    test('clic sur le bouton pause ouvre la pause', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);
        await openPauseFromPlaying(page, usesTouch);
    });

    test('M retourne au menu depuis la pause', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await enterPausedFromPlaying(page, false);
        await page.keyboard.press('KeyM');
        await expectGameState(page, 'menu');
    });

    test('D lance le défi du jour depuis le menu', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        const before = await getDailyChallengeMode(page);
        await page.keyboard.press('KeyD');
        await expect.poll(() => getDailyChallengeMode(page)).not.toBe(before);
        await expectGameState(page, 'playing', 3_000);
    });

    test('ESPACE rejoue depuis le game over', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await forceGameOver(page);
        await expectGameState(page, 'gameover');
        await page.keyboard.press('Space');
        await expectGameState(page, 'playing');
    });
});
