class Menu extends Phaser.Scene {
  constructor() {
      super("menuScene");
  }

  preload() {
      // load audio
      this.load.audio('sfx_select', './assets/blip_select12.wav');
      this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
      this.load.audio('sfx_explosion1', './assets/explosion38.wav');
      this.load.audio('sfx_explosion2', './assets/8bitXPL.wav');
      this.load.audio('sfx_explosion3', './assets/8bitXPL2.wav');
      this.load.audio('sfx_explosion4', './assets/bassXPL.wav');
      this.load.audio('sfx_explosion5', './assets/bassXPL.wav');
      // add end round audio
      this.load.audio('power_down', './assets/8bitpowerdwn.wav');
      this.load.image('starfield', './assets/starfield2new.png');
  }
  
  create() {
      // menu text configuration
      let menuConfig = {
          fontFamily: 'Major Mono Display',
          fontSize: '28px',
          color: '#FFFFFF',
          align: 'right',
          padding: {
              top: 5,
              bottom: 5,
          },
          fixedWidth: 0
      }
      let titleConfig = {
        fontFamily: 'Major Mono Display',
        fontSize: '48px', 
        color: '#FFFFFF',
        align: 'right',
        padding: {
            top: 5,
            bottom: 5,
        },
        fixedWidth: 0
    }    

      this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0,0);
      
      // show menu text
      this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'Endless Space', titleConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/2, 'Use mouse to move, click to shoot', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press space to start', menuConfig).setOrigin(0.5);

      // define keys
      keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update() {
      if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
        // Novice mode
        game.settings = {
          spaceshipSpeed: 3,
        }
        this.sound.play('sfx_select');
        this.scene.start("spaceScene", game.settings);
      }
      // if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
      //   // Expert mode
      //   game.settings = {
      //     spaceshipSpeed: 6,
      //   }
      //   this.sound.play('sfx_select');
      //   this.scene.start("spaceScene", game.settings);
      // }
    }
}