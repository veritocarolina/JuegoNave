//Libresias utilizadas:
//-CocoonJSAudioPlugin.js
//- easeljs-0.6.0.min.js
//-jquery-2.1.1.min.js
//-ndgmr.Collision.js
//soundjs-0.4.0.min.js
//-soundjs-0.6.2.min.js
//-soundjs.js

(function(scope){
	function App(){
		this.initialize();
	}
	
	var canvas = App.prototype;
	var stage =App.prototype;
	var fondo = App.prototype;
	var nave = App.prototype;
	var bitmap = App.prototype;
	var cargador = App.prototype;
	var contenedorMalos = App.prototype;
	var disparo = App.prototype;
	var disparoM = App.prototype;
	var _fps = App.prototype;

	var SOUNDS = App.prototype;
	var sonidosCargados = App.prototype;
	


	var rutaNave = "assets/nave.png";
	var _rutaMalo = "assets/malo.png";
	var rutaFondo = "assets/nebulosa.jpg";
	var rutaDispNave = "assets/DisparoNave.png";
	var rutaDisparoMalo = "assets/DisparoMalo.png";

	var rutaMalo = App.prototype;

	

	App.prototype.initialize = function(){
		this.rutaMalo = _rutaMalo;
		this._fps = 20;

		var self = this;

	this.canvas = document.createElement("canvas");
	this.canvas.width=600;//ancho del canvas
	this.canvas.height=600; //alto del canvas
	var contenedor = document.getElementById("juego");
	contenedor.appendChild(this.canvas);

	this.stage = new createjs.Stage(this.canvas);

	this.cargador = new Cargador();
	this.cargador.onComplete = function(){
		self.assetsCargados();
	};
	this.cargador.loadImagenes([_rutaMalo,rutaNave,rutaFondo,rutaDispNave,rutaDisparoMalo]); //cargas de las rutas de las imagenes

	createjs.Ticker.addListener(this);
	


	this.stage.addEventListener("stagemousedown", function(e){
			self.handleMouseDown(e);//declaracion de funcion
		});

	
	};
	App.prototype.assetsCargados = function(){
		console.log("Imagenes Cargadas");
		this.loadSounds();//carga del sonido
		
	};


	App.prototype.ejecutaApp = function(){
		var bmp= this.cargador[rutaFondo];//carga fondo
		this.fondo = new createjs.Bitmap(bmp);
		this.fondo.alpha=0.8;
		this.stage.addChild(this.fondo);


		var dataNave = {
			images: [this.cargador[rutaNave] ],//carga nave 
			frames: {width:103, height:90},//definicion del tamaño del frame
			animations: {run:[0,19], fire:[19,47, "fire"], boom:[48,71, "boom"]}// definicion de los fotogramas por animacion
		};
		
		var spriteSheet = new createjs.SpriteSheet(dataNave);
		this.nave = new Nave(spriteSheet);
		console.log(this.nave.alto);
		this.stage.addChild(this.nave);

		

		/*if(this.nave.x==0 || this.nave.y == 523){
					

					this.nave.estatico();

		}/*/
		//Cargando malos

		var self = this;
		createjs.Ticker.setFPS(this._fps);
		createjs.Ticker.addListener(function(e){

		self.tick();
		});
		createjs.Ticker.addListener(this.tickCreaMalos);

		
	}

	   
	App.prototype.tickCreaMalos = function(){
		var app = window.App;
		var punto = app.nave.localToGlobal(app.nave.x, app.nave.y);
		if(punto.y > 200){
			//creacion del contenedor donde van los malos
			var contenedor = new ContenedorMalos();
			app.stage.addChild(contenedor);
			contenedorMalos.x = 0;
			contenedorMalos.y = 0;
			app.contenedorMalos = contenedor;
			createjs.Ticker.removeListener(app.tickCreaMalos);

		}
	};

	App.prototype.tick = function(e){
		if(this.contenedorMalos){
			this.contenedorMalos.testDisparoNave(this.disparo);//detecta la colision entre el marcioano y el disparo
			this.contenedorMalos.testChoqueNave(this.nave);//detecta la colision entre la nave y el marciano
			
		}


		this.stage.update();

	};

	
	App.prototype.handleMouseDown = function(e){
		if (!this.explotando) {
			this.nave.salta(e);//llama a la funcon salta de la nave
		}
	};

	App.prototype.disparoNave = function(posX, posY){
		if(this.disparo == null){//hace que se genere un disparo solo si el anterior desaparecio
			this.disparo = new DisparoNave(this.cargador[rutaDispNave], posX, posY);
			

		}
	};

	

	App.prototype.fin = function(){
		window.location.href="gameOver.html";//carga la pantalla de game over
	};

	

App.prototype.loadSounds = function() {//carga de los sonidos con las librerias 
	
		sonidosCargados = 0;
		//alert(sonidosCargados);
		var registeredPlugins = createjs.Sound.registerPlugins([
													createjs.CocoonJSAudioPlugin,
													createjs.WebAudioPlugin,
													createjs.HTMLAudioPlugin

																]);
		if (registeredPlugins) {
			createjs.Sound.addEventListener("loadComplete", createjs.proxy(this.soundsLoaded,this));
			SOUNDS.SOUNDS = {};
			SOUNDS.SOUNDS.BOOM = 'sfx/boom.m4a','sfx/boom.mp3', 'sfx/boom.ogg';
			createjs.Sound.registerSound(SOUNDS.SOUNDS.BOOM, "BOOM", 3);
			SOUNDS.SOUNDS.POP = 'sfx/pop.mp3';
			createjs.Sound.registerSound(SOUNDS.SOUNDS.BOOM, "POP", 3);
			SOUNDS.SOUNDS.FIRE = 'sfx/fire.m4a','sfx/fire.mp3', 'sfx/fire.ogg';//ruta de los sonidos
			createjs.Sound.registerSound(SOUNDS.SOUNDS.FIRE, "FIRE", 4);
		this.ejecutaApp();	//ejecuta la app
		}
	};
	
	App.prototype.soundsLoaded = function(e) {
		//genera la carga de sonidos
		sonidosCargados ++;
		if ( sonidosCargados == 3 ){
			console.log("Sonidos cargados");
			//creo los elementos
		}else{
		console.log("no se han cargado los sonidos.");
		}
	};

	App.prototype.playBoom = function(){ // sonido de explosion
	  var _boom = createjs.Sound.play(SOUNDS.SOUNDS.BOOM);
	};
	App.prototype.playPop = function(){ //sonido de disparo
	  var _pop = createjs.Sound.play(SOUNDS.SOUNDS.POP);
	};

	App.prototype.playFire = function(){ //sonido de nave arrancando
	  var _fire = createjs.Sound.play(SOUNDS.SOUNDS.FIRE);
	};

	scope.App = App;

}(window));

window.onload = function(){
	this.App= new App();

}
