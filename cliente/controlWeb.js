function ControlWeb(){
    this.mostrarAgregarJugador = function(){
        //para los campos dinámicos de nuestra página:
        //se copia el texto html que queremos mostrar en cadenas
       var cadena =         '<div id="mAJ">'
       cadena = cadena +        '<label for="usr">Para comenzar a jugar, introduce un nick:</label>';
       cadena = cadena +            '<input type="text" class="form-control" placeholder="Introduce tu nick"id="usr">'
       cadena = cadena +            '<button type="button" id="btnAJ" class="btn btn-primary">Entrar</button>'
       cadena = cadena +    '</div>';
       //sustituimos en la etiqueta agregarJugador la cadena
       $("#agregarJugador").append(cadena);
       //localizadores, ids y eventos: #
       //clases y métodos: .
        $("#btnAJ").on("click", function(){
            var nick = $('#usr').val();
            if(nick ==""){
                iu.mostrarModal("Introduce un nick");
            }
            else{
                $("#mAJ").remove();
                rest.agregarJugador(nick);
            }

           // $("#crearPartida").show();
            //iu.mostrarControl(nick);  
        // }         
        });
    }


    this.mostrarControl = function(nick){
        var cadena =        '<div class="container bg-text">'
        cadena = cadena +       '<div class="row">'
        cadena = cadena +           '<label>'
        cadena = cadena +               '<h4>Nick: '+ nick +'</h4></label></div>'
        cadena = cadena +       '<div class="row">'
        cadena = cadena +           '<div class="col">'
        cadena = cadena +               '<div id="crearPartida"></div></div>'
        cadena = cadena +           '<div class="col">'
        cadena = cadena +               '<div id="listaPartidas"></div></div></div></div>'
        $("#opciones").append(cadena);
        iu.mostrarCrearPartida(nick);
        iu.mostrarUnirAPartida();

    }


    this.mostrarCrearPartida = function(nick){
       var cadena =         '<div id="mCP">'
       cadena = cadena +        '<label>Crear una nueva partida</label><br>'
       cadena = cadena +        '<label for="numj">Selecciona numero de jugadores:</label>'
       cadena = cadena +        '<select class="form-control" id="numj">'
       cadena = cadena +            '<option>2</option>'
       cadena = cadena +            '<option>3</option>'
       cadena = cadena +            '<option>4</option>'
       cadena = cadena +            '<option>5</option>'
       cadena = cadena +            '<option>6</option>'
       cadena = cadena +            '<option>7</option>'
       cadena = cadena +            '<option>8</option></select>'
       cadena = cadena +        '<button type="button" id="btnCP" class="btn btn-primary">Crear</button>'
       cadena = cadena +    '</div>' //cerrar mCP
         
 
       $("#crearPartida").append(cadena);
        $("#btnCP").on("click", function(){
            var numJug = $('#numj').val();
            $("#mCP").remove();
            var partida = rest.crearPartida(nick, numJug);
            var codigo = partida.codigo;
            iu.mostrarEsperando(codigo);
            
        })
    }

    this.mostrarEsperando = function(codigo){
        var cadena =        '<div id="esperando">'
        cadena = cadena +       '<div class="row">'
        cadena = cadena +           '<div class="col">'
        cadena = cadena +               '<label>Codigo: '+ codigo + '</label></div>'
        cadena = cadena +           '<div class="col">'
        cadena = cadena +               '<div class="spinner-grow text-primary"></div></div>'
        cadena = cadena +           '<div class="col">'
        cadena = cadena +               '<div id="listanicks">Jugadores</div></div></div></div>'

        $("#crearPartida").append(cadena);
        // mostrar los jugadores que se van uniendo
        //enviarGlobal(servidorWS)
    }

    this.mostrarUnirAPartida = function(lista){
        $('#mLP').remove();
        var cadena =         '<div id="mUAP">'
        cadena = cadena +        '<label>Lista de partidas publicas</label><br>'
        //lista = rest.obtenerListaPartidas();

        cadena = cadena + '<div class="list-group" id="mLP>'
        for (i = 0; i < lista.length; i++){
            var codigo = lista[i].codigo;
            cadena = cadena + '<a href="#" class="list-group-item list-group-item-action" value="'+ codigo+'">'+ codigo +'</a>'
        }
        cadena = cadena + '</div>'
        cadena = cadena +    '</div>' //cerrar mCP

        $("#listaPartidas").append(cadena);

        $(".list-group a").click(function(){
            codigo =$(this).attr("value");
            var nick = ws.nick;
            console.log(codigo + " " + nick);
            if(codigo && nick){
                $('#mUAP').remove();
                $('#mCP').remove();
                ws.unirAPartida(codigo, nick);
            }
        });

/*
        $("#listaPartidas").append(cadena);
         $("#btnUAP").on("click", function(){
             var codigo = $('#cod').val();
             $("#mUAP").remove();
             rest.unirAPartida(codigo, nick);
            // var codigo = partida.codigo;
            // $("#crearPartida").append('<div id="mCP"><label for="numj">Nick:</label>');
         })*/
     }

     this.mostrarListaPartidas = function(lista){
        var cadena =  '<div id="mLP"><label for="numj">Partidas disponibles:</label>';
        cadena = cadena + '<input type="text" class="form-control" id="numj">'
        cadena = cadena + '</div>';

        var rest = new ClienteRest();
        rest.obtenerListaPartidas();
 /*
        $("#crearPartida").append(cadena);
         $("#btnAJ").on("click", function(){
             var numJug = $('#numj').val();
             $("#mCP").remove();
             var partida = rest.crearPartida(nick, numJug);
            // var codigo = partida.codigo;
            // $("#crearPartida").append('<div id="mCP"><label for="numj">Nick:</label>');
         })
 */
     }

     this.mostrarModal = function(msg){
         $('#cM').remove();
        var cadena = "<p id='cM'>" + msg + "</p>";
        $('#contenidoModal').append(cadena);
        $('#miModal').modal('show');
     }

     this.mostrarMano = function(lista){
        $('#mM').remove();
        var cadena =        '<div id="mM" class="card-columns">';

        for (i = 0; i < lista.length; i++){
            cadena = cadena +       '<div class="card bg-light">'
            cadena = cadena +           '<div class="card-body text-center">'
            cadena = cadena +       '  <img class="card-img-top src="cliente/img/'+ lista[i].nombre + '.png" alt="Card image">'
            cadena = cadena +           '<p class="card-text">'+ lista[i].tipo +' ' + lista[i].color + ' '+ lista[i].valor +'</p>'
            cadena = cadena +    '</div></div>'
        }
        cadena = cadena +' </div>'

        $('#mano').append(cadena);

        //onclick

     }

     this.mostrarCartaActual = function(carta){
        $('#mCA').remove();
        var cadena ='<div id="mCA" class="card-columns">';
        cadena = cadena +       '<div class="card bg-light">'
        cadena = cadena +           '<div class="card-body text-center">'
        cadena = cadena +       '  <img class="card-img-top src="cliente/img/'+ carta.nombre + '.png" alt="Card image">'
        cadena = cadena +           '<p class="card-text">'+ carta.tipo +'' + carta.color + ''+ carta.valor +'</p>'
        cadena = cadena +    '</div></div></div>'
    }
}