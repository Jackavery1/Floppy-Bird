import { test, expect } from '@playwright/test';
import { GAME_CONFIG } from '../src/config.js';
import {
    expectGameState,
    isMobilePortraitProject,
    projectUsesTouch,
    startPlayingFromMenu,
    waitForGameReady,
} from './helpers/gameCoords.mjs';
import {
    bumpScore,
    getGameplayEquity,
    getRoundScore,
    getScoreHud,
    grantCoyoteGrace,
    requestJump,
    triggerDeath,
} from './helpers/testSeam.mjs';

test.describe('gameplay equity via test seam', () => {
    test('expose buffer, coyote et invincibilité spawn au démarrage', async ({
        page,
    }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);

        await expect
            .poll(async () => getGameplayEquity(page))
            .toMatchObject({
                jumpBufferMax: GAME_CONFIG.bird.jumpBufferFrames,
                coyoteMax: GAME_CONFIG.bird.coyoteTimeFrames,
                spawnInvincibilityMs: GAME_CONFIG.round.spawnInvincibilityMs,
                spawnInvincible: true,
            });
    });

    test('requestJump pose le buffer de saut', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);

        const equity = await page.evaluate(() => {
            window.__FLOPPY_TEST__?.requestJump?.();
            return window.__FLOPPY_TEST__?.getGameplayEquity?.();
        });

        expect(equity?.jumpBufferFrames).toBe(GAME_CONFIG.bird.jumpBufferFrames);
    });

    test('grantCoyoteGrace active la grâce coyote', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);

        await grantCoyoteGrace(page, GAME_CONFIG.bird.coyoteTimeFrames);
        await expect
            .poll(async () => getGameplayEquity(page))
            .toMatchObject({
                coyoteFrames: GAME_CONFIG.bird.coyoteTimeFrames,
                hasCoyoteGrace: true,
            });
    });

    test('délai premier tuyau laisse une fenêtre après invincibilité spawn', async ({
        page,
    }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);

        const equity = await getGameplayEquity(page);
        expect(equity?.spawnInvincibilityMs).toBe(GAME_CONFIG.round.spawnInvincibilityMs);
        expect(GAME_CONFIG.round.pipeSpawnDelayMs).toBeGreaterThan(equity?.spawnInvincibilityMs);
    });

    test('sauts répétés maintiennent la partie active', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);

        for (let i = 0; i < 8; i++) {
            await requestJump(page);
            await page.waitForTimeout(250);
        }
        await expectGameState(page, 'playing');
    });

    test('score 3 points via seam reflète le HUD', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);
        await bumpScore(page, 3);
        await expect.poll(async () => getScoreHud(page)).toMatchObject({ text: '3' });
        expect(await getRoundScore(page)).toBe(3);
    });

    test('collision tuyau déclenche la mort', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);
        await triggerDeath(page, 'pipe');
        await expectGameState(page, 'dying', 5_000);
        await expectGameState(page, 'gameover', 15_000);
    });
});

test.describe('gameplay equity mobile portrait', () => {
    test('buffer de saut disponible en partie mobile', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);

        await requestJump(page);
        const equity = await getGameplayEquity(page);
        expect(equity?.jumpBufferMax).toBe(4);
    });

    test('invincibilité spawn active en mobile portrait', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);

        await expect
            .poll(async () => getGameplayEquity(page))
            .toMatchObject({ spawnInvincible: true });
    });
});
