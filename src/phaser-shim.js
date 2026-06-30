const Phaser = globalThis.Phaser;
if (!Phaser) {
    throw new Error('Phaser introuvable : charge vendor/phaser.min.js avant le bundle.');
}
export default Phaser;
