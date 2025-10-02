let canvas, ctx;
let gato, obstaculos = [];
let puntaje = 0;
let juegoInterval, obstaculoInterval;
let gatoSeleccionado = "";
const puntajeMax = 20;
let velocidad = 6;
const gravedad = 0.9;
const fuerzaSalto = -18;

// Sonidos
const sonidoSalto = new Audio('sonidos/maullido.mp3');
const musicaFondo = new Audio('sonidos/musica.mp3');
musicaFondo.loop = true;

function seleccionarGato(nombre) {
  gatoSeleccionado = nombre;
  document.getElementById("btn-iniciar").disabled = false;
  document.querySelectorAll(".seleccion-gato img").forEach(img => img.style.borderColor = "transparent");
  event.target.style.borderColor = "#ff6600";
}

function iniciarJuego() {
  document.getElementById("pantalla-seleccion").style.display = "none";
  document.getElementById("pantalla-juego").style.display = "block";

  canvas = document.getElementById("gameCanvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");

  const sueloY = canvas.height - 130;

  gato = {
    x: 50,
    y: sueloY,
    width: 80,
    height: 80,
    vy: 0,
    saltando: false,
    img: new Image()
  };
  gato.img.src = `gatos/${gatoSeleccionado}.png`;

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !gato.saltando) {
      gato.vy = fuerzaSalto;
      gato.saltando = true;
      sonidoSalto.play();
    }
  });

  document.addEventListener("touchstart", () => {
  if (!gato.saltando) {
    gato.vy = fuerzaSalto;
    gato.saltando = true;
    sonidoSalto.play();
  }
});

  musicaFondo.play();
  juegoInterval = setInterval(actualizarJuego, 20);
  obstaculoInterval = setInterval(generarObstaculo, 1500); // cada 1.5 segundos
}

function generarObstaculo() {
  const obs = {
    x: canvas.width,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    img: new Image(),
    pasado: false
  };
  obs.img.src = 'obstaculo.png';
  obstaculos.push(obs);
}

function actualizarJuego() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fondo
  ctx.fillStyle = "#cceeff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Suelo
  ctx.fillStyle = "#88cc88";
  ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

  // Movimiento del gato
  gato.vy += gravedad;
  gato.y += gato.vy;

  const sueloY = canvas.height - 130;
  if (gato.y >= sueloY) {
    gato.y = sueloY;
    gato.vy = 0;
    gato.saltando = false;
  }

  ctx.drawImage(gato.img, gato.x, gato.y, gato.width, gato.height);

  // Obstáculos
  for (let i = 0; i < obstaculos.length; i++) {
    const obs = obstaculos[i];
    obs.x -= velocidad;
    ctx.drawImage(obs.img, obs.x, obs.y, obs.width, obs.height);

    // Colisión ajustada (hitbox más pequeña)
    const margen = 10;
    if (
      gato.x + margen < obs.x + obs.width &&
      gato.x + gato.width - margen > obs.x &&
      gato.y + margen < obs.y + obs.height &&
      gato.y + gato.height - margen > obs.y
    ) {
      finJuego();
    }

    // Puntaje
    if (!obs.pasado && obs.x + obs.width < gato.x) {
      puntaje++;
      obs.pasado = true;
      document.getElementById("puntaje").innerText = `Puntaje: ${puntaje}`;
      if (puntaje >= puntajeMax) {
        victoria();
      }
      // Aumentar dificultad
      if (puntaje % 5 === 0) velocidad += 0.5;
    }
  }

  // Limpiar obstáculos fuera de pantalla
  obstaculos = obstaculos.filter(obs => obs.x + obs.width > 0);
}

function finJuego() {
  clearInterval(juegoInterval);
  clearInterval(obstaculoInterval);
  musicaFondo.pause();
  musicaFondo.currentTime = 0;
  alert("¡Game Over! Puntaje: " + puntaje);
  location.reload();
}

function victoria() {
  clearInterval(juegoInterval);
  clearInterval(obstaculoInterval);
  musicaFondo.pause();
  musicaFondo.currentTime = 0;
  document.getElementById("pantalla-juego").style.display = "none";
  document.getElementById("pantalla-victoria").style.display = "flex";
}

function redireccion() {
  window.location.href = "https://form.jotform.com/252738529148063";
}


