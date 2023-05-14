class Meteor extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame, pointValue){
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        // point value
        this.moveSpeed = 3;
    }

    update() {

        // move spaceship down
        this.y -= this.moveSpeed;

        // wrap around from left edge to right edge
        if(this.y <= 0 - this.width) {
            this.reset();
        }
    }

    // position reset
    reset() {
        this.x = game.config.width;
    }

    // speed setter
    setMoveSpeed(newSpeed) {
        this.moveSpeed = newSpeed;
    }
}