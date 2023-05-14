class Laser extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame, pointValue){
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        // point value
        this.moveSpeed = 7;
        this.setScale(0.1);
    }

    update() {

        // move laser up
        this.y -= this.moveSpeed;

        // // Destroy laser
        // Destroy laser
        if(this.y <= 0) {
            this.destroy();
        }   
    }

    // speed setter
    setMoveSpeed(newSpeed) {
        this.moveSpeed = newSpeed;
    }
}