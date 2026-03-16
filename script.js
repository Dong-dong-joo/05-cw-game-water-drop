let gameRunning = false;
let score = 0;
let timeLeft = 30;

const winScore = 10;

let dropMaker;
let timerInterval;

const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");

const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const messageDisplay = document.getElementById("message");

const gameContainer = document.getElementById("game-container");

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);


function startGame() {

  if (gameRunning) return;

  gameRunning = true;

  messageDisplay.textContent = "Catch the clean drops!";

  dropMaker = setInterval(createDrop, 800);

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

  const xPosition = Math.random() * (gameWidth - size);

  drop.style.left = `${xPosition}px`;

  const duration = Math.random() * 1.5 + 3;

  drop.style.animationDuration = `${duration}s`;

  drop.addEventListener("click", () => {

    if (!gameRunning) return;

    if (isBad) {

      score--;

      messageDisplay.textContent = `Bad drop! -1`;

    } else {

      score++;

      messageDisplay.textContent = `Good drop! +1`;

    }

    if (score < 0) score = 0;

    scoreDisplay.textContent = score;

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

  clearDrops();

  messageDisplay.textContent = `Time's up! Score: ${score}`;

}


function winGame() {

  gameRunning = false;

  clearInterval(dropMaker);
  clearInterval(timerInterval);

  messageDisplay.textContent = `You Win!`;

  clearDrops();

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

  const drops = document.querySelectorAll(".water-drop");

  drops.forEach(drop => drop.remove());

}


function launchConfetti() {

  for (let i = 0; i < 30; i++) {

    const confetti = document.createElement("div");

    confetti.classList.add("confetti");

    confetti.style.left = `${Math.random()*100}%`;

    const colors = ["#FFC907","#2E9DF7","#F5402C","#4FCB53","#FF902A"];

    confetti.style.backgroundColor =
      colors[Math.floor(Math.random()*colors.length)];

    gameContainer.appendChild(confetti);

    confetti.addEventListener("animationend", () => {
      confetti.remove();
    });

  }

}


function clearConfetti() {

  const pieces = document.querySelectorAll(".confetti");

  pieces.forEach(p => p.remove());

}