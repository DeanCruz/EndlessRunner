// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this);
        this.isFiring = false;      // track rocket's firing status
        this.isLaser = false;       // track laser's
        this.moveSpeed = 2;         // pixels per frame
        this.sfxRocket = scene.sound.add('sfx_rocket')  // add rocket sfx
    }

    update() {
        // Future use
    }

    // reset rocket to "ground"
    reset() {
        this.isFiring = false;
        this.x = game.config.width/2;
        this.y = game.config.height/1.2;
    }
}