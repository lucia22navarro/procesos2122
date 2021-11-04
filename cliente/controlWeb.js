function ControlWeb(){
    this.mostrarAgregarJugador = function(){
        //para los campos dinámicos de nuestra página:
        //se copia el texto html que queremos mostrar en cadenas
       var cadena =         '<div id="mAJ">'
       cadena = cadena +        '<label for="usr">Para comenzar a jugar, introduce un nick:</label>';
       cadena = cadena +            '<input type="text" class="form-control" id="usr">'
       cadena = cadena +            '<button type="button" id="btnAJ" class="btn btn-primary">Entrar</button>'
       cadena = cadena +    '</div>';
       //sustituimos en la etiqueta agregarJugador la cadena
       $("#agregarJugador").append(cadena);
       //localizadores, ids y eventos: #
       //clases y métodos: .
        $("#btnAJ").on("click", function(){
            var nick = $('#usr').val();
           // if(nick !=null){
            $("#mAJ").remove();
            rest.agregarJugador(nick);

           // this.mostrarControl();
           // $("#crearPartida").show();
            iu.mostrarControl(nick);  
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
        cadena = cadena +               '<div id="listaPartidas">Lista de partidas</div></div></div></div>'
        $("#opciones").append(cadena);
        iu.mostrarCrearPartida(nick);
        iu.mostrarListaPartidas();

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
            $("#crearPartida").empty();
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

    this.mostrarUnirAPartida = function(nick){
        var cadena =  '<div id="mUAP"><label for="cod">Código:</label>';
        cadena = cadena + '<input type="text" class="form-control" id="cod">'
        cadena = cadena + '<button type="button" id="btnUAP" class="btn btn-primary">Unirse</button>'
        cadena = cadena + '</div>';


 
        $("#unirAPartida").append(cadena);
         $("#btnUAP").on("click", function(){
             var codigo = $('#cod').val();
             $("#mUAP").remove();
             rest.unirAPartida(codigo, nick);
            // var codigo = partida.codigo;
            // $("#crearPartida").append('<div id="mCP"><label for="numj">Nick:</label>');
         })
     }

     this.mostrarListaPartidas = function(){
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
}