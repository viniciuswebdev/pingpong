var TECLA = {
  CIMA: 38,
  BAIXO: 40,
  W: 87,
  S: 83
};

var jogo = {};
jogo.pressionou = [];

jogo.asteroide = {
  velocidade: 5,
  x: 150,
  y: 100,
  direcaoX: 1,
  direcaoY: 1
};

var paddle1;
var paddle2;

var socket = io.connect('http://localhost');
socket.on('news', function (data) {
  console.log(data);
});

function loop()
{
  moveBatedores();
  moveAsteroide();
}

function moveBatedores() {
  if (jogo.pressionou[TECLA.W]) {
    socket.emit('key', TECLA.W);
    paddle1.css("top",parseInt(paddle1.css("top"))-5);
  } else if (jogo.pressionou[TECLA.S]) {
    socket.emit('key', TECLA.S);
    paddle1.css("top",parseInt(paddle1.css("top"))+5);    
  }
  if (jogo.pressionou[TECLA.CIMA]) {
    socket.emit('key', TECLA.CIMA);
    paddle2.css("top",parseInt(paddle2.css("top"))-5);  
  } else if (jogo.pressionou[TECLA.BAIXO]) {
    socket.emit('key', TECLA.BAIXO);
    paddle2.css("top",parseInt(paddle2.css("top"))+5);
  }
}

function moveP1Up()
{

}

function moveP1Down()
{
  
}

function moveP2Up()
{

}

function moveP2Down()
{
  
}


function moveAsteroide() {
  var fundo = $("#fundo");
  var FundoAltura = parseInt(fundo.height());
  var FundoLargura = parseInt(fundo.width());  

  // Movimentação
  var asteroide = jogo.asteroide;
  asteroide.x += asteroide.velocidade * asteroide.direcaoX;
  asteroide.y += asteroide.velocidade * asteroide.direcaoY;

  // Não deixa ultrapassar o limite inferior do fundo
  if ( (asteroide.y + asteroide.velocidade * asteroide.direcaoY) > FundoAltura ) {
    asteroide.direcaoY = -1;
  }

  // Não deixa ultrapassar o limite lateral direito do fundo
  if( (asteroide.x + asteroide.velocidade * asteroide.direcaoX) > FundoLargura ) {
    asteroide.direcaoX = -1;
  }

  // Não deixa ultrapassar o limite superior do fundo
  if ( (asteroide.y + asteroide.velocidade * asteroide.direcaoY) < 0 ) {
    asteroide.direcaoY = 1;
  }

  // Não deixa ultrapassar o limite lateral esquerdo do fundo
  if ( (asteroide.x + asteroide.velocidade * asteroide.direcaoX) < 0 ) {
    asteroide.direcaoX = 1;
  }  

  /*
  * Detectando as colisões   
  */

  var paddle1X = parseInt(paddle1.css("left")) + parseInt(paddle1.css("width"));
  var paddle1YBaixo = parseInt(paddle1.css("top")) + parseInt(paddle1.css("height"));
  var paddle1YTopo = parseInt(paddle1.css("top"));

  if ( ( asteroide.x + asteroide.velocidade * asteroide.direcaoX ) < paddle1X )
  {
    if ( ( (asteroide.y + asteroide.velocidade * asteroide.direcaoY) <= paddle1YBaixo ) && 
       ( (asteroide.y + asteroide.velocidade * asteroide.direcaoY) >= paddle1YTopo)
    ) {
      asteroide.direcaoX = 1;
    }
  }  

	var paddle2X = parseInt(paddle2.css("left")) + parseInt(paddle2.css("width")) - 51;
	var paddle2YBaixo = parseInt(paddle2.css("top")) + parseInt(paddle2.css("height"));
	var paddle2YTopo = parseInt(paddle2.css("top"));

	if ( ( asteroide.x + asteroide.velocidade * asteroide.direcaoX ) >= paddle2X )
	{
	  if ( ( (asteroide.y + asteroide.velocidade * asteroide.direcaoY) <= paddle2YBaixo ) &&
	     ( (asteroide.y + asteroide.velocidade * asteroide.direcaoY) >= paddle2YTopo )
	  ) {
	    asteroide.direcaoX = -1;
	  }
	}


  // Atualiza as propriedades 'left' e 'top' da div '#asteroide'
  $("#asteroide").css({
    "left" : asteroide.x,
    "top" : asteroide.y
  });  
}

/*
* Ao carregar o documento
*/

$(function(){

  // Armazena nas variáveis (globais) dos jogadores a referência dos elementos
  paddle1 = $("#paddle1");
  paddle2 = $("#paddle2");  

  // Armazena na propriedade 'timer' a função setInterval()
  jogo.timer = setInterval(loop, 30); // Executa a função loop() a cada 30 milesegundos

  // Ao pressionar uma tecla
  $(document).keydown(function(e){
    jogo.pressionou[e.which] = true;
    });

  // Ao soltar uma tecla pressionada
    $(document).keyup(function(e){
      jogo.pressionou[e.which] = false;
  });

});
