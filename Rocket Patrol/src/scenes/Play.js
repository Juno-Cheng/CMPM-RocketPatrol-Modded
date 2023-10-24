//If you’re new to JavaScript, you might’ve noticed that odd keyword this while typing the above code. 
//this is a confusing concept in JS, but the basic idea is that it’s a special keyword bound to the current 
//object context. In the example above, this references the Scene object.

class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    
    preload() {
        // load images/tile sprites
        //this class, load image, name, location
        //The load.image() method expects two parameters: a string with the key name of the graphic 
        //you’re going to use (so you can reference it later in your program) and the URL for where your graphic is located.

        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('ufo', './assets/UFO.png');
        this.load.image('spark', './assets/spark.png');
        this.load.image('starfield', './assets/starfield.png');

        // Load a spritesheet 'explosion' and define each frame's dimensions and sequence within the larger image file.
        // Sheet is frames of images, and it read throught it.
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        //Particles

        
        //Clock
        this.initialTime = game.settings.gameTimer; // 60 seconds in milliseconds, can be adjusted.
        this.remainingTime = this.initialTime;

        console.log("Play scene activated");
        this.add.text(20, 20, "Rocket Patrol Play");

        //In Play.js's create() method, add the following code above the code that places the rectangular borders:
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        //Green UI - Starting Point (0, borderUISize + borderPadding), X Leng (Width), Y Height (borderUISize * 2) 
        //.setOrigin is Weird - (0,0) sets to topLeft
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);

        //White Borders: 
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0); 
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        //game.config.width - borderUISize Make space for the border
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // Add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        // Add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        this.ship04 = new UFO(this, game.config.width, borderUISize*6 + borderPadding * 8, 'ufo', 0, 60).setOrigin(0,0);

        // Define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // Add Animations - https://rexrainbow.github.io/phaser3-rex-notes/docs/site/animation/#add-animation
        this.anims.create({key:'explode', frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
        frameRate: 30})

        // Initialize score
        this.p1Score = 0;
        
        // Display score
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
            fixedWidth: 100
        }

        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        this.emitter = this.add.particles(0, 0, 'spark', {
            lifespan: 4000,
            speed: { min: 200, max: 350 },
            scale: { start: 2, end: 0 },
            rotate: { start: 0, end: 360 },
            gravityY: 200,
            emitting: false
        });


    }

    update(time, delta) {
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 4;  //Shifts Background texture

        if(!this.gameOver) { //Stop Objects from Moving
            this.p1Rocket.update();             
            this.ship01.update();               
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();

            this.remainingTime -= delta;

            // When the remaining time reaches zero (or below), end the game.
            if (this.remainingTime <= 0) {
                this.endGame();
            }

        }

        // Collison
        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
          rocket.x + rocket.width > ship.x && 
          rocket.y < ship.y + ship.height &&
          rocket.height + rocket.y > ship. y) {
          return true;
        } 
        
        else {
        return false;
        }
    }

    shipExplode(ship){
        // temporarily hide ship
        ship.alpha = 0;

        //Play animations
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0); // create explosion sprite at ship's position - Creates object
        boom.anims.play('explode');   // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes - event listener
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
          });       

        
        console.log("Particles")
        this.emitter.start();
        this.emitter.explode(16, ship.x, ship.y);
        this.emitter.emitParticleAt(ship.x, ship.y)

        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score; 
        this.sound.play('sfx_explosion');
        this.remainingTime += 5000;
    }

    endGame(){

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
        }

        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart', scoreConfig).setOrigin(0.5);
        this.gameOver = true;
    }

} 