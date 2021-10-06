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

        while(this.partidas[codigo]){
            codigo = this.obtenerCodigo();
        };
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
    this.mano=[];
    this.codigoPartida;

    this.getNick = function(){
        return this.nick;
    }

    this.crearPartida = function(numJug){
        return this.juego.crearPartida(nick, numJug);
        
    }


    this.unirAPartida = function(codigo){
        //delega en juego para unir al usuario a la partida
        this.juego.unirAPartida(codigo, nick);
    }


    this.manoInicial = function(){
        var partida = this.obtenerPartida(this.codigoPartida);
        this.mano = partida.asignarCartas(7);
    }

    this.robar = function(num){
        var partida = this.obtenerPartida(this.codigoPartida);
        var robadas = partida.asignarCartas(num);
        var tmp = this.mano;
        this.mano = tmp.concat(robadas);
    }

    this.obtenerPartida = function(codigo){
        return this.juego.partidas[codigo];
    }

    this.pasarTurno = function(){
        var partida = this.obtenerPartida(this.codigoPartida);
        partida.pasarTurno(this.nick);
    }

    this.jugarCarta = function(carta){
        var partida = this.obtenerPartida(this.codigoPartida);
        //la carta debe existir en la mano del jugador
        if(carta in this.mano){
            partida.jugarCarta(carta);
        }
    }


}


/* PARTIDA */

function Partida(codigo, jugador, numJug){ //se introduce el jugador completo (objeto)
    this.codigo = codigo;
    this.propietario = jugador.nick;
    this.numJug = numJug;
    this.jugadores = {};
    this.mazo = [];
    this.mesa = [];
    //el sentido por defecto será el valor 1: sentido horario (a derechas)
    //cuando haya un cambio de sentido se cambiará este valor a -1: sentido antihorario (a izquierdas)
    this.sentido = 1;
    this.jugadorActual;
    this.nicks = [];
    this.fase = new Inicial();

    //métodos para que un jugador se pueda unir a una partida (dependiendo de la fase en la que se encuentre la partida)
    this.unirAPartida = function(jugador){
        this.fase.unirAPartida(this, jugador);
    }


    this.puedeUnirAPartida = function(jugador){
        this.jugadores[jugador.nick] = jugador;
        jugador.codigoPartida = this.codigo;
        this.nicks.push(jugador.nick);
    }

    this.numeroJugadores=function(){
        //coge los nicks (las claves) de los jugadores y devuelve la longitud de este array
		return Object.keys(this.jugadores).length;
	}

    this.crearMazo = function(){
        var colores = ["azul", "amarillo", "rojo", "verde"];
        

        for (i = 0; i < colores.length; i++){
            for (j = 1; j < 10; j++){
                this.mazo.push(new Numero(j,colores[i]));
                this.mazo.push(new Numero(j,colores[i]));
            }
            this.mazo.push(new Cambio(colores[i]));
            this.mazo.push(new Mas2(colores[i]));
            this.mazo.push(new Bloqueo(colores[i]));
            this.mazo.push(new Cambio(colores[i]));
            this.mazo.push(new Mas2(colores[i]));
            this.mazo.push(new Bloqueo(colores[i]));
            this.mazo.push(new Numero(0,colores[i]));
            this.mazo.push(new Comodin("comodin"));
            this.mazo.push(new Comodin4("comodin4"));
        }
        
    }

    this.asignarCartas = function(num){
        var aux = [];
        
        for (i = 0; i < num; i++){
            var carta = this.asignarUnaCarta();
            aux.push(this.mazo.splice(this.mazo.indexOf(carta), 1));
        }
        return aux;
    }

    //método auxiliar para asignar cartas de una en una
    this.asignarUnaCarta = function(){
        var maxCartas = this.mazo.length;
        var indice = randomInt(1,maxCartas);
        var carta = this.mazo[indice];
        return carta;
    }

    //método que lanza la carta inicial a la mesa cuando comienza la partida (se utiliza en la clase "Inicial")

    this.cartaInicial = function(){
        this.mesa.push(this.asignarCartas(randomInt()));
        return this.mesa;
    }

    //método que asigna el turno inicial cuando se crea la partida
    //por defecto será el creador de la partida
    this.turnoInicial = function(){
        this.jugadorActual = this.nicks[0];
        return this.jugadorActual;
    }



    //método para pasar de turno. dependerá del sentido en el que se encuentre la partida

    this.pasarTurno = function(nickJugador){
        //sacar nick del jugador que solicita pasarTurno
        
        var nick = this.jugadorActual.nick;
        
        //obtener indice del nick del jugador

        if (nick == nickJugador){
            var aux = this.nicks.indexOf(nick);
            //var siguiente = (aux + 1)%(Object.keys(this.jugadores).length);
            //calculamos excepciones del cambio de turno:
            //si el sentido es antihorario y llegamos al principio del array
            if (aux == 0 && this.sentido == -1){
                aux = this.nicks.length;
            
            //si el sentido es horario y llegamos al final del array
            } else if (aux == this.nicks.length && this.sentido == 1){
                aux = 0;
            }
            this.jugadorActual = this.nicks[aux + this.sentido];
        }
    }

    this.jugarCarta = function(jugador, carta){
        var i = this.mesa.length
        //devuelve el último elemento de la mesa
        var aux = this.mesa[i-1];

        //primero comprobar si son comodines: siempre se podrán lanzar
        if(carta.tipo ="comodin" || carta.tipo =="comodin4"){
            this.puedeJugarCarta(jugador, carta);
        }

        //cualquier otro tipo de carta
        else{

            //comprobar si el color es igual
            if(carta.color == aux.color){
                this.puedeJugarCarta(jugador, carta);

            //si el color no es igual, comprueba que el número sí lo es
            }else if (carta.tipo =="numero" && aux.tipo == "numero"){
                if(carta.valor == aux.valor){
                    this.puedeJugarCarta(jugador, carta);
                }
            }
        }

    }

    this.puedeJugarCarta = function(jugador, carta){
        //retira la carta de la mano del jugador
        var c = jugador.mano.splice(carta, 1);

        //pone la carta del jugador en la mesa
        this.mesa.push(c);
    }

    this.crearMazo();
    this.unirAPartida(jugador);
    this.turnoInicial();

}


/* FASE INICIAL */

function Inicial(){
    this.nombre = "inicial";


    this.unirAPartida = function(partida, jugador){
        //si numero jugadores < numJug

        partida.puedeUnirAPartida(jugador);
        if (partida.numeroJugadores() == partida.numJug){
            partida.fase = new Jugando();
            // cuando comienza la partida, se asigna la mano inicial a cada jugador
            /*for (each in partida.jugadores){
                each.manoInicial();
            }*/

            //cuando comienza la partida, se lanza la carta inicial
            partida.cartaInicial();
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
    this.tipo = "numero";
    this.color = color;
    this.valor = valor;
}

function Cambio(color){
    this.tipo="cambio";
    this.color = color;
}

function Bloqueo(color){
    this.tipo="bloqueo";
    this.color = color;
}

function Mas2(color){
    this.tipo="mas2";
    this.color = color;
}

function Comodin(tipo){
    this.tipo = tipo;
}

function Comodin4(tipo){
    this.tipo = tipo;
}


//método para ejecutar más fácilmente el código en la consola de Chrome
var juego;
var partida;
var ju1,ju2;

function Prueba(){
    juego = new Juego();
    juego.agregarJugador("ana");
    juego.agregarJugador("luis");
    ju1 = juego.usuarios["ana"];
    ju2 = juego.usuarios["luis"];
    partida = ju1.crearPartida(2);
    ju2.unirAPartida(partida.codigo);
}