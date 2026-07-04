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

    test('Tab puis Entrée sur jouer démarre la partie', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        for (let i = 0; i < 12; i++) {
            const id = await page.evaluate(() => document.activeElement?.id ?? '');
            if (id === 'a11y-start') break;
            await page.keyboard.press('Tab');
        }
        await expect(page.locator('#a11y-start')).toBeFocused();
        await page.keyboard.press('Enter');
        await expectGameState(page, 'playing');
    });

    test('Tab sur difficulté normale change la difficulté', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await page.locator('#a11y-diff-normal').focus();
        await page.keyboard.press('Enter');
        await expectGameState(page, 'menu');
    });

    test('Tab ouvre options puis focus entraînement', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await page.locator('#a11y-options').focus();
        await page.keyboard.press('Enter');
        await expect(page.locator('#a11y-training')).toBeVisible();
        await page.locator('#a11y-training').focus();
        await expect(page.locator('#a11y-training')).toBeFocused();
    });

    test('Tab ouvre skins puis focus skin suivant', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await page.locator('#a11y-skins').focus();
        await page.keyboard.press('Enter');
        await expect(page.locator('#a11y-skin-next')).toBeVisible();
        await page.locator('#a11y-skin-next').focus();
        await expect(page.locator('#a11y-skin-next')).toBeFocused();
    });

    test('K puis flèches cycle les skins au menu', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await page.keyboard.press('KeyK');
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('ArrowLeft');
        await expectGameState(page, 'menu');
    });
});
