/*
your first/last name:
Jonathan D Cheng

mod title (e.g. Rocket Patrol Reloaded IV: The Rocketing):
Rocket Patrol: UFO

the approximate time it took to complete the project (in hours):
11 Hours - Mostly Research

the mods you chose from the list above, their point values, and, if necessary, an explanation of their implementation:

- Added New Enemy: UFO.png - Changed Image/Speed/Point Value of Spaceship (5)
- Implement mouse control for player movement and mouse click to fire (5) - Tracked Mouse Position.x and Mouse Left
- Implement a new timing/scoring mechanism - Every enemy hit increase by 5 seconds, time tracked by time, delta in Update()
- Added Particles - Use Phaser 3, this.add.particles and explode() and emitParticleAt() - (5)

20 Points Total/ 20 Points Max
*/


//The console.log() function allows us to “print” messages to the JavaScript Console, a browser tool provided to developers 
//to help debug their code. The Console is essential to web programming, and you’ll use it extensively while building web games.
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ],
    input: {
        mouse: true  // this line ensures the mouse plugin is active
    }
  }

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard vars - Keyboard Setup Section
let keyF, keyR, keyLEFT, keyRIGHT;