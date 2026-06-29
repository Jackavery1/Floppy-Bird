import Phaser from 'phaser';
import { GAME_CONFIG } from './config.js';
import { GameScene } from './GameScene.js';
import { computeLetterboxSize, getViewportDimensions, readSafeAreaInsets } from './viewport.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: GAME_CONFIG.width,
    height: GAME_CONFIG.height,
    backgroundColor: '#87ceeb',
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

const game = new Phaser.Game(config);

function resizeCanvas() {
    const canvas = game.canvas;
    if (!canvas) return;
    const { width: windowW, height: windowH } = getViewportDimensions();
    const insets = readSafeAreaInsets();
    const { width: targetW, height: targetH } = computeLetterboxSize(
        windowW,
        windowH,
        GAME_CONFIG.width,
        GAME_CONFIG.height,
        insets,
    );

    canvas.width = GAME_CONFIG.width;
    canvas.height = GAME_CONFIG.height;
    canvas.style.width = `${targetW}px`;
    canvas.style.height = `${targetH}px`;
}

game.events.once('ready', () => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.visualViewport?.addEventListener('resize', resizeCanvas);
    document.getElementById('loading')?.classList.add('hidden');
});
