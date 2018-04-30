const messageDisplay = document.getElementById('message-area');  
const heartCountDisplay = document.getElementById('heart'); 
const SucceededCountDisplay = document.getElementById('Succeeded');

/*
 * ENEMY
 */

var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
    this.y = 0;
	this.enemyRow = Math.floor(Math.random()*3); //to come out randomly from three rows
    this.speed = Math.floor(Math.random()*200)+80; //minimum speed 80
};

Enemy.prototype = new Enemy();

Enemy.prototype.update = function(dt) {
    this.x = this.x + dt * this.speed; //moving to right
	
	if(this.enemyRow === 0) { //enemies come randomly
		this.y = 60;
	} else if(this.enemyRow === 1) {
		this.y = 145;
	} else {
		this.y = 230;
	};

	if(this.x > 500) { //enemies arrived the right border and come from left again
	this.x = -100
	};

	checkCollisions(this);	
}

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


/*
 * PLAYER
 */
 

var Player = function() {
    this.sprite = 'images/char-cat-girl.png';
    this.x = 200;
    this.y = 400;
	this.reachedCount = 0;
	this.heartPoint = 2;
	this.killedCount = 0;
}

Player.prototype = new Player();

Player.prototype.handleInput = function(key){

	if(key === 'left') {
		this.x = this.x - 100;
	} else if(key === 'right') {
		this.x = this.x + 100;		
	} else if(key === 'up') {
		this.y = this.y - 85;
	} else if(key === 'down') {
		this.y = this.y + 85;
	} else {
	this.x =  this.x //to make other keys not to work
	}
}

Player.prototype.update = function() {

	if(this.x > 400) { //stop at right border
		this.x = 400;
	};	
	if(this.x < 0) { //stop at left border
		this.x = 0;
	};		
	if(this.y > 400) { //stop at bottom border
		this.y = 400;
	};		
	if(this.y < 0 && this.reachedCount !=3) { //arrive at the water
		reachedRiver(this);
	}
};

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


/*
 * HEART
 */
 

var Heart = function(){ 
	this.sprite = 'images/Heart.png';
    this.x = 0;
    this.y = 0;
	this.heartRow = Math.floor(Math.random()*3);
	this.heartColumn = Math.floor(Math.random()*4);
}

Heart.prototype = new Heart();

Heart.prototype.update = function() {

	if(this.heartRow === -1) { //to be hid after the player gets the heart
		this.y = 60;
	} else if(this.heartRow === 0) { //appear randomly
		this.y = 80;
	} else if(this.heartRow === 1) {
		this.y = 165;
	} else {
		this.y = 250;
	}
	
	if(this.heartColumn === -1) { //to be hid after the player gets the heart
		this.x = 500;
	} else if(this.heartColumn === 0) { //appear randomly
		this.x = 100;
	} else if(this.heartColumn === 1) {
		this.x = 200;
	} else if(this.heartColumn === 2) {
		this.x = 300;
	} else {
		this.x = 400;
	}
	
	checkCollisionHeart(this); //to check if the player touched the heart
}

Heart.prototype.render = function() { // to show a heart
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}

	
let allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy()]; //4 enemies
let player = new Player();
let heart = new Heart();


document.addEventListener('keyup', function(e) {
    if(player.reachedCount != 3) { // lock this function for not going out of the river when the player win (reachedCount = 3)
	var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
	}

    player.handleInput(allowedKeys[e.keyCode]);
});


/*
 *  FUNCTIONS
 */

 
 
function checkCollisions(oneOfEnemies) { //to check if the player touched any enemies
	if(player.y === oneOfEnemies.y && player.x <= oneOfEnemies.x + 50 && player.x >= oneOfEnemies.x - 50 ) {
		player.killedCount ++;
		player.heartPoint --;
		heartCountDisplay.textContent = player.heartPoint;
		originalPosition();
		checkGameOver (this)
	}
}

function checkCollisionHeart(aHeart){ //to check if the player touched the heart

	if(aHeart.y === player.y + 20 && aHeart.x === player.x ) {
		player.heartPoint ++;
		heartCountDisplay.textContent = player.heartPoint;
		aHeart.heartRow= -1; // to be hid outside of the field
		aHeart.heartColumn = -1; // to be hid outside of the field
	}
}

function reachedRiver(player) { //success to arrive at the river 
	player.reachedCount ++;
	SucceededCountDisplay.textContent = player.reachedCount;
	allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy()]; //reborn enemies
	checkGameClear();
}
 
function checkGameOver() { //to check if the game is over
	if (player.heartPoint === 0) {
		messageDisplay.innerHTML = "<b>GAME OVER!</b>";
		messageDisplay.style.display = 'block';
		setTimeout(function(){allReset()},1000);
	}
}

function checkGameClear() { //to check if the game is clear
	if(player.reachedCount === 3) {
		messageDisplay.innerHTML = "<b>YOU WON!</b>";
		messageDisplay.style.display = 'block';
		setTimeout(function(){allReset()},1000);
	} else {
		originalPosition();
		heart = new Heart();
	}
}

function originalPosition() { //the player goes back to the default position
	player.x = 200;
    player.y = 400;	
}

function allReset() { //restart the game
    player.x = 200;
    player.y = 400;
	player.reachedCount = 0;
	player.heartPoint = 2;
	player.killedCount = 0;
	heartCountDisplay.textContent = player.heartPoint;	
	SucceededCountDisplay.textContent = player.reachedCount;
	heart = new Heart();
	messageDisplay.style.display = 'none';
}