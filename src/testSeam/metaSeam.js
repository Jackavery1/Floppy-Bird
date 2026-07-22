import { setE2eBackgroundFrozen } from '../e2eVisualFreeze.js';
import { DIFFICULTY, GAME_CONFIG, SOUND } from '../config.js';
import { isAudioAvailable, playSound } from '../audio.js';
import { hapticLight, hapticMedium, hapticHeavy } from '../haptics.js';
import {
    loadTutorialComplete,
    loadTutorialProgress,
    loadRoundsStarted,
    SKIP_TUTORIAL_AFTER_ROUNDS,
} from '../tutorialStorage.js';
import { sampleGapSequence } from '../pipeGapSampling.js';
import {
    effectivePipeGapForScore,
    maxGapDeltaForScore,
    speedBoostMultiplierForScore,
} from '../gapDifficulty.js';
import { saveDailyCompletion, isDailyCompletedToday } from '../dailyChallengeProgress.js';
import { buildMetaContext } from '../metaContext.js';
import { listUnlockedSkins } from '../skins/index.js';
import { notifyNewlyUnlockedSkins, snapshotUnlockedSkins } from '../metaAchievements.js';
import { saveHighScore } from '../highScores.js';

/** @param {() => import('../sceneTypes.js').SceneContext | undefined} getScene */
export function createMetaSeam(getScene) {
    return {
        getTutorialState: () => ({
            step: loadTutorialProgress(),
            complete: loadTutorialComplete(),
        }),
        getOnboardingMetrics: () => ({
            tutorialStep: loadTutorialProgress(),
            tutorialComplete: loadTutorialComplete(),
            roundsStarted: loadRoundsStarted(),
            skipAfterRounds: SKIP_TUTORIAL_AFTER_ROUNDS,
        }),
        getLastDeathMetrics: () => {
            const scene = getScene();
            return scene?.round?.lastDeathMetrics ?? null;
        },
        getRoundRuntime: () => {
            const scene = getScene();
            if (!scene?.round) return null;
            const startedAt = scene.round.startedAt ?? 0;
            const now = scene.time?.now ?? 0;
            return {
                state: scene.state ?? null,
                score: scene.round.score ?? 0,
                startedAt,
                elapsedMs: startedAt > 0 ? Math.max(0, now - startedAt) : 0,
            };
        },
        getTrainingRuntime: () => {
            const scene = getScene();
            if (!scene) return null;
            return {
                trainingMode: Boolean(scene.trainingMode),
                timeScale: scene.time?.timeScale ?? 1,
                trainingTimeScale: scene.trainingTimeScale ?? GAME_CONFIG.training.timeScale,
                configTimeScale: GAME_CONFIG.training.timeScale,
            };
        },
        cycleTrainingSpeed: () => {
            const scene = getScene();
            if (!scene) return null;
            scene.cycleTrainingSpeed?.();
            return scene.trainingTimeScale ?? null;
        },
        sampleGapVariance: (count = 24, opts = {}) => sampleGapSequence(count, opts),
        getDifficultyMetrics: (score = getScene()?.round?.score ?? 0) => {
            const baseGap = GAME_CONFIG.getDifficulty(getScene()?.difficulty ?? 'normal').gap;
            return {
                score,
                speedMultiplier: speedBoostMultiplierForScore(score),
                pipeGap: effectivePipeGapForScore(baseGap, score),
                maxGapDelta: maxGapDeltaForScore(score),
                baseGap,
            };
        },
        /** @param {{ goal: number, score: number, difficulty?: string, skinId?: string }} payload */
        saveDailyCompletion: (payload) => {
            saveDailyCompletion({
                goal: payload.goal,
                score: payload.score,
                difficulty: payload.difficulty ?? 'normal',
                skinId: payload.skinId ?? 'classic',
            });
            return isDailyCompletedToday();
        },
        isDailyCompletedToday: () => isDailyCompletedToday(),
        listUnlockedSkins: () => {
            const scene = getScene();
            if (!scene) return [];
            return listUnlockedSkins(buildMetaContext(scene));
        },
        /**
         * Simule un déblocage skin pour e2e : snapshot → record → notify.
         * @param {number} [score]
         */
        simulateSkinUnlockAtScore: (score = 10) => {
            const scene = getScene();
            if (!scene?.round) return null;
            snapshotUnlockedSkins(scene);
            const before = [...(scene.round.unlockedSkinIdsAtStart ?? [])];
            saveHighScore(score, DIFFICULTY.NORMAL, undefined, false, null);
            scene.round.score = score;
            const newly = notifyNewlyUnlockedSkins(scene);
            return {
                before,
                after: listUnlockedSkins(buildMetaContext(scene)),
                newly: newly.map((a) => ({
                    title: a.title,
                    kind: a.kind,
                    id: a.id,
                })),
            };
        },
        probeAudio: () => {
            const sounds = [SOUND.JUMP, SOUND.SCORE, SOUND.GAME_OVER, SOUND.GROUND];
            for (const sound of sounds) {
                playSound(sound, 1);
            }
            return { available: isAudioAvailable() };
        },
        freezeBackgroundAnimation: (freeze = true) => {
            setE2eBackgroundFrozen(freeze);
            return freeze;
        },
        probeHaptics: () => {
            hapticLight();
            hapticMedium();
            hapticHeavy();
            return {
                supported:
                    typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function',
            };
        },
    };
}
