import '../style.css';
import Phaser from 'phaser';
import { initGame } from './phaserBootstrap.js';
import { ensureTitleFontLoaded, onGameReady } from './appBootstrap.js';

await ensureTitleFontLoaded();
initGame(Phaser, onGameReady);
