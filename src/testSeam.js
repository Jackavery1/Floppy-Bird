/** @param {import('phaser').Game} game */
export function installTestSeam(game) {
    const getScene = () => game.scene?.getScene?.('GameScene');

    window.__FLOPPY_TEST__ = {
        getState: () => getScene()?.state ?? null,
        ready: () => getScene()?.state != null,
        startPlaying: () => {
            const scene = getScene();
            if (scene?.state === 'menu') scene.handlePrimaryAction();
        },
        enterPausedFromMenu: () => {
            const scene = getScene();
            if (scene?.state !== 'menu') return;
            scene.handlePrimaryAction();
            if (scene.state === 'playing') scene.togglePause();
        },
    };
}
