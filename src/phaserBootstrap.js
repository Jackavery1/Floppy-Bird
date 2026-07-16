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

/** Affiche un message utilisateur si le boot Phaser / WebGL échoue. */
export function showBootFailure(err) {
    console.error('[Floppy Bird] Échec du démarrage', err);
    const el = document.getElementById('loading');
    if (!el) return;
    el.classList.remove('hidden');
    el.innerHTML =
        'Impossible de démarrer le jeu.<br><br>' +
        'Vérifie que WebGL ou Canvas est disponible, puis recharge la page.<br>' +
        'En local : <strong>npm run dev</strong> (Vite), pas Live Server.<br>' +
        'Après build : <strong>npm run preview</strong>.';
}

export function initGame(Phaser, onReady) {
    try {
        const game = new Phaser.Game(createPhaserGameConfig(Phaser));
        game.events.once('ready', () => onReady(game));
        return game;
    } catch (err) {
        showBootFailure(err);
        throw err;
    }
}
