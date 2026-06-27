export function createPipeSprites(scene) {
    const W = 64;
    const BW = 48;
    const BX = (W - BW) / 2;
    const H = 500;
    const CAP_H = 20;

    const PIPE_MAIN  = 0x74BF2E;
    const PIPE_LIGHT = 0x8ED94A;
    const PIPE_DARK  = 0x5AA022;
    const PIPE_EDGE  = 0x3A7A0A;

    const drawBody = (g, yStart, yEnd) => {
        const h = yEnd - yStart;
        g.fillStyle(PIPE_EDGE, 1);
        g.fillRect(BX - 1, yStart, 1, h);
        g.fillRect(BX + BW, yStart, 1, h);
        g.fillStyle(PIPE_MAIN, 1);
        g.fillRect(BX, yStart, BW, h);
        g.fillStyle(PIPE_LIGHT, 1);
        g.fillRect(BX, yStart, 8, h);
        g.fillStyle(PIPE_DARK, 1);
        g.fillRect(BX + BW - 6, yStart, 6, h);
    };

    const drawCap = (g, yStart) => {
        g.fillStyle(PIPE_MAIN, 1);
        g.fillRect(0, yStart, W, CAP_H);
        g.fillStyle(PIPE_LIGHT, 1);
        g.fillRect(0, yStart, 10, CAP_H);
        g.fillStyle(PIPE_DARK, 1);
        g.fillRect(W - 8, yStart, 8, CAP_H);
        g.fillStyle(PIPE_EDGE, 1);
        g.fillRect(0, yStart,              W, 2);
        g.fillRect(0, yStart + CAP_H - 2,  W, 2);
    };

    const gTop = scene.make.graphics({ x: 0, y: 0, add: false });
    drawBody(gTop, 0, H - CAP_H);
    drawCap(gTop, H - CAP_H);
    gTop.generateTexture('pipe-top', W, H);
    gTop.destroy();

    const gBot = scene.make.graphics({ x: 0, y: 0, add: false });
    drawCap(gBot, 0);
    drawBody(gBot, CAP_H, H);
    gBot.generateTexture('pipe-bottom', W, H);
    gBot.destroy();
}
