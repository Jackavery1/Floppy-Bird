export const Utils = {
    checkCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    },

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    clearElements(elements) {
        elements.forEach(elem => elem.destroy());
        elements.length = 0;
    },

    makeStarPoints(cx, cy, outerR, innerR, points = 5) {
        const starPoints = [];
        for (let i = 0; i < points * 2; i++) {
            const angle = (i * Math.PI / points) - Math.PI / 2;
            const r = i % 2 === 0 ? outerR : innerR;
            starPoints.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
        }
        return starPoints;
    },
};
