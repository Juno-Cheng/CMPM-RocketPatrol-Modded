class UFO extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   
        this.points = pointValue;  
        this.moveSpeed = game.settings.spaceshipSpeed*1.5;        
    }

    update() {
        // If resetCounter is greater than zero, decrease it and skip moving the UFO
        if(this.resetCounter > 0) {
            this.resetCounter--;
            return; // Do not execute the movement code below
        }

        // move spaceship left
        this.x -= this.moveSpeed;

        // wrap around from left edge to right edge
        if(this.x <= 0 - this.width) {
            this.reset();
        }
    }

    // position reset
    reset() {
        this.x = game.config.width;
        
        // Set the reset counter (for example, to create a 10-second delay in a 60 fps game, we set it to 600)
        this.resetCounter = 400; // You might need to adjust this value based on the frame rate
    }
}