import { FONT } from './uiLayout.js';
import { sceneTween } from './motion.js';

const PARTICLE_DIRS = [[-1, -1], [1, -1], [-1, 1], [1, 1]];

export class ScoreEffects {
    constructor(scene) {
        this.scene = scene;
        this._popups = [];
        this._stars = [];

        for (let i = 0; i < 3; i++) {
            const text = scene.add.text(0, 0, '+1', {
                fontSize: '22px',
                fill: '#ffff00',
                fontFamily: FONT,
                fontStyle: 'bold',
            });
            text.setDepth(150).setVisible(false).setActive(false);
            this._popups.push(text);
        }

        for (let i = 0; i < 12; i++) {
            const star = scene.add.sprite(0, 0, 'star');
            star.setDepth(130).setVisible(false).setActive(false);
            this._stars.push(star);
        }
    }

    show(x, y) {
        this._showPopup(x + 25, y - 10);
        this._showParticles(x, y);
    }

    _showPopup(x, y) {
        const popup = this._popups.find(t => !t.active) ?? this._popups[0];
        popup.setPosition(x, y).setAlpha(1).setVisible(true).setActive(true);

        sceneTween(this.scene, {
            targets: popup,
            y: y - 45,
            alpha: { from: 1, to: 0 },
            duration: 700,
            onComplete: () => popup.setVisible(false).setActive(false),
        });
    }

    _showParticles(x, y) {
        for (const [dx, dy] of PARTICLE_DIRS) {
            const star = this._stars.find(s => !s.active) ?? this._stars[0];
            star.setPosition(x, y).setAlpha(1).setScale(1).setVisible(true).setActive(true);

            sceneTween(this.scene, {
                targets: star,
                x: x + dx * 40,
                y: y + dy * 40,
                alpha: { from: 1, to: 0 },
                scaleX: { from: 1, to: 0.3 },
                scaleY: { from: 1, to: 0.3 },
                duration: 500,
                ease: 'Quad.easeOut',
                onComplete: () => star.setVisible(false).setActive(false),
            });
        }
    }

    destroy() {
        this._popups.forEach(t => t.destroy());
        this._stars.forEach(s => s.destroy());
        this._popups.length = 0;
        this._stars.length = 0;
    }
}
