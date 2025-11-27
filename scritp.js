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

let snakeBodyPosition = [...inicialSnakeBodyPosition];
let boardFoodPosition = inicialBoardFoodPosition;

let points = 0;
let lastKeyDown = "ArrowRight";

let gameLoop;

const keyAction = {
  ArrowUp: { row: -1, column: 0 },
  ArrowDown: { row: 1, column: 0 },
  ArrowLeft: { row: 0, column: -1 },
  ArrowRight: { row: 0, column: 1 },
};

const preventKey = {
  ArrowUp: "ArrowDown",
  ArrowDown: "ArrowUp",
  ArrowLeft: "ArrowRight",
  ArrowRight: "ArrowLeft",
};

function verifyLimit(value, direction) {
  if (direction === "ArrowUp" || direction === "ArrowDown") {
    if (
      snakeBodyPosition[0].row + value.row < 0 ||
      snakeBodyPosition[0].row + value.row > rowSize - 1
    )
      return true;
  } else {
    if (
      snakeBodyPosition[0].column + value.column < 0 ||
      snakeBodyPosition[0].column + value.column > columnSize - 1
    )
      return true;
  }
  return false;
}

function randomPosition() {
  const rowSelectPosition = Math.floor(Math.random() * rowSize);
  const columnSelectPosition = Math.floor(Math.random() * columnSize);

  if (snakeBodyPosition.length >= boardSize) {
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
  for (r = 0; r < rowSize; r++) {
    let row = [];

    for (c = 0; c < columnSize; c++) {
      row.push({ row: r, col: c });

      const columElement = document.createElement("div");
      columElement.classList.add(`r${r}c${c}`);
      // columElement.textContent = `${r},${c}`;

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

  grids.forEach((item) => {
    item.classList.remove("food");
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
  if (lastKeyDown === preventKey[direction]) return true;

  if (verifyLimit(keyAction[direction], direction)) {
    alert(`Parece que você bateu em uma parede! você fez: ${points} pontos!`);
    restartGame();
    return true;
  }

  const head = snakeBodyPosition[0];
  const nextRow = head.row + keyAction[direction].row;
  const nextColumn = head.column + keyAction[direction].column;

  const collision = snakeBodyPosition
    .slice(1)
    .some((item) => item.row === nextRow && item.column === nextColumn);

  if (collision) {
    alert(`Parece que você bateu em si mesmo! você fez: ${points} pontos!`);
    restartGame();
    return true;
  }

  return false;
}

function snakeWalk(direction) {
  clearInterval(gameLoop);

  if (snakeBodyPosition.length <= 0) return;
  if (verifyDeath(direction)) return;
  lastKeyDown = direction;

  if (direction === "ArrowUp" || direction === "ArrowDown")
    snakeBodyPosition.unshift({
      row: snakeBodyPosition[0]?.row + keyAction[direction].row,
      column: snakeBodyPosition[0].column,
    });
  else
    snakeBodyPosition.unshift({
      row: snakeBodyPosition[0].row,
      column: snakeBodyPosition[0]?.column + keyAction[direction].column,
    });

  snakeBodyPosition.pop();

  const grids = document.querySelectorAll(".table > div");

  if (grids.length === 0) return;

  grids.forEach((item) => {
    item.classList.remove("snake");

    const positionItem = {
      row: Number(item.classList[0].split("c")[0].replace("r", "")),
      column: Number(item.classList[0].split("r")[1].split("c")[1]),
    };

    snakeBodyPosition.forEach((snake) => {
      if (
        snake.row === positionItem.row &&
        snake.column === positionItem.column
      ) {
        item.classList.add("snake");
      }
    });
  });

  if (
    snakeBodyPosition[0].row === boardFoodPosition.row &&
    snakeBodyPosition[0].column === boardFoodPosition.column
  ) {
    snakeBodyPosition.push(boardFoodPosition);
    repositionFood();
  }

  gameLoop = setInterval(() => {
    snakeWalk(lastKeyDown);
  }, 200 - points * 0.5);
}

function handleKey(event) {
  switch (event.key) {
    case "ArrowUp":
      snakeWalk("ArrowUp");
      break;
    case "ArrowDown":
      snakeWalk("ArrowDown");
      break;
    case "ArrowLeft":
      snakeWalk("ArrowLeft");
      break;
    case "ArrowRight":
      snakeWalk("ArrowRight");
      break;
  }
}

function readKey() {
  document.addEventListener("keydown", handleKey);
}

function stopReadKey() {
  document.removeEventListener("keydown", handleKey);
}

function restartGame() {
  clearInterval(gameLoop);

  table.innerHTML = "";
  pointsPlacar.textContent = "0";
  stopReadKey();

  points = 0;
  snakeBodyPosition = [...inicialSnakeBodyPosition];
  boardFoodPosition = inicialBoardFoodPosition;
  lastKeyDown = "ArrowRight";

  startGame();
}

function startGame() {
  createTable();
  readKey();
}

startGame();
