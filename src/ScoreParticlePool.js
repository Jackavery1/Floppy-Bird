const DIRS = [[-1, -1], [1, -1], [-1, 1], [1, 1]];

export class ScoreParticlePool {
    constructor(scene, size = 12) {
        this.scene = scene;
        this._pool = [];

        for (let i = 0; i < size; i++) {
            const star = scene.add.sprite(0, 0, 'star');
            star.setDepth(130);
            star.setVisible(false);
            star.setActive(false);
            this._pool.push(star);
        }
    }

    show(x, y) {
        for (const [dx, dy] of DIRS) {
            const star = this._pool.find(s => !s.active) ?? this._pool[0];
            star.setPosition(x, y);
            star.setAlpha(1);
            star.setScale(1);
            star.setVisible(true);
            star.setActive(true);

            this.scene.tweens.add({
                targets: star,
                x: x + dx * 40,
                y: y + dy * 40,
                alpha: { from: 1, to: 0 },
                scaleX: { from: 1, to: 0.3 },
                scaleY: { from: 1, to: 0.3 },
                duration: 500,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    star.setVisible(false);
                    star.setActive(false);
                },
            });
        }
    }

    destroy() {
        this._pool.forEach(s => s.destroy());
        this._pool.length = 0;
    }
}
