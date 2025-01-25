let timeLeft;
let timerId = null;
let isWorkTime = true;
let pomodoroCount = 0;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const addTimeButton = document.getElementById('add-time');
const pomodoroCountDisplay = document.getElementById('pomodoro-count');
const progressBar = document.getElementById('progress-bar');
const breakOverlay = document.getElementById('break-overlay');
const quoteText = document.getElementById('quote-text');
const breakMinutes = document.getElementById('break-minutes');
const breakSeconds = document.getElementById('break-seconds');
const skipBreakButton = document.getElementById('skip-break');
const pandaGame = document.getElementById('panda-game');
const pandaModeButton = document.getElementById('panda-mode');
const closeGameButton = document.getElementById('close-game');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

// Simple productivity messages
const messages = [
    "Take a mindful break",
    "Breathe and recharge",
    "Rest is part of the process",
    "Small breaks, big results",
    "Pause and reflect"
];

// Game constants and state
const PADDLE_HEIGHT = 100;  // Bigger pandas
const PADDLE_WIDTH = 40;   // Wider pandas
const BALL_SIZE = 25;      // Bamboo size
const PADDLE_SPEED = 5;    // Computer panda speed
const INITIAL_BALL_SPEED = 7;
let gameLoop = null;
let gameState = {
    playerY: 0,
    computerY: 0,
    ballX: 0,
    ballY: 0,
    ballSpeedX: 0,
    ballSpeedY: 0,
    playerScore: 0,
    computerScore: 0
};

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    if (!isWorkTime) {
        breakMinutes.textContent = minutes.toString().padStart(2, '0');
        breakSeconds.textContent = seconds.toString().padStart(2, '0');
    }
    
    updateProgressBar();
}

function updateProgressBar() {
    progressBar.value = timeLeft;
}

function handleProgressBarChange() {
    timeLeft = Math.max(0, parseInt(progressBar.value));
    progressBar.value = timeLeft;
    updateDisplay();
    updateTitle();
}

function switchMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    progressBar.max = isWorkTime ? WORK_TIME : BREAK_TIME;
    progressBar.value = timeLeft;
    modeText.textContent = isWorkTime ? '💻 Work Time' : '☕ Break Time';
    
    if (!isWorkTime) {
        breakOverlay.classList.remove('hidden');
        setTimeout(() => breakOverlay.classList.add('visible'), 0);
        quoteText.textContent = messages[Math.floor(Math.random() * messages.length)];
        startTimer(); // Automatically start break timer
    } else {
        breakOverlay.classList.remove('visible');
        setTimeout(() => breakOverlay.classList.add('hidden'), 500);
    }
    
    updateDisplay();
    updateTitle();
}

function startTimer() {
    console.log('Timer started', { timeLeft, isWorkTime }); // Debug log
    
    if (timerId !== null) {
        console.log('Pausing timer'); // Debug log
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = '▶️ Start';
        progressBar.disabled = false;
        return;
    }

    console.log('Starting new timer'); // Debug log
    startButton.textContent = '⏸️ Pause';
    progressBar.disabled = true;
    
    timerId = setInterval(() => {
        console.log('Tick:', timeLeft); // Debug log
        if (timeLeft <= 0) {
            console.log('Timer finished'); // Debug log
            clearInterval(timerId);
            timerId = null;
            startButton.textContent = '▶️ Start';
            progressBar.disabled = false;
            
            if (isWorkTime) {
                pomodoroCount++;
                pomodoroCountDisplay.textContent = `🎯 Pomodoros: ${pomodoroCount}`;
            }
            
            alert(isWorkTime ? '🎉 Work time is over! Take a break!' : '💪 Break is over! Back to work!');
            switchMode();
            return;
        }
        timeLeft--;
        progressBar.value = timeLeft;
        updateDisplay();
        updateTitle();
    }, 1000);
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = WORK_TIME;
    progressBar.max = WORK_TIME;
    progressBar.value = timeLeft;
    progressBar.disabled = false;
    startButton.textContent = '▶️ Start';
    modeText.textContent = '💻 Work Time';
    updateDisplay();
    updateTitle();
}

function addFiveMinutes() {
    timeLeft += 5 * 60;
    progressBar.value = timeLeft;
    updateDisplay();
    updateTitle();
}

function updateTitle() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.title = `${timeString} - 🍅 Pomodoro`;
}

function skipBreak() {
    if (!isWorkTime) {
        clearInterval(timerId);
        timerId = null;
        switchMode();
    }
}

// Panda Game Functions
function initGame() {
    canvas.width = 600;
    canvas.height = 400;
    
    gameState = {
        playerY: canvas.height / 2 - PADDLE_HEIGHT / 2,
        computerY: canvas.height / 2 - PADDLE_HEIGHT / 2,
        ballX: canvas.width / 2,
        ballY: canvas.height / 2,
        ballSpeedX: INITIAL_BALL_SPEED,
        ballSpeedY: INITIAL_BALL_SPEED * 0.6,
        playerScore: 0,
        computerScore: 0
    };
}

function drawPanda(x, y, width, height) {
    // Panda body (white)
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, width, height);
    
    // Black patches
    ctx.fillStyle = 'black';
    
    // Ears
    const earSize = width * 0.6;
    ctx.beginPath();
    ctx.ellipse(x + width/2, y + earSize/2, earSize/2, earSize/2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes (black circles)
    const eyeSize = width * 0.3;
    ctx.beginPath();
    ctx.ellipse(x + width/2, y + height/3, eyeSize, eyeSize, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Nose
    ctx.fillStyle = 'black';
    const noseSize = width * 0.2;
    ctx.beginPath();
    ctx.ellipse(x + width/2, y + height/2, noseSize, noseSize, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Mouth
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + width/2, y + height/2, width * 0.3, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
}

function drawBamboo(x, y) {
    // Main bamboo stalk
    ctx.fillStyle = '#90EE90';  // Light green
    ctx.beginPath();
    ctx.arc(x, y, BALL_SIZE/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Bamboo segments
    ctx.strokeStyle = '#228B22';  // Forest green
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - BALL_SIZE/2, y);
    ctx.lineTo(x + BALL_SIZE/2, y);
    ctx.stroke();
    
    // Leaves
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.moveTo(x, y - BALL_SIZE/2);
    ctx.lineTo(x + BALL_SIZE/3, y - BALL_SIZE);
    ctx.lineTo(x - BALL_SIZE/3, y - BALL_SIZE);
    ctx.closePath();
    ctx.fill();
}

function updateGame() {
    // Move computer paddle with smoother AI
    const computerCenter = gameState.computerY + PADDLE_HEIGHT/2;
    const ballPrediction = gameState.ballY + gameState.ballSpeedY * 3;
    
    if (computerCenter < ballPrediction - 10) {
        gameState.computerY += PADDLE_SPEED;
    } else if (computerCenter > ballPrediction + 10) {
        gameState.computerY -= PADDLE_SPEED;
    }
    
    // Keep computer paddle in bounds
    gameState.computerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, gameState.computerY));
    
    // Update ball position
    gameState.ballX += gameState.ballSpeedX;
    gameState.ballY += gameState.ballSpeedY;
    
    // Ball collision with top and bottom
    if (gameState.ballY < BALL_SIZE || gameState.ballY > canvas.height - BALL_SIZE) {
        gameState.ballSpeedY = -gameState.ballSpeedY;
        playBounceSound();
    }
    
    // Ball collision with paddles
    if (gameState.ballX < PADDLE_WIDTH + BALL_SIZE) {
        if (gameState.ballY > gameState.playerY && 
            gameState.ballY < gameState.playerY + PADDLE_HEIGHT) {
            gameState.ballSpeedX = Math.abs(gameState.ballSpeedX) * 1.1; // Speed up slightly
            gameState.ballSpeedY += (gameState.ballY - (gameState.playerY + PADDLE_HEIGHT/2)) * 0.03;
            playBounceSound();
        }
    }
    
    if (gameState.ballX > canvas.width - PADDLE_WIDTH - BALL_SIZE) {
        if (gameState.ballY > gameState.computerY && 
            gameState.ballY < gameState.computerY + PADDLE_HEIGHT) {
            gameState.ballSpeedX = -Math.abs(gameState.ballSpeedX) * 1.1; // Speed up slightly
            gameState.ballSpeedY += (gameState.ballY - (gameState.computerY + PADDLE_HEIGHT/2)) * 0.03;
            playBounceSound();
        }
    }
    
    // Score points
    if (gameState.ballX < 0) {
        gameState.computerScore++;
        playScoreSound();
        resetBall();
    } else if (gameState.ballX > canvas.width) {
        gameState.playerScore++;
        playScoreSound();
        resetBall();
    }
}

function resetBall() {
    gameState.ballX = canvas.width / 2;
    gameState.ballY = canvas.height / 2;
    gameState.ballSpeedX = -gameState.ballSpeedX;
    gameState.ballSpeedY = Math.random() * 6 - 3;
}

function drawGame() {
    // Background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#e8f5e9');
    gradient.addColorStop(1, '#c8e6c9');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw bamboo forest background
    for (let i = 0; i < 5; i++) {
        ctx.fillStyle = '#a5d6a7';
        ctx.fillRect(
            canvas.width * i/5 + 50, 
            canvas.height - 100, 
            20, 
            100
        );
    }
    
    // Center line
    ctx.strokeStyle = '#81c784';
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Score
    ctx.fillStyle = '#2e7d32';
    ctx.font = 'bold 48px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(gameState.playerScore, canvas.width/4, 60);
    ctx.fillText(gameState.computerScore, 3*canvas.width/4, 60);
    
    // Draw pandas and bamboo
    drawPanda(0, gameState.playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    drawPanda(canvas.width - PADDLE_WIDTH, gameState.computerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    drawBamboo(gameState.ballX, gameState.ballY);
}

function runGameLoop() {
    updateGame();
    drawGame();
    gameLoop = requestAnimationFrame(runGameLoop);
}

function startPandaMode() {
    pandaGame.classList.remove('hidden');
    initGame();
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseY = e.clientY - rect.top;
        gameState.playerY = Math.min(
            Math.max(mouseY - PADDLE_HEIGHT/2, 0),
            canvas.height - PADDLE_HEIGHT
        );
    });
    
    gameLoop = requestAnimationFrame(runGameLoop);
}

function closePandaMode() {
    pandaGame.classList.add('hidden');
    if (gameLoop) {
        cancelAnimationFrame(gameLoop);
        gameLoop = null;
    }
}

// Add simple sound effects
function playBounceSound() {
    const audio = new Audio('data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ4AAACAgICAgICAgICAgICAgIA=');
    audio.play().catch(() => {});
}

function playScoreSound() {
    const audio = new Audio('data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ4AAACAgICAgICAgICAgICAgIA=');
    audio.play().catch(() => {});
}

// Initialize
timeLeft = WORK_TIME;
progressBar.max = WORK_TIME;
progressBar.value = timeLeft;
updateDisplay();
updateTitle();

console.log('Initial setup:', {
    timeLeft,
    progressBarMax: progressBar.max,
    progressBarValue: progressBar.value
});

// Event listeners
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
addTimeButton.addEventListener('click', addFiveMinutes);
progressBar.addEventListener('input', handleProgressBarChange);
pandaModeButton.addEventListener('click', startPandaMode);
closeGameButton.addEventListener('click', closePandaMode);
skipBreakButton.addEventListener('click', skipBreak); 