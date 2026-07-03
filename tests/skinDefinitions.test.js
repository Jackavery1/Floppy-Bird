import { describe, it, expect } from 'vitest';
import { SKIN_DEFINITIONS } from '../src/skins/skinDefinitions.js';
import { SKIN_IDS } from '../src/skins/skinIds.js';

describe('skinDefinitions', () => {
    it('expose 16 skins avec palettes numériques', () => {
        expect(Object.keys(SKIN_DEFINITIONS)).toHaveLength(16);
        expect(SKIN_DEFINITIONS.classic.palette.body).toBe(0xffcc00);
        expect(SKIN_DEFINITIONS.classic.palette.beakDark).toBe(0xcc5500);
    });

    it('couvre tous les SKIN_IDS', () => {
        for (const id of SKIN_IDS) {
            expect(SKIN_DEFINITIONS[id]).toBeDefined();
            expect(SKIN_DEFINITIONS[id].label).toBeTruthy();
        }
    });

    it('conserve les clés accessory des skins spéciaux', () => {
        expect(SKIN_DEFINITIONS.armure.accessoryKey).toBe('armure');
        expect(SKIN_DEFINITIONS.neon.unlock.type).toBe('neonCollection');
    });
});
