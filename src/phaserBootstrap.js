import { GAME_CONFIG } from './config.js';
import { getBackgroundCanvasColor } from './textures/index.js';
import { GameScene } from './GameScene.js';

export function createPhaserGameConfig(Phaser) {
    return {
        type: Phaser.AUTO,
        parent: 'game-container',
        width: GAME_CONFIG.width,
        height: GAME_CONFIG.height,
        backgroundColor: getBackgroundCanvasColor(),
        scale: {
            mode: Phaser.Scale.NONE,
            autoCenter: Phaser.Scale.NO_CENTER,
        },
        scene: GameScene,
        render: {
            pixelArt: true,
            antialias: false,
            roundPixels: true,
        },
    };
}

export function initGame(Phaser, onReady) {
    const game = new Phaser.Game(createPhaserGameConfig(Phaser));
    game.events.once('ready', () => onReady(game));
    return game;
}
