import { test, expect } from '@playwright/test';
import { GAME_CONFIG } from '../src/config.js';
import { tapGameCoord, waitForGameReady } from './helpers/gameCoords.mjs';

test.describe('touch mobile portrait', () => {
    test('pause → reprendre via tap', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-mobile-portrait', 'mobile portrait uniquement');
        await waitForGameReady(page);
        await tapGameCoord(page, GAME_CONFIG.centerX, 400);
        await expect(page.getByText('PAUSE')).not.toBeVisible();

        await tapGameCoord(page, 264, 28);
        await expect(page.getByText('PAUSE')).toBeVisible({ timeout: 5_000 });

        await tapGameCoord(page, GAME_CONFIG.centerX, 250);
        await expect(page.getByText('PAUSE')).not.toBeVisible({ timeout: 5_000 });
    });

    test('pause → menu via tap', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-mobile-portrait', 'mobile portrait uniquement');
        await waitForGameReady(page);
        await tapGameCoord(page, GAME_CONFIG.centerX, 400);
        await tapGameCoord(page, 264, 28);
        await expect(page.getByText('PAUSE')).toBeVisible({ timeout: 5_000 });

        await tapGameCoord(page, GAME_CONFIG.centerX, 298);
        await expect(page.getByText('APPUYER POUR JOUER')).toBeVisible({ timeout: 5_000 });
    });
});

test.describe('touch mobile landscape', () => {
    test('pause via tap en paysage', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-mobile-landscape', 'mobile landscape uniquement');
        await waitForGameReady(page);
        await tapGameCoord(page, GAME_CONFIG.centerX, 400);
        await tapGameCoord(page, 264, 28);
        await expect(page.getByText('PAUSE')).toBeVisible({ timeout: 5_000 });
    });
});
