import { test, expect } from '@playwright/test';
import { GAME_CONFIG } from '../src/config.js';
import {
    dismissLandscapeHint,
    expectGameState,
    startPlayingFromMenu,
    waitForGameReady,
} from './helpers/gameCoords.mjs';
import { readJumpButtonAlignment } from './helpers/visualViewport.mjs';

async function assertRotationMidGame(page) {
    const ratio = GAME_CONFIG.width / GAME_CONFIG.height;
    await page.setViewportSize({ width: 844, height: 390 });
    await page.waitForTimeout(200);
    await dismissLandscapeHint(page);

    const box = await page.locator('#game-container canvas').boundingBox();
    expect(box).not.toBeNull();
    expect(box.width / box.height).toBeCloseTo(ratio, 1);
    await expectGameState(page, 'playing');

    const alignment = await readJumpButtonAlignment(page);
    expect(alignment).not.toBeNull();
    expect(alignment.jumpW).toBeGreaterThanOrEqual(44);
    expect(alignment.jumpH).toBeGreaterThanOrEqual(44);
    expect(alignment.deltaX).toBeLessThan(32);
    expect(alignment.deltaY).toBeLessThan(32);
}

test.describe('rotation en cours de partie', () => {
    test('conserve le ratio après rotation (Chromium mobile)', async ({ page }, testInfo) => {
        test.skip(
            testInfo.project.name !== 'chromium-mobile-portrait',
            'mobile portrait uniquement'
        );
        await waitForGameReady(page);
        await startPlayingFromMenu(page, true);
        await expectGameState(page, 'playing');
        await assertRotationMidGame(page);
    });

    test('conserve le ratio après rotation (WebKit mobile)', async ({ page }, testInfo) => {
        test.skip(
            testInfo.project.name !== 'webkit-mobile-portrait',
            'WebKit mobile portrait uniquement'
        );
        await waitForGameReady(page);
        await startPlayingFromMenu(page, true);
        await expectGameState(page, 'playing');
        await assertRotationMidGame(page);
    });
});
