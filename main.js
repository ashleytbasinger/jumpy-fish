// Initialize Phaser, and create a 400x490px game
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

// Create our 'main' state that will contain the game
var mainState = {

  preload: function() {
    // This function will be executed at the beginning, and load the game's assets

    // Change the background color of the game, loading images and sound
    game.stage.backgroundColor = '#71c5cf';
    game.load.image('fish', 'assets/fish.png');
    game.load.image('octo', 'assets/octo.png');
    game.load.audio('jump', 'assets/jump.wav');
  },

  create: function() {
    // This function is called after the preload function (setting up the game)

    // Set the physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Display the fish on the screen
    this.fish = this.game.add.sprite(100, 245, 'fish');
      
    // Changing the center of rotation of the fish
    this.fish.anchor.setTo(-2.0, 0.5);

    // Add gravity to the fish to make it fall
    game.physics.arcade.enable(this.fish);
    this.fish.body.gravity.y = 1000;

    // Call the jump function when the spacebar is hit
    var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      spaceKey.onDown.add(this.jump, this);
      
    // Adding the sound to the game
    this.jumpSound = game.add.audio('jump');
      
    // Grouping octos
    this.octos = game.add.group(); // Create a group
    this.octos.enableBody = true; // Add physics to the group
    this.octos.createMultiple(20, 'octo'); // Create 20 octos
      
    this.timer = game.time.events.loop(1500, this.addRowOfOctos, this);
      
    this.score = 0;
    this.labelScore = game.add.text(20, 20, "0", {font: "30px Arial", fill: "#ffffff"});
  },
    
  addOneOcto: function(x, y) {
    // Get the first dead octo of our group
    var octo = this.octos.getFirstDead();
      
    // Set the new position of the octo
    octo.reset(x, y);
      
    // Add the velocity to the octo to make it move left
    octo.body.velocity.x = -200;
      
    // Kill the octo when it's no longer visible
    octo.checkWorldBounds = true;
    octo.outOfBoundsKill = true;
  
  },

  addRowOfOctos: function() {
    // Pick where the hole will be
    var hole = Math.floor(Math.random() * 5) + 1;
      
    // Add the 6 octos
    for (var i = 0; i < 8; i++)
        if (i != hole && i != hole + 1)
            this.addOneOcto(400, i * 60 + 10);
      
    this.score += 1;
    this.labelScore.text = this.score;
  },

  update: function() {
    // This function is called 60 times per second, and contains the game's logic

    // If the fish is too high or too low, call the 'restartGame' function
    if (this.fish.inWorld == false)
      this.restartGame();
      
    // Collisions will restart the game, too  
    game.physics.arcade.overlap(this.fish, this.octos, this.hitOcto, null, this);
      
    // Adding fish animations
    if (this.fish.angle < 20)
        this.fish.angle += 1;
  },

  jump: function() {
    // No jumping dead fish
    if (this.fish.alive == false)
        return;
      
    // Adding a vertical velocity to the fish
    this.fish.body.velocity.y = -350;
      
    // Create an animation on the fish
    var animation = game.add.tween(this.fish);
      
    // Set the animation to change the angle of the sprite to -20 degrees in 100 milliseconds
    animation.to({angle: -20}, 100);
      
    // Start the animation, and play the jump sound
    animation.start();
    this.jumpSound.play();
  },
    
  hitOcto: function() {
    // If the fish has already hit an octo, do nothing
    if (this.fish.alive == false)
        return;
      
    // Set the alive property of the fish to false
    this.fish.alive = false;
      
    // Prevent new octos from appearing
    game.time.events.remove(this.timer);
      
    // Go through all the octos, and stop their movement
    this.octos.forEachAlive(function(p) {
       p.body.velocity.x = 0; 
    }, this);
  },

  restartGame: function() {
    // Start the 'main' state, which restarts the game
    game.state.start('main');
  },

};

// Add and start the 'main' state to start the game
game.state.add('main', mainState);
game.state.start('main');