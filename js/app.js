/* GLOBAL VARIABLES
 * We start by setting up some global variables to be used by the game.
 * ENEMY ROW settings set the position on the canvas for each row of bugs.
 * MAX_ settings are to stop our players walking off the canvas.
 * PLAYER_START_ settings are to set our player's starting position.
 * ENEMY_START_ settings are positioning the bugs to begin off the canvas.
 */

/* TO DO - Keep score. Collect gems.
 */

var CANVAS_WIDTH = 606,
    CANVAS_HEIGHT = 660;

var TILE_WIDTH = 101,
    TILE_HEIGHT = 82;

var ENEMY_ROW_1 = 65,
    ENEMY_ROW_2 = 150,
    ENEMY_ROW_3 = 230,
    ENEMY_ROW_4 = 310;

var SPRITE_WIDTH = 101,
    SPRITE_HEIGHT = 171;

var MAX_RIGHT = TILE_WIDTH*4,
    MAX_LEFT = 0,
    MAX_TOP = 0,
    MAX_BOTTOM = TILE_HEIGHT*4;

var PLAYER_START_X = 0,
    PLAYER_START_Y = (TILE_HEIGHT-1)*5,
    MOVE_VERTICAL = TILE_HEIGHT,
    MOVE_HORIZONTAL = TILE_WIDTH;

var ENEMY_START_X = (-0.1*CANVAS_WIDTH);

var SCORE = 0;

//allEnemies.forEach(checkCollisions2(this,enemy));


/* SETUP HELPER CLASS
 * We will use this area to setup general methods that are not unique to a
 * specific object and can be used throughout the game by all objects.


var Helper = function() {};  */


/* SETUP SCORE KEEPER */

var drawScore = function() {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.font = "35px 'Amatic SC', cursive";
    ctx.textAlign = "left";
    ctx.fillText("Hey Ninja, you have collected "+ SCORE + " diamond swords",
        ctx.canvas.width - 530, ctx.canvas.height - 70);
    ctx.restore();
}

var checkCollisions2 = function(player, object) {
    if (
        player.x < object.x + (object.width-25) &&
        object.x < player.x + (player.width-25) &&
        player.y < object.y + (player.height-98) && // Top of Player & Bottom Enemy
        object.y < player.y + (player.height-105) // Bottom of Player & Top Enemy
        ) {
            player.reset();
            SCORE = 0;
    }
};

/* SETUP GEMS
 * There needs to be a purpose to this game so let's put some gems on there for
 * the player to collect.
 * TO DO - get gem collision working
 */

var Gem = function() {
    this.sprite = 'images/diamond-sword.png';
    this.width = SPRITE_WIDTH;
    this.height = SPRITE_HEIGHT;
    this.x = TILE_WIDTH * (Math.floor(Math.random() * 5)); // spawn in random location
    this.y = TILE_HEIGHT * (Math.floor(Math.random() * 5));
    this.reset = function() {
        this.x = TILE_WIDTH * (Math.floor(Math.random() * 5)); // spawn in random location
        this.y = TILE_HEIGHT * (Math.floor(Math.random() * 5));
        };
    };

    Gem.prototype.update = function(dt) {

        /* We need to multiply any movement by the dt parameter to ensure the
         * game runs at the same speed for all computers.
         */

        this.x += this.speed * dt;

    };

    /* We need to draw our first gem on the canvas in order to start collecting them.
     */

    Gem.prototype.render = function() {

        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
     //   ctx.strokeRect(this.x, this.y, 101, 171);
        drawScore();
    };



var gem = new Gem(); // gem is a global variable



/* SETUP ENEMIES
 * We add in our bugs via an enemy method.
 * speedBoost is to make some bugs super fast - useful if more than 1 on a row.
 */

var Enemy = function(y, speedBoost) {
    this.sprite = 'images/spider.png';
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

        //ctx.clearRect ( this.x, this.y, 100, 100 );
       // ctx.strokeRect(this.x, this.y, 101, 171);
    };

/* We add the bugs to the game and set parameters for (the row we want them to
 * be on, and whether they are an extra speedBoost bug)
 */

var allEnemies = []; // we have setup 5 bugs and allEnemies is a global variable and an empty array

allEnemies[0] = new Enemy(ENEMY_ROW_1, 0);
allEnemies[1] = new Enemy(ENEMY_ROW_2, 0);
allEnemies[2] = new Enemy(ENEMY_ROW_3, 0);
allEnemies[3] = new Enemy(ENEMY_ROW_1, 60);
allEnemies[4] = new Enemy(ENEMY_ROW_4, 60);



/* SETUP PLAYER
 * No game would be complete without a hero
 */

var Player = function() {
    this.sprite = 'images/ninja-two.png';
    this.width = SPRITE_WIDTH;
    this.height = SPRITE_HEIGHT;
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;
    this.reset = function() {
        this.x = PLAYER_START_X;
        this.y = PLAYER_START_Y;
        };
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
                this.x+=MOVE_HORIZONTAL;
            }
            break;

            case 'down':
            if (this.y <= MAX_BOTTOM) {
                this.y+=MOVE_VERTICAL;
            }
            break;

            case 'left':
            if (this.x > MAX_LEFT) {
                this.x-=MOVE_HORIZONTAL;
            }
            break;

            case 'up':
            if (this.y > MAX_TOP) {
                this.y-=MOVE_VERTICAL;
            }
            break;
        }
    };

    /* Here is our collisions function where we can check when our player
     * hits one of our enemies, using the rectangular method.
     */

    Player.prototype.checkCollisions = function() {

        if (

        player.x < gem.x + (gem.width-25) &&
        gem.x < player.x + (player.width-25) &&
        player.y < gem.y + (player.height-98) && // Top of Player & Bottom Enemy
        gem.y < player.y + (player.height-105)

            ) {
                gem.reset();
                SCORE++;
            }


        for(i = 0; i < allEnemies.length; i++) {

            var enemy = allEnemies[i];

            checkCollisions2(this,enemy);
        };

    };


/* Let's add in our player
 */

var player = new Player(); // player is a global variable


/* Prevent browser scrolling upon key input to stop canvas conflict */

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

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
