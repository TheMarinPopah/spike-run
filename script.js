const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ===== GAME SETTINGS =====
const groundHeight = 100;
const groundY = canvas.height - groundHeight;

let gravity = 0.6 ;
let gameSpeed = 11
let score = 0;
let gameOver = false;

// ===== PLAYER =====
const player = {
  x: 150,
  y: groundY - 40,
  width: 40,
  height: 40,
  velocityY: 0,
  jumpForce: -14,
  grounded: true,
  rotation: 0
};

let obstacles = [];

// ===== CONTROLS =====
document.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
  if (gameOver && e.code === "KeyR") restart();
});
document.addEventListener("click", jump);

function jump() {
  if (player.grounded && !gameOver) {
    player.velocityY = player.jumpForce;
    player.grounded = false;
  }
}

// ===== SPAWN SPIKES =====
function spawnObstacle() {
  const height = 40;

  obstacles.push({
    x: canvas.width,
    y: groundY - height, // now sits perfectly above white line
    width: 40,
    height: height
  });
}

// ===== UPDATE PLAYER =====
function updatePlayer() {
  player.velocityY += gravity;
  player.y += player.velocityY;

  if (player.y >= groundY - player.height) {
    player.y = groundY - player.height;
    player.velocityY = 0;
    player.grounded = true;
    player.rotation = 0;
  } else {
    player.rotation += 0.1;
  }
}

// ===== UPDATE SPIKES =====
function updateObstacles() {
  obstacles.forEach(ob => ob.x -= gameSpeed);

  obstacles = obstacles.filter(ob => ob.x + ob.width > 0);

  if (Math.random() < 0.02) {
    spawnObstacle();
  }
}

// ===== COLLISION =====
function detectCollision() {
  for (let ob of obstacles) {
    if (
      player.x < ob.x + ob.width &&
      player.x + player.width > ob.x &&
      player.y < ob.y + ob.height &&
      player.y + player.height > ob.y
    ) {
      gameOver = true;
      document.getElementById("message").innerText =
        "Game Over! Press R to Restart";
    }
  }
}

// ===== DRAW PLAYER =====
function drawPlayer() {
  ctx.save();
  ctx.translate(
    player.x + player.width / 2,
    player.y + player.height / 2
  );
  ctx.rotate(player.rotation);

  ctx.fillStyle = "#FFD700"; // Yellow avatar
  ctx.fillRect(
    -player.width / 2,
    -player.height / 2,
    player.width,
    player.height
  );

  ctx.restore();
}

// ===== DRAW SPIKES =====
function drawObstacles() {
  ctx.fillStyle = "#ff0055";

  obstacles.forEach(ob => {
    ctx.beginPath();
    ctx.moveTo(ob.x, ob.y + ob.height);
    ctx.lineTo(ob.x + ob.width / 2, ob.y);
    ctx.lineTo(ob.x + ob.width, ob.y + ob.height);
    ctx.closePath();
    ctx.fill();
  });
}

// ===== DRAW GROUND =====
function drawGround() {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, groundY, canvas.width, 5);
}

// ===== SCORE =====
function updateScore() {
  if (!gameOver) {
    score++;
    document.getElementById("score").innerText = "Score: " + score;
  }
}

// ===== RESTART =====
function restart() {
  obstacles = [];
  score = 0;
  gameSpeed = 6;
  gameOver = false;
  player.y = groundY - player.height;
  document.getElementById("message").innerText = "";
}

// ===== GAME LOOP =====
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGround();
  drawPlayer();
  drawObstacles();

  if (!gameOver) {
    updatePlayer();
    updateObstacles();
    detectCollision();
    updateScore();

    if (score % 500 === 0) {
      gameSpeed += 0.5;
    }
  }

  requestAnimationFrame(animate);
}

animate();
  

