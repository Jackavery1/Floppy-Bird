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
        getPipeCount: () => {
            const scene = getScene();
            if (!scene?.pipes) return { top: 0, bottom: 0 };
            return {
                top: scene.pipes.topPipes.length,
                bottom: scene.pipes.bottomPipes.length,
            };
        },
        forceGameOver: () => {
            const scene = getScene();
            if (!scene) return;
            scene.state = 'gameover';
            scene.ui.clearOverlay('gameOver');
            const { elements } = scene.ui.showGameOver(
                scene.round.score,
                { entries: [], highlightId: null },
                false,
                false,
                scene.hardcoreMode,
            );
            scene.ui.setOverlay('gameOver', elements);
        },
    };
}
