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
        })
    }

    //this.mostrarCrearPartida
    //this.mostrarUnirAPartida
    //this.mosrtarListaPartidas
}