const emptyCellHtml = "<div class='cel'></div>";
const snakeBodyHtml = "<div class='cel'><div class='snake'></div></div>";
const snakeHeadHtml =
  "<div class='cel'><div class='snake snake-head'></div></div>";
const appleHtml = "<div class='cel'><div class='apple'></div></div>";
const BOARD_SIZE = 10;

const cells = [];

let directionQueue = [];
let snake = [];
let apple = { col: 0, row: 0 };
let isPaused = false;
let applesNumber = 0;

function start() {
  buildBoard();
  startElements();
  renderBoard();
  handleEvents();

  intervalId = setInterval(() => {
    if (!isPaused) moveSnake();
  }, 500);
}

function resetGame() {
  document.getElementById("game-over").style.display = "none";
  document.getElementById("win").style.display = "none";
  document.getElementById("restart").style.display = "none";
  document.getElementById("game-container").style.opacity = "1";
  document.getElementById("game-container").style.pointerEvents = "all";
  startElements();
  renderBoard();

  applesNumber = 0;
  isPaused = false;
}

function stopGame() {
  isPaused = true;

  document.getElementById("restart").style.display = "flex";
  document.getElementById("game-container").style.opacity = "0.35";
  document.getElementById("game-container").style.pointerEvents = "none";
}

function gameOver() {
  document.getElementById("game-over").style.display = "flex";
  stopGame();
}

function youWin() {
  document.getElementById("win").style.display = "flex";
  stopGame();
}

function addAppleNumber() {
  applesNumber++;
  document.getElementById("header-apple-number").innerHTML = applesNumber;

  if (applesNumber === BOARD_SIZE * BOARD_SIZE) {
    youWin();
  }
}

function isEqual(object1, object2) {
  return object1.row === object2.row && object1.col === object2.col;
}

function toMove(futureCell) {
  if (snake.find((item) => isEqual(item, futureCell))) {
    gameOver();
  }

  snake.unshift(futureCell);

  if (!isEqual(futureCell, apple)) {
    snake.pop();
  } else {
    addAppleNumber();
    resetApple();
  }

  renderBoard();
}

function moveSnake() {
  console.log(directionQueue);
  if (directionQueue.length > 1) {
    directionQueue.shift();
  }

  if (directionQueue[0] === "up" && snake[0].col - 1 >= 0) {
    toMove({ col: snake[0].col - 1, row: snake[0].row });
  } else if (directionQueue[0] === "down" && snake[0].col + 1 < cells.length) {
    toMove({ col: snake[0].col + 1, row: snake[0].row });
  } else if (directionQueue[0] === "left" && snake[0].row - 1 >= 0) {
    toMove({ col: snake[0].col, row: snake[0].row - 1 });
  } else if (
    directionQueue[0] === "right" &&
    snake[0].row + 1 < cells[snake[0].col].length
  ) {
    toMove({ col: snake[0].col, row: snake[0].row + 1 });
  } else {
    gameOver();
  }
}

function handleEvents() {
  addEvent(
    document,
    "keyup",
    (e) => {
      e = e || window.event;

      if (
        e.key == "ArrowUp" &&
        directionQueue[directionQueue.length - 1] !== "down"
      ) {
        directionQueue.push("up");
      } else if (
        e.key == "ArrowDown" &&
        directionQueue[directionQueue.length - 1] !== "up"
      ) {
        directionQueue.push("down");
      } else if (
        e.key == "ArrowLeft" &&
        directionQueue[directionQueue.length - 1] !== "right"
      ) {
        directionQueue.push("left");
      } else if (
        e.key == "ArrowRight" &&
        directionQueue[directionQueue.length - 1] !== "left"
      ) {
        directionQueue.push("right");
      }
      e.preventDefault();
    },
    false
  );
}

function addEvent(element, eventName, callback) {
  if (element.addEventListener) {
    element.addEventListener(eventName, callback, false);
  } else if (element.attachEvent) {
    element.attachEvent("on" + eventName, callback);
  } else {
    element["on" + eventName] = callback;
  }
}

function sortRandomCell(multiplier, adder = 0) {
  const rowNumber =
    Math.floor(Math.random() * (multiplier != null ? multiplier : BOARD_SIZE)) +
    adder;
  const colNumber =
    Math.floor(Math.random() * (multiplier != null ? multiplier : BOARD_SIZE)) +
    adder;

  return { row: rowNumber, col: colNumber };
}

function resetApple() {
  const randomCellApple = sortRandomCell();
  apple.col = randomCellApple.col;
  apple.row = randomCellApple.row;

  return randomCellApple;
}

function startElements() {
  const randomCellApple = resetApple();
  let randomCellSnake = sortRandomCell(8, 1);

  snake = [
    {
      row: randomCellSnake.row,
      col: randomCellSnake.col,
    },
  ];

  if (randomCellSnake.col < BOARD_SIZE / 2) {
    directionQueue.push("down");
    snake.push({
      row: randomCellSnake.row,
      col: randomCellSnake.col - 1,
    });
  } else {
    directionQueue.push("up");
    snake.push({
      row: randomCellSnake.row,
      col: randomCellSnake.col + 1,
    });
  }

  while (
    isEqual(randomCellApple, snake[0]) ||
    isEqual(randomCellApple, snake[1])
  ) {
    randomCellApple = resetApple();
  }

  console.log("snake -> ", snake);
  console.log("apple -> ", apple);
}

function buildBoard() {
  for (let row = 0; row < BOARD_SIZE; row++) {
    const temp = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      temp.push(emptyCellHtml);
    }
    cells.push(temp);
  }
}

function renderBoard() {
  let html = "";

  const tempCells = cells.map((item) => ({ ...item }));

  tempCells[apple.col][apple.row] = appleHtml;

  tempCells[snake[0].col][snake[0].row] = snakeHeadHtml;

  for (let x = 1; x < snake.length; x++) {
    tempCells[snake[x].col][snake[x].row] = snakeBodyHtml;
  }

  for (let col = 0; col < BOARD_SIZE; col++) {
    html += "<div class='game-row'>";
    for (let row = 0; row < BOARD_SIZE; row++) {
      html += tempCells[col][row];
    }
    html += "</div>";
  }

  document.getElementById("game").innerHTML = html;
}

start();
