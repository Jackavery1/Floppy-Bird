import { setupGameOverAccessibility } from '../ui/a11y/uiDomAccessibilityFlows.js';
import { preloadGameOverUI } from '../ui/gameOver/uiGameOverLoader.js';

/** @param {() => import('../sceneTypes.js').SceneContext | undefined} getScene */
export function createUiSeam(getScene) {
    return {
        forceGameOver: (opts = {}) => {
            const { isDaily = false } = opts;
            const scene = getScene();
            if (!scene) return Promise.resolve();
            const dailyGoal = isDaily ? 5 : 0;
            return preloadGameOverUI().then(() => {
                scene.state = 'gameover';
                scene.ui.clearOverlay('gameOver');
                const { elements } = scene.ui.showGameOver(
                    scene.round.score,
                    { entries: [], highlightId: null },
                    false,
                    false,
                    scene.hardcoreMode,
                    dailyGoal
                );
                scene.ui.setOverlay('gameOver', elements);
                setupGameOverAccessibility(scene, {
                    score: scene.round.score,
                    isDaily,
                });
            });
        },
        getGameOverRestartLabel: () => getScene()?.ui?._restartBtnText?.text ?? null,
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
                firstRunHintVisible: Boolean(ui._firstRunHint?.visible),
                firstRunHintText: ui._firstRunHint?.text ?? null,
            };
        },
        getOptionsPanel: () => {
            const ui = getScene()?.ui;
            if (!ui) return null;
            const sectionVisible = (section) => Boolean(section?.[0]?.visible);
            const settings = sectionVisible(ui._optionsSettingsElements);
            return {
                open: Boolean(ui._optionsOpen),
                tab: ui._optionsActiveTab ?? null,
                controls: sectionVisible(ui._optionsControlsElements),
                preferences: settings,
                settings,
            };
        },
        getHudBannerText: (key) => {
            const banner = getScene()?.ui?.[key];
            return banner?.text ?? null;
        },
    };
}
