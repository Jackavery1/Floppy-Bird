/**
 * Mocks Vitest partagés pour les tests GameScene.
 * Importer en première ligne : `import './helpers/gameSceneMocks.js';`
 */
import { vi } from 'vitest';

vi.mock('phaser', () => {
    class Scene {
        constructor(config) {
            this.sys = { settings: config };
        }
    }
    return {
        default: {
            Scene,
            AUTO: 0,
            Scale: { NONE: 0, NO_CENTER: 0 },
        },
    };
});

vi.mock('../../src/textures/index.js', () => ({
    preloadTexturesEssential: vi.fn(),
}));

vi.mock('../../src/textures/decorPreload.js', () => ({
    preloadDecorTextures: vi.fn(() => Promise.resolve()),
}));

vi.mock('../../src/sceneSetup.js', () => ({
    setupSceneWorld: vi.fn(),
}));

vi.mock('../../src/sceneDeath.js', () => ({
    triggerDeath: vi.fn(),
    updateDying: vi.fn(),
}));

vi.mock('../../src/trainingStorage.js', () => ({
    loadTrainingEnabled: vi.fn(() => false),
    loadTrainingTimeScale: vi.fn(() => 0.8),
}));

vi.mock('../../src/hardcoreStorage.js', () => ({
    loadHardcoreEnabled: vi.fn(() => false),
    saveHardcoreEnabled: vi.fn(),
}));

vi.mock('../../src/storage.js', () => ({
    loadHighScore: vi.fn(() => 0),
}));

vi.mock('../../src/sceneBackground.js', () => ({
    updateClouds: vi.fn(),
    updateHills: vi.fn(),
    updateGround: vi.fn(),
}));

vi.mock('../../src/sceneBootstrap.js', () => ({
    frameStep: vi.fn(() => 1),
    splitPhysicsSteps: vi.fn((step) => [step]),
    checkCollisions: vi.fn(),
}));

vi.mock('../../src/sceneJumpBuffer.js', () => ({
    processJumpBuffer: vi.fn(),
    tickJumpBuffer: vi.fn(),
}));

vi.mock('../../src/sceneRound.js', () => ({
    checkScorePipes: vi.fn(),
    cancelPipeSpawnTimer: vi.fn(),
    clearSpawnInvincibility: vi.fn(),
    tickPipeSpawnFallback: vi.fn(),
}));

vi.mock('../../src/sceneCoyote.js', () => ({
    updateCoyoteTime: vi.fn(),
    updateCoyoteVisual: vi.fn(),
    hasCoyoteGrace: vi.fn(() => false),
}));

vi.mock('../../src/sceneBeginRound.js', () => ({
    beginRound: vi.fn(),
}));

vi.mock('../../src/sceneFlow.js', () => ({
    showMenu: vi.fn(),
    beginRound: vi.fn(),
    startGame: vi.fn(),
    returnToMenu: vi.fn(),
    togglePause: vi.fn(),
    handlePrimaryAction: vi.fn(),
    changeDifficulty: vi.fn(),
    toggleTraining: vi.fn(),
    toggleHardcore: vi.fn(),
    cycleTrainingSpeed: vi.fn(),
    launchDailyChallenge: vi.fn(),
}));
