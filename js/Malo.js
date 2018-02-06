(function(scope){
	function Malo(spriteSheet){
		this.initialize(spriteSheet);
	}
	Malo.prototype = new createjs.BitmapAnimation();
	Malo.prototype.BitmapAnimation_init = Malo.prototype.initialize;

	var ancho = Malo.prototype;
	var alto = Malo.prototype; 
	var SOUNDS = Malo.prototype;


	Malo.prototype.initialize = function (spriteSheet){
		this.BitmapAnimation_init(spriteSheet);

		this.gotoAndPlay("run");

		this.ancho = spriteSheet.getFrame(0).rect.width;
		this.alto = spriteSheet.getFrame(0).rect.height;

		this.snapToPixel = true;
	}

	Malo.prototype.onTick = function(){//valida si el marciano llega al frame 24 debe eliminarlo del contenedor
		if(this.currentFrame == 24){
			this.parent.removeChild(this);
		}
	}

	Malo.prototype.explota = function(){//explosion del marciano
		this.playBoom();
		this.gotoAndPlay("boom");
	}

	Malo.prototype.handleMouseDown = function(e){
				this.dispara();
			if(!this.explotando){
			}
	}


	
	Malo.prototype.playBoom = function(e){ //carga del cosindo
createjs.Sound.addEventListener("loadComplete", createjs.proxy(this.soundsLoaded,this));

			SOUNDS.SOUNDS = {};

			SOUNDS.SOUNDS.BOOM = 'sfx/boom.m4a','sfx/boom.mp3', 'sfx/boom.ogg';
			createjs.Sound.registerSound(SOUNDS.SOUNDS.BOOM, "BOOM", 3);
			var _boom = createjs.Sound.play(SOUNDS.SOUNDS.BOOM);
	  
	      
	};

	scope.Malo = Malo;
}(window));