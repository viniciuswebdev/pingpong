var KEY = {
    UP:38,
    DOWN:40,
    W:87,
    S:83
};

var SCORE = {
    P1:0,
    P2:0
};

var GAME = {};

GAME.BALL = {
    V:5,
    PX:150,
    PY:100,
    DX:1,
    DY:1
};

var paddle1;
var paddle2;

var socket = io.connect();

function loop() {
    moveBall();
}

function sendMovement(key) {
    if (key == KEY.W) {
        socket.emit('key', KEY.W);
    } else if (key == KEY.S) {
        socket.emit('key', KEY.S);
    }
    if (key == KEY.UP) {
        socket.emit('key', KEY.UP);
    } else if (key == KEY.DOWN) {
        socket.emit('key', KEY.DOWN);
    }
}

function movePaddles(key) {
    if (key == KEY.W) {
        paddle1.css("top", parseInt(paddle1.css("top")) - 100);
    } else if (key == KEY.S) {
        paddle1.css("top", parseInt(paddle1.css("top")) + 100);
    }
    if (key == KEY.UP) {
        paddle2.css("top", parseInt(paddle2.css("top")) - 100);
    } else if (key == KEY.DOWN) {
        paddle2.css("top", parseInt(paddle2.css("top")) + 100);
    }
}

function moveBall() {
    var background = $("#background");
    var FundoAltura = parseInt(background.height());
    var FundoLargura = parseInt(background.width());

    var BALL = GAME.BALL;
    BALL.PX += BALL.V * BALL.DX;
    BALL.PY += BALL.V * BALL.DY;

    // limit bottom
    if ((BALL.PY + BALL.V * BALL.DY) > FundoAltura) {
        BALL.DY = -1;
    }

    // limit right
    if ((BALL.PX + BALL.V * BALL.DX) > FundoLargura) {
        BALL.DX = -1;
        SCORE.P1++;
        $("#P1").html(SCORE.P1);
    }

    // limit top
    if ((BALL.PY + BALL.V * BALL.DY) < 0) {
        BALL.DY = 1;
    }

    // limit left
    if ((BALL.PX + BALL.V * BALL.DX) < 0) {
        BALL.DX = 1;
        SCORE.P2++;
        $("#P2").html(SCORE.P2);
    }


    var paddle1X = parseInt(paddle1.css("left")) + parseInt(paddle1.css("width"));
    var paddle1YDown = parseInt(paddle1.css("top")) + parseInt(paddle1.css("height"));
    var paddle1YTop = parseInt(paddle1.css("top"));

    if (( BALL.PX + BALL.V * BALL.DX ) < paddle1X) {
        if (( (BALL.PY + BALL.V * BALL.DY) <= paddle1YDown ) &&
            ( (BALL.PY + BALL.V * BALL.DY) >= paddle1YTop)
            ) {
            BALL.DX = 1;
        }
    }

    var paddle2X = parseInt(paddle2.css("left")) + parseInt(paddle2.css("width")) - 51;
    var paddle2YDown = parseInt(paddle2.css("top")) + parseInt(paddle2.css("height"));
    var paddle2YTop = parseInt(paddle2.css("top"));

    if (( BALL.PX + BALL.V * BALL.DX ) >= paddle2X) {
        if (( (BALL.PY + BALL.V * BALL.DY) <= paddle2YDown ) &&
            ( (BALL.PY + BALL.V * BALL.DY) >= paddle2YTop )
            ) {
            BALL.DX = -1;
        }
    }

    $("#ball").css({
        "left":BALL.PX,
        "top":BALL.PY
    });
}


$(function () {
    socket.emit('first', true);

    $("#ready").click(function () {
        socket.emit('ready', true);
    });

    socket.on('start', function (data) {
        paddle1 = $("#paddle1");
        paddle2 = $("#paddle2");

        GAME.timer = setInterval(loop, 30);

        $(document).keydown(function (e) {
            sendMovement(e.which);
        });

        socket.on('key', function (data) {
            movePaddles(data);
        });
    });
});
