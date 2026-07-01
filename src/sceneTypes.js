/**
 * Contexte partagé passé aux modules `scene*` — champs de {@link GameScene}.
 *
 * @typedef {import('./bird.js').Bird} Bird
 * @typedef {import('./pipes.js').Pipes} Pipes
 * @typedef {import('./ui.js').UI} UI
 * @typedef {import('./scoreEffects.js').ScoreEffects} ScoreEffects
 * @typedef {import('./training.js').GhostReplay} GhostReplay
 * @typedef {ReturnType<import('./roundState.js').createRoundState>} RoundState
 *
 * @typedef {Object} SceneContext
 * @property {Bird} bird
 * @property {Pipes} pipes
 * @property {UI} ui
 * @property {ScoreEffects} scoreEffects
 * @property {GhostReplay} ghost
 * @property {RoundState} round
 * @property {string} state
 * @property {string} difficulty
 * @property {boolean} trainingMode
 * @property {boolean} hardcoreMode
 * @property {import('phaser').GameObjects.Image[]} _clouds
 * @property {import('phaser').GameObjects.TileSprite | null} _groundSprite
 * @property {import('phaser').GameObjects.Text | null} [fps]
 * @property {import('phaser').Cameras.Scene2D.CameraManager} cameras
 * @property {import('phaser').Time.Clock} time
 * @property {import('phaser').Game} game
 */

export {};
