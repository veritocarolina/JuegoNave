(function(scope){
	function DisparoNave(image, posX, posY){
		this.initialize(image, posX, posY);
	}

	DisparoNave.prototype = new createjs.Bitmap()
	DisparoNave.prototype.Bitmap_init = DisparoNave.prototype.initialize;

	var ancho = DisparoNave.prototype;
	var SOUNDS = DisparoNave.prototype;

	DisparoNave.prototype.initialize = function(image, posX, posY){
		// indica que el disparo debe salir de donde se encuentre la nave
		this.ancho = 6;

		this.Bitmap_init(image);
		this.x = posX;
		this.y = posY;
		App.stage.addChild(this);

		this.snapToPixel = true;
		this.velocity = {x:0, y:-15};

		this.playPop();
	}
	//añade un disparo si el anterior se elimino
	DisparoNave.prototype.onTick = function(){
		if (this.y <0) {
			this.destroy();
			window.App.disparo = null;
			App.stage.removeChild(this);
		}else if (this.velocity.y < 0) {
			this.y +=this.velocity.y;
		}
	}
	//destruye el disparo
	DisparoNave.prototype.destroy = function(){
		window.App.disparo = null;
		App.stage.removeChild(this);
	}

	DisparoNave.prototype.playPop = function(e){ 

		createjs.Sound.addEventListener("loadComplete", createjs.proxy(this.soundsLoaded,this));

			SOUNDS.SOUNDS = {};

			SOUNDS.SOUNDS.POP = 'sfx/pop.mp3';
			createjs.Sound.registerSound(SOUNDS.SOUNDS.POP, "POP", 4);


	  var _pop = createjs.Sound.play(SOUNDS.SOUNDS.POP);
	  
 	};

	

	scope.DisparoNave = DisparoNave;

}(window));