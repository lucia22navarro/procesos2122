var mongo = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;

function CAD(){
    this.resultadosCol = undefined;


    this.encontrarTodosResultados = function(callback){
        encontrarTodos(this.resultadosCol, callback);
    }

    this.encontrarResultadoCriterio = function(criterio, callback){
        encontrarCriterio(this.resultadosCol, criterio, callback);
    }

    //SELECT * FROM DATABASE WHERE (CRITERIO)

    function encontrarCriterio(coleccion, criterio, callback){
        coleccion.find(criterio).toArray(function(err,col){
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
            }   
        })
    }

    //this.conectar(function(){});
}

module.exports.CAD = CAD;