import { describe, it, expect } from 'vitest';
import { computeMenuLayout, modesAccordionLabel } from '../src/uiLayout.js';

describe('uiLayout menu accordion', () => {
    it('modesAccordionLabel résume l’état des modes', () => {
        expect(modesAccordionLabel(false, false, false)).toContain('▸');
        expect(modesAccordionLabel(true, true, false)).toContain('▾');
        expect(modesAccordionLabel(false, true, false)).toContain('Entr.ON');
    });

    it('computeMenuLayout replie les modes sur mobile', () => {
        const collapsed = computeMenuLayout(true, false);
        expect(collapsed.training).toBeNull();
        expect(collapsed.modesHeader).toBeTruthy();

        const expanded = computeMenuLayout(true, true);
        expect(expanded.training).toBeTruthy();
        expect(expanded.hardcore).toBeTruthy();
        expect(expanded.start).toBeGreaterThan(expanded.difficulty);
    });

    it('computeMenuLayout desktop conserve le layout statique', () => {
        const layout = computeMenuLayout(false, false);
        expect(layout.compact).toBe(false);
        expect(layout.training).toBe(172);
    });
});
