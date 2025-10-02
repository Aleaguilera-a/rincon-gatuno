// ==== CONFIGURACIONES ====
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameOverFlag = false;
let score = 0;
let highScore = 20; // Puntaje objetivo para "felicidades"
let obstacles = [];
let gravity = 0.7;
let jumpPower = -15;
let groundHeight = 100; // altura del suelo

// ==== SONIDOS ====
let jumpSound = new Audio("sonidos/maullido.mp3");
let bgMusic = new Audio("sonidos/musica.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.3;
bgMusic.play();

// ==== JUGADOR ====
let catImg = new Image();
catImg.src = "gatos/gato1.png"; // por defecto, se puede cambiar según selección

let cat = {
  x: 50,
  y: canvas.height - groundHeight - 100, // bien pegado al suelo
  width: 80,
  height: 80,
  dy: 0,
  jumping: false,
};

// ==== OBSTÁCULOS ====
let obstacleImg = new Image();
obstacleImg.src = "obstaculo.png";

class Obstacle {
  constructor() {
    this.width = 50 + Math.random() * 30;
    this.height = 50 + Math.random() * 20;
    this.x = canvas.width;
    this.y = canvas.height - groundHeight - this.height;
    this.speed = 7;
  }

  draw() {
    ctx.drawImage(obstacleImg, this.x, this.y, this.width, this.height);
  }

  update() {
    this.x -= this.speed;
    this.draw();
  }
}

// ==== CONTROL ====
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    jump();
  }
});

canvas.addEventListener("touchstart", jump);

function jump() {
  if (!cat.jumping) {
    cat.dy = jumpPower;
    cat.jumping = true;
    jumpSound.currentTime = 0;
    jumpSound.play();
  }
}

// ==== GAME LOOP ====
let lastObstacleTime = Date.now();

function drawCat() {
  ctx.drawImage(catImg, cat.x, cat.y, cat.width, cat.height);
}

function updateCat() {
  cat.y += cat.dy;
  cat.dy += gravity;

  // suelo
  if (cat.y + cat.height >= canvas.height - groundHeight) {
    cat.y = canvas.height - groundHeight - cat.height;
    cat.dy = 0;
    cat.jumping = false;
  }
  drawCat();
}

function detectCollision(obstacle) {
  // "hitbox" más justa (márgenes para no chocar en el aire)
  if (
    cat.x + 15 < obstacle.x + obstacle.width - 15 &&
    cat.x + cat.width - 15 > obstacle.x + 15 &&
    cat.y + 10 < obstacle.y + obstacle.height &&
    cat.y + cat.height - 5 > obstacle.y
  ) {
    return true;
  }
  return false;
}

function gameOver() {
  gameOverFlag = true;
  ctx.fillStyle = "black";
  ctx.font = "40px Arial";
  ctx.fillText("Game Over 😿", canvas.width / 2 - 120, canvas.height / 2);

  if (score >= highScore) {
    ctx.fillText("¡Felicidades! 🎉", canvas.width / 2 - 130, canvas.height / 2 + 60);

    // Botón para redirigir
    let btn = document.createElement("button");
    btn.innerText = "Ir a la sorpresa";
    btn.style.position = "absolute";
    btn.style.left = "50%";
    btn.style.top = "60%";
    btn.style.transform = "translate(-50%, -50%)";
    btn.style.padding = "15px 30px";
    btn.style.fontSize = "20px";
    btn.style.background = "#ff9800";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "10px";
    btn.style.cursor = "pointer";
    document.body.appendChild(btn);

    btn.addEventListener("click", () => {
      window.location.href = "https://tu-url-aqui.com"; // cambia por tu URL
    });
  }
}

function animate() {
  if (gameOverFlag) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // suelo
  ctx.fillStyle = "#87ceeb";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#654321";
  ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

  updateCat();

  // Obstáculos
  if (Date.now() - lastObstacleTime > 2500) { // más espaciados (2.5 seg)
    obstacles.push(new Obstacle());
    lastObstacleTime = Date.now();
  }

  obstacles.forEach((obstacle, index) => {
    obstacle.update();

    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(index, 1);
      score++;
    }

    if (detectCollision(obstacle)) {
      gameOver();
    }
  });

  // Score
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Puntaje: " + score, 20, 30);

  requestAnimationFrame(animate);
}

animate();
