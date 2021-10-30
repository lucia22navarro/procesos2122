function ControlWeb(){
    this.mostrarAgregarJugador = function(){
        //para los campos dinámicos de nuestra página:
        //se copia el texto html que queremos mostrar en cadenas
       var cadena =  '<div id="mAJ"><label for="usr">Nick:</label>';
       cadena = cadena + '<input type="text" class="form-control" id="usr">'
       cadena = cadena + '<button type="button" id="btnAJ" class="btn btn-primary">Entrar</button>'
       cadena = cadena + '</div>';

       //sustituimos en la etiqueta agregarJugador la cadena
       $("#agregarJugador").append(cadena);
       //localizadores, ids y eventos: #
       //clases y métodos: .
        $("#btnAJ").on("click", function(){
            var nick = $('#usr').val();
            $("#mAJ").remove();
            rest.agregarJugador(nick);
            $("#crearPartida").show();
            mostrarCrearPartida(nick);
        })
       // return nick;
    }

    this.mostrarCrearPartida = function(nick){
       var cadena =  '<div id="mCP"><label for="numj">Número de jugadores:</label>';
       cadena = cadena + '<input type="text" class="form-control" id="numj">'
       cadena = cadena + '<button type="button" id="btnCP" class="btn btn-primary">Crear</button>'
       cadena = cadena + '</div>';

       $("#crearPartida").append(cadena);
        $("#btnAJ").on("click", function(){
            var numJug = $('#numj').val();
            $("#mCP").remove();
            var partida = rest.crearPartida(nick, numJug);
           // var codigo = partida.codigo;
           // $("#crearPartida").append('<div id="mCP"><label for="numj">Nick:</label>');
        })

    }



    //this.mostrarUnirAPartida
    //this.mosrtarListaPartidas
}