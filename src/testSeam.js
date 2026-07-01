/** @param {import('phaser').Game} game */
export function installTestSeam(game) {
    const getScene = () => game.scene?.getScene?.('GameScene');

    window.__FLOPPY_TEST__ = {
        getState: () => getScene()?.state ?? null,
        ready: () => getScene()?.state != null,
    };
}
