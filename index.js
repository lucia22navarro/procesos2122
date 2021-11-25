var fs = require("fs"); //librería para manejar el sistema de archivos
var express = require("express"); //middleware para implementar aplicaciones web
var app = express(); //creamos la instancia de express
var http = require("http").Server(app); //creamos el servidor http
var { Server } = require("socket.io"); //importamos el objeto server para ServidorWS (punto de entrada para socket.io)
var io = new Server(http); // entrada del objeto server
var bodyParser = require("body-parser"); //parsear las peticiones de tipo POST
var passport = require("passport");
var cookieSession = require("cookie-session");

require("./servidor/passport-setup.js");
var modelo = require("./servidor/modelo.js");
var ssrv = require("./servidor/servidorWS.js");  //importamos el objeto de webSocket
const { response } = require("express");

var juego = new modelo.Juego();
var servidorWS = new ssrv.ServidorWS();


app.set('port', process.env.PORT || 5000); //directiva de express que define una variable interna (port) donde va a escuchar nuestra aplicación
                                            //el segundo parámetro es el valor: o bien coge la variable de entorno o bien coge 5000
                                            //necesario para el despliegue en heroku
app.use(express.static(__dirname + "/")); //variable de entorno __dirname: nombre de toda la solución. en esta máquina: C:\lucia\proyectos\git\uno

app.use(cookieSession({
    name : 'juegodeluno', 
    keys: ['key1', 'key2']
}));

app.use(passport.initialize());
app.use(passport.session());

const haIniciado = function(request, response, next){
    if(request.user){
        next();
    }
    else{
        response.redirect('/');
    }
}

app.get("/", function(request, response){ //cuando haya peticiones de tipo GET
    var contenido = fs.readFileSync(__dirname + "/cliente/index.html"); //lee el fichero index.html de cliente
    response.setHeader("Content-type", "text/html");
    response.send(contenido);  //envía el contenido leído del fichero index.html
});

//Rutas a definir para validar a usuarios con OAuth20
// /auth/google -> redireccionamos al usuario a Google para que se valide
// /auth/instagram -> redireccionamos al usuario a Instagram ...
// .......

app.get("/auth/google", passport.authenticate('google', {scope:['profile', 'email']}));

// /google/callback -> aquí llega la respuesta de Google
// /good -> en caso de usuario de Google válido
// /fail -> en caso de usuario no válido

app.get("/good", function(request, response){
    //definir el nick como el email del usuario de google
    //agregarJugador(nick)
    var nick = request.user.emails[0].value;
    juego.agregarJugador(nick);
    response.cookie('nick', nick);
    response.redirect("/");
});

app.get("/fallo", function(req, res){
    res.send("No se pudo iniciar sesión");
});

app.get("/google/callback", passport.authenticate('google', {failureRedirect:'/fallo'}), function(req, res){
    res.redirect("/good");
})

//agregar usuario
app.get("/agregarJugador/:nick", function(request, response){
    var nick = request.params.nick;    //leer el nick de la petición
    var res = juego.agregarJugador(nick);
    response.send(res);   //hay que enviar siempre una respuesta
});

app.post('/registrarUsuario', function(request, response){
    var email = request.body.email;
    var clave = request.body.clave;

    juego.registrarUsuario(email, clave, function(data){
        response.send(data);
    })
})


//crear partida
app.get("/crearPartida/:nick/:numJug", haIniciado, function(request, response){
    var nick = request.params.nick;    //leer el nick de la petición
    var numJug = request.params.numJug;
    var ju1 = juego.usuarios[nick];
    var res={codigo:-1};
    if(ju1){
        var partida = ju1.crearPartida(numJug);
        console.log("Nueva partida de " +nick + "codigo: " +ju1.codigoPartida);
        res.codigo = ju1.codigoPartida;
    }
    response.send(res);   //hay que enviar siempre una respuesta
});

//unir a partida
app.get("/unirAPartida/:codigo/:nick", function(request, response){
    var nick = request.params.nick;    //leer el nick de la petición
    var codigo = request.params.codigo;
    var res = juego.unirAPartida(codigo, nick);
    response.send(res);   //hay que enviar siempre una respuesta
});

//obtener lista de partidas
app.get("/obtenerListaPartidas", haIniciado, function(request, response){
    var res = juego.obtenerTodasPartidas(); //en res se guarda la lista de las partidas que devuelve el método de Juego
    response.send(res);   //hay que enviar siempre una respuesta
});

app.get("/obtenerPartidasDisponibles", haIniciado, function(request, response){
    if(juego){
        var res = juego.obtenerPartidasDisponibles();
        response.send(res);
    }
})

http.listen(app.get('port'), function(){    //lanzamos el servidor
    console.log("La app NodeJS se está ejecutando en el puerto ", app.get('port'));
});

//lanzar el servidorWS
servidorWS.lanzarServidorWS(io, juego);