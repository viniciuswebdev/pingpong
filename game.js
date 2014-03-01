var TECLA = {
  W: 87,
  S: 83
};

$(function() {
  $(document).keydown(function(e) {
    var top = parseInt($("#paddle1").css("top"));
	    switch (e.which) {
	      case TECLA.W:
	        $("#paddle1").css("top",top-5);  
	        break;
	      case TECLA.S:
	        $("#paddle1").css("top",top+5);  
	        break;
	    }
    });
});