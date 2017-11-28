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
  update(dt, x, y) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    //this.x = x * dt;
    //this.y = y * dt;
  }

  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  animate(on) {
    let animateFunc = function(enemy) {
      if (enemy.x < maxX) {
        enemy.x++;
      } else {
        enemy.x = -100;
      }
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
  }

  // Update the player's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
  }

  // Draw the player on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  reset() {

  }

  handleInput(e) {
    switch (e) {
      case "up":
        this.y -= 80;
        break;
      case "down":
        this.y += 80;
        break;
      case "left":
        this.x -= 100;
        break;
      case "right":
        this.x += 100;
        break;
    }
  }
};

// Now instantiate your objects.
const enemyLanes = new Array(70, 150, 230);  //possible enemy lanes
const minX = -100;
const maxX = 600;
const difficultyLevel = 8;  //the # of enemies
let player = new Player("char-boy");
let allEnemies = new Array();

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

document.addEventListener("DOMContentLoaded", function(event) {
  startGame();
});
