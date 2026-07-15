import { beginRound } from './sceneBeginRound.js';
import { triggerDeath as runDeath } from './sceneDeath.js';
import {
    changeDifficulty,
    cycleTrainingSpeed,
    handlePrimaryAction,
    launchDailyChallenge,
    returnToMenu,
    showMenu,
    startGame,
    toggleHardcore,
    togglePause,
    toggleTraining,
} from './sceneFlow.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** Lie l’API publique de flux scène (menu, partie, mort) sur l’instance GameScene. */
/** @param {SceneContext} scene */
export function bindSceneFlowApi(scene) {
    scene.triggerDeath = (cause = 'pipe') => runDeath(scene, cause);
    scene.handlePrimaryAction = () => handlePrimaryAction(scene);
    scene.changeDifficulty = (d) => changeDifficulty(scene, d);
    scene.toggleTraining = () => toggleTraining(scene);
    scene.toggleHardcore = () => toggleHardcore(scene);
    scene.cycleTrainingSpeed = () => cycleTrainingSpeed(scene);
    scene.launchDailyChallenge = () => launchDailyChallenge(scene);
    scene.showMenu = () => showMenu(scene);
    scene.beginRound = (opts) => beginRound(scene, opts);
    scene.startGame = () => startGame(scene);
    scene.returnToMenu = () => returnToMenu(scene);
    scene.togglePause = () => togglePause(scene);
}
