import raw from './skinDefinitions.json';

/** @param {Record<string, string>} palette */
function parsePalette(palette) {
    return Object.fromEntries(
        Object.entries(palette).map(([key, hex]) => [key, Number.parseInt(hex, 16)])
    );
}

/** @type {Record<string, import('./skinTypes.js').SkinDefinition>} */
export const SKIN_DEFINITIONS = Object.freeze(
    Object.fromEntries(
        Object.entries(raw).map(([id, def]) => [
            id,
            {
                ...def,
                palette: parsePalette(def.palette),
            },
        ])
    )
);
