import { setE2eBackgroundFrozen } from '../e2eVisualFreeze.js';
import { GAME_CONFIG, SOUND } from '../config.js';
import { isAudioAvailable, playSound } from '../audio.js';
import { hapticLight, hapticMedium } from '../haptics.js';
import { loadTutorialComplete, loadTutorialProgress } from '../tutorialStorage.js';
import { sampleGapSequence } from '../pipeGapSampling.js';
import {
    effectivePipeGapForScore,
    maxGapDeltaForScore,
    speedBoostMultiplierForScore,
} from '../gapDifficulty.js';

/** @param {() => import('../sceneTypes.js').SceneContext | undefined} getScene */
export function createMetaSeam(getScene) {
    return {
        getTutorialState: () => ({
            step: loadTutorialProgress(),
            complete: loadTutorialComplete(),
        }),
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
        sampleGapVariance: (count = 24) => sampleGapSequence(count),
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
            return {
                supported:
                    typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function',
            };
        },
    };
}
