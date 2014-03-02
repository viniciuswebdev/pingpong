var KEY = {
  UP: 38,
  DOWN: 40,
  W: 87,
  S: 83
};

var SCORE = {
  P1 : 0,  
  P2 : 0   
};

var GAME = {};

GAME.BALL = {
  V: 5,
  PX: 150,
  PY: 100,
  DX: 1,
  DY: 1
};

var paddle1;
var paddle2;

var socket = io.connect();

function loop()
{
  moveAsteroide();
}

function moveBatedores(key) {
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

function moveBatedores2(key) {
  if (key == KEY.W) {
    moveP1Up();
  } else if (key == KEY.S) {
    moveP1Down(); 
  }
  if (key == KEY.UP) {
    moveP2Up();
  } else if (key == KEY.DOWN) {
    moveP2Down();
  }
}

function moveP1Up()
{
    paddle1.css("top",parseInt(paddle1.css("top"))-100);

}

function moveP1Down()
{
      paddle1.css("top",parseInt(paddle1.css("top"))+100);    

}

function moveP2Up()
{
    paddle2.css("top",parseInt(paddle2.css("top"))-100);  

}

function moveP2Down()
{
      paddle2.css("top",parseInt(paddle2.css("top"))+100);

}


function moveAsteroide() {
  var fundo = $("#background");
  var FundoAltura = parseInt(fundo.height());
  var FundoLargura = parseInt(fundo.width());  

  // Movimentação
  var BALL = GAME.BALL;
  BALL.PX += BALL.V * BALL.DX;
  BALL.PY += BALL.V * BALL.DY;

  // Não deixa ultrapassar o limite inferior do fundo
  if ( (BALL.PY + BALL.V * BALL.DY) > FundoAltura ) {
    BALL.DY = -1;
  }

    // Não deixa ultrapassar o limite lateral direito do fundo
  if( (BALL.PX + BALL.V * BALL.DX) > FundoLargura ) {
    BALL.DX = -1;
    // Incrementa a pontuação do P1
    SCORE.P1++;
    $("#P1").html(SCORE.P1);
  }


  // Não deixa ultrapassar o limite superior do fundo
  if ( (BALL.PY + BALL.V * BALL.DY) < 0 ) {
    BALL.DY = 1;
  }

  // Não deixa ultrapassar o limite lateral esquerdo do fundo
if ( (BALL.PX + BALL.V * BALL.DX) < 0 ) {
  BALL.DX = 1;
  // Incrementa a pontuação do P2
  SCORE.P2++;
  $("#P2").html(SCORE.P2);
}

// Condição de finalização do GAME
if (SCORE.P1==5 || SCORE.P2==5)
  gameOver();

/*
* Detectando as colisões
*/
function gameOver() {

}


var paddle1X = parseInt(paddle1.css("left")) + parseInt(paddle1.css("width"));
var paddle1YBaixo = parseInt(paddle1.css("top")) + parseInt(paddle1.css("height"));
var paddle1YTopo = parseInt(paddle1.css("top"));

if ( ( BALL.PX + BALL.V * BALL.DX ) < paddle1X )
{
  if ( ( (BALL.PY + BALL.V * BALL.DY) <= paddle1YBaixo ) && 
     ( (BALL.PY + BALL.V * BALL.DY) >= paddle1YTopo)
  ) {
    BALL.DX = 1;
    som.play();
  }
}  

var paddle2X = parseInt(paddle2.css("left")) + parseInt(paddle2.css("width")) - 51;
var paddle2YBaixo = parseInt(paddle2.css("top")) + parseInt(paddle2.css("height"));
var paddle2YTopo = parseInt(paddle2.css("top"));

if ( ( BALL.PX + BALL.V * BALL.DX ) >= paddle2X )
{
  if ( ( (BALL.PY + BALL.V * BALL.DY) <= paddle2YBaixo ) &&
     ( (BALL.PY + BALL.V * BALL.DY) >= paddle2YTopo )
  ) {
    BALL.DX = -1;
    som.play();
  }
}

  // Atualiza as propriedades 'left' e 'top' da div '#BALL'
  $("#ball").css({
    "left" : BALL.PX,
    "top" : BALL.PY
  });  
}

/*
* Ao carregar o documento
*/

$(function(){

  socket.emit('first', true);

   $("#ready").click(function(){
      socket.emit('ready', true);
   });

  socket.on('start', function (data) {

    // Armazena nas variáveis (globais) dos jogadores a referência dos elementos
    paddle1 = $("#paddle1");
    paddle2 = $("#paddle2");  

    // Armazena na propriedade 'timer' a função setInterval()
    GAME.timer = setInterval(loop, 30); // Executa a função loop() a cada 30 milesegundos

    // Ao pressionar uma tecla
    $(document).keydown(function(e){
      moveBatedores(e.which);
      });

    socket.on('key', function (data) {
      moveBatedores2(data);
    });

      
  });

});
