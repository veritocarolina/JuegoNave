(function(scope){
	//constructor de la clase
	function Nave(spriteSheet){
		this.initialize(spriteSheet);
	}

	// si no se pone protptype en los metodos, se convierten en estáticos
	Nave.prototype = new createjs.BitmapAnimation();
	Nave.prototype.BitmapAnimation_init = Nave.prototype.initialize;


	var SOUNDS = Nave.prototype;

	var ancho = Nave.prototype;
	var alto = Nave.prototype;
	var explotando = Nave.prototype;

	//implementamos la nueva inicializacion del objeto
	Nave.prototype.initialize = function (spriteSheet){
		this.BitmapAnimation_init(spriteSheet);

		var self = this;

		console.log("Inicializando Nave");
			this.x = 256;
			this.y = 100;

			this.gotoAndPlay("run");

		this.ancho = spriteSheet.getFrame(0).rect.width;
		this.alto = spriteSheet.getFrame(0).rect.height;

		//luego ejecuto el resto de valores
		this.snapToPixel = true;
		this.velocity = {x:0,y:-20};

		this.addEventListener("mousedown", function(e){
			self.handleMouseDown(e);//movimiento al clickear
		});

	}

	Nave.prototype.onTick = function (){//segun donde cliquee hacia donde se mueve
		this.velocity.y += 1;
		if(this.velocity.y < 0 || this.y < 500){
			this.y += this.velocity.y;
		}

		if (this.velocity.x!=0) {
			if (this.velocity.x> 0) {
				this.velocity.x-=1;
			}else{
				this.velocity.x+=1;
			}
			this.x +=this.velocity.x;
		}
		if (this.currentFrame==39) {
			this.gotoAndPlay("run");
		}
		else if(this.currentFrame==71){
			window.App.fin();
			this.parent.removeChild(this);
		}
	}
	Nave.prototype.salta = function(e){/// si cliqueaste arriba la nave sube
		if (!this.explotando) {
		if((e.stageX >= this.x) && (e.stageX < this.x + this.ancho)){
			}else if(e.stageX > this.x){
				this.playFire();
				this.velocity.x = +10;
			}else if(e.stageX < this.x){
				this.playFire();
				this.velocity.x = -10;
			}
			
			if(e.stageY <= this.y - 20){
				this.playFire();
				this.velocity.y = -15;
			}else if(e.stageY > this.y - 20 && e.stageY < this.y + this.alto){
				this.velocity.y = +0;
			}else{
				this.playFire();
				this.velocity.y = +15;
			}
			
			
			this.gotoAndPlay("fire");//animacion de la nave
			}
		};

	Nave.prototype.playFire = function(e){ //carga sonido
		if (!this.explotando) {

	createjs.Sound.addEventListener("loadComplete", createjs.proxy(this.soundsLoaded,this));

			SOUNDS.SOUNDS = {};
			SOUNDS.SOUNDS.FIRE = 'sfx/fire.m4a','sfx/fire.mp3', 'sfx/fire.ogg';
			createjs.Sound.registerSound(SOUNDS.SOUNDS.FIRE, "FIRE", 4);

			var _fire = createjs.Sound.play(SOUNDS.SOUNDS.FIRE);
		}
	        
	};


	
	Nave.prototype.handleMouseDown = function(e){
			if(!this.explotando){
				this.dispara();
			}
	}


	Nave.prototype.estatico = function(){// si esta parada se ejecuta la anumacion run
				this.gotoAndPlay("run");

	}

	Nave.prototype.dispara = function(e){//esta funcion hace que cuando la nave dispare no este avanzado
		if (!this.explotando) {
		this.velocity.y = 0;
		this.velocity.x = 0;
		this.gotoAndPlay("run");

		window.App.disparoNave(this.x + this.ancho/2 - 8, this.y);
	}
	}

	Nave.prototype.explota = function(){
		console.log("explotaaaaa");
		this.playBoom();
		this.explotando= true;
		//this.playBoom();
		this.gotoAndPlay("boom");
	}

	Nave.prototype.playBoom = function(e){ //carga sonido

	createjs.Sound.addEventListener("loadComplete", createjs.proxy(this.soundsLoaded,this));

			SOUNDS.SOUNDS = {};

			SOUNDS.SOUNDS.BOOM = 'sfx/boom.m4a','sfx/boom.mp3', 'sfx/boom.ogg';
			createjs.Sound.registerSound(SOUNDS.SOUNDS.BOOM, "BOOM", 3);
			var _boom = createjs.Sound.play(SOUNDS.SOUNDS.BOOM);
	  
	      
	};

	
	scope.Nave= Nave;
}(window));