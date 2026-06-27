/**
 * Frame milieu de l'oiseau (proceduralTextures.js, ox=38, pos='mid')
 * Coordonnées relatives au cadre 34×28.
 */

export const BIRD_W = 34;
export const BIRD_H = 28;

function bodyRects() {
    return [
        // Corps principal (jaune)
        { c: '#FFCC00', x: 6,  y: 3,  w: 22, h: 22 },
        { c: '#FFCC00', x: 3,  y: 6,  w: 28, h: 16 },
        { c: '#FFCC00', x: 2,  y: 8,  w: 30, h: 12 },
        // Ventre (jaune clair)
        { c: '#FFEE88', x: 15, y: 11, w: 11, h: 9  },
        // Œil (blanc)
        { c: '#FFFFFF', x: 20, y: 4,  w: 9,  h: 11 },
        // Pupille
        { c: '#111111', x: 23, y: 7,  w: 5,  h: 5  },
        // Reflet œil
        { c: '#FFFFFF', x: 24, y: 7,  w: 2,  h: 2  },
        // Bec (haut)
        { c: '#FF8800', x: 29, y: 11, w: 5,  h: 8  },
        // Bec (bas)
        { c: '#CC5500', x: 29, y: 16, w: 5,  h: 4  },
    ];
}

function wingRects() {
    // Position 'mid' (aile à l'horizontale)
    return [
        { c: '#FFAA00', x: 4,  y: 15, w: 15, h: 7 },
        { c: '#FFAA00', x: 6,  y: 13, w: 11, h: 4 },
    ];
}

export function getBirdPixelRects() {
    return [...bodyRects(), ...wingRects()];
}
