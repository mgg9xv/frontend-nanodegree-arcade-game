// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = x;
    this.y = y;
    this.v = randomNum(25, 125);
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (dt * this.v);
    if (this.x > 500) {
        this.x = -100;
        this.v = randomNum(25,125);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    // console.log("Rendering Enemy object");
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function(dt) {
    // if(this.update)
};

Player.prototype.render = function() {
    // console.log("Rendering Player object");
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(dir) {
    console.log("User pressed " + dir);
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
            if( this.y > 100) {
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
var allEnemies = [ new Enemy(25,62.5), new Enemy(50, 147.5), new Enemy(50, 232.5)];
var player = new Player(200, 385);

function randomNum(a, b) {
    return (Math.random() * (b - a)) + a;
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
