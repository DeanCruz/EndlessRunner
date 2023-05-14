// Dean Cruz
// Endless Invasion
// Approx 20+ hours spent on the project
// Creative tilt: Laser firing and collision & UFO random spawning
// Explanation: 
// Laser firing: This was the most technically complicated part of the program
// because I had to create an array to store the lasers in that would create a laser
// on mouse click input, I then had to adjust the collision handling to handle the laser
// destroying the UFO's without it affecting anything else
// The UFO random spawning was similarly complicated as I had to create an array that 
// kept pushing UFO's into it whenever they spawn. To detect collision it uses the array
// of UFO's for reference.

// configure game
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Space ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: false
        }
    },
}

// game declaration
let game = new Phaser.Game(config);

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT, keySPACE;

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;