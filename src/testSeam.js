/** @param {import('phaser').Game} game */
export function installTestSeam(game) {
    const getScene = () => game.scene?.getScene?.('GameScene');

    window.__FLOPPY_TEST__ = {
        getState: () => getScene()?.state ?? null,
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
