import Phaser from 'phaser';
import { GAME_CONFIG } from './config.js';
import { GameScene } from './GameScene.js';
import '../style.css';

document.documentElement.style.setProperty('--theme-color', '#16213e');

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

export const game = new Phaser.Game(config);

function resizeCanvas() {
    const canvas = game.canvas;
    if (!canvas) return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const RATIO = 288 / 512;

    let targetW, targetH;

    if (W / H > RATIO) {
        targetH = H;
        targetW = H * RATIO;
    } else {
        targetW = W;
        targetH = W / RATIO;
    }

    canvas.width = 288;
    canvas.height = 512;
    canvas.style.width = Math.floor(targetW) + 'px';
    canvas.style.height = Math.floor(targetH) + 'px';
}

game.events.once('ready', () => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
});
