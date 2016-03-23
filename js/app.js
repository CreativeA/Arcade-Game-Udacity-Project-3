/* GLOBAL VARIABLES
 * We start by setting up some global variables to be used by the game.
 * ENEMY ROW settings set the position on the canvas for each row of bugs.
 * MAX_ settings are to stop our players walking off the canvas.
 * PLAYER_START_ settings are to set our player's starting position.
 * ENEMY_START_ settings are positioning the bugs to begin off the canvas.
 */

/* TO DO - Set difficult rating. Keep score. Collect gems.
 */

var CANVAS_WIDTH = 606,
    CANVAS_HEIGHT = 606;

var TILE_HEIGHT = 80,
    TILE_WIDTH = 101;

var ENEMY_ROW_1 = 65,
    ENEMY_ROW_2 = 150,
    ENEMY_ROW_3 = 230,
    ENEMY_ROW_4 = 310;

var SPRITE_WIDTH = 101,
    SPRITE_HEIGHT = 171;

var MAX_RIGHT = CANVAS_WIDTH-SPRITE_WIDTH,
    MAX_LEFT = 0,
    MAX_TOP = 0,
    MAX_BOTTOM = CANVAS_HEIGHT-SPRITE_HEIGHT-20;

var PLAYER_START_X = (CANVAS_WIDTH-SPRITE_WIDTH)/2,
    PLAYER_START_Y = (CANVAS_HEIGHT-SPRITE_HEIGHT);

var ENEMY_START_X = (-0.1*CANVAS_WIDTH);


/* SETUP GEMS
 * There needs to be a purpose to this game so let's put some gems on there for
 * the player to collect.

/* SETUP ENEMIES
 * We add in our bugs via an enemy method.
 * speedBoost is to make some bugs super fast - useful if more than 1 on a row.
 */

var Enemy = function(y, speedBoost) {
    this.sprite = 'images/enemy-bug.png';
    this.width = SPRITE_WIDTH;
    this.height = SPRITE_HEIGHT;
    this.x = ENEMY_START_X;
    this.y = y;
    this.speed = speedBoost + ((Math.random()+0.5) * 100);
    };

    Enemy.prototype.update = function(dt) {

        /* If the bugs get to the edge of the canvas we want them to reset and
         * start all over again.
         */

        if (this.x > CANVAS_WIDTH) {
          this.x = ENEMY_START_X;
        };

        /* We need to multiply any movement by the dt parameter to ensure the
         * game runs at the same speed for all computers.
         */

        this.x += this.speed * dt;
    };

    Enemy.prototype.render = function(y) {

        /* We need to draw our bugs on the canvas to be able to play the game.
        */

        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
       // ctx.strokeRect(this.x, this.y, 101, 171);
    };

/* We add the bugs to the game and set parameters for (the row we want them to
 * be on, and whether they are an extra speedBoost bug)
 */

var allEnemies = [];

allEnemies[0] = new Enemy(ENEMY_ROW_1, 0);
allEnemies[1] = new Enemy(ENEMY_ROW_2, 0);
allEnemies[2] = new Enemy(ENEMY_ROW_3, 0);
allEnemies[3] = new Enemy(ENEMY_ROW_1, 60);
allEnemies[4] = new Enemy(ENEMY_ROW_4, 60);


/* SETUP PLAYER
 * No game would be complete without a hero
 */

var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.width = SPRITE_WIDTH;
    this.height = SPRITE_HEIGHT;
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;
    };

    Player.prototype.update = function(dt) {

        /* We need to call our collisions function in order to get the player
         * to reset when it hits a bug.
         */

        this.checkCollisions();
    };

    /* We need to draw out player on the canvas for the game to function.
     */

    Player.prototype.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
     //   ctx.strokeRect(this.x, this.y, 101, 171);
    };

    /* We implement a switch() method to check the user input and move our player
     * around the game canvas. We restrict the player with MAX_ so they cannot
     * move off the canvas.
     */

    Player.prototype.handleInput = function(e) {
        switch(e) {
            case 'right':
            if (this.x <= MAX_RIGHT) {
                this.x+=(TILE_HEIGHT/2.5);
            }
            break;

            case 'down':
            if (this.y <= MAX_BOTTOM) {
                this.y+=(TILE_HEIGHT/2.5);
            }
            break;

            case 'left':
            if (this.x > MAX_LEFT) {
                this.x-=(TILE_HEIGHT/2.5);
            }
            break;

            case 'up':
            if (this.y > MAX_TOP) {
                this.y-=(TILE_HEIGHT/2.5);
            }
            break;
        }
    };

    /* Here is our collisions function where we can check when our player
     * hits one of our enemies, using the rectangular method.
     */

    Player.prototype.checkCollisions = function() {
        for(i = 0; i < allEnemies.length; i++) {

            var enemy = allEnemies[i];

            if (
                this.x < enemy.x + (enemy.width) &&
                enemy.x < this.x + (this.width) &&
                this.y < enemy.y + (enemy.height-90) && // Top of Player & Bottom Enemy
                enemy.y < this.y + (this.height-95) // Bottom of Player & Top Enemy
                ) {
                    this.x = PLAYER_START_X;
                    this.y = PLAYER_START_Y;
                }
        };
    };


/* Let's add in our player
 */

var player = new Player();


/* Here we are listening for our user to input the moves it wants the
 * player to make on the canvas.
 */

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);

});
