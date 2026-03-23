// Game variables
let gameRunning = false;
let score = 0;
let timeLeft = 30;

let dropSpeed = 700;
let winScore = 10;

let dropMaker = null;
let timerInterval = null;

// Sounds
const popSound = document.getElementById("pop-sound");
const winSound = document.getElementById("win-sound");
const gameoverSound = document.getElementById("gameover-sound");
const bombSound = document.getElementById("bomb-sound");

// Elements
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const difficultySelect = document.getElementById("difficulty");
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
  // Start를 누를 때마다 항상 새 게임으로 시작
  clearInterval(dropMaker);
  clearInterval(timerInterval);
  clearDrops();
  clearConfetti();

  gameRunning = false;
  score = 0;
  scoreDisplay.textContent = score;

  const difficulty = difficultySelect.value;

  // Difficulty settings
  if (difficulty === "easy") {
    dropSpeed = 700;   // 비교적 느림
    winScore = 8;
    timeLeft = 30;
  } else if (difficulty === "normal") {
    dropSpeed = 450;   // 더 빠름
    winScore = 10;
    timeLeft = 20;
  } else {
    dropSpeed = 250;   // 가장 빠름
    winScore = 15;
    timeLeft = 10;
  }

  timeDisplay.textContent = timeLeft;
  messageDisplay.textContent = `Game started on ${difficulty}!`;

  gameRunning = true;

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

  // 난이도별로 떨어지는 애니메이션 속도도 다르게
  const difficulty = difficultySelect.value;

  if (difficulty === "easy") {
    drop.style.animationDuration = "3s";
  } else if (difficulty === "normal") {
    drop.style.animationDuration = "2.2s";
  } else {
    drop.style.animationDuration = "1.5s";
  }

  drop.addEventListener("click", () => {
    if (!gameRunning) return;

    popSound.currentTime = 0;
    popSound.play();

    if (isBad) {
      bombSound.currentTime = 0;
      bombSound.play();

      score--;
      messageDisplay.textContent = "Bad drop! -1";
    } else {
      popSound.currentTime = 0;
      popSound.play();

      score++;
      messageDisplay.textContent = "Good drop! +1";
    }

    if (score < 0) {
      score = 0;
    }

    scoreDisplay.textContent = score;

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

  gameoverSound.currentTime = 0;
  gameoverSound.play();

  clearDrops();

  messageDisplay.textContent = `Game Over! Score: ${score}`;
}

function winGame() {
  gameRunning = false;

  clearInterval(dropMaker);
  clearInterval(timerInterval);

  winSound.currentTime = 0;
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

  // 현재 선택된 난이도 기준으로 시간도 다시 보여주기
  const difficulty = difficultySelect.value;

  if (difficulty === "easy") {
    timeLeft = 30;
  } else if (difficulty === "normal") {
    timeLeft = 20;
  } else {
    timeLeft = 10;
  }

  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;

  messageDisplay.textContent = "Game reset.";

  clearDrops();
  clearConfetti();
}

function clearDrops() {
  document.querySelectorAll(".water-drop").forEach((drop) => drop.remove());
}

function launchConfetti() {
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    confetti.style.left = `${Math.random() * 100}%`;

    const colors = ["#FFC907", "#2E9DF7", "#F5402C", "#4FCB53"];
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];

    gameContainer.appendChild(confetti);

    confetti.addEventListener("animationend", () => {
      confetti.remove();
    });
  }
}

function clearConfetti() {
  document.querySelectorAll(".confetti").forEach((piece) => piece.remove());
}