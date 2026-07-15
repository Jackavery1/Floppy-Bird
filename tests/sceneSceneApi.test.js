import './helpers/gameSceneMocks.js';
import { describe, it, expect } from 'vitest';
import { initSceneCore } from '../src/sceneContext.js';
import { triggerDeath } from '../src/sceneDeath.js';
import { handlePrimaryAction } from '../src/sceneFlow.js';

describe('sceneSceneApi', () => {
    it('bindSceneFlowApi expose triggerDeath et handlePrimaryAction', () => {
        const scene = {};
        initSceneCore(scene);
        scene.triggerDeath('ground');
        expect(triggerDeath).toHaveBeenCalledWith(scene, 'ground');
        scene.handlePrimaryAction();
        expect(handlePrimaryAction).toHaveBeenCalledWith(scene);
    });
});
