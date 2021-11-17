function ControlWeb(){
    
    this.comprobarUsuario = function(){
        if($.cookie("nick")){
            ws.nick=$.cookie("nick");
            iu.mostrarControl(ws.nick)

        }
        else {
            iu.borrarMenu();
            iu.mostrarAgregarJugador();
        }
    }

    this.borrarMenu = function(){
        $("#mAJ").remove();
        //$("#op").remove();
        $("#espera").remove();
        $("#mUAP").remove();
        $('#mCP').remove();
        $("#botones").remove();
        $("#bot").remove();
        $('#mM').remove();
        $('#mCA').remove();
        //$("btnAbandonar").remove();
       // $("btnCerrar").remove();
    }
    

    this.mostrarModal = function(msg){
        $('#cM').remove();
       var cadena = "<p id='cM'>" + msg + "</p>";
       $('#contenidoModal').append(cadena);
       $('#miModal').modal('show');
    }


    this.mostrarAgregarJugador = function(){
        $("#op").remove();
       var cadena =         '<div id="mAJ">'
       cadena = cadena +        '<label for="usr">Para comenzar a jugar, introduce un nick:</label>';
       cadena = cadena +            '<input type="text" class="form-control" placeholder="Introduce tu nick"id="usr">'
       cadena = cadena +            '<button type="button" id="btnAJ" class="btn btn-primary">Entrar</button>'
       cadena = cadena +    '</div>';
       $("#agregarJugador").append(cadena);
        $("#btnAJ").on("click", function(){
            var nick = $('#usr').val();
            if(nick ==""){
                iu.mostrarModal("Introduce un nick");
            }
            else{
                $("#mAJ").remove();
                rest.agregarJugador(nick);
            }
        });
    }


    this.mostrarControl = function(nick){
        //$("#op").remove();
        //$("btnAbandonar").remove();
        //$("btnCerrar").remove();
        iu.borrarMenu();

        var cadena =        '<div id="op">'
        cadena = cadena +     '<label>'
        cadena = cadena +        '<h4>Nick: '+ nick +'</h4></label>&nbsp;&nbsp;&nbsp;&nbsp;'
        cadena = cadena +        '<button type="button" id="btnCerrar" class="btn btn-primary">Cerrar</button>'
        cadena = cadena +     '</div>'

        $("#opciones").append(cadena);
        iu.mostrarCrearPartida(nick);
        rest.obtenerPartidasDisponibles();


        $("#btnCerrar").on("click", function(){
            $("btnCerrar").remove();
            $("#op").remove();
            ws.cerrarSesion();
        })
    }


    this.mostrarCrearPartida = function(nick){
       var cadena =         '<div id="mCP">'
       cadena = cadena +        '<label>Crear una nueva partida</label><br>'
       cadena = cadena +        '<label for="numj">Selecciona número de jugadores:</label>'
       cadena = cadena +        '<select class="form-control" id="numj">'
       cadena = cadena +            '<option>2</option>'
       cadena = cadena +            '<option>3</option>'
       cadena = cadena +            '<option>4</option>'
       cadena = cadena +            '<option>5</option>'
       cadena = cadena +            '<option>6</option>'
       cadena = cadena +            '<option>7</option>'
       cadena = cadena +            '<option>8</option></select>'
       cadena = cadena +        '<button type="button" id="btnCP" class="btn btn-primary">Crear</button>&nbsp;&nbsp;'
       cadena = cadena +    '</div>' 
    
       $("#crearPartida").append(cadena);
        $("#btnCP").on("click", function(){
            var numJug = $('#numj').val();
            $("#mCP").remove();
            ws.crearPartida(nick, numJug);
            $("#mUAP").remove();
        })
    }


    this.mostrarEsperando = function(codigo){
        var cadena =        '<div id="espera">'
        cadena = cadena +       '<div class="row">'
        cadena = cadena +           '<div class="col">'
        cadena = cadena +               '<label>Codigo:'+ codigo +'</label></div>'
        cadena = cadena +           '<div class="col">'
        cadena = cadena +               '<div class="spinner-grow text-primary"></div></div>'
        cadena = cadena +           '<div class="col">'
        cadena = cadena +               '<div id="listanicks">Jugadores</div></div>'
      /*  var partida = juego.partidas[codigo];
        var lista = partida.jugadores;
        for (i = 0; i < lista.length; i++){
            cadena = cadena +        '<label for="jug">'+ lista[i].nick +'</label><br>'
        }*/
        cadena = cadena + '</div></div>'
        $("#esperando").append(cadena);

    }


    this.mostrarUnirAPartida = function(lista){
        $('#mUAP').remove();
        var cadena =         '<div id="mUAP">'
        cadena = cadena +        '<label>Lista de partidas públicas</label><br>'
        cadena = cadena +        '<ul class="list-group list-group-flush" id="mLP>'
        for (i = 0; i < lista.length; i++){
            var codigo = lista[i].codigo;
          //  var propietario = lista[i].propietario
          //  cadena = cadena +       '<li class="list-group-item">'
            cadena = cadena +           '<a href="#" class="list-group-item" value="'+codigo+'">'+codigo+'</a>'
           // cadena = cadena +           '<label>'+ propietario +'</label>'
          //  cadena = cadena +           '<span class="badge badge-primary badge-pill">'+ partida.numeroJugadores()+ '/'+ partida.numJug + '</span>'
        //    cadena = cadena +       '</li>'
        }
        cadena = cadena +        '</div>'
        cadena = cadena +    '</div>' 

        $("#listaPartidas").append(cadena);
        $(".list-group a").on("click", function(){
            codigo =$(this).attr("value");
            var nick = ws.nick;
            console.log(codigo + " " + nick);
            if(codigo && nick){
                $('#mUAP').remove();
                $('#mCP').remove();
                ws.unirAPartida(codigo, nick);
            }
        });
     }



     this.mostrarOpcionesJuego = function(){ 
        $("#bot").remove();

        var cadena =        '<div id="bot">'
        cadena = cadena +       '<div class="container-fluid">'
        cadena = cadena +           '<div class="row">'
        cadena = cadena +               '<button type="button" id="robar" class="btn btn-primary">Robar</button> &nbsp;&nbsp;'
        cadena = cadena +               '<button type="button" id="uno" class="btn btn-primary">UNO</button> &nbsp;&nbsp;'
        cadena = cadena +               '<button type="button" id="btnAbandonar" class="btn btn-primary">Abandonar</button>'
        cadena = cadena +           '</div>'
        cadena = cadena +       '</div>'
        cadena = cadena +   '</div>'
        
        $("#botones").append(cadena);


       //si la mano del jugador == 1, activar boton uno
       // $("input").prop('disabled', false);

       //cuando el jugador tenga el turno, activar el botón robar

        $("#robar").on("click", function(){
            ws.robar(1);
        })
        $("#uno").on("click", function(){
            if(ws.mano.length == 1)
                ws.uno();
        })
        $("#btnAbandonar").on("click", function(){
            ws.abandonarPartida();
        });


    }

    //función auxiliar que activa el botón Robar
    this.turno = function(){
     //   $("#robar").prop('disabled', false);
    }
    this.activarUno = function(){
      //  $("uno").prop('disabled', false);
    }

       
     this.mostrarMano = function(lista){
        $('#mM').remove();
        var cadena =      '<div class="list-group" id="mM">'

        for (var i = 0; i < lista.length; i++){
            
            cadena = cadena +           '<div class="card bg-light">'
            cadena = cadena +             '<div class="card-body text-center">'
          //  cadena = cadena +                 '<img class="card-img-top src="<img/'+lista[i].nombre+'.png" alt="Card image">'
            cadena = cadena +                   '<a href="#" value="'+ i +'" class="list-group-item list-group-item-action">'
            cadena = cadena +                 '<p class="card-text">'+ lista[i].tipo +' ' + lista[i].color + ' '+ lista[i].valor +'</p>'
            cadena = cadena +           '</div></div>'
        }
        cadena = cadena +   '</div>'

        $('#mano').append(cadena);
        
        
        //REVISAR

        $(".list-group a").on("click", function(){
            var num = -1;
            num =$(this).attr("value");
            if (num=!-1)
                ws.jugarCarta(num);
        });

     }


     this.mostrarCartaActual = function(carta){
        $('#mCA').remove();
        var cadena =        '<div id="mCA" class="card-columns" style="text-align:center;">';
        cadena = cadena +       '<div class="card bg-light">'
        cadena = cadena +           '<div class="card-body text-center">'
        cadena = cadena +       '  <img class="card-img-top src="img/'+ carta.nombre + '.png" alt="Card image">'
        cadena = cadena +           '<p class="card-text">'+ carta.tipo +'' + carta.color + ''+ carta.valor +'</p>'
        cadena = cadena +    '</div></div></div>'
        $('#actual').append(cadena);

    }

    /*this.mostrarTurno = function(){

    }
    */
}