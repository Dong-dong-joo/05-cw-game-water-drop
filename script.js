// Game variables
let gameRunning = false;
let score = 0;
let timeLeft = 30;

let dropSpeed = 800;
let winScore = 10;

let dropMaker;
let timerInterval;

// Sounds
const popSound = document.getElementById("pop-sound");
const winSound = document.getElementById("win-sound");
const gameoverSound = document.getElementById("gameover-sound");

// Elements
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const messageDisplay = document.getElementById("message");
const gameContainer = document.getElementById("game-container");

// Milestones
const milestones = [5, 10, 15];

// Events
startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);

function startGame() {

  if (gameRunning) return;

  // Difficulty setting
  const difficulty = document.getElementById("difficulty").value;

  if (difficulty === "easy") {
    dropSpeed = 1000;
    winScore = 8;
    timeLeft = 35;
  } else if (difficulty === "normal") {
    dropSpeed = 800;
    winScore = 10;
    timeLeft = 30;
  } else {
    dropSpeed = 500;
    winScore = 15;
    timeLeft = 25;
  }

  gameRunning = true;
  messageDisplay.textContent = "Game started!";

  dropMaker = setInterval(createDrop, dropSpeed);

  timerInterval = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function createDrop() {

  if (!gameRunning) return;

  const drop = document.createElement("div");
  drop.classList.add("water-drop");

  const isBad = Math.random() < 0.3;

  if (isBad) {
    drop.classList.add("bad-drop");
  } else {
    drop.classList.add("good-drop");
  }

  const size = Math.random() * 25 + 45;
  drop.style.width = `${size}px`;
  drop.style.height = `${size}px`;

  const gameWidth = gameContainer.offsetWidth;
  const x = Math.random() * (gameWidth - size);
  drop.style.left = `${x}px`;

  drop.style.animationDuration = "3s";

  drop.addEventListener("click", () => {

    if (!gameRunning) return;

    popSound.currentTime = 0;
    popSound.play();

    if (isBad) {
      score--;
      messageDisplay.textContent = "Bad drop! -1";
    } else {
      score++;
      messageDisplay.textContent = "Good drop! +1";
    }

    if (score < 0) score = 0;

    scoreDisplay.textContent = score;

    // Milestones
    if (milestones.includes(score)) {
      messageDisplay.textContent = `Milestone: ${score} points!`;
    }

    drop.remove();

    if (score >= winScore) {
      winGame();
    }
  });

  drop.addEventListener("animationend", () => {
    drop.remove();
  });

  gameContainer.appendChild(drop);
}

function endGame() {

  gameRunning = false;

  clearInterval(dropMaker);
  clearInterval(timerInterval);

  gameoverSound.play();

  clearDrops();

  messageDisplay.textContent = `Game Over! Score: ${score}`;
}

function winGame() {

  gameRunning = false;

  clearInterval(dropMaker);
  clearInterval(timerInterval);

  winSound.play();

  clearDrops();

  messageDisplay.textContent = "You Win!";

  launchConfetti();
}

function resetGame() {

  clearInterval(dropMaker);
  clearInterval(timerInterval);

  gameRunning = false;
  score = 0;
  timeLeft = 30;

  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;

  messageDisplay.textContent = "Game reset.";

  clearDrops();
  clearConfetti();
}

function clearDrops() {
  document.querySelectorAll(".water-drop").forEach(d => d.remove());
}

function launchConfetti() {

  for (let i = 0; i < 30; i++) {

    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    confetti.style.left = `${Math.random()*100}%`;

    const colors = ["#FFC907","#2E9DF7","#F5402C","#4FCB53"];
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random()*colors.length)];

    gameContainer.appendChild(confetti);

    confetti.addEventListener("animationend", () => {
      confetti.remove();
    });
  }
}

function clearConfetti() {
  document.querySelectorAll(".confetti").forEach(c => c.remove());
}