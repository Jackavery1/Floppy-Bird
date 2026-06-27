export function createCloudTexture(scene) {
    const W = 152;
    const H = 70;
    const pad = 12;
    const g = scene.make.graphics({ x: 0, y: 0, add: false });

    g.fillStyle(0x000000, 0.08);
    g.fillEllipse(pad + 65, 56, 110, 18);
    g.fillStyle(0xFFFFFF, 1);
    g.fillEllipse(pad + 60, 34, 120, 52);
    g.fillStyle(0xF5F5F5, 1);
    g.fillEllipse(pad + 16, 44, 40, 38);
    g.fillEllipse(pad + 30, 44, 80, 44);
    g.fillEllipse(pad + 92, 42, 88, 48);
    g.fillStyle(0xFFFFFF, 1);
    g.fillEllipse(pad + 60, 24, 72, 40);
    g.generateTexture('cloud', W, H);
    g.destroy();
}
