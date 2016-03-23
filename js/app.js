//////// GLOBAL VARIABLES /////////

var CANVAS_WIDTH = 605,
    CANVAS_HEIGHT = 606;

var TILE_HEIGHT = 80,
    TILE_WIDTH = 101;

var SPRITE_WIDTH = 101,
    SPRITE_HEIGHT = 171;

var PLAYER_START_X = (CANVAS_WIDTH-SPRITE_WIDTH)/2,
    PLAYER_START_Y = (CANVAS_HEIGHT-SPRITE_HEIGHT);

var ENEMY_START_X = (-0.1*CANVAS_WIDTH);


//////// ENEMIES ///////////

var Enemy = function(y, speedBoost) {
    this.sprite = 'images/enemy-bug.png';
    this.width = SPRITE_WIDTH;
    this.height = SPRITE_HEIGHT;
    this.speed = speedBoost + ((Math.random()+0.5) * 100);
    this.x = ENEMY_START_X;
    this.y = y;
    };

    Enemy.prototype.update = function(dt) {
        // If the enemy moves off the canvas the enemy should reset to the start
        if (this.x > CANVAS_WIDTH) {
          this.x = ENEMY_START_X;
        };
        this.x += this.speed * dt;
    };

    // Display our enemy on the canvas
    Enemy.prototype.render = function(y) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };


////////  PUT THE ENEMIES IN THE ARENA /////////////

var allEnemies = [];

allEnemies[0] = new Enemy(60, 0);
allEnemies[1] = new Enemy(140, 0);
allEnemies[2] = new Enemy(220, 0);
allEnemies[3] = new Enemy(60, 60);
allEnemies[4] = new Enemy(300, 60);


//////// PLAYERS ///////////

var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.width = SPRITE_WIDTH;
    this.height = SPRITE_HEIGHT;
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;
    };

    Player.prototype.update = function(dt) { // Make some adjustments as it's using the top left anchor point for the sprite
        this.boundaryRestrict();
        this.checkCollisions();
    };

    // Display our player on the game canvas
    Player.prototype.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

    /* Implement a switch() method to check the user input and move our player
     * around the game canvas
     */
    Player.prototype.handleInput = function(e) {
        switch(e) {
            case 'right':
            this.x+=(TILE_HEIGHT/2.5);
            break;

            case 'down':
            this.y+=(TILE_HEIGHT/2.5);
            break;

            case 'left':
            this.x-=(TILE_HEIGHT/2.5);
            break;

            case 'up':
            this.y-=(TILE_HEIGHT/2.5);
            break;
        }
    };

    Player.prototype.boundaryRestrict = function() {
        if (this.y < -20 ||
                this.y > (CANVAS_HEIGHT-(this.height)) ||
                this.x < -20 ||
                this.x > (CANVAS_WIDTH-(this.width-15))) {
                    this.x = PLAYER_START_X;
                    this.y = PLAYER_START_Y;
                };
    };

    Player.prototype.checkCollisions = function() {
        for(i = 0; i < allEnemies.length; i++) {

            var enemy = allEnemies[i];

            if (this.x < enemy.x + (enemy.width/1.3) &&
               (this.x/1.3) + this.width > enemy.x &&
               this.y < enemy.y + (enemy.height/2.2) &&
               (this.height/2.2) + this.y > enemy.y) {

                    this.x = PLAYER_START_X;
                    this.y = PLAYER_START_Y;
                }
        };
    };


//////// SETUP THE PLAYERS ///////////

//var character =  prompt("Do you want to play as a girl or boy?");
var player = new Player();


//////// USER INPUT ///////////

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
