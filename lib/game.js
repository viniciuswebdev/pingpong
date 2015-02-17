function Game() {

    var gameOverElement = $('#game-over');
    var fieldElement = $('#field');
    var startMessageElement = $('#message');
    var paddleElement = $("#paddle1");
    var counterElement = $("#counter");
    var score = 0;

    var timer;

    var gameLoop = function (field, ball, paddle)  {
        if (field.limit(ball) === false) {
            gameOverElement.show();
            return false;
        } else {
            addScore();
        }

        paddle.limit(ball);
        ball.move();
    };

    this.init = function() {
        var ball = new Ball();
        var field = new Field(fieldElement);

        var paddle = new Paddle(field, paddleElement);
        paddle.mouseMove();

        startMessageElement.click(function() {
            startMessageElement.remove();

            timer = setInterval(function() {
                gameLoop(field, ball, paddle);
            }, 1);

            gameOverElement.click(function(){
                ball.reset();
                gameOverElement.hide();
            });
        });
    };

    var addScore = function() {
        score += 1;
        counterElement.html('Score: ' + score);
    }
}

$(function() {
    var game = new Game;
    game.init();
});


