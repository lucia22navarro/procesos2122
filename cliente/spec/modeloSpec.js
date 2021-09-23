describe("El juego del UNO...", function() {
  var juego;

  beforeEach(function() {
    juego = new Juego();
    juego.agregarJugador("ana");
    juego.agregarJugador("pepe");
    juego.agregarJugador("luis");
  });

  it("Ana crea una partida para 2 jugadores", function() {
    var ju1 = juego.usuarios["ana"];
    expect(juego.numeroPartidas()).toEqual(0);
    var partida = ju1.crearPartida(2);
    expect(juego.numeroPartidas()).toEqual(1);
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
