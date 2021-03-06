//parent class that both enemies and players inherit from.
class Character {
  constructor(x, y, sprite) {
    this.x = x;
    this.y = y;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = sprite;
  }
}

// Enemies our player must avoid
class Enemy extends Character {
  constructor(x, y, speed) {
    super(x, y, 'images/enemy-bug.png');
    this.speed = speed;
  }

  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  update(dt) { //, increaseX, increaseY
    this.x = this.x + (this.speed * dt);

    if (this.x < MAX_X) {
        this.x = this.x + (this.speed * dt);
    } else {
        this.x = -100;
        this.y = ENEMY_LANES[Math.floor((Math.random() * 3))]; //set new random lane
        this.speed = Math.floor((Math.random() * 200) + 50); //set new random speed
    }

    this.checkCollision();
  }

  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  //checks to see if the enemy is in a space containing the player.
  //if so, then decrement score, reset player position, and update game status.
  checkCollision() {
    if (this.x >= (player.x - 35) && this.x <= (player.x + 35) && this.y == (player.y - 15)) {
      player.score--;
      player.reset();
      //update game status
      document.getElementById("status").innerHTML = "Score: " + player.score + " | Difficulty Level: " + difficultyLevel + " bugs";
    }
  }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player extends Character {
  constructor(avatar) {
    //x parameter --> 100 increments per square
    //y parameter --> 80 increments per square
    super(200, 405, 'images/' + avatar + '.png');
    this.score = 0;
  }

  // Update the player's position and checks if it is in bounds, or has won.
  move(increaseX, increaseY) {
    if (increaseX !== undefined && increaseX !== 0 && this.inboundsX(increaseX)) {
      this.x = this.x + increaseX;
    }

    if (increaseY !== undefined && increaseY !== 0 && this.inboundsY(increaseY)) {
      this.y = this.y + increaseY;
    }
  }

  //update method used by engine.js,  required method for game
  update() {

  }

  //Before updating position, check to ensure the requested move is inbounds on the x-axis.
  inboundsX(increaseX) {
    let insideBoundaries = true;

    if ((this.x + increaseX) >= MAX_X) {
      insideBoundaries = false;
    } else if ((this.x + increaseX) <= MIN_X) {
      insideBoundaries = false;
    }

    return insideBoundaries;
  }

  //Before updating position, check to ensure the requested move is inbounds on the y-axis.
  inboundsY(increaseY) {
    let insideBoundaries = true;

    if ((this.y + increaseY) >= MAX_Y) {
      insideBoundaries = false;
    }
    else if ((this.y + increaseY) <= MIN_Y) {
      insideBoundaries = false;
      //if this is true, the player WON, so update score/difficultyLevel and restart the game.
      this.score++;
      this.reset();
      stopGame();
      difficultyLevel++;
      startGame();
      alert("You win!  Your score is: " + this.score + ".  Now try with " + difficultyLevel + " bugs!");
      //update game status
      document.getElementById("status").innerHTML = "Score: " + this.score + " | Difficulty Level: " + difficultyLevel + " bugs";
    }

    return insideBoundaries;
  }

  // Draw the player on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  //move player back to starting location.
  reset() {
    this.x = 200;
    this.y = 405;
  }

  //upon hitting any of the arrow keys, move the player appropriately.
  handleInput(e) {
    switch (e) {
      case "up":
        this.move(0, -80);
        break;
      case "down":
        this.move(0, 80);
        break;
      case "left":
        this.move(-100, 0);
        break;
      case "right":
        this.move(100, 0);
        break;
    }
  }
}

//Instantiate objects and declare variables/constants.
const ENEMY_LANES = [70, 150, 230];  //possible enemy lanes
const MIN_X = -100;
const MAX_X = 500;
const MIN_Y = 80;
const MAX_Y = 485;
let difficultyLevel = 3;  //the # of enemies.
let player = new Player("char-boy");
let allEnemies = [];

//Start the game by adding enemies based on the current difficultyLevel and render the player and all enemies.
function startGame() {
  //fill allEnemies
  for (let x = 0; x < difficultyLevel; x++) {
    //add enemy at the starting point in 1 of 3 random lanes running in 1 of 10 random speeds.
    //place all enemy objects in an array called allEnemies
    allEnemies.push(new Enemy(-100, ENEMY_LANES[Math.floor((Math.random() * 3))], Math.floor((Math.random() * 200) + 50)));
  }

  //set game status
  document.getElementById("status").innerHTML = "Score: " + player.score + " | Difficulty Level: " + difficultyLevel + " bugs";
}

//Clear the enemies array.
function stopGame() {
  allEnemies = [];
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//Ensure DOM/window is loaded before starting the game.
window.onload = function() {
  startGame();
};
