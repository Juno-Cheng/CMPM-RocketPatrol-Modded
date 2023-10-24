// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);
  
    // add object to existing scene
    scene.add.existing(this);

    //Adding movement:
    this.isFiring = false;
    this.moveSpeed = 2;
    this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
    }

    update() {
        // Get the pointer's position and state.
        let pointer = this.scene.input.activePointer;
    
        // Update player position based on the mouse position.
        if (!this.isFiring) {
            if (pointer.x !== this.x) {
                this.x = Phaser.Math.Clamp(pointer.x, borderUISize + this.width, game.config.width - borderUISize - this.width);
            }
        }
    
        // Keyboard controls remain the same and provide alternative control.
        if (!this.isFiring) {
            if (keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
        }
    
        // Fire on left click or when the 'F' key is pressed.
        if ((pointer.isDown || Phaser.Input.Keyboard.JustDown(keyF)) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();  // play sfx
        }
    
        // If fired, move up.
        if (this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }
    
        // Reset on miss.
        if (this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }
    

    reset(){
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }


}