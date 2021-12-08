function ClienteRest(){

    this.registrarUsuario = function(email, clave){
        $.ajax({
            type : 'POST',
            url : '/registrarUsuario',
            data : {"email":email, "clave":clave},
            success: function(data){
                if(data.email!="nook"){
                    //mostrarLogin
                    console.log(data.email);
                }
                else{
                    console.log("No se ha podido registrar"); //email ya existe
                    console.log(data.email);
                }
            },
            //contentType : 'application/json', 
            dataType : 'json',
        });
    }

    this.loginUsuario = function(email, clave){
        $.ajax({
            type : 'POST',
            url : '/loginUsuario',
            data : {"email":email, "clave":clave},
            success: function(data){
                if(data.email!="nook"){
                    //mostrarLogin
                    console.log(data.email);
                }
                else{
                    console.log("Usuario o clave incorrectos"); //email ya existe
                }
            },
            //contentType : 'application/json', 
            dataType : 'json',
        });
    }



    this.agregarJugador = function(nick){
        $.getJSON("/agregarJugador/" + nick, function(data){
            //se ejecuta cuando conteste el servidor 
            console.log(data);
            if(data.nick !=-1){
                ws.nick = data.nick;
                $.cookie("nick", data.nick);
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
    this.obtenerTodosResultados = function(){
        $.getJSON("/obtenerTodosResultados/", function(data){
            //se ejecuta cuando conteste el servidor 
            console.log(data);
            //iu.mostrarListaResultados(data);
        })
    }
    this.obtenerResultados = function(nick){
        $.getJSON("/obtenerResultados/" + nick, function(data){
            //se ejecuta cuando conteste el servidor 
            console.log(data);
            //iu.mostrarListaResultados(data);
        })
    }
}