function Paddle(field, element) {

    var paddle1 = element;
    paddle1.css('top', field.height - (field.height / 6));

    this.limit = function(ball) {
        var paddle1X = parseInt(paddle1.css("top")) - ball.width;
        var paddle1YLeft = parseInt(paddle1.css("left"));
        var paddle1YRight = parseInt(paddle1.css("left")) + parseInt(paddle1.css("width"));

        if ((ball.y + ball.v * ball.dX) > paddle1X - ball.v) {
            var ballPosition = ball.x + ball.v * ball.dY;
            if (ballPosition >= paddle1YLeft && ballPosition <= paddle1YRight) {
                ball.dY = -1;
            }
        }
    };

    this.mouseMove = function() {
        document.addEventListener('touchmove', function(e) {
            e.preventDefault();
            var currentX = e.touches[0].clientX;
            paddle1.css("left", parseInt(currentX - 40));

        }, false);
    }
}
