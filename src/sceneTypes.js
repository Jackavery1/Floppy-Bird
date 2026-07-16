/**
 * Contexte partagé passé aux modules `scene*` — champs de {@link GameScene}.
 * Initialisé par {@link import('./sceneContext.js').initSceneCore} avant `create()`.
 *
 * Règles de mutation (qui écrit quoi) :
 * - `state`, `difficulty`, modes : `sceneFlow.js`, `sceneFlowOverlays.js`, `sceneBeginRound.js`, `sceneDeath.js`
 * - `round.*` : `sceneRound.js`, `roundState.js`, `sceneDeath.js`, `sceneBeginRound.js`
 * - `bird`, `pipes`, `ghost` : leurs modules + `sceneBootstrap.js` (collisions)
 * - `ui` : façade `UI` uniquement ; les modules `scene*` appellent des méthodes, pas `_skinsOpen` sauf input
 * - `_clouds`, `_groundSprite` : `sceneBackground.js` (lecture seule après init)
 * - `achievementNotifier` : injecté par `sceneBindings.js`, lu par `metaAchievements.js`
 *
 * @typedef {import('./bird.js').Bird} Bird
 * @typedef {import('./pipes.js').Pipes} Pipes
 * @typedef {import('./ui/core/ui.js').UI} UI
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
 * @property {string} state — {@link import('./gameState.js').GAME_STATE}
 * @property {string} difficulty — {@link import('./config.js').DIFFICULTY}
 * @property {boolean} trainingMode
 * @property {boolean} hardcoreMode
 * @property {boolean} dailyChallengeMode
 * @property {'classic'|'daily'} playMode
 * @property {string} activeSkinId
 * @property {number} dailyGoal
 * @property {(achievements: Array<{ title: string }>) => void} [achievementNotifier]
 * @property {import('phaser').GameObjects.Image[]} _clouds
 * @property {import('phaser').GameObjects.TileSprite | null} _groundSprite
 * @property {import('phaser').GameObjects.Text | null} [fps]
 * @property {import('phaser').Cameras.Scene2D.CameraManager} cameras
 * @property {import('phaser').Time.Clock} time
 * @property {import('phaser').Game} game
 * @property {() => void} handlePrimaryAction
 * @property {() => void} togglePause
 * @property {() => void} returnToMenu
 * @property {(d: string) => void} changeDifficulty
 * @property {() => void} toggleTraining
 * @property {() => void} toggleHardcore
 * @property {() => void} launchDailyChallenge
 * @property {() => void} beginRound
 * @property {() => void} startGame
 * @property {() => void} showMenu
 * @property {(cause?: 'pipe' | 'ground' | 'ceiling') => void} triggerDeath
 * @property {() => void} cycleTrainingSpeed
 */

export {};
