function ServidorWS(){

    //zona cliente del servidor WS
    this.enviarAlRemitente = function(socket, mensaje, datos){
        socket.emit(mensaje, datos);

    }

    //enviar mensajes a todos los jugadores
    this.enviarATodos=function(io, codigo, mensaje, datos){
        io.sockets.in(codigo).emit(mensaje, datos); 
    }

    //funcion para actualizar la lista automaticamente
    this.enviarGlobal=function(socket,mens,datos){
    	socket.broadcast.emit(mens,datos);
    }


    //zona servidor del servidor WS
    this.lanzarServidorWS = function(io, juego){
        var cli = this;
        io.on("connection", function(socket){ //el primer mensaje que llega de cualquier cliente se traduce en una conexión
            console.log("Usuario conectado");

            socket.on("crearPartida", function(num, nick){
                var ju1 = juego.usuarios[nick];
                if(ju1){
                    var res={codigo:-1};
                    var partida = ju1.crearPartida(num);
                    if(partida){
                        console.log("Nueva partida de " +nick + ". Codigo: " +ju1.codigoPartida);
                        res.codigo = ju1.codigoPartida;
                        socket.join(res.codigo);
                        cli.enviarAlRemitente(socket, "partidaCreada", res);
                        var lista = juego.obtenerPartidasDisponibles();
                        cli.enviarGlobal(socket, "nuevaPartida", lista);
                    }
                    else{ //si el número de jugadores no está entre 2 y 8
                        cli.enviarAlRemitente(socket, "fallo", "La partida no se ha creado");
                    }
                }
                else{
                    cli.enviarAlRemitente(socket, "fallo", "El usuario no existe");
                }
            });

            socket.on("unirAPartida", function(codigo, nick){
                var ju1 = juego.usuarios[nick];
                var res={codigo:-1};
                var partida = juego.partidas[codigo];

                if(ju1 && partida){
                    ju1.unirAPartida(codigo);
                    res.codigo = ju1.codigoPartida;
                    if (res.codigo != -1){
                        socket.join(codigo);
                        console.log("Jugador " +nick + " se une a partida con codigo " +ju1.codigoPartida);
                        var partida = juego.partidas[codigo];
                        cli.enviarAlRemitente(socket, "unidoAPartida", res);
                        if(partida.fase.nombre == "jugando"){
                            cli.enviarATodos(io, codigo, "pedirCartas", {});
                            var lista = juego.obtenerPartidasDisponibles();
                            cli.enviarGlobal(socket, "nuevaPartida", lista); //borrar partida de la lista
                        }
                    }
                    else{
                        cli.enviarAlRemitente(socket, "fallo", res);
                    }
                }
                else{
                    cli.enviarAlRemitente(socket,"fallo", "El usuario y/o la partida no existen");
                }
                
            });

            socket.on("manoInicial", function(nick){
                var ju1 = juego.usuarios[nick];
                if (ju1){
                    ju1.manoInicial();
                    cli.enviarAlRemitente(socket, "mano", ju1.mano);
                    var codigo = ju1.codigoPartida;
                    var partida = juego.partidas[codigo];
                    var nickTurno = partida.turno.nick; 
                    cli.enviarAlRemitente(socket, "turno", {"turno":nickTurno, "cartaActual":partida.cartaActual});
                }
                else{
                    cli.enviarAlRemitente(socket, "fallo", "El usuario no existe");

                }
            });

            socket.on("jugarCarta", function(nick, num){
                var ju1 = juego.usuarios[nick];
                if(ju1){
                    ju1.jugarCarta(num);
                    cli.enviarAlRemitente(socket, "mano", ju1.mano);
                    var codigo = ju1.codigoPartida;
                    var partida = juego.partidas[codigo];
                    var nickTurno = partida.turno.nick;
                    cli.enviarATodos(io, codigo, "turno", {"turno":nickTurno," cartaActual":partida.cartaActual});
                    if(partida.fase.nombre == "final"){
                        cli.enviarATodos(io, codigo, "final", {"ganador":nickTurno});
                    }
                }
                else{
                    cli.enviarAlRemitente(socket, "fallo", "El usuario no existe");

                }
            });

            socket.on("robar", function(num, nick){
                var ju1 = juego.usuarios[nick];
                if (ju1){
                    ju1.robar(num);
                    cli.enviarAlRemitente(socket, "mano", ju1.mano);
                }
                else {
                    cli.enviarAlRemitente(socket, "fallo", "El usuario no existe");
                }
            });

            socket.on("pasarTurno", function(nick){
                var ju1 = juego.usuarios[nick];
                if (ju1){
                    ju1.pasarTurno();
                    var codigo = ju1.codigoPartida;
                    var partida = juego.partidas[codigo];
                    var nickTurno = partida.turno.nick;
                    cli.enviarATodos(io, codigo, "turno", {"turno":nickTurno," cartaActual":partida.cartaActual});
                }
                else {
                    cli.enviarAlRemitente(socket, "fallo", "El usuario no existe");
                }
            });
        }) 
    }
}


module.exports.ServidorWS = ServidorWS;