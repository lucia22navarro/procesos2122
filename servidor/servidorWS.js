function ServidorWS(){

    //zona cliente del servidor WS
    this.enviarAlRemitente = function(socket, mensaje, datos){
        socket.emit(mensaje, datos);

    }

    //enviar mensajes a todos los jugadores
    this.enviarATodos = function(io, codigo, mensaje, datos){
        io.socket.in(codigo).emit(mensaje, datos);
    }

    //zona servidor del servidor WS
    this.lanzarServidorWS = function(io, juego){
        var cli = this;
        io.on("connection", function(socket){ //el primer mensaje que llega de cualquier cliente se traduce en una conexión
            console.log("Usuario conectado");

            socket.on("crearPartida", function(num, nick){
                var ju1 = juego.usuarios[nick];
                var res={codigo:-1};
                var partida = ju1.crearPartida(num);
                console.log("Nueva partida de " +nick + ". Codigo: " +ju1.codigoPartida);
                res.codigo = ju1.codigoPartida;
                socket.join(res.codigo);
                cli.enviarAlRemitente(socket, "partidaCreada", res);
            });

            socket.on("unirAPartida", function(codigo, nick){
                var ju1 = juego.usuarios[nick];
                var res={codigo:-1};
                var partida = ju1.unirAPartida(codigo);
                console.log("Jugador " +nick + " se une a partida con codigo " +ju1.codigoPartida);
                res.codigo = ju1.codigoPartida;
                if (res.codigo != -1){
                    socket.join(res.codigo);
                    var partida = juego.partidas[codigo];
                    cli.enviarAlRemitente(socket, "unidoAPartida", res);
                    if(partida.fase.nombre == "jugando"){
                        cli.enviarATodos(io, codigo, "pedirCartas", {});
                    }
                }
                else{
                    cli.enviarAlRemitente(socket, "fallo", res);
                }
                
            });

            socket.on("manoInicial", function(nick){
                var ju1 = juego.usuarios[nick];
                ju1.manoInicial();
                cli.enviarAlRemitente(socket, "mano", ju1.mano);
            });
        }) 
    }
}


module.exports.ServidorWS = ServidorWS;