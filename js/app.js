
//Global variables to keep track of the player's score and lives remaining.
var score = 0;
var lives = 10;

// Enemies our player must avoid
var Enemy = function() {
    // Set up the enemy's random x,y positions so they are on the street
    // with a random velocity
    this.x = randomNum(-100, -250);
    this.y = (randomNum(0,2) * 85) + 62.5;
    this.v = randomNum(25, 125);

    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // Move the enemy to the right a certain distance based on
    // dt and its velocity v.
    this.x = this.x + (dt * this.v);

    // If the enemy's x position is greater than 500, it will off the board
    // and we will reset it's position to the left of the board
    if (this.x > 500) {
        this.reset();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Resets the enemy to a random position left of the board with random velocity
Enemy.prototype.reset = function() {
    this.x = randomNum(-100, -150);
    this.y = (randomNum(0,2) * 85) + 62.5;
    this.v = randomNum(25,125);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
};

// Function checks if player is on other side of road and resets them
Player.prototype.update = function(dt) {
    if (this.y < 0) {
        score++;
        updateScore();
        this.reset();
    }
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Function resets the players position to the bottom of the board
Player.prototype.reset = function() {
    this.x = 200;
    this.y = 385;
};

// Function for updating player position based on user input and makes
// sure the player will not be able to move off the board.
Player.prototype.handleInput = function(dir) {
    var xDist = 100;
    var yDist = 85;
    switch (dir){
        case "left":
            if( this.x > 0) {
                this.x = this.x - xDist;
            }
            break;
        case "right":
            if( this.x < 400) {
                this.x = this.x + xDist;
            }
            break;
        case "up":
            if( this.y > 0) {
                this.y = this.y - yDist;
            }
            break;
        case "down":
            if( this.y < 385) {
                this.y = this.y + yDist;
            }
            break;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [ new Enemy(), new Enemy(), new Enemy()];
var player = new Player(200, 385);

// Function returns random integer between two numbers
function randomNum(a, b) {
    return Math.round((Math.random() * (b - a)) + a);
}

// Function returns distance between coordinates
function distance(x1, x2, y1, y2) {
    return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}


// Function checks if player runs into enemy. If collistion occurs, it
// resets them to the beginning and takes away a life
function checkCollisions () {
    allEnemies.forEach(function(enemy){
        if(distance(player.x, enemy.x, player.y, enemy.y) < 50){
            lives--;
            updateLives();
            player.reset();
        }
    });
}

// Function updates the score shown to the user
function updateScore() {
    document.getElementById('score').innerHTML = 'Score: '+ score ;
}

// Updates number of lives remaining on the screen. If no lives are left
// the game will reset
function updateLives() {
    document.getElementById('lives-count').innerHTML = ' X '+ lives;
    if(lives === 0) {
        alert("You have lost all your lives. Press OK to play again.");
        score = 0;
        updateScore();
        lives = 10;
        updateLives();
    }
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
