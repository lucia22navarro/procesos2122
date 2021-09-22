function Juego(){

    this.jugadores={}; //[]. Solo permite que exista un nick único
    this.partidas={};

    this.agregarJugador = function(nick){
        if(!this.jugadores[nick]){
            var jugador = new Jugador(nick);
            this.jugadores[nick] = jugador;
        }
    }
}

function Jugador(nick, juego){
    this.nick = nick;
    this.juego = juego;
    this.crearPartida = function(numJugadores){
        this.juego.crearPartida(nick, numJug)
    }
}

function Partida(nombre){
    this.nombre = nombre;
}

function Carta(color, tipo){
    this.color = color;
    this.tipo = tipo;
}