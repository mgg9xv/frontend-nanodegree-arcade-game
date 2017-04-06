//Global variables to keep track of the player's score and lives remaining.
var score = 0;
var lives = 5;
var suffix, scale;

if( window.innerWidth < 1000) {
    suffix = '-small';
    scale = 0.5;
} else if (window.innerWidth < 1400 ) {
    suffix = '-medium';
    scale = 0.75;
} else {
    suffix = '-large';
    scale = 1;
}

// Enemies our player must avoid
var Enemy = function() {
    // Set up the enemy's random x,y positions so they are on the street
    // with a random velocity
    this.x = randomNum(-100, -250);
    this.y = (randomNum(0,2) * (85 * scale)) + (62.5 * scale);
    this.v = randomNum(25, 125);

    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug' + suffix + '.png';
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
    if (this.x > (500 * scale)) {
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
    this.y = (randomNum(0,2) * 85 * scale) + (62.5 * scale);
    this.v = randomNum(25,125);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy' + suffix + '.png';
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
    this.x = 200 * scale;
    this.y = 385 * scale;
};

// Function for updating player position based on user input and makes
// sure the player will not be able to move off the board.
Player.prototype.handleInput = function(dir) {
    var xDist = 100 * scale;
    var yDist = 85 * scale;
    switch (dir){
        case "left":
            if( this.x > 0) {
                this.x = this.x - xDist;
            }
            break;
        case "right":
            if( this.x < 400 * scale) {
                this.x = this.x + xDist;
            }
            break;
        case "up":
            if( this.y > 0) {
                this.y = this.y - yDist;
            }
            break;
        case "down":
            if( this.y < 385 * scale) {
                this.y = this.y + yDist;
            }
            break;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [ new Enemy(), new Enemy(), new Enemy()];
var player = new Player(200 * scale, 385 * scale);

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
        if(distance(player.x, enemy.x, player.y, enemy.y) < (50 * scale)) {
            lives--;
            updateLives();
            player.reset();
        }
    });
}

// Function updates the score shown to the user
function updateScore() {
    document.getElementById('score').innerHTML = score.toString() ;
}

// Updates number of lives remaining on the screen. If no lives are left
// the game will reset
function updateLives() {
    var livesHTML = '';
    var i = 0;
    while ( i < lives ) {
        livesHTML += "<img class='heart-img' src='images/heart.svg'>";
        i++;
    }
    document.getElementById('lives').innerHTML = livesHTML;

    if(lives === 0) {
        alert("You have lost all your lives. Press OK to play again.");
        score = 0;
        updateScore();
        lives = 5;
        updateLives();
    }
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    e.preventDefault();
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

document.querySelector('#up-arrow').addEventListener('click', function(e) {
    e.preventDefault();
    player.handleInput('up');
});
document.querySelector('#left-arrow').addEventListener('click', function(e) {
    e.preventDefault();
    player.handleInput('left');
});
document.querySelector('#right-arrow').addEventListener('click', function(e) {
    e.preventDefault();
    player.handleInput('right');
});
document.querySelector('#down-arrow').addEventListener('click', function(e) {
    e.preventDefault();
    player.handleInput('down');
});
