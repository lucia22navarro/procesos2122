function ClienteRest(){
    this.agregarJugador = function(nick){
        $.getJSON("/agregarJugador/" + nick, function(data){
            //se ejecuta cuando conteste el servidor 
            console.log(data);
            if(data.nick !=-1){
                ws.nick = data.nick;
               // $.cookie("nick", data.nick);
                iu.mostrarControl(ws.nick);

            } else{
                iu.mostrarModal("El nick " + nick + " está en uso");
                iu.mostrarAgregarJugador();
            }
        })
    }

    //crear partida
    this.crearPartida = function(nick,numJug){
        $.getJSON("/crearPartida/" + nick + "/" + numJug, function(data){
            //se ejecuta cuando conteste el servidor 
            console.log(data);
           // cli.codigo = data.codigo;
           // ws.codigo = data.codigo;
           // iu.mostrarEsperando(cli.codigo)
        })
    }
    //unir a partida
    this.unirAPartida = function(codigo,nick){
        $.getJSON("/unirAPartida/" + codigo + "/" + nick, function(data){
            //se ejecuta cuando conteste el servidor 
            console.log(data);
        })
    }
    //obtener lista de partidas
    this.obtenerListaPartidas = function(){
        $.getJSON("/obtenerListaPartidas/", function(data){
            //se ejecuta cuando conteste el servidor 
            console.log(data);
            iu.mostrarUnirAPartida(data);
        })
    }

    this.obtenerPartidasDisponibles = function(){
        $.getJSON("/obtenerPartidasDisponibles", function(data){
            console.log(data);
            iu.mostrarUnirAPartida(data);
        })
    }
}