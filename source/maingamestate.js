var mainGameState = {}
var g_lastScore = 0;        // Global variable we can access anywhere

mainGameState.preload = function() { 
    console.log("Pre-loading the Game");
    this.game.load.image("space-bg", "assets/images/space-bg.jpg");
    this.game.load.image("player-ship", "assets/images/player-ship.png" );
    this.game.load.image("asteroid-medium-02", "assets/images/asteroid-medium-02.png");
    this.game.load.image("player-bullet", "assets/images/bullet-fire.png");  
    
    this.game.load.audio("game-music", "assets/music/maingame.mp3");
    this.game.load.audio('player_fire_01', 'assets/audio/player_fire_01.mp3');
    this.game.load.audio('player_fire_02', 'assets/audio/player_fire_02.mp3');
    this.game.load.audio('player_fire_03', 'assets/audio/player_fire_03.mp3');
    this.game.load.audio('player_fire_04', 'assets/audio/player_fire_04.mp3');
    this.game.load.audio('player_fire_05', 'assets/audio/player_fire_05.mp3');
    this.game.load.audio('player_fire_06', 'assets/audio/player_fire_06.mp3');
}

mainGameState.create = function() { 
    
    this.playerFireSfx = [];
    this.playerFireSfx.push(this.game.add.audio("player_fire_01"));
    this.playerFireSfx.push(this.game.add.audio("player_fire_02"));
    this.playerFireSfx.push(this.game.add.audio("player_fire_03"));
    this.playerFireSfx.push(this.game.add.audio("player_fire_04"));
    this.playerFireSfx.push(this.game.add.audio("player_fire_05"));
    this.playerFireSfx.push(this.game.add.audio("player_fire_06"));
    
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    
    // Player ship
    this.game.add.sprite(0, 0, 'space-bg');
    
    var shipX = this.game.width * 0.5;
    var shipY = this.game.height * 0.8;

    this.cursors = this.game.input.keyboard.createCursorKeys();        

    this.playerShip = this.game.add.sprite(shipX, shipY, 'player-ship');
    this.playerShip.anchor.setTo(0.5, 0.5);
    this.game.physics.arcade.enable(this.playerShip);
    
    //music
    this.music = this.game.add.audio("game-music");
    this.music.play();
    this.music.volume = 0.5;
    this.music.loop = true;     

    //astroids
    
    this.asteroidTimer= 2.0;
    this.asteroids = this.game.add.group();
    
    //bullets
    this.playerBullets = this.game.add.group();
    
    //set firekey to Z 
    this.fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
    this.fireTimer = 0.4;
    
    //setting up the scores
 
    var textStyle = {font: "16px Arial", fill: "#ffffff", align: "center"}

    this.scoreTitle = this.game.add.text(this.game.width * 0.15, 30, "SCORE", textStyle);
    this.scoreTitle.fixedToCamera = true;
    this.scoreTitle.anchor.setTo(0.5, 0.5);

    this.scoreValue = this.game.add.text(this.game.width * 0.15, 50, "0", textStyle);
    this.scoreValue.fixedToCamera = true;
    this.scoreValue.anchor.setTo(0.5, 0.5);

    this.playerScore = 0;
    
    ///Player lives
    
    var textStyle = {font: "16px Arial", fill: "#ffffff", align: "center"}

    this.livesTitle = this.game.add.text(this.game.width * 0.85, 30, "LIVES", textStyle);
    this.livesTitle.fixedToCamera = true;
    this.livesTitle.anchor.setTo(0.5, 0.5);

    this.livesValue = this.game.add.text(this.game.width * 0.85, 50, "0", textStyle);
    this.livesValue.fixedToCamera = true;
    this.livesValue.anchor.setTo(0.5, 0.5);

    this.playerLives = 3;
    
}

mainGameState.update = function() { 
    
    if ( this.cursors.left.isDown ) {
        this.playerShip.body.velocity.x = -200;
    } else if ( this.cursors.right.isDown ) {
        this.playerShip.body.velocity.x = 200;
    } else {
        this.playerShip.body.velocity.x = 0;
    }
    
    if ((this.playerShip.x > this.game.width) && (this.playerShip.body.velocity.x > 0)) {
        this.playerShip.body.velocity.x = 0;
    }

    if ((this.playerShip.x < 0) && (this.playerShip.body.velocity.x < 0)) {
        this.playerShip.body.velocity.x = 0;
    }
    
    
    //Creating/spawning Asteroids
    
    this.asteroidTimer -= this.game.time.physicsElapsed;

    if ( this.asteroidTimer <= 0.0 ) {
        console.log("SPAWN ASTEROID");
        mainGameState.spawnAsteroid()
        this.asteroidTimer = 2.0; 
    }
    
    this.fireTimer -= this.game.time.physicsElapsed;
    
    if ( this.fireKey.isDown ) {
        this.spawnPlayerBullet();
    }
    
    
    for (var j = 0; j < this.playerBullets.children.length; j++) {
        if ( this.playerBullets.children[j].y < -200 ) {
            this.playerBullets.children[j].destroy();
        }
    }
    
    // Clean up any asteroids that have moved off the bottom of the screen
    for( var z = 0; z < this.asteroids.children.length; z++ ) {
        if ( this.asteroids.children[z].y > (this.game.height + 200) ) {
            this.asteroids.children[z].destroy();
        }
    }
    

    //check for collision asteroid - bullets
    this.game.physics.arcade.collide(this.asteroids, this.playerBullets, mainGameState.onAsteroidBulletCollision, null, this);

    
    //update text label for player score
    this.scoreValue.setText(this.playerScore);
    this.livesValue.setText(this.playerLives);
 
    
    //check for collision player - asteroid
    this.game.physics.arcade.overlap(this.playerShip, this.asteroids, mainGameState.onAsteroidPlayerCollision, null,this);
    

    //check if player is dead
    if (this.playerLives <= 0) {
        g_lastScore = this.playerScore;
        this.game.state.start("GameOver");
    }
    
    //check if player won level
    if (this.playerScore >= 150) {
        this.game.state.start("Winner");
    }
    
}

mainGameState.spawnAsteroid = function() {
    
    //creating astroids
  
    var x = this.game.rnd.integerInRange(0, this.game.width);
    var asteroid = this.game.add.sprite(x, 0, "asteroid-medium-02");
    asteroid.anchor.setTo(0.5, 0.5);
    this.game.physics.arcade.enable(asteroid);
    asteroid.body.velocity.setTo(0, 100);
    
    //add to the astroid group
    this.asteroids.add(asteroid);
    
    asteroid.body.velocity.y= this.rnd.integerInRange(40, 100);
    this.asteroids.add(asteroid);
}



mainGameState.spawnPlayerBullet = function() {
    
    if (this.fireTimer < 0) {
        
        this.fireTimer = 0.4;

        var bullet = this.game.add.sprite(this.playerShip.x, this.playerShip.y, "player-bullet");
        bullet.anchor.setTo(0.5, 0.5);

        this.game.physics.arcade.enable(bullet);
        bullet.body.velocity.setTo(0, -200);

        this.playerBullets.add(bullet);
        
        var sfxindex = this.game.rnd.integerInRange(0, 5);
        this.playerFireSfx[sfxindex].play();
    } 
}

mainGameState.onAsteroidBulletCollision = function(asteroids, bullet){ 
    console.log ("Collision! Argh!");
    asteroids.pendingDestroy = true;
    bullet.pendingDestroy = true;
    this.playerScore +=15;
}


//function for checking player - asteroid collision
mainGameState.onAsteroidPlayerCollision = function (asteroid, playerShip){
    if (asteroid.key.includes("asteroid") )  {
        asteroid.pendingDestroy = true;
    } else {
        playerShip.pendingDestroy = true;
        this.playerLives -=1;
    }
}