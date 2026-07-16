import '../style.css';
import Phaser from 'phaser';
import { initGame, showBootFailure } from './phaserBootstrap.js';
import { ensureTitleFontLoaded, onGameReady } from './appBootstrap.js';

(async () => {
    try {
        await ensureTitleFontLoaded();
        initGame(Phaser, onGameReady);
    } catch (err) {
        showBootFailure(err);
    }
})();
