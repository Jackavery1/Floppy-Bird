import { GAME_CONFIG } from './config.js';
import { requestJump } from './sceneJumpBuffer.js';
import { triggerDeath } from './sceneDeath.js';
import { checkScorePipes } from './sceneRound.js';
import { loadTutorialComplete, loadTutorialProgress } from './tutorialStorage.js';
import { sampleGapSequence } from './pipeGapSampling.js';

/** API d’observation Playwright — chargée dynamiquement (voir appBootstrap.shouldInstallTestSeam). */
/** @param {import('phaser').Game} game */
export function installTestSeam(game) {
    const getScene = () => game.scene?.getScene?.('GameScene');

    window.__FLOPPY_TEST__ = {
        getState: () => getScene()?.state ?? null,
        getScoreHud: () => {
            const scene = getScene();
            const scoreText = scene?.ui?.scoreText;
            if (!scoreText) return null;
            return {
                visible: scoreText.visible,
                alpha: scoreText.alpha,
                y: scoreText.y,
                depth: scoreText.depth,
                text: scoreText.text,
            };
        },
        bumpScore: (amount = 1) => {
            const scene = getScene();
            if (!scene?.ui) return;
            scene.round.score += amount;
            scene.ui.updateScore(scene.round.score);
        },
        getCanvasLayout: () => {
            const canvas = getScene()?.game?.canvas;
            if (!canvas) return null;
            const rect = canvas.getBoundingClientRect();
            return {
                width: rect.width,
                height: rect.height,
                top: rect.top,
                left: rect.left,
            };
        },
        ready: () => getScene()?.state != null,
        getDailyChallengeMode: () => getScene()?.dailyChallengeMode ?? null,
        forceGameOver: () => {
            const scene = getScene();
            if (!scene) return Promise.resolve();
            return import('./uiGameOverLoader.js')
                .then((m) => m.preloadGameOverUI())
                .then(() => {
                    scene.state = 'gameover';
                    scene.ui.clearOverlay('gameOver');
                    const { elements } = scene.ui.showGameOver(
                        scene.round.score,
                        { entries: [], highlightId: null },
                        false,
                        false,
                        scene.hardcoreMode
                    );
                    scene.ui.setOverlay('gameOver', elements);
                });
        },
        getMenuPanels: () => {
            const scene = getScene();
            const ui = scene?.ui;
            if (!ui) return null;
            return {
                options: Boolean(ui._optionsOpen),
                scores: Boolean(ui._scoresOpen),
                skins: Boolean(ui._skinsOpen),
                difficulty: scene.difficulty ?? null,
                trainingMode: Boolean(scene.trainingMode),
                hardcoreMode: Boolean(scene.hardcoreMode),
                dailyChallengeMode: Boolean(scene.dailyChallengeMode),
            };
        },
        getOptionsPanel: () => {
            const ui = getScene()?.ui;
            if (!ui) return null;
            const sectionVisible = (section) => Boolean(section?.[0]?.visible);
            const settings = sectionVisible(ui._optionsSettingsElements);
            const modes = sectionVisible(ui._optionsModesElements);
            return {
                open: Boolean(ui._optionsOpen),
                tab: ui._optionsActiveTab ?? null,
                controls: sectionVisible(ui._optionsControlsElements),
                preferences: settings && modes,
                settings,
                modes,
            };
        },
        getGameplayEquity: () => {
            const scene = getScene();
            if (!scene?.round) return null;
            return {
                jumpBufferFrames: scene.round.jumpBufferFrames,
                coyoteFrames: scene.round.coyoteFrames,
                spawnInvincible: scene.round.spawnInvincible,
                jumpBufferMax: GAME_CONFIG.bird.jumpBufferFrames,
                coyoteMax: GAME_CONFIG.bird.coyoteTimeFrames,
                spawnInvincibilityMs: GAME_CONFIG.round.spawnInvincibilityMs,
                pipeSpawnDelayMs: GAME_CONFIG.round.pipeSpawnDelayMs,
                hasCoyoteGrace: scene.round.coyoteFrames > 0,
            };
        },
        requestJump: () => {
            const scene = getScene();
            if (!scene) return;
            requestJump(scene);
        },
        grantCoyoteGrace: (frames = GAME_CONFIG.bird.coyoteTimeFrames) => {
            const scene = getScene();
            if (!scene?.round) return;
            scene.round.coyoteFrames = frames;
        },
        getRoundScore: () => getScene()?.round?.score ?? null,
        triggerDeath: (cause = 'pipe') => {
            const scene = getScene();
            if (!scene) return;
            triggerDeath(scene, cause);
        },
        getPipeState: () => {
            const scene = getScene();
            if (!scene?.pipes) return null;
            const pipe = scene.pipes.topPipes?.[0];
            return {
                pipeCount: scene.pipes.topPipes?.length ?? 0,
                score: scene.round?.score ?? 0,
                birdX: scene.bird?.x ?? 0,
                firstPipeX: pipe?.x ?? null,
                pipeWidth: scene.pipes.pipeWidth,
            };
        },
        advancePipeForScore: () => {
            const scene = getScene();
            if (!scene?.pipes || !scene.bird || !scene.round) return null;
            let pipe = scene.pipes.topPipes.find((p) => !p.scored);
            if (!pipe) {
                scene.pipes.spawn();
                pipe = scene.pipes.topPipes.find((p) => !p.scored);
            }
            if (!pipe) return scene.round.score;
            scene.bird.x = pipe.x + scene.pipes.pipeWidth / 2 + 2;
            checkScorePipes(scene);
            return scene.round.score;
        },
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
    };
}
