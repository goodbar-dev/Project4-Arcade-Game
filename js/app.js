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

    if (dt < 1) {
      dt = 1;
    }

    if (increaseX > 0) {
      this.x = this.x + (increaseX * dt);
    }
    if (increaseY > 0) {
      this.y = this.y + (increaseY * dt);
    }
  }

  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  checkCollisions() {

  }

  animate(on) {
    let animateFunc = function(enemy) {
      let now = Date.now();
      let dt = (now - lastTime) / 1000.0;

      if (enemy.x < maxX) {
        enemy.update(dt, 1, 0);
      } else {
        enemy.x = -100;
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
    }

    return insideBoundaries;
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

// Now instantiate your objects.
const enemyLanes = new Array(70, 150, 230);  //possible enemy lanes
const minX = -100;
const maxX = 500;
const minY = 80;
const maxY = 485;
const difficultyLevel = 8;  //the # of enemies
let player = new Player("char-boy");
let allEnemies = new Array();
let lastTime = Date.now();

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
