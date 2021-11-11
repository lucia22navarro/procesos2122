//método auxiliar para generar números aleatorios
function randomInt(low, high){
    return Math.floor(Math.random()*(high - low) + low);
}

/* JUEGO */

function Juego(){

    this.usuarios={}; //[]. Solo permite que exista un nick único
    this.partidas={};


    this.agregarJugador = function(nick){
        var res = {nick : -1};
        if(!this.usuarios[nick]){
            var jugador = new Jugador(nick, this);
            this.usuarios[nick] = jugador;
            res = {nick : nick};
        }
        else{
            console.log("El nick " + nick + " ya se está usando"); 
        }

        return res;
    }


    this.crearPartida = function(nick, numJug){
        //Crear codigo unico
        var codigo = "-1";
        var partida;
        var jugador = this.usuarios[nick];
        if(numJug >= 2 && numJug <= 8){
            codigo = this.obtenerCodigo();
        //hay una pequeña probabilidad de que el código no exista

            while(this.partidas[codigo]){
                codigo = this.obtenerCodigo();
            };
                //si el código no existe se crea una partida con el código pasado por parámetro
        
        
            partida = new Partida(codigo,jugador,numJug);
            this.partidas[codigo] = partida;
            jugador = partida.propietario;     
        }  


        return partida;
    }

    this.obtenerTodasPartidas = function(){
        var lista = [];
        for(each in this.partidas){
            var partida = this.partidas[each];
            var huecos = partida.numJug - partida.numeroJugadores();
            lista.push({"propietario":partida.propietario, "codigo":each, "huecos":huecos});
        }
        return lista;
    }

    this.obtenerPartidasDisponibles = function(){
        var lista = [];
        for(each in this.partidas){
            var partida = this.partidas[each];
            if(partida.fase.nombre == "inicial"){
                var huecos = partida.numJug - partida.numeroJugadores();
             //   if (partida.numeroJugadores() < partida.numJug){
                lista.push({"propietario":partida.propietario, "codigo":each, "huecos":huecos});
             //   }
            }
        }
        return lista;
    }    


    this.unirAPartida = function(codigo, nick){
        //comprobamos que el código existe
        var res = {partida:-1}
        if(this.partidas[codigo]){
            var jugador = this.usuarios[nick];
            this.partidas[codigo].unirAPartida(jugador);
            res = {partida:codigo};
        }
        return res;
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
    this.puntos = 0;

    this.crearPartida = function(numJug){
        return this.juego.crearPartida(nick, numJug);
    }


    this.unirAPartida = function(codigo){
        //delega en juego para unir al usuario a la partida
        this.juego.unirAPartida(codigo, nick);
    }


    this.manoInicial = function(){
        var partida = this.obtenerPartida(this.codigoPartida);
        this.mano = partida.dameCartas(7);
    }

    this.robar = function(num){
        var numRobadas = -1;
        var partida = this.obtenerPartida(this.codigoPartida);
        if(partida.turno.nick == this.nick){
            var robadas = partida.dameCartas(num);
            if (robadas.length <= 0) {
                partida.pasarTurno(); //pasar turno sin robar ninguna carta
                numRobadas = 0;
            }
            else
                this.mano = this.mano.concat(robadas);
                numRobadas = robadas.length;
        }
        return numRobadas;
    }

    this.obtenerPartida = function(codigo){
        return this.juego.partidas[codigo];
    }

    this.pasarTurno = function(nick){
        var partida = this.obtenerPartida(this.codigoPartida);
        partida.pasarTurno(nick);
        this.robar(1);
    }

    this.jugarCarta = function(num){
        var carta = this.mano[num];
        if(carta){
            var partida = this.obtenerPartida(this.codigoPartida);
            partida.jugarCarta(carta, this.nick);   
        }
    }

	this.quitarCarta=function(carta){
		var indice=this.mano.indexOf(carta);
		this.mano.splice(indice,1);
        if(this.mano.length<=0){
            var partida=this.obtenerPartida(this.codigoPartida);
            partida.finPartida();
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
    this.turno;
    this.ordenTurno = [];
    this.cartaActual;
    this.fase = new Inicial();

    //métodos para que un jugador se pueda unir a una partida (dependiendo de la fase en la que se encuentre la partida)
    this.unirAPartida = function(jugador){
        this.fase.unirAPartida(this, jugador);
    }


    this.puedeUnirAPartida = function(jugador){
        this.jugadores[jugador.nick] = jugador;
        jugador.codigoPartida = this.codigo;
        this.ordenTurno.push(jugador.nick);
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
            this.mazo.push(new Cambio(20, colores[i]));
            this.mazo.push(new Mas2(20, colores[i]));
            this.mazo.push(new Bloqueo(20, colores[i]));
            this.mazo.push(new Cambio(20, colores[i]));
            this.mazo.push(new Mas2(20, colores[i]));
            this.mazo.push(new Bloqueo(20, colores[i]));
            this.mazo.push(new Numero(0,colores[i]));
            this.mazo.push(new Comodin(20));
            this.mazo.push(new Comodin4(40));
        }
        
    }

    this.dameCartas = function(num){
        var cartas = [];
        if(this.mazo.length < num){
            this.mazo = this.mazo.concat(this.mesa);
            this.mesa = [];

        }
        for (i = 0; i < num; i++){
            var carta = this.asignarUnaCarta();
            if(carta){
                cartas.push(carta);
            }
        }
        return cartas;
    }

    //método auxiliar para asignar cartas de una en una
    this.asignarUnaCarta = function(){
        var maxCartas = this.mazo.length;
        var res;
        if(maxCartas>0){
            var indice = randomInt(1,maxCartas) - 1;
            var carta = this.mazo.splice(indice,1);
            res = carta[0];
        }
        return res;
    }

    //método que lanza la carta inicial a la mesa cuando comienza la partida (se utiliza en la clase "Inicial")

    this.cartaInicial = function(){
        this.cartaActual = this.asignarUnaCarta();
    }

    //método que asigna el turno inicial cuando se crea la partida
    //por defecto será el creador de la partida
    this.turnoInicial = function(){
        var nick = this.ordenTurno[0];
        this.turno = this.jugadores[nick];
    }

    //método para pasar de turno. dependerá del sentido en el que se encuentre la partida

    this.pasarTurno = function(nick){
        //delegar en la fase si puede pasar turno o no
        this.fase.pasarTurno(nick,this);
    }

    this.puedePasarTurno = function(nick){
        if(nick == this.turno.nick){
            var indice=this.ordenTurno.indexOf(this.turno.nick);            
            var siguiente=(indice + this.sentido)%(Object.keys(this.jugadores).length);
            //cuando es sentido -1 puede salir un número negativo en el índice: el turno pasará al último del array
            if (siguiente < 0) {
                siguiente = Object.keys(this.jugadores).length - 1;
            }
            this.turno=this.jugadores[this.ordenTurno[siguiente]];
        }
    }

    this.jugarCarta = function(carta, nick){
        this.fase.jugarCarta(carta,nick,this);
    }


    this.puedeJugarCarta = function(carta, nick){
        if(nick == this.turno.nick){
            if(this.comprobarCarta(carta)){
                carta.comprobarEfecto(this);
                this.cambiarCartaActual(carta);
                this.turno.quitarCarta(carta);
                this.pasarTurno(nick);
            }
        }
    }


    this.cambiarCartaActual = function(carta){
        this.mesa.push(this.cartaActual);
        this.cartaActual = carta;
    }

    this.comprobarCarta = function(carta){
        return (this.cartaActual.tipo=="numero" && (this.cartaActual.color==carta.color || this.cartaActual.valor==carta.valor)
        || this.cartaActual.tipo=="cambio" && (this.cartaActual.color==carta.color || this.cartaActual.tipo == carta.tipo)
        || this.cartaActual.tipo=="bloqueo" && (this.cartaActual.color==carta.color || this.cartaActual.tipo == carta.tipo)
        || this.cartaActual.tipo=="mas2" && (this.cartaActual.color==carta.color || this.cartaActual.tipo == carta.tipo)
        || this.carta.tipo=="comodin"  || this.carta.tipo=="comodin4")

    }

   /* this.comprobarCarta=function(carta){
        //comprobar que la carta que se puede jugar la carta, según la que hay en la mesa
        return (this.cartaActual.tipo=="numero" && (this.cartaActual.color==carta.color || this.cartaActual.valor==carta.valor)
            || this.cartaActual.tipo=="cambio" && (this.cartaActual.color==carta.color || this.cartaActual.tipo == carta.tipo))
    }*/

    this.cambiarDireccion = function(){
        if (this.sentido == 1) this.sentido = -1;
        if (this.sentido == -1) this.sentido = 1;
    }

    this.finPartida = function(){
        this.fase = new Final();
        this.calcularPuntos();
    }

    this.calcularPuntos = function(){
        var suma = 0;
        for (var jug in this.jugadores){
            for (i = 0; this.jugadores[jug].mano.length; i++){
                suma = suma + this.jugadores[jug].mano[i].valor;
            }
        }
        this.turno.puntos = suma;
    }
    

    this.crearMazo();
    this.unirAPartida(jugador);
}


/* FASE INICIAL */

function Inicial(){
    this.nombre = "inicial";


    this.unirAPartida = function(partida, jugador){
        partida.puedeUnirAPartida(jugador);
        if (partida.numeroJugadores() == partida.numJug){
            partida.fase = new Jugando();
            partida.turnoInicial();
            partida.cartaInicial();
          /*  for (each in partida.jugadores){
                each.manoInicial();
            }*/
        }
    }

    this.esInicial = function(){
        return true;
    }

    this.jugarCarta = function(carta,nick,partida){
        console.log("La partida no ha comenzado: no puedes jugar cartas");
    }

    this.pasarTurno = function(nick,partida){
        console.log("La partida no ha comenzado: no puedes pasar turno");
    }
}


/* FASE JUGANDO*/

function Jugando(){
    this.nombre = "jugando";

    this.unirAPartida = function(partida,jugador){
        console.log("La partida ya ha comenzado: no puedes unirte");
        jugador.codigoPartida = -1;
    }

    this.esInicial = function(){
        return false;
    }
    this.jugarCarta = function(carta, nick, partida){
        partida.puedeJugarCarta(carta,nick);
    }

    this.pasarTurno = function(nick, partida){
        partida.puedePasarTurno(nick);
    }
}

/* FASE FINAL */ 

function Final(){
    this.nombre = "final";

    this.unirAPartida = function(partida,jugador){
        console.log("La partida ya ha terminado: no puedes unirte a la partida");
        jugador.codigoPartida = -1;
    }

    this.esInicial = function(){
        return false;
    }

    this.jugarCarta = function(carta,nick,partida){
        console.log("La partida ha terminado: no puedes jugar cartas");
    }

    this.pasarTurno=function(nick, partida){
        console.log("La partida ha terminado: no puedes pasar turno");
    }
}


/* CARTA */

function Numero(valor, color){
    this.tipo = "numero";
    this.color = color;
    this.valor = valor;
    this.nombre=color+valor;
    this.comprobarEfecto=function(partida){
		console.log("No hay efectos");
	}
}

function Cambio(valor, color){
    this.tipo="cambio";
    this.color = color;
    this.valor=valor;  
    this.nombre="cambio"+color;
	this.comprobarEfecto=function(partida){
		partida.cambiarDireccion();
	}
}

function Bloqueo(valor, color){
    this.tipo="bloqueo";
    this.color = color;
    this.valor=valor;
    this.nombre="bloqueo"+color;  
	this.comprobarEfecto=function(partida){
        partida.pasarTurno(partida.turno.nick);
	}	
}

function Mas2(valor, color){
    this.tipo="mas2";
    this.color = color;
    this.valor=valor; 
    this.nombre="mas2"+color;
	this.comprobarEfecto=function(partida){
	}	
}

function Comodin(valor){
    this.tipo = "comodin";
    this.color="";
    this.valor=valor;
    this.nombre="comodin";
    this.comprobarEfecto=function(partida){
}
}

function Comodin4(valor){
    this.tipo = "comodin4";
    this.color ="";
    this.valor=valor;
    this.nombre="comodin4";
    this.comprobarEfecto=function(partida){
}
}

/*
//método para ejecutar más fácilmente el código en la consola de Chrome
var juego;
var partida;
var ju1,ju2;

function Prueba(){
    juego =new Juego();
    juego.agregarJugador("ana");
    ju1=juego.usuarios["ana"];
    ju1.crearPartida(3);
    juego.agregarJugador("pepe");
    ju2=juego.usuarios["pepe"];
    ju2.unirAPartida(ju1.codigoPartida);
    juego.agregarJugador("luis");
    ju3=juego.usuarios["luis"];
    ju3.unirAPartida(ju1.codigoPartida);
    partida=juego.partidas[ju1.codigoPartida];
    ju1.manoInicial();
    ju2.manoInicial();
    ju3.manoInicial();
    partida.cartaInicial();
}*/

//esta línea es fundamental para la parte del servidor
module.exports.Juego = Juego;
