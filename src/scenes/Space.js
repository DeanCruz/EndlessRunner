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

        // Declare the spaceships array as an empty array
        this.spaceships = []; 

        // Declare lives
        this.lives = 3;


    }

    // initialize game settings
    init(settings) {
        this.settings = settings;
        this.gameTimer = settings.gameTimer;
    }

    preload(){
        // load images/tile sprites
        this.load.image('rocket', './assets/newrocket.png');
        // Load images for Meteor
        // this.load.image('meteor', './assets/meteor.png');
        // Load images for Spaceship
        this.load.image('spaceship', './assets/ufo.png');
        // load rocket laser
        this.load.image('laser', './assets/laser.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        // load music
        this.load.audio('backgroundMusic', ['./assets/rocketpatrolbackground.mp3']);
        // starfield
        this.load.image('starfield', './assets/starfield2new.png');
    }

    create() {
        // create music
        this.music = this.sound.add('backgroundMusic');
        this.music.setVolume(0.5);
        // start playing the background music
        this.music.play();
        
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0,0);
        
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height/1.2, 'rocket').setOrigin(0.5, 0);
        this.p1Rocket.setScale(0.08);

        //add spaceship
        this.lastSpaceshipTime = 0;
        this.spaceships = [];
        this.spawnSpaceship();
        


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
        this.spaceshipSpawnTimer = this.time.addEvent({
            delay: 5000, // Every 5000ms (5 seconds)
            callback: this.spawnSpaceship, 
            callbackScope: this,
            loop: true,
        });

        // black borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0x000000 ).setOrigin(0,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x000000).setOrigin(0,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0x000000).setOrigin(0,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x000000).setOrigin(0,0);

        // Add text for controls
        this.controlsText = this.add.text(game.config.width / 2, game.config.height - borderPadding, 'Use mouse to move, click to shoot', {
            fontFamily: 'Major Mono Display',
            fontSize: '16px',
            color: '#FFFFFF',
        }).setOrigin(0.5, 1);
  

        // initialize starting positions player
        this.startingPlayer1Position = { x: this.p1Rocket.x, y: this.p1Rocket.y };

        // end screen text
        this.endScreenText = [];

        // define keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
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

        let scoreConfig = {
            fontFamily: 'Major Mono Display',
            fontSize: '22px',
            backgroundColor: '#DEB64B',
            color: '#000000',
            align: 'left', // Align the current score on the left
            padding: {
              top: 5,
              bottom: 5,
            },
          };
          
          let scoreX = borderUISize + borderPadding;
          let scoreY = borderUISize + borderPadding * 2;
          
          this.scoreLeft = this.add.text(scoreX, scoreY, `Score: ${this.p1Score}`, scoreConfig);
          this.scoreLeft.setOrigin(0, 0); // Set origin to top-left
    }

    update() {
        // update tile sprite
        this.starfield.tilePositionY -= 4;  

        this.lasers.forEach(laser => {
            laser.update();
        });

        if(!this.gameOver) {
            this.p1Rocket.update();

            // Increment score
            this.p1Score += .02;
            this.scoreLeft.text = `Score: ${Math.floor(this.p1Score)}`;



            // Spawn spaceships over time
            this.spawnSpaceship();

            // Update all spaceships
            this.spaceships.forEach((spaceship) => {
                spaceship.update();
            });

            this.checkAndHandleCollisions();
        }
    }

    // spawn meteor
    // spawnMeteor() {
    //     const x = Phaser.Math.Between(borderUISize + borderPadding, game.config.width - borderUISize - borderPadding);
    //     const meteor = new Meteor(this, x, -50, 'meteor');
    //     this.add.existing(meteor);
    // }
    
    // spawn spaceShip
    spawnSpaceship() {
        const currentTime = this.time.now;
      
        // Check if enough time has passed since the last spaceship was spawned
        if (currentTime - this.lastSpaceshipTime >= 500) {
          const randomX = Phaser.Math.Between(borderUISize + borderPadding, game.config.width - borderUISize - borderPadding);
          const spaceship = new Spaceship(this, randomX, 0, 'spaceship', 0, 30).setOrigin(0, 0);
          spaceship.setScale(0.07);
          this.add.existing(spaceship);
          this.spaceships.push(spaceship);
      
          // Update the lastSpaceshipTime to the current time
          this.lastSpaceshipTime = currentTime;
        }
      }

    // Check collision between laser and spaceships
    checkRocketSpaceshipCollision() {
        this.spaceships.forEach((spaceship) => {
          if (Phaser.Geom.Intersects.RectangleToRectangle(this.p1Rocket.getBounds(), spaceship.getBounds())) {
            this.shipExplode(this.p1Rocket);
            this.shipExplode(spaceship);
            this.endGame();
          }
        });
      }
    
      checkLaserSpaceshipCollision() {
        this.lasers.forEach((laser) => {
          this.spaceships.forEach((spaceship) => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(laser.getBounds(), spaceship.getBounds())) {
              this.shipExplode(spaceship);
              laser.destroy();
              this.lasers.splice(this.lasers.indexOf(laser), 1);
              this.p1Score += 50;
              this.scoreLeft.text = `Score: ${Math.floor(this.p1Score)}`;
            }
          });
        });
      }
    
      checkAndHandleCollisions() {
        this.checkRocketSpaceshipCollision();
        this.checkLaserSpaceshipCollision();
      }
      
      shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        boom.setScale(1);
        boom.anims.play('explode'); // play explode animation
        boom.on('animationcomplete', () => {
          // callback after anim completes
          ship.reset(); // reset ship position
          ship.alpha = 1; // make ship visible again
          boom.destroy(); // remove explosion sprite
        });

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
            this.sound.play('sfx_rocket');
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
            this.sound.play("sfx_select");
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
            fontFamily: 'Major Mono Display',
            fontSize: '28px',
            color: '#DEB64B',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0,
        };

        // end screen text
        this.gameOverText = this.add.text(game.config.width / 2, game.config.height / 2 - 128, 'GAME OVER', scoreConfig).setOrigin(0.5);
        // credits
        this.creditsText = this.add.text(game.config.width / 2, game.config.height / 2, '__Credits__', scoreConfig).setOrigin(0.5);
        this.creditName = this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Dean Cruz - Everything', scoreConfig).setOrigin(0.5);
        // space to start end screen
        this.spaceToStartText = this.add.text(game.config.width / 2, game.config.height / 2 - 64, 'Press SPACE', scoreConfig).setOrigin(0.5);

        // flag game over condition
        this.gameOver = true;
    
        // store end screen text objects in the array
        this.endScreenText.push(this.gameOverText);
        this.endScreenText.push(this.creditsText);
        this.endScreenText.push(this.creditName);
        this.endScreenText.push(this.spaceToStartText);

        // check key input to return to menu
        this.spaceKeyDown = () => {
            if (this.gameOver) {
                // stop music so it doesnt loop over itself
                this.music.stop();
                // return to menu
                this.scene.start("menuScene");
                this.resetGame();
                // remove flag for end sound
                this.powerDown = false;
                // remove listener
                this.input.keyboard.removeListener('keydown-SPACE', this.spaceKeyDown);
            }
        };
        this.input.keyboard.on('keydown-SPACE', this.spaceKeyDown);
    }

    resetGame() {    
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