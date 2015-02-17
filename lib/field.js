function Field(element) {

    that = this;

    var init = function() {
        that.element = element;
        that.height = that.element.height();
        that.width = that.element.width();
    };

    this.limit = function(ball) {

        ball.x += ball.v * ball.dX;
        ball.y += ball.v * ball.dY;


        if ( (ball.y + ball.v * ball.dY) > that.height ) {
            return false;
        }

        if( (ball.x + ball.v * ball.dX) > that.width ) {
            ball.dX = -1;
        }

        if ( (ball.y + ball.v * ball.dY) < 0 ) {
            ball.dY = 1;
        }

        if ( (ball.x + ball.v * ball.dX) < 0 ) {
            ball.dX = 1;
        }

    };

    init();

}

