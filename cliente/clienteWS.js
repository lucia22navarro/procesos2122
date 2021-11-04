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

    this.crearPartida = function(num, nick){
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
            //iu.mostrarControl(json con codigo y nick)
        });
        this.socket.on("unidoAPartida", function(data){
            console.log(data);
            cli.codigo = data.codigo;
        });
        this.socket.on("nuevaPartida", function(lista){
            if(!cli.codigo && cli.nick){
                iu.mostrarListaPartidas(lista);
            }
        });
        this.socket.on("pedirCartas", function(data){
            cli.manoInicial();
            console.log(data);
        });
        this.socket.on("mano", function(data){
            console.log(data);
            //cli.meToca();
        });
        this.socket.on("turno", function(data){
            console.log(data);
        });
/*        this.socket.on("final", function(data){
            console.log(data);
            //if(cli.nick == ganador){ console.log("Ganador")}
            //else console.log("Has perdido")
        });
        this.socket.on("carta", function(data){
            console.log(data);
        });
        this.socket.on("cartasRobada", function(data){
            console.log(data);
        });*/
        this.socket.on("fallo", function(data){
            console.log(data);
        });
    }

    this.conectar();
}