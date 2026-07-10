/** @param {() => import('./sceneTypes.js').SceneContext | undefined} getScene */
export function createCoreSeam(getScene) {
    return {
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
    };
}
