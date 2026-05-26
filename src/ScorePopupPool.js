export class ScorePopupPool {
    constructor(scene, size = 3) {
        this.scene = scene;
        this._pool = [];

        for (let i = 0; i < size; i++) {
            const text = scene.add.text(0, 0, '+1', {
                fontSize: '22px',
                fill: '#ffff00',
                fontFamily: 'Arial',
                fontStyle: 'bold',
            });
            text.setDepth(150);
            text.setVisible(false);
            text.setActive(false);
            this._pool.push(text);
        }
    }

    show(x, y) {
        const popup = this._pool.find(t => !t.active) ?? this._pool[0];
        popup.setPosition(x, y);
        popup.setAlpha(1);
        popup.setVisible(true);
        popup.setActive(true);

        this.scene.tweens.add({
            targets: popup,
            y: y - 45,
            alpha: { from: 1, to: 0 },
            duration: 700,
            onComplete: () => {
                popup.setVisible(false);
                popup.setActive(false);
            },
        });
    }

    destroy() {
        this._pool.forEach(t => t.destroy());
        this._pool.length = 0;
    }
}
