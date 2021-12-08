var mongo = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;

function CAD(){
    this.resultadosCol = undefined;
    this.usuariosCol = undefined;


    this.encontrarTodosResultados = function(callback){
        encontrarTodos(this.resultadosCol, callback);
    }

    this.encontrarResultadoCriterio = function(criterio, callback){
        encontrarCriterio(this.usuariosCol, criterio, callback);
    }

    this.encontrarTodosUsuarios = function(callback){
        encontrarTodos(this.resultadosCol, callback);
    }

    this.encontrarUsuarioCriterio = function(criterio, callback){
        encontrarCriterio(this.usuariosCol, criterio, callback);
    }

    //las siguientes dos funciones sirven para cualquier tipo de colección
    //SELECT * FROM DATABASE WHERE (CRITERIO)

    function encontrarCriterio(coleccion, criterio, callback){
        coleccion.find(criterio).toArray(function(err,datos){
            if(err){
                callback([]);
            }
            callback(datos)
        });
    }

    //SELECT *

    function encontrarTodos(coleccion, callback){
        coleccion.find().toArray(function(err, datos){
            if(err){
                callback([]);
            }
            callback(datos)
        });
    }

    this.insertarResultado = function(resultado, callback){
        insertar(this.resultadosCol, resultado, callback);
    }

    this.insertarUsuario = function(usuario, callback){
        insertar(this.usuariosCol, usuario, callback);
    }

    function insertar(coleccion, objeto, callback){
        coleccion.insertOne(objeto, function(err, result){
            if(err){
                console.log("No se ha podido insertar el elemento")
            }
            else{
                console.log("Nuevo elemento");
                callback(result);
            }
        });
    }

    this.conectar = function(callback){
        var cad = this;
        mongo.connect("mongodb+srv://patata:patata@cluster0.jedyd.mongodb.net/resultados?retryWrites=true&w=majority", function(err,db){
            if(err){
                console.log("No se pudo conectar");
            }
            else{
                console.log("Conectado a Atlas MongoDB");
                cad.resultadosCol = db.db("juegodeluno").collection("resultados");
                cad.usuariosCol = db.db("juegodeluno").collection("usuarios");

            }   
        })
    }

    //this.conectar(function(){});
}

module.exports.CAD = CAD;