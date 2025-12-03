const board = document.querySelector(".board");
const startButton = document.querySelector(".startBtn");
const restartButton = document.querySelector(".restartBtn");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".startGame");
const gameOverModal = document.querySelector(".gameOver");

const highScoreElement = document.querySelector("#highScore");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let minutes = 0;
let seconds = 0;
let timeInterval = null;
let interval = null;

highScoreElement.textContent = highScore;

const block = 30;
const columns = Math.floor(board.clientWidth / block);
const rows = Math.floor(board.clientHeight / block);
const blocks = [];

for (let row = 0; row < rows; row++) {
    blocks[row] = [];
    for (let column = 0; column < columns; column++) {
        const div = document.createElement("div");
        div.classList.add("block");
        board.appendChild(div);
        blocks[row][column] = div;
    }
}

let snake = [random()];
let food = random();
function random() {
    return {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * columns)
    };
}
function drawSnake() {
    snake.forEach(position => {
        blocks[position.x][position.y].classList.add("snake");
    })
}
function drawFood() {
    blocks[food.x][food.y].classList.add("food");
}
function clearSnake() {
    snake.forEach(position => {
        blocks[position.x][position.y].classList.remove("snake");
    })
}
function clearFood() {
    blocks[food.x][food.y].classList.remove("food");
}

const directions = ["up", "down", "left", "right"];
let direction = directions[Math.floor(Math.random() * directions.length)];
addEventListener("keydown", (event) => {
    if(event.key == "ArrowUp") {
        direction = "up"
    }
    else if(event.key == "ArrowDown") {
        direction = "down"
    }
    else if(event.key == "ArrowRight") {
        direction = "right"
    }
    else if(event.key == "ArrowLeft") {
        direction = "left"
    }
});

function startTimer() {
    timeInterval = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }

        let min = minutes.toString().padStart(2, "0");
        let sec = seconds.toString().padStart(2, "0");

        timeElement.textContent = `${min} : ${sec}`;
    }, 1000);
}
function resetTimer() {
    clearInterval(timeInterval);
    minutes = 0;
    seconds = 0;
    timeElement.textContent = "00 : 00";
}

function snakeGame() {
    
    let head = null;
    if(direction === "left") {
        head = {x: snake[0].x, y: snake[0].y - 1}
    }
    else if(direction === "right") {
        head = {x: snake[0].x, y: snake[0].y + 1}
    }
    else if(direction === "up") {
        head = {x: snake[0].x - 1, y: snake[0].y}
    }
    else if(direction === "down") {
        head = {x: snake[0].x + 1, y: snake[0].y}
    }

    if(head.x < 0 || head.y < 0 || head.x >= rows || head.y >= columns) {
        return gameOver();
    }

    clearSnake();

    if((head.x == food.x) && (head.y == food.y)) {
        score+=10;
        scoreElement.textContent = score;

        if(score > highScore) {
            highScore = score
            localStorage.setItem("highScore",highScore);
            highScoreElement.textContent = highScore;
        }
        
        clearFood();
        food = random();
        snake.unshift(head);
    }
    else {
        snake.unshift(head);
        snake.pop();
    }
    drawSnake();
    drawFood();
}


startButton.addEventListener("click", () => {
    modal.style.display = "none";
    StartGame();
});

restartButton.addEventListener("click", () => {
    modal.style.display = "none";
    StartGame();
});

function StartGame() {
    clearInterval(interval);
    clearInterval(timeInterval);
    resetTimer();
    

    score = 0;
    scoreElement.textContent = "0";

    snake = [random()];
    food = random();

    clearBoard();
    drawSnake();
    drawFood();

    interval = setInterval(snakeGame, 400);
    startTimer();

}

function clearBoard() {
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            blocks[row][column].classList.remove("snake");
            blocks[row][column].classList.remove("food");
        }
    }
}

function gameOver() {
    clearInterval(interval);
    clearInterval(timeInterval);
    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
}



