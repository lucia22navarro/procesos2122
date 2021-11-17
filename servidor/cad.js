var mongo = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;

function CAD(){
    this.resultadosCol = undefined;

    this.conectar = function(callback){
        var pers = this;
        mongo.connect("", function(err,db){
            if(err){
                console.log("No se pudo conectar");
            }
            else{
                console.log("Conectado a Atlas MongoDB");
            }
        })
    }
}

module.exports.CAD = CAD;