(function(scope){
	function Cargador(){
		this.initialize(); 
	}
//carga de las imagenes
	var cargadas = Cargador.prototype;
	var totales = Cargador.prototype;
	var onComplete = Cargador.prototype;



	Cargador.prototype.initialize = function(){
		
		

	};
	Cargador.prototype.loadImagenes = function(lista){
		this.cargadas = 0;
		this.totales = lista.length;

		for (i = 0; i<this.totales; i++){
			this.CargaImagen(lista[i]);
		} 
	}

	Cargador.prototype.CargaImagen = function(ruta){
		var self = this;
		var image = new Image();
		this[ruta]= image;
		image.onload = function(e){
			self.imagenCargada();

		}
		image.src = image.url=ruta;
	}
	Cargador.prototype.imagenCargada = function(){
		this.cargadas ++;

		if(this.cargadas== this.totales){
			if(this.onComplete){
				this.onComplete();

			}else{
				Console.log("onComplete no definida en App");

			}

		}


	}

	scope.Cargador = Cargador;

}(window));

