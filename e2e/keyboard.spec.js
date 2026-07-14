import { test, expect } from '@playwright/test';
import {
    forceGameOver,
    getDailyChallengeMode,
    getGameOverRestartLabel,
    getGameplayEquity,
    getTestState,
} from './helpers/testSeam.mjs';
import {
    enterPausedFromPlaying,
    expectGameState,
    isMobileLandscapeProject,
    isMobilePortraitProject,
    openPauseFromPlaying,
    projectUsesTouch,
    startPlayingFromMenu,
    waitForGameReady,
} from './helpers/gameCoords.mjs';

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
        await expect.poll(() => getGameOverRestartLabel(page)).toBe('REJOUER');
        await page.keyboard.press('Space');
        await expectGameState(page, 'playing');
    });

    test('game over défi quotidien affiche REJOUER avec hint défi', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await forceGameOver(page, { isDaily: true });
        await expectGameState(page, 'gameover');
        await expect.poll(() => getGameOverRestartLabel(page)).toBe('REJOUER');
        await expect(page.locator('#a11y-gameover-restart')).toHaveAttribute(
            'aria-label',
            /rejouer le défi/i
        );
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

    test('focus difficulté affiche un contour focus-visible', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await page.locator('#a11y-diff-normal').focus();
        const outline = await page.locator('#a11y-diff-normal').evaluate((el) => {
            const style = getComputedStyle(el);
            return {
                outlineWidth: style.outlineWidth,
                borderColor: style.borderColor,
            };
        });
        expect(Number.parseFloat(outline.outlineWidth)).toBeGreaterThan(0);
        await expect(page.locator('#a11y-diff-normal')).toHaveAttribute('aria-pressed', 'true');
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

    test('bouton a11y affiche un contour focus-visible', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await page.locator('#a11y-start').focus();
        const outline = await page.locator('#a11y-start').evaluate((el) => {
            const style = getComputedStyle(el);
            return {
                outlineWidth: style.outlineWidth,
                outlineColor: style.outlineColor,
                opacity: style.opacity,
            };
        });
        expect(outline.opacity).not.toBe('0');
        expect(outline.outlineWidth).not.toBe('0px');
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

    test('Tab puis Entrée sur menu game over retourne au menu', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await forceGameOver(page);
        await expectGameState(page, 'gameover');
        for (let i = 0; i < 16; i++) {
            const id = await page.evaluate(() => document.activeElement?.id ?? '');
            if (id === 'a11y-gameover-menu') break;
            await page.keyboard.press('Tab');
        }
        await expect(page.locator('#a11y-gameover-menu')).toBeFocused();
        await page.keyboard.press('Enter');
        await expectGameState(page, 'menu');
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

test.describe('clavier mobile portrait (couche a11y)', () => {
    test('Tab puis Entrée sur jouer démarre la partie', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
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

    test('bouton a11y affiche un contour focus-visible', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        await waitForGameReady(page);
        await page.locator('#a11y-start').focus();
        const outline = await page.locator('#a11y-start').evaluate((el) => {
            const style = getComputedStyle(el);
            return {
                outlineWidth: style.outlineWidth,
                opacity: style.opacity,
            };
        });
        expect(outline.opacity).not.toBe('0');
        expect(outline.outlineWidth).not.toBe('0px');
    });

    test('Tab ouvre options puis focus entraînement', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        await waitForGameReady(page);
        await page.locator('#a11y-options').focus();
        await page.keyboard.press('Enter');
        await expect(page.locator('#a11y-training')).toBeVisible();
        await page.locator('#a11y-training').focus();
        await expect(page.locator('#a11y-training')).toBeFocused();
    });

    test('bouton saut a11y démarre une action en jeu', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);
        const jumpBtn = page.locator('#a11y-jump');
        await expect(jumpBtn).toBeVisible();
        await jumpBtn.focus();
        await expect(jumpBtn).toBeFocused();
        await page.keyboard.press('Enter');
        await expect
            .poll(async () => (await getGameplayEquity(page))?.jumpBufferFrames ?? 0)
            .toBeGreaterThan(0);
    });
});

test.describe('clavier webkit mobile portrait', () => {
    test('Tab puis Entrée sur jouer', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'webkit-mobile-portrait', 'webkit portrait uniquement');
        await waitForGameReady(page);
        await page.locator('#a11y-start').focus();
        await page.keyboard.press('Enter');
        await expect.poll(async () => getTestState(page)).toBe('playing');
    });

    test('Tab ouvre options et onglet réglages', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'webkit-mobile-portrait', 'webkit portrait uniquement');
        await waitForGameReady(page);
        await page.locator('#a11y-options').focus();
        await page.keyboard.press('Enter');
        await expect(page.locator('#a11y-options-tab-preferences')).toBeVisible();
        await page.locator('#a11y-options-tab-controls').focus();
        await page.keyboard.press('Enter');
        await expect(page.locator('#a11y-training')).toBeVisible();
    });
});

test.describe('clavier paysage et tablette (smoke)', () => {
    test('mobile landscape — Tab Entrée démarre (hint masqué e2e)', async ({ page }, testInfo) => {
        test.skip(!isMobileLandscapeProject(testInfo.project.name), 'mobile landscape uniquement');
        await waitForGameReady(page, { hideLandscapeHint: true });
        await page.locator('#a11y-start').focus();
        await page.keyboard.press('Enter');
        await expectGameState(page, 'playing');
    });

    test('webkit mobile landscape — Tab Entrée démarre', async ({ page }, testInfo) => {
        test.skip(
            testInfo.project.name !== 'webkit-mobile-landscape',
            'webkit landscape uniquement'
        );
        await waitForGameReady(page, { hideLandscapeHint: true });
        await page.locator('#a11y-start').focus();
        await page.keyboard.press('Enter');
        await expectGameState(page, 'playing');
    });

    test('tablette paysage — ESPACE démarre et ESC ouvre la pause', async ({ page }, testInfo) => {
        test.skip(
            testInfo.project.name !== 'chromium-tablet-landscape',
            'tablette paysage uniquement'
        );
        await waitForGameReady(page);
        await page.keyboard.press('Space');
        await expectGameState(page, 'playing');
        await page.keyboard.press('Escape');
        await expectGameState(page, 'paused', 10_000);
    });
});
