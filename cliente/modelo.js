//método auxiliar para generar números aleatorios
function randomInt(low, high){
    return Math.floor(Math.random()*(high - low) + low);
}

/* JUEGO */

function Juego(){

    this.usuarios={}; //[]. Solo permite que exista un nick único
    this.partidas={};


    this.agregarJugador = function(nick){
        if(!this.usuarios[nick]){
            var jugador = new Jugador(nick, this);
            this.usuarios[nick] = jugador;
        }
        else{
            console.log("El nick ya se está usando"); 
        }
    }


    this.crearPartida = function(nick, numJug){
        //Crear codigo unico
        var codigo = "-1";
        var jugador = this.usuarios[nick];
        codigo = this.obtenerCodigo();
      //hay una pequeña probabilidad de que el código no exista

        /*while(this.partidas[codigo]){
            codigo = this.obtenerCodigo();
        };*/
            //si el código no existe se crea una partida con el código pasado por parámetro
      
      
        var partida = new Partida(codigo,jugador,numJug);
        this.partidas[codigo] = partida;
        jugador = partida.propietario;       


        return partida;
    }

    this.obtenerTodasPartidas = function(){
        var lista = [];
        for(each in this.partidas){
            var partida = this.partidas[each];
            lista.push({propietario:partida.propietario, codigo:each});
        }
        return lista;
    }


    this.unirAPartida = function(codigo, nick){
        //comprobamos que el código existe
        if(this.partidas[codigo]){
            var jugador = this.usuarios[nick];
            this.partidas[codigo].unirAPartida(jugador);
        }
    }


    this.obtenerCodigo = function(){
        let cadena="ABCDEFGHIJKLMNOPQRSTUVXYZ";
		let letras=cadena.split('');
		let maxCadena=cadena.length;
		let codigo=[]; //aquí se define el código
		for(i=0;i<6;i++){
			codigo.push(letras[randomInt(1,maxCadena)-1]); //se guarda un número aleatorio entre el 1 y el máximo de la cadena
		}
		return codigo.join('');
    }


    //método auxiliar para saber cuántas partidas tenemos en el juego

    this.numeroPartidas=function(){
        //coge los códigos (las claves) de las partidas y devuelve la longitud de este array
		return Object.keys(this.partidas).length;
	}

}



/* JUGADOR */

function Jugador(nick, juego){
    this.nick = nick;
    this.juego = juego;

    this.crearPartida = function(numJug){
        return this.juego.crearPartida(nick, numJug);
        
    }


    this.unirAPartida = function(codigo){
        //delega en juego para unir al usuario a la partida
        this.juego.unirAPartida(codigo, nick);
    }
}


/* PARTIDA */

function Partida(codigo, jugador, numJug){ //se introduce el jugador completo (objeto)
    this.codigo = codigo;
    this.propietario = jugador.nick;
    this.numJug = numJug;
    this.jugadores = {};
    this.cartas = [];
    this.fase = new Inicial();

    //métodos para que un jugador se pueda unir a una partida (dependiendo de la fase en la que se encuentre la partida)
    this.unirAPartida = function(jugador){
        this.fase.unirAPartida(this, jugador);
    }


    this.puedeUnirAPartida = function(jugador){
        this.jugadores[jugador.nick] = jugador;
    }

    this.numeroJugadores=function(){
        //coge los nicks (las claves) de los jugadores y devuelve la longitud de este array
		return Object.keys(this.jugadores).length;
	}

    this.crearMazo = function(){
        var colores = ["azul", "amarillo", "rojo", "verde"];
        

        for (i = 0; i < colores.length; i++){
            for (j = 1; i < 10; j++){
            this.cartas.push(new Numero(j,colores[i]));
            this.cartas.push(new Numero(j,colores[i]));

            }
            this.cartas.push(new Numero(0,colores[i]));
            this.cartas.push(new Cambio(colores[i]));
            this.cartas.push(new Cambio(colores[i]));
            this.cartas.push(new Mas2(colores[i]));
            this.cartas.push(new Mas2(colores[i]));
            this.cartas.push(new Bloqueo(colores[i]));
            this.cartas.push(new Bloqueo(colores[i]));
            this.cartas.push(new Comodin(colores[i]));
            this.cartas.push(new Comodin4(colores[i]));
        }

    }

    this.crearMazo();
    this.unirAPartida(jugador);

}


/* FASE INICIAL */

function Inicial(){
    this.nombre = "inicial";
    this.unirAPartida = function(partida, jugador){
        //si numero jugadores < numJug

        partida.puedeUnirAPartida(jugador);
        if (partida.numeroJugadores() == partida.numJug){
            partida.fase = new Jugando();
        }
    }
    this.esInicial = function(){
        return true;
    }
}


/* FASE JUGANDO*/

function Jugando(){
    this.nombre = "jugando";

    this.unirAPartida = function(partida,jugador){
        console.log("La partida ya ha comenzado");
    }

    this.esInicial = function(){
        return false;
    }
}

/* FASE FINAL */ 

function Final(){
    this.nombre = "final";

    this.unirAPartida = function(partida,jugador){
        console.log("La partida ya ha terminado");
    }

    this.esInicial = function(){
        return false;
    }
}


/* CARTA */

function Numero(valor, color){
    this.color = color;
    this.valor = valor;
}

function Cambio(color){
    this.color = color;
}

function Bloqueo(color){
    this.color = color;
}

function Mas2(color){
    this.color = color;
}

function Comodin(){

}

function Comodin4(){

}