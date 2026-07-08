import '../style.css';
import Phaser from 'phaser';
import { initGame } from './phaserBootstrap.js';
import { ensureTitleFontLoaded, onGameReady } from './appBootstrap.js';

(async () => {
    await ensureTitleFontLoaded();
    initGame(Phaser, onGameReady);
})();
