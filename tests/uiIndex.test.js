import { describe, it, expect } from 'vitest';
import * as uiIndex from '../src/uiIndex.js';

describe('uiIndex', () => {
    it('réexporte la façade et les modules UI clés', () => {
        expect(uiIndex.UI).toBeTypeOf('function');
        expect(uiIndex.DEPTH).toBeTruthy();
        expect(uiIndex.showMenu).toBeTypeOf('function');
        expect(uiIndex.buildGameOverUI).toBeTypeOf('function');
        expect(uiIndex.showAchievementToasts).toBeTypeOf('function');
        expect(uiIndex.showDifficultyEscalation).toBeTypeOf('function');
        expect(uiIndex.showScoreStreak).toBeTypeOf('function');
        expect(uiIndex.buildSkinsTab).toBeTypeOf('function');
    });
});
