/** @param {import('phaser').Game} game */
export function installTestSeam(game) {
    const getScene = () => game.scene?.getScene?.('GameScene');

    window.__FLOPPY_TEST__ = {
        getState: () => getScene()?.state ?? null,
        ready: () => getScene()?.state != null,
        getDailyChallengeMode: () => getScene()?.dailyChallengeMode ?? null,
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
