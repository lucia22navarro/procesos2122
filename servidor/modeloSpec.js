var modelo = require("./modelo.js");

describe("El juego del UNO...", function() {
    var juego;
  
    beforeEach(function() {
      juego = new modelo.Juego(true);
      juego.agregarJugador("ana");
      juego.agregarJugador("pepe");
      juego.agregarJugador("luis");
    });
  
    it("Condiciones iniciales", function(){
      expect(juego.numeroPartidas()).toEqual(0);
      expect((juego.obtenerTodasPartidas()).length).toEqual(0);
    });
    describe("Ana crea una partida 2 jugadores...", function() {
      var ju1, ju2;
      var partida;

      beforeEach(function() {
        ju1 = juego.usuarios["ana"];
        ju2 = juego.usuarios["pepe"];
        partida = ju1.crearPartida(2);
      });
      it("Comprobar mazo",function(){    
        expect(partida.mazo.length).toBe(84);
        var rojo=partida.mazo.filter(function(each){
          return each.color=="rojo";
        });
        expect(rojo.length).toBe(21);
        var verde=partida.mazo.filter(function(each){
          return each.color=="rojo";
        });
        expect(verde.length).toBe(21);
        var amarillo=partida.mazo.filter(function(each){
          return each.color=="rojo";
        });
        expect(amarillo.length).toBe(21);
        var azul=partida.mazo.filter(function(each){
          return each.color=="rojo";
        });
        expect(azul.length).toBe(21);
        var comodin=partida.mazo.filter(function(each){
          return each.tipo=="comodin";
        });
        expect(comodin.length).toBe(0);
        var comodin4=partida.mazo.filter(function(each){
          return each.tipo=="comodin4";
        });
        expect(comodin4.length).toBe(0);
      });
      it("Comprobar manoInicial", function(){
        expect(ju1.mano.length).toBe(0);
        ju1.manoInicial();
        expect(ju1.mano.length).toBe(7);
        expect(partida.mazo.length).toBe(77);
      });
      it("Comprobar robar", function(){
        expect(ju1.mano.length).toBe(0);
        ju1.robar(2);
        expect(ju1.mano.length).toBe(2);
        expect(partida.mazo.length).toBe(82);
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
      it("Pepe se une", function() {
        ju2.unirAPartida(partida.codigo);
        expect(juego.numeroPartidas()).toEqual(1);
        expect(partida.numeroJugadores()).toEqual(2);
        expect(partida.fase.nombre).toBe("jugando");
        expect(juego.obtenerPartidasDisponibles().length).toEqual(0);
      });
      it("Pepe se une y Luis no puede", function() {
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
      it("Ana roba una carta", function(){
        expect(ju1.mano.length).toBe(0);
        ju1.robar(1);
        expect(ju1.mano.length).toBe(1);
      });
      it("Ana intenta robar una carta pero no quedan cartas en el mazo", function(){
        expect(partida.mazo.length).toBe(84);
        partida.mesa = partida.mesa.concat(partida.mazo);
        partida.mazo=[];
        expect(partida.mesa.length).toBe(84);
        ju1.robar(1);
        expect(ju1.mano.length).toBe(8);
        expect(partida.mazo.length).toBe(83);
      });
      it("Ana roba todas las cartas del mazo y pierde el turno", function(){
        expect(partida.mazo.length).toBe(84);
        expect(ju1.mano.length).toBe(0);
        ju1.robar(84);
        expect(ju1.mano.length).toBe(84);
        expect(partida.turno.nick).toBe(ju1.nick);
        ju1.robar(1);
        expect(partida.turno.nick).toBe(ju2.nick);
      });
      it("Ana abandona la partida", function(){
        expect
      });
      it("Ana juega 1 carta Bloqueo,pepe pierde el turno", function(){
        var carta = ju1.mano[0];
        while(!carta || carta.tipo !="bloqueo"){
          carta = ju1.mano.find(function(el){return el.tipo=="bloqueo"; });
          ju1.robar(1);
        }
        expect(carta.tipo).toEqual("bloqueo");

        var ind = ju1.mano.indexOf(carta);
        expected(ju1.mano[ind].tipo).toEqual("bloqueo");
        partida.cartaActual.color = carta.color;
        expect(partida.turno.nick).toEqual(ju1.nick);
        ju1.jugarCarta(ind);
        expect(partida.cartaActual.tipo).toEqual("bloqueo");
        expect(partida.turno.nick).toEqual(ju1.nick);
        expect(ju2.estado.nombre).toEqual("normal");
      });
    });

  describe("Ana crea una partida de 3 jugadores...", function(){
    var ju1, ju2, ju3;
    var partida;
  
    beforeEach(function(){
      ju1 = juego.usuarios["ana"];
      partida = ju1.crearPartida(3);
      ju2 = juego.usuarios["pepe"];
      ju3 = juego.usuarios["luis"];
      ju2.unirAPartida(partida.codigo);
      ju3.unirAPartida(partida.codigo);
      ju1.manoInicial();
      ju2.manoInicial();
      ju3.manoInicial();
    });
    it("Condiciones iniciales", function(){
      expect(partida.mazo.length).toBe(62);
      var carta = ju1.mano[0];

      while(!carta || carta.tipo !="bloqueo"){
        carta = ju1.mano.find(function(el){return el.tipo=="bloqueo"; });
        ju1.robar(1);
      }
      expect(carta.tipo).toEqual("bloqueo");

      var ind = ju1.mano.indexOf(carta);
      expect(ju1.mano[ind].tipo).toEqual("bloqueo");
      partida.cartaActual.color = carta.color;
      expect(partida.turno.nick).toEqual(ju1.nick);
      var num = ju1.mano.length;
      ju1.jugarCarta(ind);
      expect(partida.cartaActual.tipo).toEqual("bloqueo");
      expect(ju1.mano.length).toEqual(num-1);
      expect(partida.turno.nick).toEqual(ju3.nick);
      expect(ju2.estado.nombre).toEqual("normal");
    })
  })
});
  

