export function createBirdSpriteSheet(scene) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });

    const drawOutline = (ox) => {
        g.fillStyle(0x000000, 1);
        g.fillRect(ox + 4,  1, 26, 26);
        g.fillRect(ox + 1,  4, 32, 20);
        g.fillRect(ox + 0,  6, 36, 16);
        g.fillRect(ox + 31, 9,  9, 13);
    };

    const drawBody = (ox) => {
        g.fillStyle(0xFFCC00, 1);
        g.fillRect(ox + 6, 3, 22, 22);
        g.fillRect(ox + 3, 6, 28, 16);
        g.fillRect(ox + 2, 8, 32, 12);
        g.fillStyle(0xFFEE88, 1);
        g.fillRect(ox + 15, 11, 11, 9);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(ox + 22, 4, 9, 11);
        g.fillStyle(0x111111, 1);
        g.fillRect(ox + 25, 7, 5, 5);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(ox + 26, 7, 2, 2);
        g.fillStyle(0xFF8800, 1);
        g.fillRect(ox + 33, 11, 5, 8);
        g.fillStyle(0xCC5500, 1);
        g.fillRect(ox + 33, 16, 5, 4);
    };

    const drawWing = (ox, pos) => {
        g.fillStyle(0xFFAA00, 1);
        if (pos === 'up') {
            g.fillRect(ox + 4, 2, 14, 6);
            g.fillRect(ox + 6, 0, 10, 4);
        } else if (pos === 'mid') {
            g.fillRect(ox + 4, 15, 15, 7);
            g.fillRect(ox + 6, 13, 11, 4);
        } else {
            g.fillRect(ox + 4, 21, 14, 6);
            g.fillRect(ox + 6, 25, 10, 3);
        }
    };

    drawOutline(0);   drawBody(0);   drawWing(0,  'up');
    drawOutline(38);  drawBody(38);  drawWing(38, 'mid');
    drawOutline(76);  drawBody(76);  drawWing(76, 'down');

    g.generateTexture('bird-sheet', 114, 28);
    g.destroy();

    const texture = scene.textures.get('bird-sheet');
    texture.add(0, 0,  0,  0, 38, 28);
    texture.add(1, 0, 38,  0, 38, 28);
    texture.add(2, 0, 76,  0, 38, 28);
}
