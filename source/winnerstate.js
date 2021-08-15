var winnerGameState = {}

winnerGameState.preload = function (){
    this.game.load.image("youWin", "assets/images/youWin.jpg");
}


winnerGameState.create = function () {
    this.game.add.sprite(0, 0, "youWin");
    
    var textStyle = {font: "20px Arial", fill: "#ffffff", align: "center"};

    WinnerText = this.game.add.text(this.game.width * 0.5, this.game.height * 0.6, "Want to play again? Click the 'Q' key", textStyle);
    WinnerText.anchor.setTo(0.5, 0.5);

    this.startOverKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
}


winnerGameState.update = function () {
    
    if (this.startOverKey.isDown){
        this.game.state.start("MainGame");
    }
    
}