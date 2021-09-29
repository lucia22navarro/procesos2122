describe("El juego del UNO...", function() {
  var juego;

  beforeEach(function() {
    juego = new Juego();
    juego.agregarJugador("ana");
    juego.agregarJugador("pepe");
    juego.agregarJugador("luis");
  });




  it("Comprobar mazo",function(){
    //codigo para crear partida
    var ju1 = juego.usuarios["ana"];
    expect(juego.numeroPartidas()).toEqual(0);
    expect((juego.obtenerTodasPartidas()).length).toEqual(0);
    var partida = ju1.crearPartida(2)

    expect(partida.cartas.length).toBe(108);
        var rojo=partida.cartas.filter(function(each){
          return each.color=="rojo";
        });
        expect(rojo.length).toBe(25);
        var verde=partida.cartas.filter(function(each){
          return each.color=="verde";
        });
        expect(verde.length).toBe(25);
        var amarillo=partida.cartas.filter(function(each){
          return each.color=="amarillo";
        });
        expect(amarillo.length).toBe(25);
        var azul=partida.cartas.filter(function(each){
          return each.color=="azul";
        });
        expect(azul.length).toBe(25);
        var comodin=partida.cartas.filter(function(each){
          return each.tipo=="comodin";
        });
        expect(comodin.length).toBe(4);
        var comodin4=partida.cartas.filter(function(each){
          return each.tipo=="comodin4";
        });
        expect(comodin4.length).toBe(4);
      });




      
  it("Ana crea una partida para 2 jugadores", function() {
    var ju1 = juego.usuarios["ana"];
    expect(juego.numeroPartidas()).toEqual(0);
    expect((juego.obtenerTodasPartidas()).length).toEqual(0);
    var partida = ju1.crearPartida(2);
    expect(juego.numeroPartidas()).toEqual(1);
    expect((juego.obtenerTodasPartidas()).length).toEqual(1);
    expect(partida.codigo).toBeDefined();
    expect(partida.numeroJugadores()).toEqual(1);
    expect(partida.fase.nombre).toEqual("inicial");

  });

 //cada it es independiente de otro. hay que volver a comprobar que ana crea la partida


  it("Ana crea la partida de 2 jugadores y Pepe se une", function() {
    var ju1 = juego.usuarios["ana"];
    var ju2 = juego.usuarios["pepe"];
    expect(juego.numeroPartidas()).toEqual(0);

    var partida = ju1.crearPartida(2);
    expect(partida.numeroJugadores()).toEqual(1);
    expect(juego.numeroPartidas()).toEqual(1);
    expect(partida.fase.nombre).toBe("inicial");

    ju2.unirAPartida(partida.codigo);
    expect(juego.numeroPartidas()).toEqual(1);
    expect(partida.numeroJugadores()).toEqual(2);
    expect(partida.fase.nombre).toBe("jugando");
  });

  
  it("Ana crea la partida de 2 jugadores, Pepe se une y Luis no puede", function() {
    var ju1 = juego.usuarios["ana"];
    var ju2 = juego.usuarios["pepe"];
    var ju3 = juego.usuarios["luis"];
    expect(juego.numeroPartidas()).toEqual(0);

    var partida = ju1.crearPartida(2);
    expect(partida.numeroJugadores()).toEqual(1);
    expect(juego.numeroPartidas()).toEqual(1);
    expect(partida.fase.nombre).toBe("inicial");

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
