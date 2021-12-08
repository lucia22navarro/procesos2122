function ClienteWS(){

    //en el objeto ClienteWS hay dos partes: una parte de cliente y otra de servidor
    //así conseguimos la conexión en tiempo real

    this.socket;
    this.nick;
    this.codigo;

 //peticiones
    this.conectar = function (){
        this.socket = io(); //establece la conexión con el servidor mediante un socket
        this.servidorWSCliente(); //cuando lanzamos el cliente también hay que lanzar la parte servidora del cliente (local)
    }

    this.crearPartida = function(nick,num){
        this.nick = nick;
        this.socket.emit("crearPartida", num, nick);

    }

    this.unirAPartida = function(codigo, nick){
        this.nick = nick;
        this.socket.emit("unirAPartida", codigo, nick);
    }

    this.manoInicial = function(){
        this.socket.emit("manoInicial", this.nick);
    }

    this.jugarCarta = function(num){
        this.socket.emit("jugarCarta", this.nick, num);
    }

    this.robar = function(num){
        this.socket.emit("robar", this.nick, num);
    }
    this.pasarTurno = function(){
        this.socket.emit("pasarTurno", this.nick);
    }
    this.uno = function(){
        this.socket.emit("uno", this.nick);
    }
    this.abandonarPartida = function(){
        this.socket.emit("abandonarPartida", this.nick);
    }
    this.cerrarSesion = function(){
        this.socket.emit("cerrarSesion", this.nick);
    }


//esperar contestación del servidor
    this.servidorWSCliente = function(){
        var cli = this;
        this.socket.on("connect", function(){
            console.log("Conectado al servidorWS");
        });
        //entrada para la respuesta del servidorWS
        this.socket.on("partidaCreada", function(data){
            console.log(data);
            cli.codigo = data.codigo;
           // ws.codigo = data.codigo;
            //iu.mostrarUnirAPartida();
            iu.mostrarEsperando(data.codigo)
            //iu.mostrarControl(json con codigo y nick)
        });
        this.socket.on("unidoAPartida", function(data){
            console.log(data);
            cli.codigo = data.codigo;
           // iu.mostrarEsperando()
           
        });
        this.socket.on("nuevaPartida", function(data){
            if(!cli.codigo && cli.nick){
                console.log(data);
                iu.mostrarUnirAPartida(data);
            }
        });
        this.socket.on("borrarMenu", function(data){
            console.log(data);
            iu.borrarMenu();
        })
        this.socket.on("pedirCartas", function(data){
            cli.manoInicial();
            console.log(data + 'mano inicial');
        });
        this.socket.on("mano", function(data){
            console.log(data);
            cli.codigo = cli.codigo;
           // iu.mostrarOpcionesJuego(codigo);
            iu.mostrarOpcionesJuego();
            iu.mostrarMano(data);
            if (data.length == 1){
                iu.activarUno();
            }
            
        });
        this.socket.on("turno", function(data){
            console.log(data);

            if(cli.nick == data.turno){
                iu.turno();
            }
            iu.mostrarCartaActual(data.cartaActual);
        });
        this.socket.on("uno", function(data){
            console.log(data);
            console.log("Jugador " + data.nick + " le queda 1 carta!!")
           // iu.mostrarOpcionesJuego(data.turno)
        });
        this.socket.on("final", function(data){
            console.log(data);
            if(cli.nick == data.ganador){ 
                iu.mostrarModal("¡ENHORABUENA! ERES EL GANADOR");
            }
            else 
            iu.mostrarModal("HAS PERDIDO LA PARTIDA");

        });

        this.socket.on("fallo", function(data){
            console.log(data);
        });
        this.socket.on("jugadorAbandona", function(){
            iu.mostrarModal("Un jugador abandona la partida.");
            iu.borrarMenu();
            iu.mostrarControl(cli.nick);
            socket.leave(data.codigo);

        });
        this.socket.on("usuarioEliminado", function(){
            cli.nick = "";
            cli.codigo = "";
            $.removeCookie("nick");
            iu.borrarMenu();
            iu.mostrarAgregarJugador();
        });

    }

    this.conectar();
}