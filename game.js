/*
* Definição de variáveis
*/

var TECLA = {
  CIMA: 38,
  BAIXO: 40,
  W: 87,
  S: 83
};

var jogo = {}; // Objeto
jogo.pressionou = []; // Array

jogo.asteroide = {
  velocidade: 5,
  x: 150,
  y: 100,
  direcaoX: 1,
  direcaoY: 1
};

/*
* Funções
*/
function loop()
{
  // Executa a função moveBatedores()
  moveBatedores();
  moveAsteroide();
}


function moveAsteroide() {
  // Propriedades da div 'fundo'
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


  // Atualiza as propriedades 'left' e 'top' da div '#asteroide'
  $("#asteroide").css({
    "left" : asteroide.x,
    "top" : asteroide.y
  });  
}


function moveBatedores() {
  // Seleciona e armazena nas variáveis a referência dos elementos
  var paddle1 = $("#paddle1");
  var paddle2 = $("#paddle2");

  // paddle1
  if (jogo.pressionou[TECLA.W]) {
    paddle1.css("top",parseInt(paddle1.css("top"))-5);
  } else if (jogo.pressionou[TECLA.S]) {
    paddle1.css("top",parseInt(paddle1.css("top"))+5);    
  }
  // paddle2
  if (jogo.pressionou[TECLA.CIMA]) {
    paddle2.css("top",parseInt(paddle2.css("top"))-5);  
  } else if (jogo.pressionou[TECLA.BAIXO]) {
    paddle2.css("top",parseInt(paddle2.css("top"))+5);
  }
}

/*
* Ao carregar o documento
*/

$(function(){

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
