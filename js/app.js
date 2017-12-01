// Enemies our player must avoid
class Enemy {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  constructor(x, y, speed) {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = x;
    this.y = y;
    this.sprite = 'images/enemy-bug.png';
    this.speed = speed;
  }

  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  update(dt, increaseX, increaseY) {

    //if dt < 1, then no need to adjust movement as this is a speedy machine.
    if (dt < 1) {
      dt = 1;
    }

    if (increaseX > 0) {
      this.x = this.x + (increaseX * dt);
    }
    if (increaseY > 0) {
      this.y = this.y + (increaseY * dt);
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

  //Activates or deactivates animation of a single enemy.
  //If the enemy leaves the screen, reset the lane and speed to random values, stop the animation and restart with new values.
  animate(on) {
    let animateFunc = function(enemy) {
      let now = Date.now();
      let dt = (now - lastTime) / 1000.0;

      if (enemy.x < maxX) {
        enemy.update(dt, 1, 0);
      } else {
        enemy.x = -100;
        enemy.y = enemyLanes[Math.floor((Math.random() * 3))]; //set new random lane
        enemy.speed = Math.floor((Math.random() * 10) + 1); //set new random speed
        clearInterval(enemy.interval); //clear current animation
        enemy.interval = setInterval(animateFunc, enemy.speed, enemy);  //start animation at new speed.
      }

      lastTime = now;
    }

    if (on) {
      this.interval = setInterval(animateFunc, this.speed, this);
    } else {
      clearInterval(this.interval);
    }
  }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
  constructor(avatar) {
    this.sprite = 'images/' + avatar + '.png';
    this.x = 200; //100 increments per square
    this.y = 405; //80 increments per square
    this.score = 0;
  }

  // Update the player's position, required method for game
  // Parameter: dt, a time delta between ticks
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  update(increaseX, increaseY) {
    if (increaseX !== undefined && increaseX != 0 && this.inboundsX(increaseX)) {
      this.x = this.x + increaseX;
    }

    if (increaseY !== undefined && increaseY != 0 && this.inboundsY(increaseY)) {
      this.y = this.y + increaseY;
    }
  }

  //Before updating position, check to ensure the requested move is inbounds on the x-axis.
  inboundsX(increaseX) {
    let insideBoundaries = true;

    if ((this.x + increaseX) >= maxX) {
      insideBoundaries = false;
    } else if ((this.x + increaseX) <= minX) {
      insideBoundaries = false;
    }

    return insideBoundaries;
  }

  //Before updating position, check to ensure the requested move is inbounds on the y-axis.
  inboundsY(increaseY) {
    let insideBoundaries = true;

    if ((this.y + increaseY) >= maxY) {
      insideBoundaries = false;
    }
    else if ((this.y + increaseY) <= minY) {
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
        this.update(0, -80);
        break;
      case "down":
        this.update(0, 80);
        break;
      case "left":
        this.update(-100, 0);
        break;
      case "right":
        this.update(100, 0);
        break;
    }
  }
};

//Instantiate objects and declare variables/constants.
const enemyLanes = new Array(70, 150, 230);  //possible enemy lanes
const minX = -100;
const maxX = 500;
const minY = 80;
const maxY = 485;
let difficultyLevel = 3;  //the # of enemies.
let player = new Player("char-boy");
let allEnemies = new Array();
let lastTime = Date.now();

//Start the game by adding enemies based on the current difficultyLevel and render the player and all enemies.
function startGame() {
  //fill allEnemies
  for (let x = 0; x < difficultyLevel; x++) {
    //add enemy at the starting point in 1 of 3 random lanes running in 1 of 10 random speeds.
    //place all enemy objects in an array called allEnemies
    allEnemies.push(new Enemy(-100, enemyLanes[Math.floor((Math.random() * 3))], Math.floor((Math.random() * 10) + 1)));
  }

  allEnemies.forEach((enemy) => {
    enemy.render();
    enemy.animate(true);
  });

  player.render();

  //set game status
  document.getElementById("status").innerHTML = "Score: " + player.score + " | Difficulty Level: " + difficultyLevel + " bugs";

}

//Stop all enemy animation and clear the enemies array.
function stopGame() {
  allEnemies.forEach((enemy) => {
    enemy.animate(false);
  });

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

//Ensure DOM is loaded before starting the game.
document.addEventListener("DOMContentLoaded", function(event) {
  startGame();
});
