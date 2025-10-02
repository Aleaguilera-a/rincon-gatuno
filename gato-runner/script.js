let canvas, ctx;
let gato, obstaculos = [];
let puntaje = 0;
let juegoInterval;
let gatoSeleccionado = "";
const puntajeMax = 20; // Cambia según quieras
const velocidad = 5;

// Sonidos
const sonidoSalto = new Audio('sonidos/maullido.mp3'); // tu archivo de maullido
const musicaFondo = new Audio('sonidos/musica.mp3');  // tu canción de fondo
musicaFondo.loop = true;

// Selección de gato
function seleccionarGato(nombre) {
  gatoSeleccionado = nombre;
  document.getElementById("btn-iniciar").disabled = false;
  document.querySelectorAll(".seleccion-gato img").forEach(img => img.style.borderColor = "transparent");
  event.target.style.borderColor = "#ff6600";
}

// Iniciar juego
function iniciarJuego() {
  document.getElementById("pantalla-seleccion").style.display = "none";
  document.getElementById("pantalla-juego").style.display = "block";

  canvas = document.getElementById("gameCanvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");

  gato = {
    x: 50,
    y: canvas.height - 150,
    width: 80,
    height: 80,
    vy: 0,
    saltando: false,
    img: new Image()
  };
  gato.img.src = `gatos/${gatoSeleccionado}.png`;

  document.addEventListener("keydown", (e) => {
    if(e.code === "Space" && !gato.saltando) {
      gato.vy = -15;
      gato.saltando = true;
      sonidoSalto.play();
    }
  });

  musicaFondo.play();
  juegoInterval = setInterval(actualizarJuego, 20);
}

// Obstáculo
function generarObstaculo() {
  const obs = {
    x: canvas.width,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    img: new Image()
  };
  obs.img.src = 'obstaculo.png';
  obstaculos.push(obs);
}

// Actualizar juego
function actualizarJuego() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fondo genérico
  ctx.fillStyle = "#cceeff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Suelo
  ctx.fillStyle = "#88cc88";
  ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

  // Movimiento del gato
  gato.vy += 0.8; // gravedad
  gato.y += gato.vy;
  if(gato.y >= canvas.height - 150) {
    gato.y = canvas.height - 150;
    gato.vy = 0;
    gato.saltando = false;
  }
  ctx.drawImage(gato.img, gato.x, gato.y, gato.width, gato.height);

  // Obstáculos
  if(Math.random() < 0.02) generarObstaculo();
  for(let i=0; i<obstaculos.length; i++) {
    obstaculos[i].x -= velocidad;
    ctx.drawImage(obstaculos[i].img, obstaculos[i].x, obstaculos[i].y, obstaculos[i].width, obstaculos[i].height);

    // Colisión
    if(gato.x < obstaculos[i].x + obstaculos[i].width &&
       gato.x + gato.width > obstaculos[i].x &&
       gato.y < obstaculos[i].y + obstaculos[i].height &&
       gato.y + gato.height > obstaculos[i].y) {
        finJuego();
    }

    // Puntaje
    if(!obstaculos[i].pasado && obstaculos[i].x + obstaculos[i].width < gato.x) {
      puntaje++;
      obstaculos[i].pasado = true;
      document.getElementById("puntaje").innerText = `Puntaje: ${puntaje}`;
      if(puntaje >= puntajeMax) {
        victoria();
      }
    }
  }
}

// Fin de juego
function finJuego() {
  clearInterval(juegoInterval);
  musicaFondo.pause();
  musicaFondo.currentTime = 0;
  alert("¡Game Over! Puntaje: " + puntaje);
  location.reload();
}

// Victoria
function victoria() {
  clearInterval(juegoInterval);
  musicaFondo.pause();
  musicaFondo.currentTime = 0;
  document.getElementById("pantalla-juego").style.display = "none";
  document.getElementById("pantalla-victoria").style.display = "flex";
}

// Redirección
function redireccion() {
  window.location.href = "https://form.jotform.com/252738529148063"; // Cambia la URL
}
