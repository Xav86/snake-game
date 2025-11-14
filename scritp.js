const table = document.querySelector(".table");
const pointsPlacar = document.querySelector("#points");

const rowSize = 15;
const columnSize = 15;
const boardSize = rowSize * columnSize;
const boardCenter = {
  row: Math.floor(rowSize / 2),
  column: Math.floor(columnSize / 2),
};

const inicialSnakeBodyPosition = [
  { row: boardCenter.row, column: boardCenter.column - 3 },
  { row: boardCenter.row, column: boardCenter.column - 4 },
];
const inicialBoardFoodPosition = {
  row: boardCenter.row,
  column: boardCenter.column + 3,
};

let snakeBodyPosition = inicialSnakeBodyPosition;
let boardFoodPosition = inicialBoardFoodPosition;

///////////////////////////////////////

const intervalRow = 15;
const tableSize = intervalRow * intervalRow;
const center = Math.floor(tableSize / 2);

const initialSnakePosition = center - 3;
const initialFoodPosition = center + 3;

let points = 0;
let snakePosition = [initialSnakePosition];
let foodPosition = initialFoodPosition;
let lastKeyDown = "downArrow";

let walkTimeOut;

const keyAction = {
  upArrow: -15,
  downArrow: +15,
  leftArrow: -1,
  rightArrow: +1,
};

const preventKey = {
  upArrow: "downArrow",
  downArrow: "upArrow",
  leftArrow: "rightArrow",
  rightArrow: "leftArrow",
};

const maxTableSize = tableSize - 1;
const rightWall = [];
const leftWall = [];

for (i = intervalRow - 1; i <= maxTableSize; i = i + intervalRow) {
  rightWall.push(i);
}
for (i = 0; i <= tableSize - intervalRow; i = i + intervalRow) {
  leftWall.push(i);
}

function firstPositionSnake() {
  return snakePosition[0];
}
function lastPositionSnake() {
  return snakePosition[snakePosition.length - 1];
}
function beforeLastPositionSnake() {
  return snakePosition[snakePosition.length - 2];
}

function verifyLimit(value) {
  if (lastPositionSnake() + value < 0) return true;
  if (lastPositionSnake() + value > maxTableSize) return true;
  if (
    leftWall.includes(lastPositionSnake()) &&
    rightWall.includes(lastPositionSnake() + value)
  )
    return true;
  if (
    rightWall.includes(lastPositionSnake()) &&
    leftWall.includes(lastPositionSnake() + value)
  )
    return true;
  return false;
}

function randomPosition() {
  const rowSelectPosition = Math.floor(Math.random() * rowSize);
  const columnSelectPosition = Math.floor(Math.random() * columnSize);

  if (snakeBodyPosition.length === boardSize) {
    alert(`Você venceu! pontuação maxima alcançada de: ${points}`);
    return restartGame();
  }

  for (const item of snakeBodyPosition) {
    if (
      item.row === rowSelectPosition &&
      item.column === columnSelectPosition
    ) {
      return randomPosition();
    }
  }

  if (
    boardFoodPosition.row === rowSelectPosition &&
    boardFoodPosition.column === columnSelectPosition
  )
    return randomPosition();

  return { row: rowSelectPosition, column: columnSelectPosition };
}

function createTable() {
  let grid = [];
  for (r = 0; r < 15; r++) {
    let row = [];

    for (c = 0; c < 15; c++) {
      row.push({ row: r, col: c });

      const columElement = document.createElement("div");
      columElement.classList.add(`r${r}c${c}`);
      columElement.textContent = `${r},${c}`;

      if ((c + r) % 2 === 0) columElement.classList.add("tapete");

      snakeBodyPosition.forEach((item) => {
        if (c === item.column && r === item.row)
          columElement.classList.add("snake");
      });

      if (c === boardFoodPosition.column && r === boardFoodPosition.row)
        columElement.classList.add("food");

      table.appendChild(columElement);
    }
    grid.push(row);
  }
}

function repositionFood() {
  const grids = document.querySelectorAll(".table > div");
  if (grids.length === 0) return;

  const newFoodPosition = randomPosition();

  console.log(newFoodPosition);

  grids.forEach((item) => {
    // item.classList.remove("food");
    if (
      item.classList.contains(
        `r${newFoodPosition.row}c${newFoodPosition.column}`
      )
    ) {
      item.classList.add("food");
      boardFoodPosition = {
        row: newFoodPosition.row,
        column: newFoodPosition.column,
      };
    }
  });

  pointsPlacar.textContent = "0";
  points++;
  pointsPlacar.textContent = points;
}

function verifyDeath(direction) {
  if (verifyLimit(keyAction[direction])) {
    alert(`Parece que você bateu em uma parede! você fez: ${points} pontos!`);
    restartGame();
    return true;
  }

  const snakeBody = [...snakePosition];
  if (snakePosition.length > 1) snakeBody.pop();

  if (
    snakeBody.includes(lastPositionSnake() + keyAction[direction]) &&
    snakePosition.length > 4
  ) {
    alert(`Parece que você bateu em si mesmo! você fez: ${points} pontos!`);
    restartGame();
    return true;
  }

  return false;
}

function notForBack(direction) {
  if (preventKey[direction] === lastKeyDown) return true;
  return false;
}

function snakeWalk(direction) {
  stopWalk();

  if (snakePosition.length !== 1) {
    if (notForBack(direction)) return;
  }
  if (verifyDeath(direction)) return;

  lastKeyDown = direction;

  snakePosition.push(lastPositionSnake() + keyAction[direction]);
  snakePosition.shift();

  const grids = document.querySelectorAll(".table > div");

  if (grids.length === 0) return;

  grids.forEach((item, i) => {
    item.classList.remove("snake");

    if (snakePosition.includes(i)) {
      item.classList.add("snake");
    }
  });

  if (lastPositionSnake() === foodPosition) {
    snakePosition.unshift(foodPosition);
    repositionFood();
  }

  walkTimeOut = setTimeout(() => {
    console.log(200 - points * 5);
    return snakeWalk(lastKeyDown);
  }, 200 - points * 0.5);
}

function handleKey(event) {
  switch (event.key) {
    case "ArrowUp":
      snakeWalk("upArrow");
      break;
    case "ArrowDown":
      snakeWalk("downArrow");
      break;
    case "ArrowLeft":
      snakeWalk("leftArrow");
      break;
    case "ArrowRight":
      snakeWalk("rightArrow");
      break;
  }
}

function readKey() {
  document.addEventListener("keydown", handleKey);
}

function stopReadKey() {
  document.removeEventListener("keydown", handleKey);
}

function stopWalk() {
  clearTimeout(walkTimeOut);
}

function restartGame() {
  table.innerHTML = "";
  pointsPlacar.textContent = "0";
  stopReadKey();

  stopWalk();

  points = 0;
  snakePosition = [initialSnakePosition];
  foodPosition = initialFoodPosition;

  startGame();
}

async function startGame() {
  createTable();
  // setInterval(() => repositionFood(), 50);
  // readKey();
}

startGame();
