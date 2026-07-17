import { describe, it, expect } from 'vitest';
import { CONTROL_DEFS } from '../src/ui/a11y/uiDomAccessibilityControlDefs.js';
import { PLAYING_CONTROL_DEFS } from '../src/ui/a11y/uiDomAccessibilityControlDefsPlaying.js';
import { MENU_CONTROL_DEFS } from '../src/ui/a11y/uiDomAccessibilityControlDefsMenu.js';
import { GAME_OVER_CONTROL_DEFS } from '../src/ui/a11y/uiDomAccessibilityControlDefsGameOver.js';
import { MIN_CTA_TOUCH } from '../src/ui/shared/uiLayoutConstants.js';

describe('uiDomAccessibilityControlDefs', () => {
    it('agrège les définitions par contexte sans perte', () => {
        expect(Object.keys(CONTROL_DEFS).sort()).toEqual(
            [
                ...Object.keys(PLAYING_CONTROL_DEFS),
                ...Object.keys(MENU_CONTROL_DEFS),
                ...Object.keys(GAME_OVER_CONTROL_DEFS),
            ].sort()
        );
    });

    it('chaque définition expose id et label', () => {
        for (const def of Object.values(CONTROL_DEFS)) {
            expect(def.id).toMatch(/^a11y-/);
            expect(def.label.length).toBeGreaterThan(0);
        }
    });

    it('expose 26 contrôles a11y', () => {
        expect(Object.keys(CONTROL_DEFS)).toHaveLength(26);
    });

    it('pause resume / menu respectent MIN_CTA_TOUCH', () => {
        expect(PLAYING_CONTROL_DEFS.pauseResume.size).toBe(MIN_CTA_TOUCH);
        expect(PLAYING_CONTROL_DEFS.pauseMenu.size).toBe(MIN_CTA_TOUCH);
        expect(PLAYING_CONTROL_DEFS.pause.size).toBe(MIN_CTA_TOUCH);
        expect(PLAYING_CONTROL_DEFS.playTutorialSkip.height).toBe(MIN_CTA_TOUCH);
    });
});
