import { test } from '@playwright/test';
import { GAME_CONFIG } from '../src/config.js';
import {
    enterPausedFromMenu,
    expectGameState,
    tapGameCoord,
    waitForGameReady,
} from './helpers/gameCoords.mjs';

test.describe('touch mobile portrait', () => {
    test('pause → reprendre via tap', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-mobile-portrait', 'mobile portrait uniquement');
        await waitForGameReady(page);
        await enterPausedFromMenu(page);
        await tapGameCoord(page, GAME_CONFIG.centerX, 250);
        await expectGameState(page, 'playing');
    });

    test('pause → menu via tap', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-mobile-portrait', 'mobile portrait uniquement');
        await waitForGameReady(page);
        await enterPausedFromMenu(page);
        await tapGameCoord(page, GAME_CONFIG.centerX, 298);
        await expectGameState(page, 'menu');
    });
});

test.describe('touch mobile landscape', () => {
    test('peut atteindre la pause en paysage', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-mobile-landscape', 'mobile landscape uniquement');
        await waitForGameReady(page);
        await enterPausedFromMenu(page);
    });
});

test.describe('pointer desktop', () => {
    test('peut atteindre la pause depuis le jeu', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await enterPausedFromMenu(page);
    });
});
