var gameOverState = {}

gameOverState.preload = function() {
    this.game.load.image("gameoverbg", "assets/images/GameOver.png");
}

gameOverState.create = function() {
    this.game.add.sprite(0, 0, "gameoverbg");
    
    var textStyle = {font: "20px Arial", fill: "#ccddff", align: "center"}

    var scoreTitle = this.game.add.text(this.game.width * 0.5, this.game.height * 0.5, "Your Score", textStyle);
    scoreTitle.anchor.setTo(0.5, 0.5);

    var scoreValue = this.game.add.text(this.game.width * 0.5, this.game.height * 0.55, g_lastScore, textStyle);
    scoreValue.anchor.setTo(0.5, 0.5);
    
    var startAgainText = this.game.add.text(this.game.width *0.5, this.game.height * 0.65, "Want to play again? Click the 'P' key", textStyle);
    startAgainText.anchor.setTo(0.5, 0.5);
    
    this.startAgainKey = this.game.input.keyboard.addKey(Phaser.Keyboard.P);

}

gameOverState.update = function() {
    if (this.startAgainKey.isDown) {
        this.game.state.start("MainGame");
    }
}
