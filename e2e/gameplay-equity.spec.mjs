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
    cycleTrainingSpeedTimes,
    getDifficultyMetrics,
    getGameplayEquity,
    getPipeState,
    getRoundScore,
    getScoreHud,
    getTestState,
    getTrainingRuntime,
    getRoundRuntime,
    getLastDeathMetrics,
    grantCoyoteGrace,
    alignBirdInFirstGap,
    holdBirdAtCenter,
    keepBirdAliveForPipeSpawn,
    runSurvivalScenario,
    requestJump,
    restartRoundWithModes,
    runCoyoteGapExitScenario,
    sampleGapVariance,
    triggerDeath,
    probeAudio,
    probeHaptics,
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

        await requestJump(page);
        const equity = await getGameplayEquity(page);

        expect(equity?.jumpBufferFrames).toBe(GAME_CONFIG.bird.jumpBufferFrames);
    });

    test('grantCoyoteGrace active le coyote time', async ({ page }, testInfo) => {
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

    test('coyote réel protège après sortie de gap puis expire', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await restartRoundWithModes(page, { hardcore: false });

        const result = await runCoyoteGapExitScenario(page);
        expect(result?.coyoteInGap).toBe(GAME_CONFIG.bird.coyoteTimeFrames);
        expect(result?.collidesAfterExit).toBe(true);
        expect(result?.hasCoyoteAfterExit).toBe(true);
        expect(result?.noDeathDuringCoyote).toBe(true);
        expect(result?.coyoteExpired).toBe(true);
        expect(result?.deathAfterCoyoteExpired).toBe(true);
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
        expect(equity?.pipeSpawnDelayMs).toBe(GAME_CONFIG.round.pipeSpawnDelayMs);
        expect(equity?.pipeSpawnDelayMs).toBeGreaterThan(equity?.spawnInvincibilityMs);
    });

    test('premier tuyau n’apparaît pas avant la fin de l’invincibilité spawn', async ({
        page,
    }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);

        await page.waitForTimeout(GAME_CONFIG.round.spawnInvincibilityMs - 50);
        const early = await getPipeState(page);
        expect(early?.pipeCount ?? 0).toBe(0);
    });

    test('premier tuyau apparaît après le délai si l’oiseau reste en vie', async ({
        page,
    }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);

        await page.waitForTimeout(GAME_CONFIG.round.spawnInvincibilityMs - 50);
        expect((await getPipeState(page))?.pipeCount ?? 0).toBe(0);

        const waitAfterInvincibility =
            GAME_CONFIG.round.pipeSpawnDelayMs - (GAME_CONFIG.round.spawnInvincibilityMs - 50);
        for (let elapsed = 0; elapsed < waitAfterInvincibility + 600; elapsed += 250) {
            await requestJump(page);
            await page.waitForTimeout(250);
        }

        await expect
            .poll(async () => (await getPipeState(page))?.pipeCount ?? 0, { timeout: 5_000 })
            .toBeGreaterThan(0);
    });

    test('hardcore : invincibilité spawn avec marge avant premier tuyau', async ({
        page,
    }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);

        await restartRoundWithModes(page, { hardcore: true });
        await expect
            .poll(async () => getGameplayEquity(page))
            .toMatchObject({
                hardcoreMode: true,
                spawnInvincible: true,
                spawnInvincibilityMs: GAME_CONFIG.round.hardcoreSpawnInvincibilityMs,
            });

        const margin =
            GAME_CONFIG.round.pipeSpawnDelayMs -
            GAME_CONFIG.round.hardcoreSpawnInvincibilityMs;
        expect(margin).toBeGreaterThanOrEqual(400);
        expect(GAME_CONFIG.round.pipeSpawnDelayMs).toBeGreaterThan(
            GAME_CONFIG.round.hardcoreSpawnInvincibilityMs
        );

        await page.waitForTimeout(GAME_CONFIG.round.hardcoreSpawnInvincibilityMs - 50);
        const early = await getPipeState(page);
        expect(early?.pipeCount ?? 0).toBe(0);
    });

    test('hardcore : premier tuyau après le délai si l’oiseau reste en vie', async ({
        page,
    }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await restartRoundWithModes(page, { hardcore: true });

        await keepBirdAliveForPipeSpawn(
            page,
            GAME_CONFIG.round.pipeSpawnDelayMs,
            GAME_CONFIG.round.hardcoreSpawnInvincibilityMs
        );

        await expect
            .poll(async () => (await getPipeState(page))?.pipeCount ?? 0, { timeout: 8_000 })
            .toBeGreaterThan(0);
    });

    test('hardcore : pas de mort avant 5 s avec sauts réguliers', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await restartRoundWithModes(page, { hardcore: true });

        await keepBirdAliveForPipeSpawn(
            page,
            GAME_CONFIG.round.pipeSpawnDelayMs,
            GAME_CONFIG.round.hardcoreSpawnInvincibilityMs
        );

        const deadline = Date.now() + 5000;
        while (Date.now() < deadline) {
            expect(await getTestState(page)).toBe('playing');
            await alignBirdInFirstGap(page);
            await requestJump(page);
            await page.waitForTimeout(180);
        }

        await expectGameState(page, 'playing');
        const equity = await getGameplayEquity(page);
        expect(equity?.hardcoreMode).toBe(true);
        expect(equity?.spawnInvincible).toBe(false);
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
        const audio = await probeAudio(page);
        expect(audio).toMatchObject({ available: expect.any(Boolean) });
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

    test('probeAudio reste disponible après game over', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);
        await triggerDeath(page, 'pipe');
        await expectGameState(page, 'gameover', 15_000);
        const audio = await probeAudio(page);
        expect(audio).toMatchObject({ available: expect.any(Boolean) });
    });

    test('probeHaptics expose le support vibrate', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        const haptics = await probeHaptics(page);
        expect(haptics).toMatchObject({ supported: expect.any(Boolean) });
    });

    test('getRoundRuntime expose elapsedMs en partie', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await startPlayingFromMenu(page, false);
        await page.waitForTimeout(120);
        const runtime = await getRoundRuntime(page);
        expect(runtime).toMatchObject({
            state: 'playing',
            score: 0,
            startedAt: expect.any(Number),
            elapsedMs: expect.any(Number),
        });
        expect(runtime.startedAt).toBeGreaterThan(0);
        expect(runtime.elapsedMs).toBeGreaterThan(0);
    });

    test('getLastDeathMetrics expose cause et durée après mort', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await startPlayingFromMenu(page, false);
        await page.waitForTimeout(200);
        await triggerDeath(page, 'pipe');
        await expectGameState(page, 'gameover', 15_000);
        const death = await getLastDeathMetrics(page);
        expect(death).toMatchObject({
            cause: 'pipe',
            score: expect.any(Number),
            elapsedMs: expect.any(Number),
            isEarlyDeath: expect.any(Boolean),
            beforeFirstPipe: expect.any(Boolean),
        });
        expect(death.elapsedMs).toBeGreaterThan(0);
        expect(death.elapsedMs).toBeLessThan(30_000);
    });

    test('mode entraînement applique timeScale 0.8 (choix gameplay)', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await page.locator('#a11y-options').click();
        await expect(page.locator('#a11y-training')).toBeVisible();
        await page.locator('#a11y-training').click();
        await page.locator('#a11y-options-close').click();
        await startPlayingFromMenu(page, false);
        await expect
            .poll(async () => getTrainingRuntime(page))
            .toMatchObject({
                trainingMode: true,
                timeScale: GAME_CONFIG.training.timeScale,
                configTimeScale: GAME_CONFIG.training.timeScale,
            });
    });

    test('variance des gaps respecte le plafond de delta vertical', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        const variance = await sampleGapVariance(page, 32);
        expect(variance?.maxObservedDelta).toBeLessThanOrEqual(variance?.maxAllowedDelta);
        expect(variance?.spread).toBeGreaterThan(0);
    });

    test('métriques difficulté cohérentes aux scores 15, 20 et 25', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);

        const at15 = await getDifficultyMetrics(page, 15);
        expect(at15?.score).toBe(15);
        expect(at15?.speedMultiplier).toBeCloseTo(1.03, 2);
        expect(at15?.pipeGap).toBe(GAME_CONFIG.getDifficulty('normal').gap);

        const at20 = await getDifficultyMetrics(page, 20);
        expect(at20?.score).toBe(20);
        expect(at20?.speedMultiplier).toBeCloseTo(1.06, 2);
        expect(at20?.pipeGap).toBe(
            GAME_CONFIG.getDifficulty('normal').gap - GAME_CONFIG.round.gapTightenStep
        );

        const at25 = await getDifficultyMetrics(page, 25);
        expect(at25?.speedMultiplier).toBeCloseTo(1.06, 2);
        expect(at25?.pipeGap).toBe(at20?.pipeGap);
    });

    test('score 20 via seam reflète resserrement des gaps', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);
        await bumpScore(page, 20);
        const metrics = await getDifficultyMetrics(page);
        expect(metrics?.score).toBe(20);
        expect(metrics?.pipeGap).toBe(
            GAME_CONFIG.getDifficulty('normal').gap - GAME_CONFIG.round.gapTightenStep
        );
    });

    test('vitesse entraînement cyclable depuis le menu', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        const scales = await cycleTrainingSpeedTimes(page, 4);
        expect(scales).toEqual([1, 0.6, 0.7, 0.8]);
        await page.locator('#a11y-training').click();
        await startPlayingFromMenu(page, false);
        await expect
            .poll(async () => getTrainingRuntime(page))
            .toMatchObject({ trainingMode: true, trainingTimeScale: 0.8, timeScale: 0.8 });
    });

    test('survit 30 secondes sans mort', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement — durée 30 s');
        await waitForGameReady(page);
        await startPlayingFromMenu(page, false);

        const result = await runSurvivalScenario(page, 30_000);
        expect(result?.state).toBe('playing');
        expect(result?.score).toBeGreaterThanOrEqual(0);
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
        expect(equity?.jumpBufferMax).toBe(GAME_CONFIG.bird.jumpBufferFrames);
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
