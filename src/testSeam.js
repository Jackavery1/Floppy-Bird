import { createCoreSeam } from './testSeam/coreSeam.js';
import { createUiSeam } from './testSeam/uiSeam.js';
import { createGameplaySeam } from './testSeam/gameplaySeam.js';
import { createMetaSeam } from './testSeam/metaSeam.js';

/** API d’observation Playwright — chargée dynamiquement (voir appBootstrap.shouldInstallTestSeam). */
/** @param {import('phaser').Game} game */
export function installTestSeam(game) {
    const getScene = () => game.scene?.getScene?.('GameScene');

    window.__FLOPPY_TEST__ = {
        ...createCoreSeam(getScene),
        ...createUiSeam(getScene),
        ...createGameplaySeam(getScene),
        ...createMetaSeam(getScene),
    };
}
