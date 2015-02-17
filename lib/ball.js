function Ball() {

    this.move = function() {
        $("#ball").css({
            "left" : this.x,
            "top" : this.y
        });
    };

    this.reset = function() {
        this.v = 1;
        this.x = 15;
        this.y = 15;
        this.width =  15;
        this.height =  15;
        this.dX = 1;
        this.dY = 1;
    };

    this.reset();


}