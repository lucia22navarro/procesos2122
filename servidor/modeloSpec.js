var modelo = require("./modelo.js");

describe("El juego del UNO...", function() {
    var juego;
  
    beforeEach(function() {
      juego = new modelo.Juego();
      juego.agregarJugador("ana");
      juego.agregarJugador("pepe");
      juego.agregarJugador("luis");
    });
  
  it("Condiciones iniciales", function(){
    expect(juego.numeroPartidas()).toEqual(0);
    expect((juego.obtenerTodasPartidas()).length).toEqual(0);
  });
  
  
    describe("Ana crea una partida 2 jugadores...", function() {
      var ju1;
      var partida;
  
      beforeEach(function() {
        ju1 = juego.usuarios["ana"];
        partida = ju1.crearPartida(2);
  
      });
  
  
    it("Comprobar mazo",function(){
      //codigo para crear partida
  
      expect(partida.mazo.length).toBe(108);
      var rojo=partida.mazo.filter(function(each){
        return each.color=="rojo";
      });
      expect(rojo.length).toBe(25);
      var verde=partida.mazo.filter(function(each){
        return each.color=="rojo";
      });
      expect(verde.length).toBe(25);
      var amarillo=partida.mazo.filter(function(each){
        return each.color=="rojo";
      });
      expect(amarillo.length).toBe(25);
      var azul=partida.mazo.filter(function(each){
        return each.color=="rojo";
      });
      expect(azul.length).toBe(25);
      var comodin=partida.mazo.filter(function(each){
        return each.tipo=="comodin";
      });
      expect(comodin.length).toBe(4);
      var comodin4=partida.mazo.filter(function(each){
        return each.tipo=="comodin4";
      });
      expect(comodin4.length).toBe(4);
    });
  
  
  
  
    it("Comprobar manoInicial", function(){
      var ju1 = juego.usuarios["ana"];
      expect(ju1.mano.length).toBe(0);
      ju1.manoInicial();
      expect(ju1.mano.length).toBe(7);
      expect(partida.mazo.length).toBe(101);
    });
  
  
    it("Comprobar robar", function(){
      var ju1 = juego.usuarios["ana"];
      expect(ju1.mano.length).toBe(0);
      ju1.robar(2);
      expect(ju1.mano.length).toBe(2);
      expect(partida.mazo.length).toBe(106);
  
    });
  
        
    it("Comprobamos la partida para 2 jugadores", function() {
      //var ju1 = juego.usuarios["ana"];
      //expect(juego.numeroPartidas()).toEqual(0);
      //expect((juego.obtenerTodasPartidas()).length).toEqual(0);
      //var partida = ju1.crearPartida(2);
      expect(juego.numeroPartidas()).toEqual(1);
      expect((juego.obtenerTodasPartidas()).length).toEqual(1);
      expect(partida.codigo).toBeDefined();
      expect(partida.numeroJugadores()).toEqual(1);
      expect(partida.fase.nombre).toEqual("inicial");
  
    });
  
   //cada it es independiente de otro. hay que volver a comprobar que ana crea la partida
  
  
    it("Pepe se une", function() {
      /*var ju1 = juego.usuarios["ana"];
      var ju2 = juego.usuarios["pepe"];
      expect(juego.numeroPartidas()).toEqual(0);
  
      var partida = ju1.crearPartida(2);
      expect(partida.numeroJugadores()).toEqual(1);
      expect(juego.numeroPartidas()).toEqual(1);
      expect(partida.fase.nombre).toBe("inicial");
  */
      var ju2 = juego.usuarios["pepe"];
      ju2.unirAPartida(partida.codigo);
      expect(juego.numeroPartidas()).toEqual(1);
      expect(partida.numeroJugadores()).toEqual(2);
      expect(partida.fase.nombre).toBe("jugando");
    });
  
    
    it("Pepe se une y Luis no puede", function() {
      /*var ju1 = juego.usuarios["ana"];
      var ju2 = juego.usuarios["pepe"];
      var ju3 = juego.usuarios["luis"];
      expect(juego.numeroPartidas()).toEqual(0);
  
      var partida = ju1.crearPartida(2);
      expect(partida.numeroJugadores()).toEqual(1);
      expect(juego.numeroPartidas()).toEqual(1);
      expect(partida.fase.nombre).toBe("inicial");*/
  
      var ju2 = juego.usuarios["pepe"];
      var ju3 = juego.usuarios["luis"];
      ju2.unirAPartida(partida.codigo);
      expect(juego.numeroPartidas()).toEqual(1);
      expect(partida.numeroJugadores()).toEqual(2);
      expect(partida.fase.nombre).toBe("jugando");
  
      ju3.unirAPartida(partida.codigo);
      expect(juego.numeroPartidas()).toEqual(1);
      expect(partida.numeroJugadores()).toEqual(2);
      expect(partida.fase.nombre).toBe("jugando");
  
    });
  
  });
  });
  