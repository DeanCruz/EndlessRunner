class Space extends Phaser.Scene {
    constructor() {
        super("spaceScene");

        // add text to display time
        this.timeText = null;

        // add timer for speed up
        this.speedTimer = 0;

        // add music
        this.music = null;

        // default player
        this.activePlayer = 'P1';
    }

    // initialize game settings
    init(settings) {
        this.settings = settings;
        this.gameTimer = settings.gameTimer;
    }

    preload(){
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        // Load images for Meteor
        // this.load.image('meteor', './assets/meteor.png');
        // Load images for Spaceship
        this.load.image('spaceship', './assets/spaceship.png');
        // load rocket laser
        this.load.image('laser', './assets/laser.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        // load music
        this.load.audio('backgroundMusic', ['./assets/rocketpatrolbackground.mp3']);
        

    }

    create() {
        // create music
        this.music = this.sound.add('backgroundMusic');
        this.music.setVolume(0.5);
        // add an event listener for the first user interaction
        this.input.once('pointerdown', () => {
            // start playing the background music
            this.music.play();
        });
        
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0,0);
        
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x301934).setOrigin(0, 0);
        
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        
        // add lasers
        this.lasers = [];
        // add timer to add delay to laser fire
        this.lastLaserTime = 0;

        // add meteor
        // this.meteor = new Meteor(this,)
        // Timer for spawning meteors
        // this.meteorSpawnTimer = this.time.addEvent({
        //     delay: 2000, // Every 2000ms (2 seconds)
        //     callback: this.spawnMeteor,
        //     callbackScope: this,
        //     loop: true,
        // });

        // Timer for spawning spaceships
        // this.spaceshipSpawnTimer = this.time.addEvent({
        //     delay: 5000, // Every 5000ms (5 seconds)
        //     callback: this.spawnSpaceship,
        //     callbackScope: this,
        //     loop: true,
        // });

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0x301934).setOrigin(0,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x301934).setOrigin(0,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0x301934).setOrigin(0,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x301934).setOrigin(0,0);

        // initialize starting positions player
        this.startingPlayer1Position = { x: this.p1Rocket.x, y: this.p1Rocket.y };

        // end screen text
        this.endScreenText = [];

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        // add mouse controls
        this.input.on('pointermove', (pointer) => {
            this.handlePointerMove(pointer);
        });
        this.input.on('pointerdown', (pointer) => {
            this.handlePointerDown(pointer);
        });
        
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { 
                start: 0, 
                end: 9, 
                first: 0
            }),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;
        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '22px',
            backgroundColor: '#DEB64B',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        // display high score
        this.highScoreText = this.add.text(borderUISize + borderPadding * 12, borderUISize + borderPadding * 2, `High Score: ${gameData.highScore}`, {

            fontFamily: 'Courier',
            fontSize: '22px',
            color: '#000000',
            backgroundColor: '#DEB64B',
            padding: {
                top: 5,
                bottom: 5,
            },
        });
    }

    update() {
        // update tile sprite
        this.starfield.tilePositionY -= 4;  

        this.lasers.forEach(laser => {
            laser.update();
        });
        
        if(!this.gameOver) {
            this.p1Rocket.update();

            // check collisions
            // this.checkAndHandleCollisions(this.p1Rocket);
        }
    }

    // spawn meteor
    // spawnMeteor() {
    //     const x = Phaser.Math.Between(borderUISize + borderPadding, game.config.width - borderUISize - borderPadding);
    //     const meteor = new Meteor(this, x, -50, 'meteor');
    //     this.add.existing(meteor);
    // }
    
    // spawn spaceShip
    // spawnSpaceship() {
    //     const x = Phaser.Math.Between(borderUISize + borderPadding, game.config.width - borderUISize - borderPadding);
    //     const spaceship = new Spaceship(this, x, -50, 'spaceship');
    //     this.add.existing(spaceship);
    // }

    // allow collision handling for both rockets for each spaceship
    // checkAndHandleCollisions(rocket) {
    //     if (this.checkCollision(rocket, this.ship03)) {
    //         this.shipExplode(this.ship03);
    //         if(this.p1Rocket.isFiring){
    //             this.laser.destroy();
    //             this.p1Rocket.isLaser = false;
    //         }
    //     }
    //     if (this.checkCollision(rocket, this.ship02)) {
    //         this.shipExplode(this.ship02);
    //         if(this.p1Rocket.isFiring){
    //             this.laser.destroy();
    //             this.p1Rocket.isLaser = false;
    //         }
    //     }
    //     if (this.checkCollision(rocket, this.ship01)) {
    //         this.shipExplode(this.ship01);
    //         if(this.p1Rocket.isFiring){
    //             this.laser.destroy();
    //             this.p1Rocket.isLaser = false;
    //         }
    //     }
    // }

    // checkCollision(rocket, ship) {
    //     // using Phaser's Rectangle class for collision checking
    //     let rocketRect = new Phaser.Geom.Rectangle(rocket.x, rocket.y, rocket.width, rocket.height);
    //     let shipRect = new Phaser.Geom.Rectangle(ship.x, ship.y, ship.width * ship.scaleX, ship.height * ship.scaleY);
    //     return Phaser.Geom.Rectangle.Overlaps(rocketRect, shipRect);
    // }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;                         
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });

        if (lives > 0) {
            this.p1Rocket.reset();
        } 

        // play randomized explosion sound
        this.playRandomExplosion();
    }

    handlePointerMove(pointer) {
        // mouse movement for P1
        if (!this.p1Rocket.isFiring) {
            this.p1Rocket.x = Phaser.Math.Clamp(pointer.x, borderUISize + borderPadding, game.config.width - borderUISize - borderPadding);
        }
    }
    
    // Mouse Button Down fire
    handlePointerDown(pointer) {
        if (!this.gameOver) {
            this.p1Rocket.isFiring = true;
            this.p1Rocket.isLaser = true;
            this.sound.play('sfx_rocket');
            this.rocketFire();
            console.log("CLICKED");
        }
    }

    // Fire laser
    rocketFire() {
        const currentTime = this.time.now;
        const timeSinceLastLaser = currentTime - this.lastLaserTime;
    
        // Check if at least 3 seconds (3000 ms) have passed since the last laser was fired
        if (timeSinceLastLaser > 3000) {
            // Create laser
            console.log("FIRE");
            this.laser = new Laser(this, this.p1Rocket.x, this.p1Rocket.y, 'laser').setOrigin(0.5, 1);
            this.lasers.push(this.laser);
    
            // laser sfx
            console.log("LASER");
            // this.play('laser_beam');
            // allow player to move
            this.p1Rocket.isFiring = false;
    
            // Check for collisions
            while (this.laser.y > 0 && this.collisionMarker === false) {
                this.checkAndHandleCollisions(this.laser);
                this.laser.update();
            }
    
            // Update the lastLaserTime to the current time
            this.lastLaserTime = currentTime;
        }
        else{
            this.p1Rocket.isFiring = false;
        }
    }
    

    endGame() {
        // add end game sfx
        if (!this.powerDown){
            this.sound.play('power_down');
            this.powerDown = true;
        }
        // display text
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        };
        // end screen text
        this.gameOverText = this.add.text(game.config.width / 2, game.config.height / 2 - 64, 'GAME OVER', scoreConfig).setOrigin(0.5);
        this.restartText = this.add.text(game.config.width / 2, game.config.height / 2, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
        // space to start end screen
        this.spaceToStartText = this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press SPACE to Start Next Player', scoreConfig).setOrigin(0.5);

        // flag game over condition
        this.gameOver = true;
    
        // store end screen text objects in the array
        this.endScreenText.push(this.gameOverText);
        this.endScreenText.push(this.restartText);
        this.endScreenText.push(this.spaceToStartText);

        // check space input to restart
        this.spaceKeyDown = () => {
            if (this.gameOver) {
                this.resetGame();
                this.endScreenText.forEach(text => {
                    if (text) {
                        text.visible = false;
                    }
                });
                // remove flag for end sound
                this.powerDown = false;
                // remove listener
                this.input.keyboard.removeListener('keydown-SPACE', this.spaceKeydown);
            }
        };
        this.input.keyboard.on('keydown-SPACE', this.spaceKeydown);

        // check key input to return to menu
        this.leftKeydown = () => {
            if (this.gameOver) {
                // stop music so it doesnt loop over itself
                this.music.stop();
                // return to menu
                this.scene.start("menuScene");
                this.resetGame();
                // remove flag for end sound
                this.powerDown = false;
                // remove listener
                this.input.keyboard.removeListener('keydown-LEFT', this.leftKeydown);
            }
        };
        this.input.keyboard.on('keydown-LEFT', this.leftKeydown);
    }

    resetGame() {
        // reset player positions
        this.p1Rocket.setPosition(this.startingPlayer1Position.x, this.startingPlayer1Position.y);
    
       // reset score
        this.p1Score = 0;
        this.scoreLeft.text = this.p1Score;

        // reset rockets and spaceships
        this.p1Rocket.reset();

        // restart loop
        this.gameOver = false;
    }

    hideEndScreen() {
        // hide text after restarting game
        this.endScreenText.forEach(text => text.visible = false);
    }

    playRandomExplosion() {
        // randomize explosion sounds
        const explosionIndex = Phaser.Math.Between(1, 5);
        this.sound.play(`sfx_explosion${explosionIndex}`);
    }
}