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
        startTimer();
    } else {
        breakOverlay.classList.remove('visible');
        setTimeout(() => breakOverlay.classList.add('hidden'), 500);
    }
    
    updateDisplay();
    updateTitle();
}

function startTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = '▶️ Start';
        progressBar.disabled = false;
        return;
    }

    if (timeLeft <= 0) {
        switchMode();
        return;
    }

    startButton.textContent = '⏸️ Pause';
    progressBar.disabled = true;
    timerId = setInterval(() => {
        if (timeLeft <= 0) {
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
    updateDisplay();
    updateTitle();
}

function updateTitle() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.title = `${timeString} - 🍅 Pomodoro`;
}

function updateProgressBar() {
    progressBar.value = timeLeft;
}

function handleProgressBarChange() {
    timeLeft = Math.max(0, parseInt(progressBar.value));
    updateDisplay();
    updateTitle();
}

function skipBreak() {
    if (!isWorkTime) {
        clearInterval(timerId);
        timerId = null;
        switchMode();
    }
}

// Initialize
timeLeft = WORK_TIME;
updateDisplay();
updateTitle();

// Event listeners
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
addTimeButton.addEventListener('click', addFiveMinutes);
progressBar.addEventListener('input', handleProgressBarChange);
skipBreakButton.addEventListener('click', skipBreak); 